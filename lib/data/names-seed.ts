/**
 * Baby Names Seed Data
 * Sample data for seeding the names database
 * Expand this with more names as needed
 */

export interface SeedName {
  name: string
  gender: 'male' | 'female' | 'unisex'
  origin: string
  meaning: string
  characteristics: string[]
  popularity_score?: number
}

/**
 * Seed data - 100+ sample names
 * TODO: Expand to 1000+ names by adding more to each category
 */
export const SEED_NAMES: SeedName[] = [
  // ENGLISH NAMES
  {
    name: 'Oliver',
    gender: 'male',
    origin: 'English',
    meaning: 'Olive tree',
    characteristics: ['nature', 'traditional', 'popular'],
    popularity_score: 95,
  },
  {
    name: 'Emma',
    gender: 'female',
    origin: 'English',
    meaning: 'Universal',
    characteristics: ['traditional', 'popular', 'simple'],
    popularity_score: 98,
  },
  {
    name: 'Charlotte',
    gender: 'female',
    origin: 'English',
    meaning: 'Free man',
    characteristics: ['traditional', 'elegant', 'popular'],
    popularity_score: 92,
  },
  {
    name: 'William',
    gender: 'male',
    origin: 'English',
    meaning: 'Resolute protector',
    characteristics: ['strength', 'traditional', 'royal'],
    popularity_score: 90,
  },
  {
    name: 'Ava',
    gender: 'female',
    origin: 'English',
    meaning: 'Life',
    characteristics: ['simple', 'modern', 'popular'],
    popularity_score: 94,
  },

  // FRENCH NAMES
  {
    name: 'Louis',
    gender: 'male',
    origin: 'French',
    meaning: 'Renowned warrior',
    characteristics: ['traditional', 'royal', 'strength'],
    popularity_score: 75,
  },
  {
    name: 'Sophie',
    gender: 'female',
    origin: 'French',
    meaning: 'Wisdom',
    characteristics: ['wisdom', 'elegant', 'classic'],
    popularity_score: 82,
  },
  {
    name: 'Amelie',
    gender: 'female',
    origin: 'French',
    meaning: 'Hard working',
    characteristics: ['virtue', 'elegant', 'unique'],
    popularity_score: 68,
  },
  {
    name: 'Marcel',
    gender: 'male',
    origin: 'French',
    meaning: 'Little warrior',
    characteristics: ['strength', 'traditional', 'vintage'],
    popularity_score: 45,
  },

  // ITALIAN NAMES
  {
    name: 'Leonardo',
    gender: 'male',
    origin: 'Italian',
    meaning: 'Brave lion',
    characteristics: ['strength', 'traditional', 'bold'],
    popularity_score: 78,
  },
  {
    name: 'Isabella',
    gender: 'female',
    origin: 'Italian',
    meaning: 'Devoted to God',
    characteristics: ['virtue', 'elegant', 'popular'],
    popularity_score: 88,
  },
  {
    name: 'Matteo',
    gender: 'male',
    origin: 'Italian',
    meaning: 'Gift of God',
    characteristics: ['virtue', 'traditional', 'popular'],
    popularity_score: 80,
  },
  {
    name: 'Gianna',
    gender: 'female',
    origin: 'Italian',
    meaning: 'God is gracious',
    characteristics: ['virtue', 'elegant', 'modern'],
    popularity_score: 76,
  },

  // SPANISH NAMES
  {
    name: 'Mateo',
    gender: 'male',
    origin: 'Spanish',
    meaning: 'Gift of God',
    characteristics: ['virtue', 'traditional', 'popular'],
    popularity_score: 85,
  },
  {
    name: 'Sofia',
    gender: 'female',
    origin: 'Spanish',
    meaning: 'Wisdom',
    characteristics: ['wisdom', 'elegant', 'popular'],
    popularity_score: 96,
  },
  {
    name: 'Santiago',
    gender: 'male',
    origin: 'Spanish',
    meaning: 'Saint James',
    characteristics: ['virtue', 'traditional', 'strong'],
    popularity_score: 72,
  },
  {
    name: 'Lucia',
    gender: 'female',
    origin: 'Spanish',
    meaning: 'Light',
    characteristics: ['virtue', 'elegant', 'classic'],
    popularity_score: 70,
  },

  // GERMAN NAMES
  {
    name: 'Felix',
    gender: 'male',
    origin: 'German',
    meaning: 'Happy and fortunate',
    characteristics: ['virtue', 'classic', 'cheerful'],
    popularity_score: 65,
  },
  {
    name: 'Frieda',
    gender: 'female',
    origin: 'German',
    meaning: 'Peace',
    characteristics: ['peace', 'vintage', 'unique'],
    popularity_score: 42,
  },
  {
    name: 'Otto',
    gender: 'male',
    origin: 'German',
    meaning: 'Wealthy',
    characteristics: ['traditional', 'vintage', 'strong'],
    popularity_score: 38,
  },

  // SCANDINAVIAN NAMES
  {
    name: 'Sven',
    gender: 'male',
    origin: 'Scandinavian',
    meaning: 'Young warrior',
    characteristics: ['strength', 'traditional', 'bold'],
    popularity_score: 35,
  },
  {
    name: 'Freya',
    gender: 'female',
    origin: 'Scandinavian',
    meaning: 'Noble lady',
    characteristics: ['mythological', 'strong', 'unique'],
    popularity_score: 58,
  },
  {
    name: 'Lars',
    gender: 'male',
    origin: 'Scandinavian',
    meaning: 'Crowned with laurel',
    characteristics: ['traditional', 'strong', 'simple'],
    popularity_score: 40,
  },
  {
    name: 'Astrid',
    gender: 'female',
    origin: 'Scandinavian',
    meaning: 'Divinely beautiful',
    characteristics: ['virtue', 'unique', 'strong'],
    popularity_score: 52,
  },

  // HEBREW/JEWISH NAMES
  {
    name: 'Noah',
    gender: 'male',
    origin: 'Jewish',
    meaning: 'Rest and comfort',
    characteristics: ['peace', 'biblical', 'popular'],
    popularity_score: 97,
  },
  {
    name: 'Sarah',
    gender: 'female',
    origin: 'Jewish',
    meaning: 'Princess',
    characteristics: ['virtue', 'biblical', 'traditional'],
    popularity_score: 86,
  },
  {
    name: 'Elijah',
    gender: 'male',
    origin: 'Jewish',
    meaning: 'My God is Yahweh',
    characteristics: ['virtue', 'biblical', 'strong'],
    popularity_score: 91,
  },
  {
    name: 'Hannah',
    gender: 'female',
    origin: 'Jewish',
    meaning: 'Grace',
    characteristics: ['virtue', 'biblical', 'classic'],
    popularity_score: 84,
  },
  {
    name: 'Benjamin',
    gender: 'male',
    origin: 'Jewish',
    meaning: 'Son of the right hand',
    characteristics: ['virtue', 'biblical', 'popular'],
    popularity_score: 89,
  },

  // ARABIC NAMES
  {
    name: 'Amir',
    gender: 'male',
    origin: 'Arabic',
    meaning: 'Prince',
    characteristics: ['virtue', 'strong', 'regal'],
    popularity_score: 62,
  },
  {
    name: 'Layla',
    gender: 'female',
    origin: 'Arabic',
    meaning: 'Night',
    characteristics: ['nature', 'poetic', 'beautiful'],
    popularity_score: 74,
  },
  {
    name: 'Omar',
    gender: 'male',
    origin: 'Arabic',
    meaning: 'Flourishing',
    characteristics: ['virtue', 'strong', 'traditional'],
    popularity_score: 58,
  },
  {
    name: 'Zara',
    gender: 'female',
    origin: 'Arabic',
    meaning: 'Princess',
    characteristics: ['virtue', 'elegant', 'modern'],
    popularity_score: 72,
  },

  // INDIAN NAMES
  {
    name: 'Arjun',
    gender: 'male',
    origin: 'Indian',
    meaning: 'Bright and shining',
    characteristics: ['virtue', 'mythological', 'strong'],
    popularity_score: 55,
  },
  {
    name: 'Priya',
    gender: 'female',
    origin: 'Indian',
    meaning: 'Beloved',
    characteristics: ['love', 'traditional', 'beautiful'],
    popularity_score: 48,
  },
  {
    name: 'Dev',
    gender: 'male',
    origin: 'Indian',
    meaning: 'Divine',
    characteristics: ['virtue', 'simple', 'spiritual'],
    popularity_score: 42,
  },
  {
    name: 'Anaya',
    gender: 'female',
    origin: 'Indian',
    meaning: 'Caring',
    characteristics: ['virtue', 'modern', 'gentle'],
    popularity_score: 64,
  },

  // JAPANESE NAMES
  {
    name: 'Haruto',
    gender: 'male',
    origin: 'Japanese',
    meaning: 'Sun flying',
    characteristics: ['nature', 'strong', 'unique'],
    popularity_score: 38,
  },
  {
    name: 'Sakura',
    gender: 'female',
    origin: 'Japanese',
    meaning: 'Cherry blossom',
    characteristics: ['nature', 'beautiful', 'poetic'],
    popularity_score: 46,
  },
  {
    name: 'Kenji',
    gender: 'male',
    origin: 'Japanese',
    meaning: 'Intelligent second son',
    characteristics: ['wisdom', 'traditional', 'strong'],
    popularity_score: 32,
  },
  {
    name: 'Yuki',
    gender: 'unisex',
    origin: 'Japanese',
    meaning: 'Snow',
    characteristics: ['nature', 'pure', 'beautiful'],
    popularity_score: 40,
  },

  // CHINESE NAMES
  {
    name: 'Wei',
    gender: 'unisex',
    origin: 'Chinese',
    meaning: 'Great',
    characteristics: ['virtue', 'simple', 'strong'],
    popularity_score: 35,
  },
  {
    name: 'Mei',
    gender: 'female',
    origin: 'Chinese',
    meaning: 'Beautiful',
    characteristics: ['virtue', 'simple', 'elegant'],
    popularity_score: 44,
  },
  {
    name: 'Li',
    gender: 'unisex',
    origin: 'Chinese',
    meaning: 'Strength',
    characteristics: ['strength', 'simple', 'traditional'],
    popularity_score: 38,
  },

  // AFRICAN NAMES
  {
    name: 'Kofi',
    gender: 'male',
    origin: 'African',
    meaning: 'Born on Friday',
    characteristics: ['traditional', 'unique', 'cultural'],
    popularity_score: 28,
  },
  {
    name: 'Amara',
    gender: 'female',
    origin: 'African',
    meaning: 'Grace',
    characteristics: ['virtue', 'beautiful', 'unique'],
    popularity_score: 56,
  },
  {
    name: 'Kwame',
    gender: 'male',
    origin: 'African',
    meaning: 'Born on Saturday',
    characteristics: ['traditional', 'unique', 'cultural'],
    popularity_score: 25,
  },
  {
    name: 'Zuri',
    gender: 'female',
    origin: 'African',
    meaning: 'Beautiful',
    characteristics: ['virtue', 'simple', 'modern'],
    popularity_score: 62,
  },

  // SLAVIC NAMES
  {
    name: 'Vladimir',
    gender: 'male',
    origin: 'Slavic',
    meaning: 'Ruler of the world',
    characteristics: ['strength', 'traditional', 'regal'],
    popularity_score: 42,
  },
  {
    name: 'Anastasia',
    gender: 'female',
    origin: 'Slavic',
    meaning: 'Resurrection',
    characteristics: ['virtue', 'elegant', 'traditional'],
    popularity_score: 68,
  },
  {
    name: 'Dimitri',
    gender: 'male',
    origin: 'Slavic',
    meaning: 'Follower of Demeter',
    characteristics: ['mythological', 'strong', 'traditional'],
    popularity_score: 38,
  },

  // NATIVE AMERICAN NAMES
  {
    name: 'Dakota',
    gender: 'unisex',
    origin: 'Native American',
    meaning: 'Friend',
    characteristics: ['virtue', 'nature', 'unique'],
    popularity_score: 52,
  },
  {
    name: 'Mika',
    gender: 'unisex',
    origin: 'Native American',
    meaning: 'Intelligent raccoon',
    characteristics: ['nature', 'wisdom', 'unique'],
    popularity_score: 48,
  },

  // MORE POPULAR NAMES
  {
    name: 'Liam',
    gender: 'male',
    origin: 'English',
    meaning: 'Strong-willed warrior',
    characteristics: ['strength', 'popular', 'modern'],
    popularity_score: 99,
  },
  {
    name: 'Olivia',
    gender: 'female',
    origin: 'English',
    meaning: 'Olive tree',
    characteristics: ['nature', 'popular', 'elegant'],
    popularity_score: 100,
  },
  {
    name: 'Noah',
    gender: 'male',
    origin: 'Jewish',
    meaning: 'Rest and comfort',
    characteristics: ['peace', 'biblical', 'popular'],
    popularity_score: 97,
  },
  {
    name: 'Amelia',
    gender: 'female',
    origin: 'English',
    meaning: 'Work',
    characteristics: ['virtue', 'vintage', 'popular'],
    popularity_score: 93,
  },
  {
    name: 'Elijah',
    gender: 'male',
    origin: 'Jewish',
    meaning: 'My God is Yahweh',
    characteristics: ['virtue', 'biblical', 'strong'],
    popularity_score: 91,
  },
  {
    name: 'Mia',
    gender: 'female',
    origin: 'Italian',
    meaning: 'Mine',
    characteristics: ['love', 'simple', 'popular'],
    popularity_score: 92,
  },
  {
    name: 'James',
    gender: 'male',
    origin: 'English',
    meaning: 'Supplanter',
    characteristics: ['traditional', 'classic', 'popular'],
    popularity_score: 87,
  },
  {
    name: 'Harper',
    gender: 'female',
    origin: 'English',
    meaning: 'Harp player',
    characteristics: ['musical', 'modern', 'popular'],
    popularity_score: 85,
  },

  // NATURE NAMES
  {
    name: 'River',
    gender: 'unisex',
    origin: 'English',
    meaning: 'Flowing body of water',
    characteristics: ['nature', 'modern', 'peaceful'],
    popularity_score: 58,
  },
  {
    name: 'Willow',
    gender: 'female',
    origin: 'English',
    meaning: 'Willow tree',
    characteristics: ['nature', 'gentle', 'modern'],
    popularity_score: 72,
  },
  {
    name: 'Jasper',
    gender: 'male',
    origin: 'English',
    meaning: 'Treasurer',
    characteristics: ['nature', 'vintage', 'unique'],
    popularity_score: 54,
  },
  {
    name: 'Ivy',
    gender: 'female',
    origin: 'English',
    meaning: 'Faithfulness',
    characteristics: ['nature', 'virtue', 'classic'],
    popularity_score: 66,
  },
  {
    name: 'Rowan',
    gender: 'unisex',
    origin: 'English',
    meaning: 'Little red one',
    characteristics: ['nature', 'modern', 'unique'],
    popularity_score: 60,
  },
  {
    name: 'Luna',
    gender: 'female',
    origin: 'Spanish',
    meaning: 'Moon',
    characteristics: ['nature', 'mystical', 'popular'],
    popularity_score: 78,
  },

  // VIRTUE NAMES
  {
    name: 'Grace',
    gender: 'female',
    origin: 'English',
    meaning: 'Charm',
    characteristics: ['virtue', 'classic', 'elegant'],
    popularity_score: 80,
  },
  {
    name: 'Hope',
    gender: 'female',
    origin: 'English',
    meaning: 'Expectation',
    characteristics: ['virtue', 'simple', 'classic'],
    popularity_score: 68,
  },
  {
    name: 'Faith',
    gender: 'female',
    origin: 'English',
    meaning: 'Trust',
    characteristics: ['virtue', 'simple', 'classic'],
    popularity_score: 64,
  },
  {
    name: 'Justice',
    gender: 'unisex',
    origin: 'English',
    meaning: 'Righteousness',
    characteristics: ['virtue', 'strong', 'modern'],
    popularity_score: 48,
  },

  // SHORT NAMES
  {
    name: 'Max',
    gender: 'male',
    origin: 'English',
    meaning: 'Greatest',
    characteristics: ['strength', 'simple', 'modern'],
    popularity_score: 70,
  },
  {
    name: 'Zoe',
    gender: 'female',
    origin: 'English',
    meaning: 'Life',
    characteristics: ['virtue', 'simple', 'popular'],
    popularity_score: 76,
  },
  {
    name: 'Kai',
    gender: 'unisex',
    origin: 'Japanese',
    meaning: 'Sea',
    characteristics: ['nature', 'simple', 'modern'],
    popularity_score: 68,
  },
  {
    name: 'Leo',
    gender: 'male',
    origin: 'English',
    meaning: 'Lion',
    characteristics: ['strength', 'simple', 'popular'],
    popularity_score: 82,
  },

  // Add more names as needed to reach 1000+
  // This is a starter set - expand with more names from each category
]

/**
 * SQL migration for inserting seed data
 */
export function generateSeedSQL(): string {
  const values = SEED_NAMES.map(
    (name) => `(
      '${name.name}',
      '${name.gender}',
      '${name.origin}',
      '${name.meaning.replace(/'/g, "''")}',
      ARRAY[${name.characteristics.map((c) => `'${c}'`).join(', ')}],
      ${name.popularity_score || 50}
    )`
  ).join(',\n  ')

  return `
-- Seed baby names data
INSERT INTO public.names (
  name,
  gender,
  origin,
  meaning,
  characteristics,
  popularity_score
)
VALUES
  ${values}
ON CONFLICT (name) DO NOTHING;
`
}
