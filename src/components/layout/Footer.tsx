import Link from 'next/link';
import { Truck, Shield, RotateCcw, MessageCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { clsx } from 'clsx';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Bedding', href: '/shop/bedding' },
    { label: 'Pillows', href: '/shop/pillows' },
    { label: 'Rugs', href: '/shop/rugs' },
    { label: 'Curtains', href: '/shop/curtains' },
    { label: 'Lighting', href: '/shop/lighting' },
    { label: 'Storage', href: '/shop/storage' },
    { label: 'Nightwear', href: '/shop/nightwear' },
  ],
  chapters: [
    { label: 'Nursery', href: '/chapter/nursery' },
    { label: 'Newlywed', href: '/chapter/newlywed' },
    { label: 'Teen', href: '/chapter/teen' },
    { label: 'Guest', href: '/chapter/guest' },
    { label: 'Master', href: '/chapter/master' },
    { label: 'Minimalist', href: '/chapter/minimalist' },
    { label: 'Boho', href: '/chapter/boho' },
    { label: 'Modern', href: '/chapter/modern' },
    { label: 'Kids', href: '/chapter/kids' },
  ],
  help: [
    { label: 'Delivery & Returns', href: '/delivery-returns' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Journal', href: '/journal' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

const trustBadges = [
  { icon: Truck, label: 'Lagos Same-Day', desc: 'Order before 12pm' },
  { icon: Shield, label: 'Pay on Delivery', desc: 'Lagos, Abuja, PH ≤₦50k' },
  { icon: RotateCcw, label: '7-Day Returns', desc: 'No questions asked' },
];

export function Footer() {
  return (
    <footer className="bg-bg border-t border-border" role="contentinfo">
      <div className="container-custom py-12 lg:py-16">
        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12 lg:mb-16">
          {trustBadges.map((badge, i) => (
            <div
              key={badge.label}
              className="flex items-start gap-3 p-4 bg-trust-bg rounded-lg"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-trust-bg/50 flex items-center justify-center">
                <badge.icon className="h-5 w-5 text-trust-text" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-trust-text text-sm">{badge.label}</p>
                <p className="text-trust-text/80 text-xs mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
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
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop by category">
            <h3 className="font-semibold text-text mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
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
              {footerLinks.chapters.map((link) => (
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
              {footerLinks.help.map((link) => (
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
              {footerLinks.company.map((link) => (
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

        {/* WhatsApp CTA */}
        <div className="bg-trust-bg rounded-lg p-6 md:p-8 mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="h-6 w-6 text-trust-text" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-trust-text">Questions? Chat with us</h3>
          </div>
          <p className="text-trust-text/80 text-sm mb-4">
            Our sleep experts are here to help you find the perfect bedding. Available 9am-6pm daily.
          </p>
          <a
            href="https://wa.me/234XXXXXXXXXX?text=Hi%20Bedroom%20Chapters%2C%20I%20have%20a%20question%20about..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-trust-text text-text-inverse px-6 py-3 rounded-full font-medium hover:bg-trust-text/90 transition-colors"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Chat on WhatsApp
          </a>
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