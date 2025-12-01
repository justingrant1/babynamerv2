/**
 * Structured Data (JSON-LD) Generation Utilities
 * Generates Schema.org markup for rich snippets in search results
 */

import { ORIGIN_LABELS, MEANING_LABELS, GENDER_LABELS } from './constants'

const SITE_NAME = 'AI Baby Namer'
const SITE_URL = 'https://aibabynamer.com'

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate WebPage schema
 */
export function generateWebPage(
  title: string,
  description: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * Generate ItemList schema for name collections
 */
export function generateNameList(
  names: Array<{ name: string; meaning?: string; origin?: string }>,
  listName: string,
  listDescription: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: names.length,
    itemListElement: names.map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: name.name,
      description: name.meaning || `${name.name} baby name`,
      url: `${SITE_URL}/name/${name.name.toLowerCase()}`,
    })),
  }
}

/**
 * Generate FAQPage schema
 */
export function generateFAQ(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Article schema for individual name pages
 */
export function generateNameArticle(
  name: string,
  meaning?: string,
  origin?: string,
  gender?: string
) {
  const nameCap = name.charAt(0).toUpperCase() + name.slice(1)
  const genderLabel = gender ? GENDER_LABELS[gender] : ''
  
  let description = `Discover the meaning and origin of the name ${nameCap}.`
  if (meaning && origin) {
    description = `${nameCap} means "${meaning}" and has ${origin} origin.`
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${nameCap} - Name Meaning & Origin`,
    description,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/name/${name.toLowerCase()}`,
    },
  }
}

/**
 * Generate CollectionPage schema
 */
export function generateCollectionPage(
  title: string,
  description: string,
  url: string,
  numberOfItems?: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    ...(numberOfItems && { numberOfItems }),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * Generate Organization schema (site-wide)
 */
export function generateOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'AI-powered baby name generator helping parents find the perfect name',
    sameAs: [
      // Add social media profiles here when available
    ],
  }
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Find the perfect baby name with AI-powered suggestions',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/name/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Helper function to generate FAQ content for characteristic pages
 */
export function generateCharacteristicFAQs(
  characteristicType: string,
  characteristicValue: string,
  gender?: string
): Array<{ question: string; answer: string }> {
  const genderText = gender && gender !== 'any' ? ` ${GENDER_LABELS[gender]}` : ''
  
  const faqs = []

  // Common FAQs for origin pages
  if (characteristicType === 'origin') {
    const originLabel = ORIGIN_LABELS[characteristicValue] || characteristicValue
    faqs.push({
      question: `What are popular ${originLabel}${genderText.toLowerCase()} baby names?`,
      answer: `Popular ${originLabel}${genderText.toLowerCase()} baby names include traditional and modern options that reflect ${originLabel} heritage and culture. Our AI generator can help you discover both classic and unique ${originLabel} names.`,
    })
    faqs.push({
      question: `What makes ${originLabel} names special?`,
      answer: `${originLabel} names often carry deep cultural significance and meaningful origins. They reflect the rich history, language, and traditions of ${originLabel} heritage.`,
    })
    faqs.push({
      question: `How do I choose a ${originLabel} name for my baby?`,
      answer: `Consider the name's meaning, pronunciation, and how it pairs with your last name. Think about family connections and cultural significance. Our AI generator can help you explore options based on your preferences.`,
    })
  }

  // Common FAQs for meaning pages
  if (characteristicType === 'meaning') {
    const meaningLabel = MEANING_LABELS[characteristicValue] || characteristicValue
    faqs.push({
      question: `What are some${genderText.toLowerCase()} baby names meaning ${meaningLabel.toLowerCase()}?`,
      answer: `There are many beautiful${genderText.toLowerCase()} names that mean ${meaningLabel.toLowerCase()}, spanning various origins and cultures. Use our AI generator to discover names that embody the essence of ${meaningLabel.toLowerCase()}.`,
    })
    faqs.push({
      question: `Why choose a name meaning ${meaningLabel.toLowerCase()}?`,
      answer: `Names with ${meaningLabel.toLowerCase()}-related meanings can reflect the qualities and values you hope your child will embody. These names carry positive associations and meaningful symbolism.`,
    })
  }

  // Common FAQs for letter pages
  if (characteristicType === 'letter') {
    const letter = characteristicValue.toUpperCase()
    faqs.push({
      question: `What are popular${genderText.toLowerCase()} names starting with ${letter}?`,
      answer: `There are many popular${genderText.toLowerCase()} names that start with ${letter}, ranging from classic to modern options. Browse our collection to find the perfect ${letter} name for your baby.`,
    })
    faqs.push({
      question: `How many baby names start with the letter ${letter}?`,
      answer: `There are hundreds of baby names beginning with ${letter} from various origins and cultures. Our database includes both common and unique options to help you find the perfect match.`,
    })
  }

  return faqs
}

/**
 * Generate schema for meaning-based pages
 */
export function generateMeaningSchema(
  title: string,
  description: string,
  meaning: string,
  names: Array<{ name: string; meaning?: string; origin?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${SITE_URL}/names/meaning/${meaning}`,
    numberOfItems: names.length,
    mainEntity: {
      '@type': 'ItemList',
      name: `Names Meaning ${meaning}`,
      numberOfItems: names.length,
      itemListElement: names.map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: name.name,
          description: name.meaning || `${name.name} - baby name meaning ${meaning}`,
          url: `${SITE_URL}/name/${name.name.toLowerCase()}`,
        },
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * Generate complete structured data for a page
 */
export function generateCompleteStructuredData(params: {
  breadcrumbs?: Array<{ name: string; url: string }>
  webPage?: { title: string; description: string; url: string }
  nameList?: {
    names: Array<{ name: string; meaning?: string; origin?: string }>
    listName: string
    listDescription: string
  }
  faq?: Array<{ question: string; answer: string }>
  nameArticle?: {
    name: string
    meaning?: string
    origin?: string
    gender?: string
  }
  collectionPage?: {
    title: string
    description: string
    url: string
    numberOfItems?: number
  }
}) {
  const structuredData = []

  if (params.breadcrumbs) {
    structuredData.push(generateBreadcrumbs(params.breadcrumbs))
  }

  if (params.webPage) {
    structuredData.push(
      generateWebPage(
        params.webPage.title,
        params.webPage.description,
        params.webPage.url
      )
    )
  }

  if (params.nameList) {
    structuredData.push(
      generateNameList(
        params.nameList.names,
        params.nameList.listName,
        params.nameList.listDescription
      )
    )
  }

  if (params.faq && params.faq.length > 0) {
    structuredData.push(generateFAQ(params.faq))
  }

  if (params.nameArticle) {
    structuredData.push(
      generateNameArticle(
        params.nameArticle.name,
        params.nameArticle.meaning,
        params.nameArticle.origin,
        params.nameArticle.gender
      )
    )
  }

  if (params.collectionPage) {
    structuredData.push(
      generateCollectionPage(
        params.collectionPage.title,
        params.collectionPage.description,
        params.collectionPage.url,
        params.collectionPage.numberOfItems
      )
    )
  }

  return structuredData
}
