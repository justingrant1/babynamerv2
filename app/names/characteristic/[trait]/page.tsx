import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCharacteristicInfo, getAllCharacteristicSlugs, getRelatedCharacteristics } from '@/lib/seo/characteristics';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    trait: string;
  }>;
}

// Generate static params for all characteristics
export async function generateStaticParams() {
  const traits = getAllCharacteristicSlugs();
  return traits.map((trait) => ({
    trait,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trait } = await params;
  const charInfo = getCharacteristicInfo(trait);

  if (!charInfo) {
    return {
      title: 'Characteristic Not Found',
    };
  }

  return {
    title: `${charInfo.title} - AI Baby Namer`,
    description: charInfo.description,
    keywords: charInfo.keywords.join(', '),
    openGraph: {
      title: charInfo.title,
      description: charInfo.description,
      type: 'website',
      url: `https://aibabynamer.com/names/characteristic/${trait}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: charInfo.title,
      description: charInfo.description,
    },
  };
}

export default async function CharacteristicPage({ params }: PageProps) {
  const { trait } = await params;
  const charInfo = getCharacteristicInfo(trait);

  if (!charInfo) {
    notFound();
  }

  const supabase = await createClient();

  // Query names that have this characteristic
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .contains('characteristics', [trait])
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const relatedChars = getRelatedCharacteristics(trait);

  // Generate structured data
  const structuredData = generateCollectionPage(
    charInfo.title,
    charInfo.description,
    `/names/characteristic/${trait}`,
    namesList.length
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={charInfo.title}
        description={charInfo.description}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: 'By Characteristic', url: '/names' },
          { name: charInfo.title, url: `/names/characteristic/${trait}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {charInfo.title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              {charInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              {trait === 'unique' && 'Parents choosing unique names want their child to stand out with a distinctive identity. These names are rare, uncommon, and won\'t be shared by multiple classmates. Perfect for families valuing individuality and originality.'}
              {trait === 'cool' && 'Cool names have an effortless style and modern edge. They sound confident and charismatic, perfect for parents who want a name with personality and flair that feels current and stylish.'}
              {trait === 'cute' && 'Cute names are adorable and endearing, perfect for your precious little one. These names have a sweet, charming quality that matches your baby\'s lovable personality.'}
              {trait === 'classic' && 'Classic names have stood the test of time. These traditional names carry rich history and never go out of style, offering timeless elegance that works across generations.'}
              {trait === 'strong' && 'Strong names convey power, confidence, and resilience. Perfect for parents who want their child\'s name to embody courage, determination, and an unshakeable spirit.'}
              {trait === 'beautiful' && 'Beautiful names have aesthetic appeal and sound lovely when spoken. These gorgeous names are as pleasing to the ear as they are meaningful.'}
              {trait === 'vintage' && 'Vintage names carry charm from bygone eras. These classic names are making a stylish comeback, offering nostalgic appeal with timeless sophistication.'}
              {trait === 'modern' && 'Modern names feel fresh and contemporary. These current names reflect today\'s world with a stylish, up-to-date sensibility that feels relevant and new.'}
              {trait === 'elegant' && 'Elegant names exude sophistication and refined grace. These classy names have a timeless beauty that speaks to taste and distinction.'}
              {trait === 'rare' && 'Rare names are exceptionally uncommon. These distinctive gems offer true originality for parents seeking names that stand apart from the crowd.'}
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {trait} baby names from various origins and cultures. 
              Each name is curated for its {trait} qualities to help you find the perfect name for your little one.
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {charInfo.title}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              We're currently curating our collection of {trait} names. Check back soon!
            </p>
            <p className="text-sm text-gray-500">
              In the meantime, try our AI name generator to discover {trait} names personalized for your preferences.
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What makes a baby name "{trait}"?
              </h3>
              <p className="text-gray-700">
                {trait === 'unique' && 'Unique names are distinctive and uncommon, rarely heard in everyday life. They stand out without being difficult to pronounce or spell.'}
                {trait === 'cool' && 'Cool names have a modern, confident vibe with effortless style. They sound trendy without being overly trendy, and have a certain charisma.'}
                {trait === 'cute' && 'Cute names sound sweet and endearing, often with soft sounds or diminutive endings. They\'re charming and match a baby\'s adorable personality.'}
                {trait === 'classic' && 'Classic names have proven staying power across decades or centuries. They feel traditional, timeless, and never go out of style.'}
                {trait === 'strong' && 'Strong names convey power through their sound and meaning. They often have bold consonants and confident syllable structure.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Are there {trait} names for both boys and girls?
              </h3>
              <p className="text-gray-700">
                Yes! We have extensive collections of {trait} names for boys, girls, and unisex options. 
                Filter by gender to find the perfect {trait} name for your baby.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {trait} baby names right now?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${trait} names include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and many more' : ''}.`
                  : `Browse our curated collection to discover trending ${trait} names that parents love.`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                How do I choose the right {trait} name?
              </h3>
              <p className="text-gray-700">
                Consider how the name sounds with your surname, its meaning, cultural significance, and how it might age with your child. 
                Say it out loud, write it down, and imagine using it in various situations to ensure it feels right.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Navigation Links */}
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
              Similar Characteristics
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If you like {trait} names, you might also love:
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedChars.map(relChar => (
                <a
                  key={relChar.slug}
                  href={`/names/characteristic/${relChar.slug}`}
                  className="inline-block bg-white px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-100 transition-colors"
                >
                  {relChar.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </SEOPageLayout>
    </>
  );
}
