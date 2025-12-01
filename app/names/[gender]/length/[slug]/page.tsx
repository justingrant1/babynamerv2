import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getLengthInfo, getAllLengthSlugs } from '@/lib/seo/syllables';
import { GENDER_LABELS } from '@/lib/seo/constants';
import SEOPageLayout from '@/components/seo/SEOPageLayout';
import NameGrid from '@/components/seo/NameGrid';
import InternalLinks from '@/components/seo/InternalLinks';
import { generateCollectionPage } from '@/lib/seo/structured-data';

interface PageProps {
  params: Promise<{
    gender: 'male' | 'female';
    slug: string;
  }>;
}

// Generate static params for all gender/length combinations
export async function generateStaticParams() {
  const slugs = getAllLengthSlugs();
  const genders: Array<'male' | 'female'> = ['male', 'female'];
  
  const params = [];
  for (const gender of genders) {
    for (const slug of slugs) {
      params.push({ gender, slug });
    }
  }
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender, slug } = await params;
  const lengthInfo = getLengthInfo(slug);

  if (!lengthInfo || !['male', 'female'].includes(gender)) {
    return {
      title: 'Page Not Found',
    };
  }

  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${lengthInfo.title}`;
  const description = `Discover ${genderLabel.toLowerCase()} ${lengthInfo.title.toLowerCase()}. ${lengthInfo.description}`;

  return {
    title: `${title} - AI Baby Namer`,
    description,
    keywords: [`${gender} ${slug} names`, ...lengthInfo.keywords],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://aibabynamer.com/names/${gender}/length/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GenderLengthPage({ params }: PageProps) {
  const { gender, slug } = await params;
  const lengthInfo = getLengthInfo(slug);

  if (!lengthInfo || !['male', 'female'].includes(gender)) {
    notFound();
  }

  const supabase = await createClient();

  // Build query based on gender and length category
  let query = supabase.from('names').select('*').eq('gender', gender);
  
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
  const genderLabel = GENDER_LABELS[gender];
  const title = `${genderLabel} ${lengthInfo.title}`;

  // Generate structured data
  const structuredData = generateCollectionPage(
    title,
    `${genderLabel} ${lengthInfo.title.toLowerCase()}`,
    `/names/${gender}/length/${slug}`,
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
        description={`Find ${genderLabel.toLowerCase()} ${lengthInfo.title.toLowerCase()}. Perfect for your baby ${gender === 'male' ? 'boy' : 'girl'}.`}
        breadcrumbs={[
          { name: 'Names', url: '/names' },
          { name: `${genderLabel} Names`, url: `/names/${gender}` },
          { name: 'By Length', url: `/names/${gender}` },
          { name: title, url: `/names/${gender}/length/${slug}` },
        ]}
      >
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            About {title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Looking for {genderLabel.toLowerCase()} {lengthInfo.title.toLowerCase()}? {lengthInfo.description}
            </p>
            <p className="text-gray-600">
              Below you'll find {namesList.length} {slug} {genderLabel.toLowerCase()} names from various origins. 
              Each name is curated to help you find the perfect {slug}-length name for your {gender === 'male' ? 'son' : 'daughter'}.
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
              No {genderLabel.toLowerCase()} names found in this length category. Check our <a href={`/names/length/${slug}`} className="text-indigo-600 hover:underline">complete list</a>!
            </p>
          </div>
        )}

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
