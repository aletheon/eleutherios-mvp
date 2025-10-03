// components/ForumChatWithEleuScript.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Code, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Import types from the parser file
import type { 
  ParsedRule,
  RuleExecutionResult,
  ForumContext,
  ForumParticipant
} from '../lib/eleuScript/parser';

// Import the parser functions
import { 
  EleuScriptParser, 
  RuleExecutionEngine, 
  useEleuScriptExecution
} from '../lib/eleuScript/parser';

interface Message {
  id: string;
  content: string;
  stakeholder: string;
  timestamp: string;
  type: 'chat' | 'system' | 'rule_execution';
  ruleExecution?: {
    rule: ParsedRule;
    result: RuleExecutionResult;
  };
}

interface ForumChatProps {
  forumId: string;
  forumContext: ForumContext;
  currentStakeholder: string;
  messages: Message[];
  onMessageSend: (message: Message) => void;
  onRuleExecution: (result: RuleExecutionResult) => void;
}

export default function ForumChatWithEleuScript({
  forumId,
  forumContext,
  currentStakeholder,
  messages,
  onMessageSend,
  onRuleExecution
}: ForumChatProps) {
  const [input, setInput] = useState('');
  const [isEleuScript, setIsEleuScript] = useState(false);
  const [parsedRule, setParsedRule] = useState<ParsedRule | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { executeEleuScript } = useEleuScriptExecution(forumId, forumContext);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Parse input as user types to detect EleuScript
  useEffect(() => {
    const isScript = EleuScriptParser.isEleuScriptRule(input);
    setIsEleuScript(isScript);
    
    if (isScript) {
      const parsed = EleuScriptParser.parseRule(input);
      setParsedRule(parsed);
    } else {
      setParsedRule(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting) return;

    if (isEleuScript && parsedRule) {
      // Execute EleuScript rule
      setIsExecuting(true);
      
      try {
        const result = await executeEleuScript(input, currentStakeholder);
        
        // Create rule execution message
        const ruleMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: input,
          stakeholder: currentStakeholder,
          timestamp: new Date().toISOString(),
          type: 'rule_execution',
          ruleExecution: {
            rule: parsedRule,
            result
          }
        };
        
        onMessageSend(ruleMessage);
        
        // If successful, also create system message
        if (result.success && result.systemMessage) {
          const systemMessage: Message = {
            id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: result.systemMessage,
            stakeholder: 'system',
            timestamp: new Date().toISOString(),
            type: 'system'
          };
          
          onMessageSend(systemMessage);
        }
        
        // Notify parent component of rule execution
        onRuleExecution(result);
        
      } catch (error) {
        console.error('EleuScript execution failed:', error);
      } finally {
        setIsExecuting(false);
      }
    } else {
      // Send regular chat message
      const chatMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: input,
        stakeholder: currentStakeholder,
        timestamp: new Date().toISOString(),
        type: 'chat'
      };
      
      onMessageSend(chatMessage);
    }
    
    setInput('');
  };

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case 'system':
        return (
          <div key={message.id} className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <pre className="text-sm text-blue-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {message.content}
                </pre>
              </div>
            </div>
          </div>
        );
        
      case 'rule_execution':
        const execution = message.ruleExecution!;
        const success = execution.result.success;
        
        return (
          <div key={message.id} className="mb-4">
            {/* Original rule input */}
            <div className="flex justify-end mb-2">
              <div className="max-w-xs lg:max-w-md px-4 py-2 bg-purple-600 text-white rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Code className="w-4 h-4" />
                  <span className="text-xs font-medium">EleuScript</span>
                </div>
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {message.content}
                </pre>
              </div>
            </div>
            
            {/* Execution result */}
            <div className={`p-3 rounded-lg border-l-4 ${
              success 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  success ? 'text-green-800' : 'text-red-800'
                }`}>
                  Rule {success ? 'Executed' : 'Failed'}
                </span>
              </div>
              
              {success ? (
                <div className="space-y-2">
                  <div className="text-sm text-green-700">
                    <strong>Target:</strong> {execution.rule.ruleTarget}("{execution.rule.targetName}")
                  </div>
                  
                  {execution.result.stateChanges && (
                    <div className="text-sm text-green-700">
                      <strong>Changes:</strong>
                      {execution.result.stateChanges.newStakeholders && (
                        <div>• Added stakeholders: {execution.result.stateChanges.newStakeholders.join(', ')}</div>
                      )}
                      {execution.result.stateChanges.activatedServices && (
                        <div>• Activated services: {execution.result.stateChanges.activatedServices.join(', ')}</div>
                      )}
                      {execution.result.stateChanges.policyHierarchyUpdate && (
                        <div>• Policy hierarchy updated</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  <strong>Error:</strong> {execution.result.error}
                </div>
              )}
            </div>
          </div>
        );
        
      case 'chat':
      default:
        const isCurrentUser = message.stakeholder === currentStakeholder;
        
        return (
          <div key={message.id} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isCurrentUser 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {!isCurrentUser && (
                <div className="text-xs font-medium mb-1 opacity-75">
                  {message.stakeholder}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      {/* EleuScript Preview */}
      {isEleuScript && parsedRule && (
        <div className="mx-4 mb-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">EleuScript Detected</span>
          </div>
          
          {parsedRule.isValid ? (
            <div className="space-y-1 text-sm">
              <div className="text-purple-700">
                <strong>Rule:</strong> {parsedRule.ruleName} → {parsedRule.ruleTarget}("{parsedRule.targetName}")
              </div>
              {Object.keys(parsedRule.parameters).length > 0 && (
                <div className="text-purple-600">
                  <strong>Parameters:</strong> {JSON.stringify(parsedRule.parameters, null, 2)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-600">
              <strong>Syntax Error:</strong> {parsedRule.errors?.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isEleuScript ? "EleuScript rule detected..." : "Type a message or EleuScript rule..."}
              className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                isEleuScript 
                  ? 'border-purple-300 focus:ring-purple-500 bg-purple-50' 
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              rows={input.includes('\n') ? input.split('\n').length : 1}
              disabled={isExecuting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {isEleuScript && (
              <div className="absolute top-2 right-2">
                <Code className="w-5 h-5 text-purple-500" />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isExecuting}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEleuScript
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isExecuting ? (
              <Clock className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Help Text */}
        <div className="mt-2 text-xs text-gray-500">
          {isEleuScript ? (
            <span className="text-purple-600">
              Press Enter to execute EleuScript rule • Shift+Enter for new line
            </span>
          ) : (
            <span>
              Type "rule RuleName -&gt; Target("name", parameters)" to create EleuScript rules
            </span>
          )}
        </div>
      </form>
    </div>
  );
}