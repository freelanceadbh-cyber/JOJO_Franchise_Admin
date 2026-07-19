import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, category: true, subcategory: true, isAvailable: true }
    });
    return NextResponse.json({ count, products: products.slice(0, 5) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
