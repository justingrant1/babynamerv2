import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSyllableInfo, getAllSyllableCounts } from '@/lib/seo/syllables';
import { GENDER_LABELS, GENDER_DB_MAP } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'boy' | 'girl' | 'unisex';
    count: string;
  }>;
}

// Generate static params for all gender/syllable combinations
export async function generateStaticParams() {
  const counts = getAllSyllableCounts();
  const genders: Array<'boy' | 'girl' | 'unisex'> = ['boy', 'girl', 'unisex'];
  
  const params = [];
  for (const gender of genders) {
    for (const count of counts) {
      params.push({ gender, count });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, count } = await params;
  const syllableInfo = getSyllableInfo(count);

  if (!syllableInfo || !['boy', 'girl', 'unisex'].includes(gender)) {
    return {
      title: 'Page Not Found',
    };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${syllableInfo.title}`;
  const description = `Discover ${genderLabel.toLowerCase()} baby names with ${count} syllable${count !== '1' ? 's' : ''}. ${syllableInfo.description}`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [`${gender} ${count} syllable names`, ...syllableInfo.keywords],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/syllables/${count}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderSyllablePage({ params }: PageProps) {
  const { gender, count } = await params;
  const syllableInfo = getSyllableInfo(count);

  if (!syllableInfo || !['boy', 'girl', 'unisex'].includes(gender)) {
    notFound();
  }

  const supabase = await createClient();
  
  // Map URL gender to database gender
  const dbGender = GENDER_DB_MAP[gender];

  // Fetch names with this gender and syllable count
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', dbGender)
    .eq('syllable_count', parseInt(count))
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${syllableInfo.title}`;
  const syllableWord = count === '1' ? 'one' : count === '2' ? 'two' : count === '3' ? 'three' : 'four';

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${genderLabel} baby names with ${count} syllable${count !== '1' ? 's' : ''}`,
    `/names/${gender}/syllables/${count}`,
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
        description={`Find beautiful ${genderLabel.toLowerCase()} baby names with ${count} syllable${count !== '1' ? 's' : ''}. Perfect for your baby ${gender === 'boy' ? 'boy' : gender === 'girl' ? 'girl' : 'child'}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: 'By Syllables', url: `/names/${gender}` },
          { name: title, url: `/names/${gender}/syllables/${count}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for {genderLabel.toLowerCase()} baby names with {count} syllable{count !== '1' ? 's' : ''}? {syllableInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              {count === '1' && `One syllable ${gender} names are strong and memorable. Perfect for ${gender === 'boy' ? 'boys' : gender === 'girl' ? 'girls' : 'children'} and work especially well with longer surnames.`}
              {count === '2' && `Two syllable ${gender} names strike the perfect balance. These ${genderLabel.toLowerCase()} names are versatile and work beautifully with most surnames.`}
              {count === '3' && `Three syllable ${gender} names have an elegant flow. These ${genderLabel.toLowerCase()} names sound sophisticated and distinguished.`}
              {count === '4' && `Four syllable ${gender} names are distinctive and memorable. These longer ${genderLabel.toLowerCase()} names often have rich cultural significance.`}
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {syllableWord}-syllable {genderLabel.toLowerCase()} names from various origins. 
              Each name is carefully selected to help you find the perfect {count}-syllable name for your {gender === 'boy' ? 'son' : gender === 'girl' ? 'daughter' : 'child'}.
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
          <div className="text-center py-12">
            <p className="text-gray-600">
              No {genderLabel.toLowerCase()} names found with {count} syllable{count !== '1' ? 's' : ''}. Check out our <a href={`/names/syllables/${count}`} className="text-indigo-600 hover:underline">complete list</a> or use our AI generator!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {syllableWord}-syllable {gender} names?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${syllableWord}-syllable ${gender} names include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and more' : ''}.`
                  : `We're curating a beautiful list of ${syllableWord}-syllable ${gender} names.`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'boy' ? 'girl' : 'boy'} names with {count} syllable{count !== '1' ? 's' : ''} too?
              </h3>
              <p className="text-gray-700">
                Yes! Visit our <a href={`/names/${gender === 'boy' ? 'girl' : 'boy'}/syllables/${count}`} className="text-indigo-600 hover:underline">{gender === 'boy' ? 'girl' : 'boy'} names with {count} syllable{count !== '1' ? 's' : ''}</a> page.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Navigation */}
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
