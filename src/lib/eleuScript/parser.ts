// lib/eleuScript/parser.ts

export interface ParsedRule {
  ruleName: string;
  ruleTarget: 'Forum' | 'Service' | 'Policy';
  targetName: string;
  parameters: Record<string, any>;
  rawText: string;
  isValid: boolean;
  errors?: string[];
}

export interface RuleExecutionResult {
  success: boolean;
  ruleId?: string;
  policyId?: string;
  serviceId?: string;
  forumId?: string;
  error?: string;
  systemMessage?: string;
  stateChanges?: {
    newStakeholders?: string[];
    activatedServices?: string[];
    policyHierarchyUpdate?: boolean;
  };
}

export interface ForumParticipant {
  stakeholder: string;
  role: string;
  permissions: string[];
}

export interface ForumContext {
  id: string;
  parentPolicyId: string;
  activePolicies: string[];
  participants: ForumParticipant[];
  permissions: Record<string, string[]>;
}

/**
 * Core EleuScript Parser
 * Detects and parses EleuScript rules typed into forum chat
 */
export class EleuScriptParser {
  
  /**
   * Check if input text contains EleuScript syntax
   */
  static isEleuScriptRule(text: string): boolean {
    const cleaned = text.trim();
    return cleaned.includes('rule ') && 
           cleaned.includes(' -> ') && 
           (cleaned.includes('Service(') || 
            cleaned.includes('Forum(') || 
            cleaned.includes('Policy('));
  }

  /**
   * Parse EleuScript rule from natural language input
   */
  static parseRule(input: string): ParsedRule {
    const rawText = input.trim();
    
    // Basic rule pattern: rule RuleName -> Target("name", parameters)
    const rulePattern = /rule\s+(\w+)\s+->\s+(Service|Forum|Policy)\("([^"]+)"(?:,\s*(.+))?\)/;
    const match = rawText.match(rulePattern);
    
    if (!match) {
      return {
        ruleName: '',
        ruleTarget: 'Service',
        targetName: '',
        parameters: {},
        rawText,
        isValid: false,
        errors: ['Invalid EleuScript syntax. Expected: rule RuleName -> Target("name", parameters)']
      };
    }

    const [, ruleName, ruleTarget, targetName, paramString] = match;
    
    try {
      const parameters = this.parseParameters(paramString || '');
      
      return {
        ruleName,
        ruleTarget: ruleTarget as 'Forum' | 'Service' | 'Policy',
        targetName,
        parameters,
        rawText,
        isValid: true
      };
    } catch (error) {
      return {
        ruleName,
        ruleTarget: ruleTarget as 'Forum' | 'Service' | 'Policy',
        targetName,
        parameters: {},
        rawText,
        isValid: false,
        errors: [`Parameter parsing error: ${error}`]
      };
    }
  }

  /**
   * Parse rule parameters from string
   * Handles: stakeholders = ["A", "B"], permissions = {}, conditions = []
   */
  private static parseParameters(paramString: string): Record<string, any> {
    if (!paramString.trim()) return {};

    const parameters: Record<string, any> = {};
    
    // Split by commas not inside quotes or brackets
    const params = this.splitParameters(paramString);
    
    for (const param of params) {
      const [key, value] = param.split('=', 2);
      if (key && value) {
        const cleanKey = key.trim();
        const cleanValue = value.trim();
        
        try {
          // Try to parse as JSON-like structure
          parameters[cleanKey] = this.parseParameterValue(cleanValue);
        } catch {
          // Fallback to string value
          parameters[cleanKey] = cleanValue.replace(/^["']|["']$/g, '');
        }
      }
    }
    
    return parameters;
  }

  private static splitParameters(paramString: string): string[] {
    const params: string[] = [];
    let current = '';
    let bracketDepth = 0;
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < paramString.length; i++) {
      const char = paramString[i];
      
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      } else if (!inQuotes) {
        if (char === '[' || char === '{') bracketDepth++;
        if (char === ']' || char === '}') bracketDepth--;
        
        if (char === ',' && bracketDepth === 0) {
          params.push(current.trim());
          current = '';
          continue;
        }
      }
      
      current += char;
    }
    
    if (current.trim()) {
      params.push(current.trim());
    }
    
    return params;
  }

  private static parseParameterValue(value: string): any {
    // Handle arrays: ["item1", "item2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1).trim();
      if (!arrayContent) return [];
      
      return arrayContent.split(',').map(item => 
        item.trim().replace(/^["']|["']$/g, '')
      );
    }
    
    // Handle objects: {key: "value"}
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        // Convert to valid JSON format
        const jsonStr = value.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
        return JSON.parse(jsonStr);
      } catch {
        return {};
      }
    }
    
    // Handle strings
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // Handle numbers
    if (/^\d+$/.test(value)) {
      return parseInt(value);
    }
    
    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    return value;
  }
}

/**
 * Permission Validation Engine
 * Checks if stakeholder can execute specific rules
 */
export class PermissionValidator {
  
  static validateRuleExecution(
    stakeholder: string,
    rule: ParsedRule,
    forumContext: ForumContext
  ): { valid: boolean; error?: string } {
    
    // Find stakeholder in forum
    const participant = forumContext.participants.find(p => p.stakeholder === stakeholder);
    if (!participant) {
      return { valid: false, error: 'Stakeholder not authorized in this forum' };
    }
    
    // Get required permissions for rule type
    const requiredPermissions = this.getRulePermissions(rule);
    
    // Check if stakeholder has all required permissions
    const hasPermissions = requiredPermissions.every(permission => 
      participant.permissions.includes(permission)
    );
    
    if (!hasPermissions) {
      return { 
        valid: false, 
        error: `Insufficient permissions. Required: ${requiredPermissions.join(', ')}` 
      };
    }
    
    return { valid: true };
  }
  
  private static getRulePermissions(rule: ParsedRule): string[] {
    switch (rule.ruleTarget) {
      case 'Service':
        return ['activate_services'];
      case 'Forum':
        return ['create_forums'];
      case 'Policy':
        return ['create_sub_policies'];
      default:
        return [];
    }
  }
}

/**
 * Rule Execution Engine
 * Executes validated EleuScript rules and updates system state
 */
export class RuleExecutionEngine {
  
  static async executeRule(
    rule: ParsedRule,
    stakeholder: string,
    forumId: string,
    forumContext: ForumContext
  ): Promise<RuleExecutionResult> {
    
    // Validate permissions first
    const permissionCheck = PermissionValidator.validateRuleExecution(
      stakeholder, rule, forumContext
    );
    
    if (!permissionCheck.valid) {
      return {
        success: false,
        error: permissionCheck.error
      };
    }
    
    try {
      switch (rule.ruleTarget) {
        case 'Service':
          return await this.executeServiceRule(rule, stakeholder, forumId);
        case 'Forum':
          return await this.executeForumRule(rule, stakeholder, forumId);
        case 'Policy':
          return await this.executePolicyRule(rule, stakeholder, forumId, forumContext);
        default:
          return {
            success: false,
            error: `Unknown rule target: ${rule.ruleTarget}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `Rule execution failed: ${error}`
      };
    }
  }
  
  private static async executeServiceRule(
    rule: ParsedRule,
    stakeholder: string,
    forumId: string
  ): Promise<RuleExecutionResult> {
    
    // Generate service ID and create service activation
    const serviceId = `svc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create system message for forum
    const systemMessage = `⚙️ EleuScript Execution Engine\nrule: ${rule.ruleName} → Service("${rule.targetName}")\nService ${rule.targetName} activated by ${stakeholder}`;
    
    return {
      success: true,
      serviceId,
      systemMessage,
      stateChanges: {
        activatedServices: [rule.targetName]
      }
    };
  }
  
  private static async executeForumRule(
    rule: ParsedRule,
    stakeholder: string,
    forumId: string
  ): Promise<RuleExecutionResult> {
    
    // Generate forum ID and create forum
    const newForumId = `forum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const systemMessage = `⚙️ EleuScript Execution Engine\nrule: ${rule.ruleName} → Forum("${rule.targetName}")\nNew coordination space "${rule.targetName}" created by ${stakeholder}`;
    
    return {
      success: true,
      forumId: newForumId,
      systemMessage,
      stateChanges: {
        newStakeholders: rule.parameters.stakeholders || []
      }
    };
  }
  
  private static async executePolicyRule(
    rule: ParsedRule,
    stakeholder: string,
    forumId: string,
    forumContext: ForumContext
  ): Promise<RuleExecutionResult> {
    
    // Generate policy ID and create sub-policy
    const policyId = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create sub-policy linked to parent
    const subPolicy = {
      id: policyId,
      name: rule.targetName,
      parent_policy_id: forumContext.parentPolicyId,
      created_by: stakeholder,
      created_in_forum: forumId,
      rules: rule.parameters.rules || [],
      stakeholders: rule.parameters.stakeholders || [],
      timestamp: new Date().toISOString()
    };
    
    const systemMessage = `⚙️ EleuScript Execution Engine\nrule: ${rule.ruleName} → Policy("${rule.targetName}")\nSub-policy "${rule.targetName}" created by ${stakeholder}\nForum capabilities expanded with new governance rules`;
    
    return {
      success: true,
      policyId,
      systemMessage,
      stateChanges: {
        newStakeholders: rule.parameters.stakeholders || [],
        policyHierarchyUpdate: true
      }
    };
  }
}

/**
 * React Hook for EleuScript Integration
 */
export function useEleuScriptExecution(forumId: string, forumContext: ForumContext) {
  
  const executeEleuScript = async (
    input: string, 
    stakeholder: string
  ): Promise<RuleExecutionResult> => {
    
    // Check if input is EleuScript
    if (!EleuScriptParser.isEleuScriptRule(input)) {
      return {
        success: false,
        error: 'Not a valid EleuScript rule'
      };
    }
    
    // Parse the rule
    const parsedRule = EleuScriptParser.parseRule(input);
    
    if (!parsedRule.isValid) {
      return {
        success: false,
        error: parsedRule.errors?.join(', ') || 'Invalid rule syntax'
      };
    }
    
    // Execute the rule
    return await RuleExecutionEngine.executeRule(
      parsedRule, 
      stakeholder, 
      forumId, 
      forumContext
    );
  };
  
  return { executeEleuScript };
}