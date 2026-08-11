const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      franchise: true,
      invoice: true,
      orderItems: { include: { product: true } },
      payments: true
    }
  });
  if (!order) {
    console.error('Order not found');
    return;
  }

  const doc = new PDFDocument({ size: 'A4', margin: 42, bufferPages: true });
  const outPath = path.join(process.cwd(), 'tmp', `invoice-${order.invoice?.invoiceNumber || order.id}.pdf`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // try to load font
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Oceanwide-Semibold.otf');
    doc.font(fontPath);
  } catch (e) {
    console.warn('Failed to load font:', e?.message || e);
  }

  doc.fontSize(18).text('JoJo Ice Creams', { align: 'left' });
  doc.moveDown(0.25);
  doc.fontSize(9).fillColor('#6B7280').text('Corporate Headquarters, Plot 45, Food Tech Park, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032');

  doc.moveDown(0.5);
  doc.fontSize(16).fillColor('#DC143C').text('Tax Invoice', { align: 'right' });
  doc.fontSize(10).fillColor('#111827').text(`Invoice No: ${order.invoice?.invoiceNumber || 'N/A'}`, { align: 'right' });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' });

  doc.moveDown(1.2);
  doc.fontSize(11).fillColor('#111827').text(`Billed To: ${order.franchise.storeName}`);
  doc.fontSize(9).fillColor('#6B7280').text(`Address: ${order.franchise.address}`);

  doc.moveDown(1.3);
  let idx = 1;
  for (const item of order.orderItems) {
    const itemTotal = Number(item.priceAtPurchase) * item.quantity;
    const itemGST = itemTotal * 0.05;
    const itemGrand = itemTotal + itemGST;

    doc.fontSize(9).text(`${idx}. ${item.product.name} (${item.product.flavor}) - Qty: ${item.quantity} - ₹${itemGrand.toFixed(2)}`);
    idx++;
  }

  doc.end();

  stream.on('finish', () => {
    console.log('Wrote PDF to', outPath);
    prisma.$disconnect();
  });
}

const orderId = process.argv[2];
if (!orderId) {
  console.error('Usage: node generate-invoice-pdf.js <orderId>');
  process.exit(1);
}

run(orderId).catch(err => { console.error(err); prisma.$disconnect(); process.exit(1); });
