import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { generateNameMetadata } from '@/lib/seo/metadata'
import { generateCompleteStructuredData } from '@/lib/seo/structured-data'
import SEOPageLayout from '@/components/seo/SEOPageLayout'
import NameCard from '@/components/seo/NameCard'
import { NameData } from '@/lib/types/database'
import { GENDER_LABELS } from '@/lib/seo/constants'

interface PageProps {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  // Use a simple fetch for static generation (no cookies needed)
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data: names } = await supabase
    .from('names')
    .select('name')
    .limit(1000)

  return (names || []).map((n) => ({
    name: n.name.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const supabase = await createClient()
  
  const { data: nameData } = await supabase
    .from('names')
    .select('*')
    .ilike('name', name)
    .single()

  if (!nameData) {
    return { title: 'Name Not Found' }
  }

  return generateNameMetadata(
    nameData.name,
    nameData.meaning || undefined,
    nameData.origin || undefined,
    nameData.gender || undefined
  )
}

export default async function IndividualNamePage({ params }: PageProps) {
  const { name } = await params
  const supabase = await createClient()

  // Fetch the specific name
  const { data: nameData } = await supabase
    .from('names')
    .select('*')
    .ilike('name', name)
    .single()

  if (!nameData) {
    notFound()
  }

  const typedName = nameData as NameData
  const nameCap = typedName.name.charAt(0).toUpperCase() + typedName.name.slice(1)
  const firstLetter = typedName.name.charAt(0).toLowerCase()

  // Fetch similar names (same origin or same first letter)
  const { data: similarNames } = await supabase
    .from('names')
    .select('*')
    .or(`origin.ilike.${typedName.origin},name.ilike.${firstLetter}%`)
    .neq('name', typedName.name)
    .order('popularity_score', { ascending: false })
    .limit(6)

  const similarNamesData = (similarNames || []) as NameData[]

  // Generate structured data
  const structuredData = generateCompleteStructuredData({
    breadcrumbs: [
      { name: 'Names', url: '/names' },
      { name: nameCap, url: `/name/${name}` },
    ],
    nameArticle: {
      name: typedName.name,
      meaning: typedName.meaning || undefined,
      origin: typedName.origin || undefined,
      gender: typedName.gender || undefined,
    },
  })

  return (
    <SEOPageLayout
      title={`${nameCap} - Name Meaning & Origin`}
      description={`Discover the meaning and origin of the name ${nameCap}. ${
        typedName.meaning && typedName.origin
          ? `${nameCap} means "${typedName.meaning}" and has ${typedName.origin} origin.`
          : ''
      }`}
      breadcrumbs={[
        { name: 'Names', url: '/names' },
        { name: nameCap, url: `/name/${name}` },
      ]}
      structuredData={structuredData}
    >
      {/* Name Details Card */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{nameCap}</h2>
          
          <div className="space-y-4">
            {typedName.meaning && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meaning</h3>
                <p className="text-gray-700 text-lg">{typedName.meaning}</p>
              </div>
            )}

            {typedName.origin && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Origin</h3>
                <p className="text-gray-700">
                  <Link 
                    href={`/names/origin/${typedName.origin.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {typedName.origin}
                  </Link>
                </p>
              </div>
            )}

            {typedName.gender && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gender</h3>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    typedName.gender === 'male'
                      ? 'bg-blue-100 text-blue-800'
                      : typedName.gender === 'female'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {GENDER_LABELS[typedName.gender as keyof typeof GENDER_LABELS] || typedName.gender}
                </span>
              </div>
            )}

            {typedName.characteristics && typedName.characteristics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {typedName.characteristics.map((char, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {typedName.popularity_score !== null && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Popularity</h3>
                <div className="flex items-center">
                  <div className="flex-grow bg-gray-200 rounded-full h-3 mr-4">
                    <div
                      className="bg-indigo-600 h-3 rounded-full"
                      style={{ width: `${typedName.popularity_score}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 font-medium">{typedName.popularity_score}/100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Names */}
      {similarNamesData.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Similar Names</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {similarNamesData.map((similarName, index) => (
              <NameCard
                key={similarName.name}
                name={similarName}
                showOrigin={true}
                showMeaning={true}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Explore More Names</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {typedName.origin && (
            <Link
              href={`/names/origin/${typedName.origin.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-center py-3 px-4 bg-white rounded-lg hover:shadow-md transition-shadow font-medium text-gray-700 hover:text-indigo-600"
            >
              More {typedName.origin} Names
            </Link>
          )}
          <Link
            href={`/names/starting-with/${firstLetter}`}
            className="text-center py-3 px-4 bg-white rounded-lg hover:shadow-md transition-shadow font-medium text-gray-700 hover:text-indigo-600"
          >
            Names Starting with {firstLetter.toUpperCase()}
          </Link>
          {typedName.gender && typedName.gender !== 'unisex' && (
            <Link
              href={`/names/${typedName.gender}`}
              className="text-center py-3 px-4 bg-white rounded-lg hover:shadow-md transition-shadow font-medium text-gray-700 hover:text-indigo-600"
            >
              {GENDER_LABELS[typedName.gender as keyof typeof GENDER_LABELS]} Names
            </Link>
          )}
          <Link
            href="/names"
            className="text-center py-3 px-4 bg-white rounded-lg hover:shadow-md transition-shadow font-medium text-gray-700 hover:text-indigo-600"
          >
            Browse All Names
          </Link>
        </div>
      </div>
    </SEOPageLayout>
  )
}

// Enable static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day
