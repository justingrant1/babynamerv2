/**
 * SEO Constants for Programmatic SEO
 * Contains all characteristic values, metadata, and URL slugs
 */

// ============================================
// ORIGINS (14 total)
// ============================================
export const ORIGINS = [
  'english',
  'jewish',
  'spanish',
  'french',
  'italian',
  'german',
  'scandinavian',
  'arabic',
  'indian',
  'chinese',
  'japanese',
  'african',
  'native-american',
  'slavic',
] as const

export const ORIGIN_LABELS: Record<string, string> = {
  'english': 'English',
  'jewish': 'Jewish',
  'spanish': 'Spanish',
  'french': 'French',
  'italian': 'Italian',
  'german': 'German',
  'scandinavian': 'Scandinavian',
  'arabic': 'Arabic',
  'indian': 'Indian',
  'chinese': 'Chinese',
  'japanese': 'Japanese',
  'african': 'African',
  'native-american': 'Native American',
  'slavic': 'Slavic',
}

export const ORIGIN_DESCRIPTIONS: Record<string, string> = {
  'english': 'Discover timeless English baby names with rich historical significance and classic appeal.',
  'jewish': 'Explore Hebrew and Jewish baby names with deep spiritual and cultural meaning.',
  'spanish': 'Find beautiful Spanish baby names with passionate and romantic origins.',
  'french': 'Browse elegant French baby names known for their sophistication and charm.',
  'italian': 'Explore melodic Italian baby names that evoke Mediterranean warmth and culture.',
  'german': 'Discover strong German baby names with powerful meanings and heritage.',
  'scandinavian': 'Find Nordic baby names from Scandinavian countries with Viking heritage.',
  'arabic': 'Browse Arabic baby names with beautiful meanings and Islamic tradition.',
  'indian': 'Explore vibrant Indian baby names from Sanskrit and Hindi traditions.',
  'chinese': 'Discover Chinese baby names with ancient wisdom and cultural significance.',
  'japanese': 'Find Japanese baby names inspired by nature, beauty, and tradition.',
  'african': 'Browse African baby names celebrating diverse cultures across the continent.',
  'native-american': 'Explore Native American baby names honoring indigenous heritage.',
  'slavic': 'Discover Slavic baby names from Eastern European traditions.',
}

// ============================================
// MEANINGS (6 total)
// ============================================
export const MEANINGS = [
  'nature',
  'strength',
  'wisdom',
  'peace',
  'love',
  'virtue',
] as const

export const MEANING_LABELS: Record<string, string> = {
  'nature': 'Nature',
  'strength': 'Strength',
  'wisdom': 'Wisdom',
  'peace': 'Peace',
  'love': 'Love',
  'virtue': 'Virtue',
}

export const MEANING_DESCRIPTIONS: Record<string, string> = {
  'nature': 'Baby names inspired by the natural world - flowers, trees, seasons, and elements.',
  'strength': 'Powerful baby names that embody courage, bravery, and inner fortitude.',
  'wisdom': 'Thoughtful baby names representing intelligence, knowledge, and enlightenment.',
  'peace': 'Serene baby names that evoke tranquility, harmony, and calmness.',
  'love': 'Affectionate baby names celebrating compassion, tenderness, and devotion.',
  'virtue': 'Noble baby names representing moral excellence, honor, and integrity.',
}

// ============================================
// UNIQUENESS (3 levels)
// ============================================
export const UNIQUENESS_LEVELS = [
  'very-unique',
  'moderately-unique',
  'somewhat-unique',
] as const

export const UNIQUENESS_LABELS: Record<string, string> = {
  'very-unique': 'Very Unique',
  'moderately-unique': 'Moderately Unique',
  'somewhat-unique': 'Somewhat Unique',
}

export const UNIQUENESS_DESCRIPTIONS: Record<string, string> = {
  'very-unique': 'Rare and distinctive baby names used by less than 1% of parents.',
  'moderately-unique': 'Uncommon baby names that stand out while remaining recognizable.',
  'somewhat-unique': 'Less common baby names that are familiar but not overused.',
}

// ============================================
// LENGTH (3 categories)
// ============================================
export const LENGTHS = [
  'short',
  'medium',
  'long',
] as const

export const LENGTH_LABELS: Record<string, string> = {
  'short': 'Short',
  'medium': 'Medium',
  'long': 'Long',
}

export const LENGTH_DESCRIPTIONS: Record<string, string> = {
  'short': 'Concise baby names with 1-4 letters or 1-2 syllables - perfect for simplicity.',
  'medium': 'Balanced baby names with 5-7 letters or 2-3 syllables - the sweet spot.',
  'long': 'Elegant baby names with 8+ letters or 3+ syllables - grand and distinguished.',
}

// ============================================
// POPULARITY (4 levels)
// ============================================
export const POPULARITY_LEVELS = [
  'very-popular',
  'moderately-popular',
  'less-popular',
  'rare',
] as const

export const POPULARITY_LABELS: Record<string, string> = {
  'very-popular': 'Very Popular',
  'moderately-popular': 'Moderately Popular',
  'less-popular': 'Less Popular',
  'rare': 'Rare',
}

export const POPULARITY_DESCRIPTIONS: Record<string, string> = {
  'very-popular': 'Top 10 trending baby names chosen by parents nationwide.',
  'moderately-popular': 'Well-known baby names ranking in the top 100 nationally.',
  'less-popular': 'Familiar baby names that are less commonly chosen (top 500).',
  'rare': 'Distinctive baby names outside the top 500 rankings.',
}

// ============================================
// CULTURAL SIGNIFICANCE (4 types)
// ============================================
export const CULTURAL_TYPES = [
  'historical',
  'mythological',
  'festive',
  'traditional',
] as const

export const CULTURAL_LABELS: Record<string, string> = {
  'historical': 'Historical',
  'mythological': 'Mythological',
  'festive': 'Festive',
  'traditional': 'Traditional',
}

export const CULTURAL_DESCRIPTIONS: Record<string, string> = {
  'historical': 'Baby names inspired by famous historical figures, leaders, and icons.',
  'mythological': 'Legendary baby names from Greek, Roman, Norse, and other mythologies.',
  'festive': 'Seasonal and holiday-inspired baby names celebrating special occasions.',
  'traditional': 'Classic baby names with deep cultural roots and timeless appeal.',
}

// ============================================
// SOUND (4 types)
// ============================================
export const SOUND_TYPES = [
  'soft',
  'strong',
  'musical',
  'traditional',
] as const

export const SOUND_LABELS: Record<string, string> = {
  'soft': 'Soft',
  'strong': 'Strong',
  'musical': 'Musical',
  'traditional': 'Traditional',
}

export const SOUND_DESCRIPTIONS: Record<string, string> = {
  'soft': 'Gentle, melodic baby names with flowing sounds and tender pronunciation.',
  'strong': 'Bold, powerful baby names with sharp consonants and commanding presence.',
  'musical': 'Rhythmic, lyrical baby names that roll off the tongue beautifully.',
  'traditional': 'Classic-sounding baby names with familiar, timeless pronunciation.',
}

// ============================================
// SPELLING (3 types)
// ============================================
export const SPELLING_TYPES = [
  'simple',
  'unique',
  'traditional',
] as const

export const SPELLING_LABELS: Record<string, string> = {
  'simple': 'Simple',
  'unique': 'Unique',
  'traditional': 'Traditional',
}

export const SPELLING_DESCRIPTIONS: Record<string, string> = {
  'simple': 'Easy-to-spell baby names that are phonetically straightforward.',
  'unique': 'Creatively spelled baby names with unconventional variations.',
  'traditional': 'Conventionally spelled baby names following standard patterns.',
}

// ============================================
// FAMILY TRADITION (3 types)
// ============================================
export const FAMILY_TYPES = [
  'honorific',
  'initial',
  'style',
] as const

export const FAMILY_LABELS: Record<string, string> = {
  'honorific': 'Honorific',
  'initial': 'Initial-Based',
  'style': 'Style Match',
}

export const FAMILY_DESCRIPTIONS: Record<string, string> = {
  'honorific': 'Baby names that honor ancestors, grandparents, and family heritage.',
  'initial': 'Baby names that share initials or letters with family members.',
  'style': 'Baby names with similar style and sound to sibling names.',
}

// ============================================
// RELIGIOUS SIGNIFICANCE (5 religions)
// ============================================
export const RELIGIONS = [
  'christian',
  'jewish',
  'islamic',
  'hindu',
  'buddhist',
] as const

export const RELIGION_LABELS: Record<string, string> = {
  'christian': 'Christian',
  'jewish': 'Jewish',
  'islamic': 'Islamic',
  'hindu': 'Hindu',
  'buddhist': 'Buddhist',
}

export const RELIGION_DESCRIPTIONS: Record<string, string> = {
  'christian': 'Biblical baby names from Christian tradition, including saints and apostles.',
  'jewish': 'Hebrew baby names from Jewish scripture and rabbinical tradition.',
  'islamic': 'Muslim baby names from the Quran and Islamic prophetic tradition.',
  'hindu': 'Sanskrit baby names from Hindu scriptures, gods, and spiritual concepts.',
  'buddhist': 'Dharmic baby names inspired by Buddhist teachings and enlightenment.',
}

// ============================================
// NICKNAME POTENTIAL (4 types)
// ============================================
export const NICKNAME_TYPES = [
  'shortened',
  'diminutive',
  'playful',
  'none',
] as const

export const NICKNAME_LABELS: Record<string, string> = {
  'shortened': 'Shortened',
  'diminutive': 'Diminutive',
  'playful': 'Playful',
  'none': 'No Nicknames',
}

export const NICKNAME_DESCRIPTIONS: Record<string, string> = {
  'shortened': 'Baby names that naturally shorten to simpler versions (e.g., William → Will).',
  'diminutive': 'Baby names with cute, endearing nickname options (e.g., Margaret → Maggie).',
  'playful': 'Baby names with fun, whimsical nickname possibilities (e.g., Theodore → Teddy).',
  'none': 'Baby names that stand alone without common nickname variations.',
}

// ============================================
// LETTERS (26 letters A-Z)
// ============================================
export const LETTERS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
] as const

// ============================================
// GENDERS (4 categories)
// ============================================
export const GENDERS = [
  'boy',
  'girl',
  'unisex',
  'any',
] as const

export const GENDER_LABELS: Record<string, string> = {
  'boy': 'Boy',
  'girl': 'Girl',
  'male': 'Male',
  'female': 'Female',
  'unisex': 'Unisex',
  'any': 'Any Gender',
}

export const GENDER_DB_MAP: Record<string, string> = {
  'boy': 'male',
  'girl': 'female',
  'male': 'male',
  'female': 'female',
  'unisex': 'unisex',
  'any': '',
}

// ============================================
// TRENDING YEARS
// ============================================
export const TRENDING_YEARS = [
  '2024',
  '2025',
] as const

// ============================================
// TYPE DEFINITIONS
// ============================================
export type Origin = typeof ORIGINS[number]
export type Meaning = typeof MEANINGS[number]
export type UniquenessLevel = typeof UNIQUENESS_LEVELS[number]
export type Length = typeof LENGTHS[number]
export type PopularityLevel = typeof POPULARITY_LEVELS[number]
export type CulturalType = typeof CULTURAL_TYPES[number]
export type SoundType = typeof SOUND_TYPES[number]
export type SpellingType = typeof SPELLING_TYPES[number]
export type FamilyType = typeof FAMILY_TYPES[number]
export type Religion = typeof RELIGIONS[number]
export type NicknameType = typeof NICKNAME_TYPES[number]
export type Letter = typeof LETTERS[number]
export type Gender = typeof GENDERS[number]
export type TrendingYear = typeof TRENDING_YEARS[number]

// ============================================
// CHARACTERISTIC TYPES (for routing)
// ============================================
export const CHARACTERISTIC_TYPES = {
  origin: ORIGINS,
  meaning: MEANINGS,
  uniqueness: UNIQUENESS_LEVELS,
  length: LENGTHS,
  popularity: POPULARITY_LEVELS,
  cultural: CULTURAL_TYPES,
  sound: SOUND_TYPES,
  spelling: SPELLING_TYPES,
  family: FAMILY_TYPES,
  religion: RELIGIONS,
  nickname: NICKNAME_TYPES,
  letter: LETTERS,
} as const

export type CharacteristicType = keyof typeof CHARACTERISTIC_TYPES
