import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'bedding' },
      update: {},
      create: { name: 'Bedding', slug: 'bedding', description: 'Sheets, duvets, and bed covers', icon: '🛏️', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'pillows' },
      update: {},
      create: { name: 'Pillows', slug: 'pillows', description: 'Comfortable pillows for every sleeper', icon: '🛌', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'rugs' },
      update: {},
      create: { name: 'Rugs', slug: 'rugs', description: 'Soft rugs to warm your floors', icon: '🧵', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'curtains' },
      update: {},
      create: { name: 'Curtains', slug: 'curtains', description: 'Light-filtering and blackout curtains', icon: '🪟', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'lighting' },
      update: {},
      create: { name: 'Lighting', slug: 'lighting', description: 'Ambient and task lighting', icon: '💡', sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: 'storage' },
      update: {},
      create: { name: 'Storage', slug: 'storage', description: 'Smart storage solutions', icon: '📦', sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: 'nightwear' },
      update: {},
      create: { name: 'Nightwear', slug: 'nightwear', description: 'Comfortable sleepwear', icon: '👕', sortOrder: 7 },
    }),
    prisma.category.upsert({
      where: { slug: 'function' },
      update: {},
      create: { name: 'Function', slug: 'function', description: 'Functional bedroom accessories', icon: '🔧', sortOrder: 8 },
    }),
  ]);

  console.log('✅ Categories created');

  // Chapters
  const chapters = await Promise.all([
    prisma.chapter.upsert({
      where: { slug: 'nursery' },
      update: {},
      create: {
        name: 'Nursery',
        slug: 'nursery',
        headline: 'The Nursery Bedroom',
        intro: 'Create a calm, safe haven for your little one. Soft textures, gentle colors, and practical storage make bedtime peaceful.',
        image: 'https://images.unsplash.com/photo-1515488042246-54d8f34b7c14?w=1200',
        sortOrder: 1,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'newlywed' },
      update: {},
      create: {
        name: 'Newlywed',
        slug: 'newlywed',
        headline: 'The Newlywed Bedroom',
        intro: 'Start your journey together in style. Luxurious bedding, romantic lighting, and matching sets for your first home.',
        image: 'https://images.unsplash.com/photo-1560448075-cbc16bb4b7a0?w=1200',
        sortOrder: 2,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'teen' },
      update: {},
      create: {
        name: 'Teen',
        slug: 'teen',
        headline: 'The Teen Bedroom',
        intro: 'Express yourself with bold colors and smart storage. Study zones, chill corners, and room to grow.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
        sortOrder: 3,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'guest' },
      update: {},
      create: {
        name: 'Guest',
        slug: 'guest',
        headline: 'The Guest Bedroom',
        intro: 'Make visitors feel at home. Fresh linens, extra blankets, and thoughtful touches for a five-star stay.',
        image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200',
        sortOrder: 4,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'master' },
      update: {},
      create: {
        name: 'Master',
        slug: 'master',
        headline: 'The Master Bedroom',
        intro: 'Your personal retreat. Hotel-quality bedding, blackout curtains, and ambient lighting for the best sleep.',
        image: 'https://images.unsplash.com/photo-1600596542815-3740e0c92f1a?w=1200',
        sortOrder: 5,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'minimalist' },
      update: {},
      create: {
        name: 'Minimalist',
        slug: 'minimalist',
        headline: 'The Minimalist Bedroom',
        intro: 'Less clutter, more calm. Clean lines, neutral tones, and only what you need for restful nights.',
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200',
        sortOrder: 6,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'boho' },
      update: {},
      create: {
        name: 'Boho',
        slug: 'boho',
        headline: 'The Boho Bedroom',
        intro: 'Layered textures, warm tones, and global finds. A collected look that feels uniquely yours.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
        sortOrder: 7,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'modern' },
      update: {},
      create: {
        name: 'Modern',
        slug: 'modern',
        headline: 'The Modern Bedroom',
        intro: 'Sleek design meets smart function. Contemporary pieces with clean silhouettes and tech-friendly features.',
        image: 'https://images.unsplash.com/photo-1560448075-cbc16bb4b7a0?w=1200',
        sortOrder: 8,
      },
    }),
    prisma.chapter.upsert({
      where: { slug: 'kids' },
      update: {},
      create: {
        name: 'Kids',
        slug: 'kids',
        headline: 'The Kids Bedroom',
        intro: 'Play, sleep, repeat. Durable fabrics, fun prints, and clever storage for growing imaginations.',
        image: 'https://images.unsplash.com/photo-1515488042246-54d8f34b7c14?w=1200',
        sortOrder: 9,
      },
    }),
  ]);

  console.log('✅ Chapters created');

  // Products
  const beddingCategory = categories.find(c => c.slug === 'bedding')!;
  const pillowsCategory = categories.find(c => c.slug === 'pillows')!;
  const rugsCategory = categories.find(c => c.slug === 'rugs')!;
  const curtainsCategory = categories.find(c => c.slug === 'curtains')!;
  const lightingCategory = categories.find(c => c.slug === 'lighting')!;
  const storageCategory = categories.find(c => c.slug === 'storage')!;
  const nightwearCategory = categories.find(c => c.slug === 'nightwear')!;
  const functionCategory = categories.find(c => c.slug === 'function')!;

  const nurseryChapter = chapters.find(c => c.slug === 'nursery')!;
  const newlywedChapter = chapters.find(c => c.slug === 'newlywed')!;
  const teenChapter = chapters.find(c => c.slug === 'teen')!;
  const guestChapter = chapters.find(c => c.slug === 'guest')!;
  const masterChapter = chapters.find(c => c.slug === 'master')!;
  const minimalistChapter = chapters.find(c => c.slug === 'minimalist')!;
  const bohoChapter = chapters.find(c => c.slug === 'boho')!;
  const modernChapter = chapters.find(c => c.slug === 'modern')!;
  const kidsChapter = chapters.find(c => c.slug === 'kids')!;
  const functionChapter = chapters.find(c => c.slug === 'function')!;

  const products = await Promise.all([
    // Bedding products
    prisma.product.upsert({
      where: { slug: 'organic-cotton-sheet-set' },
      update: {},
      create: {
        name: 'Organic Cotton Sheet Set',
        slug: 'organic-cotton-sheet-set',
        description: '100% GOTS-certified organic cotton sheets. Breathable, soft, and gets better with every wash. Includes fitted sheet, flat sheet, and 2 pillowcases.',
        shortDesc: 'GOTS-certified organic cotton, 300 thread count',
        price: 1250000, // ₦12,500
        compareAt: 1500000,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        ],
        categoryId: beddingCategory.id,
        chapterId: nurseryChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'linen-duvet-cover-set' },
      update: {},
      create: {
        name: 'Linen Duvet Cover Set',
        slug: 'linen-duvet-cover-set',
        description: 'Premium European flax linen duvet cover. Naturally temperature-regulating, hypoallergenic, and beautifully textured. Includes duvet cover and 2 pillow shams.',
        shortDesc: 'European flax linen, stone-washed finish',
        price: 1850000, // ₦18,500
        compareAt: 2200000,
        images: [
          'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800',
          'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800',
        ],
        categoryId: beddingCategory.id,
        chapterId: masterChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'bamboo-sheet-set' },
      update: {},
      create: {
        name: 'Bamboo Viscose Sheet Set',
        slug: 'bamboo-sheet-set',
        description: 'Silky-soft bamboo viscose sheets. Naturally cooling, moisture-wicking, and antimicrobial. Perfect for hot sleepers. Includes fitted sheet, flat sheet, and 2 pillowcases.',
        shortDesc: 'Cooling bamboo viscose, 320 thread count equivalent',
        price: 1450000, // ₦14,500
        compareAt: 1750000,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        ],
        categoryId: beddingCategory.id,
        chapterId: masterChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),

    // Pillows
    prisma.product.upsert({
      where: { slug: 'memory-foam-pillow' },
      update: {},
      create: {
        name: 'Memory Foam Pillow',
        slug: 'memory-foam-pillow',
        description: 'Contour memory foam pillow with cooling gel layer. Supports neck alignment and relieves pressure points. Removable washable cover.',
        shortDesc: 'Cooling gel memory foam, ergonomic contour',
        price: 850000, // ₦8,500
        compareAt: 1100000,
        images: [
          'https://images.unsplash.com/photo-1584101557390-d6eec8c4248b?w=800',
        ],
        categoryId: pillowsCategory.id,
        chapterId: masterChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'down-alternative-pillow-pair' },
      update: {},
      create: {
        name: 'Down Alternative Pillow Pair',
        slug: 'down-alternative-pillow-pair',
        description: 'Luxury hotel-style pillows with hypoallergenic microfiber fill. Medium-firm support, perfect for all sleep positions. Sold as a pair.',
        shortDesc: 'Hypoallergenic microfiber, medium-firm, pair',
        price: 650000, // ₦6,500
        compareAt: 800000,
        images: [
          'https://images.unsplash.com/photo-1584101557390-d6eec8c4248b?w=800',
        ],
        categoryId: pillowsCategory.id,
        chapterId: guestChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),

    // Rugs
    prisma.product.upsert({
      where: { slug: 'wool-blend-area-rug' },
      update: {},
      create: {
        name: 'Wool Blend Area Rug',
        slug: 'wool-blend-area-rug',
        description: 'Hand-tufted wool blend rug with subtle geometric pattern. Soft underfoot, naturally stain-resistant, and durable for high-traffic areas. 160x230cm.',
        shortDesc: 'Hand-tufted wool blend, 160x230cm',
        price: 2500000, // ₦25,000
        compareAt: 3000000,
        images: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
        ],
        categoryId: rugsCategory.id,
        chapterId: bohoChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'shaggy-rug-cream' },
      update: {},
      create: {
        name: 'Shaggy High-Pile Rug - Cream',
        slug: 'shaggy-rug-cream',
        description: 'Ultra-soft high-pile shaggy rug in warm cream. Adds texture and warmth to any bedroom. Non-slip backing. 120x170cm.',
        shortDesc: 'High-pile shag, non-slip backing, 120x170cm',
        price: 950000, // ₦9,500
        compareAt: 1200000,
        images: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
        ],
        categoryId: rugsCategory.id,
        chapterId: nurseryChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),

    // Curtains
    prisma.product.upsert({
      where: { slug: 'blackout-curtains-pair' },
      update: {},
      create: {
        name: 'Blackout Curtains (Pair)',
        slug: 'blackout-curtains-pair',
        description: 'Thermal blackout curtains block 99% of light and reduce noise. Energy-efficient, machine washable. Sold as a pair. 140x240cm each panel.',
        shortDesc: '99% blackout, thermal insulated, pair',
        price: 750000, // ₦7,500
        compareAt: 950000,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        categoryId: curtainsCategory.id,
        chapterId: nurseryChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'sheer-linen-curtains' },
      update: {},
      create: {
        name: 'Sheer Linen Curtains (Pair)',
        slug: 'sheer-linen-curtains',
        description: 'Light-filtering sheer linen curtains. Softly diffuses natural light while maintaining privacy. Natural texture adds elegance. Sold as a pair. 140x240cm each panel.',
        shortDesc: 'Light-filtering linen, natural texture, pair',
        price: 550000, // ₦5,500
        compareAt: 700000,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        categoryId: curtainsCategory.id,
        chapterId: minimalistChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),

    // Lighting
    prisma.product.upsert({
      where: { slug: 'ceramic-table-lamp' },
      update: {},
      create: {
        name: 'Ceramic Table Lamp - Sage',
        slug: 'ceramic-table-lamp',
        description: 'Hand-glazed ceramic base in sage green with linen drum shade. Warm ambient light, perfect for bedside tables. Includes LED bulb. 45cm height.',
        shortDesc: 'Hand-glazed ceramic, linen shade, 45cm',
        price: 650000, // ₦6,500
        compareAt: 800000,
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        ],
        categoryId: lightingCategory.id,
        chapterId: modernChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'dimmable-floor-lamp' },
      update: {},
      create: {
        name: 'Dimmable Arc Floor Lamp',
        slug: 'dimmable-floor-lamp',
        description: 'Modern arc floor lamp with stepless dimming and color temperature control. Sturdy marble base, adjustable arm. Perfect for reading nooks. 180cm height.',
        shortDesc: 'Stepless dimming, adjustable arm, marble base',
        price: 1850000, // ₦18,500
        compareAt: 2200000,
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        ],
        categoryId: lightingCategory.id,
        chapterId: masterChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),

    // Storage
    prisma.product.upsert({
      where: { slug: 'underbed-storage-set' },
      update: {},
      create: {
        name: 'Underbed Storage Set (3pcs)',
        slug: 'underbed-storage-set',
        description: 'Set of 3 low-profile underbed storage boxes with clear lids and zip closures. Maximize hidden space for seasonal bedding. Each 90x50x15cm.',
        shortDesc: '3-piece set, clear lids, zip closure',
        price: 450000, // ₦4,500
        compareAt: 550000,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        categoryId: storageCategory.id,
        chapterId: functionChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),

    // Nightwear
    prisma.product.upsert({
      where: { slug: 'cotton-pajama-set' },
      update: {},
      create: {
        name: 'Organic Cotton Pajama Set',
        slug: 'cotton-pajama-set',
        description: 'Relaxed-fit organic cotton pajama set. Breathable, soft, and pre-washed for comfort. Top with chest pocket, elastic waist pants with drawstring.',
        shortDesc: 'GOTS organic cotton, relaxed fit',
        price: 750000, // ₦7,500
        compareAt: 950000,
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
        ],
        categoryId: nightwearCategory.id,
        chapterId: newlywedChapter.id,
        isBestseller: false,
        isActive: true,
      },
    }),

    // Function
    prisma.product.upsert({
      where: { slug: 'bedside-caddy' },
      update: {},
      create: {
        name: 'Felt Bedside Caddy',
        slug: 'bedside-caddy',
        description: 'Premium felt bedside organizer with multiple pockets. Slides under mattress for secure fit. Holds phone, book, glasses, remote, and water bottle.',
        shortDesc: 'Premium felt, slides under mattress',
        price: 350000, // ₦3,500
        compareAt: 450000,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        categoryId: functionCategory.id,
        chapterId: teenChapter.id,
        isBestseller: true,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create variants for products
  const sheetProduct = products.find(p => p.slug === 'organic-cotton-sheet-set')!;
  const linenDuvet = products.find(p => p.slug === 'linen-duvet-cover-set')!;
  const bambooSheets = products.find(p => p.slug === 'bamboo-sheet-set')!;

  await Promise.all([
    prisma.productVariant.upsert({
      where: { sku: 'OCS-SINGLE-WHT' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Single', color: 'White', sku: 'OCS-SINGLE-WHT', stock: 50 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-DOUBLE-WHT' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Double', color: 'White', sku: 'OCS-DOUBLE-WHT', stock: 40 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-QUEEN-WHT' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Queen', color: 'White', sku: 'OCS-QUEEN-WHT', stock: 35 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-KING-WHT' },
      update: {},
      create: { productId: sheetProduct.id, size: 'King', color: 'White', sku: 'OCS-KING-WHT', stock: 25 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-SINGLE-SAGE' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Single', color: 'Sage', sku: 'OCS-SINGLE-SAGE', stock: 30 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-DOUBLE-SAGE' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Double', color: 'Sage', sku: 'OCS-DOUBLE-SAGE', stock: 25 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-QUEEN-SAGE' },
      update: {},
      create: { productId: sheetProduct.id, size: 'Queen', color: 'Sage', sku: 'OCS-QUEEN-SAGE', stock: 20 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'OCS-KING-SAGE' },
      update: {},
      create: { productId: sheetProduct.id, size: 'King', color: 'Sage', sku: 'OCS-KING-SAGE', stock: 15 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'LDS-QUEEN-NAT' },
      update: {},
      create: { productId: linenDuvet.id, size: 'Queen', color: 'Natural', sku: 'LDS-QUEEN-NAT', stock: 20 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'LDS-KING-NAT' },
      update: {},
      create: { productId: linenDuvet.id, size: 'King', color: 'Natural', sku: 'LDS-KING-NAT', stock: 15 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'BVS-QUEEN-WHT' },
      update: {},
      create: { productId: bambooSheets.id, size: 'Queen', color: 'White', sku: 'BVS-QUEEN-WHT', stock: 30 },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'BVS-KING-WHT' },
      update: {},
      create: { productId: bambooSheets.id, size: 'King', color: 'White', sku: 'BVS-KING-WHT', stock: 20 },
    }),
  ]);

  console.log('✅ Variants created');

  // Bundle offers
  await prisma.bundleOffer.upsert({
    where: { chapterId: nurseryChapter.id },
    update: {},
    create: {
      chapterId: nurseryChapter.id,
      name: 'Nursery Starter Bundle',
      description: 'Everything you need for baby\'s first bedroom. Organic sheets, blackout curtains, and soft rug.',
      productIds: [
        products.find(p => p.slug === 'organic-cotton-sheet-set')!.id,
        products.find(p => p.slug === 'blackout-curtains-pair')!.id,
        products.find(p => p.slug === 'shaggy-rug-cream')!.id,
      ],
      discountPct: 15,
      isActive: true,
    },
  });

  await prisma.bundleOffer.upsert({
    where: { chapterId: newlywedChapter.id },
    update: {},
    create: {
      chapterId: newlywedChapter.id,
      name: 'Newlywed Essentials Bundle',
      description: 'Start your home with luxury bedding, matching pillows, and cozy nightwear.',
      productIds: [
        products.find(p => p.slug === 'linen-duvet-cover-set')!.id,
        products.find(p => p.slug === 'down-alternative-pillow-pair')!.id,
        products.find(p => p.slug === 'cotton-pajama-set')!.id,
      ],
      discountPct: 20,
      isActive: true,
    },
  });

  await prisma.bundleOffer.upsert({
    where: { chapterId: masterChapter.id },
    update: {},
    create: {
      chapterId: masterChapter.id,
      name: 'Master Suite Bundle',
      description: 'Hotel-quality sleep experience with linen duvet, memory foam pillow, and floor lamp.',
      productIds: [
        products.find(p => p.slug === 'linen-duvet-cover-set')!.id,
        products.find(p => p.slug === 'memory-foam-pillow')!.id,
        products.find(p => p.slug === 'dimmable-floor-lamp')!.id,
      ],
      discountPct: 18,
      isActive: true,
    },
  });

  console.log('✅ Bundle offers created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });