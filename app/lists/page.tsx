'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Plus, Users, Lock, Globe, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface List {
  id: string
  name: string
  description: string | null
  is_public: boolean
  invite_code: string
  created_at: string
  _count?: {
    names: number
    members: number
  }
}

export default function ListsPage() {
  const { user, isPremium, loading: authLoading } = useAuth()
  const router = useRouter()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [newListPublic, setNewListPublic] = useState(false)
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setLoading(false)
      router.push('/auth/login')
      return
    }

    if (!isPremium) {
      setLoading(false)
      router.push('/pricing')
      return
    }

    loadLists()
  }, [user, isPremium, authLoading])

  const loadLists = async () => {
    setLoading(true)
    try {
      // Get lists where user is owner or member
      const { data: ownedLists, error: ownedError } = await supabase
        .from('lists')
        .select(`
          id,
          name,
          description,
          is_public,
          invite_code,
          created_at
        `)
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })

      if (ownedError) {
        console.error('Error loading owned lists:', ownedError)
        throw ownedError
      }

      // Get lists where user is a member
      const { data: memberLists, error: memberError } = await supabase
        .from('list_members')
        .select(`
          lists (
            id,
            name,
            description,
            is_public,
            invite_code,
            created_at
          )
        `)
        .eq('user_id', user!.id)
        .neq('role', 'owner')

      if (memberError) {
        console.error('Error loading member lists:', memberError)
        // Don't throw here - member lists are optional
      }

      // Combine and get counts for each list
      const allLists = [
        ...(ownedLists || []),
        ...(memberLists?.map(m => (m.lists as any)) || [])
      ]

      // Get counts for each list
      const listsWithCounts = await Promise.all(
        allLists.map(async (list) => {
          const { count: namesCount } = await supabase
            .from('list_names')
            .select('*', { count: 'exact', head: true })
            .eq('list_id', list.id)

          const { count: membersCount } = await supabase
            .from('list_members')
            .select('*', { count: 'exact', head: true })
            .eq('list_id', list.id)

          return {
            ...list,
            _count: {
              names: namesCount || 0,
              members: (membersCount || 0) + 1, // +1 for owner
            },
          }
        })
      )

      setLists(listsWithCounts)
    } catch (error: any) {
      console.error('Error loading lists:', error)
      toast.error(error.message || 'Failed to load lists')
      setLists([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    setCreating(true)

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert({
          owner_id: user!.id,
          name: newListName,
          description: newListDescription || null,
          is_public: newListPublic,
        })
        .select()
        .single()

      if (error) throw error

      // Add owner as member
      await supabase.from('list_members').insert({
        list_id: data.id,
        user_id: user!.id,
        role: 'owner',
      })

      toast.success('List created!')
      setShowCreateModal(false)
      setNewListName('')
      setNewListDescription('')
      setNewListPublic(false)
      loadLists()
    } catch (error) {
      console.error('Error creating list:', error)
      toast.error('Failed to create list')
    } finally {
      setCreating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Lists</h1>
            <p className="text-gray-600 mt-2">Create and manage your baby name lists</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create List
          </button>
        </div>

        {lists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No lists yet</h2>
            <p className="text-gray-600 mb-6">Create your first list to start organizing baby names</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{list.name}</h3>
                  <div title={list.is_public ? 'Public' : 'Private'}>
                    {list.is_public ? (
                      <Globe className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {list.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{list.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{list._count?.names || 0} names</span>
                  <span>{list._count?.members || 0} members</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create List Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Create New List</h2>
              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name *
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Our Favorites"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What's this list for?"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="public"
                    checked={newListPublic}
                    onChange={(e) => setNewListPublic(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="public" className="ml-2 text-sm text-gray-700">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {creating ? 'Creating...' : 'Create List'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
