'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Send message & write system notification for the recipient
export async function sendMessage(senderId: string, recipientId: string, subject: string, body: string) {
  try {
    const sender = await prisma.user.findUnique({
      where: { id: senderId }
    });
    
    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        subject,
        body,
        isRead: false
      }
    });

    const senderName = sender?.role === 'ADMIN' ? 'HQ Admin' : (sender?.name || 'Franchise Partner');

    // Create system notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'SYSTEM',
        message: `New support message from ${senderName}: "${subject.slice(0, 30)}..."`,
      }
    });

    revalidatePath('/portal/messages');
    revalidatePath('/admin/messages');
    revalidatePath('/portal');
    revalidatePath('/admin');
    
    return { success: true, message };
  } catch (error: any) {
    console.error('Failed to send message:', error);
    return { success: false, error: error.message };
  }
}

// Mark a message as read in the database
export async function markAsRead(messageId: string) {
  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });
    
    revalidatePath('/portal/messages');
    revalidatePath('/admin/messages');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to mark message as read:', error);
    return { success: false, error: error.message };
  }
}
