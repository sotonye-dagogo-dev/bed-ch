'use client';

import { Truck, Shield, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

const trustItems = [
  {
    icon: Truck,
    title: 'Lagos Same-Day',
    desc: 'Order before 12pm',
  },
  {
    icon: Shield,
    title: 'Pay on Delivery',
    desc: 'Lagos, Abuja, PH ≤₦50k',
  },
  {
    icon: RotateCcw,
    title: '7-Day Returns',
    desc: 'No questions asked',
  },
];

export function TrustBar() {
  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-border',
        'md:static md:border-0 md:bg-transparent md:shadow-none'
      )}
      role="region"
      aria-label="Trust guarantees"
    >
      <div className="container-custom">
        <div className="grid grid-cols-3 gap-0 md:gap-4 md:grid-flow-col md:justify-center md:max-w-4xl md:mx-auto">
          {trustItems.map((item, i) => (
            <div
              key={item.title}
              className={clsx(
                'flex flex-col items-center gap-1.5 py-3 px-2',
                'md:p-0 md:py-0 md:border-l md:border-border md:first:border-0'
              )}
            >
              <div className="w-10 h-10 rounded-full bg-trust-bg flex items-center justify-center md:w-8 md:h-8">
                <item.icon className="h-5 w-5 text-trust-text md:h-4 md:w-4" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-trust-text text-sm md:text-xs">{item.title}</p>
                <p className="text-trust-text/80 text-xs md:text-[10px]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}