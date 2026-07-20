import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CatalogClient from './catalog-client';

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const { error: errorParam } = await searchParams;

  let products: any[] = [];
  let franchise: any = null;
  let dbError: string | null = null;

  if (errorParam === 'stale-cart') {
    dbError = 'Your cart contained items that are no longer available. Please review the updated catalog and place a new order.';
  }

  console.log('CatalogPage: Fetching products...');

  try {
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' }
    });
    console.log('CatalogPage: Found', products.length, 'products');

    franchise = await prisma.franchise.findUnique({
      where: { userId: session.user.id }
    });
    console.log('CatalogPage: Franchise:', franchise?.storeName || 'none');
  } catch (error) {
    console.error('Catalog page database error:', error);
    dbError = error instanceof Error ? error.message : 'Database connection failed';
  }

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
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
      dbError={dbError}
    />
  );
}
