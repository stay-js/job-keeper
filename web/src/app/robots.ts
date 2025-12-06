import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    host: 'https://job-keeper.znagy.hu',
    sitemap: 'https://job-keeper.znagy.hu/sitemap.xml',
  };
}
