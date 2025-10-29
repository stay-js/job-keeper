import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
  ],
  host: 'https://job-keeper.znagy.hu',
  sitemap: 'https://job-keeper.znagy.hu/sitemap.xml',
});

export default robots;
