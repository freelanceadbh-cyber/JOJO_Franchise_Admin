'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { isRead: true }
    });
    revalidatePath('/portal');
    return { success: true };
  } catch (error) {
    console.error('Error marking notification read:', error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true }
    });
    revalidatePath('/portal');
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return { success: false };
  }
}
