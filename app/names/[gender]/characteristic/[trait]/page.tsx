import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCharacteristicInfo, getAllCharacteristicSlugs, getRelatedCharacteristics } from '@/lib/seo/characteristics';
import { GENDER_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female';
    trait: string;
  }>;
}

// Generate static params for all gender/characteristic combinations
export async function generateStaticParams() {
  const traits = getAllCharacteristicSlugs();
  const genders: Array<'male' | 'female'> = ['male', 'female'];
  
  const params = [];
  for (const gender of genders) {
    for (const trait of traits) {
      params.push({ gender, trait });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);

  if (!charInfo || !['male', 'female'].includes(gender)) {
    return {
      title: 'Page Not Found',
    };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${charInfo.title}`;
  const description = `Discover ${genderLabel.toLowerCase()} ${charInfo.title.toLowerCase()}. ${charInfo.description}`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [`${gender} ${trait} names`, ...charInfo.keywords],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/characteristic/${trait}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderCharacteristicPage({ params }: PageProps) {
  const { gender, trait } = await params;
  const charInfo = getCharacteristicInfo(trait);

  if (!charInfo || !['male', 'female'].includes(gender)) {
    notFound();
  }

  const supabase = await createClient();

  // Query names with this gender and characteristic
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('gender', gender)
    .contains('characteristics', [trait])
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${charInfo.title}`;
  const relatedChars = getRelatedCharacteristics(trait);

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${genderLabel} baby names that are ${trait}`,
    `/names/${gender}/characteristic/${trait}`,
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
        description={`Find ${genderLabel.toLowerCase()} ${charInfo.title.toLowerCase()}. Perfect for your baby ${gender === 'male' ? 'boy' : 'girl'}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: 'By Characteristic', url: `/names/${gender}` },
          { name: title, url: `/names/${gender}/characteristic/${trait}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for {genderLabel.toLowerCase()} baby names that are {trait}? {charInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              These {trait} {genderLabel.toLowerCase()} names are perfect for parents seeking 
              {trait === 'unique' && ' distinctive, one-of-a-kind names that will help your son stand out'}
              {trait === 'cool' && ' stylish, confident names with modern edge and charisma'}
              {trait === 'cute' && ' adorable, sweet names that match your little one\'s precious personality'}
              {trait === 'classic' && ' timeless, traditional names with enduring appeal'}
              {trait === 'strong' && ' powerful names conveying confidence and resilience'}
              {trait === 'beautiful' && ' gorgeous names with aesthetic appeal and lovely sound'}
              {trait === 'vintage' && ' charming names from bygone eras making a stylish comeback'}
              {trait === 'modern' && ' fresh, contemporary names that feel current and relevant'}
              {trait === 'elegant' && ' sophisticated names with refined grace and timeless beauty'}
              {trait === 'rare' && ' exceptionally uncommon names that offer true originality'}
              . Each name combines the {trait} quality you're seeking with the perfect {gender === 'male' ? 'masculine' : 'feminine'} appeal.
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {trait} {genderLabel.toLowerCase()} names from various origins. 
              Each name is curated for its {trait} qualities to help you find the perfect name for your {gender === 'male' ? 'son' : 'daughter'}.
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
            <p className="text-gray-600 mb-4">
              We're currently curating our collection of {trait} {genderLabel.toLowerCase()} names. Check back soon!
            </p>
            <p className="text-sm text-gray-500">
              Meanwhile, try our <a href={`/names/characteristic/${trait}`} className="text-indigo-600 hover:underline">complete {trait} names list</a> or use our AI generator!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {trait} {gender} names?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${trait} ${gender} names include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and many more' : ''}.`
                  : `Browse our curated collection to discover trending ${trait} ${gender} names.`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Why choose a {trait} name for my {gender === 'male' ? 'son' : 'daughter'}?
              </h3>
              <p className="text-gray-700">
                {trait} names help define your child's identity and first impression. 
                They reflect the qualities you hope to see in your {gender === 'male' ? 'son' : 'daughter'} 
                and create a lasting impression throughout their life.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I find {gender === 'male' ? 'girl' : 'boy'} names that are {trait} too?
              </h3>
              <p className="text-gray-700">
                Yes! Visit our <a href={`/names/${gender === 'male' ? 'female' : 'male'}/characteristic/${trait}`} className="text-indigo-600 hover:underline">
                {gender === 'male' ? 'girl' : 'boy'} names that are {trait}
                </a> page to explore {trait} names for {gender === 'male' ? 'girls' : 'boys'}.
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

        {/* Related Characteristics */}
        {relatedChars.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold mb-3">
              Similar {genderLabel} Name Characteristics
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If you like {trait} {genderLabel.toLowerCase()} names, explore:
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedChars.map(relChar => (
                <a
                  key={relChar.slug}
                  href={`/names/${gender}/characteristic/${relChar.slug}`}
                  className="inline-block bg-white px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-100 transition-colors"
                >
                  {genderLabel} {relChar.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </SEOPageLayout>
    </>
  );
}
