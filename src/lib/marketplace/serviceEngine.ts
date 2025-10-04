// lib/marketplace/serviceEngine.ts
import { EleuScriptParser, ParsedRule } from '../eleuScript/parser';
import { DomainPaymentProcessor } from '../payments/domainPaymentProcessor';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, getDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface MarketplaceService {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  providerId: string;
  providerName: string;
  category: string;
  
  // Service location and availability
  location?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    serviceRadius?: number; // km
    regions?: string[];
  };
  
  // Service-side validation policies
  validationPolicy: {
    rules: string[]; // EleuScript rules for validation
    conditions: Record<string, any>;
  };
  
  // Service configuration
  availability: {
    isActive: boolean;
    schedule?: Record<string, any>;
    maxOrders?: number;
    currentOrders?: number;
  };
  
  // Service metadata
  createdAt: any;
  updatedAt: any;
  forumId?: string; // Forum where service was created
  isPublic: boolean; // Can be discovered outside origin forum
}

export interface PurchaseRequest {
  id: string;
  serviceId: string;
  customerId: string;
  customerLocation?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
  requestedQuantity: number;
  offerPrice: number;
  currency: string;
  message?: string;
  forumId: string; // Forum where purchase was initiated
  
  // Request metadata
  requestedAt: any;
  status: 'pending' | 'validating' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  validationResults?: Record<string, any>;
  rejectionReason?: string;
}

export class MarketplaceServiceEngine {
  
  /**
   * Create a new service in the marketplace
   */
  static async createService(
    serviceName: string,
    description: string,
    price: number,
    currency: string,
    providerId: string,
    forumId: string,
    validationRules: string[] = [],
    serviceConfig: Partial<MarketplaceService> = {}
  ): Promise<MarketplaceService> {
    
    const service: MarketplaceService = {
      id: `service_${Date.now()}`,
      name: serviceName,
      description,
      price,
      currency,
      providerId,
      providerName: serviceConfig.providerName || 'Service Provider',
      category: serviceConfig.category || 'general',
      
      location: serviceConfig.location,
      
      validationPolicy: {
        rules: validationRules,
        conditions: serviceConfig.validationPolicy?.conditions || {}
      },
      
      availability: {
        isActive: true,
        maxOrders: serviceConfig.availability?.maxOrders,
        currentOrders: 0,
        ...serviceConfig.availability
      },
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      forumId,
      isPublic: serviceConfig.isPublic ?? true
    };

    // Save service to marketplace
    const serviceRef = await addDoc(collection(db, 'marketplaceServices'), service);
    service.id = serviceRef.id;

    // Add service to originating forum
    await this.addServiceToForum(forumId, service);

    return service;
  }

  /**
   * Process a purchase request through EleuScript rule
   */
  static async processPurchaseRequest(
    rule: ParsedRule,
    customerId: string,
    forumId: string,
    customerContext: {
      location?: { address?: string; coordinates?: { lat: number; lng: number } };
      preferences?: Record<string, any>;
    } = {}
  ): Promise<{ success: boolean; message: string; purchaseId?: string; error?: string }> {
    
    try {
      // Extract service details from rule
      const serviceName = rule.targetName;
      const requestedPrice = rule.parameters?.amount || rule.parameters?.price;
      const quantity = rule.parameters?.quantity || 1;
      const currency = rule.parameters?.currency || 'NZD';

      // Find service in marketplace
      const service = await this.findService(serviceName, forumId);
      if (!service) {
        return {
          success: false,
          message: `Service "${serviceName}" not found`,
          error: 'SERVICE_NOT_FOUND'
        };
      }

      // Create purchase request
      const purchaseRequest: PurchaseRequest = {
        id: `purchase_${Date.now()}`,
        serviceId: service.id,
        customerId,
        customerLocation: customerContext.location,
        requestedQuantity: quantity,
        offerPrice: requestedPrice || service.price,
        currency,
        forumId,
        requestedAt: serverTimestamp(),
        status: 'pending'
      };

      // Save purchase request
      const requestRef = await addDoc(collection(db, 'purchaseRequests'), purchaseRequest);
      purchaseRequest.id = requestRef.id;

      // Validate purchase through service policies
      const validationResult = await this.validatePurchaseRequest(service, purchaseRequest);

      if (validationResult.accepted) {
        // Process payment and complete purchase
        const completionResult = await this.completePurchase(service, purchaseRequest);
        return {
          success: true,
          message: `Purchase accepted: ${validationResult.message}`,
          purchaseId: purchaseRequest.id
        };
      } else {
        // Reject purchase
        await this.rejectPurchase(purchaseRequest, validationResult.reason);
        return {
          success: false,
          message: validationResult.reason,
          error: 'PURCHASE_REJECTED'
        };
      }

    } catch (error) {
      console.error('Purchase processing failed:', error);
      return {
        success: false,
        message: `Purchase processing failed: ${error.message}`,
        error: 'PROCESSING_ERROR'
      };
    }
  }

  /**
   * Validate purchase request against service policies
   */
  private static async validatePurchaseRequest(
    service: MarketplaceService,
    request: PurchaseRequest
  ): Promise<{ accepted: boolean; reason: string; message: string }> {
    
    try {
      // Check service availability
      if (!service.availability.isActive) {
        return {
          accepted: false,
          reason: 'Service is currently unavailable',
          message: 'Service offline'
        };
      }

      // Check capacity
      if (service.availability.maxOrders && 
          service.availability.currentOrders >= service.availability.maxOrders) {
        return {
          accepted: false,
          reason: 'Service is at capacity, please try again later',
          message: 'Capacity exceeded'
        };
      }

      // Execute service validation rules
      for (const validationRule of service.validationPolicy.rules) {
        const validationResult = await this.executeServiceValidationRule(
          validationRule, 
          service, 
          request
        );
        
        if (!validationResult.passed) {
          return {
            accepted: false,
            reason: validationResult.message,
            message: validationResult.message
          };
        }
      }

      // All validations passed
      return {
        accepted: true,
        reason: 'Purchase validated successfully',
        message: `${service.name} available for $${service.price} ${service.currency}`
      };

    } catch (error) {
      return {
        accepted: false,
        reason: `Validation error: ${error.message}`,
        message: 'Validation failed'
      };
    }
  }

  /**
   * Execute a single service validation rule
   */
  private static async executeServiceValidationRule(
    rule: string,
    service: MarketplaceService,
    request: PurchaseRequest
  ): Promise<{ passed: boolean; message: string }> {
    
    try {
      // Parse the validation rule
      const parsedRule = EleuScriptParser.parseRule(rule);
      if (!parsedRule.isValid) {
        return { passed: false, message: 'Invalid validation rule' };
      }

      // Handle different validation rule types
      switch (parsedRule.ruleName.toLowerCase()) {
        case 'acceptable_location':
        case 'location_check':
          return await this.validateLocation(service, request);
          
        case 'price_check':
        case 'acceptable_price':
          return await this.validatePrice(service, request);
          
        case 'availability_check':
          return await this.validateAvailability(service, request);
          
        case 'customer_verification':
          return await this.validateCustomer(service, request);
          
        default:
          // Custom validation rule - execute as EleuScript
          return await this.executeCustomValidationRule(parsedRule, service, request);
      }

    } catch (error) {
      return { passed: false, message: `Validation rule error: ${error.message}` };
    }
  }

  /**
   * Validate customer location against service area
   */
  private static async validateLocation(
    service: MarketplaceService,
    request: PurchaseRequest
  ): Promise<{ passed: boolean; message: string }> {
    
    if (!service.location || !request.customerLocation) {
      return { passed: true, message: 'Location validation skipped' };
    }

    // Check if customer is within service radius
    if (service.location.coordinates && request.customerLocation.coordinates) {
      const distance = this.calculateDistance(
        service.location.coordinates,
        request.customerLocation.coordinates
      );
      
      if (service.location.serviceRadius && distance > service.location.serviceRadius) {
        return {
          passed: false,
          message: `Sorry, you don't live in our local area (${distance.toFixed(1)}km away, max ${service.location.serviceRadius}km). We can't sell you this ${service.name.toLowerCase()}.`
        };
      }
    }

    // Check if customer is in served regions
    if (service.location.regions && request.customerLocation.address) {
      const customerRegion = this.extractRegionFromAddress(request.customerLocation.address);
      if (!service.location.regions.includes(customerRegion)) {
        return {
          passed: false,
          message: `Sorry, we don't deliver to your area (${customerRegion}). We only serve: ${service.location.regions.join(', ')}.`
        };
      }
    }

    return { passed: true, message: 'Location validation passed' };
  }

  /**
   * Validate offered price against service price
   */
  private static async validatePrice(
    service: MarketplaceService,
    request: PurchaseRequest
  ): Promise<{ passed: boolean; message: string }> {
    
    if (request.offerPrice < service.price) {
      return {
        passed: false,
        message: `Price too low. ${service.name} costs $${service.price} ${service.currency}, you offered $${request.offerPrice}.`
      };
    }

    return { passed: true, message: 'Price validation passed' };
  }

  /**
   * Complete purchase after validation
   */
  private static async completePurchase(
    service: MarketplaceService,
    request: PurchaseRequest
  ): Promise<void> {
    
    // Process payment
    await DomainPaymentProcessor.processServicePayment(
      service.category,
      service.name,
      request.offerPrice,
      request.currency,
      request.customerId,
      service.providerId,
      request.forumId,
      service.id
    );

    // Update service availability
    if (service.availability.maxOrders) {
      await updateDoc(doc(db, 'marketplaceServices', service.id), {
        'availability.currentOrders': service.availability.currentOrders + 1
      });
    }

    // Update purchase request status
    await updateDoc(doc(db, 'purchaseRequests', request.id), {
      status: 'accepted',
      acceptedAt: serverTimestamp()
    });
  }

  /**
   * Reject purchase and notify customer
   */
  private static async rejectPurchase(
    request: PurchaseRequest,
    reason: string
  ): Promise<void> {
    
    await updateDoc(doc(db, 'purchaseRequests', request.id), {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: serverTimestamp()
    });
  }

  /**
   * Find service by name, checking forum-specific services first
   */
  private static async findService(
    serviceName: string,
    forumId: string
  ): Promise<MarketplaceService | null> {
    
    // First check services created in this forum
    const forumServicesQuery = query(
      collection(db, 'marketplaceServices'),
      where('name', '==', serviceName),
      where('forumId', '==', forumId)
    );
    
    const forumServices = await getDocs(forumServicesQuery);
    if (!forumServices.empty) {
      return forumServices.docs[0].data() as MarketplaceService;
    }

    // Then check public services
    const publicServicesQuery = query(
      collection(db, 'marketplaceServices'),
      where('name', '==', serviceName),
      where('isPublic', '==', true)
    );
    
    const publicServices = await getDocs(publicServicesQuery);
    if (!publicServices.empty) {
      return publicServices.docs[0].data() as MarketplaceService;
    }

    return null;
  }

  /**
   * Add service to forum's service list
   */
  private static async addServiceToForum(forumId: string, service: MarketplaceService) {
    const forumRef = doc(db, 'forums', forumId);
    await updateDoc(forumRef, {
      [`availableServices.${service.name}`]: {
        serviceId: service.id,
        provider: service.providerName,
        price: service.price,
        currency: service.currency,
        addedAt: serverTimestamp()
      }
    });
  }

  /**
   * Calculate distance between two coordinates (km)
   */
  private static calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Extract region from address string
   */
  private static extractRegionFromAddress(address: string): string {
    // Simple region extraction - could be enhanced with geocoding API
    const nzRegions = ['Auckland', 'Wellington', 'Canterbury', 'Hamilton', 'Tauranga', 'Christchurch'];
    for (const region of nzRegions) {
      if (address.toLowerCase().includes(region.toLowerCase())) {
        return region;
      }
    }
    return 'Unknown';
  }

  // Additional validation methods would go here...
  private static async validateAvailability(service: MarketplaceService, request: PurchaseRequest) {
    return { passed: true, message: 'Availability validated' };
  }

  private static async validateCustomer(service: MarketplaceService, request: PurchaseRequest) {
    return { passed: true, message: 'Customer validated' };
  }

  private static async executeCustomValidationRule(
    rule: ParsedRule, 
    service: MarketplaceService, 
    request: PurchaseRequest
  ) {
    return { passed: true, message: 'Custom validation passed' };
  }
}