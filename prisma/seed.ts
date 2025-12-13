// prisma/seed.ts

import { prisma } from '@/../lib/db';
import { StockStatus } from '@/generated/prisma/enums';

async function main() {
  console.log('Start seeding...');

  await prisma.product.deleteMany({});
  console.log('Deleted existing products.');

  const products = [
    {
      sku: 'GNB-PAMP-1OZ',
      name: '1 oz PAMP Suisse Gold Bar',
      description: 'The PAMP Suisse 1 oz gold bar represents the pinnacle of Swiss craftsmanship, featuring the iconic Lady Fortuna design. Each bar is individually assayed and sealed in CertiPAMP™ packaging.',
      price: 2689.5,
      weight: '1 oz',
      karat: '24K',
      category: 'Bar',
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
      category: 'Coin',
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
      category: 'Bar',
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
      category: 'Bar',
      imageUrl: 'https://ctaiwooelzfacgkukunb.supabase.co/storage/v1/object/public/gold-nexus-images/10-oz.png',
      vendorName: 'Perth Mint',
      stockStatus: StockStatus.IN_STOCK,
      isActive: true,
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`Created product with id: ${product.id}`);
  }

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