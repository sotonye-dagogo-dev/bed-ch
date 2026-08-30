'use client';

import { GA4 } from './GA4';
import { MetaPixel } from './MetaPixel';
import { Hotjar } from './Hotjar';

export function AnalyticsProviders() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;

  if (!ga4Id && !metaPixelId && !hotjarId) {
    return null;
  }

  return (
    <>
      {ga4Id && <GA4 measurementId={ga4Id} />}
      {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
      {hotjarId && <Hotjar siteId={hotjarId} />}
    </>
  );
}