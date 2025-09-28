// src/app/forums/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Forum {
  id: string;
  name: string;
  description: string;
  policyId?: string;
  metadata: {
    messageCount: number;
    createdAt: string;
    lastActivityAt?: string;
  };
  settings: {
    isPublic: boolean;
  };
}

interface Message {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export default function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newForumName, setNewForumName] = useState('');
  const [newForumDesc, setNewForumDesc] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'view'>('list');

  // Fetch forums
  const fetchForums = async () => {
    try {
      const res = await fetch('/api/forums');
      const data = await res.json();
      setForums(data.forums || []);
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  // Fetch messages for selected forum
  const fetchMessages = async (forumId: string) => {
    try {
      const res = await fetch(`/api/forums/${forumId}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Create new forum
  const createForum = async () => {
    if (!newForumName || !newForumDesc) {
      alert('Please enter forum name and description');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newForumName,
          description: newForumDesc,
          createdBy: 'test-user-123', // In production, get from auth
          isPublic: true
        })
      });

      if (res.ok) {
        setNewForumName('');
        setNewForumDesc('');
        fetchForums();
        setActiveTab('list');
        alert('Forum created successfully!');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating forum:', error);
      alert('Failed to create forum');
    } finally {
      setLoading(false);
    }
  };

  // Post message to forum
  const postMessage = async () => {
    if (!newMessage || !selectedForum) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/forums/${selectedForum.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'test-user-123',
          authorName: 'Test User',
          content: newMessage
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedForum.id);
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setLoading(false);
    }
  };

  // View forum details
  const viewForum = (forum: Forum) => {
    setSelectedForum(forum);
    fetchMessages(forum.id);
    setActiveTab('view');
  };

  useEffect(() => {
    fetchForums();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Forums (PFSD Model)</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-2 px-1 ${activeTab === 'list' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-600'}`}
        >
          All Forums ({forums.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-2 px-1 ${activeTab === 'create' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-600'}`}
        >
          Create Forum
        </button>
        {selectedForum && (
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-2 px-1 ${activeTab === 'view' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600'}`}
          >
            {selectedForum.name}
          </button>
        )}
      </div>

      {/* Forums List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {forums.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No forums created yet</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create First Forum
              </button>
            </div>
          ) : (
            forums.map(forum => (
              <div key={forum.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{forum.name}</h3>
                    <p className="text-gray-600 mb-2">{forum.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{forum.metadata.messageCount || 0} messages</span>
                      <span>{forum.settings.isPublic ? '🌐 Public' : '🔒 Private'}</span>
                      {forum.policyId && <span>📋 Policy-linked</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => viewForum(forum)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Enter Forum
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Forum Tab */}
      {activeTab === 'create' && (
        <div className="bg-white border rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Create New Forum</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Forum Name</label>
              <input
                type="text"
                value={newForumName}
                onChange={(e) => setNewForumName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Community Housing Forum"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newForumDesc}
                onChange={(e) => setNewForumDesc(e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
                placeholder="Describe the purpose of this forum..."
              />
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800">
                💡 Forums can be instantiated from Policy rules or created standalone. 
                They provide spaces for stakeholder dialogue and action.
              </p>
            </div>

            <button
              onClick={createForum}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Forum'}
            </button>
          </div>
        </div>
      )}

      {/* View Forum Tab */}
      {activeTab === 'view' && selectedForum && (
        <div className="space-y-6">
          {/* Forum Header */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{selectedForum.name}</h2>
            <p className="text-gray-600 mb-4">{selectedForum.description}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>📊 {messages.length} messages</span>
              <span>{selectedForum.settings.isPublic ? '🌐 Public Forum' : '🔒 Private Forum'}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Messages</h3>
            
            {/* Message List */}
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No messages yet. Be the first to post!</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="bg-gray-50 rounded p-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{msg.authorName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* New Message Input */}
            <div className="border-t pt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type your message..."
                rows={3}
              />
              <button
                onClick={postMessage}
                disabled={loading || !newMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}