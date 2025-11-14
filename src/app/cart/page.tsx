'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth, CartItem } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user, logout, removeFromCart, updateCartItem, clearCart } = useAuth();
  const router = useRouter();

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

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.profile?.name) return '?';
    const names = user.profile.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'medication': return 'bg-red-100 text-red-800';
      case 'healthcare': return 'bg-blue-100 text-blue-800';
      case 'dental': return 'bg-green-100 text-green-800';
      case 'mental-health': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    try {
      setRemoving(itemId);
      await removeFromCart(itemId);
    } catch (error: any) {
      alert(error.message || 'Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      await updateCartItem(itemId, { quantity: newQuantity });
    } catch (error: any) {
      alert(error.message || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    try {
      await clearCart();
    } catch (error: any) {
      alert(error.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const cartItems = user?.profile?.shoppingCart || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const canRemoveItem = (item: CartItem) => item.permissions.canRemove.includes(user?.uid || '');
  const canModifyItem = (item: CartItem) => item.permissions.canModify.includes(user?.uid || '');

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
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
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
            <Link href="/cart" className="text-white p-2 rounded-lg bg-white/20 relative">
              <span className="material-icons text-2xl">shopping_cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Dropdown Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-icons text-2xl">account_circle</span>
                <span className="text-sm font-medium uppercase">{getUserInitials()}</span>
                <span className="material-icons text-lg">
                  {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[200]" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}>
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.profile?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">person</span>
                      Profile
                    </Link>

                    <Link
                      href="/policies"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">account_balance</span>
                      My Policies ({user?.profile?.activities?.policies?.length || 0})
                    </Link>

                    <Link
                      href="/services"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">build</span>
                      My Services ({user?.profile?.activities?.services?.length || 0})
                    </Link>

                    <Link
                      href="/forums"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">forum</span>
                      My Forums ({user?.profile?.activities?.forums?.length || 0})
                    </Link>

                    <Link
                      href="/cart"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">shopping_cart</span>
                      Shopping Cart ({cartItems.length})
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span className="material-icons text-lg mr-3">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
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
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                Governance-enabled cart with permission-based modifications. Items are added by healthcare providers through policy-governed forums.
              </p>
            </div>
            {cartItems.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClearCart}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <span className="material-icons text-lg">delete_sweep</span>
                  <span>Clear Cart</span>
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <span className="material-icons text-lg">payment</span>
                  <span>Proceed to Checkout (${cartTotal.toFixed(2)})</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Items or Empty State */}
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Authorized providers can add services and items to your cart through forums.
              </p>
              <Link
                href="/forums"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <span className="material-icons">forum</span>
                <span>View Forums</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">
                          {item.category === 'medication' ? '💊' :
                           item.category === 'healthcare' ? '🏥' :
                           item.category === 'dental' ? '🦷' : '🔧'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.serviceName}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                          {/* Metadata (dosage, frequency, etc.) */}
                          {item.metadata && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <h4 className="text-xs font-semibold text-blue-900 mb-2">Delivery Details:</h4>
                              <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                                {item.metadata.dosage && (
                                  <div><span className="font-medium">Dosage:</span> {item.metadata.dosage}</div>
                                )}
                                {item.metadata.frequency && (
                                  <div><span className="font-medium">Frequency:</span> {item.metadata.frequency}</div>
                                )}
                                {item.metadata.duration && (
                                  <div><span className="font-medium">Duration:</span> {item.metadata.duration}</div>
                                )}
                                {item.metadata.notes && (
                                  <div className="col-span-2"><span className="font-medium">Notes:</span> {item.metadata.notes}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Governance Info */}
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <span className="material-icons text-sm">person</span>
                              <span>Added by: <span className="font-medium text-gray-700">{item.addedByName}</span></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="material-icons text-sm">business</span>
                              <span>Provider: <span className="font-medium text-gray-700">{item.provider}</span></span>
                            </div>
                            {item.forumId && (
                              <div className="flex items-center space-x-2">
                                <span className="material-icons text-sm">forum</span>
                                <Link href={`/forums/${item.forumId}`} className="text-blue-600 hover:underline">
                                  View forum
                                </Link>
                              </div>
                            )}
                            {item.policyId && (
                              <div className="flex items-center space-x-2">
                                <span className="material-icons text-sm">account_balance</span>
                                <Link href={`/policies/${item.policyId}`} className="text-purple-600 hover:underline">
                                  View governing policy
                                </Link>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className="material-icons text-sm">schedule</span>
                              <span>Added: {new Date(item.addedAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="ml-6 text-right space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={!canModifyItem(item) || updating === item.id || item.quantity <= 1}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={!canModifyItem(item) || updating === item.id}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={!canRemoveItem(item) || removing === item.id}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <span className="material-icons text-sm">delete</span>
                        <span>{removing === item.id ? 'Removing...' : 'Remove'}</span>
                      </button>

                      {!canRemoveItem(item) && (
                        <p className="text-xs text-gray-500">
                          Contact {item.addedByName} to remove
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cart Summary</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)} {cartItems[0]?.currency || 'NZD'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <span className="material-icons">payment</span>
                  <span>Proceed to Checkout</span>
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">About Governance-Enabled Cart</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Your shopping cart is governed by the policies and permissions established in your forums.
                  Authorized providers can add items, and you can approve or request changes through the forum.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-800 mb-1">🔒 Permission-Based</div>
                    <div className="text-gray-600">Only authorized providers can add items</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-800 mb-1">📋 Policy-Governed</div>
                    <div className="text-gray-600">All items linked to governance policies</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-800 mb-1">💬 Forum-Linked</div>
                    <div className="text-gray-600">Trace items back to forums</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
