import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { POPULARITY_LEVELS, POPULARITY_LABELS, POPULARITY_DESCRIPTIONS, VALID_URL_GENDERS, GENDER_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{ level: string }>;
}

// Generate static params for all popularity levels (4 pages)
export async function generateStaticParams() {
  return POPULARITY_LEVELS.map(level => ({ level }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level } = await params;
  const label = POPULARITY_LABELS[level];
  const desc = POPULARITY_DESCRIPTIONS[level];

  if (!label || !POPULARITY_LEVELS.includes(level as typeof POPULARITY_LEVELS[number])) {
    return { title: 'Page Not Found' };
  }

  const title = `${label} Baby Names`;

  return {
    title: `${title} - AI Baby Namer`,
    description: desc,
    keywords: [`${level} baby names`, `${label.toLowerCase()} names`, `${level} names 2025`, `${level} name trends`],
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `https://aibabynamer.com/names/popularity/${level}`,
    },
  };
}

export default async function PopularityPage({ params }: PageProps) {
  const { level } = await params;
  const label = POPULARITY_LABELS[level];
  const desc = POPULARITY_DESCRIPTIONS[level];

  if (!label || !POPULARITY_LEVELS.includes(level as typeof POPULARITY_LEVELS[number])) {
    notFound();
  }

  const supabase = await createClient();

  // Query names based on popularity level
  let query = supabase.from('names').select('*');
  
  if (level === 'popular' || level === 'trending') {
    query = query.order('popularity_score', { ascending: false });
  } else if (level === 'unique' || level === 'rare') {
    query = query.order('popularity_score', { ascending: true });
  }
  
  const { data: names, error } = await query.limit(200);

  if (error) {
    console.error('Error fetching names:', error);
  }

  const namesList = names || [];
  const title = `${label} Baby Names`;

  const structuredData = generateCollectionPage(title, desc, `/names/popularity/${level}`, namesList.length);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <SEOPageLayout
        title={title}
        description={desc}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: title, url: `/names/popularity/${level}` },
        ]}
      >
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About {label} Names</h2>
          <p className="text-lg text-gray-700 mb-4">{desc}</p>
          <p className="text-gray-600">
            {namesList.length > 0 
              ? `Explore ${namesList.length} ${label.toLowerCase()} baby names curated for parents seeking the ${level === 'unique' || level === 'rare' ? 'distinctive' : 'best'} options.`
              : `We're building our ${label.toLowerCase()} names collection.`
            }
          </p>
        </div>

        {/* Browse by Gender */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse {label} Names by Gender</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALID_URL_GENDERS.map(gender => (
              <a key={gender} href={`/names/${gender}/popularity/${level}`}
                className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-indigo-900">{GENDER_LABELS[gender]} Names</h3>
                <p className="text-indigo-700 text-sm mt-2">{label} {GENDER_LABELS[gender].toLowerCase()} names →</p>
              </a>
            ))}
          </div>
        </div>

        {namesList.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All {label} Names</h2>
            <NameGrid names={namesList} />
          </div>
        )}

        {/* Browse Other Popularity Levels */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULARITY_LEVELS.filter(l => l !== level).map(l => (
              <a key={l} href={`/names/popularity/${l}`}
                className="p-4 bg-gray-100 rounded-lg text-center hover:bg-indigo-100 hover:text-indigo-700 transition-colors">
                <span className="font-semibold">{POPULARITY_LABELS[l]}</span>
              </a>
            ))}
          </div>
        </div>

        <InternalLinks showOrigins={true} showMeanings={true} showGenders={true} limit={8} />
      </SEOPageLayout>
    </>
  );
}
