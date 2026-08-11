const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Searching for paid orders missing an invoice...');
    const orders = await prisma.order.findMany({
      where: {
        invoice: { is: null },
        payments: { some: { status: 'PAID' } }
      }
    });

    if (!orders || orders.length === 0) {
      console.log('No paid orders missing invoices found.');
      return;
    }

    const created = [];
    for (const order of orders) {
      const lastInvoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
      let nextNum = 1;
      if (lastInvoice && lastInvoice.invoiceNumber) {
        try {
          const lastNumString = lastInvoice.invoiceNumber.split('-')[2];
          const lastNum = parseInt(lastNumString, 10);
          if (!isNaN(lastNum)) nextNum = lastNum + 1;
        } catch (e) {
          // ignore
        }
      }

      const invoiceNumber = `INV-2026-${String(nextNum).padStart(4, '0')}`;
      const inv = await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          gstDetails: 'GST 5%'
        }
      });
      console.log(`Created invoice ${inv.invoiceNumber} for order ${order.id}`);
      created.push({ orderId: order.id, invoiceNumber: inv.invoiceNumber });
    }

    if (created.length > 0) {
      console.log('\nSummary of created invoices:');
      created.forEach(c => console.log(`${c.orderId} -> ${c.invoiceNumber}`));
    }
  } catch (err) {
    console.error('Error running invoice fixer:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
