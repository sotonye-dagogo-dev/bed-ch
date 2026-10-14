'use client';

import { Truck, Shield, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { siteConfig } from '@/config/site';

const ICONS = {
  truck: Truck,
  shield: Shield,
  returns: RotateCcw,
} as const;

/**
 * Fixed bottom trust strip — mobile only.
 *
 * The Footer already renders the same trust badges (from the same
 * `siteConfig.trustBadges` source) for all viewports, so this bar is
 * `md:hidden`: it preserves the always-visible mobile trust signal without
 * duplicating the tiles directly below the footer on desktop.
 */
export function TrustBar() {
  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border',
        'md:hidden',
      )}
      role="region"
      aria-label="Trust guarantees"
    >
      <div className="container-custom">
        <div className="grid grid-cols-3 gap-0">
          {siteConfig.trustBadges.map((item) => {
            const Icon = ICONS[item.icon] ?? Shield;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center gap-1.5 py-3 px-2"
              >
                <div className="w-10 h-10 rounded-full bg-trust-bg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-trust-text" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-trust-text text-sm">{item.title}</p>
                  <p className="text-trust-text/80 text-xs">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
