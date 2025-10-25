import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * POST /api/cart/checkout
 * Process cart checkout with governance validation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, paymentMethod, forumContext } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing userId',
        },
        { status: 400 }
      );
    }

    // Get cart
    const cartRef = doc(db, 'shopping_carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists() || cartDoc.data().items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart is empty',
        },
        { status: 400 }
      );
    }

    const cartData = cartDoc.data();

    // Validate governance requirements
    if (cartData.summary.requiresApproval && !cartData.governanceInfo.complianceValidated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart requires approval',
          details: 'Some items require governance approval before checkout',
        },
        { status: 400 }
      );
    }

    // Create order
    const orderData = {
      userId,
      items: cartData.items,
      summary: cartData.summary,
      governanceInfo: cartData.governanceInfo,
      paymentMethod: paymentMethod || 'pending',
      forumContext: forumContext || null,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const ordersRef = collection(db, 'orders');
    const orderDoc = await addDoc(ordersRef, orderData);

    // Create governance event
    const eventData = {
      type: 'cart_checkout',
      triggeredBy: userId,
      timestamp: Timestamp.now(),
      details: {
        orderId: orderDoc.id,
        totalItems: cartData.summary.totalItems,
        totalPrice: cartData.summary.totalPrice,
        currency: cartData.summary.currency,
      },
    };

    await addDoc(collection(db, 'governance_events'), eventData);

    // Clear cart
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
      data: {
        orderId: orderDoc.id,
        ...orderData,
        createdAt: orderData.createdAt.toDate().toISOString(),
        updatedAt: orderData.updatedAt.toDate().toISOString(),
      },
      message: 'Checkout successful',
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process checkout',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
