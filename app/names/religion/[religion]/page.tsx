import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RELIGIONS, RELIGION_LABELS, RELIGION_DESCRIPTIONS, VALID_URL_GENDERS, GENDER_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{ religion: string }>;
}

// Generate static params for all religions (5 pages)
export async function generateStaticParams() {
  return RELIGIONS.map(religion => ({ religion }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { religion } = await params;
  const religionLabel = RELIGION_LABELS[religion];
  const religionDesc = RELIGION_DESCRIPTIONS[religion];

  if (!religionLabel || !RELIGIONS.includes(religion as typeof RELIGIONS[number])) {
    return { title: 'Page Not Found' };
  }

  const title = `${religionLabel} Baby Names`;
  const description = religionDesc || `Discover beautiful ${religionLabel.toLowerCase()} baby names with deep spiritual meaning and tradition.`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [
      `${religion} baby names`,
      `${religionLabel.toLowerCase()} names`,
      `${religion} names for babies`,
      religion === 'christian' ? 'biblical names' : `${religion} traditional names`,
      `${religionLabel.toLowerCase()} name meanings`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/religion/${religion}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ReligionPage({ params }: PageProps) {
  const { religion } = await params;
  const religionLabel = RELIGION_LABELS[religion];
  const religionDesc = RELIGION_DESCRIPTIONS[religion];

  if (!religionLabel || !RELIGIONS.includes(religion as typeof RELIGIONS[number])) {
    notFound();
  }

  const supabase = await createClient();

  // Query names that match this religion tag
  const { data: names, error } = await supabase
    .from('names')
    .select('*')
    .or(`religious_significance.eq.${religion},characteristics.cs.{${religion}}`)
    .order('popularity_score', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const title = `${religionLabel} Baby Names`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${religionLabel} baby names with spiritual significance`,
    `/names/religion/${religion}`,
    namesList.length
  );

  // Religion-specific intro text
  const getIntroText = () => {
    switch (religion) {
      case 'christian':
        return 'Biblical and Christian names carry the weight of scripture and centuries of faith. From apostles to saints, these names connect your child to a rich spiritual heritage.';
      case 'jewish':
        return 'Hebrew and Jewish names embody thousands of years of tradition, connecting your child to the patriarchs, prophets, and the enduring spirit of the Jewish people.';
      case 'islamic':
        return 'Muslim names from the Quran and Islamic tradition carry beautiful meanings and connect your child to the faith of over a billion people worldwide.';
      case 'hindu':
        return 'Sanskrit and Hindu names draw from ancient scriptures, gods, and spiritual concepts, offering profound meanings and cosmic connections.';
      case 'buddhist':
        return 'Buddhist-inspired names reflect principles of enlightenment, compassion, and mindfulness from Dharmic traditions.';
      default:
        return `${religionLabel} names offer deep spiritual significance and cultural meaning.`;
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SEOPageLayout
        title={title}
        description={religionDesc}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${religionLabel} Names`, url: `/names/religion/${religion}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {religionLabel} Baby Names
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              {getIntroText()}
            </p>
            <p className="text-gray-600 mb-4">
              {namesList.length > 0 
                ? `Explore our collection of ${namesList.length} ${religionLabel.toLowerCase()} names. Each name carries spiritual significance and meaningful origins.`
                : `We're building our collection of ${religionLabel.toLowerCase()} names. Browse our other collections below.`
              }
            </p>
          </div>
        </div>

        {/* Browse by Gender */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse {religionLabel} Names by Gender</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALID_URL_GENDERS.map(gender => (
              <a
                key={gender}
                href={`/names/${gender}/religion/${religion}`}
                className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-indigo-900">{GENDER_LABELS[gender]} Names</h3>
                <p className="text-indigo-700 text-sm mt-2">{religionLabel} {GENDER_LABELS[gender].toLowerCase()} names →</p>
              </a>
            ))}
          </div>
        </div>

        {/* Names Grid */}
        {namesList.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All {religionLabel} Names</h2>
            <NameGrid names={namesList} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg mb-12">
            <p className="text-gray-600 mb-4 text-lg">
              Our {religionLabel.toLowerCase()} names collection is coming soon!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Explore our origin-based collections for {religion === 'jewish' ? 'Jewish' : religion === 'islamic' ? 'Arabic' : religion === 'hindu' ? 'Indian' : 'related'} names.
            </p>
          </div>
        )}

        {/* Browse Other Religions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Other Religious Names</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {RELIGIONS.filter(r => r !== religion).map(r => (
              <a
                key={r}
                href={`/names/religion/${r}`}
                className="p-4 bg-gray-100 rounded-lg text-center hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                <span className="font-semibold">{RELIGION_LABELS[r]}</span>
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
                What makes a name {religionLabel.toLowerCase()}?
              </h3>
              <p className="text-gray-700">
                {religion === 'christian' && 'Christian names typically come from the Bible, saints, or have meanings related to Christian virtues like faith, grace, and hope.'}
                {religion === 'jewish' && 'Jewish names often come from the Torah, have Hebrew origins, or honor biblical figures and Jewish traditions.'}
                {religion === 'islamic' && 'Islamic names usually have Arabic origins, appear in the Quran, or relate to the Prophet Muhammad and his companions.'}
                {religion === 'hindu' && 'Hindu names derive from Sanskrit, reference deities, or embody spiritual concepts from Hindu philosophy.'}
                {religion === 'buddhist' && 'Buddhist-inspired names often reflect concepts of enlightenment, peace, and compassion from Buddhist teachings.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                How do I choose the right {religionLabel.toLowerCase()} name?
              </h3>
              <p className="text-gray-700">
                Consider the meaning behind the name, how it sounds with your surname, and its significance within your faith tradition. 
                Many parents also look for names that honor family members or represent virtues they hope their child will embody.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links */}
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
