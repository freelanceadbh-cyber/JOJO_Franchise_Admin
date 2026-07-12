'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Create a new ice cream product / flavor
export async function createProduct(data: {
  name: string;
  category: string;
  flavor: string;
  description: string;
  price: number;
  stock: number;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        flavor: data.flavor,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isAvailable: true
      }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/portal/catalog');
    revalidatePath('/admin');
    
    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error.message };
  }
}

// Update product properties
export async function updateProduct(id: string, data: {
  name: string;
  category: string;
  flavor: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        flavor: data.flavor,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isAvailable: data.isAvailable
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/portal/catalog');
    revalidatePath('/admin');

    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.message };
  }
}

// Delete product from the menu catalog
export async function deleteProduct(id: string): Promise<void> {
  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/portal/catalog');
    revalidatePath('/admin');
  } catch (error: any) {
    console.error('Failed to delete product:', error);
  }
}
