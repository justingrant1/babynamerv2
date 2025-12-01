/**
 * Syllable and Length-based SEO constants for programmatic page generation
 * Phase 2 of PSEO Strategy
 */

export interface SyllableInfo {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  count: number;
}

export interface LengthInfo {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  minLength?: number;
  maxLength?: number;
}

/**
 * Syllable-based page configurations
 * Targeting "X syllable baby names" keywords
 */
export const SYLLABLES: Record<string, SyllableInfo> = {
  '1': {
    slug: '1',
    count: 1,
    title: '1 Syllable Baby Names',
    description: 'Short and sweet one syllable baby names. Perfect for parents wanting simple, strong names that are easy to say and remember.',
    keywords: ['1 syllable names', 'one syllable baby names', 'single syllable names', 'short baby names'],
  },
  '2': {
    slug: '2',
    count: 2,
    title: '2 Syllable Baby Names',
    description: 'Beautiful two syllable baby names offering the perfect balance of simplicity and elegance. Classic and timeless options.',
    keywords: ['2 syllable names', 'two syllable baby names', 'names with 2 syllables'],
  },
  '3': {
    slug: '3',
    count: 3,
    title: '3 Syllable Baby Names',
    description: 'Elegant three syllable baby names with flowing rhythm and sophisticated sound. Perfect for parents seeking melodic names.',
    keywords: ['3 syllable names', 'three syllable baby names', 'names with 3 syllables'],
  },
  '4': {
    slug: '4',
    count: 4,
    title: '4 Syllable Baby Names',
    description: 'Distinctive four syllable baby names that stand out with their graceful length and unique character.',
    keywords: ['4 syllable names', 'four syllable baby names', 'long baby names'],
  },
};

/**
 * Length-based page configurations
 * Targeting "short/long baby names" keywords
 */
export const LENGTHS: Record<string, LengthInfo> = {
  'short': {
    slug: 'short',
    title: 'Short Baby Names',
    description: 'Discover short baby names (3-4 letters) that are punchy, memorable, and easy to spell. Perfect for modern parents.',
    keywords: ['short baby names', 'short names', '3 letter names', '4 letter names', 'brief names'],
    minLength: 3,
    maxLength: 4,
  },
  'medium': {
    slug: 'medium',
    title: 'Medium Length Baby Names',
    description: 'Classic medium-length baby names (5-6 letters) offering the perfect balance between brevity and substance.',
    keywords: ['medium length names', '5 letter names', '6 letter names', 'average length names'],
    minLength: 5,
    maxLength: 6,
  },
  'long': {
    slug: 'long',
    title: 'Long Baby Names',
    description: 'Elegant long baby names (7+ letters) with distinguished character and rich history. Sophisticated and memorable.',
    keywords: ['long baby names', 'long names', '7 letter names', '8 letter names', 'lengthy names'],
    minLength: 7,
  },
};

/**
 * Get all syllable counts for page generation
 */
export function getAllSyllableCounts(): string[] {
  return Object.keys(SYLLABLES);
}

/**
 * Get syllable info by count
 */
export function getSyllableInfo(count: string): SyllableInfo | undefined {
  return SYLLABLES[count];
}

/**
 * Get all length slugs for page generation
 */
export function getAllLengthSlugs(): string[] {
  return Object.keys(LENGTHS);
}

/**
 * Get length info by slug
 */
export function getLengthInfo(slug: string): LengthInfo | undefined {
  return LENGTHS[slug.toLowerCase()];
}

/**
 * Get popular syllable/length categories (for navigation)
 */
export function getPopularCategories() {
  return {
    syllables: ['1', '2', '3'],
    lengths: ['short', 'medium', 'long'],
  };
}
