'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter } from 'next/navigation';

export function ActivitiesPanel() {
  const { 
    activitiesPanelOpen, 
    setActivitiesPanelOpen, 
    activities, 
    markActivityAsRead,
    unreadCount 
  } = useDashboard();
  const router = useRouter();

  const handleActivityClick = (activity: any) => {
    markActivityAsRead(activity.id);
    
    if (activity.type === 'forum_post' && activity.forumId) {
      router.push(`/forums/${activity.forumId}`);
    } else if (activity.type === 'service_update' && activity.serviceId) {
      router.push(`/services/${activity.serviceId}`);
    }
  };

  return (
    <>
      {/* Activities Panel - SLIDES FROM LEFT */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-30 ${
        activitiesPanelOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setActivitiesPanelOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Activities List */}
          <div className="flex-1 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <p className="text-sm">No activities yet</p>
                <p className="text-xs mt-1">Your forum posts, messages, and updates will appear here</p>
              </div>
            ) : (
              <div className="p-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivityClick(activity)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 border transition-colors ${
                      activity.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                        {activity.title}
                      </h4>
                      {!activity.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                        {new Date(activity.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {activity.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay (when panel is open) */}
      {activitiesPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20"
          onClick={() => setActivitiesPanelOpen(false)}
        />
      )}
    </>
  );
}