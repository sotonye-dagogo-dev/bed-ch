import Link from 'next/link';
import { Truck, Shield, RotateCcw, MessageCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { siteConfig, shopCategoryHref, chapterHref, getWhatsAppContactUrl } from '@/config/site';

const SOCIAL_ICONS = {
  Instagram,
  Facebook,
  Twitter,
  YouTube: Youtube,
} as const;

const TRUST_ICONS = {
  truck: Truck,
  shield: Shield,
  returns: RotateCcw,
} as const;

/**
 * Footer layout order (per spec):
 * 1. Trust badges (single rendering — sustained, before the links)
 * 2. WhatsApp "Chat with us" CTA (above the footer links)
 * 3. Main link grid (Shop / Chapters / Help / Company)
 * 4. Bottom bar
 *
 * All links, badges and contact details come from `siteConfig` — no
 * hardcoded slugs, numbers or tiles. Trust tiles are the only rendering
 * of the guarantees (the former mobile fixed TrustBar strip was removed):
 * stacked + center-aligned on small screens, 3-column on sm+.
 */
export function Footer() {
  const shopLinks = [
    { label: 'All Products', href: '/shop' },
    ...siteConfig.categories
      .filter((c) => c.slug !== 'function')
      .slice(0, 7)
      .map((c) => ({ label: c.name, href: shopCategoryHref(c.slug) })),
  ];

  const chapterLinks = siteConfig.chapters.map((c) => ({
    label: c.name,
    href: chapterHref(c.slug),
  }));

  return (
    <footer className="bg-bg border-t border-border" role="contentinfo">
      <div className="container-custom py-12 lg:py-16">
        {/* Trust Badges — the single sustained tiles block, before the links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
          {siteConfig.trustBadges.map((badge) => {
            const Icon = TRUST_ICONS[badge.icon] ?? Shield;
            return (
              <div
                key={badge.title}
                className="flex flex-col items-center text-center gap-2 p-4 sm:p-6 bg-trust-bg rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-trust-bg/50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-trust-text" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-trust-text text-sm">{badge.title}</p>
                  <p className="text-trust-text/80 text-xs mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp CTA — above the footer links */}
        <div className="bg-trust-bg rounded-lg p-6 md:p-8 mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="h-6 w-6 text-trust-text" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-trust-text">Questions? Chat with us</h3>
          </div>
          <p className="text-trust-text/80 text-sm mb-4">
            Our sleep experts are here to help you find the perfect bedding. Available 9am-6pm daily.
          </p>
          <a
            href={getWhatsAppContactUrl(siteConfig.whatsapp.contactMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-trust-text text-text-inverse px-6 py-3 rounded-full font-medium hover:bg-trust-text/90 transition-colors"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Bedroom Chapters Home">
              <span className="text-2xl font-bold text-text" style={{ fontFamily: 'Inter, sans-serif' }}>
                Bedroom<span className="text-primary"> Chapters</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm mb-6 max-w-xs">
              Everything your bedroom needs. Curated quality, honest prices, delivered to your door.
            </p>
            <div className="flex gap-4">
              {siteConfig.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS] ?? Instagram;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Shop by category">
            <h3 className="font-semibold text-text mb-4">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Shop by chapter">
            <h3 className="font-semibold text-text mb-4">Chapters</h3>
            <ul className="space-y-3">
              {chapterLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help and support">
            <h3 className="font-semibold text-text mb-4">Help</h3>
            <ul className="space-y-3">
              {siteConfig.footer.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company information">
            <h3 className="font-semibold text-text mb-4">Company</h3>
            <ul className="space-y-3">
              {siteConfig.footer.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} Bedroom Chapters. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-text-muted hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-text-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/delivery-returns" className="text-sm text-text-muted hover:text-primary transition-colors">
                Delivery & Returns
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="font-medium text-primary">₦ NGN</span>
              <span>Nigeria</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
