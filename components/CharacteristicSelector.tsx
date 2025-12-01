'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CharacteristicSelectorProps {
  onSubmit: (characteristics: string[], gender: string, specificOptions: any) => void
  isLoading: boolean
}

const CHARACTERISTICS = [
  'Origin',
  'Meaning',
  'Uniqueness',
  'Length',
  'Popularity',
  'Cultural Significance',
  'Sound',
  'Spelling',
  'Family Tradition',
  'Religious Significance',
  'Nickname Potential',
  'Starts with the letter',
]

const origins = [
  'English',
  'Jewish',
  'Spanish',
  'French',
  'Italian',
  'German',
  'Scandinavian',
  'Arabic',
  'Indian',
  'Chinese',
  'Japanese',
  'African',
  'Native American',
  'Slavic',
]

const uniquenessOptions = [
  { value: 'very-unique', label: 'Very Unique (Rare, <1% usage)' },
  { value: 'moderately-unique', label: 'Moderately Unique (Uncommon, 1-5% usage)' },
  { value: 'somewhat-unique', label: 'Somewhat Unique (Less common, 5-10% usage)' },
]

const popularityOptions = [
  { value: 'very-popular', label: 'Very Popular (Top 10 names)' },
  { value: 'moderately-popular', label: 'Moderately Popular (Top 100 names)' },
  { value: 'less-popular', label: 'Less Popular (Top 500 names)' },
  { value: 'rare', label: 'Rare (Outside top 500)' },
]

const soundOptions = [
  { value: 'soft', label: 'Soft (melodic, gentle sounds)' },
  { value: 'strong', label: 'Strong (bold, sharp sounds)' },
  { value: 'musical', label: 'Musical (rhythmic or lyrical sounds)' },
  { value: 'traditional', label: 'Traditional (classic, familiar sounds)' },
]

const meaningOptions = [
  { value: 'nature', label: 'Nature (e.g., River, Willow)' },
  { value: 'strength', label: 'Strength (e.g., Ethan, Valiant)' },
  { value: 'wisdom', label: 'Wisdom (e.g., Sophia, Solomon)' },
  { value: 'peace', label: 'Peace (e.g., Irene, Shalom)' },
  { value: 'love', label: 'Love (e.g., Amara, Carys)' },
  { value: 'virtue', label: 'Virtue (e.g., Hope, Faith)' },
]

const lengthOptions = [
  { value: 'short', label: 'Short (1-4 letters or 1-2 syllables)' },
  { value: 'medium', label: 'Medium (5-7 letters or 2-3 syllables)' },
  { value: 'long', label: 'Long (8+ letters or 3+ syllables)' },
]

const culturalSignificanceOptions = [
  { value: 'historical', label: 'Historical (famous figures)' },
  { value: 'mythological', label: 'Mythological (e.g., Apollo, Freya)' },
  { value: 'festive', label: 'Festive/Seasonal (e.g., Noel)' },
  { value: 'traditional', label: 'Traditional (culturally iconic names)' },
]

const spellingOptions = [
  { value: 'simple', label: 'Simple (easy to spell)' },
  { value: 'unique', label: 'Unique (unconventional spellings)' },
  { value: 'traditional', label: 'Traditional (standard spellings)' },
]

const familyTraditionOptions = [
  { value: 'honorific', label: 'Honorific (honoring ancestors)' },
  { value: 'initial', label: 'Initial-Based (matching letters)' },
  { value: 'style', label: 'Style Match (similar sounds/styles)' },
]

const religions = [
  { value: 'christian', label: 'Christian (e.g., Matthew, Mary)' },
  { value: 'jewish', label: 'Jewish (e.g., David, Sarah)' },
  { value: 'islamic', label: 'Islamic (e.g., Aisha, Mohammad)' },
  { value: 'hindu', label: 'Hindu (e.g., Krishna, Lakshmi)' },
  { value: 'buddhist', label: 'Buddhist (e.g., Buddha, Ananda)' },
]

const nicknamePotentialOptions = [
  { value: 'shortened', label: 'Shortened (e.g., William to Will)' },
  { value: 'diminutive', label: 'Diminutive (e.g., Margaret to Maggie)' },
  { value: 'playful', label: 'Playful (e.g., Theodore to Teddy)' },
  { value: 'none', label: 'None (names without common nicknames)' },
]

export default function CharacteristicSelector({ onSubmit, isLoading }: CharacteristicSelectorProps) {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([])
  const [gender, setGender] = useState<string>('')
  const [characteristicValues, setCharacteristicValues] = useState<Record<string, string>>({})

  const toggleCharacteristic = (char: string) => {
    if (selectedCharacteristics.includes(char)) {
      setSelectedCharacteristics(prev => prev.filter((c) => c !== char))
      // Remove the value when unchecking
      const newValues = { ...characteristicValues }
      delete newValues[char]
      setCharacteristicValues(newValues)
    } else if (selectedCharacteristics.length < 5) {
      setSelectedCharacteristics(prev => [...prev, char])
    }
  }

  const handleCharacteristicValueChange = (characteristic: string, value: string) => {
    setCharacteristicValues(prev => ({
      ...prev,
      [characteristic]: value
    }))
  }

  const getOptionsForCharacteristic = (char: string) => {
    switch (char) {
      case 'Origin':
        return origins
      case 'Meaning':
        return meaningOptions
      case 'Uniqueness':
        return uniquenessOptions
      case 'Popularity':
        return popularityOptions
      case 'Sound':
        return soundOptions
      case 'Length':
        return lengthOptions
      case 'Cultural Significance':
        return culturalSignificanceOptions
      case 'Spelling':
        return spellingOptions
      case 'Family Tradition':
        return familyTraditionOptions
      case 'Religious Significance':
        return religions
      case 'Nickname Potential':
        return nicknamePotentialOptions
      default:
        return []
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gender || selectedCharacteristics.length === 0) return
    onSubmit(selectedCharacteristics, gender, characteristicValues)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Gender Selection */}
        <div>
          <label className="block text-base sm:text-lg font-semibold mb-2 sm:mb-3">
            Select Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 text-sm sm:text-base"
          >
            <option value="">Choose gender</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="unisex">Unisex</option>
            <option value="any">Any</option>
          </select>
        </div>

        {/* Characteristics */}
        <div>
          <label className="block text-base sm:text-lg font-semibold mb-2 sm:mb-3">
            Select up to 5 additional characteristics:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4">
            {CHARACTERISTICS.map((char) => (
              <div key={char}>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCharacteristics.includes(char)}
                    onChange={() => toggleCharacteristic(char)}
                    disabled={selectedCharacteristics.length >= 5 && !selectedCharacteristics.includes(char)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base text-gray-700">{char}</span>
                </label>
                
                {/* Show dropdown if this characteristic is selected */}
                {selectedCharacteristics.includes(char) && (
                  <div className="ml-6 sm:ml-8 mt-2">
                    {char === 'Starts with the letter' ? (
                      <input
                        type="text"
                        value={characteristicValues[char] || ''}
                        onChange={(e) => handleCharacteristicValueChange(char, e.target.value.toUpperCase())}
                        placeholder="Enter letter"
                        maxLength={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    ) : char === 'Origin' ? (
                      <select
                        value={characteristicValues[char] || ''}
                        onChange={(e) => handleCharacteristicValueChange(char, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 text-sm sm:text-base"
                      >
                        <option value="">Select origin</option>
                        {(getOptionsForCharacteristic(char) as string[]).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={characteristicValues[char] || ''}
                        onChange={(e) => handleCharacteristicValueChange(char, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 text-sm sm:text-base"
                      >
                        <option value="">Select {char.toLowerCase()} category</option>
                        {(getOptionsForCharacteristic(char) as Array<{ value: string; label: string }>).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
            {selectedCharacteristics.length}/5 characteristics selected
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !gender || selectedCharacteristics.length === 0}
            className="w-full sm:w-auto bg-indigo-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Generating Names...
              </>
            ) : (
              'Generate Names'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
