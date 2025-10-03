// lib/eleuScript/parser.ts

// Basic types
export interface ParsedRule {
  ruleName: string;
  ruleTarget: string;
  targetName: string;
  parameters: any;
  rawText: string;
  isValid: boolean;
  errors?: string[];
}

export interface RuleExecutionResult {
  success: boolean;
  error?: string;
  systemMessage?: string;
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

// Simple parser class
export class EleuScriptParser {
  static isEleuScriptRule(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    
    const cleaned = text.trim();
    return cleaned.includes('rule ') && 
           cleaned.includes(' -> ') && 
           (cleaned.includes('Service(') || 
            cleaned.includes('Forum(') || 
            cleaned.includes('Policy('));
  }

  static parseRule(input: string): ParsedRule {
    if (!input || typeof input !== 'string') {
      return {
        ruleName: '',
        ruleTarget: '',
        targetName: '',
        parameters: {},
        rawText: input || '',
        isValid: false,
        errors: ['Invalid input']
      };
    }

    const rawText = input.trim();
    
    // Simple regex pattern
    const rulePattern = /rule\s+(\w+)\s+->\s+(Service|Forum|Policy)\("([^"]+)"/;
    const match = rawText.match(rulePattern);
    
    if (!match) {
      return {
        ruleName: '',
        ruleTarget: '',
        targetName: '',
        parameters: {},
        rawText: rawText,
        isValid: false,
        errors: ['Invalid EleuScript syntax']
      };
    }

    return {
      ruleName: match[1] || '',
      ruleTarget: match[2] || '',
      targetName: match[3] || '',
      parameters: {},
      rawText: rawText,
      isValid: true
    };
  }
}

// Simple execution engine
export class RuleExecutionEngine {
  static async executeRule(
    rule: ParsedRule,
    stakeholder: string,
    forumId: string
  ): Promise<RuleExecutionResult> {
    
    if (!rule.isValid) {
      return {
        success: false,
        error: 'Invalid rule'
      };
    }

    const systemMessage = `Rule executed: ${rule.ruleName} -> ${rule.ruleTarget}("${rule.targetName}")`;
    
    return {
      success: true,
      systemMessage: systemMessage
    };
  }
}

// Simple hook
export function useEleuScriptExecution(forumId: string, forumContext: ForumContext) {
  const executeEleuScript = async (
    input: string, 
    stakeholder: string
  ): Promise<RuleExecutionResult> => {
    
    if (!EleuScriptParser.isEleuScriptRule(input)) {
      return {
        success: false,
        error: 'Not a valid EleuScript rule'
      };
    }
    
    const parsedRule = EleuScriptParser.parseRule(input);
    
    if (!parsedRule.isValid) {
      return {
        success: false,
        error: 'Invalid rule syntax'
      };
    }
    
    return await RuleExecutionEngine.executeRule(
      parsedRule, 
      stakeholder, 
      forumId
    );
  };
  
  return { executeEleuScript };
}