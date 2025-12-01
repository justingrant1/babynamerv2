/**
 * SEO Metadata Generation Utilities
 * Dynamically generates meta titles, descriptions, and Open Graph tags
 */

import { Metadata } from 'next'
import {
  ORIGIN_LABELS,
  ORIGIN_DESCRIPTIONS,
  MEANING_LABELS,
  MEANING_DESCRIPTIONS,
  UNIQUENESS_LABELS,
  UNIQUENESS_DESCRIPTIONS,
  LENGTH_LABELS,
  LENGTH_DESCRIPTIONS,
  POPULARITY_LABELS,
  POPULARITY_DESCRIPTIONS,
  CULTURAL_LABELS,
  CULTURAL_DESCRIPTIONS,
  SOUND_LABELS,
  SOUND_DESCRIPTIONS,
  SPELLING_LABELS,
  SPELLING_DESCRIPTIONS,
  FAMILY_LABELS,
  FAMILY_DESCRIPTIONS,
  RELIGION_LABELS,
  RELIGION_DESCRIPTIONS,
  NICKNAME_LABELS,
  NICKNAME_DESCRIPTIONS,
  GENDER_LABELS,
  type CharacteristicType,
} from './constants'

const SITE_NAME = 'AI Baby Namer'
const SITE_URL = 'https://aibabynamer.com'

interface MetadataParams {
  title: string
  description: string
  path: string
  keywords?: string[]
}

/**
 * Generate full metadata object for a page
 */
export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
}: MetadataParams): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Generate metadata for origin pages
 */
export function generateOriginMetadata(
  origin: string,
  gender?: string
): Metadata {
  const originLabel = ORIGIN_LABELS[origin] || origin
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${originLabel}${genderText} Baby Names`
  const description = ORIGIN_DESCRIPTIONS[origin] || `Discover beautiful ${originLabel}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any' 
    ? `/names/${gender}/origin/${origin}`
    : `/names/origin/${origin}`

  const keywords = [
    `${originLabel} baby names`,
    `${originLabel}${genderText.toLowerCase()} names`,
    `${originLabel} name meanings`,
    `${originLabel} name origins`,
    'baby name generator',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for meaning pages
 */
export function generateMeaningMetadata(
  meaning: string,
  gender?: string
): Metadata {
  const meaningLabel = MEANING_LABELS[meaning] || meaning
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `Baby Names Meaning ${meaningLabel}${genderText}`
  const description = MEANING_DESCRIPTIONS[meaning] || `Find${genderText.toLowerCase()} baby names that mean ${meaningLabel.toLowerCase()}.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/meaning/${meaning}`
    : `/names/meaning/${meaning}`

  const keywords = [
    `names meaning ${meaningLabel.toLowerCase()}`,
    `baby names meaning ${meaningLabel.toLowerCase()}`,
    `${meaningLabel.toLowerCase()}${genderText.toLowerCase()} names`,
    'baby name meanings',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for uniqueness pages
 */
export function generateUniquenessMetadata(
  level: string,
  gender?: string
): Metadata {
  const levelLabel = UNIQUENESS_LABELS[level] || level
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${levelLabel}${genderText} Baby Names`
  const description = UNIQUENESS_DESCRIPTIONS[level] || `Explore ${levelLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/uniqueness/${level}`
    : `/names/uniqueness/${level}`

  const keywords = [
    `${levelLabel.toLowerCase()} baby names`,
    `unique${genderText.toLowerCase()} names`,
    `rare baby names`,
    `uncommon names`,
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for length pages
 */
export function generateLengthMetadata(
  length: string,
  gender?: string
): Metadata {
  const lengthLabel = LENGTH_LABELS[length] || length
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${lengthLabel}${genderText} Baby Names`
  const description = LENGTH_DESCRIPTIONS[length] || `Browse ${lengthLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/length/${length}`
    : `/names/length/${length}`

  const keywords = [
    `${lengthLabel.toLowerCase()} baby names`,
    `${lengthLabel.toLowerCase()}${genderText.toLowerCase()} names`,
    'baby name length',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for popularity pages
 */
export function generatePopularityMetadata(
  level: string,
  gender?: string
): Metadata {
  const levelLabel = POPULARITY_LABELS[level] || level
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${levelLabel}${genderText} Baby Names`
  const description = POPULARITY_DESCRIPTIONS[level] || `Find ${levelLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/popularity/${level}`
    : `/names/popularity/${level}`

  const keywords = [
    `${levelLabel.toLowerCase()} baby names`,
    `popular${genderText.toLowerCase()} names`,
    'trending baby names',
    'top baby names',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for cultural pages
 */
export function generateCulturalMetadata(
  type: string,
  gender?: string
): Metadata {
  const typeLabel = CULTURAL_LABELS[type] || type
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${typeLabel}${genderText} Baby Names`
  const description = CULTURAL_DESCRIPTIONS[type] || `Explore ${typeLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/cultural/${type}`
    : `/names/cultural/${type}`

  const keywords = [
    `${typeLabel.toLowerCase()} baby names`,
    `${typeLabel.toLowerCase()}${genderText.toLowerCase()} names`,
    'cultural baby names',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for sound pages
 */
export function generateSoundMetadata(
  type: string,
  gender?: string
): Metadata {
  const typeLabel = SOUND_LABELS[type] || type
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${typeLabel} Sounding${genderText} Baby Names`
  const description = SOUND_DESCRIPTIONS[type] || `Find ${typeLabel.toLowerCase()} sounding${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/sound/${type}`
    : `/names/sound/${type}`

  const keywords = [
    `${typeLabel.toLowerCase()} sounding names`,
    `${typeLabel.toLowerCase()}${genderText.toLowerCase()} names`,
    'baby name sounds',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for spelling pages
 */
export function generateSpellingMetadata(
  type: string,
  gender?: string
): Metadata {
  const typeLabel = SPELLING_LABELS[type] || type
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${typeLabel} Spelling${genderText} Baby Names`
  const description = SPELLING_DESCRIPTIONS[type] || `Browse ${typeLabel.toLowerCase()} spelling${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/spelling/${type}`
    : `/names/spelling/${type}`

  const keywords = [
    `${typeLabel.toLowerCase()} spelling names`,
    `easy to spell${genderText.toLowerCase()} names`,
    'baby name spellings',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for family tradition pages
 */
export function generateFamilyMetadata(
  type: string,
  gender?: string
): Metadata {
  const typeLabel = FAMILY_LABELS[type] || type
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${typeLabel}${genderText} Baby Names`
  const description = FAMILY_DESCRIPTIONS[type] || `Discover ${typeLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/family/${type}`
    : `/names/family/${type}`

  const keywords = [
    `${typeLabel.toLowerCase()} baby names`,
    `family${genderText.toLowerCase()} names`,
    'family tradition names',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for religion pages
 */
export function generateReligionMetadata(
  religion: string,
  gender?: string
): Metadata {
  const religionLabel = RELIGION_LABELS[religion] || religion
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${religionLabel}${genderText} Baby Names`
  const description = RELIGION_DESCRIPTIONS[religion] || `Explore ${religionLabel.toLowerCase()}${genderText.toLowerCase()} baby names.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/religion/${religion}`
    : `/names/religion/${religion}`

  const keywords = [
    `${religionLabel.toLowerCase()} baby names`,
    `${religionLabel.toLowerCase()}${genderText.toLowerCase()} names`,
    'religious baby names',
    'biblical names',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for nickname pages
 */
export function generateNicknameMetadata(
  type: string,
  gender?: string
): Metadata {
  const typeLabel = NICKNAME_LABELS[type] || type
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${typeLabel}${genderText} Baby Names`
  const description = NICKNAME_DESCRIPTIONS[type] || `Find${genderText.toLowerCase()} baby names with ${typeLabel.toLowerCase()} nicknames.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/nickname/${type}`
    : `/names/nickname/${type}`

  const keywords = [
    `baby names with nicknames`,
    `${typeLabel.toLowerCase()} nicknames`,
    `${genderText.toLowerCase()} names`,
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for letter pages
 */
export function generateLetterMetadata(
  letter: string,
  gender?: string
): Metadata {
  const letterUpper = letter.toUpperCase()
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  const genderText = gender && gender !== 'any' ? ` ${genderLabel}` : ''
  
  const title = `${genderText} Baby Names Starting with ${letterUpper}`.trim()
  const description = `Discover beautiful${genderText.toLowerCase()} baby names that start with the letter ${letterUpper}.`
  
  const path = gender && gender !== 'any'
    ? `/names/${gender}/starting-with/${letter}`
    : `/names/starting-with/${letter}`

  const keywords = [
    `${genderText.toLowerCase()} names starting with ${letterUpper}`,
    `baby names beginning with ${letterUpper}`,
    `${letterUpper} names`,
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for trending year pages
 */
export function generateTrendingMetadata(year: string): Metadata {
  const title = `Trending Baby Names ${year}`
  const description = `Discover the most popular and trending baby names of ${year}. See what names parents are choosing this year.`
  const path = `/names/trending/${year}`

  const keywords = [
    `trending baby names ${year}`,
    `popular baby names ${year}`,
    `top baby names ${year}`,
    'baby name trends',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for individual name pages
 */
export function generateNameMetadata(
  name: string,
  meaning?: string,
  origin?: string,
  gender?: string
): Metadata {
  const nameCap = name.charAt(0).toUpperCase() + name.slice(1)
  const genderText = gender ? ` (${GENDER_LABELS[gender]})` : ''
  
  const title = `${nameCap} Name Meaning & Origin${genderText}`
  let description = `Discover the meaning, origin, and popularity of the name ${nameCap}.`
  
  if (meaning && origin) {
    description = `${nameCap} means "${meaning}" and has ${origin} origin. Learn more about this beautiful baby name.`
  } else if (meaning) {
    description = `${nameCap} means "${meaning}". Discover the origin, popularity, and similar names.`
  } else if (origin) {
    description = `${nameCap} is a ${origin} name. Learn about its meaning, popularity, and variations.`
  }
  
  const path = `/name/${name.toLowerCase()}`

  const keywords = [
    `${nameCap} name meaning`,
    `${nameCap} name origin`,
    `what does ${nameCap} mean`,
    `${nameCap} baby name`,
    'baby name meanings',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for gender pages
 */
export function generateGenderMetadata(gender: string): Metadata {
  const genderLabel = GENDER_LABELS[gender] || gender
  
  const title = `${genderLabel} Baby Names`
  const description = `Discover beautiful ${genderLabel.toLowerCase()} baby names. Browse our curated collection of ${genderLabel.toLowerCase()} names with meanings and origins.`
  const path = `/names/${gender}`

  const keywords = [
    `${genderLabel.toLowerCase()} baby names`,
    `${genderLabel.toLowerCase()} names`,
    `baby names for ${genderLabel.toLowerCase()}s`,
    'baby name ideas',
  ]

  return generateMetadata({ title, description, path, keywords })
}

/**
 * Generate metadata for main names directory
 */
export function generateNamesDirectoryMetadata(): Metadata {
  const title = 'Browse Baby Names by Category'
  const description = 'Explore thousands of baby names organized by origin, meaning, popularity, and more. Find the perfect name for your baby.'
  const path = '/names'

  const keywords = [
    'baby names',
    'baby name categories',
    'name meanings',
    'name origins',
    'baby name finder',
  ]

  return generateMetadata({ title, description, path, keywords })
}
