import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCharacteristicInfo, getAllCharacteristicSlugs } from '@/lib/seo/characteristics';
import { ORIGINS, GENDER_LABELS, ORIGIN_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female';
    origin: string;
    trait: string;
  }>;
}

// Generate static params for all gender/origin/characteristic combinations
export async function generateStaticParams() {
  const traits = getAllCharacteristicSlugs();
  const genders: Array<'male' | 'female'> = ['male', 'female'];
  
  const params = [];
  for (const gender of genders) {
    for (const origin of ORIGINS) {
      for (const trait of traits) {
        params.push({ gender, origin, trait });
      }
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, origin, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);
  const originLabel = ORIGIN_LABELS[origin];

  if (!charInfo || !originLabel || !['male', 'female'].includes(gender)) {
    return {
      title: 'Page Not Found',
    };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${charInfo.title.replace('Baby Names', '')}${originLabel} ${genderLabel} Names`;
  const description = `Discover ${trait} ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names. Perfect ${origin} names for your baby ${gender === 'male' ? 'boy' : 'girl'} with ${trait} qualities.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${trait} ${origin} ${gender} names`,
      `${trait} ${origin} names`,
      `${origin} ${gender} names`,
      ...charInfo.keywords.map(k => `${origin} ${k}`)
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/origin/${origin}/characteristic/${trait}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderOriginCharacteristicPage({ params }: PageProps) {
  const { gender, origin, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);
  const originLabel = ORIGIN_LABELS[origin];

  if (!charInfo || !originLabel || !['male', 'female'].includes(gender)) {
    notFound();
  }

  const supabase = await createClient();

  // Query names with this gender, origin, and characteristic
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', gender)
    .eq('origin', origin)
    .contains('characteristics', [trait])
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const genderLabel = GENDER_LABELS[gender];
  const title = `${charInfo.title.replace('Baby Names', '')}${originLabel} ${genderLabel} Names`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${trait} ${originLabel} ${genderLabel} names`,
    `/names/${gender}/origin/${origin}/characteristic/${trait}`,
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
        description={`Browse our curated collection of ${trait} ${originLabel.toLowerCase()} names perfect for your baby ${gender === 'male' ? 'boy' : 'girl'}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: `${originLabel} Names`, url: `/names/${gender}/origin/${origin}` },
          { name: `${charInfo.title}`, url: `/names/${gender}/characteristic/${trait}` },
          { name: title, url: `/names/${gender}/origin/${origin}/characteristic/${trait}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Why Choose {charInfo.title.replace('Baby Names', '')}from {originLabel}?
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for the perfect {trait} {originLabel.toLowerCase()} name for your {gender === 'male' ? 'son' : 'daughter'}? 
              This unique combination brings together the {trait} qualities you desire with the rich cultural heritage of {originLabel} naming traditions.
            </p>
            <p className="text-gray-600 mb-4">
              {originLabel} names carry deep cultural significance and timeless appeal. When combined with {trait} characteristics, 
              they create names that are both meaningful and distinctive. These names honor {originLabel} heritage while embodying 
              the {trait} qualities that resonate with modern parents.
            </p>
            <p className="text-gray-600">
              {namesList.length > 0 
                ? `We've curated ${namesList.length} ${trait} ${originLabel} ${genderLabel.toLowerCase()} names for you to explore. Each name combines cultural authenticity with the ${trait} appeal you're seeking.`
                : `We're currently expanding our collection of ${trait} ${originLabel} ${genderLabel.toLowerCase()} names. Check back soon or explore our broader collections below!`
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
              We're expanding our {trait} {originLabel} {genderLabel.toLowerCase()} names collection.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Meanwhile, explore these related collections:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={`/names/${gender}/origin/${origin}`}
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                All {originLabel} {genderLabel} Names
              </a>
              <a
                href={`/names/${gender}/characteristic/${trait}`}
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                All {charInfo.title.replace('Baby Names', '')} {genderLabel} Names
              </a>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What makes {originLabel} names {trait}?
              </h3>
              <p className="text-gray-700">
                {originLabel} names become {trait} through their unique sounds, cultural meanings, and the qualities they represent. 
                {origin === 'japanese' && ` Japanese names often embody natural elements and virtues, creating ${trait} combinations.`}
                {origin === 'irish' && ` Irish names carry ancient Celtic heritage with strong character, making them naturally ${trait}.`}
                {origin === 'italian' && ` Italian names have melodic qualities and passionate energy that lend themselves to ${trait} appeal.`}
                {origin === 'english' && ` English names balance tradition with modern sensibility, offering ${trait} options.`}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Are {originLabel} {trait} names popular?
              </h3>
              <p className="text-gray-700">
                {originLabel} names are increasingly popular as parents seek names with cultural depth and distinctive character. 
                The combination of {originLabel} heritage with {trait} qualities creates names that stand out while honoring tradition.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'male' ? 'girl' : 'boy'} names with the same qualities?
              </h3>
              <p className="text-gray-700">
                Yes! Visit our <a href={`/names/${gender === 'male' ? 'female' : 'male'}/origin/${origin}/characteristic/${trait}`} className="text-indigo-600 hover:underline">
                {trait} {originLabel} {gender === 'male' ? 'girl' : 'boy'} names
                </a> page to explore {trait} {originLabel} names for {gender === 'male' ? 'girls' : 'boys'}.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold mb-3">Explore Other {originLabel} Collections</h3>
            <div className="space-y-2">
              <a href={`/names/${gender}/origin/${origin}`} className="block text-indigo-600 hover:underline">
                All {originLabel} {genderLabel} Names →
              </a>
              <a href={`/names/origin/${origin}`} className="block text-indigo-600 hover:underline">
                All {originLabel} Names →
              </a>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-3">More {charInfo.title.replace('Baby Names', '')} Options</h3>
            <div className="space-y-2">
              <a href={`/names/${gender}/characteristic/${trait}`} className="block text-purple-600 hover:underline">
                All {charInfo.title.replace('Baby Names', '')} {genderLabel} Names →
              </a>
              <a href={`/names/characteristic/${trait}`} className="block text-purple-600 hover:underline">
                All {charInfo.title} →
              </a>
            </div>
          </div>
        </div>

        {/* Internal Links */}
        <InternalLinks
          showOrigins={true}
          showMeanings={true}
          showGenders={false}
          limit={8}
        />
      </SEOPageLayout>
    </>
  );
}
