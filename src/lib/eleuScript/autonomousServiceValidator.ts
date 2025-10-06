// lib/eleuScript/autonomousServiceValidator.ts

import { serviceExecutor, ServiceExecutionResult } from '../services/serviceExecutor';
import { ExecutionContext } from '../services/serviceRegistry';

export interface ValidationPolicy {
  id: string;
  name: string;
  ruleExpression: string;
  errorMessage: string;
  required: boolean;
  parameters?: Record<string, any>;
}

export interface ValidationResult {
  policyId: string;
  policyName: string;
  passed: boolean;
  result?: any;
  error?: string;
  executionTime?: number;
}

export interface PurchaseRequest {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  forumId?: string;
  eleuScriptRule: string;
  amount?: number;
  currency?: string;
  parameters?: Record<string, any>;
  timestamp: Date;
}

export interface PurchaseDecision {
  requestId: string;
  decision: 'accepted' | 'rejected' | 'requires_approval' | 'error';
  validationResults: ValidationResult[];
  message: string;
  paymentIntentId?: string;
  estimatedDelivery?: string;
  totalAmount: number;
  executionTime: number;
}

export interface AutonomousService {
  id: string;
  name: string;
  type: 'product' | 'service' | 'digital' | 'ai' | 'api';
  price?: number;
  currency?: string;
  description?: string;
  validationPolicies: ValidationPolicy[];
  inheritedPolicies?: { policyId: string; version: string }[];
  autonomy: {
    autoAccept: boolean;
    autoReject: boolean;
    requireHumanApproval: boolean;
  };
  aiAgent?: {
    type: 'validation' | 'pricing' | 'customer_service';
    model: string;
    authorityLevel: 'advisory' | 'limited' | 'autonomous';
  };
  isActive: boolean;
  createdAt: Date;
  ownerId: string;
}

export class AutonomousServiceValidator {
  private validationHistory: ValidationResult[] = [];
  private decisionHistory: PurchaseDecision[] = [];

  async processPurchaseRequest(
    request: PurchaseRequest,
    service: AutonomousService,
    context: ExecutionContext
  ): Promise<PurchaseDecision> {
    const startTime = Date.now();
    const validationResults: ValidationResult[] = [];

    try {
      console.log(`Processing purchase request for service: ${service.name}`, request);

      for (const policy of service.validationPolicies) {
        const validationResult = await this.executeValidationPolicy(
          policy,
          request,
          context
        );
        validationResults.push(validationResult);
        this.validationHistory.push(validationResult);
      }

      const decision = this.makeAutonomousDecision(
        service,
        validationResults,
        request
      );

      const purchaseDecision: PurchaseDecision = {
        requestId: request.id,
        decision: decision.decision,
        validationResults,
        message: decision.message,
        paymentIntentId: decision.paymentIntentId || undefined,
        estimatedDelivery: decision.estimatedDelivery || undefined,
        totalAmount: request.amount || 0,
        executionTime: Date.now() - startTime
      };

      if (decision.decision === 'accepted' && request.amount) {
        const paymentResult = await this.processPayment(request, service, context);
        if (paymentResult.success && paymentResult.data?.paymentIntentId) {
          purchaseDecision.paymentIntentId = paymentResult.data.paymentIntentId;
          purchaseDecision.message = `${decision.message} Payment processed successfully.`;
        } else {
          purchaseDecision.decision = 'error';
          purchaseDecision.message = `Payment failed: ${paymentResult.message}`;
        }
      }

      this.decisionHistory.push(purchaseDecision);
      
      console.log(`Purchase decision made: ${purchaseDecision.decision}`, purchaseDecision);
      
      return purchaseDecision;

    } catch (error) {
      const errorDecision: PurchaseDecision = {
        requestId: request.id,
        decision: 'error',
        validationResults,
        message: `Validation system error: ${error instanceof Error ? error.message : String(error)}`,
        paymentIntentId: undefined,
        estimatedDelivery: undefined,
        totalAmount: 0,
        executionTime: Date.now() - startTime
      };

      this.decisionHistory.push(errorDecision);
      console.error('Purchase request processing failed:', error);
      
      return errorDecision;
    }
  }

  async executeValidationPolicy(
    policy: ValidationPolicy,
    request: PurchaseRequest,
    context: ExecutionContext
  ): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      const { serviceName, parameters } = this.parseValidationRule(
        policy.ruleExpression,
        request,
        policy.parameters
      );

      const serviceResult = await serviceExecutor.executeService(
        serviceName,
        parameters,
        context
      );

      const validationResult: ValidationResult = {
        policyId: policy.id,
        policyName: policy.name,
        passed: serviceResult.success,
        result: serviceResult.data || undefined,
        error: serviceResult.success ? undefined : (serviceResult.error || serviceResult.message),
        executionTime: Date.now() - startTime
      };

      console.log(`Validation policy executed: ${policy.name}`, validationResult);
      
      return validationResult;

    } catch (error) {
      const errorResult: ValidationResult = {
        policyId: policy.id,
        policyName: policy.name,
        passed: false,
        result: undefined,
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime
      };

      console.error(`Validation policy failed: ${policy.name}`, error);
      
      return errorResult;
    }
  }

  private makeAutonomousDecision(
    service: AutonomousService,
    validationResults: ValidationResult[],
    request: PurchaseRequest
  ): {
    decision: 'accepted' | 'rejected' | 'requires_approval' | 'error';
    message: string;
    paymentIntentId?: string;
    estimatedDelivery?: string;
  } {
    const requiredValidations = validationResults.filter(v => 
      service.validationPolicies.find(p => p.id === v.policyId)?.required
    );
    
    const allRequiredPassed = requiredValidations.every(v => v.passed);
    const anyFailed = validationResults.some(v => !v.passed);

    if (allRequiredPassed && !anyFailed) {
      if (service.autonomy.autoAccept) {
        return {
          decision: 'accepted',
          message: `Order confirmed for ${service.name}. Processing payment...`,
          paymentIntentId: undefined,
          estimatedDelivery: this.calculateEstimatedDelivery(service)
        };
      } else {
        return {
          decision: 'requires_approval',
          message: `Order for ${service.name} requires manual approval.`,
          paymentIntentId: undefined,
          estimatedDelivery: undefined
        };
      }
    } else if (anyFailed) {
      if (service.autonomy.autoReject) {
        const failedValidations = validationResults.filter(v => !v.passed);
        const errorMessages = failedValidations.map(v => 
          this.formatValidationError(v, service.validationPolicies)
        );
        
        return {
          decision: 'rejected',
          message: `Sorry, we can't fulfill your order: ${errorMessages.join(' ')}`,
          paymentIntentId: undefined,
          estimatedDelivery: undefined
        };
      } else {
        return {
          decision: 'requires_approval',
          message: `Order requires manual review due to validation issues.`,
          paymentIntentId: undefined,
          estimatedDelivery: undefined
        };
      }
    } else {
      return {
        decision: 'requires_approval',
        message: `Order requires manual approval.`,
        paymentIntentId: undefined,
        estimatedDelivery: undefined
      };
    }
  }

  private async processPayment(
    request: PurchaseRequest,
    service: AutonomousService,
    context: ExecutionContext
  ): Promise<ServiceExecutionResult> {
    const paymentParams = {
      customerId: request.customerId,
      businessId: service.ownerId,
      amount: request.amount || service.price || 0,
      currency: request.currency || service.currency || 'NZD',
      description: `Purchase: ${service.name}`,
      metadata: {
        serviceId: service.id,
        requestId: request.id,
        forumId: request.forumId || ''
      }
    };

    return await serviceExecutor.executeService('StripePayment', paymentParams, context);
  }

  private parseValidationRule(
    ruleExpression: string,
    request: PurchaseRequest,
    policyParams?: Record<string, any>
  ): { serviceName: string; parameters: any } {
    const serviceMatch = ruleExpression.match(/Service\(['"]([^'"]+)['"](?:,\s*(.+))?\)/);
    
    if (!serviceMatch) {
      throw new Error(`Invalid validation rule expression: ${ruleExpression}`);
    }

    const serviceName = serviceMatch[1];
    const paramString = serviceMatch[2];

    const parameters: any = {
      customerId: request.customerId,
      serviceId: request.serviceId,
      forumId: request.forumId || '',
      ...policyParams
    };

    if (paramString) {
      if (paramString.includes('$customer.location')) {
        parameters.customerLocation = { lat: -41.2865, lng: 174.7762 };
      }
      if (paramString.includes('$current_day')) {
        parameters.currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      }
      if (paramString.includes('max_distance')) {
        const distanceMatch = paramString.match(/max_distance[=:]\s*(\d+)/);
        if (distanceMatch) {
          parameters.maxDistance = parseInt(distanceMatch[1]);
        }
      }
    }

    return { serviceName, parameters };
  }

  private formatValidationError(
    validationResult: ValidationResult,
    policies: ValidationPolicy[]
  ): string {
    const policy = policies.find(p => p.id === validationResult.policyId);
    
    if (policy && policy.errorMessage) {
      let message = policy.errorMessage;
      if (validationResult.result) {
        Object.entries(validationResult.result).forEach(([key, value]) => {
          message = message.replace(`{{${key}}}`, String(value));
        });
      }
      return message;
    }
    
    return validationResult.error || `Validation failed: ${validationResult.policyName}`;
  }

  private calculateEstimatedDelivery(service: AutonomousService): string {
    const now = new Date();
    const estimatedMinutes = service.type === 'digital' ? 0 : 30;
    const deliveryTime = new Date(now.getTime() + estimatedMinutes * 60000);
    
    if (estimatedMinutes === 0) {
      return 'Immediate';
    }
    
    return deliveryTime.toLocaleTimeString('en-NZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getValidationHistory(limit: number = 50): ValidationResult[] {
    return this.validationHistory
      .slice(-limit)
      .sort((a, b) => (b.executionTime || 0) - (a.executionTime || 0));
  }

  getDecisionHistory(limit: number = 50): PurchaseDecision[] {
    return this.decisionHistory
      .slice(-limit)
      .sort((a, b) => b.executionTime - a.executionTime);
  }

  getValidationStats() {
    const total = this.validationHistory.length;
    const passed = this.validationHistory.filter(v => v.passed).length;
    const failed = total - passed;
    
    const decisions = this.decisionHistory;
    const accepted = decisions.filter(d => d.decision === 'accepted').length;
    const rejected = decisions.filter(d => d.decision === 'rejected').length;
    const requiresApproval = decisions.filter(d => d.decision === 'requires_approval').length;
    
    return {
      validations: { total, passed, failed },
      decisions: { 
        total: decisions.length, 
        accepted, 
        rejected, 
        requiresApproval 
      },
      successRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }

  clearHistory(): void {
    this.validationHistory = [];
    this.decisionHistory = [];
  }
}

export const autonomousServiceValidator = new AutonomousServiceValidator();