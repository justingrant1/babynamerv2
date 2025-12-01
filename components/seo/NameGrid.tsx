'use client'

import { NameData } from '@/lib/types/database'
import NameCard from './NameCard'
import { useState } from 'react'

interface NameGridProps {
  names: NameData[]
  showOrigin?: boolean
  showMeaning?: boolean
  initialDisplay?: number
  enableLoadMore?: boolean
}

export default function NameGrid({
  names,
  showOrigin = true,
  showMeaning = true,
  initialDisplay = 20,
  enableLoadMore = true,
}: NameGridProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplay)
  
  const displayedNames = names.slice(0, displayCount)
  const hasMore = displayCount < names.length

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 20, names.length))
  }

  if (names.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-600">
          No names found matching these criteria. Try adjusting your filters or explore other categories.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedNames.map((name, index) => (
          <NameCard
            key={`${name.name}-${index}`}
            name={name}
            showOrigin={showOrigin}
            showMeaning={showMeaning}
            priority={index < 6}
          />
        ))}
      </div>

      {enableLoadMore && hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Load More Names ({names.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
