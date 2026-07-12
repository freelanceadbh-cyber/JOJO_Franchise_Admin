import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CatalogClient from './catalog-client';

export default async function CatalogPage() {
  const session = await auth();

  // Route security guard
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  // Fetch available products
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { category: 'asc' }
  });

  // Find franchise store name
  const franchise = await prisma.franchise.findUnique({
    where: { userId: session.user.id }
  });

  // Serialize Decimals to numbers for client-side rendering
  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    flavor: p.flavor,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    imageUrl: p.imageUrl,
    isAvailable: p.isAvailable
  }));

  return (
    <CatalogClient
      initialProducts={serializedProducts}
      userName={session.user.name || 'Partner'}
      storeName={franchise?.storeName || 'JoJo Ice Creams Outlet'}
    />
  );
}
