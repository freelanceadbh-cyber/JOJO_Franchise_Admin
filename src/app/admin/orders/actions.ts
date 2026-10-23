'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateStatus(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        ...(newStatus === 'DELIVERED' ? { paymentStatus: 'PAID' } : {}),
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) return { success: false, error: 'Order not found' };

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      await Promise.all(
        order.orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
        )
      );
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return { success: false, error: 'Failed to cancel order' };
  }
}
