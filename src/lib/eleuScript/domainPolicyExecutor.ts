// lib/eleuScript/domainPolicyExecutor.ts

import { PolicyExecutor, ParsedRule } from './policyExecutor';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface DomainContext {
  userId: string;
  userName: string;
  domain: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  location?: string;
  preferences?: Record<string, any>;
  capabilities?: string[];
}

export interface DomainPolicy {
  id: string;
  domain: string;
  policyType: string;
  forumId: string;
  stakeholders: string[];
  services: string[];
  status: 'active' | 'completed' | 'cancelled';
  metadata: Record<string, any>;
}

export interface PolicyExecutionResult {
  success: boolean;
  message: string;
  policyId?: string;
  forumId?: string;
  services?: string[];
  stakeholders?: string[];
  error?: string;
}

export interface DomainServiceStatusProps {
  forumId: string;
  activeDomains?: string[];
}

// Domain service status utility functions
const detectServiceDomain = (serviceName: string): string => {
  const domainMap: Record<string, string> = {
    healthcare: '🏥',
    housing: '🏠', 
    food: '🍽️',
    education: '🎓',
    utilities: '⚡',
    transport: '🚌',
  };

  const serviceLower = serviceName.toLowerCase();
  for (const [domain, icon] of Object.entries(domainMap)) {
    if (serviceLower.includes(domain)) {
      return icon;
    }
  }
  return '⚙️';
};

const getDomainIcon = (domain: string): string => {
  const iconMap: Record<string, string> = {
    healthcare: '🏥',
    housing: '🏠',
    food: '🍽️', 
    education: '🎓',
    utilities: '⚡',
    transport: '🚌',
    general: '⚙️'
  };
  
  return iconMap[domain] || '⚙️';
};

const getServiceIcon = (serviceName: string): string => {
  const serviceIcons: Record<string, string> = {
    'GPBooking': '📅',
    'Consultation': '👩‍⚕️', 
    'Prescription': '💊',
    'Specialist': '🩺',
    'Payment': '💳'
  };
  
  return serviceIcons[serviceName] || detectServiceDomain(serviceName);
};

export class DomainPolicyExecutor {
  constructor() {
    console.log('DomainPolicyExecutor initialized');
  }

  async executeDomainPolicy(
    rule: ParsedRule,
    context: DomainContext
  ): Promise<PolicyExecutionResult> {
    try {
      console.log('Executing domain policy:', rule, context);

      // Use existing PolicyExecutor for basic policy execution
      const result = await PolicyExecutor.executeRule(
        rule,
        context.userId,
        context.domain
      );

      // Enhance with domain-specific logic
      const domainResult = await this.processDomainSpecificLogic(rule, context);

      // Handle the fact that PolicyExecutor.executeRule returns { success, message, data? }
      // but we need policyId and forumId
      const generatedPolicyId = `${context.domain}_${Date.now()}`;
      
      return {
        success: true,
        message: result.message || 'Domain policy executed successfully',
        policyId: generatedPolicyId, // Generate our own policyId
        forumId: context.domain, // Use domain as forumId
        services: domainResult.services,
        stakeholders: domainResult.stakeholders
      };

    } catch (error) {
      console.error('Domain policy execution failed:', error);
      return {
        success: false,
        message: 'Domain policy execution failed',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async processDomainSpecificLogic(
    rule: ParsedRule,
    context: DomainContext
  ): Promise<{
    services: string[];
    stakeholders: string[];
  }> {
    const services: string[] = [];
    const stakeholders: string[] = [];

    // Domain-specific service activation
    switch (context.domain) {
      case 'healthcare':
        services.push('GPBooking', 'Consultation', 'Prescription');
        stakeholders.push('Patient', 'GP', 'Nurse');
        break;
      case 'housing':
        services.push('HousingSearch', 'TenancyAgreement', 'PropertyInspection');
        stakeholders.push('Tenant', 'PropertyManager', 'HousingOfficer');
        break;
      case 'food':
        services.push('FoodBankRegistration', 'FoodGrant', 'NutritionSupport');
        stakeholders.push('Client', 'FoodCoordinator', 'NutritionalAdvisor');
        break;
      default:
        services.push('GeneralSupport');
        stakeholders.push('Client', 'CaseWorker');
    }

    // Save domain policy
    const policyId = `${context.domain}_${Date.now()}`;
    await this.saveDomainPolicy({
      id: policyId,
      domain: context.domain,
      policyType: rule.ruleTarget || 'general',
      forumId: context.domain,
      stakeholders,
      services,
      status: 'active',
      metadata: {
        userId: context.userId,
        urgencyLevel: context.urgencyLevel,
        location: context.location,
        timestamp: new Date().toISOString()
      }
    });

    return { services, stakeholders };
  }

  private async saveDomainPolicy(policy: DomainPolicy): Promise<void> {
    try {
      await addDoc(collection(db, 'domain_policies'), {
        ...policy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Domain policy saved:', policy.id);
    } catch (error) {
      console.error('Failed to save domain policy:', error);
    }
  }

  async updatePolicyStatus(
    policyId: string, 
    status: 'active' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const policyRef = doc(db, 'domain_policies', policyId);
      await updateDoc(policyRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log(`Policy ${policyId} status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update policy status:', error);
    }
  }

  // Helper functions for domain service status
  static getServiceIcon = getServiceIcon;
  static getDomainIcon = getDomainIcon;
  static detectServiceDomain = detectServiceDomain;
}

export const domainPolicyExecutor = new DomainPolicyExecutor();