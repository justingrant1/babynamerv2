/**
 * Characteristic-based SEO constants for programmatic page generation
 * Phase 3 of PSEO Strategy
 */

export interface CharacteristicInfo {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  relatedCharacteristics: string[];
  monthlySearchVolume?: number;
}

/**
 * Characteristic-based page configurations
 * Targeting trait/vibe-based keywords with HIGH search volumes
 */
export const CHARACTERISTICS: Record<string, CharacteristicInfo> = {
  // ULTRA HIGH VOLUME (10K+ monthly searches)
  'unique': {
    slug: 'unique',
    title: 'Unique Baby Names',
    description: 'Discover truly unique baby names that stand out. Perfect for parents seeking distinctive, one-of-a-kind names that your child won\'t share with classmates.',
    keywords: ['unique baby names', 'unique names', 'distinctive names', 'one of a kind names', 'unusual baby names'],
    relatedCharacteristics: ['rare', 'uncommon', 'exotic', 'modern'],
    monthlySearchVolume: 49500,
  },
  'cool': {
    slug: 'cool',
    title: 'Cool Baby Names',
    description: 'Find cool baby names with style and edge. Modern, trendy names that sound confident and charismatic.',
    keywords: ['cool baby names', 'cool names', 'stylish names', 'edgy names'],
    relatedCharacteristics: ['modern', 'trendy', 'bold', 'unique'],
    monthlySearchVolume: 22200,
  },
  'cute': {
    slug: 'cute',
    title: 'Cute Baby Names',
    description: 'Adorable cute baby names that are sweet and endearing. Perfect names that match your little one\'s precious personality.',
    keywords: ['cute baby names', 'cute names', 'adorable names', 'sweet names'],
    relatedCharacteristics: ['sweet', 'charming', 'gentle', 'pretty'],
    monthlySearchVolume: 14800,
  },
  'classic': {
    slug: 'classic',
    title: 'Classic Baby Names',
    description: 'Timeless classic baby names that never go out of style. Traditional names with enduring appeal and rich history.',
    keywords: ['classic baby names', 'classic names', 'timeless names', 'traditional baby names'],
    relatedCharacteristics: ['timeless', 'traditional', 'vintage', 'elegant'],
    monthlySearchVolume: 12100,
  },

  // HIGH VOLUME (5K-10K monthly searches)
  'beautiful': {
    slug: 'beautiful',
    title: 'Beautiful Baby Names',
    description: 'Gorgeous beautiful baby names with aesthetic appeal. Names that sound as lovely as they look.',
    keywords: ['beautiful baby names', 'beautiful names', 'gorgeous names', 'lovely names'],
    relatedCharacteristics: ['elegant', 'pretty', 'charming', 'sophisticated'],
    monthlySearchVolume: 9900,
  },
  'strong': {
    slug: 'strong',
    title: 'Strong Baby Names',
    description: 'Powerful strong baby names conveying strength and confidence. Bold names for resilient, determined children.',
    keywords: ['strong baby names', 'strong names', 'powerful names', 'bold names'],
    relatedCharacteristics: ['bold', 'brave', 'fierce', 'confident'],
    monthlySearchVolume: 8100,
  },
  'vintage': {
    slug: 'vintage',
    title: 'Vintage Baby Names',
    description: 'Charming vintage baby names from bygone eras. Classic names making a stylish comeback.',
    keywords: ['vintage baby names', 'vintage names', 'old fashioned names', 'retro names'],
    relatedCharacteristics: ['classic', 'traditional', 'timeless', 'elegant'],
    monthlySearchVolume: 8100,
  },
  'modern': {
    slug: 'modern',
    title: 'Modern Baby Names',
    description: 'Contemporary modern baby names for today\'s world. Fresh, current names with a stylish edge.',
    keywords: ['modern baby names', 'modern names', 'contemporary names', 'current names'],
    relatedCharacteristics: ['trendy', 'cool', 'unique', 'contemporary'],
    monthlySearchVolume: 6600,
  },
  'rare': {
    slug: 'rare',
    title: 'Rare Baby Names',
    description: 'Exceptionally rare baby names you won\'t hear everywhere. Uncommon gems for parents seeking originality.',
    keywords: ['rare baby names', 'rare names', 'uncommon names', 'unusual names'],
    relatedCharacteristics: ['unique', 'uncommon', 'exotic', 'distinctive'],
    monthlySearchVolume: 6600,
  },
  'elegant': {
    slug: 'elegant',
    title: 'Elegant Baby Names',
    description: 'Sophisticated elegant baby names with refined grace. Names that exude class and timeless beauty.',
    keywords: ['elegant baby names', 'elegant names', 'sophisticated names', 'refined names'],
    relatedCharacteristics: ['sophisticated', 'beautiful', 'classic', 'timeless'],
    monthlySearchVolume: 5400,
  },

  // MEDIUM VOLUME (2K-5K monthly searches)
  'traditional': {
    slug: 'traditional',
    title: 'Traditional Baby Names',
    description: 'Time-honored traditional baby names with deep roots. Classic names passed down through generations.',
    keywords: ['traditional baby names', 'traditional names', 'conventional names'],
    relatedCharacteristics: ['classic', 'timeless', 'vintage', 'heritage'],
    monthlySearchVolume: 4400,
  },
  'uncommon': {
    slug: 'uncommon',
    title: 'Uncommon Baby Names',
    description: 'Distinctive uncommon baby names off the beaten path. Rare finds that aren\'t overused.',
    keywords: ['uncommon baby names', 'uncommon names', 'unusual names'],
    relatedCharacteristics: ['rare', 'unique', 'distinctive', 'unusual'],
    monthlySearchVolume: 3600,
  },
  'trendy': {
    slug: 'trendy',
    title: 'Trendy Baby Names',
    description: 'On-trend trendy baby names gaining popularity. Current favorites that are stylish right now.',
    keywords: ['trendy baby names', 'trendy names', 'popular names', 'fashionable names'],
    relatedCharacteristics: ['modern', 'popular', 'cool', 'contemporary'],
    monthlySearchVolume: 2900,
  },
  'sophisticated': {
    slug: 'sophisticated',
    title: 'Sophisticated Baby Names',
    description: 'Refined sophisticated baby names with cultured appeal. Names that sound intelligent and worldly.',
    keywords: ['sophisticated baby names', 'sophisticated names', 'refined names', 'cultured names'],
    relatedCharacteristics: ['elegant', 'classic', 'beautiful', 'distinguished'],
    monthlySearchVolume: 2400,
  },

  // PERSONALITY & STRENGTH
  'brave': {
    slug: 'brave',
    title: 'Brave Baby Names',
    description: 'Courageous brave baby names meaning valor. Names inspiring bravery and fearlessness.',
    keywords: ['brave baby names', 'brave names', 'courageous names', 'valiant names'],
    relatedCharacteristics: ['strong', 'bold', 'fierce', 'confident'],
  },
  'bold': {
    slug: 'bold',
    title: 'Bold Baby Names',
    description: 'Daring bold baby names that make a statement. Confident names for fearless personalities.',
    keywords: ['bold baby names', 'bold names', 'daring names', 'confident names'],
    relatedCharacteristics: ['strong', 'brave', 'fierce', 'powerful'],
  },
  'fierce': {
    slug: 'fierce',
    title: 'Fierce Baby Names',
    description: 'Powerful fierce baby names with intensity. Strong names for determined, passionate spirits.',
    keywords: ['fierce baby names', 'fierce names', 'powerful names', 'intense names'],
    relatedCharacteristics: ['strong', 'bold', 'brave', 'warrior'],
  },
  'gentle': {
    slug: 'gentle',
    title: 'Gentle Baby Names',
    description: 'Soft gentle baby names with calm, peaceful vibes. Names evoking kindness and tranquility.',
    keywords: ['gentle baby names', 'gentle names', 'soft names', 'peaceful names'],
    relatedCharacteristics: ['sweet', 'kind', 'calm', 'serene'],
  },
  'sweet': {
    slug: 'sweet',
    title: 'Sweet Baby Names',
    description: 'Endearing sweet baby names full of warmth. Charming names as lovely as your little one.',
    keywords: ['sweet baby names', 'sweet names', 'endearing names', 'charming names'],
    relatedCharacteristics: ['cute', 'gentle', 'kind', 'adorable'],
  },
  'kind': {
    slug: 'kind',
    title: 'Kind Baby Names',
    description: 'Compassionate kind baby names meaning goodness. Names inspiring kindness and empathy.',
    keywords: ['kind baby names', 'kind names', 'compassionate names', 'caring names'],
    relatedCharacteristics: ['gentle', 'sweet', 'warm', 'loving'],
  },

  // STYLE & AESTHETIC
  'charming': {
    slug: 'charming',
    title: 'Charming Baby Names',
    description: 'Delightful charming baby names with appeal. Names that are winsome and engaging.',
    keywords: ['charming baby names', 'charming names', 'delightful names', 'appealing names'],
    relatedCharacteristics: ['cute', 'sweet', 'beautiful', 'lovely'],
  },
  'pretty': {
    slug: 'pretty',
    title: 'Pretty Baby Names',
    description: 'Lovely pretty baby names with beauty. Aesthetically pleasing names that sound beautiful.',
    keywords: ['pretty baby names', 'pretty names', 'lovely names', 'beautiful names'],
    relatedCharacteristics: ['beautiful', 'cute', 'charming', 'elegant'],
  },
  'handsome': {
    slug: 'handsome',
    title: 'Handsome Baby Names',
    description: 'Distinguished handsome baby names for boys. Strong, attractive names with classic appeal.',
    keywords: ['handsome baby names', 'handsome boy names', 'distinguished names'],
    relatedCharacteristics: ['strong', 'classic', 'distinguished', 'noble'],
  },

  // TIME PERIOD
  'timeless': {
    slug: 'timeless',
    title: 'Timeless Baby Names',
    description: 'Eternal timeless baby names that transcend trends. Names that will never feel dated.',
    keywords: ['timeless baby names', 'timeless names', 'eternal names', 'ageless names'],
    relatedCharacteristics: ['classic', 'traditional', 'elegant', 'enduring'],
  },
  'contemporary': {
    slug: 'contemporary',
    title: 'Contemporary Baby Names',
    description: 'Current contemporary baby names of today. Modern names reflecting present times.',
    keywords: ['contemporary baby names', 'contemporary names', 'current names', 'present day names'],
    relatedCharacteristics: ['modern', 'trendy', 'current', 'fresh'],
  },

  // POPULARITY
  'popular': {
    slug: 'popular',
    title: 'Popular Baby Names',
    description: 'Top popular baby names parents love. Most chosen names that are well-established favorites.',
    keywords: ['popular baby names', 'popular names', 'common names', 'favorite names'],
    relatedCharacteristics: ['trendy', 'common', 'favorite', 'top'],
  },
  'common': {
    slug: 'common',
    title: 'Common Baby Names',
    description: 'Familiar common baby names everyone knows. Well-established, widely-used classic names.',
    keywords: ['common baby names', 'common names', 'popular names', 'familiar names'],
    relatedCharacteristics: ['popular', 'traditional', 'classic', 'familiar'],
  },

  // NATURE & SOUND
  'nature': {
    slug: 'nature',
    title: 'Nature Baby Names',
    description: 'Earthy nature baby names inspired by the natural world. Names from flora, fauna, and landscapes.',
    keywords: ['nature baby names', 'nature names', 'nature inspired names', 'earthy names'],
    relatedCharacteristics: ['floral', 'earthy', 'organic', 'botanical'],
  },
  'floral': {
    slug: 'floral',
    title: 'Floral Baby Names',
    description: 'Botanical floral baby names from flowers. Beautiful names inspired by blooms and blossoms.',
    keywords: ['floral baby names', 'flower names', 'botanical names', 'bloom names'],
    relatedCharacteristics: ['nature', 'beautiful', 'pretty', 'delicate'],
  },
  'exotic': {
    slug: 'exotic',
    title: 'Exotic Baby Names',
    description: 'Intriguing exotic baby names from around the world. Distinctive international names with flair.',
    keywords: ['exotic baby names', 'exotic names', 'international names', 'worldly names'],
    relatedCharacteristics: ['unique', 'rare', 'international', 'distinctive'],
  },
};

/**
 * Get all characteristic slugs for page generation
 */
export function getAllCharacteristicSlugs(): string[] {
  return Object.keys(CHARACTERISTICS);
}

/**
 * Get characteristic info by slug
 */
export function getCharacteristicInfo(slug: string): CharacteristicInfo | undefined {
  return CHARACTERISTICS[slug.toLowerCase()];
}

/**
 * Get top characteristics by search volume (for navigation/priority)
 */
export function getTopCharacteristics(limit: number = 10): CharacteristicInfo[] {
  return Object.values(CHARACTERISTICS)
    .filter(char => char.monthlySearchVolume)
    .sort((a, b) => (b.monthlySearchVolume || 0) - (a.monthlySearchVolume || 0))
    .slice(0, limit);
}

/**
 * Get related characteristics for a given trait
 */
export function getRelatedCharacteristics(slug: string, limit: number = 4): CharacteristicInfo[] {
  const characteristic = CHARACTERISTICS[slug.toLowerCase()];
  if (!characteristic) return [];
  
  return characteristic.relatedCharacteristics
    .map(relSlug => CHARACTERISTICS[relSlug])
    .filter(Boolean)
    .slice(0, limit);
}
