import { z } from "zod";

/** Common Validators */
export const IdSchema = z.string().min(1);
export const ISOTimeSchema = z.string().datetime();
export const CurrencySchema = z.string().regex(/^[A-Z]{3}$/); // ISO-4217

export const VisibilitySchema = z.enum(["public", "restricted", "private"]);
export const LifecycleStatusSchema = z.enum(["draft", "active", "closed", "archived"]);

/** CERT Score Validator */
export const CERTSchema = z.object({
  c: z.number().min(0).max(100),
  e: z.number().min(0).max(100),
  r: z.number().min(0).max(100),
  t: z.number().min(0).max(100),
  score: z.number().min(0).max(100),
});

/** User Validators */
export const UserSchema = z.object({
  id: IdSchema,
  orgId: IdSchema,
  handle: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  cert: CERTSchema,
  location: z.string().optional(),
  lastActive: ISOTimeSchema,
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
  createdBy: IdSchema,
  updatedBy: IdSchema,
});

export const UserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  bio: z.string().optional(),
  location: z.string().optional(),
});

/** Organization Validators */
export const OrganizationSchema = z.object({
  id: IdSchema,
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["platform", "government", "enterprise", "community"]),
  settings: z.object({
    visibility: VisibilitySchema,
    policyDepthLimit: z.number().int().min(1).max(20),
    allowExternalServices: z.boolean(),
  }),
  createdBy: IdSchema,
  updatedBy: IdSchema,
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
  status: z.enum(["active", "suspended", "archived"]),
});

/** Rule Guard Validator */
export const RuleGuardSchema = z.object({
  roles: z.array(z.enum(["owner", "admin", "moderator", "member", "guest"])).optional(),
  minCertScore: z.number().min(0).max(100).optional(),
  attributes: z.record(z.unknown()).optional(),
  schedule: z.object({
    cron: z.string().optional(),
    start: ISOTimeSchema.optional(),
    end: ISOTimeSchema.optional(),
  }).optional(),
  limitPerActorPerDay: z.number().int().min(1).optional(),
});

/** Rule Validators (Discriminated Union) */
export const ForumRuleSchema = z.object({
  id: IdSchema,
  kind: z.literal("forum"),
  name: z.string().min(1),
  action: z.enum(["create", "bind", "reference"]),
  forumRef: IdSchema.optional(),
  config: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    visibility: VisibilitySchema.optional(),
    defaultRoles: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
  }).optional(),
  guard: RuleGuardSchema.optional(),
  orderIndex: z.number().int().optional(),
});

export const ServiceRuleSchema = z.object({
  id: IdSchema,
  kind: z.literal("service"),
  name: z.string().min(1),
  action: z.enum(["bind", "require"]),
  serviceRef: IdSchema.optional(),
  config: z.object({
    requiredPolicies: z.array(z.object({
      policyId: IdSchema,
      version: z.number().int().min(1).optional(),
    })).optional(),
    attributes: z.record(z.unknown()).optional(),
  }).optional(),
  guard: RuleGuardSchema.optional(),
  orderIndex: z.number().int().optional(),
});

export const PolicyRefRuleSchema = z.object({
  id: IdSchema,
  kind: z.literal("policy"),
  name: z.string().min(1),
  reference: z.object({
    policyId: IdSchema,
    version: z.number().int().min(1).optional(),
  }),
  importRules: z.boolean().optional(),
  guard: RuleGuardSchema.optional(),
  orderIndex: z.number().int().optional(),
});

export const RuleSchema = z.discriminatedUnion("kind", [
  ForumRuleSchema,
  ServiceRuleSchema,
  PolicyRefRuleSchema,
]);

/** Policy Validators */
export const PolicySchema = z.object({
  id: IdSchema,
  orgId: IdSchema,
  slug: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  visibility: VisibilitySchema,
  ownerId: IdSchema,
  version: z.number().int().min(1),
  effectiveFrom: ISOTimeSchema,
  effectiveTo: ISOTimeSchema.optional(),
  supersedesPolicyId: IdSchema.optional(),
  parentPolicyId: IdSchema.optional(),
  depth: z.number().int().min(0).max(12),
  status: LifecycleStatusSchema,
  rules: z.array(RuleSchema),
  tags: z.array(z.string()).optional(),
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
  createdBy: IdSchema,
  updatedBy: IdSchema,
});

export const PolicyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visibility: VisibilitySchema,
  parentPolicyId: IdSchema.optional(),
  rules: z.array(RuleSchema).default([]),
  tags: z.array(z.string()).optional(),
});

/** Forum Validators */
export const ForumSchema = z.object({
  id: IdSchema,
  orgId: IdSchema,
  policyId: IdSchema,
  policyVersion: z.number().int().min(1),
  ruleId: IdSchema,
  parentForumId: IdSchema.optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  visibility: VisibilitySchema,
  settings: z.record(z.unknown()).optional(),
  lastActivityAt: ISOTimeSchema.optional(),
  status: z.enum(["active", "closed", "archived"]),
  createdBy: IdSchema,
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
});

export const ForumFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visibility: VisibilitySchema,
  parentForumId: IdSchema.optional(),
});

/** Forum Membership Validators */
export const ForumMembershipSchema = z.object({
  id: IdSchema,
  forumId: IdSchema,
  userId: IdSchema,
  orgId: IdSchema,
  role: z.enum(["owner", "admin", "moderator", "member", "guest"]),
  attrs: z.record(z.unknown()).optional(),
  joinedAt: ISOTimeSchema,
  leftAt: ISOTimeSchema.optional(),
  invitedBy: IdSchema.optional(),
  status: z.enum(["active", "suspended", "left"]),
});

/** Message Validators */
export const MessageSchema = z.object({
  id: IdSchema,
  forumId: IdSchema,
  authorId: IdSchema,
  orgId: IdSchema,
  content: z.string().min(1),
  contentType: z.enum(["text", "markdown", "html"]),
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
  editedAt: ISOTimeSchema.optional(),
  replyToId: IdSchema.optional(),
  reactions: z.record(z.array(IdSchema)).optional(),
  status: z.enum(["active", "edited", "deleted", "moderated"]),
});

export const MessageFormSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  contentType: z.enum(["text", "markdown", "html"]).default("text"),
  replyToId: IdSchema.optional(),
});

/** Service Validators */
export const ServiceTypeSchema = z.enum(["product", "ai", "api", "human"]);

export const ServiceSchema = z.object({
  id: IdSchema,
  orgId: IdSchema,
  slug: z.string().optional(),
  ownerId: IdSchema,
  type: ServiceTypeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  visibility: VisibilitySchema,
  attributes: z.record(z.unknown()).optional(),
  pricing: z.object({
    amountCents: z.number().int().min(0),
    currency: CurrencySchema,
    model: z.enum(["one-time", "subscription", "usage", "free"]),
  }).optional(),
  availability: z.enum(["active", "inactive", "maintenance", "suspended"]),
  cert: CERTSchema,
  rating: z.object({
    average: z.number().min(0).max(5),
    count: z.number().int().min(0),
  }).optional(),
  createdAt: ISOTimeSchema,
  updatedAt: ISOTimeSchema,
  createdBy: IdSchema,
  updatedBy: IdSchema,
});

export const ServiceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: ServiceTypeSchema,
  visibility: VisibilitySchema,
  attributes: z.record(z.unknown()).optional(),
  pricing: z.object({
    amountCents: z.number().int().min(0),
    currency: CurrencySchema,
    model: z.enum(["one-time", "subscription", "usage", "free"]),
  }).optional(),
});

/** Event Validators */
export const EventTopicSchema = z.enum(["policy", "forum", "service", "user", "message"]);
export const EventActionSchema = z.enum([
  "created", "updated", "deleted", "archived",
  "posted", "joined", "left", "rated", "bound", "instantiated",
  "activated", "deactivated", "followed", "unfollowed",
  "invited", "approved", "rejected"
]);

export const EventSchema = z.object({
  id: IdSchema,
  idempotencyKey: z.string().optional(),
  eventType: z.string(),
  actorId: IdSchema.optional(),
  orgId: IdSchema,
  targetId: IdSchema,
  targetType: EventTopicSchema,
  payload: z.record(z.unknown()).optional(),
  metadata: z.object({
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    source: z.enum(["web", "api", "system"]),
  }).optional(),
  timestamp: ISOTimeSchema,
});

/** API Response Validators */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

/** Search and Filter Validators */
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  visibility: VisibilitySchema.optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  certScore: z.object({
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100),
  }).optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
});

/** Validation Helpers */
export function validateRule(rule: unknown): rule is z.infer<typeof RuleSchema> {
  return RuleSchema.safeParse(rule).success;
}

export function validatePolicy(policy: unknown): policy is z.infer<typeof PolicySchema> {
  return PolicySchema.safeParse(policy).success;
}

export function validatePolicyForm(form: unknown): form is z.infer<typeof PolicyFormSchema> {
  return PolicyFormSchema.safeParse(form).success;
}

/** Policy Depth Validation */
export function validatePolicyDepth(policy: z.infer<typeof PolicySchema>, maxDepth = 12): boolean {
  return policy.depth <= maxDepth;
}

/** Circular Reference Detection */
export function validateNoCycles(policies: z.infer<typeof PolicySchema>[]): boolean {
  const graph = new Map<string, string[]>();
  
  // Build adjacency list
  for (const policy of policies) {
    const edges: string[] = [];
    
    if (policy.parentPolicyId) {
      edges.push(policy.parentPolicyId);
    }
    
    if (policy.supersedesPolicyId) {
      edges.push(policy.supersedesPolicyId);
    }
    
    for (const rule of policy.rules) {
      if (rule.kind === "policy") {
        edges.push(rule.reference.policyId);
      }
    }
    
    graph.set(policy.id, edges);
  }
  
  // DFS cycle detection
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const edges = graph.get(nodeId) || [];
    for (const edge of edges) {
      if (hasCycle(edge)) return true;
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const nodeId of graph.keys()) {
    if (hasCycle(nodeId)) return false;
  }
  
  return true;
}