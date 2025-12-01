'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Check, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PricingPage() {
  const { user, isPremium } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      router.push('/auth/login')
      return
    }

    if (isPremium) {
      toast.success('You already have Premium!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      toast.error(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited features with Premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>3 name generations per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>View trending names</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Check className="h-5 w-5" />
                <span>Shortlist feature</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Check className="h-5 w-5" />
                <span>Create & share lists</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Check className="h-5 w-5" />
                <span>Collaborate with friends</span>
              </li>
            </ul>
            <button
              disabled
              className="w-full py-3 px-4 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-xl p-8 border-2 border-indigo-600 relative">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-bl-lg rounded-tr-lg font-semibold text-sm">
              POPULAR
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <Crown className="h-6 w-6" />
              Premium
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$3.99</span>
              <span className="text-indigo-100">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-white">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Unlimited name generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span>View trending names</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Save to shortlist</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Create unlimited lists</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Share lists with friends & family</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Collaborative editing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-yellow-300" />
                <span>Priority support</span>
              </li>
            </ul>
            {!user ? (
              <a
                href="/auth/signup"
                className="block w-full py-3 px-4 bg-white text-indigo-600 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Sign Up & Get Premium
              </a>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading || isPremium}
                className="w-full py-3 px-4 bg-white text-indigo-600 rounded-md font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : isPremium ? 'Current Plan' : 'Upgrade to Premium'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Cancel anytime. No commitments.</p>
        </div>
      </div>
    </>
  )
}
