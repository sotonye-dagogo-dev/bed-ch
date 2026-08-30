'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId: string;
}

interface FBQ {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
}

declare global {
  interface Window {
    fbq: FBQ;
  }
}

export function MetaPixel({ pixelId }: MetaPixelProps) {
  useEffect(() => {
    if (!pixelId || pixelId === 'XXXXXXXXXX') return;

    // Initialize fbq
    window.fbq = window.fbq || function (...args: unknown[]) {
      void ((window.fbq as FBQ).callMethod
        ? (window.fbq as FBQ).callMethod!.apply(window.fbq, args)
        : (window.fbq as FBQ).queue!.push(args));
    };
    void ((window.fbq as FBQ).queue = []);
    void ((window.fbq as FBQ)('init', pixelId));
    void ((window.fbq as FBQ)('track', 'PageView'));
  }, [pixelId]);

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}