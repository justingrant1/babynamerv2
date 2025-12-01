import { ReactNode } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Breadcrumb {
  name: string
  url: string
}

interface SEOPageLayoutProps {
  children: ReactNode
  title: string
  description: string
  breadcrumbs?: Breadcrumb[]
  showCTA?: boolean
  structuredData?: any[]
}

export default function SEOPageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  showCTA = true,
  structuredData = [],
}: SEOPageLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Structured Data */}
        {structuredData.length > 0 && (
          <>
            {structuredData.map((data, index) => (
              <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
              />
            ))}
          </>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.url} className="flex items-center space-x-2">
                    <span className="text-gray-400">/</span>
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 font-medium">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.url}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              {title}
            </h1>
            <p className="text-base sm:text-xl text-gray-700 max-w-3xl">
              {description}
            </p>
          </div>

          {/* Main Content */}
          <div className="mb-12">{children}</div>

          {/* CTA Section */}
          {showCTA && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center mt-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Can't Find the Perfect Name?
              </h2>
              <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
                Use our AI-powered baby name generator to discover personalized
                suggestions based on your preferences.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Try AI Name Generator
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
