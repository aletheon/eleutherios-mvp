// src/app/forums/[forumId]/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Navigation } from '@/components/Navigation';

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
  serviceId?: string;  // New: Link to a service
  price?: number;      // New: Price if it's a product
  quantity?: number;   // New: Available quantity
}

interface Service {
  id: string;
  name: string;
  type: string;
  description?: string;
  price?: number;
  category?: string;
}

interface Props {
  params: Promise<{ forumId: string }>;
}

export default function ForumDetailPage({ params }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Unwrap the params Promise using React.use()
  const { forumId } = use(params);
  
  // All state declarations
  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);
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
      fetchForum();
      fetchPosts();
      fetchAllServices();
    }
  }, [user, forumId]);

  useEffect(() => {
    if (forum && myServices.length > 0) {
      // Additional logic if needed
    }
  }, [forum, myServices]);

  const fetchForum = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setForum({ id: forumId, ...data });
        }
      }
    } catch (error) {
      console.error('Error fetching forum:', error);
    } finally {
      setLoadingForum(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}/posts.json?auth=${token}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          const postsList = Object.entries(data).map(([id, post]: [string, any]) => ({
            id,
            ...post,
          }));
          setPosts(postsList);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const servicesList = Object.entries(data)
            .map(([id, service]: [string, any]) => ({
              id,
              ...service,
            }))
            .filter((service: any) => service.ownerId === user?.uid);
          setMyServices(servicesList);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Handle adding items to cart
  const handleAddToCart = async (post: Post) => {
    try {
      const service = myServices.find(s => s.id === post.serviceId);
      if (!service) return;

      // Here you would integrate with your cart/payment system
      alert(`Added ${service.name} to cart for $${post.price}`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  // Handle creating posts with services
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || submittingPost) return;

    setSubmittingPost(true);
    try {
      const token = await user?.getIdToken();
      const postData: any = {
        content: newPostContent,
        authorId: user?.uid,
        authorName: user?.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date().toISOString(),
      };

      // Add service data if a service is selected
      if (selectedService) {
        postData.serviceId = selectedService.id;
        if (selectedService.type === 'product' && productPrice) {
          postData.price = parseFloat(productPrice);
        }
      }

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

      if (response.ok) {
        setNewPostContent('');
        setSelectedService(null);
        setProductPrice('');
        setShowServiceSelector(false);
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setSubmittingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forum Header */}
        {loadingForum ? (
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : forum ? (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{forum.title}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {forum.status}
              </span>
            </div>
            <p className="text-gray-600">{forum.description || 'Forum for policy and rule discussions'}</p>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Forum not found</h1>
          </div>
        )}

        {/* Service Avatars and Posts */}
        <div className="space-y-6 mb-8">
          {/* Service Avatars Row */}
          {myServices.length > 0 && (
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Services in this forum:</span>
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
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                  
                  {/* Smart Commerce Interface */}
                  {post.serviceId && (() => {
                    const service = myServices.find(s => s.id === post.serviceId);
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
        </div>

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
                {/* Service Selector */}
                <div className="flex items-center gap-3">
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
                    {selectedService ? `Service: ${selectedService.name}` : 'Attach Service'}
                  </button>
                  
                  {selectedService && (
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
                  )}
                </div>

                {/* Service Selection Dropdown */}
                {showServiceSelector && (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Choose a service to attach:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
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

                {/* Product Price Input */}
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

                {/* Selected Service Preview */}
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
    </div>
  );
}