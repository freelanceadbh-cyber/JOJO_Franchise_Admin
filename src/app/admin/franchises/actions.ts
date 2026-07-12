'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// Create a new franchise (atomic transaction creating User + Franchise record)
export async function createFranchise(data: {
  name: string;
  email: string;
  passwordRaw: string;
  storeName: string;
  gstNumber: string;
  address: string;
  contactNumber: string;
  creditLimit: number;
}) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.passwordRaw, salt);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create credential user profile
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hash,
          name: data.name,
          role: 'FRANCHISE_OWNER',
          status: 'ACTIVE'
        }
      });

      // 2. Create franchise metadata profile linked to user
      const franchise = await tx.franchise.create({
        data: {
          userId: user.id,
          storeName: data.storeName,
          gstNumber: data.gstNumber,
          address: data.address,
          contactNumber: data.contactNumber,
          creditLimit: data.creditLimit,
          outstandingBalance: 0
        }
      });

      return { user, franchise };
    });

    revalidatePath('/admin/franchises');
    revalidatePath('/admin');

    return { success: true, franchise: result.franchise };
  } catch (error: any) {
    console.error('Failed to create franchise:', error);
    return { success: false, error: error.message };
  }
}

// Update franchise credit limits, store names, and user account status
export async function updateFranchise(id: string, data: {
  storeName: string;
  gstNumber: string;
  address: string;
  contactNumber: string;
  creditLimit: number;
  outstandingBalance: number;
  status: string; // ACTIVE or INACTIVE
}) {
  try {
    const franchise = await prisma.franchise.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!franchise) {
      return { success: false, error: 'Franchise profile not found.' };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update franchise specifications
      await tx.franchise.update({
        where: { id },
        data: {
          storeName: data.storeName,
          gstNumber: data.gstNumber,
          address: data.address,
          contactNumber: data.contactNumber,
          creditLimit: data.creditLimit,
          outstandingBalance: data.outstandingBalance
        }
      });

      // 2. Update user status
      await tx.user.update({
        where: { id: franchise.userId },
        data: {
          status: data.status
        }
      });
    });

    revalidatePath('/admin/franchises');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update franchise:', error);
    return { success: false, error: error.message };
  }
}

// Delete franchise from registry (cascade clears user, messages, notifications)
export async function deleteFranchise(id: string): Promise<void> {
  try {
    const franchise = await prisma.franchise.findUnique({
      where: { id }
    });

    if (!franchise) {
      return;
    }

    // Deleting the franchise user will trigger cascaded deletion in database
    await prisma.user.delete({
      where: { id: franchise.userId }
    });

    revalidatePath('/admin/franchises');
    revalidatePath('/admin');
  } catch (error: any) {
    console.error('Failed to delete franchise:', error);
  }
}
