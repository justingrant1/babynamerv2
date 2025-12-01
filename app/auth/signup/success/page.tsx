'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SignupSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Welcome to Premium!</h1>
            <p className="text-gray-600 mb-6">
              Your payment was successful and your account has been created.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <span>Check your email for a password reset link</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <span>Click the link to set your password</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <span>Sign in and start using all premium features!</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Go to Sign In
              </Link>
              
              <Link
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Browsing
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Didn't receive an email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
