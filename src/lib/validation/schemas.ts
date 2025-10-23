import { z } from 'zod';

// Common schemas
export const certScoreSchema = z.object({
  cooperation: z.number().min(0).max(100).optional(),
  engagement: z.number().min(0).max(100).optional(),
  retention: z.number().min(0).max(100).optional(),
  trust: z.number().min(0).max(100).optional(),
  total: z.number().min(0).max(100).optional(),
  lastUpdated: z.string().optional(),
});

// Forum schemas
export const createForumSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  policyId: z.string().min(1, 'Policy ID is required'),
  connectedPolicies: z.array(z.string()).optional(),
  participants: z.array(z.any()).optional(),
  permissions: z.record(z.array(z.string())).optional(),
  created_by: z.string().min(1, 'Creator ID is required'),
});

export const updateForumSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  connectedPolicies: z.array(z.string()).optional(),
  participants: z.array(z.any()).optional(),
  permissions: z.record(z.array(z.string())).optional(),
  serviceStatus: z.array(z.any()).optional(),
  status: z.enum(['active', 'archived']).optional(),
});

// Policy schemas
export const createPolicySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  rules: z.array(z.string()).min(1, 'At least one rule is required'),
  stakeholders: z.array(z.string()).optional(),
  permissions: z.record(z.array(z.string())).optional(),
  created_by: z.string().min(1, 'Creator ID is required'),
  parent_policy_id: z.string().optional(),
  parent_forum_id: z.string().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
});

export const updatePolicySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  rules: z.array(z.string()).optional(),
  stakeholders: z.array(z.string()).optional(),
  permissions: z.record(z.array(z.string())).optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
});

export const executePolicySchema = z.object({
  executedBy: z.string().min(1, 'Executor ID is required'),
  forumId: z.string().optional(),
  context: z.record(z.any()).optional(),
});

// Service schemas
export const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['human', 'ai', 'api', 'product'], {
    errorMap: () => ({ message: 'Type must be one of: human, ai, api, product' }),
  }),
  visibility: z.enum(['public', 'private', 'restricted']).optional(),
  visibilityConfig: z
    .object({
      searchableBy: z.array(z.string()).optional(),
      viewableBy: z.array(z.string()).optional(),
      orderableBy: z.array(z.string()).optional(),
      approvableBy: z.array(z.string()).optional(),
    })
    .optional(),
  pricing: z
    .object({
      basePrice: z.number().min(0).optional(),
      currency: z.string().optional(),
      billingModel: z
        .enum(['one_time', 'subscription', 'per_use', 'per_prescription', 'free'])
        .optional(),
      revenueShare: z
        .object({
          provider: z.number().min(0).max(100).optional(),
          platform: z.number().min(0).max(100).optional(),
          regulation_compliance: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
    .optional(),
  provider: z.object({
    userId: z.string().min(1, 'Provider user ID is required'),
    name: z.string().min(1, 'Provider name is required'),
    licenseNumber: z.string().optional(),
    verified: z.boolean().optional(),
  }),
  attributes: z.record(z.any()).optional(),
  governanceRules: z.array(z.any()).optional(),
  complianceRequirements: z.record(z.any()).optional(),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'restricted']).optional(),
  visibilityConfig: z
    .object({
      searchableBy: z.array(z.string()).optional(),
      viewableBy: z.array(z.string()).optional(),
      orderableBy: z.array(z.string()).optional(),
      approvableBy: z.array(z.string()).optional(),
    })
    .optional(),
  pricing: z
    .object({
      basePrice: z.number().min(0).optional(),
      currency: z.string().optional(),
      billingModel: z
        .enum(['one_time', 'subscription', 'per_use', 'per_prescription', 'free'])
        .optional(),
      revenueShare: z
        .object({
          provider: z.number().min(0).max(100).optional(),
          platform: z.number().min(0).max(100).optional(),
          regulation_compliance: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
    .optional(),
  attributes: z.record(z.any()).optional(),
  governanceRules: z.array(z.any()).optional(),
  complianceRequirements: z.record(z.any()).optional(),
  certScore: certScoreSchema.optional(),
});

// Event schemas
export const createEventSchema = z.object({
  type: z.enum([
    'sub_policy_created',
    'service_activated',
    'forum_expanded',
    'stakeholder_added',
    'policy_executed',
    'forum_created',
    'service_registered',
    'user_created',
    'user_updated',
    'payment_processed',
    'cart_checkout',
    'action_executed',
  ]),
  forumId: z.string().optional(),
  policyId: z.string().optional(),
  triggeredBy: z.string().min(1, 'Triggered by is required'),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Action schemas
export const createActionSchema = z.object({
  type: z.enum([
    'create_forum',
    'create_policy',
    'activate_service',
    'add_stakeholder',
    'send_notification',
    'process_payment',
    'update_cert_score',
    'approve_request',
    'deny_request',
  ]),
  parameters: z.record(z.any()).optional(),
  executedBy: z.string().min(1, 'Executor ID is required'),
  policyId: z.string().optional(),
  forumId: z.string().optional(),
  serviceId: z.string().optional(),
});

export const updateActionSchema = z.object({
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  result: z.any().optional(),
  error: z.string().optional(),
});

// Forum message schemas
export const createMessageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['message', 'system', 'action']).optional(),
});

// Cart schemas
export const cartActionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['add', 'remove', 'update', 'clear']),
  item: z
    .object({
      serviceId: z.string(),
      serviceName: z.string().optional(),
      price: z.number().min(0).optional(),
      quantity: z.number().int().positive().optional(),
      requiresApproval: z.boolean().optional(),
      forumContext: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    })
    .optional(),
});

export const checkoutSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  paymentMethod: z.string().optional(),
  forumContext: z.string().optional(),
});

// User schemas
export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  certScore: certScoreSchema.optional(),
  policyList: z.array(z.string()).optional(),
  activities: z
    .object({
      forums: z.array(z.string()).optional(),
      policies: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

// Helper function to validate request body
export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, error: errorMessages.join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}
