import type { EnhancedFAQ } from './types'

/**
 * Enhanced FAQ Generator
 * 
 * Generates contextual, valuable FAQs for each page type
 */

export function generateFAQs(
  pageType: 'origin' | 'characteristic' | 'gender' | 'letter',
  value: string,
  count: number = 8
): EnhancedFAQ[] {
  const faqMap: Record<string, Record<string, EnhancedFAQ[]>> = {
    origin: {
      irish: [
        { question: 'What are the most popular Irish baby names in 2026?', answer: 'The most popular Irish names include Finn, Saoirse, Cian, Aoife, and Fiadh. These names balance traditional Gaelic heritage with modern appeal, consistently ranking high in both Ireland and internationally.' },
        { question: 'How do you pronounce traditional Irish names?', answer: 'Irish names follow Gaelic pronunciation rules which differ from English. For example: Saoirse (SER-sha), Aoife (EE-fa), Caoimhe (KEE-va), Niamh (NEEV), and Cian (KEE-an). Many parents choose phonetic spellings to ease pronunciation.' },
        { question: 'What do Irish names typically mean?', answer: 'Irish names often reference nature (Fiadh means "deer"), virtues (Saoirse means "freedom"), or mythological figures (Aoife was a legendary warrior). They carry deep cultural and historical significance.' },
        { question: 'Should I use traditional Irish spelling or phonetic spelling?', answer: 'This depends on your priorities. Traditional spelling preserves cultural authenticity and honors heritage. Phonetic spellings (like Keeva instead of Caoimhe) ease pronunciation and spelling for others. Consider your cultural connection and practical concerns.' },
        { question: 'Are Irish names suitable for non-Irish families?', answer: 'Absolutely! Irish names have become internationally popular due to their beautiful sounds and meaningful origins. However, research pronunciation and consider whether you can honor the name\'s cultural significance.' },
        { question: 'What are good middle names for Irish first names?', answer: 'Irish first names pair well with both Irish and English middle names. Traditional combinations honor family heritage (Saoirse Brigid), while mixed pairings (Finn Alexander) offer versatility. Consider flow and pronunciation with your surname.' },
        { question: 'Do Irish names work with non-Irish surnames?', answer: 'Yes, Irish first names pair beautifully with various surnames. Names like Finn, Liam, and Nora work seamlessly with surnames from any culture. Test the full name aloud to ensure good flow.' },
        { question: 'What are the best Irish names for boys vs. girls?', answer: 'Popular Irish boys names include Finn, Liam, Cian, and Ronan. For girls, Saoirse, Aoife, Niamh, and Fiadh lead charts. Many Irish names are gender-specific, though some like Riley work for both.' }
      ],
      hebrew: [
        { question: 'What makes Hebrew names special?', answer: 'Hebrew names carry inherent meanings chosen for their semantic content. Unlike names where meanings evolved obscurely, Hebrew names like Noah ("rest"), Asher ("happy"), and Naomi ("pleasant") were selected specifically for their definitions.' },
        { question: 'Do you have to be Jewish to use Hebrew names?', answer: 'No, Hebrew names are chosen by families of all backgrounds for their beautiful sounds, positive meanings, and cross-cultural appeal. Biblical names especially transcend religious boundaries.' },
        { question: 'What are the most popular Hebrew names?', answer: 'Popular Hebrew names include Noah, Elijah, Benjamin, Levi for boys, and Hannah, Leah, Naomi, Abigail for girls. These names consistently rank high globally due to their timeless appeal.' },
        { question: 'How do modern Israeli names differ from Biblical Hebrew names?', answer: 'Modern Israeli names like Ari, Noa, Tal, and Shira feel contemporary while maintaining Hebrew heritage. They\'re often shorter and more streamlined than traditional biblical names.' }
      ]
    },
    characteristic: {
      unique: [
        { question: 'How do I find truly unique baby names?', answer: 'Look beyond top 100 lists, explore international names, research mythology and literature, consider nature names, or use creative spelling variants. Resources like historical census records reveal forgotten gems.' },
        { question: 'Will a unique name burden my child?', answer: 'It depends on execution. Well-chosen unique names (pronounceable, positive meaning, not trendy) enhance identity. Avoid names that are difficult to pronounce, spell, or carry negative associations.' },
        { question: 'What makes a name unique vs. just weird?', answer: 'Unique names feel distinctive yet functional - memorable without being burdensome. They have clear pronunciation, work professionally, and age well. "Weird" names often shock for shock\'s sake without considering the child\'s experience.' },
        { question: 'Should I test my unique name choice before using it?', answer: 'Yes! Say it aloud repeatedly, imagine calling it across a playground, picture it on a resume, check for unfortunate nickname potential, and research existing associations online.' }
      ],
      strong: [
        { question: 'What makes a baby name sound strong?', answer: 'Strong names typically feature hard consonants (K, T, X), short syllables, assertive meanings (warrior, victor, brave), and historical associations with powerful figures. Phonetically, they often use definitive sounds that project confidence.' },
        { question: 'Are strong names only for boys?', answer: 'No! Strong girls names like Valentina, Athena, Brianna, and Matilda combine power with femininity. Modern naming embraces strength across genders, reflecting evolving views on gender and identity.' },
        { question: 'Can strong names be too aggressive?', answer: 'Balance is key. Names like Valor or Justice convey strength without aggression. Avoid names that sound harsh or violent. The best strong names inspire confidence without intimidation.' }
      ]
    },
    gender: {
      boy: [
        { question: 'What are the top trending boy names in 2026?', answer: 'Current trending boy names include Noah, Liam, Oliver, Elijah, and Theodore. Nature names (River, Phoenix) and vintage revivals (Arthur, Felix) also surge in popularity.' },
        { question: 'Should I choose a traditional or modern boy name?', answer: 'Consider your priorities. Traditional names (William, James) provide stability and familiarity. Modern names (Kai, Maverick) offer distinctiveness. Many parents balance both with traditional first names and modern middle names.' },
        { question: 'How do I choose a boy name that works professionally?', answer: 'Choose names with clear pronunciation, positive associations, and professional gravity. Test how it sounds in formal contexts ("Attorney Liam Johnson" or "Dr. Kai Martinez"). Avoid overly trendy or cutesy names that don\'t age well.' },
        { question: 'What are good nicknames for formal boy names?', answer: 'Most formal boy names offer nickname flexibility: Alexander → Alex, Xander, Lex; Theodore → Theo, Ted; Benjamin → Ben, Benji; William → Will, Bill, Liam. This provides versatility as your son grows.' }
      ],
      girl: [
        { question: 'What are the most popular girl names in 2026?', answer: 'Leading girl names include Emma, Olivia, Sophia, Ava, and Charlotte. Nature names (Luna, Willow) and empowered choices (Athena, Valentina) also trend strongly.' },
        { question: 'How do I choose a girl name that\'s both beautiful and strong?', answer: 'Modern girl names successfully combine elegance with power. Names like Valentina, Athena, Eleanor, and Genevieve sound beautiful while carrying strong meanings and associations with accomplished women.' },
        { question: 'Should I avoid overly popular girl names?', answer: 'This depends on your priorities. Popular names work across contexts and never feel dated. If uniqueness matters, explore variants (Olivia → Liv, Olive) or less common alternatives with similar styles.' }
      ],
      unisex: [
        { question: 'What are the best gender-neutral names?', answer: 'Top gender-neutral names include Riley, Quinn, Rowan, Sage, River, Blake, and Phoenix. The best unisex names work equally well across genders without leaning masculine or feminine.' },
        { question: 'Will a gender-neutral name confuse people about my child\'s gender?', answer: 'Sometimes, but many parents see this as a feature, not a bug. Gender-neutral names allow children to define their own identities. Use gender-specific middle names if you want to clarify when needed.' },
        { question: 'Do unisex names work professionally?', answer: 'Yes! Many successful professionals have gender-neutral names. In some contexts, they may actually reduce gender bias. Choose established unisex names (like Jordan or Morgan) over very recent innovations.' }
      ]
    },
    letter: {}
  }

  // Get FAQs for the specific value, or generate generic ones
  const specificFAQs = faqMap[pageType]?.[value] || []
  
  if (specificFAQs.length > 0) {
    return specificFAQs.slice(0, count)
  }

  // Generate generic FAQs based on page type
  return generateGenericFAQs(pageType, value, count)
}

function generateGenericFAQs(
  pageType: 'origin' | 'characteristic' | 'gender' | 'letter',
  value: string,
  count: number
): EnhancedFAQ[] {
  const genericFAQs: EnhancedFAQ[] = []
  
  switch (pageType) {
    case 'letter':
      genericFAQs.push(
        { question: `What are popular baby names starting with ${value.toUpperCase()}?`, answer: `Popular ${value.toUpperCase()}-names vary by year, but consistently include both classic and modern choices. Check current name charts for trending ${value.toUpperCase()}-names in your region.` },
        { question: `Are ${value.toUpperCase()}-names common?`, answer: `${value.toUpperCase()}-name popularity varies. Some letters like A, E, J have many popular names, while letters like Q, X, Z offer more uniqueness. Consider your preference for common vs. distinctive names.` },
        { question: `What meanings do ${value.toUpperCase()}-names typically have?`, answer: `${value.toUpperCase()}-name meanings vary widely depending on origin. Research specific names to understand their individual meanings and cultural significance.` },
        { question: `Do ${value.toUpperCase()}-names work with all surnames?`, answer: `Most ${value.toUpperCase()}-names work well with various surnames. Consider alliteration (matching first letter with surname) and overall flow when testing combinations.` }
      )
      break
    
    case 'origin':
      genericFAQs.push(
        { question: `What are traditional ${value} names?`, answer: `Traditional ${value} names have deep cultural roots and have been used for generations. They carry historical significance and connect children to their heritage.` },
        { question: `Are ${value} names popular?`, answer: `${value} name popularity varies by region and time period. Many ${value} names gain international appeal while maintaining cultural authenticity.` },
        { question: `How do I pronounce ${value} names?`, answer: `Pronunciation depends on the specific name and its linguistic origins. Research individual names and practice pronunciation. Some families choose phonetic spellings for ease of use.` },
        { question: `Can non-${value} families use ${value} names?`, answer: `Yes! Many families choose ${value} names for their beautiful sounds and meanings, regardless of heritage. Research cultural significance and pronunciation to honor the name appropriately.` }
      )
      break
      
    case 'characteristic':
      genericFAQs.push(
        { question: `What defines a ${value} baby name?`, answer: `${value} names typically share specific qualities in sound, meaning, or cultural associations that create the ${value} characteristic. Individual names vary in how they express this quality.` },
        { question: `Are ${value} names suitable for all children?`, answer: `${value} names work for children of various temperaments. The name doesn\'t determine personality but can provide aspirational qualities or reflect family values.` },
        { question: `How do I find ${value} name options?`, answer: `Explore name databases filtering for ${value} characteristics, research names with ${value} meanings, consider cultural traditions emphasizing ${value} qualities, and consult comprehensive name books.` },
        { question: `Will a ${value} name work professionally?`, answer: `Most ${value} names work professionally when chosen thoughtfully. Consider whether the name ages well, has positive associations, and works across contexts from childhood through adulthood.` }
      )
      break
  }
  
  return genericFAQs.slice(0, count)
}

/**
 * Generate FAQs with proper schema.org markup
 */
export function generateFAQSchema(faqs: EnhancedFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}
