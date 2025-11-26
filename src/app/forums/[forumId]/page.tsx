'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Users, Settings, ChevronRight, Code, Zap, Clock, CheckCircle, XCircle, Send, AlertCircle } from 'lucide-react';
import { EleuScriptParser, RuleExecutionEngine } from '@/lib/eleuScript/parser';
import Navigation from '@/components/Navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface definitions
interface PolicyRule {
  id: string;
  name: string;
  target: 'Forum' | 'Service' | 'Policy';
  targetName: string;
  status: 'executed' | 'executing' | 'pending' | 'failed';
  executedBy?: string;
  timestamp?: string;
}

interface ForumData {
  id: string;
  title: string;
  description: string;
  parentPolicyId: string;
  participants: Array<{
    stakeholder: string;
    role: string;
    permissions: string[];
  }>;
  rules: PolicyRule[];
  serviceStatus: Array<{
    name: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    description: string;
  }>;
}

interface Message {
  id: string;
  content: string;
  stakeholder: string;
  timestamp: string;
  type: 'chat' | 'system' | 'rule_execution';
  ruleData?: any;
}

// EleuScript Chat Input Component
function EleuScriptChatInput({ 
  onMessageSend, 
  currentStakeholder 
}: { 
  onMessageSend: (message: Message) => void;
  currentStakeholder: string;
}) {
  const [input, setInput] = useState('');
  const [isEleuScript, setIsEleuScript] = useState(false);
  const [parsedRule, setParsedRule] = useState<any>(null);

  useEffect(() => {
    try {
      const isScript = EleuScriptParser.isEleuScriptRule(input);
      setIsEleuScript(isScript);
      
      if (isScript) {
        const parsed = EleuScriptParser.parseRule(input);
        setParsedRule(parsed);
        console.log('EleuScript detected and parsed:', parsed);
      } else {
        setParsedRule(null);
      }
    } catch (error) {
      console.error('Error parsing EleuScript:', error);
      setIsEleuScript(false);
      setParsedRule(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (isEleuScript && parsedRule?.isValid) {
      console.log('Executing EleuScript rule:', parsedRule);
      
      const ruleMessage: Message = {
        id: `msg_${Date.now()}`,
        content: input,
        stakeholder: currentStakeholder,
        timestamp: new Date().toISOString(),
        type: 'rule_execution',
        ruleData: parsedRule
      };
      
      onMessageSend(ruleMessage);
      
      // Simulate rule execution
      setTimeout(async () => {
        try {
          const executionResult = await RuleExecutionEngine.executeRule(
            parsedRule,
            currentStakeholder,
            'forum_123'
          );
          
          const systemMessage: Message = {
            id: `sys_${Date.now()}`,
            content: executionResult.systemMessage || 
              `⚙️ EleuScript Execution Engine\nrule: ${parsedRule.ruleName} → ${parsedRule.ruleTarget}("${parsedRule.targetName}")\n${parsedRule.ruleTarget} "${parsedRule.targetName}" activated by ${currentStakeholder}`,
            stakeholder: 'system',
            timestamp: new Date().toISOString(),
            type: 'system'
          };
          
          onMessageSend(systemMessage);
        } catch (error) {
          console.error('Rule execution error:', error);
          
          const errorMessage: Message = {
            id: `err_${Date.now()}`,
            content: `⚠️ EleuScript Execution Failed\nError: ${error}\nRule: ${parsedRule.ruleName}`,
            stakeholder: 'system',
            timestamp: new Date().toISOString(),
            type: 'system'
          };
          
          onMessageSend(errorMessage);
        }
      }, 500);
      
    } else {
      // Regular chat message
      const chatMessage: Message = {
        id: `msg_${Date.now()}`,
        content: input,
        stakeholder: currentStakeholder,
        timestamp: new Date().toISOString(),
        type: 'chat'
      };
      
      onMessageSend(chatMessage);
    }
    
    setInput('');
  };

  return (
    <div className="border-t p-4">
      {/* EleuScript Preview */}
      {isEleuScript && parsedRule && (
        <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">EleuScript Detected</span>
          </div>
          
          {parsedRule.isValid ? (
            <div className="text-sm text-purple-700">
              <strong>Rule:</strong> {parsedRule.ruleName} → {parsedRule.ruleTarget}("{parsedRule.targetName}")
              {Object.keys(parsedRule.parameters || {}).length > 0 && (
                <div className="mt-1 text-xs">
                  <strong>Parameters:</strong> {JSON.stringify(parsedRule.parameters)}
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
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEleuScript ? "EleuScript rule detected..." : "Type a message or EleuScript rule..."}
            className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
              isEleuScript 
                ? 'border-purple-300 focus:ring-purple-500 bg-purple-50' 
                : 'border-gray-300 focus:ring-purple-500'
            }`}
            rows={1}
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
          disabled={!input.trim()}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isEleuScript
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
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
    </div>
  );
}

// Message Renderer Component  
function EleuScriptMessageRenderer({ message, currentStakeholder }: { message: Message; currentStakeholder: string }) {
  if (message.type === 'system') {
    return (
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
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
  }
  
  if (message.type === 'rule_execution') {
    const success = message.ruleData?.isValid;
    
    return (
      <div className="mb-4">
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
            <div className="text-sm text-green-700">
              <strong>Target:</strong> {message.ruleData.ruleTarget}("{message.ruleData.targetName}")
              {Object.keys(message.ruleData.parameters || {}).length > 0 && (
                <div className="mt-1">
                  <strong>Parameters:</strong> {JSON.stringify(message.ruleData.parameters)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {message.ruleData?.errors?.join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  const isCurrentUser = message.stakeholder === currentStakeholder;
  
  return (
    <div className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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

// Main Forum Page Component
export default function ForumDetailPage() {
  const params = useParams();
  const forumId = params?.forumId as string;
  
  const [forum, setForum] = useState<ForumData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStakeholder] = useState('alex.chen');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadForumData = async () => {
      if (!forumId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch forum from Firestore
        const forumRef = doc(db, 'forums', forumId);
        const forumSnap = await getDoc(forumRef);

        if (!forumSnap.exists()) {
          console.error('Forum not found:', forumId);
          setLoading(false);
          return;
        }

        const forumData = forumSnap.data();

        // Map Firestore data to ForumData interface
        const loadedForum: ForumData = {
          id: forumSnap.id,
          title: forumData.title || 'Untitled Forum',
          description: forumData.description || '',
          parentPolicyId: forumData.policyId || '',
          participants: (forumData.participants || []).map((p: any) => ({
            stakeholder: p.name || p.userId,
            role: p.role || 'participant',
            permissions: p.permissions || ['view', 'post']
          })),
          rules: forumData.rules || [],
          serviceStatus: forumData.serviceMembers?.map((s: any) => ({
            name: s.name,
            status: 'pending',
            description: s.provider || ''
          })) || []
        };

        setForum(loadedForum);

        // Load messages from forum data
        const loadedMessages: Message[] = [];

        // Add creation message
        loadedMessages.push({
          id: 'msg_created',
          content: `Forum "${loadedForum.title}" created.`,
          stakeholder: 'system',
          timestamp: forumData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          type: 'system'
        });

        // Add any stored messages
        if (forumData.messages && Array.isArray(forumData.messages)) {
          forumData.messages.forEach((msg: any, idx: number) => {
            loadedMessages.push({
              id: msg.id || `msg_${idx}`,
              content: msg.content || msg.text || '',
              stakeholder: msg.stakeholder || msg.sender || 'unknown',
              timestamp: msg.timestamp || new Date().toISOString(),
              type: msg.type || 'chat'
            });
          });
        }

        setMessages(loadedMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading forum:', error);
        setLoading(false);
      }
    };

    loadForumData();
  }, [forumId]);

  const handleMessageSend = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'executed':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'executing':
      case 'active':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading forum...</div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Forum not found</div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="flex-1 flex ml-16 pt-16">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <span>Emergency Housing Policy</span>
                <ChevronRight className="w-4 h-4" />
                <span>Forum</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{forum.title}</h1>
              <p className="text-gray-600 mt-1">{forum.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{forum.participants.length} participants</span>
            </div>
          </div>
        </div>

        {/* EleuScript Status */}
        <div className="border-b px-6 py-4 bg-purple-50">
          <div className="flex items-center space-x-2 mb-3">
            <Code className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-purple-900">Active Policy Rules</h3>
          </div>
          
          <div className="space-y-2">
            {forum.rules.map((rule) => (
              <div key={rule.id} className="flex items-center space-x-3 text-sm">
                {getStatusIcon(rule.status)}
                <span className={`font-medium ${
                  rule.status === 'executed' ? 'text-gray-900' :
                  rule.status === 'executing' ? 'text-yellow-800' :
                  rule.status === 'pending' ? 'text-gray-500' :
                  'text-red-600'
                }`}>
                  {rule.status.toUpperCase()}
                </span>
                <span className="text-gray-700">
                  {rule.name} → {rule.target}("{rule.targetName}")
                </span>
                {rule.executedBy && (
                  <span className="text-xs text-gray-500 ml-auto">
                    by {rule.executedBy}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-purple-600">
            ✨ EleuScript Ready - Type rules in chat to expand forum capabilities
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map(message => (
              <EleuScriptMessageRenderer 
                key={message.id}
                message={message} 
                currentStakeholder={currentStakeholder} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <EleuScriptChatInput 
            onMessageSend={handleMessageSend}
            currentStakeholder={currentStakeholder}
          />
        </div>
      </div>

      {/* Service Status Sidebar */}
      <div className="w-80 border-l bg-gray-50 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Service Status</h3>
        </div>
        
        <div className="space-y-4">
          {forum.serviceStatus.map((service, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(service.status)}
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-purple-100 rounded-lg">
          <div className="text-sm font-medium text-purple-900 mb-1">
            Try EleuScript Rules:
          </div>
          <div className="text-xs text-purple-700 space-y-1">
            <div>• rule AddHealthcare -&gt; Policy("HealthcareAccess")</div>
            <div>• rule ActivateTransport -&gt; Service("Transportation")</div>
            <div>• rule CreateConsultation -&gt; Forum("Medical")</div>
          </div>
        </div>

        {/* Participants */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
          <div className="space-y-2">
            {forum.participants.map((participant, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-900">{participant.stakeholder}</span>
                <span className="text-gray-500 text-xs">({participant.role})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}