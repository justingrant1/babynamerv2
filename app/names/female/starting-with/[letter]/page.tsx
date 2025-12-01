import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LETTERS } from '@/lib/seo/constants'
import { generateLetterMetadata } from '@/lib/seo/metadata'
import { generateCompleteStructuredData, generateCharacteristicFAQs } from '@/lib/seo/structured-data'
import SEOPageLayout from '@/components/seo/SEOPageLayout'
import NameGrid from '@/components/seo/NameGrid'
import InternalLinks from '@/components/seo/InternalLinks'
import { NameData } from '@/lib/types/database'

interface PageProps {
  params: {
    letter: string
  }
}

export async function generateStaticParams() {
  return LETTERS.map((letter) => ({
    letter,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params
  
  if (!LETTERS.includes(letter as any)) {
    return { title: 'Not Found' }
  }

  return generateLetterMetadata(letter)
}

export default async function FemaleLetterPage({ params }: PageProps) {
  const { letter } = await params
  const gender = 'female'

  if (!LETTERS.includes(letter as any)) {
    notFound()
  }

  const supabase = await createClient()
  const letterUpper = letter.toUpperCase()
  
  // Fetch female names starting with this letter
  const { data: names } = await supabase
    .from('names')
    .select('*')
    .eq('gender', gender)
    .ilike('name', `${letterUpper}%`)
    .order('popularity_score', { ascending: false })
    .limit(100)

  const nameData = (names || []) as NameData[]

  // Generate structured data
  const faqs = generateCharacteristicFAQs('letter', letter)
  const structuredData = generateCompleteStructuredData({
    breadcrumbs: [
      { name: 'Names', url: '/names' },
      { name: 'Female Names', url: '/names/female' },
      { name: `Names Starting with ${letterUpper}`, url: `/names/female/starting-with/${letter}` },
    ],
    webPage: {
      title: `Female Baby Names Starting with ${letterUpper}`,
      description: `Discover beautiful female baby names that start with the letter ${letterUpper}.`,
      url: `/names/female/starting-with/${letter}`,
    },
    nameList: nameData.length > 0 ? {
      names: nameData.slice(0, 20).map(n => ({
        name: n.name,
        meaning: n.meaning || undefined,
        origin: n.origin || undefined,
      })),
      listName: `Female Baby Names Starting with ${letterUpper}`,
      listDescription: `Beautiful female names beginning with ${letterUpper} for your baby girl`,
    } : undefined,
    faq: faqs,
    collectionPage: {
      title: `Female Baby Names Starting with ${letterUpper}`,
      description: `Explore female baby names beginning with ${letterUpper}`,
      url: `/names/female/starting-with/${letter}`,
      numberOfItems: nameData.length,
    },
  })

  return (
    <SEOPageLayout
      title={`Female Baby Names Starting with ${letterUpper}`}
      description={`Discover beautiful female baby names that start with the letter ${letterUpper}. Browse our collection of girl names beginning with ${letterUpper}.`}
      breadcrumbs={[
        { name: 'Names', url: '/names' },
        { name: 'Female Names', url: '/names/female' },
        { name: `Names Starting with ${letterUpper}`, url: `/names/female/starting-with/${letter}` },
      ]}
      structuredData={structuredData}
    >
      {/* Names Grid */}
      <NameGrid names={nameData} />

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="mt-16 bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Links */}
      <InternalLinks
        currentPage={{ type: 'letter', value: letter }}
        showOrigins={true}
        showMeanings={true}
        showGenders={false}
        showLetters={true}
      />
    </SEOPageLayout>
  )
}

// Enable static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day
