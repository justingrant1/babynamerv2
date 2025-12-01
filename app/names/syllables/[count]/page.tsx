import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSyllableInfo, getAllSyllableCounts } from '@/lib/seo/syllables';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    count: string;
  }>;
}

// Generate static params for all syllable counts
export async function generateStaticParams() {
  const counts = getAllSyllableCounts();
  return counts.map((count) => ({
    count,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { count } = await params;
  const syllableInfo = getSyllableInfo(count);

  if (!syllableInfo) {
    return {
      title: 'Syllable Count Not Found',
    };
  }

  return {
    title: `${syllableInfo.title} - AI Baby Namer`,
    description: syllableInfo.description,
    keywords: syllableInfo.keywords.join(', '),
    openGraph: {
      title: syllableInfo.title,
      description: syllableInfo.description,
      type: 'website',
      url: `https://aibabynamer.com/names/syllables/${count}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: syllableInfo.title,
      description: syllableInfo.description,
    },
  };
}

export default async function SyllablePage({ params }: PageProps) {
  const { count } = await params;
  const syllableInfo = getSyllableInfo(count);

  if (!syllableInfo) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch names with this syllable count
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .eq('syllable_count', parseInt(count))
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];

  // Generate structured data
  const structuredData = generateCollectionPage(
    syllableInfo.title,
    syllableInfo.description,
    `/names/syllables/${count}`,
    namesList.length
  );

  const syllableWord = count === '1' ? 'one' : count === '2' ? 'two' : count === '3' ? 'three' : 'four';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={syllableInfo.title}
        description={syllableInfo.description}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: 'By Syllables', url: '/names' },
          { name: syllableInfo.title, url: `/names/syllables/${count}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {syllableInfo.title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              {syllableInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              {count === '1' && 'One syllable names are short, punchy, and memorable. They work well with longer surnames and are easy for young children to pronounce and spell.'}
              {count === '2' && 'Two syllable names strike the perfect balance between brevity and elegance. They\'re versatile, easy to say, and work well with most surnames.'}
              {count === '3' && 'Three syllable names have a beautiful flowing rhythm and sophisticated sound. They often feel more formal and distinguished while remaining accessible.'}
              {count === '4' && 'Four syllable names are distinctive and memorable. These longer names often have rich histories and elegant pronunciations that make them stand out.'}
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {syllableWord}-syllable baby names from various origins and cultures. 
              Each name is carefully curated to help you find the perfect {count}-syllable name for your little one.
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {syllableInfo.title}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Loading names... If you don't see any names, please ensure the database migration has been run.
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are popular {syllableWord}-syllable baby names?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${syllableWord}-syllable names include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and many more' : ''}.`
                  : `We're curating a list of beautiful ${syllableWord}-syllable names. Check back soon!`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Why choose a {syllableWord}-syllable name?
              </h3>
              <p className="text-gray-700">
                {count === '1' && 'One-syllable names are strong and memorable. They pair well with longer surnames and are easy to pronounce, making them a practical choice for many families.'}
                {count === '2' && 'Two-syllable names offer the ideal balance of simplicity and substance. They\'re versatile, work with most surnames, and are the most common name length.'}
                {count === '3' && 'Three-syllable names have a melodic quality and elegant flow. They sound sophisticated and are often associated with classic, timeless appeal.'}
                {count === '4' && 'Four-syllable names are distinctive and memorable. They often carry rich cultural heritage and create a strong, impressive impression.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do {syllableWord}-syllable names work with all surnames?
              </h3>
              <p className="text-gray-700">
                {count === '1' && 'One-syllable names pair especially well with longer surnames, creating nice balance. They may feel too brief with very short surnames.'}
                {count === '2' && 'Two-syllable names are highly versatile and work well with surnames of any length, making them a safe and popular choice.'}
                {count === '3' && 'Three-syllable names work beautifully with short to medium-length surnames. Consider the overall rhythm when pairing with longer surnames.'}
                {count === '4' && 'Four-syllable names pair best with shorter surnames (1-2 syllables) to maintain good balance and avoid names that feel too long.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Are there both boy and girl {syllableWord}-syllable names?
              </h3>
              <p className="text-gray-700">
                Yes! We have a diverse collection of {syllableWord}-syllable names for boys, girls, and unisex options. 
                Browse by gender to find the perfect {count}-syllable name for your baby.
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

        {/* Other Syllable Counts */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-3">
            Explore Other Syllable Counts
          </h3>
          <div className="flex flex-wrap gap-3">
            {getAllSyllableCounts().filter(c => c !== count).map(otherCount => {
              const info = getSyllableInfo(otherCount);
              return info ? (
                <a
                  key={otherCount}
                  href={`/names/syllables/${otherCount}`}
                  className="inline-block bg-white px-4 py-2 rounded-lg border border-purple-300 hover:bg-purple-100 transition-colors"
                >
                  {info.title}
                </a>
              ) : null;
            })}
          </div>
        </div>
      </SEOPageLayout>
    </>
  );
}
