import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ORIGINS, ORIGIN_LABELS, MEANINGS, MEANING_LABELS, MEANING_DESCRIPTIONS, VALID_URL_GENDERS, GENDER_LABELS, GENDER_DB_MAP } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female' | 'unisex';
    origin: string;
    meaning: string;
  }>;
}

// Generate static params for all gender/origin/meaning combinations (252 pages)
export async function generateStaticParams() {
  const params = [];
  for (const gender of VALID_URL_GENDERS) {
    for (const origin of ORIGINS) {
      for (const meaning of MEANINGS) {
        params.push({ gender, origin, meaning });
      }
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, origin, meaning } = await params;
  const originLabel = ORIGIN_LABELS[origin];
  const meaningLabel = MEANING_LABELS[meaning];
  const genderLabel = GENDER_LABELS[gender];

  if (!originLabel || !meaningLabel || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    return { title: 'Page Not Found' };
  }

  const title = `${originLabel} ${genderLabel} Names Meaning ${meaningLabel}`;
  const description = `Discover ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names that mean ${meaning}. Find the perfect ${origin} baby name with ${meaning}-related meanings for your ${gender === 'male' ? 'son' : gender === 'female' ? 'daughter' : 'child'}.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${origin} names meaning ${meaning}`,
      `${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names meaning ${meaning}`,
      `${origin} baby names about ${meaning}`,
      `${meaningLabel.toLowerCase()} ${origin} names`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/origin/${origin}/meaning/${meaning}`,
    },
  };
}

export default async function GenderOriginMeaningPage({ params }: PageProps) {
  const { gender, origin, meaning } = await params;
  const originLabel = ORIGIN_LABELS[origin];
  const meaningLabel = MEANING_LABELS[meaning];
  const meaningDesc = MEANING_DESCRIPTIONS[meaning];
  const genderLabel = GENDER_LABELS[gender];

  if (!originLabel || !meaningLabel || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    notFound();
  }

  const supabase = await createClient();
  const dbGender = GENDER_DB_MAP[gender];

  // Query names with this gender, origin, and meaning category
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', dbGender)
    .eq('origin', origin)
    .eq('meaning_category', meaning)
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const title = `${originLabel} ${genderLabel} Names Meaning ${meaningLabel}`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${originLabel} ${genderLabel.toLowerCase()} names with ${meaning} meanings`,
    `/names/${gender}/origin/${origin}/meaning/${meaning}`,
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
        description={`Find ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names meaning ${meaning}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: `${originLabel} Names`, url: `/names/${gender}/origin/${origin}` },
          { name: `${meaningLabel} Names`, url: `/names/${gender}/meaning/${meaning}` },
          { name: title, url: `/names/${gender}/origin/${origin}/meaning/${meaning}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {originLabel} {genderLabel} Names Meaning {meaningLabel}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for {originLabel.toLowerCase()} names that embody {meaning} for your {gender === 'male' ? 'baby boy' : gender === 'female' ? 'baby girl' : 'child'}?
              This unique combination brings together the rich cultural heritage of {originLabel} naming traditions 
              with meaningful names that represent {meaning}.
            </p>
            <p className="text-gray-600 mb-4">
              {meaningDesc} When combined with {originLabel.toLowerCase()} origins, these names carry 
              both cultural significance and profound meaning.
            </p>
            <p className="text-gray-600">
              {namesList.length > 0 
                ? `We've curated ${namesList.length} ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names meaning ${meaning}. Each name combines cultural authenticity with deep, meaningful significance.`
                : `We're expanding our collection of ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names meaning ${meaning}. Explore our related collections below!`
              }
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All {title}</h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg mb-12">
            <p className="text-gray-600 mb-4 text-lg">
              We're building our {originLabel.toLowerCase()} {genderLabel.toLowerCase()} {meaning} names collection.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`/names/${gender}/origin/${origin}`} className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                All {originLabel} {genderLabel} Names
              </a>
              <a href={`/names/${gender}/meaning/${meaning}`} className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                All {meaningLabel} {genderLabel} Names
              </a>
            </div>
          </div>
        )}

        {/* Browse Other Meanings for This Origin */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Other {originLabel} {genderLabel} Name Meanings</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MEANINGS.filter(m => m !== meaning).map(m => (
              <a
                key={m}
                href={`/names/${gender}/origin/${origin}/meaning/${m}`}
                className="p-4 bg-gray-100 rounded-lg text-center hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                <span className="font-semibold">{MEANING_LABELS[m]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Browse Other Origins for This Meaning */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Other Origins with {meaningLabel} {genderLabel} Names</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ORIGINS.filter(o => o !== origin).slice(0, 8).map(o => (
              <a
                key={o}
                href={`/names/${gender}/origin/${o}/meaning/${meaning}`}
                className="p-3 bg-gray-100 rounded-lg text-center hover:bg-purple-100 hover:text-purple-700 transition-colors text-sm"
              >
                <span className="font-semibold">{ORIGIN_LABELS[o]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What makes {originLabel.toLowerCase()} {meaning} names special?
              </h3>
              <p className="text-gray-700">
                {originLabel} names that embody {meaning} combine rich cultural heritage with profound significance. 
                These names carry the weight of {originLabel.toLowerCase()} tradition while expressing the timeless 
                quality of {meaning} that parents cherish.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'male' ? 'girl' : 'boy'} names with this combination?
              </h3>
              <p className="text-gray-700">
                Yes! Visit our <a href={`/names/${gender === 'male' ? 'female' : 'male'}/origin/${origin}/meaning/${meaning}`} className="text-indigo-600 hover:underline">
                {originLabel} {gender === 'male' ? 'girl' : 'boy'} names meaning {meaning}
                </a> page to explore options for {gender === 'male' ? 'girls' : 'boys'}.
              </p>
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
