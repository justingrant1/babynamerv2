import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ORIGINS, ORIGIN_LABELS, ORIGIN_DESCRIPTIONS } from '@/lib/seo/constants'
import { generateOriginMetadata } from '@/lib/seo/metadata'
import { generateCompleteStructuredData, generateCharacteristicFAQs } from '@/lib/seo/structured-data'
import SEOPageLayout from '@/components/seo/SEOPageLayout'
import NameGrid from '@/components/seo/NameGrid'
import InternalLinks from '@/components/seo/InternalLinks'
import { NameData } from '@/lib/types/database'

interface PageProps {
  params: {
    origin: string
  }
}

export async function generateStaticParams() {
  return ORIGINS.map((origin) => ({
    origin,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { origin } = await params
  
  if (!ORIGINS.includes(origin as any)) {
    return { title: 'Not Found' }
  }

  return generateOriginMetadata(origin)
}

export default async function FemaleOriginPage({ params }: PageProps) {
  const { origin } = await params
  const gender = 'female'

  if (!ORIGINS.includes(origin as any)) {
    notFound()
  }

  const supabase = await createClient()
  
  // Fetch female names with this origin
  const { data: names } = await supabase
    .from('names')
    .select('*')
    .eq('gender', gender)
    .ilike('origin', ORIGIN_LABELS[origin])
    .order('popularity_score', { ascending: false })
    .limit(100)

  const nameData = (names || []) as NameData[]
  const originLabel = ORIGIN_LABELS[origin]

  // Generate structured data
  const faqs = generateCharacteristicFAQs('origin', origin)
  const structuredData = generateCompleteStructuredData({
    breadcrumbs: [
      { name: 'Names', url: '/names' },
      { name: 'Female Names', url: '/names/female' },
      { name: `${originLabel} Names`, url: `/names/female/origin/${origin}` },
    ],
    webPage: {
      title: `Female ${originLabel} Baby Names`,
      description: `Discover beautiful female ${originLabel.toLowerCase()} baby names. ${ORIGIN_DESCRIPTIONS[origin]}`,
      url: `/names/female/origin/${origin}`,
    },
    nameList: nameData.length > 0 ? {
      names: nameData.slice(0, 20).map(n => ({
        name: n.name,
        meaning: n.meaning || undefined,
        origin: n.origin || undefined,
      })),
      listName: `Female ${originLabel} Baby Names`,
      listDescription: `Beautiful female ${originLabel.toLowerCase()} names for your baby girl`,
    } : undefined,
    faq: faqs,
    collectionPage: {
      title: `Female ${originLabel} Baby Names`,
      description: `Browse female ${originLabel.toLowerCase()} baby names`,
      url: `/names/female/origin/${origin}`,
      numberOfItems: nameData.length,
    },
  })

  return (
    <SEOPageLayout
      title={`Female ${originLabel} Baby Names`}
      description={`Discover beautiful female ${originLabel.toLowerCase()} baby names. ${ORIGIN_DESCRIPTIONS[origin]}`}
      breadcrumbs={[
        { name: 'Names', url: '/names' },
        { name: 'Female Names', url: '/names/female' },
        { name: `${originLabel} Names`, url: `/names/female/origin/${origin}` },
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
        currentPage={{ type: 'origin', value: origin }}
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
