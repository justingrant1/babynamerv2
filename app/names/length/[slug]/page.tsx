import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getLengthInfo, getAllLengthSlugs } from '@/lib/seo/syllables';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all length categories
export async function generateStaticParams() {
  const slugs = getAllLengthSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lengthInfo = getLengthInfo(slug);

  if (!lengthInfo) {
    return {
      title: 'Length Not Found',
    };
  }

  return {
    title: `${lengthInfo.title} - AI Baby Namer`,
    description: lengthInfo.description,
    keywords: lengthInfo.keywords.join(', '),
    openGraph: {
      title: lengthInfo.title,
      description: lengthInfo.description,
      type: 'website',
      url: `https://aibabynamer.com/names/length/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: lengthInfo.title,
      description: lengthInfo.description,
    },
  };
}

export default async function LengthPage({ params }: PageProps) {
  const { slug } = await params;
  const lengthInfo = getLengthInfo(slug);

  if (!lengthInfo) {
    notFound();
  }

  const supabase = await createClient();

  // Build query based on length category
  let query = supabase.from('names').select('*');
  
  if (lengthInfo.minLength && lengthInfo.maxLength) {
    query = query.gte('name_length', lengthInfo.minLength).lte('name_length', lengthInfo.maxLength);
  } else if (lengthInfo.minLength) {
    query = query.gte('name_length', lengthInfo.minLength);
  }

  const { data: names, error } = await query
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];

  // Generate structured data
  const structuredData = generateCollectionPage(
    lengthInfo.title,
    lengthInfo.description,
    `/names/length/${slug}`,
    namesList.length
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={lengthInfo.title}
        description={lengthInfo.description}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: 'By Length', url: '/names' },
          { name: lengthInfo.title, url: `/names/length/${slug}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {lengthInfo.title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              {lengthInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              {slug === 'short' && 'Short baby names (3-4 letters) are punchy, memorable, and easy to spell. They pair beautifully with longer surnames and are a practical choice for modern parents who value simplicity.'}
              {slug === 'medium' && 'Medium-length names (5-6 letters) offer the perfect balance. They\'re substantial enough to feel complete yet brief enough to be practical. This is the most common name length category.'}
              {slug === 'long' && 'Long baby names (7+ letters) are elegant and distinguished. They often carry rich histories and cultural significance, creating a sophisticated and memorable impression.'}
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {slug} baby names spanning various origins and cultures. 
              Each name is curated to help you find the perfect {slug}-length name for your little one.
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All {lengthInfo.title}
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
                What are popular {slug} baby names?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular ${slug} names include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and many more' : ''}.`
                  : `We're curating a beautiful list of ${slug} names. Check back soon!`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Why choose a {slug} baby name?
              </h3>
              <p className="text-gray-700">
                {slug === 'short' && 'Short names are easy to spell, pronounce, and remember. They work great with long surnames and are practical for young children learning to write their names.'}
                {slug === 'medium' && 'Medium-length names hit the sweet spot - they\'re substantial without being cumbersome. They\'re the most versatile choice, working well with surnames of any length.'}
                {slug === 'long' && 'Longer names often have beautiful meanings and rich histories. They create a distinguished, elegant impression and frequently offer multiple nickname options.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do {slug} names work with all surnames?
              </h3>
              <p className="text-gray-700">
                {slug === 'short' && 'Short names pair especially well with longer surnames, creating good balance. With very short surnames, consider if the full name feels too brief.'}
                {slug === 'medium' && 'Medium-length names are the most versatile and work beautifully with surnames of any length, making them a safe choice for most families.'}
                {slug === 'long' && 'Longer names pair best with shorter surnames (1-2 syllables) to maintain balance. Consider the flow when combined with multi-syllable surnames.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Are there {slug} names for both boys and girls?
              </h3>
              <p className="text-gray-700">
                Absolutely! We have extensive collections of {slug} names for boys, girls, and unisex options. 
                Filter by gender to find {slug} names perfect for your baby.
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

        {/* Other Length Categories */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3">
            Explore Other Name Lengths
          </h3>
          <div className="flex flex-wrap gap-3">
            {getAllLengthSlugs().filter(s => s !== slug).map(otherSlug => {
              const info = getLengthInfo(otherSlug);
              return info ? (
                <a
                  key={otherSlug}
                  href={`/names/length/${otherSlug}`}
                  className="inline-block bg-white px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-100 transition-colors"
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
