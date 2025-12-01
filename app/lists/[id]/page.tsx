'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import {
  ArrowLeft,
  Plus,
  UserPlus,
  Copy,
  Trash2,
  Loader2,
  Heart,
  Settings,
  Pencil,
  Star,
  Crown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { NameData } from '@/lib/types/database'

interface ListMember {
  id: string
  user_id: string
  role: string
  profiles: {
    display_name: string | null
    email: string
  }
}

interface ListNameWithRating extends NameData {
  list_name_id: string
  rating?: number
  is_winner?: boolean
}

export default function ListDetailPage() {
  const { user, isPremium, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string
  
  const [list, setList] = useState<any>(null)
  const [names, setNames] = useState<ListNameWithRating[]>([])
  const [members, setMembers] = useState<ListMember[]>([])
  const [shortlist, setShortlist] = useState<NameData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editIsPublic, setEditIsPublic] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [userRole, setUserRole] = useState<string>('viewer')
  const supabase = createClient()

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    if (!user || !isPremium) {
      setLoading(false)
      router.push('/pricing')
      return
    }

    loadListData()
  }, [user, isPremium, authLoading, listId])

  const loadListData = async () => {
    setLoading(true)
    try {
      // Get list details
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('*')
        .eq('id', listId)
        .single()

      if (listError) throw listError
      setList(listData)

      // Get user's role
      const { data: memberData } = await supabase
        .from('list_members')
        .select('role')
        .eq('list_id', listId)
        .eq('user_id', user!.id)
        .single()

      setUserRole(memberData?.role || 'viewer')

      // Get list names with ratings
      const { data: listNames, error: namesError } = await supabase
        .from('list_names')
        .select(`
          id,
          notes,
          rating,
          is_winner,
          names (
            name,
            gender,
            origin,
            meaning,
            characteristics
          )
        `)
        .eq('list_id', listId)

      if (namesError) throw namesError

      const namesList = listNames
        ?.map((item: any) => ({
          ...item.names,
          list_name_id: item.id,
          rating: item.rating || 0,
          is_winner: item.is_winner || false,
        }))
        .filter(Boolean) as ListNameWithRating[]
      setNames(namesList || [])

      // Get list members
      const { data: membersData, error: membersError } = await supabase
        .from('list_members')
        .select(`
          id,
          user_id,
          role,
          profiles (
            display_name,
            email
          )
        `)
        .eq('list_id', listId)

      if (membersError) throw membersError
      setMembers(membersData as any || [])

      // Get user's shortlist
      const { data: shortlistData } = await supabase
        .from('shortlist')
        .select(`
          names (
            name,
            gender,
            origin,
            meaning,
            characteristics
          )
        `)
        .eq('user_id', user!.id)

      const shortlistNames = shortlistData
        ?.map((item: any) => item.names)
        .filter(Boolean) as NameData[]
      setShortlist(shortlistNames || [])
    } catch (error) {
      console.error('Error loading list:', error)
      toast.error('Failed to load list')
      router.push('/lists')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNameToList = async (name: NameData) => {
    try {
      // Get name ID
      const { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      if (!nameRecord) return

      // Add to list
      const { error } = await supabase.from('list_names').insert({
        list_id: listId,
        name_id: nameRecord.id,
        added_by: user!.id,
      })

      if (error) {
        if (error.code === '23505') {
          toast.error('Name already in this list')
        } else {
          throw error
        }
        return
      }

      toast.success(`${name.name} added to list!`)
      loadListData()
    } catch (error) {
      console.error('Error adding name:', error)
      toast.error('Failed to add name')
    }
  }

  const handleRating = async (name: ListNameWithRating, rating: number) => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to rate names')
      return
    }

    try {
      await supabase
        .from('list_names')
        .update({ rating })
        .eq('id', name.list_name_id)

      setNames(names.map(item => 
        item.name === name.name ? { ...item, rating } : item
      ))
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error('Failed to update rating')
    }
  }

  const handleSelectWinner = async (name: ListNameWithRating) => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to select a winner')
      return
    }

    try {
      // Clear all winners first
      await supabase
        .from('list_names')
        .update({ is_winner: false })
        .eq('list_id', listId)

      // Set this name as winner
      await supabase
        .from('list_names')
        .update({ is_winner: true })
        .eq('id', name.list_name_id)

      setNames(names.map(item => ({
        ...item,
        is_winner: item.name === name.name
      })))

      toast.success(`${name.name} selected as the winner! 🎉`)
    } catch (error) {
      console.error('Error selecting winner:', error)
      toast.error('Failed to select winner')
    }
  }

  const handleRemoveNameFromList = async (name: ListNameWithRating) => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to remove names')
      return
    }

    try {
      // Remove from list using list_name_id
      await supabase
        .from('list_names')
        .delete()
        .eq('id', name.list_name_id)

      toast.success(`${name.name} removed from list`)
      loadListData()
    } catch (error) {
      console.error('Error removing name:', error)
      toast.error('Failed to remove name')
    }
  }

  const copyInviteCode = () => {
    const inviteUrl = `${window.location.origin}/lists/join/${list.invite_code}`
    navigator.clipboard.writeText(inviteUrl)
    toast.success('Invite link copied!')
  }

  const handleEditList = () => {
    setEditName(list?.name || '')
    setEditDescription(list?.description || '')
    setEditIsPublic(list?.is_public || false)
    setShowEditModal(true)
  }

  const handleUpdateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('lists')
        .update({
          name: editName,
          description: editDescription || null,
          is_public: editIsPublic,
        })
        .eq('id', listId)

      if (error) throw error

      toast.success('List updated!')
      setShowEditModal(false)
      loadListData()
    } catch (error) {
      console.error('Error updating list:', error)
      toast.error('Failed to update list')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </>
    )
  }

  const availableNames = shortlist.filter(
    (shortlistName) => !names.some((listName) => listName.name === shortlistName.name)
  )

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/lists"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Lists
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{list?.name}</h1>
              {(userRole === 'owner' || userRole === 'editor') && (
                <button
                  onClick={handleEditList}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Edit list details"
                >
                  <Pencil className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
            {list?.description && (
              <p className="text-gray-600 mt-2">{list.description}</p>
            )}
            <div className="flex gap-2 mt-3 text-sm text-gray-500">
              <span>{names.length} names</span>
              <span>•</span>
              <span>{members.length} members</span>
              <span>•</span>
              <span className="capitalize">{userRole}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {userRole !== 'viewer' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Names
              </button>
            )}
            {(userRole === 'owner' || userRole === 'editor') && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Invite
              </button>
            )}
          </div>
        </div>

        {/* Names */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Names in this List</h2>
          {names.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No names in this list yet</p>
          ) : (
            <div className="space-y-4">
              {names.map((name, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    name.is_winner 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-indigo-600">{name.name}</h3>
                        {name.is_winner && (
                          <span title="Winner!">
                            <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="capitalize">{name.gender}</span>
                        {name.origin && <span> • {name.origin}</span>}
                      </div>
                      {name.meaning && (
                        <p className="text-sm text-gray-500 mt-1">{name.meaning}</p>
                      )}
                    </div>
                    {userRole !== 'viewer' && (
                      <button
                        onClick={() => handleRemoveNameFromList(name)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Star Rating */}
                  {userRole !== 'viewer' && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 font-medium mb-2">Rate this name:</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(name, star)}
                            className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-sm transition-all hover:scale-110 active:scale-95 p-1"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`h-5 w-5 transition-all ${
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
                  )}

                  {/* Select Winner Button */}
                  {userRole !== 'viewer' && !name.is_winner && (
                    <button
                      onClick={() => handleSelectWinner(name)}
                      className="w-full px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-md hover:from-yellow-500 hover:to-yellow-600 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Crown className="h-4 w-4" />
                      Select as Winner
                    </button>
                  )}
                  
                  {name.is_winner && (
                    <div className="w-full px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md font-semibold text-sm text-center flex items-center justify-center gap-2">
                      <Crown className="h-4 w-4 fill-yellow-600" />
                      This is the Winner!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {(member.profiles as any).display_name || (member.profiles as any).email}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Names Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add Names from Shortlist</h2>
              {availableNames.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No names available. Add names to your shortlist first!
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  {availableNames.map((name, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-indigo-600">{name.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="capitalize">{name.gender}</span>
                          {name.origin && <span> • {name.origin}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddNameToList(name)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Invite Members</h2>
              <p className="text-gray-600 mb-4">
                Share this link with others to invite them to collaborate on this list:
              </p>
              <div className="bg-gray-50 p-3 rounded-md mb-4 break-all text-sm">
                {`${window.location.origin}/lists/join/${list.invite_code}`}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyInviteCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                  Copy Link
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit List Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Edit List</h2>
              <form onSubmit={handleUpdateList} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
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
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What's this list for?"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-public"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-public" className="ml-2 text-sm text-gray-700">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
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
