// Database query functions for chapters

export interface Chapter {
  id: string;
  name: string;
  slug: string;
  headline: string;
  intro: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  bundleOffer?: BundleOffer | null;
}

export interface BundleOffer {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  productIds: string[];
  discountPct: number;
  isActive: boolean;
}

const mockChapters: Chapter[] = [
  {
    id: '1',
    name: 'Nursery',
    slug: 'nursery',
    headline: 'The Nursery Bedroom',
    intro: 'Create a calm, safe haven for your little one. Soft textures, gentle colors, and practical storage make bedtime peaceful.',
    image: 'https://images.unsplash.com/photo-1515488042246-54d8f34b7c14?w=1200',
    sortOrder: 1,
    isActive: true,
    bundleOffer: {
      id: '1',
      chapterId: '1',
      name: 'Nursery Starter Bundle',
      description: 'Everything you need for baby\'s first bedroom. Organic sheets, blackout curtains, and soft rug.',
      productIds: ['1', '8', '7'],
      discountPct: 15,
      isActive: true,
    },
  },
  {
    id: '2',
    name: 'Newlywed',
    slug: 'newlywed',
    headline: 'The Newlywed Bedroom',
    intro: 'Start your journey together in style. Luxurious bedding, romantic lighting, and matching sets for your first home.',
    image: 'https://images.unsplash.com/photo-1560448075-cbc16bb4b7a0?w=1200',
    sortOrder: 2,
    isActive: true,
    bundleOffer: {
      id: '2',
      chapterId: '2',
      name: 'Newlywed Essentials Bundle',
      description: 'Start your home with luxury bedding, matching pillows, and cozy nightwear.',
      productIds: ['2', '5', '13'],
      discountPct: 20,
      isActive: true,
    },
  },
  {
    id: '3',
    name: 'Teen',
    slug: 'teen',
    headline: 'The Teen Bedroom',
    intro: 'Express yourself with bold colors and smart storage. Study zones, chill corners, and room to grow.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    sortOrder: 3,
    isActive: true,
    bundleOffer: null,
  },
  {
    id: '4',
    name: 'Guest',
    slug: 'guest',
    headline: 'The Guest Bedroom',
    intro: 'Make visitors feel at home. Fresh linens, extra blankets, and thoughtful touches for a five-star stay.',
    image: 'https://images.unsplash.com/photo-159552614035-0d45ed16cfbf?w=1200',
    sortOrder: 4,
    isActive: true,
    bundleOffer: null,
  },
  {
    id: '5',
    name: 'Master',
    slug: 'master',
    headline: 'The Master Bedroom',
    intro: 'Your personal retreat. Hotel-quality bedding, blackout curtains, and ambient lighting for the best sleep.',
    image: 'https://images.unsplash.com/photo-1600596542815-3740e0c92f1a?w=1200',
    sortOrder: 5,
    isActive: true,
    bundleOffer: {
      id: '3',
      chapterId: '5',
      name: 'Master Suite Bundle',
      description: 'Hotel-quality sleep experience with linen duvet, memory foam pillow, and floor lamp.',
      productIds: ['2', '4', '11'],
      discountPct: 18,
      isActive: true,
    },
  },
  {
    id: '6',
    name: 'Minimalist',
    slug: 'minimalist',
    headline: 'The Minimalist Bedroom',
    intro: 'Less clutter, more calm. Clean lines, neutral tones, and only what you need for restful nights.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200',
    sortOrder: 6,
    isActive: true,
    bundleOffer: null,
  },
  {
    id: '7',
    name: 'Boho',
    slug: 'boho',
    headline: 'The Boho Bedroom',
    intro: 'Layered textures, warm tones, and global finds. A collected look that feels uniquely yours.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    sortOrder: 7,
    isActive: true,
    bundleOffer: null,
  },
  {
    id: '8',
    name: 'Modern',
    slug: 'modern',
    headline: 'The Modern Bedroom',
    intro: 'Sleek design meets smart function. Contemporary pieces with clean silhouettes and tech-friendly features.',
    image: 'https://images.unsplash.com/photo-1560448075-cbc16bb4b7a0?w=1200',
    sortOrder: 8,
    isActive: true,
    bundleOffer: null,
  },
  {
    id: '9',
    name: 'Kids',
    slug: 'kids',
    headline: 'The Kids Bedroom',
    intro: 'Play, sleep, repeat. Durable fabrics, fun prints, and clever storage for growing imaginations.',
    image: 'https://images.unsplash.com/photo-1515488042246-54d8f34b7c14?w=1200',
    sortOrder: 9,
    isActive: true,
    bundleOffer: null,
  },
];

export async function getChapters(): Promise<Chapter[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockChapters.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockChapters.find(c => c.slug === slug && c.isActive) || null;
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockChapters.find(c => c.id === id && c.isActive) || null;
}

export async function getActiveChapters(limit?: number): Promise<Chapter[]> {
  const chapters = await getChapters();
  return limit ? chapters.slice(0, limit) : chapters;
}