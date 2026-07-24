import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting production database initialization...');

  // 1. Ensure HQ Admin User
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jojo.com' },
    update: {},
    create: {
      email: 'admin@jojo.com',
      passwordHash: adminPasswordHash,
      name: 'JoJo Admin HQ',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`Ensured Admin User: ${admin.email}`);

  // 2. Ensure Official Product Catalog (39 products)
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

  let createdCount = 0;
  for (const product of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name, category: product.category }
    });
    if (!existing) {
      await prisma.product.create({ data: product });
      createdCount++;
    }
  }

  console.log(`Product catalog sync complete. (${createdCount} new products added, ${productsData.length} total catalog items)`);
  console.log('Seeding complete! Admin HQ is ready: admin@jojo.com (Password: AdminPassword123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
