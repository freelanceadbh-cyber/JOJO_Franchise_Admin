import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import MessagesClient from './messages-client';

export default async function MessagesPage() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const userId = session.user.id;

  // 1. Fetch inbox messages (received by user)
  const receivedMessages = await prisma.message.findMany({
    where: { recipientId: userId },
    include: {
      sender: true,
      recipient: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Fetch sent messages (sent by user)
  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    include: {
      sender: true,
      recipient: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Fetch HQ Admin recipients
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true }
  });

  // 4. Fetch store details for display
  const franchise = await prisma.franchise.findUnique({
    where: { userId }
  });

  // Serializing messages for client-side rendering
  const serializeMessage = (m: any) => ({
    id: m.id,
    senderId: m.senderId,
    senderName: m.sender?.name || (m.sender?.role === 'ADMIN' ? 'HQ Admin' : 'Franchise Partner'),
    senderEmail: m.sender?.email || '',
    recipientId: m.recipientId,
    recipientName: m.recipient?.name || (m.recipient?.role === 'ADMIN' ? 'HQ Admin' : 'Franchise Partner'),
    recipientEmail: m.recipient?.email || '',
    subject: m.subject || '',
    body: m.body || '',
    isRead: Boolean(m.isRead),
    createdAt: m.createdAt ? m.createdAt.toISOString() : new Date().toISOString()
  });

  return (
    <MessagesClient
      inbox={receivedMessages.map(serializeMessage)}
      sent={sentMessages.map(serializeMessage)}
      admins={admins}
      currentUserId={userId}
      storeName={franchise?.storeName || 'Outlet'}
    />
  );
}
