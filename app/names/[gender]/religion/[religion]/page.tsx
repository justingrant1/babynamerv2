import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RELIGIONS, RELIGION_LABELS, RELIGION_DESCRIPTIONS, VALID_URL_GENDERS, GENDER_LABELS, GENDER_DB_MAP } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female' | 'unisex';
    religion: string;
  }>;
}

// Generate static params for all gender/religion combinations (15 pages)
export async function generateStaticParams() {
  const params = [];
  for (const gender of VALID_URL_GENDERS) {
    for (const religion of RELIGIONS) {
      params.push({ gender, religion });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, religion } = await params;
  const religionLabel = RELIGION_LABELS[religion];
  const genderLabel = GENDER_LABELS[gender];

  if (!religionLabel || !RELIGIONS.includes(religion as typeof RELIGIONS[number]) || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    return { title: 'Page Not Found' };
  }

  const title = `${religionLabel} ${genderLabel} Names`;
  const description = `Discover beautiful ${religionLabel.toLowerCase()} ${genderLabel.toLowerCase()} names with spiritual meaning. Find the perfect ${religion === 'christian' ? 'biblical' : religionLabel.toLowerCase()} name for your ${gender === 'male' ? 'son' : gender === 'female' ? 'daughter' : 'child'}.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${religion} ${gender} names`,
      `${religionLabel.toLowerCase()} ${genderLabel.toLowerCase()} names`,
      religion === 'christian' ? `biblical ${genderLabel.toLowerCase()} names` : `${religion} names for ${genderLabel.toLowerCase()}s`,
      `${genderLabel.toLowerCase()} ${religionLabel.toLowerCase()} baby names`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/religion/${religion}`,
    },
  };
}

export default async function GenderReligionPage({ params }: PageProps) {
  const { gender, religion } = await params;
  const religionLabel = RELIGION_LABELS[religion];
  const genderLabel = GENDER_LABELS[gender];

  if (!religionLabel || !RELIGIONS.includes(religion as typeof RELIGIONS[number]) || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    notFound();
  }

  const supabase = await createClient();
  const dbGender = GENDER_DB_MAP[gender];

  // Query names that match this gender and religion
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', dbGender)
    .or(`religious_significance.eq.${religion},characteristics.cs.{${religion}}`)
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const title = `${religionLabel} ${genderLabel} Names`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${religionLabel} ${genderLabel.toLowerCase()} baby names`,
    `/names/${gender}/religion/${religion}`,
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
        description={`Find the perfect ${religionLabel.toLowerCase()} name for your ${gender === 'male' ? 'baby boy' : gender === 'female' ? 'baby girl' : 'child'}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: `${religionLabel} Names`, url: `/names/religion/${religion}` },
          { name: title, url: `/names/${gender}/religion/${religion}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {religionLabel} {genderLabel} Names
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for a {religionLabel.toLowerCase()} name for your {gender === 'male' ? 'son' : gender === 'female' ? 'daughter' : 'child'}?
              {religion === 'christian' && ' Biblical names carry deep spiritual meaning and connect your child to centuries of Christian faith.'}
              {religion === 'jewish' && ' Hebrew names honor Jewish tradition and the rich heritage of the Jewish people.'}
              {religion === 'islamic' && ' Muslim names from the Quran carry beautiful meanings and spiritual significance.'}
              {religion === 'hindu' && ' Sanskrit names from Hindu tradition offer profound spiritual meanings.'}
              {religion === 'buddhist' && ' Buddhist-inspired names reflect principles of enlightenment and compassion.'}
            </p>
            <p className="text-gray-600">
              {namesList.length > 0 
                ? `We've curated ${namesList.length} ${religionLabel.toLowerCase()} ${genderLabel.toLowerCase()} names for you to explore.`
                : `We're building our collection of ${religionLabel.toLowerCase()} ${genderLabel.toLowerCase()} names.`
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
              Our {religionLabel.toLowerCase()} {genderLabel.toLowerCase()} names collection is coming soon!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`/names/religion/${religion}`} className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                All {religionLabel} Names
              </a>
              <a href={`/names/${gender}`} className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                All {genderLabel} Names
              </a>
            </div>
          </div>
        )}

        {/* Browse Other Genders */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse {religionLabel} Names by Gender</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALID_URL_GENDERS.map(g => (
              <a
                key={g}
                href={`/names/${g}/religion/${religion}`}
                className={`p-4 rounded-lg text-center transition-colors ${g === gender ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700'}`}
              >
                <span className="font-semibold">{GENDER_LABELS[g]} Names</span>
              </a>
            ))}
          </div>
        </div>

        {/* Browse Other Religions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Other Religious {genderLabel} Names</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {RELIGIONS.filter(r => r !== religion).map(r => (
              <a
                key={r}
                href={`/names/${gender}/religion/${r}`}
                className="p-4 bg-gray-100 rounded-lg text-center hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                <span className="font-semibold">{RELIGION_LABELS[r]}</span>
              </a>
            ))}
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
