import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CheckoutClient from './checkout-client';

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const franchise = await prisma.franchise.findUnique({
    where: { userId: session.user.id }
  });

  if (!franchise) {
    redirect('/portal');
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
    />
  );
}
