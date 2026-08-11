const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const order = await prisma.order.findFirst({
      where: { invoice: { isNot: null } },
      include: { invoice: true },
      orderBy: { createdAt: 'desc' }
    });
    if (!order) {
      console.log('No orders with invoice found');
      return;
    }
    console.log('Found order:', order.id, 'invoice:', order.invoice?.invoiceNumber);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
