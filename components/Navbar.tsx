'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { List, Heart, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user, isPremium, signOut } = useAuth()

  return (
    <nav className="bg-[#1e293b] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-lg sm:text-xl font-bold">
            Baby Names AI
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-6">
            {user && isPremium && (
              <>
                <Link
                  href="/lists"
                  className="hidden sm:flex items-center gap-2 hover:text-gray-300 transition-colors"
                >
                  <List className="h-5 w-5" />
                  <span>My Lists</span>
                </Link>
                <Link
                  href="/lists"
                  className="sm:hidden hover:text-gray-300 transition-colors"
                >
                  <List className="h-5 w-5" />
                </Link>
                <Link
                  href="/shortlist"
                  className="hidden sm:flex items-center gap-2 hover:text-gray-300 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Shortlist</span>
                </Link>
                <Link
                  href="/shortlist"
                  className="sm:hidden hover:text-gray-300 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </Link>
              </>
            )}
            
            {user && (
              <>
                {!isPremium && (
                  <Link
                    href="/pricing"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all font-semibold text-sm sm:text-base shadow-lg animate-pulse"
                  >
                    ⭐ Upgrade
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors text-sm sm:text-base"
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors text-sm sm:text-base"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
