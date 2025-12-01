import Link from 'next/link'
import {
  ORIGINS,
  MEANINGS,
  LETTERS,
  GENDERS,
  ORIGIN_LABELS,
  MEANING_LABELS,
  GENDER_LABELS,
} from '@/lib/seo/constants'

interface InternalLinksProps {
  currentPage?: {
    type: 'origin' | 'meaning' | 'letter' | 'gender'
    value: string
  }
  showOrigins?: boolean
  showMeanings?: boolean
  showLetters?: boolean
  showGenders?: boolean
  limit?: number
}

export default function InternalLinks({
  currentPage,
  showOrigins = true,
  showMeanings = true,
  showLetters = false,
  showGenders = true,
  limit = 8,
}: InternalLinksProps) {
  const isCurrentPage = (type: string, value: string) => {
    return currentPage?.type === type && currentPage?.value === value
  }

  return (
    <div className="mt-16 space-y-12">
      {/* Browse by Origin */}
      {showOrigins && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Browse by Origin
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ORIGINS.slice(0, limit).map((origin) => (
              <Link
                key={origin}
                href={`/names/origin/${origin}`}
                className={`block px-4 py-3 rounded-lg border text-center transition-all ${
                  isCurrentPage('origin', origin)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:shadow-md'
                }`}
              >
                {ORIGIN_LABELS[origin]}
              </Link>
            ))}
          </div>
          {ORIGINS.length > limit && (
            <div className="mt-4 text-center">
              <Link
                href="/names"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All Origins →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Browse by Meaning */}
      {showMeanings && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Browse by Meaning
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MEANINGS.map((meaning) => (
              <Link
                key={meaning}
                href={`/names/meaning/${meaning}`}
                className={`block px-4 py-3 rounded-lg border text-center transition-all ${
                  isCurrentPage('meaning', meaning)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:shadow-md'
                }`}
              >
                {MEANING_LABELS[meaning]}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Browse by Gender */}
      {showGenders && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Browse by Gender
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GENDERS.filter((g) => g !== 'any').map((gender) => (
              <Link
                key={gender}
                href={`/names/${gender}`}
                className={`block px-4 py-3 rounded-lg border text-center transition-all ${
                  isCurrentPage('gender', gender)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:shadow-md'
                }`}
              >
                {GENDER_LABELS[gender]} Names
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Browse by Letter */}
      {showLetters && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Browse by First Letter
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-2">
            {LETTERS.map((letter) => (
              <Link
                key={letter}
                href={`/names/starting-with/${letter}`}
                className={`block px-3 py-2 rounded-lg border text-center font-semibold uppercase transition-all ${
                  isCurrentPage('letter', letter)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:shadow-md'
                }`}
              >
                {letter.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
