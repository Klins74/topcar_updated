import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Define the base URL of your site
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.topcar.club';

  // Static routes
  // The KEY FIX is adding `: MetadataRoute.Sitemap` to explicitly type the array
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/autopark`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/download`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return staticRoutes;
}