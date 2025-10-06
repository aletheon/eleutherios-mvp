// lib/services/serviceExecutor.ts

import { ServiceImplementation, ServiceResponse, ExecutionContext } from './serviceRegistry';

export interface ServiceExecutionResult {
  success: boolean;
  data?: any;
  message: string;
  error?: string;
  executionId: string;
  timestamp: Date;
  serviceName: string;
}

export interface BatchExecutionResult {
  results: ServiceExecutionResult[];
  successCount: number;
  failureCount: number;
  totalExecutionTime: number;
}

export class ServiceExecutor {
  private serviceRegistry: Map<string, ServiceImplementation> = new Map();
  private executionHistory: ServiceExecutionResult[] = [];

  constructor() {
    this.initializeBuiltInServices();
  }

  registerService(serviceName: string, implementation: ServiceImplementation): void {
    this.serviceRegistry.set(serviceName, implementation);
    console.log(`Service registered: ${serviceName}`);
  }

  getRegisteredServices(): string[] {
    return Array.from(this.serviceRegistry.keys());
  }

  isServiceRegistered(serviceName: string): boolean {
    return this.serviceRegistry.has(serviceName);
  }

  async executeService(
    serviceName: string,
    params: any,
    context: ExecutionContext = { source: 'api' }
  ): Promise<ServiceExecutionResult> {
    const executionId = this.generateExecutionId();

    try {
      const service = this.serviceRegistry.get(serviceName);
      if (!service) {
        const errorResult: ServiceExecutionResult = {
          success: false,
          message: `Service '${serviceName}' not found`,
          error: `Available services: ${this.getRegisteredServices().join(', ')}`,
          executionId,
          timestamp: new Date(),
          serviceName
        };
        
        this.executionHistory.push(errorResult);
        return errorResult;
      }

      console.log(`Executing service: ${serviceName}`, { params, context });
      const response: ServiceResponse = await service.executeRequest(params, context);

      const result: ServiceExecutionResult = {
        success: response.success,
        data: response.data || undefined,
        message: response.message,
        error: response.success ? undefined : (response.error || response.message),
        executionId,
        timestamp: new Date(),
        serviceName
      };

      this.executionHistory.push(result);
      
      console.log(`Service execution completed: ${serviceName}`, result);

      return result;

    } catch (error) {
      const errorResult: ServiceExecutionResult = {
        success: false,
        message: 'Service execution failed',
        error: error instanceof Error ? error.message : String(error),
        executionId,
        timestamp: new Date(),
        serviceName
      };

      this.executionHistory.push(errorResult);
      console.error(`Service execution error: ${serviceName}`, error);
      
      return errorResult;
    }
  }

  async batchExecuteServices(
    requests: Array<{ serviceName: string; params: any }>,
    context: ExecutionContext = { source: 'api' }
  ): Promise<BatchExecutionResult> {
    const startTime = Date.now();
    const results: ServiceExecutionResult[] = [];

    for (const request of requests) {
      const result = await this.executeService(request.serviceName, request.params, context);
      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    const totalExecutionTime = Date.now() - startTime;

    return {
      results,
      successCount,
      failureCount,
      totalExecutionTime
    };
  }

  async testService(serviceName: string): Promise<ServiceExecutionResult> {
    const testParams = this.getTestParameters(serviceName);
    
    return await this.executeService(serviceName, testParams, {
      source: 'system',
      metadata: { test: true }
    });
  }

  getExecutionHistory(limit: number = 50): ServiceExecutionResult[] {
    return this.executionHistory
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getServiceStats(serviceName?: string) {
    const relevantHistory = serviceName 
      ? this.executionHistory.filter(h => h.serviceName === serviceName)
      : this.executionHistory;

    const totalExecutions = relevantHistory.length;
    const successfulExecutions = relevantHistory.filter(h => h.success).length;
    const failedExecutions = totalExecutions - successfulExecutions;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  clearHistory(): void {
    this.executionHistory = [];
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTestParameters(serviceName: string): any {
    const testParams: Record<string, any> = {
      'StripePayment': {
        customerId: 'test_customer',
        businessId: 'test_business',
        amount: 1.00,
        currency: 'NZD'
      },
      'LocationValidator': {
        customerLocation: { lat: -41.2865, lng: 174.7762 },
        serviceLocation: { lat: -41.2865, lng: 174.7762 },
        maxDistance: 10
      },
      'InventoryCheck': {
        productId: 'test_product',
        quantity: 1
      }
    };

    return testParams[serviceName] || {};
  }

  private initializeBuiltInServices(): void {
    console.log('ServiceExecutor initialized');
  }
}

export const serviceExecutor = new ServiceExecutor();