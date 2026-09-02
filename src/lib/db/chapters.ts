import { prisma } from '@/lib/prisma';

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

export async function getChapters(): Promise<Chapter[]> {
  const chapters = await prisma.chapter.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { bundleOffer: true },
  });
  return chapters as Chapter[];
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const chapter = await prisma.chapter.findFirst({
    where: { slug, isActive: true },
    include: { bundleOffer: true },
  });
  return chapter as Chapter | null;
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  const chapter = await prisma.chapter.findFirst({
    where: { id, isActive: true },
    include: { bundleOffer: true },
  });
  return chapter as Chapter | null;
}

export async function getActiveChapters(limit?: number): Promise<Chapter[]> {
  const chapters = await prisma.chapter.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { bundleOffer: true },
    take: limit,
  });
  return chapters as Chapter[];
}
