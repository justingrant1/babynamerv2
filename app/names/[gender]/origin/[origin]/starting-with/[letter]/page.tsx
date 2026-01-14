import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ORIGINS, LETTERS, GENDER_LABELS, GENDER_DB_MAP, ORIGIN_LABELS, VALID_URL_GENDERS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female' | 'unisex';
    origin: string;
    letter: string;
  }>;
}

// Generate static params for all gender/origin/letter combinations (1,092 pages)
export async function generateStaticParams() {
  const params = [];
  for (const gender of VALID_URL_GENDERS) {
    for (const origin of ORIGINS) {
      for (const letter of LETTERS) {
        params.push({ gender, origin, letter });
      }
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, origin, letter } = await params;
  const originLabel = ORIGIN_LABELS[origin];
  const letterUpper = letter.toUpperCase();

  if (!originLabel || !LETTERS.includes(letter as typeof LETTERS[number]) || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    return { title: 'Page Not Found' };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${originLabel} ${genderLabel} Names Starting with ${letterUpper}`;
  const description = `Discover beautiful ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names that start with the letter ${letterUpper}. Find the perfect ${origin} baby name beginning with ${letterUpper} for your ${gender === 'male' ? 'son' : gender === 'female' ? 'daughter' : 'child'}.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${origin} ${gender} names starting with ${letter}`,
      `${origin} names starting with ${letterUpper}`,
      `${genderLabel.toLowerCase()} names starting with ${letterUpper}`,
      `${originLabel} baby names ${letterUpper}`,
      `${letterUpper} names ${origin}`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/origin/${origin}/starting-with/${letter}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderOriginLetterPage({ params }: PageProps) {
  const { gender, origin, letter } = await params;
  const originLabel = ORIGIN_LABELS[origin];
  const letterUpper = letter.toUpperCase();

  if (!originLabel || !LETTERS.includes(letter as typeof LETTERS[number]) || !VALID_URL_GENDERS.includes(gender as typeof VALID_URL_GENDERS[number])) {
    notFound();
  }

  const supabase = await createClient();
  const dbGender = GENDER_DB_MAP[gender];

  // Query names with this gender, origin, and starting letter
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', dbGender)
    .eq('origin', origin)
    .ilike('name', `${letter}%`)
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const genderLabel = GENDER_LABELS[gender];
  const title = `${originLabel} ${genderLabel} Names Starting with ${letterUpper}`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${originLabel} ${genderLabel.toLowerCase()} names that start with ${letterUpper}`,
    `/names/${gender}/origin/${origin}/starting-with/${letter}`,
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
        description={`Find the perfect ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} name starting with ${letterUpper}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: `${originLabel} Names`, url: `/names/${gender}/origin/${origin}` },
          { name: `Starting with ${letterUpper}`, url: `/names/${gender}/origin/${origin}/starting-with/${letter}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {originLabel} {genderLabel} Names Starting with {letterUpper}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for the perfect {originLabel.toLowerCase()} name that begins with {letterUpper} for your {gender === 'male' ? 'baby boy' : gender === 'female' ? 'baby girl' : 'child'}? 
              You've come to the right place! {originLabel} names carry a rich cultural heritage and when combined with 
              the distinctive sound of the letter {letterUpper}, they create truly memorable options.
            </p>
            <p className="text-gray-600 mb-4">
              Names starting with {letterUpper} have a unique {letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u' ? 'melodic vowel sound' : 'strong consonant sound'} that 
              pairs beautifully with {originLabel.toLowerCase()} naming traditions. Whether you're honoring your heritage 
              or simply love the sound of {originLabel.toLowerCase()} names, these {letterUpper}-names offer wonderful choices.
            </p>
            <p className="text-gray-600">
              {namesList.length > 0 
                ? `We've found ${namesList.length} ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names starting with ${letterUpper}. Browse our curated collection below to find the perfect name.`
                : `We're expanding our collection of ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names starting with ${letterUpper}. Explore our related collections below!`
              }
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {originLabel} {genderLabel} Names Starting with {letterUpper}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg mb-12">
            <p className="text-gray-600 mb-4 text-lg">
              No {originLabel.toLowerCase()} {genderLabel.toLowerCase()} names starting with {letterUpper} found yet.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Try exploring these related collections:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={`/names/${gender}/origin/${origin}`}
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                All {originLabel} {genderLabel} Names
              </a>
              <a
                href={`/names/${gender}/starting-with/${letter}`}
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                All {genderLabel} Names Starting with {letterUpper}
              </a>
            </div>
          </div>
        )}

        {/* Browse Other Letters in This Origin */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Browse Other Letters in {originLabel} {genderLabel} Names
          </h2>
          <div className="flex flex-wrap gap-2">
            {LETTERS.map((l) => (
              <a
                key={l}
                href={`/names/${gender}/origin/${origin}/starting-with/${l}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                  l === letter 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
              >
                {l.toUpperCase()}
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
                Why choose a {originLabel.toLowerCase()} name starting with {letterUpper}?
              </h3>
              <p className="text-gray-700">
                {originLabel} names beginning with {letterUpper} offer a beautiful combination of cultural heritage 
                and distinctive sound. The letter {letterUpper} gives names a {letter === 's' || letter === 'z' ? 'soft, flowing' : letter === 'k' || letter === 'c' ? 'strong, commanding' : 'unique'} quality 
                that pairs wonderfully with {originLabel.toLowerCase()} naming traditions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {originLabel.toLowerCase()} {genderLabel.toLowerCase()} names starting with {letterUpper}?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Some of the most beloved ${originLabel.toLowerCase()} ${genderLabel.toLowerCase()} names starting with ${letterUpper} include ${namesList.slice(0, 3).map(n => n.name).join(', ')}${namesList.length > 3 ? ', and more' : ''}.`
                  : `While we're still expanding our collection, ${originLabel} names starting with ${letterUpper} are known for their elegance and cultural depth.`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'male' ? 'girl' : 'boy'} names with the same combination?
              </h3>
              <p className="text-gray-700">
                Yes! Visit our <a href={`/names/${gender === 'male' ? 'female' : 'male'}/origin/${origin}/starting-with/${letter}`} className="text-indigo-600 hover:underline">
                {originLabel} {gender === 'male' ? 'girl' : 'boy'} names starting with {letterUpper}
                </a> page to explore options for {gender === 'male' ? 'girls' : 'boys'}.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold mb-3">More {originLabel} Names</h3>
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
            <h3 className="text-lg font-semibold mb-3">More Names Starting with {letterUpper}</h3>
            <div className="space-y-2">
              <a href={`/names/${gender}/starting-with/${letter}`} className="block text-purple-600 hover:underline">
                All {genderLabel} Names with {letterUpper} →
              </a>
              <a href={`/names/starting-with/${letter}`} className="block text-purple-600 hover:underline">
                All Names Starting with {letterUpper} →
              </a>
            </div>
          </div>
        </div>

        {/* Internal Links */}
        <InternalLinks
          showOrigins={true}
          showLetters={true}
          showGenders={false}
          limit={8}
        />
      </SEOPageLayout>
    </>
  );
}
