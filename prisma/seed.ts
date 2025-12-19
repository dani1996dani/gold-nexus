// prisma/seed.ts

import { prisma } from '@/lib/db';
import { StockStatus, ProductCategory } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client-runtime-utils';
import { faker } from '@faker-js/faker';

async function main() {
  console.log('Start seeding...');
  
  console.log('Seeding Karat values...');
  // await prisma.karat.deleteMany({});
  const karatData = [
    { name: '24K', purity: new Decimal(0.999) },
    { name: '22K', purity: new Decimal(0.9167) },
    { name: '18K', purity: new Decimal(0.7500) },
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

  // await prisma.product.deleteMany({});
  // console.log('Deleted existing products.');

  const products = [
    {
      sku: 'GNB-PAMP-1OZ',
      name: '1 oz PAMP Suisse Gold Bar',
      description: 'The PAMP Suisse 1 oz gold bar represents the pinnacle of Swiss craftsmanship, featuring the iconic Lady Fortuna design. Each bar is individually assayed and sealed in CertiPAMP™ packaging.',
      price: 2689.5,
      weight: '1 oz',
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: 'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/1-oz.png',
      vendorName: 'PAMP Suisse',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
    },
    {
      sku: 'GNC-EAGLE-1OZ',
      name: '1 oz American Gold Eagle Coin',
      description: 'The official gold bullion coin of the United States, the American Gold Eagle is cherished by investors and collectors alike. Its 22K composition makes it more durable than pure gold coins.',
      price: 2745.0,
      weight: '1 oz',
      karat: '22K',
      category: ProductCategory.COIN,
      imageUrl: 'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/coin.png',
      vendorName: 'US Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
    },
    {
      sku: 'GNB-PERTH-1KG',
      name: '1 kg Perth Mint Gold Bar',
      description: 'A benchmark in the precious metals industry, this 1 kg cast bar from the renowned Perth Mint offers a cost-effective way to acquire a substantial amount of gold. Each bar is stamped with the mint\'s swan logo.',
      price: 84750.0,
      weight: '1 kg',
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: 'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/1-kg.png',
      vendorName: 'Perth Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
    },
    {
      sku: 'GNB-PERTH-10OZ',
      name: '10 oz Perth Mint Gold Bar',
      description: 'A popular choice for serious investors, the 10 oz Perth Mint gold bar provides a significant store of value with the trust and recognition of one of the world\'s leading mints.',
      price: 24850.0,
      weight: '10 oz',
      karat: '24K',
      category: ProductCategory.BAR,
      imageUrl: 'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/10-oz.png',
      vendorName: 'Perth Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
    console.log(`Upserted product with id: ${product.id}`);
  }

  console.log('Seeding finished for products.');

  console.log('Upserting test user...');
  const user = await prisma.user.upsert({
    where: { email: 'bbaron.daniel@gmail.com' },
    update: {},
    create: {
      id: '8e7bec97-aa44-42ab-8ce1-f6cedb9bddd1',
      email: 'bbaron.daniel@gmail.com',
      fullName: 'Daniel Baron',
      password: '$argon2id$v=19$m=65536,t=3,p=4$mr2LyUzQoaeaXy41n3Sb/A$/r3M579MT+7//7eM9KdT2lfNu6QHpXJTPMElvsKUvxE',
      country: 'Canada',
      phoneNumber: '4374355140',
      role: 'ADMIN',
      createdAt: '2025-12-16T00:24:40.326Z',
      updatedAt: '2025-12-16T00:24:40.326Z',
    },
  });
  console.log(`Upserted user with id: ${user.id}`);

  console.log('Seeding 58 orders...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  
  // Fetch a product to link to order items
  const seedProduct = await prisma.product.findFirst();
  
  if (seedProduct) {
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
            }
        });

        const orderStatus = faker.helpers.arrayElement(['COMPLETED', 'PROCESSING', 'PENDING']);
        
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
                country: faker.location.country()
              },
              items: {
                create: {
                  productId: seedProduct.id,
                  quantity: faker.number.int({ min: 1, max: 5 }),
                  priceAtPurchase: seedProduct.price,
                }
              }
            }
          })
        );
      }
      await Promise.all(orderPromises);
      console.log('Orders seeded.');
  } else {
      console.warn('No products found to seed orders.');
  }

  console.log('Seeding 58 leads...');
  await prisma.secondHandLead.deleteMany({});
  
  const leadImages = [
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-JEWELRY-1.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-COIN-1.png',
    'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/TEST-BAR-1.png'
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
          estimatedWeight: faker.number.int({ min: 5, max: 100 }).toString(),
          estimatedKarat: faker.helpers.arrayElement(['10K', '14K', '18K', '22K', '24K']),
          estimatedValue: new Decimal(faker.finance.amount({ min: 100, max: 5000 })),
          photoUrls: [faker.helpers.arrayElement(leadImages)],
          status: leadStatus,
          createdAt: faker.date.recent({ days: 30 }),
        }
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