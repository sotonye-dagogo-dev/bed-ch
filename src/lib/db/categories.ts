import { prisma } from '@/lib/prisma';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export async function getCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return cats as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: { _count: { select: { products: true } } },
  });
  return cat as Category | null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const cat = await prisma.category.findFirst({
    where: { id, isActive: true },
    include: { _count: { select: { products: true } } },
  });
  return cat as Category | null;
}
