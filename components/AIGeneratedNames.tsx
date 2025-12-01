'use client'

import { NameData } from '@/lib/types/database'
import { useAuth } from '@/lib/contexts/AuthContext'
import { toast } from 'react-hot-toast'

interface AIGeneratedNamesProps {
  names: NameData[]
  onSave: (name: NameData) => void
  savedNames: Set<string>
}

export default function AIGeneratedNames({ names, onSave, savedNames }: AIGeneratedNamesProps) {
  const { user, isPremium } = useAuth()

  const handleSave = (name: NameData) => {
    if (!user) {
      toast.error('Please sign in to save names to your shortlist')
      return
    }
    
    if (!isPremium) {
      toast.error('Upgrade to Premium to save names to your shortlist')
      return
    }
    
    onSave(name)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">AI Generated Names</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {names.map((nameData, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-indigo-600 mb-2 sm:mb-3">{nameData.name}</h3>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Gender:</span>{' '}
                  <span className="capitalize">{nameData.gender}</span>
                </p>
                
                {nameData.origin && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Origin:</span> {nameData.origin}
                  </p>
                )}
                
                {nameData.meaning && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Meaning:</span> {nameData.meaning}
                  </p>
                )}
                
                {nameData.characteristics && nameData.characteristics.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-600">Characteristics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {nameData.characteristics.map((char, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => handleSave(nameData)}
              disabled={savedNames.has(nameData.name)}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                savedNames.has(nameData.name)
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {savedNames.has(nameData.name) ? 'Saved to Shortlist' : 'Save to Shortlist'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
