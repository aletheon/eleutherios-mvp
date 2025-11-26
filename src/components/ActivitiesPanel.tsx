'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter } from 'next/navigation';

export function ActivitiesPanel() {
  const {
    activitiesPanelOpen,
    setActivitiesPanelOpen,
    activities,
    markActivityAsRead,
    deleteActivity,
    clearAllActivities,
    unreadCount
  } = useDashboard();
  const router = useRouter();

  const handleActivityClick = (activity: any) => {
    markActivityAsRead(activity.id);

    // Handle different activity types and navigate appropriately
    if (activity.forumId) {
      router.push(`/forums/${activity.forumId}`);
    } else if (activity.serviceId) {
      router.push(`/services/${activity.serviceId}`);
    } else if (activity.policyId) {
      router.push(`/policies/${activity.policyId}`);
    }
  };

  const handleDeleteActivity = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation(); // Prevent activity click
    deleteActivity(activityId);
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
            <div className="flex items-center gap-2">
              {activities.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all activities? This cannot be undone.')) {
                      clearAllActivities();
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-gray-200 text-gray-600"
                  title="Clear all activities"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                  </svg>
                </button>
              )}
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
          </div>

          {/* Activities List */}
          <div className="flex-1 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">No activities yet</p>
                <p className="text-xs mt-1 text-gray-400">You'll see notifications here for:</p>
                <ul className="text-xs mt-2 space-y-1 text-left max-w-xs mx-auto text-gray-400">
                  <li>• Forum activities and messages</li>
                  <li>• Policy and rule updates</li>
                  <li>• Service status changes</li>
                  <li>• Purchases and receipts</li>
                  <li>• Favorites and subscriptions</li>
                </ul>
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
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.type.includes('forum') ? 'bg-purple-100 text-purple-700' :
                          activity.type.includes('policy') || activity.type.includes('rule') ? 'bg-green-100 text-green-700' :
                          activity.type.includes('service') || activity.type.includes('price') || activity.type.includes('status') ? 'bg-blue-100 text-blue-700' :
                          activity.type.includes('purchase') ? 'bg-orange-100 text-orange-700' :
                          activity.type.includes('receipt') ? 'bg-teal-100 text-teal-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.type.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={(e) => handleDeleteActivity(e, activity.id)}
                          className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete activity"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
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