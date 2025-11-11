// app/forums/[forumId]/components/ForumChat.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { EleuScriptParser } from '@/lib/eleuScript/parser';
import { PolicyExecutor } from '@/lib/eleuScript/policyExecutor';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: any;
  type: 'user' | 'system';
  metadata?: any;
}

interface ForumChatProps {
  forumId: string;
}

export default function ForumChat({ forumId }: ForumChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [rulePreview, setRulePreview] = useState<any>(null);
  const [canPost, setCanPost] = useState(false);
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'forums', forumId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));

      setMessages(messageData);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [forumId]);

  // Check if user has permission to post
  useEffect(() => {
    const checkPostPermission = async () => {
      if (!user) {
        setCanPost(false);
        setPermissionCheckLoading(false);
        return;
      }

      try {
        const forumDoc = await getDoc(doc(db, 'forums', forumId));

        if (!forumDoc.exists()) {
          setCanPost(false);
          setPermissionCheckLoading(false);
          return;
        }

        const forumData = forumDoc.data();
        const participants = forumData.participants || [];

        // Find current user in participants
        const userParticipant = participants.find(
          (p: any) => p.userId === user.uid
        );

        // Check if user is a participant and has 'post' permission
        const hasPostPermission = userParticipant &&
          Array.isArray(userParticipant.permissions) &&
          userParticipant.permissions.includes('post');

        setCanPost(hasPostPermission);
        setPermissionCheckLoading(false);
      } catch (error) {
        console.error('Error checking post permission:', error);
        setCanPost(false);
        setPermissionCheckLoading(false);
      }
    };

    checkPostPermission();
  }, [forumId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time EleuScript detection and preview
  useEffect(() => {
    if (EleuScriptParser.isEleuScriptRule(input)) {
      const parsed = EleuScriptParser.parseRule(input);
      setRulePreview(parsed);
    } else {
      setRulePreview(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    // Check if user has permission to post
    if (!canPost) {
      console.warn('User does not have permission to post in this forum');
      return;
    }

    const messageText = input.trim();
    setInput('');

    // Check if it's an EleuScript rule
    if (EleuScriptParser.isEleuScriptRule(messageText)) {
      await handleEleuScriptRule(messageText);
    } else {
      await sendChatMessage(messageText);
    }
  };

  const handleEleuScriptRule = async (ruleText: string) => {
    setIsExecuting(true);
    
    try {
      // Parse the rule
      const parsedRule = EleuScriptParser.parseRule(ruleText);
      
      if (!parsedRule.isValid) {
        await addSystemMessage(`❌ EleuScript syntax error: ${parsedRule.errors?.join(', ')}`);
        return;
      }

      // Add user's rule input to chat
      await addUserMessage(ruleText, 'eleuscript');

      // Execute the rule
      const executionResult = await PolicyExecutor.executeRule(
        parsedRule, 
        user.uid, 
        forumId
      );

      if (executionResult.success) {
        // Success - system message will be added by PolicyExecutor
        console.log('Rule executed successfully:', executionResult.data);
        
        // If it was a policy creation, show expanded capabilities
        if (parsedRule.ruleTarget === 'Policy' && executionResult.data) {
          await showPolicyCreationSummary(executionResult.data);
        }
      } else {
        await addSystemMessage(`❌ ${executionResult.message}`);
      }

    } catch (error) {
      console.error('EleuScript execution failed:', error);
      await addSystemMessage(`❌ Rule execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
      setRulePreview(null);
    }
  };

  const sendChatMessage = async (messageText: string) => {
    await addUserMessage(messageText, 'user');
  };

  const addUserMessage = async (content: string, type: 'user' | 'eleuscript' = 'user') => {
    await addDoc(collection(db, 'forums', forumId, 'messages'), {
      senderId: user!.uid,
      senderName: user!.displayName || user!.email || 'Unknown User',
      content,
      timestamp: serverTimestamp(),
      type,
      metadata: type === 'eleuscript' ? { isEleuScript: true } : undefined
    });
  };

  const addSystemMessage = async (content: string, metadata?: any) => {
    await addDoc(collection(db, 'forums', forumId, 'messages'), {
      senderId: 'system',
      senderName: 'EleuScript Execution Engine',
      content,
      timestamp: serverTimestamp(),
      type: 'system',
      metadata
    });
  };

  const showPolicyCreationSummary = async (subPolicy: any) => {
    const extractedServices = PolicyExecutor.extractServicesFromPolicy(subPolicy);
    
    const summaryMessage = `
📋 **Forum Capabilities Expanded**

**New Sub-Policy**: ${subPolicy.name}
**Added Stakeholders**: ${subPolicy.stakeholders.join(', ') || 'None'}
**New Services**: ${extractedServices.join(', ') || 'None'}
**Status**: Active

This forum can now coordinate additional governance functions through the new policy.
    `.trim();

    await addSystemMessage(summaryMessage, {
      type: 'policy_summary',
      policyId: subPolicy.id,
      capabilities: {
        stakeholders: subPolicy.stakeholders,
        services: extractedServices
      }
    });
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === user?.uid;
    const isSystem = message.type === 'system';
    const isEleuScript = message.metadata?.isEleuScript;

    return (
      <div key={message.id} className={`mb-4 ${isCurrentUser && !isSystem ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
          isSystem 
            ? 'bg-blue-50 border border-blue-200 text-blue-800' 
            : isCurrentUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800'
        }`}>
          {!isSystem && (
            <p className="text-xs opacity-70 mb-1">
              {message.senderName}
            </p>
          )}
          
          {isEleuScript ? (
            <div className="font-mono text-sm bg-purple-900 text-purple-100 p-2 rounded">
              <span className="text-purple-300">EleuScript:</span> {message.content}
            </div>
          ) : (
            <p className={`text-sm ${isSystem ? 'whitespace-pre-line' : ''}`}>
              {message.content}
            </p>
          )}
          
          {message.metadata?.type === 'policy_summary' && (
            <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
              <p><strong>Policy ID:</strong> {message.metadata.policyId}</p>
              <p><strong>Capabilities Added:</strong> {message.metadata.capabilities.services.length} services, {message.metadata.capabilities.stakeholders.length} stakeholders</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* EleuScript Rule Preview */}
      {rulePreview && (
        <div className="border-t bg-purple-50 p-3">
          <div className="text-xs text-purple-600 mb-1">EleuScript Rule Preview:</div>
          {rulePreview.isValid ? (
            <div className="text-sm text-purple-800">
              <span className="font-semibold">{rulePreview.ruleName}</span> → 
              <span className="text-purple-600"> {rulePreview.ruleTarget}</span>
              (<span className="text-purple-900">"{rulePreview.targetName}"</span>)
              {rulePreview.parameters && Object.keys(rulePreview.parameters).length > 0 && (
                <div className="text-xs mt-1 text-purple-600">
                  Parameters: {JSON.stringify(rulePreview.parameters, null, 2)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-600">
              Syntax Error: {rulePreview.errors?.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        {!canPost && !permissionCheckLoading && (
          <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm">
            <strong>⚠️ Posting Restricted:</strong> You are not a member of this forum. Only forum members with posting permissions can send messages.
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              canPost
                ? "Type a message or EleuScript rule (e.g., rule AddHealthcare -> Policy('HealthcareAccess'))"
                : "You do not have permission to post in this forum"
            }
            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
              !canPost
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : rulePreview
                  ? rulePreview.isValid
                    ? 'border-purple-300 focus:ring-purple-500 bg-purple-50'
                    : 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isExecuting || !canPost || permissionCheckLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isExecuting || !canPost || permissionCheckLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? 'Executing...' : permissionCheckLoading ? 'Loading...' : 'Send'}
          </button>
        </div>

        {/* Helper text */}
        {canPost && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Type EleuScript rules like: <code>rule AddHealthcare → Policy("HealthcareAccess")</code>
          </div>
        )}
      </form>
    </div>
  );
}