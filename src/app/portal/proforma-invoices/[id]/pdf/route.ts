import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';

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
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await params;

  const proforma = await prisma.proformaInvoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          franchise: true,
          orderItems: {
            include: { product: true }
          }
        }
      }
    }
  });

  if (!proforma) {
    return new Response('Proforma invoice not found', { status: 404 });
  }

  if (session.user.role !== 'ADMIN' && proforma.order.franchise.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  const doc = new PDFDocument({ size: 'A4', margin: 42 });
  const pdfPromise = createPdfBuffer(doc);

  const subtotal = Number(proforma.order.totalAmount);
  const gstAmount = Number(proforma.order.gstAmount);
  const finalAmount = Number(proforma.order.finalAmount);
  const totalQuantity = proforma.order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  doc.fontSize(18).fillColor('#111827').text('JoJo Ice Creams', { align: 'left' });
  doc.moveDown(0.25);
  doc.fontSize(9).fillColor('#6B7280').text('Corporate Headquarters, Plot 45, Food Tech Park, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032');
  doc.text('GSTIN: 33AAACJ9401F1ZX | Email: hq@jojo.com');

  doc.moveDown(0.5);
  doc.fontSize(16).fillColor('#DC143C').text('Proforma Invoice', { align: 'right' });
  doc.fontSize(10).fillColor('#111827').text(`Proforma No: ${proforma.proformaNumber}`, { align: 'right' });
  doc.text(`Date: ${new Date(proforma.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' });
  doc.text(`Valid Until: ${new Date(proforma.validUntil).toLocaleDateString('en-IN')}`, { align: 'right' });
  doc.text(`Status: ${proforma.status.replace('_', ' ')}`, { align: 'right' });

  doc.moveDown(1.2);
  doc.fontSize(11).fillColor('#111827').text(`Billed To: ${proforma.order.franchise.storeName}`);
  doc.fontSize(9).fillColor('#6B7280').text(`Address: ${proforma.order.franchise.address}`);
  doc.text(`Phone: ${proforma.order.franchise.contactNumber}`);
  doc.text(`GSTIN: ${proforma.order.franchise.gstNumber}`);

  const startY = doc.y + 18;
  doc.moveTo(42, startY).lineTo(553, startY).strokeColor('#E5E7EB').stroke();
  doc.y = startY + 10;

  doc.fontSize(10).fillColor('#111827');
  doc.text('#', 42, doc.y, { width: 18 });
  doc.text('Description', 62, doc.y, { width: 220 });
  doc.text('Qty', 300, doc.y, { width: 32, align: 'right' });
  doc.text('Taxable', 350, doc.y, { width: 64, align: 'right' });
  doc.text('GST', 424, doc.y, { width: 48, align: 'right' });
  doc.text('Total', 480, doc.y, { width: 64, align: 'right' });

  doc.moveDown(0.5);
  doc.moveTo(42, doc.y).lineTo(553, doc.y).strokeColor('#CBD5E1').stroke();
  doc.moveDown(0.4);

  let index = 1;
  for (const item of proforma.order.orderItems) {
    const itemTotal = Number(item.priceAtPurchase) * item.quantity;
    const itemGST = itemTotal * 0.05;
    const itemGrand = itemTotal + itemGST;

    doc.fontSize(9).fillColor('#111827');
    doc.text(String(index), 42, doc.y, { width: 18 });
    doc.text(`${item.product.name} (${item.product.flavor})`, 62, doc.y, { width: 220 });
    doc.text(String(item.quantity), 300, doc.y, { width: 32, align: 'right' });
    doc.text(`₹${itemTotal.toFixed(2)}`, 350, doc.y, { width: 64, align: 'right' });
    doc.text(`₹${itemGST.toFixed(2)}`, 424, doc.y, { width: 48, align: 'right' });
    doc.text(`₹${itemGrand.toFixed(2)}`, 480, doc.y, { width: 64, align: 'right' });
    doc.moveDown(1.1);
    index += 1;
  }

  const summaryTop = Math.max(doc.y + 12, 530);
  doc.y = summaryTop;
  doc.moveTo(42, summaryTop).lineTo(553, summaryTop).strokeColor('#E5E7EB').stroke();
  doc.y = summaryTop + 12;

  doc.fontSize(10).fillColor('#111827').text(`Items: ${proforma.order.orderItems.length}`, 42, doc.y);
  doc.text(`Total Quantity: ${totalQuantity}`, 220, doc.y);
  doc.text(`Taxable Value: ₹${subtotal.toFixed(2)}`, 360, doc.y, { align: 'right' });
  doc.moveDown(0.8);
  doc.text(`GST (5%): ₹${gstAmount.toFixed(2)}`, 360, doc.y, { align: 'right' });
  doc.moveDown(0.8);
  doc.fontSize(12).fillColor('#DC143C').text(`Grand Total: ₹${finalAmount.toFixed(2)}`, 360, doc.y, { align: 'right' });

  doc.moveDown(1.3);
  doc.fontSize(8).fillColor('#6B7280').text('This is a system-generated proforma invoice. Payment settlement is required before the final tax invoice is issued.', { align: 'center' });

  doc.end();
  const pdfBuffer = await pdfPromise;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="proforma-${proforma.proformaNumber}.pdf"`,
      'Content-Length': String(pdfBuffer.length),
      'Cache-Control': 'no-store',
    },
  });
}