import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMeaningInfo, getAllMeaningSlugs } from '@/lib/seo/meanings';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateMeaningSchema } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    meaning: string;
  }>;
}

// Generate static params for all meanings
export async function generateStaticParams() {
  const meanings = getAllMeaningSlugs();
  return meanings.map((meaning) => ({
    meaning,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { meaning } = await params;
  const meaningInfo = getMeaningInfo(meaning);

  if (!meaningInfo) {
    return {
      title: 'Meaning Not Found',
    };
  }

  return {
    title: `${meaningInfo.title} - AI Baby Namer`,
    description: meaningInfo.description,
    keywords: meaningInfo.keywords.join(', '),
    openGraph: {
      title: meaningInfo.title,
      description: meaningInfo.description,
      type: 'website',
      url: `https://aibabynamer.com/names/meaning/${meaning}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: meaningInfo.title,
      description: meaningInfo.description,
    },
  };
}

export default async function MeaningPage({ params }: PageProps) {
  const { meaning } = await params;
  const meaningInfo = getMeaningInfo(meaning);

  if (!meaningInfo) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch names with this meaning (case-insensitive search in meaning field)
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .ilike('meaning', `%${meaning}%`)
    .order('popularity_score', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];

  // Generate structured data
  const structuredData = generateMeaningSchema(
    meaningInfo.title,
    meaningInfo.description,
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
        title={meaningInfo.title}
        description={meaningInfo.description}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: 'By Meaning', url: '/names' },
          { name: meaningInfo.title, url: `/names/meaning/${meaning}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {meaningInfo.title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              {meaningInfo.description}
            </p>
            <p className="text-gray-600 mb-4">
              Choosing a baby name with a meaningful significance can add depth and intention to your child's identity. 
              Names that mean "{meaning}" carry special symbolism and can reflect the values and hopes you have for your little one.
            </p>
            <p className="text-gray-600">
              Below you'll find a curated collection of {namesList.length} beautiful names that mean or relate to "{meaning}". 
              Each name includes its origin and full meaning to help you make the perfect choice.
            </p>
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              All Names Meaning {meaning.charAt(0).toUpperCase() + meaning.slice(1)}
            </h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No names found with this meaning. Check back soon as we're constantly adding new names!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What are some popular baby names meaning {meaning}?
              </h3>
              <p className="text-gray-700">
                {namesList.length > 0 
                  ? `Popular names meaning ${meaning} include ${namesList.slice(0, 5).map(n => n.name).join(', ')}${namesList.length > 5 ? ', and more' : ''}.`
                  : `We're curating a list of beautiful names meaning ${meaning}. Check back soon!`
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Are there both boy and girl names meaning {meaning}?
              </h3>
              <p className="text-gray-700">
                Yes! We have a diverse collection including male names, female names, and unisex names. 
                You can filter by gender to find the perfect name for your baby boy or girl.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What origins do names meaning {meaning} come from?
              </h3>
              <p className="text-gray-700">
                Names with this meaning can be found across many cultures and origins including Greek, Latin, Hebrew, Irish, 
                Spanish, Arabic, and more. Each brings its own unique history and pronunciation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                How do I choose the right name meaning {meaning}?
              </h3>
              <p className="text-gray-700">
                Consider the name's origin, pronunciation, how it sounds with your surname, potential nicknames, 
                and any family or cultural significance. Our AI Baby Namer tool can also help you discover personalized suggestions.
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
      </SEOPageLayout>
    </>
  );
}
