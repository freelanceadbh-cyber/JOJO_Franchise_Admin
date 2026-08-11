import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';
import path from 'path';

export const runtime = 'nodejs';

function createPdfBuffer(doc: InstanceType<typeof PDFDocument>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer | Uint8Array) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    let order = await prisma.order.findUnique({
      where: { id },
      include: {
        franchise: true,
        invoice: true,
        orderItems: {
          include: { product: true }
        },
        payments: true
      }
    });

    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    // If invoice missing but payment exists, auto-create the invoice so download works.
    const hasPaid = order.payments && order.payments.some((p) => p.status === 'PAID');
    if (!order.invoice && hasPaid) {
      // Generate next invoice number
      const lastInvoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
      let nextNum = 1;
      if (lastInvoice) {
        try {
          const lastNumString = lastInvoice.invoiceNumber.split('-')[2];
          const lastNum = parseInt(lastNumString, 10);
          if (!isNaN(lastNum)) nextNum = lastNum + 1;
        } catch (e) {
          // ignore parsing errors and fallback to 1
        }
      }
      const invoiceNumber = `INV-2026-${String(nextNum).padStart(4, '0')}`;

      await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          gstDetails: 'GST 5%'
        }
      });

      // Re-load order with invoice
      order = await prisma.order.findUnique({
        where: { id },
        include: {
          franchise: true,
          invoice: true,
          orderItems: { include: { product: true } },
          payments: true
        }
      });
    }

    if (!order || !order.invoice) {
      return new Response('Invoice not found', { status: 404 });
    }

    if (session.user.role !== 'ADMIN' && order.franchise.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

  const doc = new PDFDocument({ size: 'A4', margin: 42, bufferPages: true });
  // Prefer using a bundled TTF/OTF font to avoid AFM lookups (which can fail in Next's dev build)
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Oceanwide-Semibold.otf');
    doc.font(fontPath);
  } catch (e) {
    // fallback to default - PDFKit may attempt to load AFM files
    // eslint-disable-next-line no-console
    console.warn('[invoice.pdf] failed to load bundled font, falling back to default:', (e as any)?.message ?? e);
  }
  const pdfPromise = createPdfBuffer(doc);

  doc.fontSize(18).fillColor('#111827').text('JoJo Ice Creams', { align: 'left' });
  doc.moveDown(0.25);
  doc.fontSize(9).fillColor('#6B7280').text('Corporate Headquarters, Plot 45, Food Tech Park, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032');
  doc.text('GSTIN: 33AAACJ9401F1ZX | Email: hq@jojo.com');

  doc.moveDown(0.5);
  doc.fontSize(16).fillColor('#DC143C').text('Tax Invoice', { align: 'right' });
  doc.fontSize(10).fillColor('#111827').text(`Invoice No: ${order.invoice.invoiceNumber}`, { align: 'right' });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' });
  doc.text('GST: 5%', { align: 'right' });

  doc.moveDown(1.2);
  doc.fontSize(11).fillColor('#111827').text(`Billed To: ${order.franchise.storeName}`);
  doc.fontSize(9).fillColor('#6B7280').text(`Owner: ${order.franchise.userId}`);
  doc.text(`Address: ${order.franchise.address}`);
  doc.text(`Phone: ${order.franchise.contactNumber}`);
  doc.text(`GSTIN: ${order.franchise.gstNumber}`);

  const startY = doc.y + 18;
  doc.moveTo(42, startY).lineTo(553, startY).strokeColor('#E5E7EB').stroke();
  doc.y = startY + 10;

  doc.fontSize(10).fillColor('#111827');
  doc.text('#', 42, doc.y, { width: 18 });
  doc.text('Description', 62, doc.y, { width: 200 });
  doc.text('Qty', 300, doc.y, { width: 32, align: 'right' });
  doc.text('Taxable', 350, doc.y, { width: 64, align: 'right' });
  doc.text('GST', 424, doc.y, { width: 48, align: 'right' });
  doc.text('Total', 480, doc.y, { width: 64, align: 'right' });

  doc.moveDown(0.5);
  doc.moveTo(42, doc.y).lineTo(553, doc.y).strokeColor('#CBD5E1').stroke();
  doc.moveDown(0.4);

  let index = 1;
  for (const item of order.orderItems) {
    const itemTotal = Number(item.priceAtPurchase) * item.quantity;
    const itemGST = itemTotal * 0.05;
    const itemGrand = itemTotal + itemGST;

    doc.fontSize(9).fillColor('#111827');
    doc.text(String(index), 42, doc.y, { width: 18 });
    doc.text(`${item.product.name} (${item.product.flavor})`, 62, doc.y, { width: 200 });
    doc.text(String(item.quantity), 300, doc.y, { width: 32, align: 'right' });
    doc.text(`₹${itemTotal.toFixed(2)}`, 350, doc.y, { width: 64, align: 'right' });
    doc.text(`₹${itemGST.toFixed(2)}`, 424, doc.y, { width: 48, align: 'right' });
    doc.text(`₹${itemGrand.toFixed(2)}`, 480, doc.y, { width: 64, align: 'right' });
    doc.moveDown(1.1);
    index += 1;
  }

  const subtotal = Number(order.totalAmount);
  const gstAmount = Number(order.gstAmount);
  const finalAmount = Number(order.finalAmount);
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const summaryTop = Math.max(doc.y + 12, 530);
  doc.y = summaryTop;
  doc.moveTo(42, summaryTop).lineTo(553, summaryTop).strokeColor('#E5E7EB').stroke();
  doc.y = summaryTop + 12;

  doc.fontSize(10).fillColor('#111827').text(`Items: ${order.orderItems.length}`, 42, doc.y);
  doc.text(`Total Quantity: ${totalQuantity}`, 220, doc.y);
  doc.text(`Taxable Value: ₹${subtotal.toFixed(2)}`, 360, doc.y, { align: 'right' });
  doc.moveDown(0.8);
  doc.text(`GST (5%): ₹${gstAmount.toFixed(2)}`, 360, doc.y, { align: 'right' });
  doc.moveDown(0.8);
  doc.fontSize(12).fillColor('#DC143C').text(`Grand Total: ₹${finalAmount.toFixed(2)}`, 360, doc.y, { align: 'right' });

  doc.moveDown(1.3);
  doc.fontSize(8).fillColor('#6B7280').text('This is a system-generated invoice. Keep this copy for accounting and delivery verification.', { align: 'center' });

  doc.end();
  const pdfBuffer = await pdfPromise;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${order.invoice.invoiceNumber}.pdf"`,
      'Content-Length': String(pdfBuffer.length),
      'Cache-Control': 'no-store',
    },
  });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[invoice.pdf] generation error', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}