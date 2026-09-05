'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface Chapter {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  chapters: Chapter[];
  priceRanges: PriceRange[];
  sizes: string[];
  colors: string[];
  currentFilters: {
    category?: string;
    chapter?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    sortBy?: string;
  };
}

export function FilterSidebar({
  categories,
  chapters,
  priceRanges,
  sizes,
  colors,
  currentFilters,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(['categories', 'price']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hasActiveFilters = Object.values(currentFilters).some((v) => v !== undefined && v !== '');

  const buildFilterUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    return `?${params.toString()}`;
  };

  const clearAllFilters = () => {
    window.location.href = '/shop';
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <FilterSection
        title="Categories"
        isOpen={openSections.includes('categories')}
        onToggle={() => toggleSection('categories')}
      >
        <ul className="space-y-2" role="list" aria-label="Categories">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={currentFilters.category === cat.slug}
                  onChange={() => (window.location.href = buildFilterUrl({ category: cat.slug }))}
                  className="h-4 w-4 text-primary border-border-strong focus:ring-primary focus:ring-2"
                  aria-label={cat.name}
                />
                <span className="text-sm text-text">{cat.name}</span>
                {cat._count && (
                  <span className="ml-auto text-xs text-text-muted">{cat._count.products}</span>
                )}
              </label>
            </li>
          ))}
        </ul>
        {currentFilters.category && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-text-muted hover:text-error"
            onClick={() => (window.location.href = buildFilterUrl({ category: undefined }))}
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear category
          </Button>
        )}
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <ul className="space-y-2" role="list" aria-label="Price ranges">
          {priceRanges.map((range) => (
            <li key={`${range.min}-${range.max}`}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={
                    currentFilters.minPrice === String(range.min) &&
                    currentFilters.maxPrice === String(range.max)
                  }
                  onChange={() => (window.location.href = buildFilterUrl({ minPrice: String(range.min), maxPrice: String(range.max) }))}
                  className="h-4 w-4 text-primary border-border-strong focus:ring-primary focus:ring-2"
                  aria-label={range.label}
                />
                <span className="text-sm text-text">{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
        {(currentFilters.minPrice || currentFilters.maxPrice) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-text-muted hover:text-error"
            onClick={() => (window.location.href = buildFilterUrl({ minPrice: undefined, maxPrice: undefined }))}
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear price filter
          </Button>
        )}
      </FilterSection>

      {/* Size */}
      <FilterSection
        title="Size"
        isOpen={openSections.includes('size')}
        onToggle={() => toggleSection('size')}
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sizes">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => (window.location.href = buildFilterUrl({ size }))}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md border transition-colors',
                currentFilters.size === size
                  ? 'bg-primary border-primary text-text-inverse'
                  : 'bg-bg border-border-strong text-text hover:bg-bg-subtle'
              )}
              aria-pressed={currentFilters.size === size}
            >
              {size}
            </button>
          ))}
        </div>
        {currentFilters.size && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-text-muted hover:text-error mt-2"
            onClick={() => (window.location.href = buildFilterUrl({ size: undefined }))}
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear size filter
          </Button>
        )}
      </FilterSection>

      {/* Color */}
      <FilterSection
        title="Color"
        isOpen={openSections.includes('color')}
        onToggle={() => toggleSection('color')}
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Colors">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => (window.location.href = buildFilterUrl({ color }))}
              className={clsx(
                'w-10 h-10 rounded-full border-2 transition-all',
                currentFilters.color === color
                  ? 'ring-2 ring-primary ring-offset-2 scale-110'
                  : 'hover:scale-105'
              )}
              style={{
                backgroundColor: getColorHex(color),
                borderColor: getColorBorder(color),
              }}
              aria-pressed={currentFilters.color === color}
              aria-label={color}
            />
          ))}
        </div>
        {currentFilters.color && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-text-muted hover:text-error mt-2"
            onClick={() => (window.location.href = buildFilterUrl({ color: undefined }))}
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear color filter
          </Button>
        )}
      </FilterSection>

      {/* Chapter */}
      <FilterSection
        title="Chapter"
        isOpen={openSections.includes('chapter')}
        onToggle={() => toggleSection('chapter')}
      >
        <ul className="space-y-2" role="list" aria-label="Chapters">
          {chapters.map((ch) => (
            <li key={ch.slug}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="chapter"
                  value={ch.slug}
                  checked={currentFilters.chapter === ch.slug}
                  onChange={() => (window.location.href = buildFilterUrl({ chapter: ch.slug }))}
                  className="h-4 w-4 text-primary border-border-strong focus:ring-primary focus:ring-2"
                  aria-label={ch.name}
                />
                <span className="text-sm text-text">{ch.name}</span>
              </label>
            </li>
          ))}
        </ul>
        {currentFilters.chapter && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-text-muted hover:text-error"
            onClick={() => (window.location.href = buildFilterUrl({ chapter: undefined }))}
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear chapter filter
          </Button>
        )}
      </FilterSection>
    </div>
  );

  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <>
        <Button
          variant="secondary"
          className="w-full justify-between"
          onClick={() => setIsMobileOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-text-inverse text-xs px-2 py-0.5 rounded-full">
              {Object.values(currentFilters).filter(Boolean).length}
            </span>
          )}
        </Button>

        <div
          className={clsx(
            'fixed inset-0 z-50 lg:hidden',
            isMobileOpen ? 'block' : 'hidden'
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-title"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-bg shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-bg border-b border-border p-4 flex items-center justify-between">
              <h2 id="filter-title" className="text-lg font-semibold text-text">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-text-muted hover:text-error"
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="p-4 pb-20">
              <SidebarContent />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-bg border border-border rounded-lg p-4 md:p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-muted hover:text-error"
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>
      <SidebarContent />
    </div>
  );
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-0 pb-6 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-text">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-text-muted" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-text-muted" aria-hidden="true" />
        )}
      </button>
      {isOpen && <div className="mt-4 animate-slide-down">{children}</div>}
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

function getColorBorder(color: string): string {
  const borders: Record<string, string> = {
    White: '#D4D4D4',
    Cream: '#E5E5E5',
  };
  return borders[color] || 'transparent';
}