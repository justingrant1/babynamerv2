/**
 * Content Enhancement Library - Main Index
 * 
 * This module exports all rich editorial content for pSEO pages
 */

import type { RichContentBlock } from './types'

export type { RichContentBlock, EnhancedFAQ, FAQConfig, ContentLibrary } from './types'
export { ORIGIN_CONTENT, getOriginContent, getAvailableOrigins } from './origin-content'
export { CHARACTERISTIC_CONTENT, getCharacteristicContent, getAvailableCharacteristics } from './characteristic-content'
export { GENDER_CONTENT, getGenderContent, getAvailableGenders } from './gender-content'
export { LETTER_CONTENT, getLetterContent, getAvailableLetters } from './letter-content'

import { getOriginContent } from './origin-content'
import { getCharacteristicContent } from './characteristic-content'
import { getGenderContent } from './gender-content'
import { getLetterContent } from './letter-content'

/**
 * Get content for any page type
 */
export function getContent(type: 'origin' | 'characteristic' | 'gender' | 'letter', value: string): RichContentBlock | undefined {
  switch (type) {
    case 'origin':
      return getOriginContent(value)
    case 'characteristic':
      return getCharacteristicContent(value)
    case 'gender':
      return getGenderContent(value)
    case 'letter':
      return getLetterContent(value)
    default:
      return undefined
  }
}
