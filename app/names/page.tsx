import { Metadata } from 'next'
import Link from 'next/link'
import {
  ORIGINS,
  MEANINGS,
  LETTERS,
  POPULARITY_LEVELS,
  RELIGIONS,
  GENDERS,
  ORIGIN_LABELS,
  MEANING_LABELS,
  POPULARITY_LABELS,
  RELIGION_LABELS,
  GENDER_LABELS,
} from '@/lib/seo/constants'
import { generateNamesDirectoryMetadata } from '@/lib/seo/metadata'
import SEOPageLayout from '@/components/seo/SEOPageLayout'
import { generateCompleteStructuredData } from '@/lib/seo/structured-data'

export const metadata: Metadata = generateNamesDirectoryMetadata()

export default function NamesDirectoryPage() {
  const structuredData = generateCompleteStructuredData({
    breadcrumbs: [
      { name: 'Names', url: '/names' },
    ],
    webPage: {
      title: 'Browse Baby Names by Category',
      description: 'Explore thousands of baby names organized by origin, meaning, popularity, and more.',
      url: '/names',
    },
    collectionPage: {
      title: 'Baby Names Directory',
      description: 'Complete directory of baby names organized by various characteristics',
      url: '/names',
    },
  })

  return (
    <SEOPageLayout
      title="Browse Baby Names by Category"
      description="Explore thousands of baby names organized by origin, meaning, popularity, and more. Find the perfect name for your baby."
      breadcrumbs={[{ name: 'Names', url: '/names' }]}
      structuredData={structuredData}
      showCTA={true}
    >
      <div className="space-y-12">
        {/* Browse by Origin */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by Origin
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ORIGINS.map((origin) => (
              <Link
                key={origin}
                href={`/names/origin/${origin}`}
                className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
              >
                {ORIGIN_LABELS[origin]}
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Meaning */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by Meaning
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MEANINGS.map((meaning) => (
              <Link
                key={meaning}
                href={`/names/meaning/${meaning}`}
                className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
              >
                {MEANING_LABELS[meaning]}
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Gender */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by Gender
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENDERS.filter((g) => g !== 'any').map((gender) => (
              <Link
                key={gender}
                href={`/names/${gender}`}
                className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
              >
                {GENDER_LABELS[gender]} Names
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by First Letter */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by First Letter
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-3">
            {LETTERS.map((letter) => (
              <Link
                key={letter}
                href={`/names/starting-with/${letter}`}
                className="block bg-white px-3 py-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-bold uppercase"
              >
                {letter.toUpperCase()}
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Popularity */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by Popularity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {POPULARITY_LEVELS.map((level) => (
              <Link
                key={level}
                href={`/names/popularity/${level}`}
                className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
              >
                {POPULARITY_LABELS[level]}
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Religion */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Browse by Religious Tradition
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {RELIGIONS.map((religion) => (
              <Link
                key={religion}
                href={`/names/religion/${religion}`}
                className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
              >
                {RELIGION_LABELS[religion]}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Names */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Trending Names
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link
              href="/names/trending/2024"
              className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
            >
              Trending 2024
            </Link>
            <Link
              href="/names/trending/2025"
              className="block bg-white px-4 py-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium"
            >
              Trending 2025
            </Link>
          </div>
        </section>
      </div>
    </SEOPageLayout>
  )
}
