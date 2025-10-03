'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Participant {
  userId: string;
  role: 'owner' | 'admin' | 'moderator' | 'member' | 'guest';
  joinedAt: string;
  leftAt?: string;
  attrs?: Record<string, unknown>;
}

interface Message {
  id: string;
  forumId: string;
  authorId: string;
  content: string;
  createdAt: string;
  editedAt?: string;
  replyToId?: string;
  reactions?: Record<string, string[]>;
}

interface Forum {
  id: string;
  orgId: string;
  policyId: string;
  parentForumId?: string;
  title: string;
  description?: string;
  visibility: 'public' | 'restricted' | 'private';
  settings?: Record<string, unknown>;
  lastActivityAt?: string;
  status: 'active' | 'closed' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  handle?: string;
}

interface ActivityItem {
  id: string;
  type: 'forum' | 'policy' | 'service';
  title: string;
  status: string;
}

export default function ForumDetailPage({ params }: { params: Promise<{ forumId: string }> }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolvedParams = use(params);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  
  const [forum, setForum] = useState<Forum | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantUsers, setParticipantUsers] = useState<Record<string, User>>({});
  const [messages, setMessages] = useState<Message[]>([]);
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
    fetchForumData();
  }, [resolvedParams.forumId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchForumData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch forum from Firebase Realtime Database
      const forumResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${resolvedParams.forumId}.json`
      );
      
      if (!forumResponse.ok) {
        throw new Error('Failed to fetch forum');
      }

      const forumData = await forumResponse.json();
      
      if (!forumData) {
        // Demo data fallback
        const demoForum: Forum = {
          id: resolvedParams.forumId,
          orgId: 'org-1',
          policyId: 'emergency-housing-policy',
          title: 'Emergency Housing Coordination',
          description: 'Real-time coordination between service providers for emergency housing placement and support services.',
          visibility: 'restricted',
          lastActivityAt: '2024-09-30T16:45:00Z',
          status: 'active',
          createdBy: 'system',
          createdAt: '2024-09-30T08:00:00Z',
          updatedAt: '2024-09-30T16:45:00Z'
        };
        setForum(demoForum);

        // Demo participants
        const demoParticipants: Participant[] = [
          {
            userId: 'user-john',
            role: 'member',
            joinedAt: '2024-09-30T08:15:00Z'
          },
          {
            userId: 'user-sarah-msd',
            role: 'moderator', 
            joinedAt: '2024-09-30T08:00:00Z'
          },
          {
            userId: 'user-mike-ko',
            role: 'moderator',
            joinedAt: '2024-09-30T08:00:00Z'
          },
          {
            userId: 'ai-coordinator',
            role: 'member',
            joinedAt: '2024-09-30T08:00:00Z'
          }
        ];
        setParticipants(demoParticipants);

        // Demo users
        const demoUsers: Record<string, User> = {
          'user-john': { id: 'user-john', name: 'John Smith', avatar: '👤' },
          'user-sarah-msd': { id: 'user-sarah-msd', name: 'Sarah Jones (MSD)', avatar: '👩‍💼' },
          'user-mike-ko': { id: 'user-mike-ko', name: 'Mike Wilson (KO)', avatar: '👨‍💼' },
          'ai-coordinator': { id: 'ai-coordinator', name: 'Coordination Assistant', avatar: '🤖' }
        };
        setParticipantUsers(demoUsers);

        // Demo messages
        const demoMessages: Message[] = [
          {
            id: 'msg-1',
            forumId: resolvedParams.forumId,
            authorId: 'user-john',
            content: 'Hi, I urgently need emergency housing. I\'ve been sleeping rough for 3 nights.',
            createdAt: '2024-09-30T08:15:00Z'
          },
          {
            id: 'msg-2',
            forumId: resolvedParams.forumId,
            authorId: 'user-sarah-msd',
            content: 'Hello John, I can see your emergency housing application has been received. Let me coordinate with Kāinga Ora immediately.',
            createdAt: '2024-09-30T08:18:00Z'
          },
          {
            id: 'msg-3',
            forumId: resolvedParams.forumId,
            authorId: 'ai-coordinator',
            content: 'System update: Emergency Housing Policy requirements checked ✓ - Applicant qualifies for immediate placement.',
            createdAt: '2024-09-30T08:20:00Z'
          },
          {
            id: 'msg-4',
            forumId: resolvedParams.forumId,
            authorId: 'user-mike-ko',
            content: 'I have a transitional housing unit available at 42 Queen Street, Auckland. Can accommodate tonight. Housing unit 42-QUEEN-ST-01 reserved for John Smith. Check-in code: H2K9L4.',
            createdAt: '2024-09-30T08:25:00Z'
          },
          {
            id: 'msg-5',
            forumId: resolvedParams.forumId,
            authorId: 'user-sarah-msd',
            content: 'Excellent! John, please head to 42 Queen Street. The access code is H2K9L4. I\'ll also arrange transport support and a $200 emergency payment for immediate needs.',
            createdAt: '2024-09-30T08:30:00Z'
          },
          {
            id: 'msg-6',
            forumId: resolvedParams.forumId,
            authorId: 'user-john',
            content: 'Thank you so much! This is incredible - from homelessness to housing in 15 minutes. How do I get to Queen Street?',
            createdAt: '2024-09-30T08:32:00Z'
          },
          {
            id: 'msg-7',
            forumId: resolvedParams.forumId,
            authorId: 'ai-coordinator',
            content: 'Transport arranged: Uber arriving in 5 minutes (License: ABC123). Healthcare intake appointment scheduled for tomorrow at 9 AM. Welcome package ready at reception.',
            createdAt: '2024-09-30T08:35:00Z'
          }
        ];
        setMessages(demoMessages);
      } else {
        // Use real data
        const fetchedForum: Forum = {
          id: resolvedParams.forumId,
          orgId: forumData.orgId || 'org-1',
          policyId: forumData.policyId || '',
          parentForumId: forumData.parentForumId,
          title: forumData.title || 'Untitled Forum',
          description: forumData.description,
          visibility: forumData.visibility || 'public',
          settings: forumData.settings,
          lastActivityAt: forumData.lastActivityAt,
          status: forumData.status || 'active',
          createdBy: forumData.createdBy || 'unknown',
          createdAt: forumData.createdAt || new Date().toISOString(),
          updatedAt: forumData.updatedAt || new Date().toISOString()
        };
        setForum(fetchedForum);

        // Fetch participants
        await fetchParticipants();
        
        // Fetch messages
        await fetchMessages();
      }

    } catch (error) {
      console.error('Error fetching forum data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forum_memberships.json?orderBy="forumId"&equalTo="${resolvedParams.forumId}"`
      );
      
      if (response.ok) {
        const participantsData = await response.json();
        if (participantsData) {
          const participantsList = Object.values(participantsData) as Participant[];
          setParticipants(participantsList);
          
          // Fetch user details for each participant
          const userPromises = participantsList.map(p => fetchUser(p.userId));
          const users = await Promise.all(userPromises);
          const usersMap: Record<string, User> = {};
          users.forEach(user => {
            if (user) usersMap[user.id] = user;
          });
          setParticipantUsers(usersMap);
        }
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json?orderBy="forumId"&equalTo="${resolvedParams.forumId}"`
      );
      
      if (response.ok) {
        const messagesData = await response.json();
        if (messagesData) {
          const messagesList = Object.values(messagesData) as Message[];
          messagesList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setMessages(messagesList);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUser = async (userId: string): Promise<User | null> => {
    try {
      // Try Firestore first
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents/users/${userId}`
      );

      if (firestoreResponse.ok) {
        const userData = await firestoreResponse.json();
        if (userData.fields) {
          return {
            id: userId,
            name: userData.fields.name?.stringValue || 'Unknown User',
            avatar: userData.fields.avatar?.stringValue,
            handle: userData.fields.handle?.stringValue
          };
        }
      }

      // Fallback to Realtime Database
      const rtdbResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userId}.json`
      );

      if (rtdbResponse.ok) {
        const userData = await rtdbResponse.json();
        if (userData) {
          return {
            id: userId,
            name: userData.name || 'Unknown User',
            avatar: userData.avatar,
            handle: userData.handle
          };
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      forumId: resolvedParams.forumId,
      authorId: 'current-user',
      content: newMessage.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      await fetch(`/api/forums/${resolvedParams.forumId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    } catch (err) {
      console.error('Error sending message:', err);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'restricted': return 'bg-yellow-100 text-yellow-800';
      case 'private': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <p className="text-gray-600 mb-4">{error || 'The forum you are looking for does not exist or you do not have access to it.'}</p>
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

          {/* EleuScript Policy Context */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{forum.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getVisibilityColor(forum.visibility)}`}>
                    {forum.visibility}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${forum.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {forum.status}
                  </span>
                </div>
                
                {forum.description && (
                  <p className="text-gray-600 mb-4">{forum.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span>📅 Created {new Date(forum.createdAt).toLocaleDateString()}</span>
                  <span>👥 {participants.length} participants</span>
                  <span>💬 {messages.length} messages</span>
                  {forum.policyId && (
                    <Link href={`/policies/${forum.policyId}`} className="text-blue-600 hover:text-blue-800">
                      📋 Policy: {forum.policyId}
                    </Link>
                  )}
                </div>

                {/* EleuScript Rule that Created This Forum */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    🔧 Created by EleuScript Rule:
                  </h3>
                  <div className="font-mono text-sm text-gray-800 bg-white rounded p-3 border">
                    <div className="text-blue-600">policy</div> <span className="text-purple-600">EmergencyHousingPolicy</span> {'{'}<br/>
                    &nbsp;&nbsp;<div className="text-blue-600">rule</div> <span className="text-green-600">CreateCoordinationSpace</span> -&gt; <span className="text-red-600">Forum</span>(<span className="text-orange-600">"Emergency Housing Coordination"</span>,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">stakeholders</span> = [<span className="text-orange-600">"Person"</span>, <span className="text-orange-600">"MSD"</span>, <span className="text-orange-600">"KaingarOra"</span>, <span className="text-orange-600">"Healthcare"</span>],<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">permissions</span> = {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-600">"Person"</span>: [<span className="text-orange-600">"join"</span>, <span className="text-orange-600">"message"</span>, <span className="text-orange-600">"view_status"</span>],<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-600">"MSD"</span>: [<span className="text-orange-600">"join"</span>, <span className="text-orange-600">"message"</span>, <span className="text-orange-600">"approve_funding"</span>],<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-600">"KaingarOra"</span>: [<span className="text-orange-600">"join"</span>, <span className="text-orange-600">"message"</span>, <span className="text-orange-600">"reserve_housing"</span>]<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                    &nbsp;&nbsp;)<br/>
                    {'}'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ⚡ This forum was automatically instantiated when John Smith's housing request triggered the EmergencyHousingPolicy rule
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Policy Rules */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Active Policy Rules</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <span className="font-mono text-sm text-green-700">ProcessApplication</span>
                  <p className="text-sm text-gray-600">Eligibility check and verification</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">✓ EXECUTED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <span className="font-mono text-sm text-green-700">ProvideFinancialSupport</span>
                  <p className="text-sm text-gray-600">$200 emergency payment approval</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">✓ EXECUTED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <span className="font-mono text-sm text-blue-700">ReserveHousing</span>
                  <p className="text-sm text-gray-600">Housing unit allocation and booking</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">⚡ EXECUTING</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="font-mono text-sm text-yellow-700">ArrangeTransport</span>
                  <p className="text-sm text-gray-600">Transport to housing location</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">⏳ PENDING</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Rule-Based Coordination Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {/* System Rule Execution Message */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium text-blue-800">EleuScript Rule Execution</span>
                      <span className="text-xs text-gray-500">08:15 AM</span>
                    </div>
                    <div className="text-sm text-blue-700 mb-2">
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">ProcessApplication</span> rule triggered by John Smith's housing request
                    </div>
                    <div className="text-sm text-gray-700">
                      ✓ Eligibility verified: homeless_status_confirmed, urgent_need_validated<br/>
                      ✓ Stakeholders auto-assigned: MSD (Sarah Jones), Kainga Ora (Mike Wilson)<br/>
                      ✓ Forum permissions configured per policy rules
                    </div>
                  </div>

                  {messages.map((message) => {
                    const author = participantUsers[message.authorId];
                    const isSystemMessage = message.authorId === 'ai-coordinator';
                    const isRuleExecution = isSystemMessage && message.content.includes('✓');
                    
                    return (
                      <div key={message.id} className={`flex gap-3 ${
                        isSystemMessage ? 'bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500' : ''
                      }`}>
                        <div className="text-2xl">{
                          isSystemMessage ? '⚙️' : author?.avatar || '👤'
                        }</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {isSystemMessage ? 'EleuScript Execution Engine' : author?.name || 'Unknown User'}
                            </span>
                            {isSystemMessage && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                AUTO-RULE
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className={`text-sm ${
                            isSystemMessage ? 'text-blue-700 font-medium' : 'text-gray-900'
                          }`}>
                            {isRuleExecution ? (
                              <div>
                                <div className="font-mono text-xs text-blue-600 mb-1">
                                  rule: ProvideFinancialSupport → Service("EmergencyPayment")
                                </div>
                                {message.content}
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>

                          {/* Show rule context for automated actions */}
                          {message.content.includes('Housing unit') && (
                            <div className="mt-2 p-2 bg-green-50 rounded border text-xs">
                              <span className="font-mono text-green-700">rule: ReserveHousing</span>
                              <div className="text-gray-600">Auto-executed: housing_available && applicant_verified</div>
                            </div>
                          )}

                          {message.content.includes('Transport arranged') && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded border text-xs">
                              <span className="font-mono text-yellow-700">rule: ArrangeTransport</span>
                              <div className="text-gray-600">Triggered by: housing_confirmed && payment_approved</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Rule-Based Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="text-xs text-gray-600 mb-2">
                    💡 <strong>Rule-Based Coordination:</strong> Most actions happen automatically via EleuScript rules. 
                    Manual messages are for clarification and human coordination only.
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Add clarification or coordination note..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participants */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Participants ({participants.length})</h3>
                <div className="space-y-2">
                  {participants.map((participant) => {
                    const user = participantUsers[participant.userId];
                    return (
                      <div key={participant.userId} className="flex items-center gap-3">
                        <div className="text-2xl">{user?.avatar || '👤'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.name || 'Unknown User'}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(participant.role)}`}>
                              {participant.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Forum Actions */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                    Invite Participants
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700">
                    Add Service
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700">
                    Share Forum
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