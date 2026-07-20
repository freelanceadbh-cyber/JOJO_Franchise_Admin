import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      dbOrderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      items,
    } = await req.json();

    const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock';
    
    // 1. Verify Payment Signature
    if (hasKeys && razorpaySignature && razorpayOrderId && razorpayPaymentId) {
      const text = razorpayOrderId + '|' + razorpayPaymentId;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text)
        .digest('hex');

      if (generated_signature !== razorpaySignature) {
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
      }
    }

    // 2. Fetch franchise profile linked to user
    const franchise = await prisma.franchise.findUnique({
      where: { userId: session.user.id }
    });
    if (!franchise) {
      return NextResponse.json({ error: 'Franchise profile not found' }, { status: 404 });
    }

    // 3. Compute final totals from DB prices (tamper protection)
    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return NextResponse.json({ 
          error: `Product "${item.name || item.productId}" not found in catalog. Please clear your cart and try again.`,
          code: 'PRODUCT_NOT_FOUND'
        }, { status: 400 });
      }
      
      const price = Number(product.price);
      subtotal += price * item.quantity;

      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: price
      });

      // Update product stock level in database
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    const gstAmount = subtotal * 0.18;
    const finalAmount = subtotal + gstAmount;

    // 4. Find and Update the existing Order and Proforma Invoice
    const order = await prisma.order.findUnique({
      where: { id: dbOrderId },
      include: { proformaInvoice: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.franchiseId !== franchise.id) {
      return NextResponse.json({ error: 'Unauthorized order access' }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      // Update order status to CONFIRMED and paymentStatus to PAID
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID'
        }
      });

      // Update associated ProformaInvoice status to PAID
      if (order.proformaInvoice) {
        await tx.proformaInvoice.update({
          where: { id: order.proformaInvoice.id },
          data: {
            status: 'PAID'
          }
        });
      }
    });

    // 5. Create Payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: finalAmount,
        provider: 'RAZORPAY',
        status: 'PAID',
        paymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substring(2, 10),
        razorpayOrderId: razorpayOrderId || 'order_mock_' + Math.random().toString(36).substring(2, 10),
        signature: razorpaySignature || 'sig_mock_' + Math.random().toString(36).substring(2, 10),
      }
    });

    // 6. Generate Compliant Invoice Number sequentially
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let nextNum = 1;
    if (lastInvoice) {
      const lastNumString = lastInvoice.invoiceNumber.split('-')[2];
      const lastNum = parseInt(lastNumString, 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const invoiceNumber = `INV-2026-${String(nextNum).padStart(4, '0')}`;

    await prisma.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        gstDetails: 'CGST 9% + SGST 9%',
      }
    });

    // 7. Log Notifications (Activities)
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'ORDER',
        message: `Order #${invoiceNumber} successfully created and verified via payment ID: ${razorpayPaymentId || 'MOCK_GATEWAY'}.`,
      }
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'PAYMENT',
        message: `Payment of ₹${finalAmount.toFixed(2)} settled for invoice #${invoiceNumber}.`,
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      invoiceNumber
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
