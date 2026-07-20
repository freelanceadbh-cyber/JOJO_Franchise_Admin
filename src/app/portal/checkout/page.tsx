import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CheckoutClient from './checkout-client';

interface CheckoutPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const { orderId } = await searchParams;

  const franchise = await prisma.franchise.findUnique({
    where: { userId: session.user.id }
  });

  if (!franchise) {
    redirect('/portal');
  }

  let preloadedItems = undefined;
  let preloadedOrderId = undefined;

  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (order && order.franchiseId === franchise.id && order.status === 'PENDING') {
      preloadedOrderId = order.id;
      preloadedItems = order.orderItems.map(item => ({
        productId: item.productId,
        name: item.product.name,
        category: item.product.category,
        price: Number(item.priceAtPurchase),
        quantity: item.quantity,
        flavor: item.product.flavor,
        imageUrl: item.product.imageUrl
      }));
    }
  }

  return (
    <CheckoutClient
      franchiseDetails={{
        storeName: franchise.storeName,
        gstNumber: franchise.gstNumber,
        address: franchise.address,
        contactNumber: franchise.contactNumber,
        email: session.user.email || '',
        name: session.user.name || ''
      }}
      preloadedItems={preloadedItems}
      preloadedOrderId={preloadedOrderId}
    />
  );
}
