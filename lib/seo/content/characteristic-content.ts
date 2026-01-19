import { RichContentBlock } from './types'

/**
 * Rich Editorial Content for Characteristic Pages
 * 
 * Content for personality traits and qualities parents seek in baby names
 */

export const CHARACTERISTIC_CONTENT: Record<string, RichContentBlock> = {
  unique: {
    slug: 'unique',
    title: 'Unique Baby Names',
    introduction: `Choosing a unique baby name means giving your child something truly distinctive—a name they won't share with multiple classmates, a name that stands out without being difficult, a name that sparks conversation and leaves lasting impressions. In 2026, as parents increasingly seek individuality for their children, unique names offer the perfect balance between creativity and meaning. From rare traditional names like Caspian and Ophelia to modern inventions like Everly and Kai, unique names let your child's identity shine from day one.

What defines "unique" continues evolving. A truly unique name isn't just uncommon—it's memorable, pronounceable, and carries positive associations. The best unique names avoid being trendy (which means they'll date quickly) while still feeling contemporary. They work across cultures, age gracefully, and don't burden children with constant spelling corrections or mispronunciations.`,

    culturalContext: `The desire for unique names reflects broader cultural shifts toward individuality and self-expression. Previous generations favored conformity—naming children after family members or choosing from limited popular options. Today's parents view names as opportunities for creativity and distinction. Social media influence amplifies this trend, as parents seek names that feel Instagram-ready and memorable in digital spaces.

However, uniqueness carries responsibilities. Names that are too unusual can burden children with unwanted attention, constant corrections, or being taken less seriously professionally. The key lies in finding names that are distinctive without being problematic—uncommon enough to stand out, familiar enough to function smoothly in society.`,

    modernTrends: `In 2026, unique name trends show fascinating patterns. Nature-inspired names like River, Phoenix, and Wren appeal to eco-conscious parents. Surname-as-first-name choices like Harper, Hudson, and Emerson provide familiarity with distinction. Mythological names such as Atlas, Freya, and Apollo offer legendary connections without excessive popularity.

Parents increasingly source unique names from literature (Lyra, Finnick), geography (Brooklyn, Vienna), astronomy (Luna, Nova, Orion), and unconventional spellings of classic names (Maddox, Jaxon). The trend toward gender-neutral names also drives uniqueness—names like Sage, Quinn, and Rowan work for any gender while remaining uncommon enough to feel special.`,

    famousExamples: `Celebrities champion unique baby names. Elon Musk's X Æ A-12, Gwyneth Paltrow's Apple, and Beyoncé's Blue Ivy pushed boundaries of name creativity. More wearable celebrity choices include Blake Lively's James (for a girl), Ryan Reynolds' Inez, and Chris Hemsworth's India. These high-profile examples normalize unique naming while showing both extreme and moderate approaches.

Athletes like LeBron James (Bronny, Bryce) and cultural figures demonstrate that unique names can enhance rather than hinder success. The key lies in thoughtful selection rather than shock value.`,

    tips: [
      'Test pronunciation: Say the name aloud repeatedly—does it flow? Is it intuitive?',
      'Consider spelling: Unique spellings can burden children—balance creativity with practicality',
      'Research meanings: Ensure your unique choice carries positive associations',
      'Think long-term: Will the name work for a baby, teenager, and professional adult?',
      'Check social media: Search the name to ensure no negative associations exist',
      "Consider initials: Make sure they don't spell anything unfortunate"
    ],

    statistics: {
      popularityTrend: 'rising',
      percentOfNewborns: '18.2',
      topDecade: '2020s',
      searchVolume: 'Extremely High'
    }
  },

  strong: {
    slug: 'strong',
    title: 'Strong Baby Names',
    introduction: `Strong baby names convey power, resilience, and determination—qualities every parent hopes their child embodies. These names don't just sound powerful; they carry meanings and cultural associations linked to strength, leadership, and courage. From warrior names like Alexander and Matilda to virtue names like Valor and Justice, strong names give children aspirational identities that inspire confidence. In a world that demands resilience, choosing a strong name provides your child with a subtle daily affirmation of their potential.

Strong names work across genders and cultures. They range from traditional choices with warrior meanings (Marcus, Brianna) to modern inventions emphasizing power (Titan, Phoenix). The appeal lies not just in etymology but in phonetic strength—names with hard consonants and definitive sounds naturally project authority and confidence.`,

    culturalContext: `Culturally, strong names reflect societies that value courage, leadership, and resilience. Many derive from warrior traditions—Germanic names like Wilhelm ("will-helmet" meaning determined protector) or Celtic names like Brianna ("strong, virtuous, honorable"). Roman names like Maximus and Augustus explicitly reference power and greatness.

The modern emphasis on strong names also reflects parenting philosophies emphasizing empowerment and self-confidence. Parents want children who stand up for themselves, pursue their goals fearlessly, and face challenges with courage. A strong name becomes part of that foundation, a daily reminder of inner strength.`,

    modernTrends: `Contemporary strong name trends emphasize both traditional power names and modern virtue names. Classic strong names like Alexander, Victor, and Matilda remain popular, while newer choices like Titan, Maverick, and Reign gain traction. Female empowerment drives strong girls' names—Valentina, Gabriella, and Athena all project power while maintaining femininity.

Unisex strong names like Justice, Valor, Phoenix, and Stone appeal to parents seeking strength without gender constraints. Nature names suggesting power (Storm, Wolf, Bear) and occupational names indicating capability (Hunter, Archer) also trend upward.`,

    famousExamples: `Strong name bearers demonstrate varied achievements. Athletes like Serena Williams and LeBron James embody their names' power. Leaders like Winston Churchill and Margaret Thatcher showed how strong names match strong personalities. Entertainment figures like Charlize Theron and Alexander Skarsgård demonstrate strong names' international appeal.

Historical figures including Alexander the Great, Victoria (queen), and Marcus Aurelius created lasting associations between their names and strength, leadership, and resilience.`,

    tips: [
      'Consider meaning and sound: Strong names should both mean something powerful and sound assertive',
      'Balance strength with warmth: Names can project power without being harsh or aggressive',
      'Think about nicknames: Strong names often have softer nickname options (Alexander → Alex)',
      'Research cultural associations: Ensure strength associations are positive across cultures',
      'Pair thoughtfully with surnames: Strong first names work best with surnames that complement rather than compete',
      "Consider your child's personality: Strong names suit various temperaments when chosen thoughtfully"
    ],

    statistics: {
      popularityTrend: 'rising',
      percentOfNewborns: '12.4',
      topDecade: '2020s',
      searchVolume: 'Very High'
    }
  },

  // Remaining characteristics with focused content
  beautiful: {
    slug: 'beautiful',
    title: 'Beautiful Baby Names',
    introduction: `Beautiful baby names captivate with their melodic sounds, elegant compositions, and aesthetic appeal. These names aren't just pretty—they evoke beauty through meaning, cultural associations, and phonetic grace. From floral names like Lily and Rose to ethereal choices like Seraphina and Aurora, beautiful names celebrate life's aesthetic pleasures while providing children names they'll love hearing throughout their lives.`,
    culturalContext: `Beautiful names reflect cultural aesthetics and linguistic musicality. Romance languages naturally produce beautiful-sounding names through vowel richness. Many beautiful names reference nature's beauty—flowers, gems, celestial bodies—creating names that embody visual and auditory beauty simultaneously.`,
    modernTrends: `Contemporary beautiful names emphasize flowing sounds and romantic imagery. Names ending in 'a' (Isabella, Olivia, Aurora) dominate girls' lists for their graceful finish. Nature-inspired beauty names (Violet, Jasmine, River) remain popular. Vintage revival brings back Victorian-era beautiful names (Genevieve, Evangeline, Beatrice).`,
    tips: ['Choose names with flowing sounds', 'Consider visual beauty of written form', 'Balance elegance with practicality', 'Research meanings to ensure they match aesthetic appeal'],
    statistics: { popularityTrend: 'stable', percentOfNewborns: '9.3', topDecade: '2010s-2020s' }
  },

  powerful: {
    slug: 'powerful',
    title: 'Powerful Baby Names',
    introduction: `Powerful baby names command attention and respect, carrying associations with leadership, influence, and authority. These names suggest capability and impact, perfect for parents who envision their children making meaningful differences in the world. From royal names like Reign and Empress to commanding choices like Titan and Maximus, powerful names set high expectations while inspiring confidence.`,
    culturalContext: `Powerful names derive from positions of authority (King, Duke, Regina), natural forces (Storm, Blaze), or divine associations (Zeus, Hera). They reflect human admiration for strength, capability, and the ability to shape circumstances. Many powerful names carry mythological or historical weight.`,
    modernTrends: `Modern powerful names blend traditional authority with contemporary edge. Names like Legend, Maverick, and Phoenix suggest self-made power rather than inherited status. Gender-neutral powerful names (Justice, Sovereign, Noble) gain popularity as power becomes less gender-defined.`,
    tips: ["Ensure power doesn't become pretension", 'Balance with appropriate middle names', 'Consider professional contexts', 'Think about international perceptions'],
    statistics: { popularityTrend: 'rising', percentOfNewborns: '7.1', topDecade: '2020s' }
  },

  elegant: {
    slug: 'elegant',
    title: 'Elegant Baby Names',
    introduction: `Elegant baby names exude sophistication, grace, and timeless refinement. These names transcend trends, maintaining appeal across generations through their classic beauty and cultured associations. From French elegance like Genevieve and Laurent to British refinement like Penelope and Sebastian, elegant names provide children with distinguished identities that age beautifully.`,
    culturalContext: `Elegant names reflect aristocratic traditions, artistic cultures, and refined aesthetics. Many derive from French, Italian, or British upper-class naming conventions. They often reference classical education, fine arts, and cultural sophistication, creating names associated with good taste and refinement.`,
    modernTrends: `Contemporary elegant names show renewed appreciation for vintage sophistication. Names like Josephine, Theodore, Adelaide, and Edmund experience revivals. Parents seek names that sound educated and cultured without feeling stuffy. Elegant simplicity (Grace, Claire, James) competes with elaborate elegance (Maximilian, Anastasia, Montgomery).`,
    tips: ['Choose timeless over trendy', 'Consider formal and nickname options', 'Think about international pronunciation', 'Balance elegance with accessibility'],
    statistics: { popularityTrend: 'stable', percentOfNewborns: '5.7', topDecade: '2010s-2020s' }
  },

  modern: {
    slug: 'modern',
    title: 'Modern Baby Names',
    introduction: `Modern baby names capture contemporary culture, fresh sounds, and current naming aesthetics. These names feel distinctly of-the-moment, reflecting today's values, cultural influences, and linguistic innovations. From tech-age names like Nova and Kai to millennial favorites like Harper and Mason, modern names give children identities rooted in current times while avoiding dated trendy pitfalls.`,
    culturalContext: `Modern names emerge from contemporary culture—social media influence, celebrity choices, and evolving gender norms all shape modern naming. They often blend traditional elements in new ways or create entirely fresh combinations. Modern names reflect current values: equality (gender-neutral names), individualism (unique spellings), and global connectivity (international fusion names).`,
    modernTrends: `The definition of 'modern' constantly evolves. Currently, short names (Mia, Leo, Kai) dominate. Surname-as-first-names (Harper, Hudson, Sawyer) maintain popularity. Nature names with edge (Juniper, Sage, Fox) and word names (Journey, Dream, Brave) represent cutting-edge modern choices.`,
    tips: ['Consider longevity—will it feel dated quickly?', 'Balance modern with timeless elements', 'Think about spelling simplicity', 'Research meanings of modern inventions'],
    statistics: { popularityTrend: 'rising', percentOfNewborns: '16.8', topDecade: '2020s' }
  },

  classic: {
    slug: 'classic',
    title: 'Classic Baby Names',
    introduction: `Classic baby names stand the test of time, maintaining appeal across centuries and cultures through their proven track records and universal recognition. These names—like William, Elizabeth, James, and Catherine—never feel dated because they transcend trends. Classic names provide stability, familiarity, and dignity while avoiding the risk of becoming "that 2020s name" in future decades.`,
    culturalContext: `Classic names derive from deep historical roots, often Biblical, royal, or literary origins. They've remained in consistent use for generations, proving their staying power. Many classic names honor tradition while adapting to contemporary contexts through nicknames and variations.`,
    modernTrends: `Classic names maintain steady popularity. Parents appreciate their safety—you can't go wrong with Sarah or John. However, within classics, preferences shift. Currently, shorter classics (Grace, Jack, Rose, Max) outpace longer versions. Classic names with fresh nicknames (Theodore → Theo, Eleanor → Ellie) enjoy particular favor.`,
    tips: ['Accept popularity—classic names are often common', 'Personalize through middle names or nicknames', 'Research family connections to classics', 'Consider which era of classics appeals most'],
    statistics: { popularityTrend: 'stable', percentOfNewborns: '22.4', topDecade: 'Every decade' }
  },

  rare: {
    slug: 'rare',
    title: 'Rare Baby Names',
    introduction: `Rare baby names offer ultimate distinction—names so uncommon that your child likely won't meet another person with their name. These gems might be forgotten historical names awaiting revival, international names rarely used in English-speaking countries, or simply beautiful names that never gained mainstream traction. Rare names like Ottilie, Caspian, Soren, and Celestine provide maximum uniqueness while maintaining wearability.`,
    culturalContext: `Rare names come from various sources: ancient names that fell out of use, international names from specific cultures, literary inventions, or simply names that never achieved popularity despite being perfectly lovely. Rarity doesn't indicate quality—many rare names are beautiful, meaningful, and perfectly functional.`,
    modernTrends: `The quest for rare names intensifies as parents seek true distinction. Name databases and social media make finding rare names easier. Parents mine old census records, international sources, and literature for hidden gems. However, sharing rare name ideas online can quickly eliminate their rarity.`,
    tips: ['Verify pronunciation and spelling ease', 'Research thoroughly—rare doesn't mean good', 'Consider why the name is rare', 'Think about your child's experience being the only one'],
    statistics: { popularityTrend: 'rising', percentOfNewborns: '8.9', topDecade: '2020s' }
  },

  popular: {
    slug: 'popular',
    title: 'Popular Baby Names',
    introduction: `Popular baby names dominate birth certificates year after year for good reason—they sound pleasant, work across cultures, and provide children with familiar, accepted identities. Names like Emma, Olivia, Liam, and Noah top charts because they balance appeal with functionality. While some parents avoid popularity, others embrace it, valuing the security of a well-loved, widely recognized name.`,
    culturalContext: `Popular names reflect cultural consensus about appealing names. They often share characteristics: easy pronunciation, pleasant sounds, positive meanings, and cultural adaptability. Popularity patterns reveal societal values—current trends favor shorter names, nature references, and international accessibility.`,
    modernTrends: `Popular name trends in 2026 show interesting patterns. Top names often derive from biblical, royal, or nature sources. The same names dominate globally, reflecting cultural convergence. However, spelling variations create uniqueness within popularity (Sophia/Sofia, Jackson/Jaxon).`,
    tips: ['Accept commonness as a trade-off for universal appeal', 'Use unique middle names for distinction', 'Consider spelling variations if you want familiarity with twist', 'Research local vs. national popularity—names vary by region'],
    statistics: { popularityTrend: 'stable', percentOfNewborns: '28.6', topDecade: '2020s' }
  },

  traditional: {
    slug: 'traditional',
    title: 'Traditional Baby Names',
    introduction: `Traditional baby names connect children to heritage, family history, and cultural continuity. These time-honored choices—like Margaret, Thomas, Catherine, and Robert—carry generations of family stories while providing children with solid, respectable identities. Traditional names aren't merely old; they're names with proven longevity that honor the past while remaining perfectly wearable in contemporary contexts.`,
    culturalContext: `Traditional names vary by culture but share common threads: they've been used consistently across generations, often honor family members, and carry cultural significance. Many traditional names have religious origins, royal connections, or historical importance. They represent naming continuity rather than innovation.`,
    modernTrends: `Traditional names experience cyclical popularity. Currently, Victorian-era traditional names (Theodore, Beatrice, Edmund) enjoy revivals. Parents balance honoring tradition with avoiding dated sounds. Many traditional names gain appeal through fresh nicknames (Margaret → Maggie, Theodore → Theo).`,
    tips: ['Honor family traditions when possible', "Consider vintage versus outdated—there's a difference", 'Modernize through nicknames if desired', 'Research multiple generations of your family tree for inspiration'],
    statistics: { popularityTrend: 'stable', percentOfNewborns: '19.2', topDecade: 'Every decade' }
  }
}

/** Helper function to get content for a specific characteristic */
export function getCharacteristicContent(characteristic: string): RichContentBlock | undefined {
  return CHARACTERISTIC_CONTENT[characteristic]
}

/** Get all available characteristic slugs */
export function getAvailableCharacteristics(): string[] {
  return Object.keys(CHARACTERISTIC_CONTENT)
}
