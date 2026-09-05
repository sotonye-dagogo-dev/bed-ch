import { Metadata } from 'next';
import Link from 'next/link';
import { Search, ShoppingBag, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { getBestsellers } from '@/lib/db/products';
import { getActiveChapters } from '@/lib/db/chapters';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Everything Your Bedroom Needs',
  description: 'Shop quality bedding, pillows, rugs, curtains, and bedroom essentials. Pay on delivery in Lagos, Abuja & PH. Same-day delivery in Lagos. 7-day returns.',
};

const chapters = [
  { name: 'Nursery', slug: 'nursery', emoji: '👶', description: 'Safe, soft, practical' },
  { name: 'Newlywed', slug: 'newlywed', emoji: '💍', description: 'Luxury for two' },
  { name: 'Teen', slug: 'teen', emoji: '🎮', description: 'Bold & functional' },
  { name: 'Guest', slug: 'guest', emoji: '🏨', description: 'Five-star comfort' },
  { name: 'Master', slug: 'master', emoji: '👑', description: 'Hotel-quality sleep' },
  { name: 'Minimalist', slug: 'minimalist', emoji: '🤍', description: 'Calm & clutter-free' },
  { name: 'Boho', slug: 'boho', emoji: '🌿', description: 'Layered & collected' },
  { name: 'Modern', slug: 'modern', emoji: '⚡', description: 'Sleek & smart' },
  { name: 'Kids', slug: 'kids', emoji: '🧸', description: 'Fun & durable' },
];

export default async function HomePage() {
  const [bestsellers, activeChapters] = await Promise.all([
    getBestsellers(12),
    getActiveChapters(9),
  ]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32" aria-labelledby="hero-heading">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              id="hero-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-text leading-tight mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Everything your <span className="text-primary">bedroom</span> needs.
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto">
              Curated quality, honest prices, delivered to your door. From bedsheets to blackout curtains — find your perfect bedroom chapter.
            </p>

            {/* Search Bar */}
            <form role="search" className="relative max-w-xl mx-auto mb-12">
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Search bedsheets, pillows, rugs..."
                className="w-full h-14 pl-12 pr-4 bg-bg border border-border rounded-full text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                autoComplete="off"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted" aria-hidden="true" />
            </form>

            {/* Two Path Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg w-full sm:w-auto"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                Shop by Product
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 h-14 px-8 text-lg w-full sm:w-auto"
              >
                <Compass className="h-5 w-5" aria-hidden="true" />
                Shop by Chapter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section aria-labelledby="bestsellers-heading" className="py-10">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="bestsellers-heading" className="text-2xl md:text-3xl font-bold text-text">
                Bestsellers
              </h2>
              <p className="text-text-muted mt-1">Shop high-quality bedsheets from ₦6,500</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-primary transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {bestsellers.length > 0 ? (
              bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="product-card" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Chapter Teaser */}
      <section aria-labelledby="chapters-heading" className="py-10">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="chapters-heading" className="text-2xl md:text-3xl font-bold text-text">
                Shop by Chapter
              </h2>
              <p className="text-text-muted mt-1">Find your bedroom style</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-primary transition-colors"
            >
              View all chapters
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {activeChapters.length > 0 ? (
              activeChapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))
            ) : (
              Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} variant="chapter-card" />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: { id: string; name: string; slug: string; price: number; compareAt: number | null; images: string[]; isBestseller: boolean } }) {
  return (
    <Card variant="product" as="article">
      <Link href={`/product/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {product.isBestseller && (
            <span className="absolute top-2 left-2 bg-primary text-text-inverse text-xs font-medium px-2 py-1 rounded-full">
              Bestseller
            </span>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-text truncate">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

function ChapterCard({ chapter }: { chapter: { id: string; name: string; slug: string; headline: string; image: string | null } }) {
  return (
    <Card variant="chapter" as="article">
      <Link href={`/chapter/${chapter.slug}`} className="block h-full" aria-label={`View ${chapter.headline}`}>
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
              <span className="text-4xl">{chapters.find(c => c.slug === chapter.slug)?.emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-text">{chapter.name}</h3>
        </div>
      </Link>
    </Card>
  );
}