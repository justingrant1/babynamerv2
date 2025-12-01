'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { NameData } from '@/lib/types/database'
import Navbar from '@/components/Navbar'
import { Loader2, Search, Download, Share2, Plus, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ShortlistItem extends NameData {
  rating?: number
}

export default function ShortlistPage() {
  const { user, isPremium, loading: authLoading } = useAuth()
  const router = useRouter()
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('name')
  const [showListModal, setShowListModal] = useState(false)
  const [userLists, setUserLists] = useState<any[]>([])
  const [newListName, setNewListName] = useState('')
  const [creatingList, setCreatingList] = useState(false)
  const [addingToList, setAddingToList] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    if (!user || !isPremium) {
      setLoading(false)
      router.push('/pricing')
      return
    }

    loadShortlist()
  }, [user, isPremium, authLoading])

  const loadShortlist = async () => {
    if (!user) return

    try {
      const { data: shortlistData, error } = await supabase
        .from('shortlist')
        .select(`
          id,
          notes,
          rating,
          names (
            name,
            gender,
            origin,
            meaning,
            characteristics
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Supabase error loading shortlist:', error)
        toast.error(`Error: ${error.message}`)
        return
      }

      console.log('Loaded shortlist data:', shortlistData)

      if (shortlistData) {
        const names = shortlistData
          .map((item: any) => {
            console.log('Processing item:', item)
            return {
              ...item.names,
              rating: item.rating || 0
            }
          })
          .filter(Boolean) as ShortlistItem[]
        
        console.log('Processed names:', names)
        setShortlist(names)
      }
    } catch (error) {
      console.error('Error loading shortlist:', error)
      toast.error('Failed to load shortlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (name: ShortlistItem) => {
    if (!user) return

    try {
      const { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      if (!nameRecord) return

      await supabase
        .from('shortlist')
        .delete()
        .eq('user_id', user.id)
        .eq('name_id', nameRecord.id)

      setShortlist(shortlist.filter((item) => item.name !== name.name))
      setSelectedNames(prev => {
        const newSet = new Set(prev)
        newSet.delete(name.name)
        return newSet
      })
      toast.success(`${name.name} removed from shortlist`)
    } catch (error) {
      console.error('Error removing from shortlist:', error)
      toast.error('Failed to remove from shortlist')
    }
  }

  const handleRating = async (name: ShortlistItem, rating: number) => {
    if (!user) return

    try {
      const { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      if (!nameRecord) return

      await supabase
        .from('shortlist')
        .update({ rating })
        .eq('user_id', user.id)
        .eq('name_id', nameRecord.id)

      setShortlist(shortlist.map(item => 
        item.name === name.name ? { ...item, rating } : item
      ))
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error('Failed to update rating')
    }
  }

  const toggleSelectAll = () => {
    if (selectedNames.size === filteredNames.length) {
      setSelectedNames(new Set())
    } else {
      setSelectedNames(new Set(filteredNames.map(n => n.name)))
    }
  }

  const toggleSelect = (name: string) => {
    const newSet = new Set(selectedNames)
    if (newSet.has(name)) {
      newSet.delete(name)
    } else {
      newSet.add(name)
    }
    setSelectedNames(newSet)
  }

  const handleExport = () => {
    const data = selectedNames.size > 0 
      ? shortlist.filter(n => selectedNames.has(n.name))
      : shortlist

    const csv = [
      ['Name', 'Gender', 'Origin', 'Meaning', 'Characteristics', 'Rating'].join(','),
      ...data.map(n => [
        n.name,
        n.gender,
        n.origin || '',
        n.meaning || '',
        (n.characteristics || []).join('; '),
        n.rating || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'baby-names-shortlist.csv'
    a.click()
    toast.success('Shortlist exported!')
  }

  const handleShare = () => {
    toast('Share functionality coming soon!')
  }

  const handleAddToList = async () => {
    if (selectedNames.size === 0) {
      toast.error('Please select names to add to a list')
      return
    }

    // Load user's lists
    try {
      const { data: lists, error } = await supabase
        .from('lists')
        .select('id, name, description')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserLists(lists || [])
      setShowListModal(true)
    } catch (error) {
      console.error('Error loading lists:', error)
      toast.error('Failed to load lists')
    }
  }

  const handleCreateNewList = async () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    setCreatingList(true)
    try {
      // Create new list
      const { data: newList, error: listError } = await supabase
        .from('lists')
        .insert({
          owner_id: user!.id,
          name: newListName,
          description: null,
          is_public: false,
        })
        .select()
        .single()

      if (listError) throw listError

      // Add owner as member
      await supabase.from('list_members').insert({
        list_id: newList.id,
        user_id: user!.id,
        role: 'owner',
      })

      // Add selected names to the new list
      await addNamesToList(newList.id)
      
      setNewListName('')
      toast.success('List created and names added!')
      setShowListModal(false)
      setSelectedNames(new Set())
    } catch (error) {
      console.error('Error creating list:', error)
      toast.error('Failed to create list')
    } finally {
      setCreatingList(false)
    }
  }

  const addNamesToList = async (listId: string) => {
    setAddingToList(true)
    try {
      const selectedNamesArray = Array.from(selectedNames)
      
      for (const nameName of selectedNamesArray) {
        // Get name ID
        const { data: nameRecord } = await supabase
          .from('names')
          .select('id')
          .eq('name', nameName)
          .single()

        if (!nameRecord) continue

        // Add to list (ignore if already exists)
        await supabase.from('list_names').insert({
          list_id: listId,
          name_id: nameRecord.id,
          added_by: user!.id,
        }).select()
      }

      toast.success(`${selectedNamesArray.length} name${selectedNamesArray.length > 1 ? 's' : ''} added to list!`)
      setShowListModal(false)
      setSelectedNames(new Set())
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Some names were already in the list')
      } else {
        console.error('Error adding names:', error)
        toast.error('Failed to add names to list')
      }
    } finally {
      setAddingToList(false)
    }
  }

  const filteredNames = shortlist.filter(name =>
    name.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  if (!user || !isPremium) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Your Shortlist</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {shortlist.length} {shortlist.length === 1 ? 'name' : 'names'} saved
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : shortlist.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                </select>

                <button
                  onClick={toggleSelectAll}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedNames.size === filteredNames.length && filteredNames.length > 0}
                    readOnly
                    className="w-4 h-4"
                  />
                  <span className="hidden sm:inline">Select All</span>
                </button>

                <button
                  onClick={handleAddToList}
                  disabled={selectedNames.size === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to List ({selectedNames.size})</span>
                  <span className="sm:hidden">List ({selectedNames.size})</span>
                </button>

                <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden lg:inline">Share</span>
                  </button>

                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden lg:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Names Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredNames.map((name, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {name.name}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedNames.has(name.name)}
                        onChange={() => toggleSelect(name.name)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0 mt-1"
                      />
                    </div>

                    <div className="space-y-2 text-sm sm:text-base mb-4">
                      <p className="text-gray-600">
                        <span className="font-semibold">Meaning:</span> {name.meaning || 'N/A'}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-semibold">Origin:</span> {name.origin || 'N/A'}
                      </p>

                      {name.characteristics && name.characteristics.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-600">Characteristics:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {name.characteristics.map((char, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Rate this name:</p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(name, star)}
                            onMouseEnter={(e) => {
                              // Preview effect on hover
                              const stars = e.currentTarget.parentElement?.querySelectorAll('button')
                              stars?.forEach((s, i) => {
                                const starIcon = s.querySelector('svg')
                                if (starIcon && i < star) {
                                  starIcon.classList.add('fill-yellow-300', 'text-yellow-300')
                                  starIcon.classList.remove('text-gray-300')
                                }
                              })
                            }}
                            onMouseLeave={(e) => {
                              // Reset to actual rating
                              const stars = e.currentTarget.parentElement?.querySelectorAll('button')
                              stars?.forEach((s, i) => {
                                const starIcon = s.querySelector('svg')
                                if (starIcon) {
                                  if (i < (name.rating || 0)) {
                                    starIcon.classList.add('fill-yellow-400', 'text-yellow-400')
                                    starIcon.classList.remove('text-gray-300', 'fill-yellow-300', 'text-yellow-300')
                                  } else {
                                    starIcon.classList.remove('fill-yellow-400', 'text-yellow-400', 'fill-yellow-300', 'text-yellow-300')
                                    starIcon.classList.add('text-gray-300')
                                  }
                                }
                              })
                            }}
                            className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-sm transition-all hover:scale-110 active:scale-95 p-1"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`h-7 w-7 sm:h-8 sm:w-8 transition-all ${
                                star <= (name.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                        {name.rating && name.rating > 0 && (
                          <button
                            onClick={() => handleRating(name, 0)}
                            className="ml-2 text-xs text-gray-500 hover:text-gray-700 underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(name)}
                      className="w-full bg-red-500 text-white py-2.5 rounded-md hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
                    >
                      Remove from Shortlist
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="max-w-md mx-auto">
                <div className="mb-4 flex justify-center">
                  <div className="bg-gray-100 rounded-full p-6">
                    <Plus className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Your shortlist is empty</h3>
                <p className="text-gray-600 mb-6">
                  Start generating names and save your favorites to build your shortlist
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Generate Names
                </button>
              </div>
            </div>
          )}

          {/* Add to List Modal */}
          {showListModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                  Add {selectedNames.size} name{selectedNames.size > 1 ? 's' : ''} to list
                </h2>

                {/* Create New List Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Create New List</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Enter list name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateNewList()
                        }
                      }}
                    />
                    <button
                      onClick={handleCreateNewList}
                      disabled={creatingList || !newListName.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {creatingList ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>

                {/* Existing Lists Section */}
                <div>
                  <h3 className="font-semibold mb-3">Or add to existing list:</h3>
                  {userLists.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No lists yet. Create your first one above!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {userLists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => addNamesToList(list.id)}
                          disabled={addingToList}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <div className="font-medium">{list.name}</div>
                          {list.description && (
                            <div className="text-sm text-gray-500 mt-1">{list.description}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowListModal(false)
                    setNewListName('')
                  }}
                  className="w-full mt-6 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
