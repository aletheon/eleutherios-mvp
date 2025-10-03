'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Forum {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  createdBy?: string;
  participants?: string[];
  permissions?: {
    canPost?: string[];
    canAddMembers?: string[];
    canRemoveMembers?: string[];
    canUploadFiles?: string[];
  };
  connectedPolicies?: string[];
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: string;
  type: 'message' | 'status_update' | 'file_upload';
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status?: string;
}

export default function ForumDetailPage() {
  const params = useParams();
  const forumId = params.forumId as string;
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [forum, setForum] = useState<Forum | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock activities data
  const activities = [
    { id: '1', type: 'forum', title: 'Emergency Housing', status: 'active' },
    { id: '2', type: 'policy', title: 'Healthcare Policy', status: 'pending' },
    { id: '3', type: 'service', title: 'Food Bank', status: 'completed' }
  ];

  // Mock users for activities panel
  const users = [
    { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Marcus Johnson', avatar: '👨‍⚕️', status: 'busy' },
    { id: '3', name: 'Elena Rodriguez', avatar: '👩‍🏫', status: 'away' }
  ];

  useEffect(() => {
    fetchForum();
    fetchMessages();
  }, [forumId]);

  const fetchForum = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch forum from Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forum');
      }

      const forumData = await response.json();
      
      if (!forumData) {
        throw new Error('Forum not found');
      }

      const fetchedForum: Forum = {
        id: forumId,
        title: forumData.title ? String(forumData.title) : 'Untitled Forum',
        status: forumData.status ? String(forumData.status) : 'active',
        createdAt: forumData.createdAt ? String(forumData.createdAt) : new Date().toISOString(),
        ...(forumData.description && { description: String(forumData.description) }),
        ...(forumData.createdBy && { createdBy: String(forumData.createdBy) }),
        ...(forumData.participants && Array.isArray(forumData.participants) && { 
          participants: forumData.participants.map((p: any) => String(p)) 
        }),
        ...(forumData.permissions && { permissions: forumData.permissions }),
        ...(forumData.connectedPolicies && Array.isArray(forumData.connectedPolicies) && { 
          connectedPolicies: forumData.connectedPolicies.map((p: any) => String(p)) 
        })
      };

      setForum(fetchedForum);

      // Fetch participant details
      if (fetchedForum.participants && fetchedForum.participants.length > 0) {
        await fetchParticipants(fetchedForum.participants);
      }

    } catch (error) {
      console.error('Error fetching forum:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      // Fetch messages from Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/messages.json`
      );
      
      if (response.ok) {
        const messagesData = await response.json();
        if (messagesData) {
          const messagesList: Message[] = Object.entries(messagesData).map(([id, message]: [string, any]) => ({
            id,
            userId: String(message.userId || 'unknown'),
            userName: String(message.userName || 'Unknown User'),
            userRole: String(message.userRole || 'user'),
            content: String(message.content || ''),
            timestamp: message.timestamp || new Date().toISOString(),
            type: message.type || 'message',
            attachments: message.attachments || []
          })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          setMessages(messagesList);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchParticipants = async (participantIds: string[]) => {
    try {
      const participantPromises = participantIds.map(async (participantId) => {
        // Try Firestore first
        const firestoreResponse = await fetch(
          `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents/users/${participantId}`
        );

        if (firestoreResponse.ok) {
          const userData = await firestoreResponse.json();
          if (userData.fields) {
            return {
              id: participantId,
              name: userData.fields.displayName?.stringValue || userData.fields.name?.stringValue || 'Unknown User',
              role: userData.fields.role?.stringValue || 'user',
              avatar: userData.fields.avatar?.stringValue,
              status: userData.fields.status?.stringValue || 'offline'
            };
          }
        }

        // Fallback to Realtime Database
        const rtdbResponse = await fetch(
          `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/users/${participantId}.json`
        );

        if (rtdbResponse.ok) {
          const userData = await rtdbResponse.json();
          if (userData) {
            return {
              id: participantId,
              name: userData.displayName || userData.name || 'Unknown User',
              role: userData.role || 'user',
              avatar: userData.avatar,
              status: userData.status || 'offline'
            };
          }
        }

        return {
          id: participantId,
          name: 'Unknown User',
          role: 'user',
          status: 'offline'
        };
      });

      const participantResults = await Promise.all(participantPromises);
      setParticipants(participantResults);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = {
        userId: 'current-user', // Replace with actual current user ID
        userName: 'Current User', // Replace with actual current user name
        userRole: 'user', // Replace with actual current user role
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
      };

      // Send message to Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        }
      );

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum': return '💬';
      case 'policy': return '📋';
      case 'service': return '🔧';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getForumStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '👑';
      case 'caseworker': return '👩‍💼';
      case 'healthcare-provider': return '👨‍⚕️';
      case 'housing-officer': return '🏠';
      default: return '👤';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forum...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !forum) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forum Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The forum you are looking for does not exist.'}</p>
            <Link href="/forums" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Forums
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
        </div>

        <div className="flex-1 overflow-y-auto">
          {isActivitiesExpanded ? (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activities</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.type === 'forum' ? 'Active discussion' : 
                           activity.type === 'policy' ? 'Review pending' : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">Active Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex justify-center py-2">
                  <div className="text-2xl">{user.avatar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon - Left Edge */}
      <div 
        className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${
          isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'
        }`}
      >
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-96' : 'left-36'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link href="/services" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            <div className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">account_circle</span>
              <span className="text-sm font-medium">RK</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16 p-6 min-h-screen bg-gray-50`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8">
            <Link href="/forums" className="text-blue-600 hover:text-blue-800">
              ← Back to Forums
            </Link>
          </div>

          {/* Forum Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{forum.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getForumStatusColor(forum.status)}`}>
                    {forum.status}
                  </span>
                </div>
                
                {forum.description && (
                  <p className="text-gray-600 mb-4">{forum.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>📅 Created {new Date(forum.createdAt).toLocaleDateString()}</span>
                  <span>👥 {participants.length} participants</span>
                  <span>💬 {messages.length} messages</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Join Forum
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                  Invite Members
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Messages Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {/* Messages Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
                </div>

                {/* Messages List */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        <div className="text-2xl">{getRoleIcon(message.userRole)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{message.userName}</span>
                            <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                            <span className="text-xs text-gray-400 capitalize">({message.userRole})</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-800">{message.content}</p>
                            {message.type === 'status_update' && (
                              <div className="mt-2 text-xs text-blue-600 font-medium">
                                Status Update
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Policies */}
              {forum.connectedPolicies && forum.connectedPolicies.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Policies</h3>
                  <div className="space-y-2">
                    {forum.connectedPolicies.map((policyId) => (
                      <Link
                        key={policyId}
                        href={`/policies/${policyId}`}
                        className="block p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📋</span>
                          <span className="text-blue-600 hover:text-blue-800">Policy: {policyId}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participants */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants ({participants.length})</h3>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-2xl">{participant.avatar || getRoleIcon(participant.role)}</div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUserStatusColor(participant.status || 'offline')}`}></div>
                      </div>
                      <div className="flex-1">
                        <Link href={`/users/${participant.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {participant.name}
                        </Link>
                        <p className="text-xs text-gray-500 capitalize">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forum Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forum Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{forum.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium">{new Date(forum.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Messages:</span>
                    <span className="ml-2 font-medium">{messages.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Forum ID:</span>
                    <span className="ml-2 font-mono text-xs">{forum.id}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
                    Connect Policy
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
                    Activate Service
                  </button>
                  <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm">
                    Share Forum
                  </button>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}