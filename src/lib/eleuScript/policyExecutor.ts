// lib/eleuScript/policyExecutor.ts
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';

export interface ParsedRule {
  ruleName: string;
  ruleTarget: 'Policy' | 'Forum' | 'Service';
  targetName: string;
  parameters?: {
    stakeholders?: string[];
    permissions?: Record<string, string[]>;
    rules?: string[];
    conditions?: string[];
    amount?: number;
    currency?: string;
    [key: string]: any;
  };
  isValid: boolean;
  errors?: string[];
}

export interface SubPolicy {
  id: string;
  name: string;
  parent_policy_id: string;
  parent_forum_id: string;
  rules: string[];
  stakeholders: string[];
  created_by: string;
  created_at: any;
  status: 'active' | 'pending' | 'inactive';
  permissions?: Record<string, string[]>;
}

export interface ForumExpansion {
  new_stakeholders: string[];
  new_services: string[];
  new_policies: string[];
  expansion_triggered_by: string;
  expansion_timestamp: any;
}

export class PolicyExecutor {
  /**
   * Execute a parsed EleuScript rule
   */
  static async executeRule(
    rule: ParsedRule, 
    stakeholderId: string, 
    forumId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Validate stakeholder permissions
      const hasPermission = await this.validatePermissions(stakeholderId, rule.ruleTarget, forumId);
      if (!hasPermission) {
        return {
          success: false,
          message: `Insufficient permissions to create ${rule.ruleTarget.toLowerCase()}`
        };
      }

      switch (rule.ruleTarget) {
        case 'Policy':
          return await this.createSubPolicy(rule, stakeholderId, forumId);
        case 'Forum':
          return await this.createForum(rule, stakeholderId, forumId);
        case 'Service':
          return await this.activateService(rule, stakeholderId, forumId);
        default:
          return {
            success: false,
            message: `Unknown rule target: ${rule.ruleTarget}`
          };
      }
    } catch (error) {
      console.error('Rule execution failed:', error);
      return {
        success: false,
        message: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create a sub-policy and expand forum capabilities
   */
  private static async createSubPolicy(
    rule: ParsedRule, 
    stakeholderId: string, 
    forumId: string
  ): Promise<{ success: boolean; message: string; data?: SubPolicy }> {
    try {
      // Get current forum to find parent policy
      const forumDoc = await getDoc(doc(db, 'forums', forumId));
      if (!forumDoc.exists()) {
        throw new Error('Forum not found');
      }

      const forumData = forumDoc.data();
      const parentPolicyId = forumData.policyId;

      // Create sub-policy document
      const subPolicy: Omit<SubPolicy, 'id'> = {
        name: rule.targetName,
        parent_policy_id: parentPolicyId,
        parent_forum_id: forumId,
        rules: rule.parameters?.rules || [],
        stakeholders: rule.parameters?.stakeholders || [],
        created_by: stakeholderId,
        created_at: serverTimestamp(),
        status: 'active',
        permissions: rule.parameters?.permissions || {}
      };

      // Add to Firestore
      const subPolicyRef = await addDoc(collection(db, 'policies'), subPolicy);
      const createdSubPolicy = { ...subPolicy, id: subPolicyRef.id } as SubPolicy;

      // Expand forum capabilities
      await this.expandForumCapabilities(forumId, createdSubPolicy, stakeholderId);

      // Log policy creation event
      await this.logPolicyCreationEvent(forumId, createdSubPolicy, stakeholderId);

      return {
        success: true,
        message: `✅ Sub-policy "${rule.targetName}" created successfully`,
        data: createdSubPolicy
      };
    } catch (error) {
      throw new Error(`Sub-policy creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Expand forum capabilities with new policy
   */
  private static async expandForumCapabilities(
    forumId: string, 
    subPolicy: SubPolicy, 
    triggeredBy: string
  ): Promise<void> {
    try {
      const forumRef = doc(db, 'forums', forumId);
      const forumDoc = await getDoc(forumRef);
      
      if (!forumDoc.exists()) {
        throw new Error('Forum not found');
      }

      const currentData = forumDoc.data();

      // Prepare expansion data
      const expansion: ForumExpansion = {
        new_stakeholders: subPolicy.stakeholders,
        new_services: this.extractServicesFromPolicy(subPolicy),
        new_policies: [subPolicy.id],
        expansion_triggered_by: triggeredBy,
        expansion_timestamp: serverTimestamp()
      };

      // Update forum with expanded capabilities
      await updateDoc(forumRef, {
        // Add new stakeholders to existing participants
        'participants': arrayUnion(
          ...subPolicy.stakeholders.map(stakeholder => ({
            userId: stakeholder,
            role: 'stakeholder',
            addedViaPolicy: subPolicy.id,
            joinedAt: serverTimestamp()
          }))
        ),
        
        // Add sub-policy to connected policies
        'connectedPolicies': arrayUnion(subPolicy.id),
        
        // Update service status with new services
        'serviceStatus': arrayUnion(
          ...expansion.new_services.map(service => ({
            serviceName: service,
            status: 'available',
            addedViaPolicy: subPolicy.id,
            addedAt: serverTimestamp()
          }))
        ),
        
        // Track expansion history
        'expansionHistory': arrayUnion(expansion),
        
        // Mark as dynamically expanded
        'dynamicallyExpanded': true,
        'lastExpansion': serverTimestamp()
      });

      // Update permissions if specified
      if (subPolicy.permissions && Object.keys(subPolicy.permissions).length > 0) {
        await this.updateForumPermissions(forumId, subPolicy.permissions);
      }

    } catch (error) {
      throw new Error(`Forum expansion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract service names from policy rules
   */
  public static extractServicesFromPolicy(policy: SubPolicy): string[] {
    const services: string[] = [];
    
    // Parse rules to find Service() targets
    policy.rules.forEach(rule => {
      const serviceMatch = rule.match(/Service\("([^"]+)"/);
      if (serviceMatch && serviceMatch[1]) {
        services.push(serviceMatch[1]);
      }
    });

    return services;
  }

  /**
   * Update forum permissions for new stakeholders
   */
  private static async updateForumPermissions(
    forumId: string, 
    newPermissions: Record<string, string[]>
  ): Promise<void> {
    const forumRef = doc(db, 'forums', forumId);
    const forumDoc = await getDoc(forumRef);
    
    if (!forumDoc.exists()) return;

    const currentPermissions = forumDoc.data().permissions || {};
    const mergedPermissions = { ...currentPermissions, ...newPermissions };

    await updateDoc(forumRef, {
      permissions: mergedPermissions
    });
  }

  /**
   * Log policy creation event for audit trail
   */
  private static async logPolicyCreationEvent(
    forumId: string, 
    subPolicy: SubPolicy, 
    createdBy: string
  ): Promise<void> {
    const eventData = {
      type: 'sub_policy_created',
      forumId,
      policyId: subPolicy.id,
      policyName: subPolicy.name,
      createdBy,
      timestamp: serverTimestamp(),
      details: {
        stakeholders: subPolicy.stakeholders,
        rules: subPolicy.rules,
        parentPolicy: subPolicy.parent_policy_id
      }
    };

    await addDoc(collection(db, 'governance_events'), eventData);

    // Also add system message to forum chat
    await this.addSystemMessage(forumId, {
      type: 'policy_creation',
      message: `🏛️ Sub-policy "${subPolicy.name}" created by ${createdBy}`,
      details: {
        stakeholders: subPolicy.stakeholders,
        capabilities: this.extractServicesFromPolicy(subPolicy)
      },
      timestamp: serverTimestamp()
    });
  }

  /**
   * Add system message to forum chat
   */
  private static async addSystemMessage(forumId: string, messageData: any): Promise<void> {
    await addDoc(collection(db, 'forums', forumId, 'messages'), {
      senderId: 'system',
      senderName: 'EleuScript Execution Engine',
      content: messageData.message,
      timestamp: serverTimestamp(),
      type: 'system',
      metadata: messageData.details
    });
  }

  /**
   * Validate stakeholder permissions for rule execution
   */
  private static async validatePermissions(
    stakeholderId: string, 
    ruleTarget: string, 
    forumId: string
  ): Promise<boolean> {
    try {
      const forumDoc = await getDoc(doc(db, 'forums', forumId));
      if (!forumDoc.exists()) return false;

      const forumData = forumDoc.data();
      const userParticipant = forumData.participants?.find(
        (p: any) => p.userId === stakeholderId
      );

      if (!userParticipant) return false;

      const userPermissions = forumData.permissions?.[userParticipant.role] || [];
      
      // Check specific permissions based on rule target
      switch (ruleTarget) {
        case 'Policy':
          return userPermissions.includes('create_sub_policies') || 
                 userPermissions.includes('admin');
        case 'Forum':
          return userPermissions.includes('create_forums') || 
                 userPermissions.includes('admin');
        case 'Service':
          return userPermissions.includes('activate_services') || 
                 userPermissions.includes('admin');
        default:
          return false;
      }
    } catch (error) {
      console.error('Permission validation failed:', error);
      return false;
    }
  }

  /**
   * Create a new forum (for Forum() rules)
   */
  private static async createForum(
    rule: ParsedRule, 
    stakeholderId: string, 
    forumId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    // Implementation for Forum() rule execution
    // This would create a new forum linked to the current policy
    return {
      success: true,
      message: `🏛️ Forum "${rule.targetName}" creation initiated`
    };
  }

  /**
   * Activate a service (for Service() rules)
   */
  private static async activateService(
    rule: ParsedRule, 
    stakeholderId: string, 
    forumId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const forumRef = doc(db, 'forums', forumId);
      
      // Add service to forum's service status
      await updateDoc(forumRef, {
        'serviceStatus': arrayUnion({
          serviceName: rule.targetName,
          status: 'activated',
          activatedBy: stakeholderId,
          activatedAt: serverTimestamp(),
          parameters: rule.parameters
        })
      });

      await this.addSystemMessage(forumId, {
        type: 'service_activation',
        message: `⚡ Service "${rule.targetName}" activated`,
        details: rule.parameters
      });

      return {
        success: true,
        message: `⚡ Service "${rule.targetName}" activated successfully`
      };
    } catch (error) {
      throw new Error(`Service activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}