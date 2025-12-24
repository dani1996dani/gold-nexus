// prisma/seed.ts

import { prisma } from '@/lib/db';
import { StockStatus, ProductCategory } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client-runtime-utils';
import { faker } from '@faker-js/faker';

async function main() {
  console.log('Start seeding...');

  // --- CLEAN SLATE (Respecting Foreign Keys) ---
  // console.log('Cleaning existing data...');
  // await prisma.orderItem.deleteMany({});
  // await prisma.order.deleteMany({});
  // await prisma.product.deleteMany({});
  // await prisma.karat.deleteMany({});
  // await prisma.secondHandLead.deleteMany({});
  // console.log('Clean slate achieved.');

  console.log('Seeding Karat values...');
  const karatData = [
    { name: '24K', purity: new Decimal(0.999) },
    { name: '22K', purity: new Decimal(0.9167) },
    { name: '18K', purity: new Decimal(0.75) },
    { name: '14K', purity: new Decimal(0.5833) },
    { name: '10K', purity: new Decimal(0.4167) },
  ];

  for (const k of karatData) {
    await prisma.karat.upsert({
      where: { name: k.name },
      update: {},
      create: {
        name: k.name,
        purity: k.purity,
      },
    });
  }
  console.log('Karat seeding finished.');

  const BAR_IMAGES = [
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/1-oz.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/1-kg.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/10-oz.png',
  ];
  const COIN_IMAGES = [
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/coin.png',
  ];
  const JEWELRY_IMAGES = [
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-JEWELRY-1.png',
  ];

  const categoryImageMap: Record<ProductCategory, string[]> = {
    [ProductCategory.BAR]: BAR_IMAGES,
    [ProductCategory.COIN]: COIN_IMAGES,
    [ProductCategory.JEWELRY]: JEWELRY_IMAGES,
  };

  // Define a type that matches the Prisma Product create input
  type ProductCreateInput = {
    sku: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    karat: string;
    category: ProductCategory;
    imageUrl: string;
    vendorName: string;
    stockStatus: StockStatus;
    isActive: boolean;
    isFeatured: boolean;
  };

  const baseProducts: ProductCreateInput[] = [
    {
      sku: 'GNB-PAMP-1OZ',
      name: '1 oz PAMP Suisse Gold Bar',
      description:
        'The PAMP Suisse 1 oz gold bar represents the pinnacle of Swiss craftsmanship, featuring the iconic Lady Fortuna design. Each bar is individually assayed and sealed in CertiPAMP™ packaging.',
      price: 2689.5,
      weight: 31.1,
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: BAR_IMAGES[0],
      vendorName: 'PAMP Suisse',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
      isFeatured: true,
    },
    {
      sku: 'GNC-EAGLE-1OZ',
      name: '1 oz American Gold Eagle Coin',
      description:
        'The official gold bullion coin of the United States, the American Gold Eagle is cherished by investors and collectors alike. Its 22K composition makes it more durable than pure gold coins.',
      price: 2745.0,
      weight: 31.1,
      karat: '22K',
      category: ProductCategory.COIN,
      imageUrl: COIN_IMAGES[0],
      vendorName: 'US Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
      isFeatured: true,
    },
    {
      sku: 'GNB-PERTH-1KG',
      name: '1 kg Perth Mint Gold Bar',
      description:
        "A benchmark in the precious metals industry, this 1 kg cast bar from the renowned Perth Mint offers a cost-effective way to acquire a substantial amount of gold. Each bar is stamped with the mint's swan logo.",
      price: 84750.0,
      weight: 1000,
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: BAR_IMAGES[1],
      vendorName: 'Perth Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
      isFeatured: true,
    },
    {
      sku: 'GNB-PERTH-10OZ',
      name: '10 oz Perth Mint Gold Bar',
      description:
        "A popular choice for serious investors, the 10 oz Perth Mint gold bar provides a significant store of value with the trust and recognition of one of the world's leading mints.",
      price: 24850.0,
      weight: 311,
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: BAR_IMAGES[2],
      vendorName: 'Perth Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
      isFeatured: true,
    },
  ];

  const allProducts: ProductCreateInput[] = [...baseProducts];

  // Generate 97 more products to reach 101 total
  for (let i = 1; i <= 97; i++) {
    const category = faker.helpers.arrayElement(Object.values(ProductCategory));
    const imageUrl = faker.helpers.arrayElement(categoryImageMap[category]);
    const karat = faker.helpers.arrayElement(['10K', '14K', '18K', '22K', '24K']);

    allProducts.push({
      sku: `GN-${category.substring(0, 1)}-${faker.string.alphanumeric(8).toUpperCase()}`,
      name: `${faker.commerce.productAdjective()} ${karat} Gold ${category.toLowerCase()}`,
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 1000, max: 95000 })),
      weight: faker.number.float({ min: 1, max: 2000, fractionDigits: 2 }),
      karat: karat,
      category: category,
      imageUrl: imageUrl,
      vendorName: faker.company.name(),
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
      isFeatured: false,
    });
  }

  for (const productData of allProducts) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {
        isFeatured: productData.isFeatured,
      },
      create: productData,
    });
  }

  console.log('Seeding finished for 101 products.');

  console.log('Upserting test user...');
  const user = await prisma.user.upsert({
    where: { email: 'bbaron.daniel@gmail.com' },
    update: {},
    create: {
      id: '8e7bec97-aa44-42ab-8ce1-f6cedb9bddd1',
      email: 'bbaron.daniel@gmail.com',
      fullName: 'Daniel Baron',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$mr2LyUzQoaeaXy41n3Sb/A$/r3M579MT+7//7eM9KdT2lfNu6QHpXJTPMElvsKUvxE',
      country: 'Canada',
      phoneNumber: '4374355140',
      role: 'ADMIN',
      createdAt: '2025-12-16T00:24:40.326Z',
      updatedAt: '2025-12-16T00:24:40.326Z',
    },
  });
  console.log(`Upserted user with id: ${user.id}`);

  console.log('Seeding 58 orders...');

  // Fetch all products to link to order items
  const productsInDb = await prisma.product.findMany();

  if (productsInDb.length > 0) {
    const orderPromises = [];
    for (let i = 1; i <= 58; i++) {
      // Create a fake user for each order to have realistic names in the order list
      const fakeUser = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          fullName: faker.person.fullName(),
          password: 'placeholder-hash', // Not for login
          country: faker.location.country(),
          phoneNumber: faker.phone.number(),
          role: 'USER',
        },
      });

      const orderStatus = faker.helpers.arrayElement([
        'UNPAID',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'COMPLETED',
      ]);
      const randomProduct = faker.helpers.arrayElement(productsInDb);

      orderPromises.push(
        prisma.order.create({
          data: {
            userId: fakeUser.id,
            status: orderStatus,
            totalAmount: new Decimal(faker.finance.amount({ min: 500, max: 10000 })),
            createdAt: faker.date.recent({ days: 60 }),
            shippingAddressJson: {
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              zip: faker.location.zipCode(),
              country: faker.location.country(),
            },
            items: {
              create: {
                productId: randomProduct.id,
                quantity: faker.number.int({ min: 1, max: 5 }),
                priceAtPurchase: randomProduct.price,
              },
            },
          },
        })
      );
    }
    await Promise.all(orderPromises);
    console.log('Orders seeded.');
  } else {
    console.warn('No products found to seed orders.');
  }

  console.log('Seeding 58 leads...');

  const leadImages = [
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-JEWELRY-1.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-COIN-1.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-BAR-1.png',
  ];

  const leadPromises = [];
  for (let i = 1; i <= 58; i++) {
    const leadStatus = faker.helpers.arrayElement(['CLOSED', 'CONTACTED', 'SUBMITTED']);

    leadPromises.push(
      prisma.secondHandLead.create({
        data: {
          fullName: faker.person.fullName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          country: faker.location.country(),
          city: faker.location.city(),
          itemType: faker.helpers.arrayElement(['Jewelry', 'Coin', 'Bar', 'Other']),
          estimatedWeight: faker.number.int({ min: 5, max: 100 }),
          estimatedKarat: faker.helpers.arrayElement(['10K', '14K', '18K', '22K', '24K']),
          estimatedValue: new Decimal(faker.finance.amount({ min: 100, max: 5000 })),
          photoUrls: [faker.helpers.arrayElement(leadImages)],
          status: leadStatus,
          createdAt: faker.date.recent({ days: 30 }),
        },
      })
    );
  }
  await Promise.all(leadPromises);
  console.log('Leads seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
