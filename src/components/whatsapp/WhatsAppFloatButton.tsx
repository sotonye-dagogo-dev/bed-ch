'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { getWhatsAppContactUrl, siteConfig } from '@/config/site';

/**
 * Floating WhatsApp "Chat to order" button.
 *
 * Position contract (per design-system, adjusted for collisions):
 * - Mobile: fixed bottom-24 right-4 (above the fixed TrustBar + clear of
 *   the header's mobile search FAB at bottom-40), z-50.
 * - Desktop: fixed bottom-6 right-6, z-50.
 * Rendered once from the root layout (NOT inside <header>) so it keeps a
 * true viewport-fixed position on every page.
 */
export function WhatsAppFloatButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth < 768);
      } catch {
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const whatsappUrl = getWhatsAppContactUrl(siteConfig.whatsapp.defaultMessage);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .whatsapp-pulse { animation: none !important; }
        }
      `}</style>

      {/* Pulse ring animation */}
      <div
        className={clsx(
          'whatsapp-pulse fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary/20',
          'md:bottom-6 md:right-6',
        )}
        style={{
          animation: 'pulse-ring 2s ease-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Main Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'fixed bottom-24 right-4 z-50',
          'w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg',
          'transition-all duration-fast hover:scale-105 active:scale-95',
          'md:bottom-6 md:right-6',
        )}
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        <MessageCircle className="h-7 w-7 text-text-inverse" aria-hidden="true" />
      </a>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 right-[5.5rem] z-50 hidden md:block"
          >
            <div className="bg-text text-text-inverse px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap shadow-lg flex items-center gap-2">
              Chat to order
              <X className="h-4 w-4" aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
