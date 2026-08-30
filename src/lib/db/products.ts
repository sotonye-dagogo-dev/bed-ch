// Database query functions for products
// These will be implemented with Prisma when the database is set up

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  compareAt: number | null;
  images: string[];
  categoryId: string;
  chapterId: string | null;
  isBestseller: boolean;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  chapter?: {
    id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  sku: string;
  stock: number;
  price: number | null;
}

export interface ProductFilters {
  category?: string;
  chapter?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'bestselling';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Cotton Sheet Set',
    slug: 'organic-cotton-sheet-set',
    description: '100% GOTS-certified organic cotton sheets. Breathable, soft, and gets better with every wash.',
    shortDesc: 'GOTS-certified organic cotton, 300 thread count',
    price: 1250000,
    compareAt: 1500000,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    categoryId: '1',
    chapterId: '1',
    isBestseller: true,
    isActive: true,
    category: { id: '1', name: 'Bedding', slug: 'bedding' },
    chapter: { id: '1', name: 'Nursery', slug: 'nursery' },
    variants: [
      { id: '1', productId: '1', size: 'Single', color: 'White', sku: 'OCS-SINGLE-WHT', stock: 50, price: null },
      { id: '2', productId: '1', size: 'Double', color: 'White', sku: 'OCS-DOUBLE-WHT', stock: 40, price: null },
      { id: '3', productId: '1', size: 'Queen', color: 'White', sku: 'OCS-QUEEN-WHT', stock: 35, price: null },
      { id: '4', productId: '1', size: 'King', color: 'White', sku: 'OCS-KING-WHT', stock: 25, price: null },
    ],
  },
  {
    id: '2',
    name: 'Linen Duvet Cover Set',
    slug: 'linen-duvet-cover-set',
    description: 'Premium European flax linen duvet cover. Naturally temperature-regulating, hypoallergenic.',
    shortDesc: 'European flax linen, stone-washed finish',
    price: 1850000,
    compareAt: 2200000,
    images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
    categoryId: '1',
    chapterId: '5',
    isBestseller: true,
    isActive: true,
    category: { id: '1', name: 'Bedding', slug: 'bedding' },
    chapter: { id: '5', name: 'Master', slug: 'master' },
    variants: [
      { id: '5', productId: '2', size: 'Queen', color: 'Natural', sku: 'LDS-QUEEN-NAT', stock: 20, price: null },
      { id: '6', productId: '2', size: 'King', color: 'Natural', sku: 'LDS-KING-NAT', stock: 15, price: null },
    ],
  },
  {
    id: '3',
    name: 'Bamboo Viscose Sheet Set',
    slug: 'bamboo-sheet-set',
    description: 'Silky-soft bamboo viscose sheets. Naturally cooling, moisture-wicking, and antimicrobial.',
    shortDesc: 'Cooling bamboo viscose, 320 thread count equivalent',
    price: 1450000,
    compareAt: 1750000,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    categoryId: '1',
    chapterId: '5',
    isBestseller: false,
    isActive: true,
    category: { id: '1', name: 'Bedding', slug: 'bedding' },
    chapter: { id: '5', name: 'Master', slug: 'master' },
    variants: [
      { id: '7', productId: '3', size: 'Queen', color: 'White', sku: 'BVS-QUEEN-WHT', stock: 30, price: null },
      { id: '8', productId: '3', size: 'King', color: 'White', sku: 'BVS-KING-WHT', stock: 20, price: null },
    ],
  },
  {
    id: '4',
    name: 'Memory Foam Pillow',
    slug: 'memory-foam-pillow',
    description: 'Contour memory foam pillow with cooling gel layer. Supports neck alignment and relieves pressure points.',
    shortDesc: 'Cooling gel memory foam, ergonomic contour',
    price: 850000,
    compareAt: 1100000,
    images: ['https://images.unsplash.com/photo-1584101557390-d6eec8c4248b?w=800'],
    categoryId: '2',
    chapterId: '5',
    isBestseller: true,
    isActive: true,
    category: { id: '2', name: 'Pillows', slug: 'pillows' },
    chapter: { id: '5', name: 'Master', slug: 'master' },
    variants: [
      { id: '9', productId: '4', size: 'Standard', color: null, sku: 'MFP-STD', stock: 40, price: null },
    ],
  },
  {
    id: '5',
    name: 'Down Alternative Pillow Pair',
    slug: 'down-alternative-pillow-pair',
    description: 'Luxury hotel-style pillows with hypoallergenic microfiber fill. Medium-firm support. Sold as a pair.',
    shortDesc: 'Hypoallergenic microfiber, medium-firm, pair',
    price: 650000,
    compareAt: 800000,
    images: ['https://images.unsplash.com/photo-1584101557390-d6eec8c4248b?w=800'],
    categoryId: '2',
    chapterId: '4',
    isBestseller: true,
    isActive: true,
    category: { id: '2', name: 'Pillows', slug: 'pillows' },
    chapter: { id: '4', name: 'Guest', slug: 'guest' },
    variants: [
      { id: '10', productId: '5', size: 'Standard', color: null, sku: 'DAP-PAIR', stock: 50, price: null },
    ],
  },
  {
    id: '6',
    name: 'Wool Blend Area Rug',
    slug: 'wool-blend-area-rug',
    description: 'Hand-tufted wool blend rug with subtle geometric pattern. Soft underfoot, naturally stain-resistant.',
    shortDesc: 'Hand-tufted wool blend, 160x230cm',
    price: 2500000,
    compareAt: 3000000,
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800'],
    categoryId: '3',
    chapterId: '7',
    isBestseller: false,
    isActive: true,
    category: { id: '3', name: 'Rugs', slug: 'rugs' },
    chapter: { id: '7', name: 'Boho', slug: 'boho' },
    variants: [
      { id: '11', productId: '6', size: '160x230cm', color: 'Neutral', sku: 'WBR-160-NT', stock: 15, price: null },
    ],
  },
  {
    id: '7',
    name: 'Shaggy High-Pile Rug - Cream',
    slug: 'shaggy-rug-cream',
    description: 'Ultra-soft high-pile shaggy rug in warm cream. Adds texture and warmth to any bedroom.',
    shortDesc: 'High-pile shag, non-slip backing, 120x170cm',
    price: 950000,
    compareAt: 1200000,
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800'],
    categoryId: '3',
    chapterId: '1',
    isBestseller: true,
    isActive: true,
    category: { id: '3', name: 'Rugs', slug: 'rugs' },
    chapter: { id: '1', name: 'Nursery', slug: 'nursery' },
    variants: [
      { id: '12', productId: '7', size: '120x170cm', color: 'Cream', sku: 'SHR-120-CRM', stock: 25, price: null },
    ],
  },
  {
    id: '8',
    name: 'Blackout Curtains (Pair)',
    slug: 'blackout-curtains-pair',
    description: 'Thermal blackout curtains block 99% of light and reduce noise. Energy-efficient, machine washable.',
    shortDesc: '99% blackout, thermal insulated, pair',
    price: 750000,
    compareAt: 950000,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    categoryId: '4',
    chapterId: '1',
    isBestseller: true,
    isActive: true,
    category: { id: '4', name: 'Curtains', slug: 'curtains' },
    chapter: { id: '1', name: 'Nursery', slug: 'nursery' },
    variants: [
      { id: '13', productId: '8', size: '140x240cm', color: 'White', sku: 'BLC-140-WHT', stock: 30, price: null },
      { id: '14', productId: '8', size: '140x240cm', color: 'Grey', sku: 'BLC-140-GRY', stock: 25, price: null },
    ],
  },
  {
    id: '9',
    name: 'Sheer Linen Curtains (Pair)',
    slug: 'sheer-linen-curtains',
    description: 'Light-filtering sheer linen curtains. Softly diffuses natural light while maintaining privacy.',
    shortDesc: 'Light-filtering linen, natural texture, pair',
    price: 550000,
    compareAt: 700000,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    categoryId: '4',
    chapterId: '6',
    isBestseller: false,
    isActive: true,
    category: { id: '4', name: 'Curtains', slug: 'curtains' },
    chapter: { id: '6', name: 'Minimalist', slug: 'minimalist' },
    variants: [
      { id: '15', productId: '9', size: '140x240cm', color: 'Natural', sku: 'SLC-140-NAT', stock: 20, price: null },
    ],
  },
  {
    id: '10',
    name: 'Ceramic Table Lamp - Sage',
    slug: 'ceramic-table-lamp',
    description: 'Hand-glazed ceramic base in sage green with linen drum shade. Warm ambient light.',
    shortDesc: 'Hand-glazed ceramic, linen shade, 45cm',
    price: 650000,
    compareAt: 800000,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
    categoryId: '5',
    chapterId: '8',
    isBestseller: false,
    isActive: true,
    category: { id: '5', name: 'Lighting', slug: 'lighting' },
    chapter: { id: '8', name: 'Modern', slug: 'modern' },
    variants: [
      { id: '16', productId: '10', size: '45cm', color: 'Sage', sku: 'CTL-45-SGE', stock: 15, price: null },
    ],
  },
  {
    id: '11',
    name: 'Dimmable Arc Floor Lamp',
    slug: 'dimmable-floor-lamp',
    description: 'Modern arc floor lamp with stepless dimming and color temperature control.',
    shortDesc: 'Stepless dimming, adjustable arm, marble base',
    price: 1850000,
    compareAt: 2200000,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
    categoryId: '5',
    chapterId: '5',
    isBestseller: false,
    isActive: true,
    category: { id: '5', name: 'Lighting', slug: 'lighting' },
    chapter: { id: '5', name: 'Master', slug: 'master' },
    variants: [
      { id: '17', productId: '11', size: '180cm', color: 'Black', sku: 'DFL-180-BLK', stock: 10, price: null },
    ],
  },
  {
    id: '12',
    name: 'Underbed Storage Set (3pcs)',
    slug: 'underbed-storage-set',
    description: 'Set of 3 low-profile underbed storage boxes with clear lids and zip closures.',
    shortDesc: '3-piece set, clear lids, zip closure',
    price: 450000,
    compareAt: 550000,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    categoryId: '6',
    chapterId: '9',
    isBestseller: true,
    isActive: true,
    category: { id: '6', name: 'Storage', slug: 'storage' },
    chapter: { id: '9', name: 'Function', slug: 'function' },
    variants: [
      { id: '18', productId: '12', size: '90x50x15cm', color: 'Clear', sku: 'UBS-3PC-CLR', stock: 40, price: null },
    ],
  },
];

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  // Simulate async database call
  await new Promise(resolve => setTimeout(resolve, 100));

  let filtered = mockProducts.filter(p => p.isActive);

  if (filters.category) {
    filtered = filtered.filter(p => p.category?.slug === filters.category);
  }

  if (filters.chapter) {
    filtered = filtered.filter(p => p.chapter?.slug === filters.chapter);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'bestselling':
      filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      break;
    default:
      filtered.sort((a, b) => b.id.localeCompare(a.id)); // newest first by id
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const start = (page - 1) * limit;
  const paginatedProducts = filtered.slice(start, start + limit);

  return {
    products: paginatedProducts,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockProducts.find(p => p.slug === slug && p.isActive) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockProducts.find(p => p.id === id && p.isActive) || null;
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockProducts
    .filter(p => p.isActive && p.isBestseller)
    .slice(0, limit);
}

export async function getProductsByCategory(categorySlug: string, limit = 12): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockProducts
    .filter(p => p.isActive && p.category?.slug === categorySlug)
    .slice(0, limit);
}

export async function getProductsByChapter(chapterSlug: string, limit = 20): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockProducts
    .filter(p => p.isActive && p.chapter?.slug === chapterSlug)
    .slice(0, limit);
}

export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const search = query.toLowerCase();
  return mockProducts
    .filter(p => p.isActive && (
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    ))
    .slice(0, limit);
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return [];

  return mockProducts
    .filter(p => p.isActive && p.id !== productId && (
      p.categoryId === product.categoryId || p.chapterId === product.chapterId
    ))
    .slice(0, limit);
}