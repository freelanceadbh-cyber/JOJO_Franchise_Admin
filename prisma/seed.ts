import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seeding database...');

  // 1. Clear existing data to ensure idempotent seeds
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing records.');

  // 2. Create Users & Franchise
  const salt = await bcrypt.genSalt(10);
  
  // Hashed Passwords
  const adminPasswordHash = await bcrypt.hash('AdminPassword123', salt);
  const franchisePasswordHash = await bcrypt.hash('FranchisePassword123', salt);

  // Admin User (HQ Brand Owner)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jojo.com',
      passwordHash: adminPasswordHash,
      name: 'JoJo Admin HQ',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`Created Admin User: ${admin.email}`);

  // Franchise User (Franchise Owner)
  const franchiseUser = await prisma.user.create({
    data: {
      email: 'franchise1@jojo.com',
      passwordHash: franchisePasswordHash,
      name: 'Nandha Kumar',
      role: 'FRANCHISE_OWNER',
      status: 'ACTIVE',
    },
  });
  console.log(`Created Franchise Owner User: ${franchiseUser.email}`);

  // Create Franchise Profile (with outstanding balance and credit limit)
  const franchise = await prisma.franchise.create({
    data: {
      userId: franchiseUser.id,
      storeName: 'JoJo Ice Creams - Chennai Central',
      gstNumber: '33AABCJ1234F1Z5',
      address: 'Shop No. 12, Express EA Mall, Royapettah, Chennai - 600014',
      contactNumber: '+91 9876543210',
      creditLimit: 150000.00,
      outstandingBalance: 12500.00,
    },
  });
  console.log(`Created Franchise Profile: ${franchise.storeName}`);

  // 3. Create Products (Flavours and Milkshakes from menu)
  const productsData = [
    // --- Ice Cream Scoops & Tubs ---
    {
      name: 'Belgian Dark Chocolate Tub',
      category: 'ICE_CREAM',
      flavor: 'Dark Chocolate',
      description: 'Rich, velvet smooth Belgian dark chocolate ice cream crafted with real cocoa butter.',
      price: 250.00,
      stock: 120,
      isAvailable: true,
    },
    {
      name: 'Alphonso Mango Delight Tub',
      category: 'ICE_CREAM',
      flavor: 'Alphonso Mango',
      description: 'Creamy ice cream made with real Alphonso mango pulp sourced from Ratnagiri.',
      price: 220.00,
      stock: 80,
      isAvailable: true,
    },
    {
      name: 'Madagascar Vanilla Gold Tub',
      category: 'ICE_CREAM',
      flavor: 'Madagascar Vanilla',
      description: 'Classic rich vanilla ice cream flavored with premium Madagascar vanilla beans.',
      price: 180.00,
      stock: 150,
      isAvailable: true,
    },
    {
      name: 'Strawberry Rose Petals Tub',
      category: 'ICE_CREAM',
      flavor: 'Strawberry Rose',
      description: 'Sensational combination of fresh organic strawberries and aromatic rose petal confit.',
      price: 210.00,
      stock: 60,
      isAvailable: true,
    },

    // --- Milkshakes ---
    {
      name: 'Double Chocolate Fudge Shake',
      category: 'MILKSHAKE',
      flavor: 'Chocolate',
      description: 'Decadent chocolate milkshake loaded with chocolate chips and hot fudge drizzle.',
      price: 150.00,
      stock: 100,
      isAvailable: true,
    },
    {
      name: 'Mango Mania Shake',
      category: 'MILKSHAKE',
      flavor: 'Mango',
      description: 'Thick mango milkshake blended with whipped cream and mango chunks.',
      price: 140.00,
      stock: 90,
      isAvailable: true,
    },
    {
      name: 'Creamy Oreo Crunch Shake',
      category: 'MILKSHAKE',
      flavor: 'Oreo & Cream',
      description: 'Creamy vanilla milkshake blended with crunchy Oreo cookie pieces.',
      price: 130.00,
      stock: 110,
      isAvailable: true,
    },

    // --- Exotic Cups & Sundaes ---
    {
      name: 'Exotic Mango Lotus Biscoff Sundae',
      category: 'EXOTIC_CUP',
      flavor: 'Mango & Biscoff',
      description: 'Signature sundae layered with mango pulp, Lotus Biscoff spread, and biscoff cookie crumbs.',
      price: 320.00,
      stock: 45,
      isAvailable: true,
    },
    {
      name: 'Exotic Hazelnut Rocher Fudge',
      category: 'EXOTIC_CUP',
      flavor: 'Hazelnut Chocolate',
      description: 'Gourmet sundae combining hazelnut spread, crushed Ferrero Rocher, and hot fudge.',
      price: 350.00,
      stock: 50,
      isAvailable: true,
    },
  ];

  const dbProducts: any[] = [];
  for (const product of productsData) {
    const createdProduct = await prisma.product.create({ data: product });
    dbProducts.push(createdProduct);
    console.log(`Created Product: ${createdProduct.name} (${createdProduct.category})`);
  }

  // 4. Create Mock Orders for Franchise
  // Order 1: Delivered & Paid
  const order1 = await prisma.order.create({
    data: {
      franchiseId: franchise.id,
      status: 'DELIVERED',
      totalAmount: 1000.00,
      gstAmount: 180.00,
      finalAmount: 1180.00,
      paymentStatus: 'PAID',
    }
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: dbProducts[0].id, quantity: 2, priceAtPurchase: 250.00 }, // Belgian Chocolate
      { orderId: order1.id, productId: dbProducts[2].id, quantity: 2, priceAtPurchase: 180.00 }, // Madagascar Vanilla
      { orderId: order1.id, productId: dbProducts[4].id, quantity: 1, priceAtPurchase: 140.00 }, // Mango Shake
    ]
  });

  // Create Invoice for Order 1
  await prisma.invoice.create({
    data: {
      orderId: order1.id,
      invoiceNumber: 'INV-2026-0001',
      gstDetails: 'CGST 9% + SGST 9%',
    }
  });

  // Create Payment record for Order 1
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 1180.00,
      status: 'PAID',
      paymentId: 'pay_P1A2B3C4D5',
      razorpayOrderId: 'order_O1A2B3C4D5',
      signature: 'sig_S1A2B3C4D5',
    }
  });

  // Create Proforma Invoice for Order 1
  await prisma.proformaInvoice.create({
    data: {
      orderId: order1.id,
      proformaNumber: 'PI-2026-000001',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'PAID'
    }
  });

  // Order 2: Dispatched & Unpaid (Outstanding balance)
  const order2 = await prisma.order.create({
    data: {
      franchiseId: franchise.id,
      status: 'DISPATCHED',
      totalAmount: 10593.22,
      gstAmount: 1906.78,
      finalAmount: 12500.00, // Matching the outstanding balance of the franchise
      paymentStatus: 'PENDING',
    }
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: dbProducts[0].id, quantity: 20, priceAtPurchase: 250.00 },
      { orderId: order2.id, productId: dbProducts[1].id, quantity: 20, priceAtPurchase: 220.00 },
      { orderId: order2.id, productId: dbProducts[7].id, quantity: 10, priceAtPurchase: 320.00 },
    ]
  });

  await prisma.invoice.create({
    data: {
      orderId: order2.id,
      invoiceNumber: 'INV-2026-0002',
      gstDetails: 'CGST 9% + SGST 9%',
    }
  });

  // Order 3: Pending Order with Proforma Invoice
  const order3 = await prisma.order.create({
    data: {
      franchiseId: franchise.id,
      status: 'PENDING',
      totalAmount: 4200.00,
      gstAmount: 756.00,
      finalAmount: 4956.00,
      paymentStatus: 'PENDING',
    }
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order3.id, productId: dbProducts[2].id, quantity: 20, priceAtPurchase: 180.00 },
      { orderId: order3.id, productId: dbProducts[4].id, quantity: 4, priceAtPurchase: 150.00 },
    ]
  });

  await prisma.proformaInvoice.create({
    data: {
      orderId: order3.id,
      proformaNumber: 'PI-2026-000002',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'PENDING_PAYMENT',
    }
  });

  console.log(`Created Mock Orders for store.`);

  // 5. Create Mock Notifications & Announcements (Activities)
  const notificationsData = [
    // --- Activities ---
    {
      userId: franchiseUser.id,
      type: 'ORDER',
      message: 'Order #INV-2026-0002 has been packaged and dispatched. Awaiting delivery confirmation.',
    },
    {
      userId: franchiseUser.id,
      type: 'PAYMENT',
      message: 'Invoice payment of ₹1,180.00 settled successfully for order #INV-2026-0001.',
    },
    {
      userId: franchiseUser.id,
      type: 'ORDER',
      message: 'New store credit account verified. Allotted limit: ₹1,50,000.00.',
    },
    // --- Announcements ---
    {
      userId: franchiseUser.id,
      type: 'SYSTEM',
      message: 'NEW MENU ARRIVAL: Exotic Mango Lotus Biscoff Sundae is now live! Outlets can place orders via the catalog.',
    },
    {
      userId: franchiseUser.id,
      type: 'SYSTEM',
      message: 'FINANCE UPDATE: 18% GST invoice files for Q1 2026 have been generated. Download them under your Order History.',
    },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }
  console.log(`Created Mock Activities & System Announcements.`);

  console.log('Seeding complete! Admin: admin@jojo.com / Franchise: franchise1@jojo.com (Passwords: AdminPassword123 / FranchisePassword123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
