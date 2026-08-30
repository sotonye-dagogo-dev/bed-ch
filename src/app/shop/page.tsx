import { Metadata } from 'next';
import { getProducts, ProductFilters } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { getChapters } from '@/lib/db/chapters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of quality bedding, pillows, rugs, curtains, lighting, and bedroom essentials. Filter by category, price, size, and more.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    chapter?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 12;

  const sortBy = params.sortBy as ProductFilters['sortBy'] | undefined;

  const [productsData, categories, chapters] = await Promise.all([
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

  const priceRanges = [
    { label: 'Under ₦5,000', min: 0, max: 500000 },
    { label: '₦5,000 - ₦15,000', min: 500000, max: 1500000 },
    { label: '₦15,000 - ₦30,000', min: 1500000, max: 3000000 },
    { label: '₦30,000 - ₦50,000', min: 3000000, max: 5000000 },
    { label: 'Over ₦50,000', min: 5000000, max: 10000000 },
  ];

  const sizes = ['Single', 'Double', 'Queen', 'King', 'Standard', '120x170cm', '160x230cm', '140x240cm', '45cm', '180cm'];
  const colors = ['White', 'Sage', 'Natural', 'Cream', 'Grey', 'Black', 'Neutral'];

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
              <select
                className="w-full sm:w-auto h-10 px-4 bg-bg border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                defaultValue={params.sortBy || 'newest'}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('sortBy', e.target.value);
                  url.searchParams.delete('page');
                  window.location.href = url.toString();
                }}
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="bestselling">Best Selling</option>
              </select>
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
                        href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
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
                        href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
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