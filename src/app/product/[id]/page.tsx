import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronRight, Minus, Plus, Truck, Shield, RotateCcw, ShoppingCart, Share2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProductBySlug, getRelatedProducts } from '@/lib/db/products';
import { formatPrice, NIGERIAN_STATES } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
      type: 'website',
    },
    other: {
      'product:price:amount': String(product.price / 100),
      'product:price:currency': 'NGN',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, 4);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const variants = product.variants || [];
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))] as string[];

  return (
    <div className="pt-8 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <a href={`/shop/${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </a>
            </>
          )}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="text-text truncate max-w-[200px]" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-bg-subtle">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="error" size="md">-{discount}%</Badge>
                </div>
              )}
              {product.isBestseller && (
                <div className="absolute top-4 right-4">
                  <Badge variant="success" size="sm">Bestseller</Badge>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Product images">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors"
                    style={{ borderColor: index === 0 ? '#8FBC8F' : '#E5E5E5' }}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === 0 ? 'true' : 'false'}
                  >
                    <img src={image} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.category && (
              <div className="flex items-center gap-2 flex-wrap">
                <a href={`/shop/${product.category.slug}`} className="text-sm text-text-muted hover:text-primary transition-colors">
                  {product.category.name}
                </a>
                {product.chapter && (
                  <>
                    <span className="text-text-muted">/</span>
                    <Badge variant="chapter" as="a" href={`/chapter/${product.chapter.slug}`}>
                      {product.chapter.name}
                    </Badge>
                  </>
                )}
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-text leading-tight">{product.name}</h1>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-xl text-text-muted line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>

            <p className="text-text-muted">{product.description}</p>

            {/* Variant Selectors */}
            {(sizes.length > 0 || colors.length > 0) && (
              <div className="space-y-4 border-t border-border pt-6">
                {sizes.length > 0 && (
                  <div>
                    <label className="label">Size *</label>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={clsx(
                            'px-4 py-2 border rounded-md text-sm font-medium transition-colors',
                            'bg-bg border-border text-text hover:border-primary'
                          )}
                          role="radio"
                          aria-checked="false"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <label className="label">Color *</label>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select color">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={clsx(
                            'w-10 h-10 rounded-full border-2 transition-all',
                            'ring-2 ring-primary ring-offset-2'
                          )}
                          style={{ backgroundColor: getColorHex(color) }}
                          role="radio"
                          aria-checked="false"
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-border pt-6">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <button type="button" className="p-3 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors" aria-label="Decrease quantity">
                    <Minus className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="px-4 text-base font-medium text-text">1</span>
                  <button type="button" className="p-3 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors" aria-label="Increase quantity">
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="border-t border-border pt-6">
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
                Add to Cart
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              <TrustBadge icon={Truck} title="Lagos Same-Day" desc="Order before 12pm" />
              <TrustBadge icon={Shield} title="Pay on Delivery" desc="Lagos, Abuja, PH ≤₦50k" />
              <TrustBadge icon={RotateCcw} title="7-Day Returns" desc="No questions asked" />
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <span className="text-sm text-text-muted">Share:</span>
              <button className="p-2 text-text-muted hover:text-primary transition-colors" aria-label="Share on WhatsApp">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.397-.424l-.506-1.432a17.1 17.1 0 002.146-6.238 9.85 9.85 0 00-2.926-5.046 9.8 9.8 0 014.768-.852c1.53.1 2.993.447 4.326 1.096a9.76 9.76 0 013.05 3.817 9.87 9.87 0 01.707 5.03c-.003.476-.04 1.043-.108 1.419-.159.917-.983 1.547-1.928 1.847l-.08.024c-.63.083-1.128.183-1.533.183z"/></svg>
              </button>
              <button className="p-2 text-text-muted hover:text-primary transition-colors" aria-label="Share on Twitter">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-text mb-6">Product Details</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-text-muted mb-4">{product.description}</p>
              <h3 className="text-lg font-semibold text-text mb-2">Features</h3>
              <ul className="list-disc list-inside text-text-muted space-y-1 mb-4">
                <li>Premium quality materials</li>
                <li>Designed for Nigerian homes</li>
                <li>Easy care and maintenance</li>
                <li>Durable construction</li>
              </ul>
              <h3 className="text-lg font-semibold text-text mb-2">Care Instructions</h3>
              <ul className="list-disc list-inside text-text-muted space-y-1">
                <li>Machine wash cold, gentle cycle</li>
                <li>Tumble dry low or line dry</li>
                <li>Iron on low heat if needed</li>
                <li>Do not bleach</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
              Check Delivery Estimate
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                label="State"
                options={NIGERIAN_STATES.map(s => ({ value: s, label: s }))}
                placeholder="Select your state"
              />
              <div className="flex-1">
                <label className="label">Estimated Delivery</label>
                <div className="h-12 px-4 bg-bg border border-border rounded-md flex items-center text-text">
                  Standard: 3-5 business days
                </div>
              </div>
            </div>
            <p className="text-sm text-text-muted mt-4">
              <strong>Pay on Delivery:</strong> Available in Lagos, Abuja & Port Harcourt for orders ≤₦50,000.
              <br />
              <strong>Express Lagos:</strong> Same-day delivery for orders placed before 12pm.
            </p>
          </Card>
        </div>

        {/* Complete the Look */}
        {relatedProducts.length > 0 && (
          <section className="mt-16" aria-labelledby="complete-look-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="complete-look-heading" className="text-2xl font-bold text-text">Complete the Look</h2>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-trust-bg rounded-lg">
      <Icon className="h-5 w-5 text-trust-text mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium text-trust-text text-sm">{title}</p>
        <p className="text-trust-text/80 text-xs">{desc}</p>
      </div>
    </div>
  );
}

function getColorHex(color: string): string {
  const colors: Record<string, string> = {
    White: '#FFFFFF',
    Sage: '#8FBC8F',
    Natural: '#D2B48C',
    Cream: '#FFFDD0',
    Grey: '#808080',
    Black: '#1A1A1A',
    Neutral: '#A0A0A0',
  };
  return colors[color] || '#CCCCCC';
}

