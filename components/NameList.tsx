'use client'

import { NameData } from '@/lib/types/database'
import { X } from 'lucide-react'

interface NameListProps {
  names: NameData[]
  onRemove?: (name: NameData) => void
  showRemove?: boolean
}

export default function NameList({ names, onRemove, showRemove = true }: NameListProps) {
  if (names.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No names yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-3">
        {names.map((nameData, index) => (
          <div
            key={index}
            className="flex justify-between items-start p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-indigo-600">{nameData.name}</h3>
              <div className="text-sm text-gray-600 mt-1">
                <span className="capitalize">{nameData.gender}</span>
                {nameData.origin && <span> • {nameData.origin}</span>}
              </div>
              {nameData.meaning && (
                <p className="text-sm text-gray-500 mt-1">{nameData.meaning}</p>
              )}
            </div>
            {showRemove && onRemove && (
              <button
                onClick={() => onRemove(nameData)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Remove from list"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
