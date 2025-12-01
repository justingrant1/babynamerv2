import Link from 'next/link'
import { NameData } from '@/lib/types/database'

interface NameCardProps {
  name: NameData
  showOrigin?: boolean
  showMeaning?: boolean
  priority?: boolean
}

export default function NameCard({
  name,
  showOrigin = true,
  showMeaning = true,
  priority = false,
}: NameCardProps) {
  const nameUrl = `/name/${name.name.toLowerCase()}`

  return (
    <Link
      href={nameUrl}
      className="block bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
    >
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
          {name.name}
        </h3>

        {showMeaning && name.meaning && (
          <p className="text-sm sm:text-base text-gray-700">
            <span className="font-semibold">Meaning:</span> {name.meaning}
          </p>
        )}

        {showOrigin && name.origin && (
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold">Origin:</span> {name.origin}
          </p>
        )}

        {name.gender && (
          <div className="pt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                name.gender === 'male'
                  ? 'bg-blue-100 text-blue-800'
                  : name.gender === 'female'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {name.gender === 'male' ? 'Boy' : name.gender === 'female' ? 'Girl' : 'Unisex'}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
