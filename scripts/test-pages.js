/**
 * Test Script for pSEO Pages - ALL PHASES
 * Tests all programmatic SEO pages (Phases 1-4) to verify they return 200 status
 */

const BASE_URL = 'http://localhost:3000'

// Define all page types to test
const ORIGINS = [
  'english', 'french', 'german', 'italian', 'spanish', 'arabic',
  'jewish', 'scandinavian', 'indian', 'chinese', 'japanese',
  'african', 'native-american', 'slavic'
]

const LETTERS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

const GENDERS = ['male', 'female']

// Phase 1: Meanings (actual slugs from meanings.ts)
const MEANINGS = [
  'love', 'strong', 'brave', 'beautiful', 'joy', 'peace',
  'hope', 'grace', 'wisdom', 'warrior', 'noble', 'light',
  'protector', 'nature', 'fire', 'water', 'earth', 'star',
  'moon', 'sun', 'king', 'queen', 'gift', 'miracle',
  'victor', 'hero'
]

// Phase 2: Syllables & Length
const SYLLABLE_COUNTS = ['1', '2', '3', '4']
const LENGTH_SLUGS = ['short', 'medium', 'long']

// Phase 3: Characteristics (sample - testing subset)
const CHARACTERISTICS = [
  'unique', 'cool', 'cute', 'strong', 'beautiful',
  'elegant', 'classic', 'modern', 'vintage', 'rare'
]

const SAMPLE_NAMES = [
  'daniel', 'samuel', 'elijah', 'levi', 'isaac',
  'olivia', 'emma', 'sophia', 'ava', 'isabella'
]

// Build URL list
const urls = []

// 1. Main directory
urls.push('/names')

// 2. Gender pages
GENDERS.forEach(gender => {
  urls.push(`/names/${gender}`)
})

// 3. Origin pages (without gender)
ORIGINS.forEach(origin => {
  urls.push(`/names/origin/${origin}`)
})

// 4. Letter pages (without gender)
LETTERS.forEach(letter => {
  urls.push(`/names/starting-with/${letter}`)
})

// 5. Gender + Origin pages
GENDERS.forEach(gender => {
  ORIGINS.forEach(origin => {
    urls.push(`/names/${gender}/origin/${origin}`)
  })
})

// 6. Gender + Letter pages
GENDERS.forEach(gender => {
  LETTERS.forEach(letter => {
    urls.push(`/names/${gender}/starting-with/${letter}`)
  })
})

// 7. PHASE 1: Meaning pages (base + gender variants)
MEANINGS.forEach(meaning => {
  urls.push(`/names/meaning/${meaning}`)
  GENDERS.forEach(gender => {
    urls.push(`/names/${gender}/meaning/${meaning}`)
  })
})

// 8. PHASE 2: Syllable pages (base + gender variants)
SYLLABLE_COUNTS.forEach(count => {
  urls.push(`/names/syllables/${count}`)
  GENDERS.forEach(gender => {
    urls.push(`/names/${gender}/syllables/${count}`)
  })
})

// 9. PHASE 2: Length pages (base + gender variants)
LENGTH_SLUGS.forEach(slug => {
  urls.push(`/names/length/${slug}`)
  GENDERS.forEach(gender => {
    urls.push(`/names/${gender}/length/${slug}`)
  })
})

// 10. PHASE 3: Characteristic pages (base + gender variants)
CHARACTERISTICS.forEach(trait => {
  urls.push(`/names/characteristic/${trait}`)
  GENDERS.forEach(gender => {
    urls.push(`/names/${gender}/characteristic/${trait}`)
  })
})

// 11. PHASE 4: Origin + Characteristic combinations (base + gender variants)
// Testing a sample to keep test time reasonable
const SAMPLE_ORIGINS_FOR_COMBINATIONS = ['japanese', 'irish', 'italian', 'french', 'english']
const SAMPLE_CHARACTERISTICS_FOR_COMBINATIONS = ['unique', 'cool', 'strong', 'beautiful']

SAMPLE_ORIGINS_FOR_COMBINATIONS.forEach(origin => {
  SAMPLE_CHARACTERISTICS_FOR_COMBINATIONS.forEach(trait => {
    // Base combination
    urls.push(`/names/origin/${origin}/characteristic/${trait}`)
    // Gender-specific combinations
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/origin/${origin}/characteristic/${trait}`)
    })
  })
})

// 12. Individual name pages
SAMPLE_NAMES.forEach(name => {
  urls.push(`/name/${name}`)
})

// Test function
async function testPage(url) {
  try {
    const response = await fetch(`${BASE_URL}${url}`)
    return {
      url,
      status: response.status,
      ok: response.ok
    }
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      ok: false,
      error: error.message
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Testing ALL pSEO Pages (Phases 1-4)...\n')
  console.log(`Total pages to test: ${urls.length}\n`)
  
  const results = {
    success: [],
    notFound: [],
    error: []
  }

  // Test all URLs
  for (const url of urls) {
    const result = await testPage(url)
    
    if (result.ok) {
      results.success.push(url)
      process.stdout.write('✅')
    } else if (result.status === 404) {
      results.notFound.push(url)
      process.stdout.write('❌')
    } else {
      results.error.push({ url, status: result.status, error: result.error })
      process.stdout.write('⚠️')
    }
  }

  console.log('\n\n📊 Test Results:\n')
  console.log(`✅ Success: ${results.success.length}/${urls.length} (${Math.round(results.success.length/urls.length*100)}%)`)
  console.log(`❌ Not Found (404): ${results.notFound.length}`)
  console.log(`⚠️  Errors: ${results.error.length}\n`)

  if (results.notFound.length > 0) {
    console.log('\n❌ Pages returning 404:')
    results.notFound.slice(0, 10).forEach(url => {
      console.log(`   ${BASE_URL}${url}`)
    })
    if (results.notFound.length > 10) {
      console.log(`   ... and ${results.notFound.length - 10} more`)
    }
  }

  if (results.error.length > 0) {
    console.log('\n⚠️  Pages with errors:')
    results.error.slice(0, 10).forEach(({url, status, error}) => {
      console.log(`   ${BASE_URL}${url} - Status: ${status}${error ? ` (${error})` : ''}`)
    })
    if (results.error.length > 10) {
      console.log(`   ... and ${results.error.length - 10} more`)
    }
  }

  console.log('\n✅ Working pages by category:')
  console.log(`   Main directory: ${results.success.filter(u => u === '/names').length}/1`)
  console.log(`   Gender pages: ${results.success.filter(u => u.match(/^\/names\/(male|female)$/)).length}/2`)
  console.log(`   Origin pages: ${results.success.filter(u => u.match(/^\/names\/origin\/[^/]+$/)).length}/${ORIGINS.length}`)
  console.log(`   Letter pages: ${results.success.filter(u => u.match(/^\/names\/starting-with\/[^/]+$/)).length}/${LETTERS.length}`)
  console.log(`   Gender+Origin: ${results.success.filter(u => u.match(/^\/names\/(male|female)\/origin\//)).length}/${GENDERS.length * ORIGINS.length}`)
  console.log(`   Gender+Letter: ${results.success.filter(u => u.match(/^\/names\/(male|female)\/starting-with\//)).length}/${GENDERS.length * LETTERS.length}`)
  
  // Phase 1: Meanings
  const meaningBase = results.success.filter(u => u.match(/^\/names\/meaning\/[^/]+$/)).length
  const meaningGender = results.success.filter(u => u.match(/^\/names\/(male|female)\/meaning\//)).length
  console.log(`   Phase 1 - Meaning pages: ${meaningBase}/${MEANINGS.length} (base), ${meaningGender}/${MEANINGS.length * GENDERS.length} (gender)`)
  
  // Phase 2: Syllables & Length
  const syllableBase = results.success.filter(u => u.match(/^\/names\/syllables\/[^/]+$/)).length
  const syllableGender = results.success.filter(u => u.match(/^\/names\/(male|female)\/syllables\//)).length
  const lengthBase = results.success.filter(u => u.match(/^\/names\/length\/[^/]+$/)).length
  const lengthGender = results.success.filter(u => u.match(/^\/names\/(male|female)\/length\//)).length
  console.log(`   Phase 2 - Syllable pages: ${syllableBase}/${SYLLABLE_COUNTS.length} (base), ${syllableGender}/${SYLLABLE_COUNTS.length * GENDERS.length} (gender)`)
  console.log(`   Phase 2 - Length pages: ${lengthBase}/${LENGTH_SLUGS.length} (base), ${lengthGender}/${LENGTH_SLUGS.length * GENDERS.length} (gender)`)
  
  // Phase 3: Characteristics
  const charBase = results.success.filter(u => u.match(/^\/names\/characteristic\/[^/]+$/)).length
  const charGender = results.success.filter(u => u.match(/^\/names\/(male|female)\/characteristic\/[^/]+$/)).length
  console.log(`   Phase 3 - Characteristic pages: ${charBase}/${CHARACTERISTICS.length} (base), ${charGender}/${CHARACTERISTICS.length * GENDERS.length} (gender)`)
  
  // Phase 4: Combinations
  const comboBase = results.success.filter(u => u.match(/^\/names\/origin\/[^/]+\/characteristic\//)).length
  const comboGender = results.success.filter(u => u.match(/^\/names\/(male|female)\/origin\/[^/]+\/characteristic\//)).length
  const expectedComboBase = SAMPLE_ORIGINS_FOR_COMBINATIONS.length * SAMPLE_CHARACTERISTICS_FOR_COMBINATIONS.length
  const expectedComboGender = expectedComboBase * GENDERS.length
  console.log(`   Phase 4 - Origin+Char combos: ${comboBase}/${expectedComboBase} (base), ${comboGender}/${expectedComboGender} (gender)`)
  
  console.log(`   Individual names: ${results.success.filter(u => u.match(/^\/name\//)).length}/${SAMPLE_NAMES.length}`)

  console.log('\n' + '='.repeat(50))
  
  if (results.success.length === urls.length) {
    console.log('🎉 ALL PAGES WORKING! Ready for production!')
  } else {
    console.log(`⚠️  ${urls.length - results.success.length} pages need attention`)
  }
  
  console.log('='.repeat(50) + '\n')

  // Exit with appropriate code
  process.exit(results.success.length === urls.length ? 0 : 1)
}

// Check if server is running
async function checkServer() {
  try {
    await fetch(BASE_URL)
    return true
  } catch (error) {
    console.error('❌ Server not running at', BASE_URL)
    console.error('   Please start the dev server with: npm run dev')
    process.exit(1)
  }
}

// Run
checkServer().then(runTests)
