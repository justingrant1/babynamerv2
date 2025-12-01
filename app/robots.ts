import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/shortlist',
          '/lists/',
          '/pricing',
        ],
      },
    ],
    sitemap: 'https://aibabynamer.com/sitemap.xml',
  }
}
