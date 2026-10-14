import { Metadata } from 'next';
import { getProducts, ProductFilters } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { getChapters } from '@/lib/db/chapters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { ShopSortSelect } from '@/components/product/ShopSortSelect';
import { Skeleton } from '@/components/ui/Skeleton';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of quality bedding, pillows, rugs, curtains, lighting, and bedroom essentials. Filter by category, price, size, and more.',
};

interface ShopPageProps {
  // Next 14 passes a plain object, Next 15 passes a Promise — accept both.
  searchParams:
    | Promise<{
        category?: string;
        chapter?: string;
        minPrice?: string;
        maxPrice?: string;
        size?: string;
        color?: string;
        sortBy?: string;
        page?: string;
      }>
    | {
        category?: string;
        chapter?: string;
        minPrice?: string;
        maxPrice?: string;
        size?: string;
        color?: string;
        sortBy?: string;
        page?: string;
      };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Next 14 passes a plain object, Next 15 passes a Promise — support both
  // so routing never crashes on `await` / null reads.
  const params = (await Promise.resolve(searchParams)) ?? {};
  const page = parseInt(params.page || '1');
  const limit = 12;

  const sortBy = params.sortBy as ProductFilters['sortBy'] | undefined;

  // Null-safe data load: a DB/prerender failure renders the empty state
  // (via the segment error boundary on throw) instead of an opaque crash.
  let productsData: Awaited<ReturnType<typeof getProducts>>;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let chapters: Awaited<ReturnType<typeof getChapters>> = [];
  try {
    [productsData, categories, chapters] = await Promise.all([
      getProducts({
        category: params.category,
        chapter: params.chapter,
        minPrice: params.minPrice ? parseInt(params.minPrice) * 100 : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) * 100 : undefined,
        sizes: params.size ? [params.size] : undefined,
        colors: params.color ? [params.color] : undefined,
        sortBy,
        page,
        limit,
      }),
      getCategories(),
      getChapters(),
    ]);
  } catch {
    throw new Error('Failed to load products. Please try again.');
  }

  const priceRanges = siteConfig.filters.priceRanges;

  const sizes = siteConfig.filters.sizes;
  const colors = siteConfig.filters.colors;

  const buildPageHref = (targetPage: number): string => {
    const entries = Object.entries(params ?? {}).filter(
      ([, v]) => v !== undefined && v !== '',
    ) as [string, string][];
    const qs = new URLSearchParams(entries);
    qs.set('page', String(targetPage));
    return `?${qs.toString()}`;
  };

  return (
    <div className="pt-8 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text">Shop All Products</h1>
          <p className="text-text-muted mt-1">
            {productsData.total} product{productsData.total !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              chapters={chapters}
              priceRanges={priceRanges}
              sizes={sizes}
              colors={colors}
              currentFilters={{
                category: params.category,
                chapter: params.chapter,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                size: params.size,
                color: params.color,
                sortBy: params.sortBy,
              }}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                className="w-full btn-secondary justify-between"
                aria-label="Open filters"
              >
                Filters
                <span className="text-sm text-text-muted">
                  {productsData.total} results
                </span>
              </button>
            </div>

            {/* Sort & Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-text-muted">
                Showing {productsData.products.length} of {productsData.total} products
              </p>
              <ShopSortSelect defaultValue={params.sortBy || 'newest'} />
            </div>

            {/* Product Grid */}
            {productsData.products.length > 0 ? (
              <>
                <ProductGrid products={productsData.products} />
                
                {/* Pagination */}
                {productsData.totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                    {page > 1 && (
                      <a
                        href={buildPageHref(page - 1)}
                        className="px-4 py-2 border border-border rounded-md text-text hover:bg-bg-subtle transition-colors"
                        aria-label="Previous page"
                      >
                        Previous
                      </a>
                    )}
                    <span className="px-4 py-2 text-text-muted">
                      Page {page} of {productsData.totalPages}
                    </span>
                    {page < productsData.totalPages && (
                      <a
                        href={buildPageHref(page + 1)}
                        className="px-4 py-2 border border-border rounded-md text-text hover:bg-bg-subtle transition-colors"
                        aria-label="Next page"
                      >
                        Next
                      </a>
                    )}
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Skeleton variant="rectangular" className="mx-auto mb-4" style={{ width: '80px', height: '80px' }} />
                <h3 className="text-lg font-medium text-text mb-2">No products found</h3>
                <p className="text-text-muted mb-6">Try adjusting your filters or search terms</p>
                <a
                  href="/shop"
                  className="text-primary font-medium hover:underline"
                >
                  Clear all filters
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}