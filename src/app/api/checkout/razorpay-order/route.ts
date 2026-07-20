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

    const { items, dbOrderId } = await req.json();

    // 1. Fetch franchise profile linked to user
    const franchise = await prisma.franchise.findUnique({
      where: { userId: session.user.id }
    });
    if (!franchise) {
      return NextResponse.json({ error: 'Franchise profile not found' }, { status: 404 });
    }

    if (dbOrderId) {
      // Find existing order
      const existingOrder = await prisma.order.findUnique({
        where: { id: dbOrderId },
        include: { orderItems: true, proformaInvoice: true }
      });
      if (!existingOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      if (existingOrder.franchiseId !== franchise.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (existingOrder.status !== 'PENDING') {
        return NextResponse.json({ error: 'Order is already paid/cancelled' }, { status: 400 });
      }

      const finalAmount = Number(existingOrder.finalAmount);
      const amountInPaise = Math.round(finalAmount * 100);

      // Trigger Razorpay order creation
      let orderId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
      const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock';

      if (hasKeys) {
        try {
          const option = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: existingOrder.id,
          };
          const razorpayOrder = await razorpay.orders.create(option);
          orderId = razorpayOrder.id;
        } catch (err) {
          console.warn('Razorpay order creation failed, falling back to mock Order ID.', err);
        }
      }

      return NextResponse.json({
        dbOrderId: existingOrder.id,
        proformaId: existingOrder.proformaInvoice?.id,
        orderId,
        amount: finalAmount,
        amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 2. Fetch real prices from database to calculate correct amount
    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 });
      }
      const price = Number(product.price);
      subtotal += price * item.quantity;

      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: price
      });
    }

    const gstAmount = subtotal * 0.18;
    const finalAmount = subtotal + gstAmount;
    
    // Amount in paise (Razorpay expects smallest currency unit, e.g. 100 paise = 1 INR)
    const amountInPaise = Math.round(finalAmount * 100);

    // 3. Generate sequential Proforma number
    const currentYear = new Date().getFullYear();
    const lastProforma = await prisma.proformaInvoice.findFirst({
      where: {
        proformaNumber: {
          startsWith: `PI-${currentYear}-`
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let nextNum = 1;
    if (lastProforma) {
      const lastNumString = lastProforma.proformaNumber.split('-')[2];
      const lastNum = parseInt(lastNumString, 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const proformaNumber = `PI-${currentYear}-${String(nextNum).padStart(6, '0')}`;

    // 4. Save Order and Proforma Invoice in Transaction
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // Valid for 7 days

    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          franchiseId: franchise.id,
          status: 'PENDING',
          totalAmount: subtotal,
          gstAmount,
          finalAmount,
          paymentStatus: 'PENDING',
          orderItems: {
            create: itemsToCreate
          }
        }
      });

      const newProforma = await tx.proformaInvoice.create({
        data: {
          orderId: newOrder.id,
          proformaNumber,
          validUntil,
          status: 'PENDING_PAYMENT'
        }
      });

      return { newOrder, newProforma };
    });

    let orderId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
    const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock';

    if (hasKeys) {
      try {
        const option = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: result.newOrder.id,
        };
        const razorpayOrder = await razorpay.orders.create(option);
        orderId = razorpayOrder.id;
      } catch (err) {
        console.warn('Razorpay order creation failed, falling back to mock Order ID.', err);
      }
    }

    return NextResponse.json({
      dbOrderId: result.newOrder.id,
      proformaId: result.newProforma.id,
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
