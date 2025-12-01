import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMeaningInfo, getAllMeaningSlugs } from '@/lib/seo/meanings';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateMeaningSchema } from '@/lib/seo/structured-data';
import { GENDER_LABELS } from '@/lib/seo/constants';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female';
    meaning: string;
  }>;
}

// Generate static params for all gender/meaning combinations
export async function generateStaticParams() {
  const meanings = getAllMeaningSlugs();
  const genders: Array<'male' | 'female'> = ['male', 'female'];
  
  const params = [];
  for (const gender of genders) {
    for (const meaning of meanings) {
      params.push({ gender, meaning });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, meaning } = await params;
  const meaningInfo = getMeaningInfo(meaning);

  if (!meaningInfo || !['male', 'female'].includes(gender)) {
    return {
      title: 'Page Not Found',
    };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${meaningInfo.title}`;
  const description = `Discover ${genderLabel.toLowerCase()} baby names that mean ${meaning}. ${meaningInfo.description}`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [`${gender} names meaning ${meaning}`, `${gender} ${meaning} names`, ...meaningInfo.keywords],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/meaning/${meaning}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderMeaningPage({ params }: PageProps) {
  const { gender, meaning } = await params;
  const meaningInfo = getMeaningInfo(meaning);

  if (!meaningInfo || !['male', 'female'].includes(gender)) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch names with this meaning and gender
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', gender)
    .ilike('meaning', `%${meaning}%`)
    .order('popularity_score', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${meaningInfo.title}`;

  // Generate structured data
  const structuredData = generateMeaningSchema(
    title,
    `${genderLabel} baby names that mean ${meaning}`,
    meaning,
    namesList.slice(0, 20)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={title}
        description={`Discover beautiful ${genderLabel.toLowerCase()} baby names that mean ${meaning}. Perfect for parents looking for meaningful ${gender} names.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: 'By Meaning', url: `/names/${gender}` },
          { name: title, url: `/names/${gender}/meaning/${meaning}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for {genderLabel.toLowerCase()} baby names that mean {meaning}? {meaningInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              Choosing a {gender} name with a meaningful significance can add depth and intention to your {gender === 'male' ? 'son' : 'daughter'}'s identity. 
              Names that mean "{meaning}" carry special symbolism and can reflect the values and hopes you have for your little {gender === 'male' ? 'boy' : 'girl'}.
            </p>
            <p className="text-gray-600">
              Below you'll find a curated collection of {namesList.length} beautiful {genderLabel.toLowerCase()} names that mean or relate to "{meaning}". 
              Each name includes its origin and full meaning to help you make the perfect choice.
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {genderLabel} Names Meaning {meaning.charAt(0).toUpperCase() + meaning.slice(1)}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No {genderLabel.toLowerCase()} names found with this meaning. Check out our <a href={`/names/meaning/${meaning}`} className="text-indigo-600 hover:underline">complete list of names meaning {meaning}</a> or use our AI generator to discover more options!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {genderLabel.toLowerCase()} names meaning {meaning}?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${genderLabel.toLowerCase()} names meaning ${meaning} include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and more' : ''}.`
                  : `We're curating a list of beautiful ${genderLabel.toLowerCase()} names meaning ${meaning}. Check back soon!`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What origins do {genderLabel.toLowerCase()} names meaning {meaning} come from?
              </h3>
              <p className="text-gray-700">
                {genderLabel} names with this meaning can be found across many cultures including Greek, Latin, Hebrew, Irish, 
                Spanish, Arabic, and more. Each brings its own unique history and significance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                How do I choose the right {genderLabel.toLowerCase()} name meaning {meaning}?
              </h3>
              <p className="text-gray-700">
                Consider the name's origin, pronunciation, how it sounds with your surname, potential nicknames, 
                and any family or cultural significance. Our AI Baby Namer tool can help you discover personalized {genderLabel.toLowerCase()} name suggestions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'male' ? 'girl' : 'boy'} names meaning {meaning} too?
              </h3>
              <p className="text-gray-700">
                Yes! We have collections for both boy and girl names. Check out our <a href={`/names/${gender === 'male' ? 'female' : 'male'}/meaning/${meaning}`} className="text-indigo-600 hover:underline">{gender === 'male' ? 'girl' : 'boy'} names meaning {meaning}</a> or view <a href={`/names/meaning/${meaning}`} className="text-indigo-600 hover:underline">all names meaning {meaning}</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Navigation Links */}
        <InternalLinks
          currentPage={{ type: 'meaning', value: meaning }}
          showOrigins={true}
          showMeanings={true}
          showGenders={true}
          limit={8}
        />

        {/* Cross-Gender Link */}
        <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold mb-2">
            Looking for {gender === 'male' ? 'Girl' : 'Boy'} Names?
          </h3>
          <p className="text-gray-700 mb-3">
            Browse our collection of {gender === 'male' ? 'female' : 'male'} names meaning {meaning}.
          </p>
          <a 
            href={`/names/${gender === 'male' ? 'female' : 'male'}/meaning/${meaning}`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View {gender === 'male' ? 'Girl' : 'Boy'} Names Meaning {meaning.charAt(0).toUpperCase() + meaning.slice(1)}
          </a>
        </div>
      </SEOPageLayout>
    </>
  );
}
