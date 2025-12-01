import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCharacteristicInfo, getAllCharacteristicSlugs } from '@/lib/seo/characteristics';
import { ORIGINS, ORIGIN_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    origin: string;
    trait: string;
  }>;
}

// Generate static params for all origin/characteristic combinations
export async function generateStaticParams() {
  const traits = getAllCharacteristicSlugs();
  
  const params = [];
  for (const origin of ORIGINS) {
    for (const trait of traits) {
      params.push({ origin, trait });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { origin, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);
  const originLabel = ORIGIN_LABELS[origin];

  if (!charInfo || !originLabel) {
    return {
      title: 'Page Not Found',
    };
  }

  const title = `${charInfo.title.replace('Baby Names', '')}${originLabel} Names`;
  const description = `Discover ${trait} ${originLabel.toLowerCase()} baby names. Explore ${origin} names with ${trait} qualities for boys and girls.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${trait} ${origin} names`,
      `${trait} ${origin} baby names`,
      `${origin} ${trait} names`,
      ...charInfo.keywords.map(k => `${origin} ${k}`)
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/origin/${origin}/characteristic/${trait}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function OriginCharacteristicPage({ params }: PageProps) {
  const { origin, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);
  const originLabel = ORIGIN_LABELS[origin];

  if (!charInfo || !originLabel) {
    notFound();
  }

  const supabase = await createClient();

  // Query names with this origin and characteristic
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('origin', origin)
    .contains('characteristics', [trait])
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const title = `${charInfo.title.replace('Baby Names', '')}${originLabel} Names`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${trait} ${originLabel} names`,
    `/names/origin/${origin}/characteristic/${trait}`,
    namesList.length
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={title}
        description={`Browse our curated collection of ${trait} ${originLabel.toLowerCase()} baby names for boys and girls.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${originLabel} Names`, url: `/names/origin/${origin}` },
          { name: `${charInfo.title}`, url: `/names/characteristic/${trait}` },
          { name: title, url: `/names/origin/${origin}/characteristic/${trait}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {charInfo.title.replace('Baby Names', '')}from {originLabel}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Discover the perfect blend of {originLabel} cultural heritage and {trait} characteristics. 
              These {trait} {originLabel.toLowerCase()} names combine timeless tradition with the distinctive qualities modern parents seek.
            </p>
            <p className="text-gray-600 mb-4">
              {originLabel} names are renowned for their 
              {origin === 'japanese' ? ' connection to nature, beauty, and virtue' : ''}
              {origin === 'irish' ? ' Celtic heritage and strong character' : ''}
              {origin === 'italian' ? ' melodic sound and passionate energy' : ''}
              {origin === 'english' ? ' balance of tradition and modernity' : ''}
              {origin === 'french' ? ' elegance and sophistication' : ''}
              {origin === 'spanish' ? ' warmth and romantic appeal' : ''}
              {origin === 'german' ? ' strength and powerful meanings' : ''}
              {!['japanese', 'irish', 'italian', 'english', 'french', 'spanish', 'german'].includes(origin) ? ' rich cultural heritage' : ''}
              . When combined with {trait} qualities, they create names that are both meaningful and distinctive.
            </p>
            <p className="text-gray-600">
              {namesList.length > 0 
                ? `Explore ${namesList.length} ${trait} ${originLabel} names below, perfect for both boys and girls.`
                : `We're expanding our collection of ${trait} ${originLabel} names. Check back soon or explore related collections!`
              }
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {title}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4 text-lg">
              We're expanding our {trait} {originLabel} names collection.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Meanwhile, explore these collections:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={`/names/origin/${origin}`}
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                All {originLabel} Names
              </a>
              <a
                href={`/names/characteristic/${trait}`}
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                All {charInfo.title}
              </a>
            </div>
          </div>
        )}

        {/* Gender-Specific Navigation */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Browse by Gender
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href={`/names/male/origin/${origin}/characteristic/${trait}`}
              className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-colors"
            >
              <span className="text-lg font-medium text-blue-700">
                {charInfo.title.replace('Baby Names', '')} {originLabel} Boy Names →
              </span>
            </a>
            <a
              href={`/names/female/origin/${origin}/characteristic/${trait}`}
              className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-pink-300 hover:border-pink-500 transition-colors"
            >
              <span className="text-lg font-medium text-pink-700">
                {charInfo.title.replace('Baby Names', '')} {originLabel} Girl Names →
              </span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What makes a {originLabel} name {trait}?
              </h3>
              <p className="text-gray-700">
                {originLabel} names are {trait} through their unique cultural sounds, meaningful origins, and the qualities they embody. 
                These names blend {originLabel} heritage with the {trait} characteristics that resonate with modern parents.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find both boy and girl names?
              </h3>
              <p className="text-gray-700">
                Yes! Use the gender filters above to explore {trait} {originLabel} names specifically for 
                <a href={`/names/male/origin/${origin}/characteristic/${trait}`} className="text-indigo-600 hover:underline"> boys</a> or 
                <a href={`/names/female/origin/${origin}/characteristic/${trait}`} className="text-indigo-600 hover:underline"> girls</a>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Why choose {originLabel} {trait} names?
              </h3>
              <p className="text-gray-700">
                Choosing a {trait} {originLabel} name honors cultural heritage while embracing the {trait} qualities you desire. 
                These names offer both meaning and distinction, creating a perfect balance for your baby's identity.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links */}
        <InternalLinks
          showOrigins={true}
          showMeanings={true}
          showGenders={true}
          limit={8}
        />
      </SEOPageLayout>
    </>
  );
}
