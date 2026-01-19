/**
 * Content Enhancement Types
 * 
 * These types define the structure for rich editorial content
 * that will make pSEO pages more valuable and indexable.
 */

export interface RichContentBlock {
  /** The main category (e.g., "irish", "unique", "male") */
  slug: string
  
  /** Display title */
  title: string
  
  /** 500-800 word rich introduction with context, history, trends */
  introduction: string
  
  /** Cultural significance or background context */
  culturalContext?: string
  
  /** Naming traditions and customs */
  traditions?: string
  
  /** Modern trends and statistics */
  modernTrends?: string
  
  /** Famous examples, celebrities, or notable bearers */
  famousExamples?: string
  
  /** Practical tips for choosing names in this category */
  tips?: string[]
  
  /** Statistical insights */
  statistics?: {
    popularityTrend?: 'rising' | 'stable' | 'declining'
    percentOfNewborns?: string
    topDecade?: string
    searchVolume?: string
    [key: string]: string | undefined
  }
  
  /** Additional sections for flexibility */
  additionalSections?: {
    title: string
    content: string
  }[]
}

export interface EnhancedFAQ {
  question: string
  answer: string
  category?: string
}

export interface FAQConfig {
  /** The page type (origin, characteristic, gender, letter, meaning) */
  pageType: string
  
  /** The specific value (e.g., "irish" for origin, "unique" for characteristic) */
  value: string
  
  /** Number of FAQs to generate */
  count?: number
}

export interface ContentLibrary {
  origins: Record<string, RichContentBlock>
  characteristics: Record<string, RichContentBlock>
  genders: Record<string, RichContentBlock>
  letters: Record<string, RichContentBlock>
  meanings: Record<string, RichContentBlock>
}
