import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ORIGINS, LETTERS, GENDERS } from '@/lib/seo/constants'
import { getAllMeaningSlugs } from '@/lib/seo/meanings'
import { getAllSyllableCounts, getAllLengthSlugs } from '@/lib/seo/syllables'
import { getAllCharacteristicSlugs } from '@/lib/seo/characteristics'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aibabynamer.com'
  const supabase = await createClient()
  
  const routes: MetadataRoute.Sitemap = []
  
  // Static pages
  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  routes.push({
    url: `${baseUrl}/names`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  })

  // Origin pages (base + gender variants)
  for (const origin of ORIGINS) {
    routes.push({
      url: `${baseUrl}/names/origin/${origin}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/origin/${origin}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  // Letter pages (base + gender variants)
  for (const letter of LETTERS) {
    routes.push({
      url: `${baseUrl}/names/starting-with/${letter}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/starting-with/${letter}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  // Meaning pages (base + gender variants) - Phase 1
  const meanings = getAllMeaningSlugs()
  for (const meaning of meanings) {
    routes.push({
      url: `${baseUrl}/names/meaning/${meaning}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/meaning/${meaning}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  // Syllable pages (base + gender variants) - Phase 2
  const syllableCounts = getAllSyllableCounts()
  for (const count of syllableCounts) {
    routes.push({
      url: `${baseUrl}/names/syllables/${count}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/syllables/${count}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  // Length pages (base + gender variants) - Phase 2
  const lengthSlugs = getAllLengthSlugs()
  for (const slug of lengthSlugs) {
    routes.push({
      url: `${baseUrl}/names/length/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/length/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  // Characteristic pages (base + gender variants) - Phase 3
  const characteristics = getAllCharacteristicSlugs()
  for (const trait of characteristics) {
    routes.push({
      url: `${baseUrl}/names/characteristic/${trait}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // Higher priority - high search volume keywords
    })
    
    for (const gender of GENDERS.filter(g => g !== 'any')) {
      routes.push({
        url: `${baseUrl}/names/${gender}/characteristic/${trait}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }
  
  // Origin + Characteristic combination pages (base + gender variants) - Phase 4
  for (const origin of ORIGINS) {
    for (const trait of characteristics) {
      // Base origin + characteristic pages
      routes.push({
        url: `${baseUrl}/names/origin/${origin}/characteristic/${trait}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      })
      
      // Gender-specific origin + characteristic pages
      for (const gender of GENDERS.filter(g => g !== 'any')) {
        routes.push({
          url: `${baseUrl}/names/${gender}/origin/${origin}/characteristic/${trait}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        })
      }
    }
  }
  
  // Individual name pages
  const { data: names } = await supabase
    .from('names')
    .select('name, created_at')
    .limit(1000)
  
  for (const name of names || []) {
    routes.push({
      url: `${baseUrl}/name/${name.name.toLowerCase()}`,
      lastModified: new Date(name.created_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }
  
  return routes
}
