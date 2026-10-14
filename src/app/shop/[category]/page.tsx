import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { siteConfig, isKnownCategory } from '@/config/site';
import { getCategoryBySlug } from '@/lib/db/categories';

interface CategoryRedirectProps {
  // Next 14 passes a plain object, Next 15 passes a Promise — accept both.
  params: Promise<{ category: string }> | { category: string };
}

export async function generateStaticParams() {
  return siteConfig.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryRedirectProps): Promise<Metadata> {
  const { category } = await Promise.resolve(params);
  return {
    title: `Shop ${category ?? ''}`,
  };
}

/**
 * Backwards-compatible category route.
 *
 * Legacy links across the platform use `/shop/<category-slug>` (e.g.
 * `/shop/bedding`) but the canonical Shop page filters via query string
 * (`/shop?category=bedding`). This segment validates the slug against the
 * central site config (falling back to the database) and permanently
 * redirects to the canonical URL — so no link 404s and no duplicate
 * catalogue implementation is needed. Unknown slugs render `notFound()`.
 */
export default async function ShopCategoryRedirect({
  params,
}: CategoryRedirectProps) {
  let slug = '';
  try {
    slug = (await Promise.resolve(params))?.category ?? '';
  } catch {
    slug = '';
  }

  if (!slug) {
    notFound();
  }

  // Fast path: known config slug. Slow path: confirm against the database
  // (covers CMS-added categories without a redeploy).
  if (!isKnownCategory(slug)) {
    try {
      const dbCategory = await getCategoryBySlug(slug);
      if (!dbCategory) {
        notFound();
      }
    } catch {
      // DB unreachable — still redirect for known-config slugs only;
      // unknown slugs 404 to avoid masking errors.
      notFound();
    }
  }

  redirect(`/shop?category=${encodeURIComponent(slug)}`);
}
