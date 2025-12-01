import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Create client directly with env vars
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Test 1: Check connection
    const { data: testData, error: testError } = await supabase
      .from('names')
      .select('count')
      .limit(1)

    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database query failed',
        details: testError.message,
        hint: testError.hint,
        code: testError.code
      }, { status: 500 })
    }

    // Test 2: Try to get actual names
    const { data: names, error: namesError } = await supabase
      .from('names')
      .select('*')
      .limit(5)

    if (namesError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Could not fetch names',
        details: namesError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      nameCount: names?.length || 0,
      sampleNames: names
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: error.message 
    }, { status: 500 })
  }
}
