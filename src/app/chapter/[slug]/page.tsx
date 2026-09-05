import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Package, Tag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getChapterBySlug } from '@/lib/db/chapters';
import { getProductsByChapter } from '@/lib/db/products';
import { formatPrice, formatCurrency } from '@/lib/utils';

interface ChapterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);
  
  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }

  return {
    title: chapter.headline,
    description: chapter.intro,
    openGraph: {
      title: chapter.headline,
      description: chapter.intro,
      images: chapter.image ? [chapter.image] : [],
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const products = await getProductsByChapter(slug, 20);

  const bundleSavings = chapter.bundleOffer
    ? chapter.bundleOffer.productIds.reduce((sum, pid) => {
        const product = products.find(p => p.id === pid);
        return sum + (product?.price || 0);
      }, 0) * (chapter.bundleOffer.discountPct / 100)
    : 0;

  return (
    <div className="pt-8 pb-16">
      <div className="container-custom">
        {/* Chapter Hero */}
        <section className="mb-12" aria-labelledby="chapter-headline">
          <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden">
            {chapter.image ? (
              <img
                src={chapter.image}
                alt={chapter.headline}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-border flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 md:p-12">
              <div className="max-w-2xl text-text-inverse">
                <Badge variant="chapter" className="mb-4 inline-block">
                  Chapter: {chapter.name}
                </Badge>
                <h1 id="chapter-headline" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  The {chapter.name} Bedroom
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-6 max-w-xl">
                  {chapter.intro}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Products */}
        <section aria-labelledby="products-heading" className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="products-heading" className="text-2xl md:text-3xl font-bold text-text">
                Curated for {chapter.name}
              </h2>
              <p className="text-text-muted mt-1">{products.length} product{products.length !== 1 ? 's' : ''} selected for this chapter</p>
            </div>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted">No products in this chapter yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Bundle Offer */}
        {chapter.bundleOffer && chapter.bundleOffer.isActive && (
          <section aria-labelledby="bundle-heading" className="mb-12">
            <Card variant="bundle" className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h2 id="bundle-heading" className="text-xl font-bold text-text">
                      {chapter.bundleOffer.name}
                    </h2>
                    <Badge variant="error" size="sm">
                      {chapter.bundleOffer.discountPct}% OFF
                    </Badge>
                  </div>
                  <p className="text-text-muted mb-4">{chapter.bundleOffer.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" aria-hidden="true" />
                      {chapter.bundleOffer.productIds.length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" aria-hidden="true" />
                      Save {formatCurrency(bundleSavings)}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/cart?bundle=${chapter.bundleOffer.id}`}
                  className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg w-full md:w-auto"
                >
                  Add Bundle to Cart
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Bundle Products Preview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium text-text mb-4">Bundle includes:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {chapter.bundleOffer.productIds.map((productId) => {
                    const product = products.find(p => p.id === productId);
                    if (!product) return null;
                    return (
                      <Link key={product.id} href={`/product/${product.slug}`} className="flex items-center gap-3 p-3 bg-bg-subtle rounded-lg hover:bg-border transition-colors">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text truncate">{product.name}</p>
                          <p className="text-sm text-primary">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}