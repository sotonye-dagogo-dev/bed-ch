const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Fetch dynamic data
  const [categories, chapters, products] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.chapter.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  // Build static routes
  const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/shop', priority: 0.8, changefreq: 'daily' },
    { path: '/terms', priority: 0.3, changefreq: 'monthly' },
    { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { path: '/delivery-returns', priority: 0.3, changefreq: 'monthly' },
  ];

  // Build dynamic routes
  const categoryRoutes = categories.map(c => ({
    path: `/shop/${c.slug}`,
    priority: 0.7,
    changefreq: 'weekly',
  }));

  const chapterRoutes = chapters.map(c => ({
    path: `/chapter/${c.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
  }));

  const productRoutes = products.map(p => ({
    path: `/product/${p.slug}`,
    priority: 0.7,
    changefreq: 'weekly',
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...chapterRoutes, ...productRoutes];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allRoutes.map(route => `  <url><loc>${siteUrl}${route.path}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`).join('\n')}
</urlset>`;

  // Write sitemap
  const fs = require('fs');
  const path = require('path');
  const publicDir = path.join(__dirname, '..', 'public');
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`✅ Generated sitemap.xml with ${allRoutes.length} URLs`);

  // Generate robots.txt
  const robotsTxt = `# *
User-agent: *
Allow: /

# *
User-agent: *
Disallow: /api/
Disallow: /checkout/
Disallow: /cart
Disallow: /order/

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt');

  await prisma.$disconnect();
}

generateSitemap().catch(console.error);