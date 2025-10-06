# Autonomous Service Validation Engine - Technical Schema

## Database Schema Extensions

### Enhanced Service Schema
```typescript
interface AutonomousService extends Service {
  // Validation policies the service runs
  validationPolicies: ValidationPolicy[];
  
  // Business logic rules
  businessRules: ServiceRule[];
  
  // Inherited capabilities from other policies
  inheritedPolicies: { policyId: Id; version: number }[];
  
  // Service's decision-making configuration
  autonomy: {
    autoAccept: boolean;           // Can auto-accept valid requests
    autoReject: boolean;           // Can auto-reject invalid requests
    requireHumanApproval: boolean; // Escalate to owner for decisions
  };
  
  // AI integration
  aiAgent?: {
    type: 'pricing' | 'validation' | 'coordination';
    model: string;               // "GPT-Supply-Chain-Agent"
    authorityLevel: 'advisory' | 'limited' | 'autonomous';
    explainDecisions: boolean;
  };
}

interface ValidationPolicy {
  id: Id;
  name: string;                    // "acceptable_location", "delivery_day"
  ruleExpression: string;          // "Service('isLocationValid', $customer.location)"
  errorMessage: string;            // "Sorry, you don't live in our local area"
  required: boolean;               // Must pass for acceptance
  parameters?: Record<string, any>; // Configuration for validation
}
```

### Purchase Request Processing
```typescript
interface PurchaseRequest {
  id: Id;
  customerId: Id;
  serviceId: Id;
  forumId?: Id;                    // Context where request was made
  requestedAt: ISOTime;
  eleuScriptRule: string;          // "rule pay -> Service('Milkman', $1)"
  customerData: {
    location?: string;
    paymentMethod?: string;
    // ... other contextual data from customer profile
  };
  
  // Validation results
  validationResults: ValidationResult[];
  
  // Final decision
  decision: 'pending' | 'accepted' | 'rejected' | 'escalated';
  decisionReason?: string;
  decidedAt?: ISOTime;
  decidedBy?: 'service' | 'ai' | 'human' | Id; // User ID if human decision
  
  // If accepted, payment processing
  paymentIntentId?: string;
  paymentStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ValidationResult {
  policyId: Id;
  policyName: string;
  passed: boolean;
  result?: any;                    // Return value from validation service
  error?: string;                  // Error message if failed
  executedAt: ISOTime;
  executionTimeMs?: number;        // Performance monitoring
}
```

## Core Implementation Classes

### ServiceValidator (Main Engine)
```typescript
class AutonomousServiceValidator {
  async processPurchaseRequest(request: PurchaseRequest): Promise<PurchaseDecision> {
    const service = await this.getService(request.serviceId);
    const customer = await this.getUser(request.customerId);
    
    // Run all validation policies
    const results = await Promise.all(
      service.validationPolicies.map(policy => 
        this.executeValidationPolicy(policy, customer, request)
      )
    );
    
    // Determine acceptance based on service autonomy settings
    const allPassed = results.every(r => r.passed);
    
    if (allPassed && service.autonomy.autoAccept) {
      return this.acceptRequest(request, results);
    } else if (!allPassed && service.autonomy.autoReject) {
      return this.rejectRequest(request, results);
    } else {
      return this.escalateToHuman(request, results);
    }
  }
  
  private async executeValidationPolicy(
    policy: ValidationPolicy, 
    customer: User, 
    request: PurchaseRequest
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Parse and execute the EleuScript rule
      const result = await this.eleuScriptExecutor.execute(
        policy.ruleExpression,
        { 
          customer, 
          request, 
          current_day: new Date().getDay(),
          ...policy.parameters 
        }
      );
      
      return {
        policyId: policy.id,
        policyName: policy.name,
        passed: !!result,
        result,
        executedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (error) {
      return {
        policyId: policy.id,
        policyName: policy.name,
        passed: false,
        error: error.message,
        executedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }
  
  private async acceptRequest(
    request: PurchaseRequest, 
    results: ValidationResult[]
  ): Promise<PurchaseDecision> {
    // Process payment
    const paymentIntent = await this.createPaymentIntent(request);
    
    // Log acceptance event
    await this.logEvent({
      topic: { kind: 'service', id: request.serviceId },
      action: 'purchase_accepted',
      payload: { requestId: request.id, validationResults: results }
    });
    
    return {
      decision: 'accepted',
      validationResults: results,
      paymentIntentId: paymentIntent.id,
      message: this.generateAcceptanceMessage(request, results)
    };
  }
  
  private async rejectRequest(
    request: PurchaseRequest, 
    results: ValidationResult[]
  ): Promise<PurchaseDecision> {
    const failedPolicies = results.filter(r => !r.passed);
    
    // Log rejection event
    await this.logEvent({
      topic: { kind: 'service', id: request.serviceId },
      action: 'purchase_rejected',
      payload: { requestId: request.id, failedPolicies }
    });
    
    return {
      decision: 'rejected',
      validationResults: results,
      message: this.generateRejectionMessage(request, failedPolicies)
    };
  }
}
```

### Service Response Generator
```typescript
class ServiceResponseGenerator {
  generateResponse(decision: PurchaseDecision): string {
    if (decision.decision === 'accepted') {
      return decision.message || "Payment processed! Your order will be fulfilled shortly.";
    }
    
    if (decision.decision === 'rejected') {
      return decision.message || "Sorry, your request could not be processed at this time.";
    }
    
    return "Your request is being reviewed by our team.";
  }
  
  generateAcceptanceMessage(
    request: PurchaseRequest, 
    results: ValidationResult[]
  ): string {
    // Could be enhanced with service-specific messaging
    return "Payment processed! Your order will be fulfilled shortly.";
  }
  
  generateRejectionMessage(
    request: PurchaseRequest, 
    failedPolicies: ValidationResult[]
  ): string {
    // Use the first failed policy's error message
    const primaryFailure = failedPolicies[0];
    if (primaryFailure?.error) {
      return this.interpolateErrorMessage(primaryFailure.error, primaryFailure.result);
    }
    
    return "Sorry, your request doesn't meet our service requirements.";
  }
  
  private interpolateErrorMessage(template: string, data: any): string {
    // "Sorry, you don't live in our local area ({{distance}}km away, max {{maxDistance}}km)"
    // becomes: "Sorry, you don't live in our local area (15.2km away, max 10km)"
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data?.[key] || '');
  }
}
```

### Service Discovery Engine
```typescript
class ServiceDiscovery {
  async searchServices(
    query: string, 
    filters?: {
      location?: string;
      maxPrice?: number;
      serviceType?: ServiceType;
      availableNow?: boolean;
    }
  ): Promise<AutonomousService[]> {
    // Search across all public services and services accessible to user
    let services = await this.db.collection('services')
      .where('availability', '==', 'active')
      .get();
    
    // Apply text search
    services = services.filter(service => 
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    // Apply filters
    if (filters?.location) {
      services = await this.filterByLocation(services, filters.location);
    }
    
    if (filters?.maxPrice) {
      services = services.filter(service => 
        !service.price || service.price.amountCents <= filters.maxPrice * 100
      );
    }
    
    return services;
  }
  
  async getLocalServices(
    location: string, 
    radiusKm: number
  ): Promise<AutonomousService[]> {
    // This would integrate with location validation services
    // to find services that can serve the given location
    return this.searchServices('', { location });
  }
  
  async getServicesByCategory(category: string): Promise<AutonomousService[]> {
    return this.db.collection('services')
      .where('attributes.category', '==', category)
      .where('availability', '==', 'active')
      .get();
  }
}
```

## Integration with Existing Forum System

### Enhanced ForumChat Component
```typescript
// In ForumChat.tsx - Add purchase request handling
const handleEleuScriptRule = async (parsedRule: ParsedRule) => {
  if (parsedRule.ruleTarget === 'Service' && parsedRule.action === 'pay') {
    // This is a purchase request
    const purchaseRequest: PurchaseRequest = {
      id: generateId(),
      customerId: currentUser.id,
      serviceId: parsedRule.targetName,
      forumId: forum.id,
      requestedAt: new Date().toISOString(),
      eleuScriptRule: inputValue,
      customerData: {
        location: currentUser.location,
        // ... other user data
      },
      validationResults: [],
      decision: 'pending'
    };
    
    // Process the purchase request
    setProcessingPurchase(true);
    try {
      const decision = await ServiceValidator.processPurchaseRequest(purchaseRequest);
      const response = ServiceResponseGenerator.generateResponse(decision);
      
      // Add system message with the service's response
      addMessage({
        id: generateId(),
        forumId: forum.id,
        authorId: 'system',
        content: response,
        timestamp: new Date().toISOString(),
        type: 'service_response',
        metadata: { 
          decision: decision.decision,
          serviceId: purchaseRequest.serviceId 
        }
      });
      
    } catch (error) {
      addMessage({
        id: generateId(),
        forumId: forum.id,
        authorId: 'system',
        content: `Error processing purchase request: ${error.message}`,
        timestamp: new Date().toISOString(),
        type: 'error'
      });
    } finally {
      setProcessingPurchase(false);
    }
    
  } else {
    // Handle other rule types (existing sub-policy creation logic)
    await handlePolicyRule(parsedRule);
  }
};
```

## AI Integration Schema

### AI-Powered Service Validation
```typescript
interface AIServiceAgent {
  id: Id;
  serviceId: Id;
  agentType: 'pricing' | 'validation' | 'coordination' | 'customer_service';
  model: string;                   // "gpt-4o", "claude-3.5-sonnet"
  prompt: string;                  // System prompt for the AI
  authorityLevel: 'advisory' | 'limited' | 'autonomous';
  decisionLimits?: {
    maxTransactionAmount?: number;
    allowedActions?: string[];
    escalationTriggers?: string[];
  };
  explainDecisions: boolean;
  createdAt: ISOTime;
  lastUsed?: ISOTime;
}

interface AIDecision {
  id: Id;
  agentId: Id;
  requestId: Id;                   // PurchaseRequest or other request type
  decision: any;                   // AI's decision
  reasoning: string;               // AI's explanation
  confidence: number;              // 0-1 confidence score
  executionTimeMs: number;
  tokensUsed?: number;
  createdAt: ISOTime;
}
```

### AI Stakeholder in Forums
```typescript
interface AIStakeholder {
  id: Id;
  name: string;                    // "AI_TrafficAgent"
  type: 'coordination' | 'monitoring' | 'optimization' | 'enforcement';
  capabilities: string[];          // ["traffic_optimization", "emergency_response"]
  authorizedActions: string[];     // ["adjust_traffic_lights", "send_alerts"]
  humanOversight: {
    required: boolean;
    escalationThreshold?: number;  // When to escalate to humans
    approvalRequired?: string[];   // Actions requiring human approval
  };
  apiEndpoints?: {
    webhook: string;               // Where to send decisions
    auth: string;                  // Authentication method
  };
  createdAt: ISOTime;
}
```

## Event Schema Extensions

### New Event Types for Autonomous Services
```typescript
type ServiceEventAction = 
  | 'purchase_requested' 
  | 'purchase_accepted' 
  | 'purchase_rejected' 
  | 'validation_executed'
  | 'ai_decision_made'
  | 'human_override'
  | 'service_discovered'
  | 'policy_inherited';

interface ServiceEvent extends Event {
  topic: { kind: 'service'; id: Id };
  action: ServiceEventAction;
  payload: {
    requestId?: Id;
    customerId?: Id;
    decision?: string;
    validationResults?: ValidationResult[];
    aiDecision?: AIDecision;
    // ... other service-specific data
  };
}
```

## Database Collections Required

### New Collections for Autonomous Services
```typescript
// Enhanced services with autonomous capabilities
autonomous_services: AutonomousService[]

// Customer purchase attempts and validation results
purchase_requests: PurchaseRequest[]

// Reusable validation logic components
validation_policies: ValidationPolicy[]

// Service marketplace listings and discovery
service_marketplace: {
  serviceId: Id;
  categories: string[];
  tags: string[];
  searchableText: string;
  location?: GeoPoint;
  featured: boolean;
  promoted: boolean;
  lastUpdated: ISOTime;
}[]

// AI agent configurations and decisions
ai_service_agents: AIServiceAgent[]
ai_decisions: AIDecision[]

// Service performance metrics
service_metrics: {
  serviceId: Id;
  totalRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  lastCalculated: ISOTime;
}[]
```

### Firestore Security Rules Extensions
```javascript
// Add rules for autonomous service collections
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing rules...
    
    // Autonomous services - readable by all, writable by owners
    match /autonomous_services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Purchase requests - readable by customer and service owner
    match /purchase_requests/{requestId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.customerId ||
         request.auth.uid == getServiceOwner(resource.data.serviceId));
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.customerId;
      allow update: if request.auth != null &&
        request.auth.uid == getServiceOwner(resource.data.serviceId);
    }
    
    // Validation policies - readable by all, writable by creators
    match /validation_policies/{policyId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }
  }
}
```

## Implementation Phases

### Phase 1: Basic Autonomous Services
1. Create enhanced service schema in Firestore
2. Implement ServiceValidator class
3. Add purchase request handling to ForumChat
4. Create basic validation policies
5. Test with simple location-based services

### Phase 2: Service Discovery
1. Implement ServiceDiscovery class
2. Create service marketplace interface
3. Add search and filtering capabilities
4. Implement category-based discovery
5. Add service recommendation engine

### Phase 3: AI Integration
1. Create AI service agent framework
2. Implement AI-powered validation
3. Add explanation generation
4. Create confidence scoring system
5. Add human override mechanisms

### Phase 4: Advanced Features
1. Policy inheritance system
2. Cross-forum service sharing
3. Payment processing integration
4. Dispute resolution mechanisms
5. Performance monitoring and analytics

This schema provides the foundation for implementing autonomous services that can make independent business decisions while maintaining complete audit trails and human oversight capabilities.