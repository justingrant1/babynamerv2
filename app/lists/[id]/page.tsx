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

export default function ListDetailPage() {
  const { user, isPremium } = useAuth()
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string
  
  const [list, setList] = useState<any>(null)
  const [names, setNames] = useState<NameData[]>([])
  const [members, setMembers] = useState<ListMember[]>([])
  const [shortlist, setShortlist] = useState<NameData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [userRole, setUserRole] = useState<string>('viewer')
  const supabase = createClient()

  useEffect(() => {
    if (!user || !isPremium) {
      router.push('/pricing')
      return
    }

    loadListData()
  }, [user, isPremium, listId])

  const loadListData = async () => {
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

      // Get list names
      const { data: listNames, error: namesError } = await supabase
        .from('list_names')
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
        .eq('list_id', listId)

      if (namesError) throw namesError

      const namesList = listNames
        ?.map((item: any) => item.names)
        .filter(Boolean) as NameData[]
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

  const handleRemoveNameFromList = async (name: NameData) => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to remove names')
      return
    }

    try {
      // Get name ID
      const { data: nameRecord } = await supabase
        .from('names')
        .select('id')
        .eq('name', name.name)
        .single()

      if (!nameRecord) return

      // Remove from list
      await supabase
        .from('list_names')
        .delete()
        .eq('list_id', listId)
        .eq('name_id', nameRecord.id)

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
          <div>
            <h1 className="text-4xl font-bold">{list?.name}</h1>
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
            <div className="space-y-3">
              {names.map((name, index) => (
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
      </div>
    </>
  )
}
