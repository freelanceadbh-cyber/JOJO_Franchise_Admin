import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Fetch real prices from database to calculate correct amount
    let subtotal = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 });
      }
      subtotal += Number(product.price) * item.quantity;
    }

    const gstAmount = subtotal * 0.18;
    const finalAmount = subtotal + gstAmount;
    
    // Amount in paise (Razorpay expects smallest currency unit, e.g. 100 paise = 1 INR)
    const amountInPaise = Math.round(finalAmount * 100);

    let orderId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
    const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock';

    if (hasKeys) {
      try {
        const option = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: 'receipt_order_' + Date.now(),
        };
        const razorpayOrder = await razorpay.orders.create(option);
        orderId = razorpayOrder.id;
      } catch (err) {
        console.warn('Razorpay order creation failed, falling back to mock Order ID.', err);
      }
    }

    return NextResponse.json({
      orderId,
      amount: finalAmount,
      amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
