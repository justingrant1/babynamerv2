/**
 * Test Script for pSEO Pages
 * Tests all programmatic SEO pages to verify they return 200 status
 */

const BASE_URL = 'http://localhost:3000'

// Define all page types to test (only origins with data in database)
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

// 7. Individual name pages
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
  console.log('🧪 Testing pSEO Pages...\n')
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
    results.notFound.forEach(url => {
      console.log(`   ${BASE_URL}${url}`)
    })
  }

  if (results.error.length > 0) {
    console.log('\n⚠️  Pages with errors:')
    results.error.forEach(({url, status, error}) => {
      console.log(`   ${BASE_URL}${url} - Status: ${status}${error ? ` (${error})` : ''}`)
    })
  }

  console.log('\n✅ Working pages by category:')
  console.log(`   Main directory: ${results.success.filter(u => u === '/names').length}/1`)
  console.log(`   Gender pages: ${results.success.filter(u => u.match(/^\/names\/(male|female)$/)).length}/2`)
  console.log(`   Origin pages: ${results.success.filter(u => u.match(/^\/names\/origin\//)).length}/${ORIGINS.length}`)
  console.log(`   Letter pages: ${results.success.filter(u => u.match(/^\/names\/starting-with\//)).length}/${LETTERS.length}`)
  console.log(`   Gender+Origin: ${results.success.filter(u => u.match(/^\/names\/(male|female)\/origin\//)).length}/${GENDERS.length * ORIGINS.length}`)
  console.log(`   Gender+Letter: ${results.success.filter(u => u.match(/^\/names\/(male|female)\/starting-with\//)).length}/${GENDERS.length * LETTERS.length}`)
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
