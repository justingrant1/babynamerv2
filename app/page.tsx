'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import CharacteristicSelector from '@/components/CharacteristicSelector'
import AIGeneratedNames from '@/components/AIGeneratedNames'
import NameList from '@/components/NameList'
import AdPlaceholder from '@/components/AdPlaceholder'
import { NameData } from '@/lib/types/database'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/lib/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const { user, isPremium, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedNames, setSuggestedNames] = useState<NameData[]>([])
  const [shortlist, setShortlist] = useState<NameData[]>([])
  const [trendingNames, setTrendingNames] = useState<NameData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isShortlistLoading, setIsShortlistLoading] = useState(true)
  const [generatedNames, setGeneratedNames] = useState<Set<string>>(new Set())
  const supabase = createClient()

  // Load shortlist and trending names
  useEffect(() => {
    async function loadData() {
      if (authLoading) return

      setIsShortlistLoading(true)

      try {
        // Load trending names (top 10 by popularity score)
        const { data: trending } = await supabase
          .from('names')
          .select('*')
          .order('popularity_score', { ascending: false })
          .limit(10)

        if (trending) {
          setTrendingNames(trending as NameData[])
        }

        // Load shortlist if user is premium
        if (user && isPremium) {
          const { data: shortlistData } = await supabase
            .from('shortlist')
            .select(`
              id,
              notes,
              names (
                name,
                gender,
                origin,
                meaning,
                characteristics
              )
            `)
            .eq('user_id', user.id)

          if (shortlistData) {
            const names = shortlistData
              .map((item: any) => item.names)
              .filter(Boolean) as NameData[]
            setShortlist(names)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsShortlistLoading(false)
      }
    }

    loadData()
  }, [user, isPremium, authLoading])

  const handleSaveToShortlist = async (name: NameData) => {
    if (!user || !isPremium) {
      toast.error('Upgrade to Premium to save names to your shortlist')
      return
    }

    try {
      // Check if name exists in database
      let { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      // If name doesn't exist, create it
      if (!nameRecord) {
        const { data: newName, error: insertError } = await supabase
          .from('names')
          .insert({
            name: name.name,
            gender: name.gender,
            origin: name.origin,
            meaning: name.meaning,
            characteristics: name.characteristics,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error('Error creating name:', insertError)
          toast.error('Failed to save name')
          return
        }

        nameRecord = newName
      }

      // Add to shortlist
      const { error } = await supabase.from('shortlist').insert({
        user_id: user.id,
        name_id: nameRecord.id,
      })

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          toast.error('Name already in your shortlist')
        } else {
          throw error
        }
        return
      }

      setShortlist([...shortlist, name])
      toast.success(`${name.name} added to shortlist!`)
    } catch (error: any) {
      console.error('Error saving to shortlist:', error)
      toast.error('Failed to save to shortlist')
    }
  }

  const handleRemoveFromShortlist = async (name: NameData) => {
    if (!user) return

    try {
      // Get the name ID
      const { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      if (!nameRecord) return

      // Remove from shortlist
      await supabase
        .from('shortlist')
        .delete()
        .eq('user_id', user.id)
        .eq('name_id', nameRecord.id)

      setShortlist(shortlist.filter((item) => item.name !== name.name))
      toast.success(`${name.name} removed from shortlist`)
    } catch (error) {
      console.error('Error removing from shortlist:', error)
      toast.error('Failed to remove from shortlist')
    }
  }

  const handleSubmit = async (characteristics: string[], gender: string, specificOptions: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characteristics,
          gender,
          specificOptions,
          generatedNames: Array.from(generatedNames),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate names')
      }

      setSuggestedNames(data.names)
      setGeneratedNames(new Set([...generatedNames, ...data.names.map((name: NameData) => name.name)]))
    } catch (err: any) {
      console.error('Error generating names:', err)
      setError(err.message || 'Failed to generate names')
      toast.error(err.message || 'Failed to generate names')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">Find Your Perfect Baby Name</h1>
            <p className="text-base sm:text-xl text-gray-700">Discover beautiful names that match your preferences</p>
          </div>
          
          <CharacteristicSelector onSubmit={handleSubmit} isLoading={isLoading} />
          
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          
          {suggestedNames.length > 0 && (
            <div className="mt-12">
              <AIGeneratedNames
                names={suggestedNames}
                onSave={handleSaveToShortlist}
                savedNames={new Set(shortlist.map((name) => name.name))}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Your Shortlist</h2>
              {!user ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    Sign in and upgrade to Premium to save names to your shortlist
                  </p>
                </div>
              ) : !isPremium ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    Upgrade to Premium to access the shortlist feature
                  </p>
                </div>
              ) : isShortlistLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : shortlist.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {shortlist.map((name, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{name.name}</h3>
                        <button
                          onClick={() => handleRemoveFromShortlist(name)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-2xl sm:text-3xl px-2"
                        >
                          ×
                        </button>
                      </div>
                      {name.meaning && (
                        <p className="text-sm sm:text-base text-gray-700 mb-2">
                          <span className="font-semibold">Meaning:</span> {name.meaning}
                        </p>
                      )}
                      {name.origin && (
                        <p className="text-sm sm:text-base text-gray-700">
                          <span className="font-semibold">Origin:</span> {name.origin}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600">Save names to your shortlist to see them here.</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Trending Names</h2>
              {trendingNames.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {trendingNames.map((name, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">{name.name}</h3>
                      {name.meaning && (
                        <p className="text-sm sm:text-base text-gray-700 mb-2">
                          <span className="font-semibold">Meaning:</span> {name.meaning}
                        </p>
                      )}
                      {name.origin && (
                        <p className="text-sm sm:text-base text-gray-700">
                          <span className="font-semibold">Origin:</span> {name.origin}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg h-64"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
