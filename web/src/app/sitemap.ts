import type { MetadataRoute } from 'next';

const routes = ['/', '/dashboard', '/privacy-policy'];

const sitemap = (): MetadataRoute.Sitemap => {
  return routes.map((route) => ({
    url: `https://job-keeper.znagy.hu${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
};

export default sitemap;
