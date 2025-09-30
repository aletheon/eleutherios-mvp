// src/app/forums/[forumId]/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Forum {
  id: string;
  title: string;
  policyId: string;
  ruleId: string;
  status: string;
  description?: string;
}

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  serviceId?: string;
  price?: number;
  quantity?: number;
}

interface Service {
  id: string;
  name: string;
  type: string;
  description?: string;
  price?: number;
  category?: string;
}

interface PageProps {
  params: Promise<{ forumId: string }>;
}

export default function ForumDetailPage({ params }: PageProps) {
  const { user, loading } = useAuth();
  const { addActivity, notifyForumPost } = useDashboard();
  const router = useRouter();
  
  const { forumId } = use(params);
  
  // All state declarations
  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loadingForum, setLoadingForum] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [productPrice, setProductPrice] = useState<string>('');
  const [showServiceSelector, setShowServiceSelector] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && forumId) {
      console.log('User and forumId available, fetching data...');
      fetchForum();
      fetchPosts();
      fetchAllServices();
    }
  }, [user, forumId]);

  const fetchForum = async () => {
    console.log('Fetching forum:', forumId);
    try {
      const token = await user?.getIdToken();
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}.json?auth=${token}`
      );
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Forum data:', data);
        if (data) {
          setForum({ id: forumId, ...data });
        } else {
          console.log('No forum data found');
        }
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching forum:', error);
    } finally {
      console.log('Setting loadingForum to false');
      setLoadingForum(false);
    }
  };

  const fetchPosts = async () => {
    console.log('Fetching posts for forum:', forumId);
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/posts.json?auth=${token}`
      );

      console.log('Posts response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Posts data:', data);
        if (data) {
          const postsList = Object.entries(data).map(([id, post]: [string, any]) => ({
            id,
            ...post,
          }));
          console.log('Processed posts:', postsList);
          setPosts(postsList);
        } else {
          console.log('No posts data found');
        }
      } else {
        console.error('Posts response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      console.log('Setting loadingPosts to false');
      setLoadingPosts(false);
    }
  };

  const fetchAllServices = async () => {
    console.log('Fetching all services...');
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services.json?auth=${token}`
      );
      
      console.log('Services response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Services data:', data);
        if (data) {
          const servicesList = Object.entries(data)
            .map(([id, service]: [string, any]) => ({
              id,
              ...service,
            }));
          
          console.log('All services:', servicesList);
          setAllServices(servicesList);
          
          const myServicesList = servicesList.filter((service: any) => service.ownerId === user?.uid);
          console.log('My services:', myServicesList);
          setMyServices(myServicesList);
        } else {
          console.log('No services data found');
        }
      } else {
        console.error('Services response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleAddToCart = async (post: Post) => {
    try {
      const service = myServices.find(s => s.id === post.serviceId);
      if (!service) return;

      alert(`Added ${service.name} to cart for $${post.price}`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || submittingPost) return;

    setSubmittingPost(true);
    console.log('Submitting post...');
    
    try {
      const token = await user?.getIdToken();
      const postData: any = {
        content: newPostContent,
        authorId: user?.uid,
        authorName: user?.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date().toISOString(),
      };

      if (selectedService) {
        postData.serviceId = selectedService.id;
        if (selectedService.type === 'product' && productPrice) {
          postData.price = parseFloat(productPrice);
        }
      }

      console.log('Post data:', postData);

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/posts.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      );

      console.log('Post submission response:', response.status);

      if (response.ok) {
        console.log('Post submitted successfully');
        
        // Notify forum members about the new post
        if (notifyForumPost) {
          await notifyForumPost(forumId, {
            ...postData,
            forumTitle: forum?.title
          });
        }

        setNewPostContent('');
        setSelectedService(null);
        setProductPrice('');
        setShowServiceSelector(false);
        fetchPosts(); // Refresh posts
      } else {
        console.error('Post submission failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setSubmittingPost(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait...">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const headerActions = (
    <button
      type="button"
      onClick={() => setShowServiceSelector(!showServiceSelector)}
      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="m2 17 10 5 10-5"/>
        <path d="m2 12 10 5 10-5"/>
      </svg>
      Add Service
    </button>
  );

  return (
    <DashboardLayout
      title={forum?.title || 'Forum'}
      subtitle={forum?.description || 'Forum for policy and rule discussions'}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Service Avatars Row */}
        {myServices.length > 0 && (
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="flex -space-x-2">
              {myServices.slice(0, 5).map((service, index) => (
                <div 
                  key={service.id}
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm"
                  title={service.name}
                  style={{ zIndex: myServices.length - index }}
                >
                  {service.name[0]?.toUpperCase()}
                </div>
              ))}
              {myServices.length > 5 && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-xs border-2 border-white">
                  +{myServices.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
        
        {loadingPosts ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No posts yet. Be the first to start the discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  {post.serviceId && (() => {
                    const service = allServices.find(s => s.id === post.serviceId);
                    if (service) {
                      return (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {service.name[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{service.name}</span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {service.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })()}
                  
                  {!post.serviceId && (
                    <>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {post.authorName?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{post.authorName}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                
                {post.serviceId && (() => {
                  const service = allServices.find(s => s.id === post.serviceId);
                  if (service && service.type === 'product') {
                    return (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 font-semibold">
                                {service.name[0]?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <p className="text-sm text-gray-600">Available for purchase</p>
                              {post.price && (
                                <p className="text-lg font-semibold text-green-600">
                                  ${post.price}
                                </p>
                              )}
                            </div>
                          </div>
                          <button 
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            onClick={() => handleAddToCart(post)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1"/>
                              <circle cx="20" cy="21" r="1"/>
                              <path d="m1 1 4 4 13 2 2 13H6"/>
                            </svg>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Post Form with Service Integration */}
        {forum && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Share your thoughts</h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind about this forum topic?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              
              {/* Service Integration Options */}
              <div className="mt-4 space-y-3">
                {selectedService && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedService(null);
                        setProductPrice('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">Posting as: {selectedService.name}</span>
                  </div>
                )}

                {showServiceSelector && (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Choose which service identity to post as:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedService(null);
                          setShowServiceSelector(false);
                        }}
                        className="w-full text-left p-2 hover:bg-white rounded flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">Post as yourself</span>
                          <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                            Personal
                          </span>
                        </div>
                      </button>
                      {myServices.map(service => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setSelectedService(service);
                            setShowServiceSelector(false);
                          }}
                          className="w-full text-left p-2 hover:bg-white rounded flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium">{service.name}</span>
                            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {service.type}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedService && selectedService.type === 'product' && (
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Set price for {selectedService.name}:
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">$</span>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-32 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <span className="text-sm text-green-600">
                        This will show an "Add to Cart" button
                      </span>
                    </div>
                  </div>
                )}

                {selectedService && (
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {selectedService.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">{selectedService.name}</span>
                        <span className="ml-2 text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">
                          {selectedService.type}
                        </span>
                        {selectedService.type === 'product' && productPrice && (
                          <span className="ml-2 text-green-600 font-semibold">${productPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || submittingPost}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}