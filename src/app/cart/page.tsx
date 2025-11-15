'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth, CartItem } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function CartPage() {
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user, removeFromCart, updateCartItem, clearCart } = useAuth();
  const router = useRouter();

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
      <Navigation />

      {/* Main Content */}
      <main className="p-6 min-h-screen bg-gray-50">
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
