import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

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

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  chapter: { select: { id: true, name: true, slug: true } },
  variants: true,
} satisfies Prisma.ProductInclude;

function mapProduct(p: Prisma.ProductGetPayload<{ include: typeof productInclude }>): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDesc: p.shortDesc,
    price: p.price,
    compareAt: p.compareAt,
    images: p.images,
    categoryId: p.categoryId,
    chapterId: p.chapterId,
    isBestseller: p.isBestseller,
    isActive: p.isActive,
    category: p.category ?? undefined,
    chapter: p.chapter ?? undefined,
    variants: (p.variants as ProductVariant[]) ?? [],
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.category) {
    where.category = { slug: filters.category };
  }
  if (filters.chapter) {
    where.chapter = { slug: filters.chapter };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  if (filters.sizes && filters.sizes.length > 0) {
    where.variants = { ...(where.variants as object ?? {}), some: { size: { in: filters.sizes } } };
  }
  if (filters.colors && filters.colors.length > 0) {
    const existing = where.variants as Prisma.ProductVariantListRelationFilter | undefined;
    const colorFilter = { color: { in: filters.colors } };
    if (existing?.some) {
      // both size and color: require variant matching both would be too strict, use AND
      where.AND = [
        { variants: { some: { size: { in: filters.sizes } } } },
        { variants: { some: { color: { in: filters.colors } } } },
      ];
      delete (where as Record<string, unknown>).variants;
    } else {
      where.variants = { some: colorFilter };
    }
  }
  if (filters.search) {
    const q = filters.search;
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  switch (filters.sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'bestselling':
      orderBy = { isBestseller: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const [raw, total] = await Promise.all([
    prisma.product.findMany({ where, include: productInclude, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ]);

  return {
    products: raw.map(mapProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({ where: { slug, isActive: true }, include: productInclude });
  return p ? mapProduct(p) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({ where: { id, isActive: true }, include: productInclude });
  return p ? mapProduct(p) : null;
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const raw = await prisma.product.findMany({
    where: { isActive: true, isBestseller: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return raw.map(mapProduct);
}

export async function getProductsByCategory(categorySlug: string, limit = 12): Promise<Product[]> {
  const raw = await prisma.product.findMany({
    where: { isActive: true, category: { slug: categorySlug } },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return raw.map(mapProduct);
}

export async function getProductsByChapter(chapterSlug: string, limit = 20): Promise<Product[]> {
  const raw = await prisma.product.findMany({
    where: { isActive: true, chapter: { slug: chapterSlug } },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return raw.map(mapProduct);
}

export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  const raw = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: productInclude,
    take: limit,
  });
  return raw.map(mapProduct);
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { categoryId: true, chapterId: true } });
  if (!product) return [];

  const raw = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      OR: [
        { categoryId: product.categoryId },
        ...(product.chapterId ? [{ chapterId: product.chapterId }] : []),
      ],
    },
    include: productInclude,
    take: limit,
  });
  return raw.map(mapProduct);
}
