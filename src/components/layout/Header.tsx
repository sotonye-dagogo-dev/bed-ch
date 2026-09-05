'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { CartSlideOut } from '@/components/cart/CartSlideOut';
import { WhatsAppFloatButton } from '@/components/whatsapp/WhatsAppFloatButton';
import { CartProvider, useCart } from '@/lib/cart-context';

const categories = [
  { name: 'Bedding', slug: 'bedding', icon: '🛏️' },
  { name: 'Pillows', slug: 'pillows', icon: '🛌' },
  { name: 'Rugs', slug: 'rugs', icon: '🧵' },
  { name: 'Curtains', slug: 'curtains', icon: '🪟' },
  { name: 'Lighting', slug: 'lighting', icon: '💡' },
  { name: 'Storage', slug: 'storage', icon: '📦' },
  { name: 'Nightwear', slug: 'nightwear', icon: '👕' },
  { name: 'Function', slug: 'function', icon: '🔧' },
];

const chapters = [
  { name: 'Nursery', slug: 'nursery' },
  { name: 'Newlywed', slug: 'newlywed' },
  { name: 'Teen', slug: 'teen' },
  { name: 'Guest', slug: 'guest' },
  { name: 'Master', slug: 'master' },
  { name: 'Minimalist', slug: 'minimalist' },
  { name: 'Boho', slug: 'boho' },
  { name: 'Modern', slug: 'modern' },
  { name: 'Kids', slug: 'kids' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-sm transition-shadow duration-fast',
        isScrolled ? 'shadow-sm border-b border-border' : 'border-b border-transparent'
      )}
      role="banner"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Bedroom Chapters Home">
            <span className="text-2xl font-bold text-text" style={{ fontFamily: 'Inter, sans-serif' }}>
              Bedroom<span className="text-primary"> Chapters</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Actions */}
          <nav className="flex items-center gap-2" aria-label="Main actions">
            <Link
              href="/shop"
              className="hidden sm:block px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Shop
            </Link>
<Link
            href="/shop"
            className="hidden sm:block px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors relative"
          >
            Chapters
            <span className="absolute -top-1 -right-1 bg-primary text-text-inverse text-xs px-1.5 py-0.5 rounded-full">
              9
            </span>
          </Link>

          <CartButton onClick={() => setCartOpen(true)} />

          <a
              href="https://wa.me/234XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-text font-medium px-3 py-2 rounded-md hover:bg-bg-subtle transition-colors min-h-[44px]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>Chat</span>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className={clsx('md:hidden px-4 pb-4 transition-all duration-fast overflow-hidden', searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0')}>
          <SearchBar />
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title="Menu"
          side="left"
          size="full"
        >
          <nav className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/shop/${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-3 text-text hover:bg-bg-subtle rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Chapters</h3>
              <ul className="space-y-2">
                {chapters.map((ch) => (
                  <li key={ch.slug}>
                    <Link
                      href={`/chapter/${ch.slug}`}
                      className="flex items-center gap-3 px-3 py-3 text-text hover:bg-bg-subtle rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {ch.name.charAt(0)}
                      </span>
                      <span className="font-medium">{ch.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-3 text-text hover:bg-bg-subtle rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/delivery-returns"
                className="flex items-center gap-3 px-3 py-3 text-text hover:bg-bg-subtle rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delivery & Returns
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-3 py-3 text-text hover:bg-bg-subtle rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        </Sheet>

        {/* Cart Slide Out */}
        <CartProvider>
          <CartSlideOut isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </CartProvider>
      </div>

      {/* WhatsApp Float Button */}
      <WhatsAppFloatButton />

      {/* Mobile Search Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed bottom-20 right-4 z-30"
        onClick={() => setSearchOpen(!searchOpen)}
        aria-label="Search"
        aria-expanded={searchOpen}
      >
        <Search className="h-6 w-6" aria-hidden="true" />
      </Button>
    </header>
  );
}

function SearchBar() {
  return (
    <form role="search" className="relative w-full">
      <label htmlFor="header-search" className="sr-only">
        Search products
      </label>
      <input
        id="header-search"
        type="search"
        placeholder="Search bedsheets, pillows, rugs..."
        className="w-full h-10 pl-10 pr-4 bg-bg-subtle border-0 rounded-full text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        autoComplete="off"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" aria-hidden="true" />
    </form>
  );
}

function CartButton({ onClick }: { onClick: () => void }) {
  const { totals } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={`Open cart, ${totals.itemCount} items`}
      className="relative hidden sm:flex"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {totals.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-text-inverse text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {totals.itemCount > 99 ? '99+' : totals.itemCount}
        </span>
      )}
    </Button>
  );
}