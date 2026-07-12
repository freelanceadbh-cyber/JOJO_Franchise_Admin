import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminMessagesClient from './messages-client';

export default async function AdminMessagesPage() {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  const adminId = session.user.id;

  // 1. Fetch received messages (sent to admin by store users)
  const receivedMessages = await prisma.message.findMany({
    where: { recipientId: adminId },
    include: {
      sender: {
        include: { franchise: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Fetch sent messages (replies sent by admin)
  const sentMessages = await prisma.message.findMany({
    where: { senderId: adminId },
    include: {
      recipient: {
        include: { franchise: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Fetch all registered franchise store users
  const franchises = await prisma.franchise.findMany({
    include: { user: true }
  });

  // Serialize helper
  const serializeMessage = (m: any) => ({
    id: m.id,
    senderId: m.senderId,
    senderName: m.sender.name + ' (' + (m.sender.franchise?.storeName || 'HQ Admin') + ')',
    senderEmail: m.sender.email,
    recipientId: m.recipientId,
    recipientName: m.recipient.name + ' (' + (m.recipient.franchise?.storeName || 'HQ Admin') + ')',
    recipientEmail: m.recipient.email,
    subject: m.subject,
    body: m.body,
    isRead: m.isRead,
    createdAt: m.createdAt.toISOString()
  });

  return (
    <AdminMessagesClient
      inbox={receivedMessages.map(serializeMessage)}
      sent={sentMessages.map(serializeMessage)}
      franchiseUsers={franchises.map((f) => ({
        id: f.user.id,
        name: f.storeName + ' (' + f.user.name + ')',
        email: f.user.email
      }))}
      currentUserId={adminId}
      adminName={session.user.name || 'HQ Admin'}
    />
  );
}
