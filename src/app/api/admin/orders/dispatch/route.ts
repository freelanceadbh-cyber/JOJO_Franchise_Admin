import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let orderId: string;
    let estimatedDeliveryDate: string;

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      orderId = formData.get('orderId') as string;
      estimatedDeliveryDate = formData.get('estimatedDeliveryDate') as string;
    } else {
      const body = await request.json();
      orderId = body.orderId;
      estimatedDeliveryDate = body.estimatedDeliveryDate;
    }

    if (!orderId || !estimatedDeliveryDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DISPATCHED',
        estimatedDeliveryDate: new Date(estimatedDeliveryDate)
      }
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to dispatch order:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch order' }, { status: 500 });
  }
}
