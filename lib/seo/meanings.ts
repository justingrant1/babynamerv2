/**
 * Meaning-based SEO constants for programmatic page generation
 * Phase 1 of PSEO Strategy
 */

export interface MeaningInfo {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  relatedMeanings: string[];
}

/**
 * Primary meanings targeting high-value keywords
 * Based on DataForSEO research showing strong search volume with low competition
 */
export const MEANINGS: Record<string, MeaningInfo> = {
  love: {
    slug: 'love',
    title: 'Names Meaning Love',
    description: 'Discover beautiful baby names that mean love, affection, and devotion. Perfect for parents looking for names that embody warmth and tenderness.',
    keywords: ['names meaning love', 'baby names that mean love', 'names that mean love', 'love names'],
    relatedMeanings: ['joy', 'grace', 'peace', 'beautiful']
  },
  strong: {
    slug: 'strong',
    title: 'Names Meaning Strong',
    description: 'Find powerful baby names that mean strong, strength, and mighty. Ideal for parents seeking names that convey courage and resilience.',
    keywords: ['names meaning strong', 'strong baby names', 'names that mean strength', 'powerful names'],
    relatedMeanings: ['brave', 'warrior', 'noble', 'protector']
  },
  strength: {
    slug: 'strength',
    title: 'Names Meaning Strength',
    description: 'Find powerful baby names that mean strength, strong, and mighty. Ideal for parents seeking names that convey courage and resilience.',
    keywords: ['names meaning strength', 'strength baby names', 'names that mean strong', 'powerful names'],
    relatedMeanings: ['brave', 'warrior', 'noble', 'protector']
  },
  brave: {
    slug: 'brave',
    title: 'Names Meaning Brave',
    description: 'Explore courageous baby names that mean brave, fearless, and bold. Perfect for parents wanting names that inspire bravery.',
    keywords: ['names meaning brave', 'brave baby names', 'names that mean courage', 'fearless names'],
    relatedMeanings: ['strong', 'warrior', 'hero', 'noble']
  },
  beautiful: {
    slug: 'beautiful',
    title: 'Names Meaning Beautiful',
    description: 'Beautiful baby names that mean beauty, lovely, and gorgeous. For parents seeking names that celebrate aesthetic perfection.',
    keywords: ['names meaning beautiful', 'beautiful baby names', 'names that mean beauty', 'pretty names'],
    relatedMeanings: ['grace', 'love', 'joy', 'light']
  },
  joy: {
    slug: 'joy',
    title: 'Names Meaning Joy',
    description: 'Joyful baby names that mean happiness, delight, and bliss. Perfect for parents wanting names that radiate positivity.',
    keywords: ['names meaning joy', 'joyful baby names', 'names that mean happiness', 'happy names'],
    relatedMeanings: ['love', 'hope', 'grace', 'peace']
  },
  peace: {
    slug: 'peace',
    title: 'Names Meaning Peace',
    description: 'Peaceful baby names that mean tranquility, serenity, and calm. Ideal for parents seeking harmonious names.',
    keywords: ['names meaning peace', 'peaceful baby names', 'names that mean calm', 'serene names'],
    relatedMeanings: ['joy', 'grace', 'hope', 'light']
  },
  hope: {
    slug: 'hope',
    title: 'Names Meaning Hope',
    description: 'Hopeful baby names that mean aspiration, optimism, and promise. Perfect for parents wanting inspirational names.',
    keywords: ['names meaning hope', 'hopeful baby names', 'names that mean promise', 'optimistic names'],
    relatedMeanings: ['joy', 'peace', 'light', 'grace']
  },
  grace: {
    slug: 'grace',
    title: 'Names Meaning Grace',
    description: 'Graceful baby names that mean elegance, charm, and beauty. For parents seeking refined and sophisticated names.',
    keywords: ['names meaning grace', 'graceful baby names', 'names that mean elegance', 'elegant names'],
    relatedMeanings: ['beautiful', 'love', 'peace', 'light']
  },
  wisdom: {
    slug: 'wisdom',
    title: 'Names Meaning Wisdom',
    description: 'Wise baby names that mean knowledge, intelligence, and insight. Perfect for parents valuing intellectual qualities.',
    keywords: ['names meaning wisdom', 'wise baby names', 'names that mean knowledge', 'intelligent names'],
    relatedMeanings: ['noble', 'light', 'sage', 'truth']
  },
  warrior: {
    slug: 'warrior',
    title: 'Names Meaning Warrior',
    description: 'Warrior baby names that mean fighter, soldier, and champion. Ideal for parents seeking strong, battle-inspired names.',
    keywords: ['names meaning warrior', 'warrior baby names', 'names that mean fighter', 'soldier names'],
    relatedMeanings: ['strong', 'brave', 'protector', 'hero']
  },
  noble: {
    slug: 'noble',
    title: 'Names Meaning Noble',
    description: 'Noble baby names that mean aristocratic, royal, and distinguished. Perfect for parents wanting regal names.',
    keywords: ['names meaning noble', 'noble baby names', 'names that mean royal', 'aristocratic names'],
    relatedMeanings: ['strong', 'wisdom', 'protector', 'king']
  },
  light: {
    slug: 'light',
    title: 'Names Meaning Light',
    description: 'Luminous baby names that mean light, bright, and radiant. Ideal for parents seeking illuminating names.',
    keywords: ['names meaning light', 'bright baby names', 'names that mean radiant', 'luminous names'],
    relatedMeanings: ['hope', 'grace', 'star', 'sun']
  },
  protector: {
    slug: 'protector',
    title: 'Names Meaning Protector',
    description: 'Protective baby names that mean guardian, defender, and shield. Perfect for parents wanting safeguarding names.',
    keywords: ['names meaning protector', 'guardian baby names', 'names that mean defender', 'protective names'],
    relatedMeanings: ['strong', 'warrior', 'noble', 'brave']
  },
  nature: {
    slug: 'nature',
    title: 'Names Meaning Nature',
    description: 'Nature-inspired baby names that mean earth, forest, and natural. Ideal for parents loving the outdoors.',
    keywords: ['names meaning nature', 'nature baby names', 'earthy names', 'natural names'],
    relatedMeanings: ['earth', 'water', 'fire', 'sky']
  },
  fire: {
    slug: 'fire',
    title: 'Names Meaning Fire',
    description: 'Fiery baby names that mean flame, blaze, and passionate. Perfect for parents seeking energetic names.',
    keywords: ['names meaning fire', 'fire baby names', 'names that mean flame', 'fiery names'],
    relatedMeanings: ['light', 'strong', 'brave', 'sun']
  },
  water: {
    slug: 'water',
    title: 'Names Meaning Water',
    description: 'Aquatic baby names that mean ocean, river, and sea. Ideal for parents drawn to water-inspired names.',
    keywords: ['names meaning water', 'water baby names', 'ocean names', 'sea names'],
    relatedMeanings: ['nature', 'peace', 'moon', 'sky']
  },
  earth: {
    slug: 'earth',
    title: 'Names Meaning Earth',
    description: 'Earthy baby names that mean ground, soil, and terra. Perfect for parents wanting grounded names.',
    keywords: ['names meaning earth', 'earthy baby names', 'names that mean ground', 'terra names'],
    relatedMeanings: ['nature', 'strong', 'mountain', 'stone']
  },
  star: {
    slug: 'star',
    title: 'Names Meaning Star',
    description: 'Stellar baby names that mean star, celestial, and cosmic. Ideal for parents loving astronomical names.',
    keywords: ['names meaning star', 'star baby names', 'celestial names', 'stellar names'],
    relatedMeanings: ['light', 'moon', 'sun', 'sky']
  },
  moon: {
    slug: 'moon',
    title: 'Names Meaning Moon',
    description: 'Lunar baby names that mean moon, lunar, and night. Perfect for parents enchanted by the moon.',
    keywords: ['names meaning moon', 'moon baby names', 'lunar names', 'night names'],
    relatedMeanings: ['star', 'light', 'water', 'sky']
  },
  sun: {
    slug: 'sun',
    title: 'Names Meaning Sun',
    description: 'Solar baby names that mean sun, sunshine, and daylight. Ideal for parents seeking bright, cheerful names.',
    keywords: ['names meaning sun', 'sun baby names', 'solar names', 'sunshine names'],
    relatedMeanings: ['light', 'fire', 'star', 'sky']
  },
  king: {
    slug: 'king',
    title: 'Names Meaning King',
    description: 'Royal baby names that mean king, ruler, and sovereign. Perfect for parents wanting majestic names.',
    keywords: ['names meaning king', 'king baby names', 'royal names', 'ruler names'],
    relatedMeanings: ['noble', 'strong', 'protector', 'warrior']
  },
  queen: {
    slug: 'queen',
    title: 'Names Meaning Queen',
    description: 'Regal baby names that mean queen, empress, and sovereign. Ideal for parents seeking majestic girl names.',
    keywords: ['names meaning queen', 'queen baby names', 'royal names', 'empress names'],
    relatedMeanings: ['noble', 'beautiful', 'grace', 'strong']
  },
  gift: {
    slug: 'gift',
    title: 'Names Meaning Gift',
    description: 'Precious baby names that mean gift, blessing, and treasure. Perfect for parents celebrating their blessing.',
    keywords: ['names meaning gift', 'gift baby names', 'names that mean blessing', 'treasure names'],
    relatedMeanings: ['love', 'joy', 'grace', 'miracle']
  },
  miracle: {
    slug: 'miracle',
    title: 'Names Meaning Miracle',
    description: 'Miraculous baby names that mean wonder, marvel, and divine gift. Ideal for parents celebrating miracles.',
    keywords: ['names meaning miracle', 'miracle baby names', 'names that mean wonder', 'divine names'],
    relatedMeanings: ['gift', 'hope', 'grace', 'light']
  },
  victor: {
    slug: 'victor',
    title: 'Names Meaning Victor',
    description: 'Victorious baby names that mean victory, winner, and triumphant. Perfect for parents wanting champion names.',
    keywords: ['names meaning victor', 'victory baby names', 'winner names', 'triumphant names'],
    relatedMeanings: ['strong', 'warrior', 'brave', 'noble']
  },
  hero: {
    slug: 'hero',
    title: 'Names Meaning Hero',
    description: 'Heroic baby names that mean champion, savior, and valiant. Ideal for parents seeking legendary names.',
    keywords: ['names meaning hero', 'hero baby names', 'champion names', 'valiant names'],
    relatedMeanings: ['brave', 'warrior', 'strong', 'protector']
  }
};

/**
 * Get all meaning slugs for sitemap generation
 */
export function getAllMeaningSlugs(): string[] {
  return Object.keys(MEANINGS);
}

/**
 * Get meaning info by slug
 */
export function getMeaningInfo(slug: string): MeaningInfo | undefined {
  return MEANINGS[slug.toLowerCase()];
}

/**
 * Get popular meanings (top 10 for homepage/navigation)
 */
export function getPopularMeanings(): MeaningInfo[] {
  const popular = ['love', 'strong', 'brave', 'beautiful', 'joy', 'peace', 'hope', 'grace', 'wisdom', 'warrior'];
  return popular.map(slug => MEANINGS[slug]).filter(Boolean);
}
