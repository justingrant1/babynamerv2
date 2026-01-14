import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VALID_URL_GENDERS, GENDER_LABELS, GENDER_DB_MAP } from '@/lib/seo/constants'
import { generateGenderMetadata } from '@/lib/seo/metadata'
import { generateCompleteStructuredData, generateCharacteristicFAQs } from '@/lib/seo/structured-data'
import SEOPageLayout from '@/components/seo/SEOPageLayout'
import NameGrid from '@/components/seo/NameGrid'
import InternalLinks from '@/components/seo/InternalLinks'
import { NameData } from '@/lib/types/database'

interface PageProps {
  params: {
    gender: string
  }
}

export async function generateStaticParams() {
  return VALID_URL_GENDERS.map((gender) => ({
    gender,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender } = await params
  
  if (!VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    return { title: 'Not Found' }
  }

  return generateGenderMetadata(gender)
}

export default async function GenderPage({ params }: PageProps) {
  const { gender } = await params

  if (!VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    notFound()
  }

  const supabase = await createClient()
  const dbGender = GENDER_DB_MAP[gender]
  const genderLabel = GENDER_LABELS[gender]
  
  // Fetch names for this gender
  const { data: names } = await supabase
    .from('names')
    .select('*')
    .eq('gender', dbGender)
    .order('popularity_score', { ascending: false })
    .limit(100)

  const nameData = (names || []) as NameData[]

  // Generate structured data
  const faqs = generateCharacteristicFAQs('gender', gender)
  const structuredData = generateCompleteStructuredData({
    breadcrumbs: [
      { name: 'Names', url: '/names' },
      { name: `${genderLabel} Names`, url: `/names/${gender}` },
    ],
    webPage: {
      title: `${genderLabel} Baby Names`,
      description: `Discover beautiful ${genderLabel.toLowerCase()} baby names for your little one.`,
      url: `/names/${gender}`,
    },
    nameList: nameData.length > 0 ? {
      names: nameData.slice(0, 20).map(n => ({
        name: n.name,
        meaning: n.meaning || undefined,
        origin: n.origin || undefined,
      })),
      listName: `${genderLabel} Baby Names`,
      listDescription: `Beautiful ${genderLabel.toLowerCase()} names for your baby`,
    } : undefined,
    faq: faqs,
    collectionPage: {
      title: `${genderLabel} Baby Names`,
      description: `Browse ${genderLabel.toLowerCase()} baby names`,
      url: `/names/${gender}`,
      numberOfItems: nameData.length,
    },
  })

  return (
    <SEOPageLayout
      title={`${genderLabel} Baby Names`}
      description={`Discover beautiful ${genderLabel.toLowerCase()} baby names. Browse our curated collection of ${genderLabel.toLowerCase()} names with meanings and origins.`}
      breadcrumbs={[
        { name: 'Names', url: '/names' },
        { name: `${genderLabel} Names`, url: `/names/${gender}` },
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
        currentPage={{ type: 'gender', value: gender }}
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
