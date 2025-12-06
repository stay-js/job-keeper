import type { MetadataRoute } from 'next';

const routes = ['/', '/dashboard', '/privacy-policy'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://job-keeper.znagy.hu${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
}
