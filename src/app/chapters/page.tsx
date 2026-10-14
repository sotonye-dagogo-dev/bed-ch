import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getActiveChapters } from '@/lib/db/chapters';
import { chapterHref, siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'All Chapters',
  description:
    'Browse every bedroom chapter — from Nursery to Master. Find your bedroom style.',
};

/**
 * Chapters index — the canonical destination for "View all chapters".
 * DB-driven with a config fallback so the route never crashes when the
 * database is unreachable during prerender.
 */
export default async function ChaptersIndexPage() {
  let chapters: Awaited<ReturnType<typeof getActiveChapters>> = [];
  try {
    chapters = await getActiveChapters();
  } catch {
    chapters = [];
  }

  const fallback = siteConfig.chapters.map((c, i) => ({
    id: `config-${c.slug}`,
    name: c.name,
    slug: c.slug,
    headline: c.description ?? c.name,
    image: null as string | null,
    sortOrder: i,
    isActive: true,
  }));

  const list = chapters.length > 0 ? chapters : fallback;

  return (
    <div className="pt-8 pb-16">
      <div className="container-custom">
        <nav
          className="mb-6 flex items-center gap-2 text-sm text-text-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-text" aria-current="page">
            Chapters
          </span>
        </nav>

        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
            Shop by Chapter
          </h1>
          <p className="text-text-muted text-lg">
            Every bedroom tells a story. Pick the chapter that feels like you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
          {list.map((chapter) => (
            <Card key={chapter.id} variant="chapter" as="article">
              <Link
                href={chapterHref(chapter.slug)}
                className="block h-full"
                aria-label={`View ${chapter.headline}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  {chapter.image ? (
                    <img
                      src={chapter.image}
                      alt={chapter.headline}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-border flex items-center justify-center">
                      <span className="text-4xl">
                        {
                          siteConfig.chapters.find(
                            (c) => c.slug === chapter.slug,
                          )?.icon
                        }
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-text">{chapter.name}</h2>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {chapter.headline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2">
                    Explore
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
