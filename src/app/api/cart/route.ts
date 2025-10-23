import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * GET /api/cart?userId=xxx
 * Get user's shopping cart
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing userId parameter',
        },
        { status: 400 }
      );
    }

    const cartRef = doc(db, 'shopping_carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      // Return empty cart if none exists
      return NextResponse.json({
        success: true,
        data: {
          userId,
          items: [],
          summary: {
            totalItems: 0,
            totalPrice: 0,
            currency: 'USD',
            requiresApproval: false,
          },
          governanceInfo: {
            applicablePolicies: [],
            complianceValidated: false,
            auditTrail: [],
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cartDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart or update cart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, item } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing userId',
        },
        { status: 400 }
      );
    }

    const cartRef = doc(db, 'shopping_carts', userId);
    const cartDoc = await getDoc(cartRef);

    let cartData;

    if (!cartDoc.exists()) {
      // Create new cart
      cartData = {
        userId,
        items: [],
        summary: {
          totalItems: 0,
          totalPrice: 0,
          currency: 'USD',
          requiresApproval: false,
        },
        governanceInfo: {
          applicablePolicies: [],
          complianceValidated: false,
          auditTrail: [],
        },
      };
    } else {
      cartData = cartDoc.data();
    }

    // Handle different actions
    switch (action) {
      case 'add':
        if (!item) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing item data',
            },
            { status: 400 }
          );
        }
        // Add item to cart
        cartData.items.push({
          ...item,
          addedAt: new Date().toISOString(),
        });
        break;

      case 'remove':
        if (!item || !item.serviceId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing serviceId',
            },
            { status: 400 }
          );
        }
        // Remove item from cart
        cartData.items = cartData.items.filter(
          (i: any) => i.serviceId !== item.serviceId
        );
        break;

      case 'update':
        if (!item || !item.serviceId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing serviceId',
            },
            { status: 400 }
          );
        }
        // Update item quantity or other properties
        const itemIndex = cartData.items.findIndex(
          (i: any) => i.serviceId === item.serviceId
        );
        if (itemIndex >= 0) {
          cartData.items[itemIndex] = {
            ...cartData.items[itemIndex],
            ...item,
          };
        }
        break;

      case 'clear':
        // Clear all items
        cartData.items = [];
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            details: 'action must be one of: add, remove, update, clear',
          },
          { status: 400 }
        );
    }

    // Recalculate summary
    cartData.summary.totalItems = cartData.items.length;
    cartData.summary.totalPrice = cartData.items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    cartData.summary.requiresApproval = cartData.items.some(
      (item: any) => item.requiresApproval
    );

    // Save cart
    await setDoc(cartRef, cartData);

    return NextResponse.json({
      success: true,
      data: cartData,
      message: `Cart ${action} successful`,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart?userId=xxx
 * Clear user's cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing userId parameter',
        },
        { status: 400 }
      );
    }

    const cartRef = doc(db, 'shopping_carts', userId);
    await setDoc(cartRef, {
      userId,
      items: [],
      summary: {
        totalItems: 0,
        totalPrice: 0,
        currency: 'USD',
        requiresApproval: false,
      },
      governanceInfo: {
        applicablePolicies: [],
        complianceValidated: false,
        auditTrail: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cart',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
