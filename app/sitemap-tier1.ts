import { MetadataRoute } from 'next'

/**
 * TIER 1 PRIORITY SITEMAP
 * 
 * This reduced sitemap contains only ~150 high-priority pages
 * to help Google index the most valuable content first.
 * 
 * Once 70%+ of these pages are indexed (monitor in GSC),
 * expand to sitemap-tier2.ts, then eventually back to full sitemap.ts
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aibabynamer.com'
  const routes: MetadataRoute.Sitemap = []
  
  // Core pages (5 pages)
  routes.push(
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/names`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/names/male`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/names/female`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/names/unisex`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  )

  // Top 10 Origins (base + 3 gender variants = 40 pages)
  const topOrigins = ['irish', 'english', 'hebrew', 'arabic', 'indian', 'italian', 'spanish', 'greek', 'french', 'german']
  const genders = ['male', 'female', 'unisex']
  
  for (const origin of topOrigins) {
    // Base origin page
    routes.push({
      url: `${baseUrl}/names/origin/${origin}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    })
    
    // Gender-specific origin pages
    for (const gender of genders) {
      routes.push({
        url: `${baseUrl}/names/${gender}/origin/${origin}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  // Top 10 Characteristics (base + 3 gender variants = 40 pages)
  const topCharacteristics = ['unique', 'strong', 'beautiful', 'powerful', 'elegant', 'modern', 'classic', 'rare', 'popular', 'traditional']
  
  for (const trait of topCharacteristics) {
    // Base characteristic page
    routes.push({
      url: `${baseUrl}/names/characteristic/${trait}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority - high search volume
    })
    
    // Gender-specific characteristic pages
    for (const gender of genders) {
      routes.push({
        url: `${baseUrl}/names/${gender}/characteristic/${trait}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }
  }

  // Top 5 Meanings (base + 3 gender variants = 20 pages)
  const topMeanings = ['strength', 'love', 'light', 'wisdom', 'joy']
  
  for (const meaning of topMeanings) {
    // Base meaning page
    routes.push({
      url: `${baseUrl}/names/meaning/${meaning}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    })
    
    // Gender-specific meaning pages
    for (const gender of genders) {
      routes.push({
        url: `${baseUrl}/names/${gender}/meaning/${meaning}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  // Top 26 Letters (A-Z, base only = 26 pages)
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  
  for (const letter of letters) {
    routes.push({
      url: `${baseUrl}/names/starting-with/${letter}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  
  console.log(`✅ Tier 1 Sitemap: Generated ${routes.length} priority URLs`)
  
  return routes
}
