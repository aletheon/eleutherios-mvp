// src/contexts/DashboardContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, orderBy, limit, Timestamp, onSnapshot, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Activity {
  id: string;
  type: 'forum_post' | 'status_change' | 'price_change' | 'service_added' | 'policy_update' | 'favorite_update' | 'forum_created' | 'forum_member_added' | 'rule_created' | 'rule_deleted' | 'purchase_notification' | 'receipt_notification';
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
  deleteActivity: (id: string) => Promise<void>;
  clearAllActivities: () => Promise<void>;
  unreadCount: number;
  // Smart activity generators
  notifyForumPost: (forumId: string, postData: any) => Promise<void>;
  notifyServiceStatusChange: (serviceId: string, oldStatus: string, newStatus: string) => Promise<void>;
  notifyServicePriceChange: (serviceId: string, oldPrice: number, newPrice: number) => Promise<void>;
  notifyServiceAddedToForum: (serviceId: string, forumId: string, addedBy: string) => Promise<void>;
  notifyPolicyUpdate: (policyId: string, changeDescription: string) => Promise<void>;
  notifyForumCreated: (forumId: string, forumTitle: string, creatorId: string, memberIds: string[]) => Promise<void>;
  notifyRuleCreated: (forumId: string, ruleTitle: string, creatorId: string) => Promise<void>;
  notifyRuleDeleted: (forumId: string, ruleTitle: string, deletedBy: string) => Promise<void>;
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

  // Load persisted state from localStorage (only on client) and listen to Firestore
  useEffect(() => {
    if (!isClient || !user) return;

    try {
      const savedPanelState = localStorage.getItem('eleutherios-activities-panel');

      if (savedPanelState) {
        setActivitiesPanelOpen(JSON.parse(savedPanelState));
      }

      // Set up real-time listener for activities from Firestore
      const activitiesRef = collection(db, 'notifications');
      const q = query(
        activitiesRef,
        where('targetUserId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedActivities: Activity[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type,
            title: data.title,
            description: data.description,
            timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
            forumId: data.forumId,
            serviceId: data.serviceId,
            policyId: data.policyId,
            priority: data.priority,
            isRead: data.isRead || false,
            targetUserId: data.targetUserId,
            sourceUserId: data.sourceUserId,
            changeType: data.changeType,
            oldValue: data.oldValue,
            newValue: data.newValue
          };
        });

        setActivities(fetchedActivities);
      }, (error) => {
        console.warn('Firestore index is building. Using localStorage temporarily:', error.message);
        // Fallback to localStorage while index is building
        try {
          const savedActivities = localStorage.getItem(`eleutherios-activities-${user.uid}`);
          if (savedActivities) {
            const userActivities = JSON.parse(savedActivities).filter(
              (activity: Activity) => activity.targetUserId === user.uid
            );
            setActivities(userActivities);
          }
        } catch (err) {
          console.error('Error loading from localStorage:', err);
        }
      });

      return () => unsubscribe();
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

  const addActivity = async (activityData: Omit<Activity, 'id' | 'timestamp' | 'isRead'>) => {
    try {
      console.log('📝 Adding activity to Firestore:', activityData);

      // Add to Firestore - the real-time listener will update local state automatically
      const notificationsRef = collection(db, 'notifications');
      const docRef = await addDoc(notificationsRef, {
        ...activityData,
        timestamp: Timestamp.now(),
        isRead: false,
      });

      console.log('✓ Activity added to Firestore with ID:', docRef.id);
      console.log('⏳ Waiting for real-time listener to update local state...');
    } catch (error) {
      console.error('❌ Error adding activity to Firestore:', error);

      // Fallback to local state on error (only when Firestore fails)
      const newActivity: Activity = {
        ...activityData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setActivities(prev => {
        // Check for duplicates before adding
        const exists = prev.some(a => a.id === newActivity.id);
        if (exists) return prev;
        return [newActivity, ...prev].slice(0, 50);
      });
      console.log('⚠️ Added activity to local state only (Firestore failed)');
    }
  };

  const markActivityAsRead = async (id: string) => {
    try {
      // Update in Firestore
      const activityRef = doc(db, 'notifications', id);
      await updateDoc(activityRef, {
        isRead: true
      });

      // The real-time listener will update the local state automatically
    } catch (error) {
      console.error('Error marking activity as read:', error);

      // Fallback to local state on error
      setActivities(prev =>
        prev.map(activity =>
          activity.id === id ? { ...activity, isRead: true } : activity
        )
      );
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      console.log('Deleting activity:', id);

      // Delete from Firestore
      const activityRef = doc(db, 'notifications', id);
      await deleteDoc(activityRef);

      // The real-time listener will update the local state automatically
      console.log('✓ Successfully deleted activity');
    } catch (error) {
      console.error('Error deleting activity:', error);

      // Fallback to local state on error
      setActivities(prev => prev.filter(activity => activity.id !== id));
    }
  };

  const clearAllActivities = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Clearing all activities for user:', user.uid);

      // Get all notifications for this user
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('targetUserId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      console.log(`Found ${snapshot.size} notifications to delete`);

      // Delete all notifications in batches
      const deletePromises = snapshot.docs.map(docSnap =>
        deleteDoc(doc(db, 'notifications', docSnap.id))
      );

      await Promise.all(deletePromises);

      // Clear local state
      setActivities([]);

      // Clear localStorage
      localStorage.removeItem(`eleutherios-activities-${user.uid}`);

      console.log('✓ Successfully cleared all activities');
    } catch (error) {
      console.error('Error clearing activities:', error);
    }
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
      // Fetch policy from Firestore to get subscribers
      const policyRef = doc(db, 'policies', policyId);
      const policySnap = await getDoc(policyRef);

      if (policySnap.exists()) {
        const policyData = policySnap.data();
        // Return subscribers array if it exists, otherwise empty array
        return policyData.subscribers || [];
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
      // Fetch policy from Firestore
      const policyRef = doc(db, 'policies', policyId);
      const policySnap = await getDoc(policyRef);

      if (policySnap.exists()) {
        const policy = policySnap.data();

        policySubscribers.forEach(subscriberId => {
          const authorId = policy.created_by || policy.authorId;
          if (subscriberId !== authorId) { // Don't notify the author
            addActivity({
              type: 'policy_update',
              title: `${policy.name || policy.title} policy updated`,
              description: changeDescription,
              priority: 'medium',
              policyId: policyId,
              targetUserId: subscriberId,
              sourceUserId: authorId
            });
          }
        });
      }
    } catch (error) {
      console.error('Error notifying policy update:', error);
    }
  };

  const notifyForumCreated = async (forumId: string, forumTitle: string, creatorId: string, memberIds: string[]) => {
    try {
      console.log('📢 Creating forum notification:', {
        forumId,
        forumTitle,
        creatorId,
        memberIds
      });

      // Notify the forum creator
      console.log('Creating activity for forum creator:', creatorId);
      await addActivity({
        type: 'forum_created',
        title: 'Forum created successfully',
        description: `You created "${forumTitle}"`,
        priority: 'high',
        forumId: forumId,
        targetUserId: creatorId,
        sourceUserId: creatorId
      });
      console.log('✓ Created activity for forum creator');

      // Notify each member that was added to the forum
      for (const memberId of memberIds) {
        if (memberId !== creatorId) {
          console.log('Creating activity for member:', memberId);
          await addActivity({
            type: 'forum_member_added',
            title: 'Added to a forum',
            description: `You were added to "${forumTitle}"`,
            priority: 'high',
            forumId: forumId,
            targetUserId: memberId,
            sourceUserId: creatorId
          });
          console.log('✓ Created activity for member:', memberId);
        }
      }

      console.log('✓ All forum creation notifications sent successfully');
    } catch (error) {
      console.error('❌ Error notifying forum creation:', error);
      throw error; // Re-throw to let the caller know there was an error
    }
  };

  const notifyRuleCreated = async (forumId: string, ruleTitle: string, creatorId: string) => {
    try {
      // Get forum details
      const forumRef = doc(db, 'forums', forumId);
      const forumSnap = await getDoc(forumRef);

      if (forumSnap.exists()) {
        const forum = forumSnap.data();
        const participants = forum.participants || [];

        // Notify all forum participants except the creator
        for (const participant of participants) {
          if (participant.userId !== creatorId) {
            await addActivity({
              type: 'rule_created',
              title: 'New rule created',
              description: `A new rule "${ruleTitle}" was created in ${forum.title}`,
              priority: 'medium',
              forumId: forumId,
              targetUserId: participant.userId,
              sourceUserId: creatorId
            });
          }
        }
      }
    } catch (error) {
      console.error('Error notifying rule creation:', error);
    }
  };

  const notifyRuleDeleted = async (forumId: string, ruleTitle: string, deletedBy: string) => {
    try {
      // Get forum details
      const forumRef = doc(db, 'forums', forumId);
      const forumSnap = await getDoc(forumRef);

      if (forumSnap.exists()) {
        const forum = forumSnap.data();
        const participants = forum.participants || [];

        // Notify all forum participants except the deleter
        for (const participant of participants) {
          if (participant.userId !== deletedBy) {
            await addActivity({
              type: 'rule_deleted',
              title: 'Rule deleted',
              description: `The rule "${ruleTitle}" was deleted from ${forum.title}`,
              priority: 'medium',
              forumId: forumId,
              targetUserId: participant.userId,
              sourceUserId: deletedBy
            });
          }
        }
      }
    } catch (error) {
      console.error('Error notifying rule deletion:', error);
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
      deleteActivity,
      clearAllActivities,
      unreadCount,
      notifyForumPost,
      notifyServiceStatusChange,
      notifyServicePriceChange,
      notifyServiceAddedToForum,
      notifyPolicyUpdate,
      notifyForumCreated,
      notifyRuleCreated,
      notifyRuleDeleted,
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