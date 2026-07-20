import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seeding database...');

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

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123', salt);
  const franchisePasswordHash = await bcrypt.hash('FranchisePassword123', salt);

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

  const productsData = [
    { name: 'Vanilla', category: 'ICE_CREAM', subcategory: 'Regular', flavor: 'Vanilla', description: 'Classic vanilla (60g)', price: 49.00, stock: 200, isAvailable: true, imageUrl: '/images/flavors/Vannila.jpeg' },
    { name: 'Strawberry', category: 'ICE_CREAM', subcategory: 'Regular', flavor: 'Strawberry', description: 'Fresh strawberry flavor (60g)', price: 49.00, stock: 180, isAvailable: true, imageUrl: '/images/flavors/Strawberry.jpeg' },
    { name: 'Vanilla Choco Chips', category: 'ICE_CREAM', subcategory: 'Regular', flavor: 'Vanilla Choco Chip', description: 'Vanilla with chocolate (60g)', price: 49.00, stock: 180, isAvailable: true, imageUrl: '/images/flavors/Vannila chocoship.jpeg' },

    { name: 'Butterscotch', category: 'ICE_CREAM', subcategory: 'Classic', flavor: 'Butterscotch', description: 'Rich butterscotch flavor (90g)', price: 99.00, stock: 150, isAvailable: true, imageUrl: '/images/flavors/buttercotch.jpeg' },
    { name: 'Black Currant', category: 'ICE_CREAM', subcategory: 'Classic', flavor: 'Black Currant', description: 'Tangy black currant flavor (90g)', price: 99.00, stock: 150, isAvailable: true, imageUrl: '/images/flavors/Blackcurrent.jpeg' },
    { name: 'Kulfi Malai', category: 'ICE_CREAM', subcategory: 'Classic', flavor: 'Kulfi Malai', description: 'Traditional kulfi taste (90g)', price: 99.00, stock: 150, isAvailable: true, imageUrl: '/images/flavors/kulfi malai.jpeg' },
    { name: 'Pista', category: 'ICE_CREAM', subcategory: 'Classic', flavor: 'Pista', description: 'Pistachio delight (90g)', price: 99.00, stock: 150, isAvailable: true, imageUrl: '/images/flavors/Pista.jpeg' },
    { name: 'Chocolate', category: 'ICE_CREAM', subcategory: 'Classic', flavor: 'Chocolate', description: 'Rich chocolate flavor (90g)', price: 99.00, stock: 150, isAvailable: true, imageUrl: '/images/flavors/Chocolate.jpeg' },

    { name: 'Black Forest', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Black Forest', description: 'Cherry and chocolate cake (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Black Forest.jpeg' },
    { name: 'Oreo Freak', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Oreo', description: 'Loaded with Oreo cookies (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/oreo Freak.jpeg' },
    { name: 'Salted Caramel', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Salted Caramel', description: 'Sweet caramel with sea salt (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Salted Caramel.jpeg' },
    { name: 'Basundhi', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Basundi', description: 'Traditional basundi flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/basunthi.jpeg' },
    { name: 'Chocolate Brownie', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Chocolate Brownie', description: 'Rich chocolate with brownie bits (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Chocolate.jpeg' },
    { name: 'Red Velvet', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Red Velvet', description: 'Elegant red velvet cake flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Red Velvet.jpeg' },
    { name: 'Cookies and Cream', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Cookies and Cream', description: 'Vanilla with cookie crumbles (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/cookies and cream.jpeg' },
    { name: 'Rajbhog', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Rajbhog', description: 'Royal rajbhog sweets flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Rajbhog.jpeg' },
    { name: 'Cotton Candy', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Cotton Candy', description: 'Sweet cotton candy delight (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/cotton candy.jpeg' },
    { name: 'Fig and Honey', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Fig and Honey', description: 'Natural fig with golden honey (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/fig and honey.jpeg' },
    { name: 'Chocolate Choco Chips', category: 'ICE_CREAM', subcategory: 'Special', flavor: 'Chocolate Choco Chips', description: 'Rich chocolate with chocolate chips (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Chocolate.jpeg' },

    { name: 'Jackfruit', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Jackfruit', description: 'Sweet tropical jackfruit flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Jackfruit.jpeg' },
    { name: 'Tender Coconut', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Tender Coconut', description: 'Fresh tender coconut water flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Tender coconut.jpeg' },
    { name: 'Meethapaan', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Meethapaan', description: 'Traditional sweet betel leaf essence (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Meethapaan.jpeg' },
    { name: 'Gulkand', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Gulkand', description: 'Rose petal and fruit preserve blend (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Gulkand.jpeg' },
    { name: 'Arabian Dates', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Arabian Dates', description: 'Premium Arabian dates sweetness (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Arabian Dates.jpeg' },
    { name: 'Berry Blast', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Berry Blast', description: 'Mixed berry explosion taste (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Berry Blast.jpeg' },
    { name: 'Berrylicious', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Berrylicious', description: 'Delicious berry medley blend (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Berrylicious.jpeg' },
    { name: 'Blue Berry', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Blueberry', description: 'Premium blueberry flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Blueberry.jpeg' },
    { name: 'Pink Guava', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Pink Guava', description: 'Tropical pink guava delight (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/Pink Guava.jpeg' },
    { name: 'Alphonso Mango', category: 'ICE_CREAM', subcategory: 'Natural', flavor: 'Alphonso Mango', description: 'King of mangoes flavor (90g)', price: 89.00, stock: 120, isAvailable: true, imageUrl: '/images/flavors/alphanso mango.jpeg' },

    { name: 'Choco Almond Fudge', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Choco Almond Fudge', description: 'Rich chocolate with crunchy almonds (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/choco Almond Fudge.jpeg' },
    { name: 'Chocolate Bourbon', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Chocolate Bourbon', description: 'Dark chocolate with bourbon vanilla (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/Chocolate Bourbon.jpeg' },
    { name: 'Red Wine Berry', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Red Wine Berry', description: 'Elegant red wine with berry blend (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/Red Wine Berry.jpeg' },
    { name: 'Hazelnut Nuttella', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Hazelnut Nutella', description: 'Creamy hazelnut spread delight (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/Hazelnut Nutella.jpeg' },
    { name: 'Coffee Almond Fudge', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Coffee Almond Fudge', description: 'Aromatic coffee with almond fudge (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/coffee Almond fudge.jpeg' },
    { name: 'Spanish Delight', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Spanish Delight', description: 'Caramel with Spanish spice (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/spanish delight.jpeg' },
    { name: 'Tiramisu', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Tiramisu', description: 'Italian tiramisu with mascarpone (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/Tiramisu.jpeg' },
    { name: 'Fruits and Nuts', category: 'EXOTIC_CUP', subcategory: 'Exotic', flavor: 'Fruits and Nuts', description: 'Mixed fruits with assorted nuts (90g)', price: 99.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/fruits and nuts.jpeg' },

    { name: 'Lotus Biscoff', category: 'EXOTIC_CUP', subcategory: 'Exotic Special', flavor: 'Lotus Biscoff', description: 'Caramel biscuit with lotus cookie crunch (90g)', price: 125.00, stock: 80, isAvailable: true, imageUrl: '/images/flavors/Lotus Biscoff .jpeg' },

    { name: 'Sugar Free Vanilla', category: 'ICE_CREAM', subcategory: 'Sugar Free', flavor: 'Sugar Free Vanilla', description: 'Pure vanilla with zero sugar (90g)', price: 79.00, stock: 100, isAvailable: true, imageUrl: '/images/flavors/sugar free vannila.jpeg' },
  ];

  const dbProducts: any[] = [];
  for (const product of productsData) {
    const createdProduct = await prisma.product.create({ data: product });
    dbProducts.push(createdProduct);
    console.log(`Created Product: ${createdProduct.name} (${createdProduct.category} - ${createdProduct.subcategory})`);
  }

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
      { orderId: order1.id, productId: dbProducts[0].id, quantity: 2, priceAtPurchase: 49.00 },
      { orderId: order1.id, productId: dbProducts[3].id, quantity: 2, priceAtPurchase: 99.00 },
      { orderId: order1.id, productId: dbProducts[29].id, quantity: 1, priceAtPurchase: 125.00 },
    ]
  });

  await prisma.invoice.create({
    data: {
      orderId: order1.id,
      invoiceNumber: 'INV-2026-0001',
      gstDetails: 'CGST 9% + SGST 9%',
    }
  });

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
      finalAmount: 12500.00,
      paymentStatus: 'PENDING',
    }
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: dbProducts[0].id, quantity: 20, priceAtPurchase: 49.00 },
      { orderId: order2.id, productId: dbProducts[1].id, quantity: 20, priceAtPurchase: 49.00 },
      { orderId: order2.id, productId: dbProducts[29].id, quantity: 10, priceAtPurchase: 125.00 },
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

  const notificationsData = [
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
    {
      userId: franchiseUser.id,
      type: 'SYSTEM',
      message: 'NEW MENU ARRIVAL: Legacy ice cream scoops are now live! Outlets can place orders via the catalog.',
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
