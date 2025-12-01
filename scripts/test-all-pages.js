/**
 * Fast Comprehensive Test for ALL pSEO Pages
 * Tests all 2,237+ pages with parallel requests for speed
 */

let BASE_URL = 'http://localhost:3000'
const BATCH_SIZE = 100 // Test 100 URLs in parallel for speed
const REQUEST_TIMEOUT = 10000 // 10 second timeout per request

// Import all the data
const ORIGINS = [
  'english', 'french', 'german', 'italian', 'spanish', 'arabic',
  'jewish', 'scandinavian', 'indian', 'chinese', 'japanese',
  'african', 'native-american', 'slavic'
]

const LETTERS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

const GENDERS = ['boy', 'girl', 'unisex']

// All 27 meanings
const MEANINGS = [
  'love', 'strong', 'strength', 'brave', 'beautiful', 'joy', 'peace',
  'hope', 'grace', 'wisdom', 'warrior', 'noble', 'light',
  'protector', 'nature', 'fire', 'water', 'earth', 'star',
  'moon', 'sun', 'king', 'queen', 'gift', 'miracle',
  'victor', 'hero'
]

// All 4 syllable counts
const SYLLABLE_COUNTS = ['1', '2', '3', '4']

// All 3 length slugs
const LENGTH_SLUGS = ['short', 'medium', 'long']

// All 30 characteristics
const CHARACTERISTICS = [
  'unique', 'cool', 'cute', 'strong', 'beautiful',
  'elegant', 'classic', 'modern', 'vintage', 'rare',
  'traditional', 'exotic', 'trendy', 'timeless', 'sophisticated',
  'simple', 'bold', 'gentle', 'powerful', 'charming',
  'graceful', 'artistic', 'natural', 'regal', 'mysterious',
  'cheerful', 'serious', 'playful', 'noble', 'spiritual'
]

// Build complete URL list
function buildURLs() {
  const urls = []

  // 1. Main + static pages
  urls.push('/names')
  
  // 2. Gender pages (3)
  GENDERS.forEach(gender => {
    urls.push(`/names/${gender}`)
  })

  // 3. Origin pages (14 base + 42 gender = 56)
  ORIGINS.forEach(origin => {
    urls.push(`/names/origin/${origin}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/origin/${origin}`)
    })
  })

  // 4. Letter pages (26 base + 78 gender = 104)
  LETTERS.forEach(letter => {
    urls.push(`/names/starting-with/${letter}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/starting-with/${letter}`)
    })
  })

  // 5. Meaning pages (27 base + 81 gender = 108)
  MEANINGS.forEach(meaning => {
    urls.push(`/names/meaning/${meaning}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/meaning/${meaning}`)
    })
  })

  // 6. Syllable pages (4 base + 12 gender = 16)
  SYLLABLE_COUNTS.forEach(count => {
    urls.push(`/names/syllables/${count}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/syllables/${count}`)
    })
  })

  // 7. Length pages (3 base + 9 gender = 12)
  LENGTH_SLUGS.forEach(slug => {
    urls.push(`/names/length/${slug}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/length/${slug}`)
    })
  })

  // 8. Characteristic pages (30 base + 90 gender = 120)
  CHARACTERISTICS.forEach(trait => {
    urls.push(`/names/characteristic/${trait}`)
    GENDERS.forEach(gender => {
      urls.push(`/names/${gender}/characteristic/${trait}`)
    })
  })

  // 9. Origin + Characteristic combinations (420 base + 1260 gender = 1680)
  ORIGINS.forEach(origin => {
    CHARACTERISTICS.forEach(trait => {
      urls.push(`/names/origin/${origin}/characteristic/${trait}`)
      GENDERS.forEach(gender => {
        urls.push(`/names/${gender}/origin/${origin}/characteristic/${trait}`)
      })
    })
  })

  return urls
}

// Fast fetch with timeout
async function testPage(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    return {
      url,
      status: response.status,
      ok: response.ok
    }
  } catch (error) {
    clearTimeout(timeout)
    if (error.name === 'AbortError') {
      return { url, status: 'TIMEOUT', ok: false, error: 'Request timeout' }
    }
    return { url, status: 'ERROR', ok: false, error: error.message }
  }
}

// Test URLs in parallel batches
async function testBatch(urls) {
  return Promise.all(urls.map(url => testPage(url)))
}

// Main test runner
async function runTests() {
  console.log('🚀 Fast Comprehensive pSEO Test\n')
  
  const urls = buildURLs()
  console.log(`📊 Testing ${urls.length} pages in batches of ${BATCH_SIZE}...\n`)
  
  const results = {
    success: [],
    notFound: [],
    error: [],
    timeout: []
  }

  const startTime = Date.now()
  
  // Process in batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const batchResults = await testBatch(batch)
    
    batchResults.forEach(result => {
      if (result.ok) {
        results.success.push(result.url)
        process.stdout.write('✅')
      } else if (result.status === 404) {
        results.notFound.push(result.url)
        process.stdout.write('❌')
      } else if (result.status === 'TIMEOUT') {
        results.timeout.push(result.url)
        process.stdout.write('⏱️')
      } else {
        results.error.push(result)
        process.stdout.write('⚠️')
      }
    })
    
    // Progress update every 10 batches
    if ((i / BATCH_SIZE) % 10 === 0) {
      const progress = Math.round((i / urls.length) * 100)
      process.stdout.write(` ${progress}% `)
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n\n📊 Test Results:\n')
  console.log(`✅ Success: ${results.success.length}/${urls.length} (${Math.round(results.success.length/urls.length*100)}%)`)
  console.log(`❌ Not Found (404): ${results.notFound.length}`)
  console.log(`⏱️  Timeouts: ${results.timeout.length}`)
  console.log(`⚠️  Errors: ${results.error.length}`)
  console.log(`⏱️  Duration: ${duration}s (${Math.round(urls.length/duration)} pages/sec)\n`)

  if (results.notFound.length > 0) {
    console.log('❌ Sample 404 Pages (showing first 10):')
    results.notFound.slice(0, 10).forEach(url => {
      console.log(`   ${BASE_URL}${url}`)
    })
    if (results.notFound.length > 10) {
      console.log(`   ... and ${results.notFound.length - 10} more\n`)
    }
  }

  if (results.timeout.length > 0) {
    console.log('⏱️  Timeout Pages (showing first 5):')
    results.timeout.slice(0, 5).forEach(url => {
      console.log(`   ${BASE_URL}${url}`)
    })
    if (results.timeout.length > 5) {
      console.log(`   ... and ${results.timeout.length - 5} more\n`)
    }
  }

  if (results.error.length > 0) {
    console.log('⚠️  Error Pages (showing first 5):')
    results.error.slice(0, 5).forEach(({url, status, error}) => {
      console.log(`   ${BASE_URL}${url} - ${status} ${error ? `(${error})` : ''}`)
    })
    if (results.error.length > 5) {
      console.log(`   ... and ${results.error.length - 5} more\n`)
    }
  }

  // Category breakdown
  console.log('✅ Page Breakdown:')
  console.log(`   Main + Gender: ${results.success.filter(u => u.match(/^\/names(\/boy|\/girl|\/unisex)?$/)).length}/4`)
  console.log(`   Origins: ${results.success.filter(u => u.match(/\/origin\/[^/]+$/)).length}/56`)
  console.log(`   Letters: ${results.success.filter(u => u.match(/\/starting-with\/[^/]+$/)).length}/104`)
  console.log(`   Meanings: ${results.success.filter(u => u.match(/\/meaning\/[^/]+$/)).length}/108`)
  console.log(`   Syllables: ${results.success.filter(u => u.match(/\/syllables\/[^/]+$/)).length}/16`)
  console.log(`   Lengths: ${results.success.filter(u => u.match(/\/length\/[^/]+$/)).length}/12`)
  console.log(`   Characteristics: ${results.success.filter(u => u.match(/\/characteristic\/[^/]+$/)).length}/120`)
  console.log(`   Combinations: ${results.success.filter(u => u.match(/\/origin\/[^/]+\/characteristic\//)).length}/1680`)

  console.log('\n' + '='.repeat(60))
  
  if (results.success.length === urls.length) {
    console.log('🎉 ALL PAGES WORKING! Ready for production!')
  } else {
    const failureRate = Math.round((1 - results.success.length/urls.length) * 100)
    console.log(`⚠️  ${failureRate}% failure rate (${urls.length - results.success.length} pages need attention)`)
  }
  
  console.log('='.repeat(60) + '\n')

  // Exit with appropriate code
  process.exit(results.success.length === urls.length ? 0 : 1)
}

// Check if server is running and find the correct port
async function checkServer() {
  // Try common ports
  const ports = [3000, 3001, 3002]
  
  for (const port of ports) {
    const url = `http://localhost:${port}`
    try {
      await fetch(url)
      BASE_URL = url
      console.log(`✅ Found server at ${BASE_URL}\n`)
      return true
    } catch (error) {
      // Try next port
    }
  }
  
  console.error('❌ No server found on ports:', ports.join(', '))
  console.error('   Please start the dev server with: npm run dev')
  console.error('   Or start production build with: npm run build && npm run start')
  process.exit(1)
}

// Run
checkServer().then(runTests)
