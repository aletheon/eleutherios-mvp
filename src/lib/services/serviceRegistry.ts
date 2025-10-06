// lib/services/serviceRegistry.ts

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AuthConfig {
  type: 'none' | 'api_key' | 'bearer_token' | 'basic' | 'oauth';
  credentials?: {
    apiKey?: string;
    token?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
  };
}

export interface ServiceParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface ExecutionContext {
  userId?: string;
  forumId?: string;
  requestId?: string;
  source: 'chat' | 'policy' | 'api' | 'system';
  metadata?: Record<string, any>;
}

export interface ServiceImplementation {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'iot' | 'internal' | 'ai' | 'external';
  version: string;
  description?: string;
  endpoint?: string;
  authentication: AuthConfig;
  parameters: ServiceParameter[];
  responseSchema?: any;
  isActive: boolean;
  timeout?: number;
  retryConfig?: {
    maxRetries: number;
    backoffMs: number;
  };
  
  executeRequest(params: any, context?: ExecutionContext): Promise<ServiceResponse>;
}

export interface ServiceRegistration {
  serviceName: string;
  serviceType: 'internal' | 'external' | 'partner';
  endpoint: string;
  authRequired: boolean;
  parameters: ServiceParameter[];
  responseFormat: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseService implements ServiceImplementation {
  abstract id: string;
  abstract name: string;
  abstract type: 'api' | 'webhook' | 'iot' | 'internal' | 'ai' | 'external';
  abstract version: string;
  abstract parameters: ServiceParameter[];
  
  description?: string;
  endpoint?: string;
  authentication: AuthConfig = { type: 'none' };
  responseSchema?: any;
  isActive: boolean = true;
  timeout: number = 30000;
  retryConfig = {
    maxRetries: 3,
    backoffMs: 1000
  };

  abstract executeRequest(params: any, context?: ExecutionContext): Promise<ServiceResponse>;

  protected validateParameters(params: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const param of this.parameters) {
      if (param.required && (params[param.name] === undefined || params[param.name] === null)) {
        errors.push(`Required parameter '${param.name}' is missing`);
        continue;
      }
      
      if (params[param.name] !== undefined) {
        const value = params[param.name];
        
        switch (param.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`Parameter '${param.name}' must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`Parameter '${param.name}' must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`Parameter '${param.name}' must be a boolean`);
            }
            break;
          case 'object':
            if (typeof value !== 'object' || value === null) {
              errors.push(`Parameter '${param.name}' must be an object`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`Parameter '${param.name}' must be an array`);
            }
            break;
        }
        
        if (param.validation) {
          if (param.validation.min !== undefined && value < param.validation.min) {
            errors.push(`Parameter '${param.name}' must be at least ${param.validation.min}`);
          }
          if (param.validation.max !== undefined && value > param.validation.max) {
            errors.push(`Parameter '${param.name}' must be at most ${param.validation.max}`);
          }
          if (param.validation.pattern && typeof value === 'string') {
            const regex = new RegExp(param.validation.pattern);
            if (!regex.test(value)) {
              errors.push(`Parameter '${param.name}' does not match required pattern`);
            }
          }
          if (param.validation.enum && !param.validation.enum.includes(value)) {
            errors.push(`Parameter '${param.name}' must be one of: ${param.validation.enum.join(', ')}`);
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  protected createSuccessResponse(data?: any, message: string = 'Success'): ServiceResponse {
    return {
      success: true,
      data,
      message,
      metadata: {
        service: this.name,
        version: this.version,
        timestamp: new Date().toISOString()
      }
    };
  }

  protected createErrorResponse(message: string, error?: string): ServiceResponse {
    return {
      success: false,
      message,
      error: error || message,
      metadata: {
        service: this.name,
        version: this.version,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export class ServiceRegistry {
  private services: Map<string, ServiceImplementation> = new Map();
  private registrations: ServiceRegistration[] = [];

  register(service: ServiceImplementation): void {
    this.services.set(service.name, service);
    
    this.registrations.push({
      serviceName: service.name,
      serviceType: 'internal',
      endpoint: service.endpoint || '',
      authRequired: service.authentication.type !== 'none',
      parameters: service.parameters,
      responseFormat: service.responseSchema,
      isActive: service.isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`Service registered: ${service.name} (${service.type})`);
  }

  get(serviceName: string): ServiceImplementation | undefined {
    return this.services.get(serviceName);
  }

  list(): ServiceImplementation[] {
    return Array.from(this.services.values());
  }

  listActive(): ServiceImplementation[] {
    return this.list().filter(s => s.isActive);
  }

  getRegistrations(): ServiceRegistration[] {
    return [...this.registrations];
  }

  unregister(serviceName: string): boolean {
    const removed = this.services.delete(serviceName);
    if (removed) {
      this.registrations = this.registrations.filter(r => r.serviceName !== serviceName);
      console.log(`Service unregistered: ${serviceName}`);
    }
    return removed;
  }

  clear(): void {
    this.services.clear();
    this.registrations = [];
    console.log('Service registry cleared');
  }
}

export const serviceRegistry = new ServiceRegistry();