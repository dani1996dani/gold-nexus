import { MetadataRoute } from 'next';
import { pages } from '@/lib/info-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.goldnexus.net';

  // Static routes
  const staticRoutes = ['', '/marketplace', '/sell-gold', '/login', '/register'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Info Pages
  const infoRoutes = Object.keys(pages).map((slug) => ({
    url: `${baseUrl}/info/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...infoRoutes];
}
