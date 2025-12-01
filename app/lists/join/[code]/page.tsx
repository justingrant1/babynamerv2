'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Loader2, Users, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export default function JoinListPage() {
  const { user, isPremium, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const inviteCode = params.code as string
  
  const [list, setList] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadList()
  }, [inviteCode, user])

  const loadList = async () => {
    try {
      // Get list by invite code
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('*')
        .eq('invite_code', inviteCode)
        .single()

      if (listError) throw listError
      setList(listData)

      // Check if user is already a member
      if (user) {
        const { data: memberData } = await supabase
          .from('list_members')
          .select('id')
          .eq('list_id', listData.id)
          .eq('user_id', user.id)
          .single()

        if (memberData) {
          setAlreadyMember(true)
        }
      }
    } catch (error) {
      console.error('Error loading list:', error)
      toast.error('Invalid invite link')
      router.push('/lists')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinList = async () => {
    if (!user) {
      toast.error('Please sign in to join this list')
      router.push('/auth/login')
      return
    }

    if (!isPremium) {
      toast.error('Upgrade to Premium to join lists')
      router.push('/pricing')
      return
    }

    setJoining(true)

    try {
      const { error } = await supabase.from('list_members').insert({
        list_id: list.id,
        user_id: user.id,
        role: 'editor', // Default role for invited members
      })

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already a member of this list')
          setAlreadyMember(true)
        } else {
          throw error
        }
        return
      }

      toast.success('Successfully joined the list!')
      router.push(`/lists/${list.id}`)
    } catch (error) {
      console.error('Error joining list:', error)
      toast.error('Failed to join list')
    } finally {
      setJoining(false)
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

  if (alreadyMember) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Already a Member</h1>
            <p className="text-gray-600 mb-6">
              You're already a member of <strong>{list?.name}</strong>
            </p>
            <button
              onClick={() => router.push(`/lists/${list.id}`)}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              View List
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">You've Been Invited!</h1>
          <p className="text-gray-600 mb-2">
            Join <strong>{list?.name}</strong>
          </p>
          {list?.description && (
            <p className="text-sm text-gray-500 mb-6">{list.description}</p>
          )}
          
          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Sign in to join this list</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                Create Account
              </button>
            </div>
          ) : !isPremium ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Upgrade to Premium to join and collaborate on lists
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Upgrade to Premium
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoinList}
              disabled={joining}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {joining ? 'Joining...' : 'Join List'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
