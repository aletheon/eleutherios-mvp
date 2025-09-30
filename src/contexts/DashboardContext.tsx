// src/contexts/DashboardContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  id: string;
  type: 'forum_post' | 'status_change' | 'price_change' | 'service_added' | 'policy_update' | 'favorite_update';
  title: string;
  description: string;
  timestamp: string;
  forumId?: string;
  serviceId?: string;
  policyId?: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  targetUserId: string; // Who this activity is for
  sourceUserId?: string; // Who triggered this activity
  changeType?: 'status' | 'price' | 'availability' | 'content' | 'membership';
  oldValue?: string;
  newValue?: string;
}

interface DashboardContextType {
  activitiesPanelOpen: boolean;
  setActivitiesPanelOpen: (open: boolean) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'isRead'>) => void;
  markActivityAsRead: (id: string) => void;
  unreadCount: number;
  // Smart activity generators
  notifyForumPost: (forumId: string, postData: any) => Promise<void>;
  notifyServiceStatusChange: (serviceId: string, oldStatus: string, newStatus: string) => Promise<void>;
  notifyServicePriceChange: (serviceId: string, oldPrice: number, newPrice: number) => Promise<void>;
  notifyServiceAddedToForum: (serviceId: string, forumId: string, addedBy: string) => Promise<void>;
  notifyPolicyUpdate: (policyId: string, changeDescription: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activitiesPanelOpen, setActivitiesPanelOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load persisted state from localStorage (only on client)
  useEffect(() => {
    if (!isClient || !user) return;
    
    try {
      const savedPanelState = localStorage.getItem('eleutherios-activities-panel');
      const savedActivities = localStorage.getItem(`eleutherios-activities-${user.uid}`);
      
      if (savedPanelState) {
        setActivitiesPanelOpen(JSON.parse(savedPanelState));
      }
      
      if (savedActivities) {
        const userActivities = JSON.parse(savedActivities).filter(
          (activity: Activity) => activity.targetUserId === user.uid
        );
        setActivities(userActivities);
      }
    } catch (error) {
      console.error('Error loading dashboard state:', error);
    }
  }, [isClient, user]);

  // Persist panel state (only on client)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem('eleutherios-activities-panel', JSON.stringify(activitiesPanelOpen));
    } catch (error) {
      console.error('Error saving panel state:', error);
    }
  }, [activitiesPanelOpen, isClient]);

  // Persist activities (only on client)
  useEffect(() => {
    if (!isClient || !user) return;
    
    try {
      localStorage.setItem(`eleutherios-activities-${user.uid}`, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }, [activities, isClient, user]);

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp' | 'isRead'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only latest 50
  };

  const markActivityAsRead = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, isRead: true } : activity
      )
    );
  };

  // Helper function to get forum members
  const getForumMembers = async (forumId: string): Promise<string[]> => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/members.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data ? Object.keys(data) : [];
      }
    } catch (error) {
      console.error('Error fetching forum members:', error);
    }
    return [];
  };

  // Helper function to get service followers
  const getServiceFollowers = async (serviceId: string): Promise<string[]> => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}/followers.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data ? Object.keys(data) : [];
      }
    } catch (error) {
      console.error('Error fetching service followers:', error);
    }
    return [];
  };

  // Helper function to get policy subscribers
  const getPolicySubscribers = async (policyId: string): Promise<string[]> => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}/subscribers.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data ? Object.keys(data) : [];
      }
    } catch (error) {
      console.error('Error fetching policy subscribers:', error);
    }
    return [];
  };

  // Smart activity generators
  const notifyForumPost = async (forumId: string, postData: any) => {
    const forumMembers = await getForumMembers(forumId);
    
    forumMembers.forEach(memberId => {
      if (memberId !== postData.authorId) { // Don't notify yourself
        addActivity({
          type: 'forum_post',
          title: `New post in ${postData.forumTitle || 'forum'}`,
          description: `${postData.authorName} posted: ${postData.content.slice(0, 100)}...`,
          priority: 'medium',
          forumId: forumId,
          targetUserId: memberId,
          sourceUserId: postData.authorId
        });
      }
    });
  };

  const notifyServiceStatusChange = async (serviceId: string, oldStatus: string, newStatus: string) => {
    const serviceFollowers = await getServiceFollowers(serviceId);
    
    // Get service info
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}.json?auth=${token}`
      );
      
      if (response.ok) {
        const service = await response.json();
        
        serviceFollowers.forEach(followerId => {
          addActivity({
            type: 'status_change',
            title: `${service.name} status changed`,
            description: `Status changed from "${oldStatus}" to "${newStatus}"`,
            priority: newStatus === 'running_low' || newStatus === 'unavailable' ? 'high' : 'medium',
            serviceId: serviceId,
            targetUserId: followerId,
            changeType: 'status',
            oldValue: oldStatus,
            newValue: newStatus
          });
        });
      }
    } catch (error) {
      console.error('Error notifying service status change:', error);
    }
  };

  const notifyServicePriceChange = async (serviceId: string, oldPrice: number, newPrice: number) => {
    const serviceFollowers = await getServiceFollowers(serviceId);
    
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}.json?auth=${token}`
      );
      
      if (response.ok) {
        const service = await response.json();
        
        serviceFollowers.forEach(followerId => {
          addActivity({
            type: 'price_change',
            title: `${service.name} price updated`,
            description: `Price changed from $${oldPrice} to $${newPrice}`,
            priority: newPrice < oldPrice ? 'high' : 'medium', // Price drops are high priority
            serviceId: serviceId,
            targetUserId: followerId,
            changeType: 'price',
            oldValue: oldPrice.toString(),
            newValue: newPrice.toString()
          });
        });
      }
    } catch (error) {
      console.error('Error notifying service price change:', error);
    }
  };

  const notifyServiceAddedToForum = async (serviceId: string, forumId: string, addedBy: string) => {
    try {
      const token = await user?.getIdToken();
      
      // Get service and forum info
      const [serviceResponse, forumResponse] = await Promise.all([
        fetch(`https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}.json?auth=${token}`),
        fetch(`https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}.json?auth=${token}`)
      ]);
      
      if (serviceResponse.ok && forumResponse.ok) {
        const [service, forum] = await Promise.all([
          serviceResponse.json(),
          forumResponse.json()
        ]);
        
        // Notify the service owner
        addActivity({
          type: 'service_added',
          title: `Your service was added to a forum`,
          description: `${service.name} was added to ${forum.title} forum`,
          priority: 'high',
          serviceId: serviceId,
          forumId: forumId,
          targetUserId: service.ownerId,
          sourceUserId: addedBy
        });
      }
    } catch (error) {
      console.error('Error notifying service added to forum:', error);
    }
  };

  const notifyPolicyUpdate = async (policyId: string, changeDescription: string) => {
    const policySubscribers = await getPolicySubscribers(policyId);
    
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json?auth=${token}`
      );
      
      if (response.ok) {
        const policy = await response.json();
        
        policySubscribers.forEach(subscriberId => {
          if (subscriberId !== policy.authorId) { // Don't notify the author
            addActivity({
              type: 'policy_update',
              title: `${policy.title} policy updated`,
              description: changeDescription,
              priority: 'medium',
              policyId: policyId,
              targetUserId: subscriberId,
              sourceUserId: policy.authorId
            });
          }
        });
      }
    } catch (error) {
      console.error('Error notifying policy update:', error);
    }
  };

  const unreadCount = activities.filter(a => !a.isRead && a.targetUserId === user?.uid).length;

  // Sort activities by priority and timestamp
  const sortedActivities = [...activities].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <DashboardContext.Provider value={{
      activitiesPanelOpen,
      setActivitiesPanelOpen,
      activities: sortedActivities,
      setActivities,
      addActivity,
      markActivityAsRead,
      unreadCount,
      notifyForumPost,
      notifyServiceStatusChange,
      notifyServicePriceChange,
      notifyServiceAddedToForum,
      notifyPolicyUpdate,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}