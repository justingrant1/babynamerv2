import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { NameData } from '@/lib/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { characteristics, gender, specificOptions, generatedNames } = await request.json()
    const supabase = await createClient()

    // Get current user (optional - allow unauthenticated users)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let generationsToday = 0
    let seenNamesList: string[] = []

    // Only check limits and track seen names for authenticated users
    if (user) {
      // Get user profile to check generation limits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
      }

      // Check if user needs generation count reset
      const today = new Date().toISOString().split('T')[0]
      const lastGenDate = profile.last_generation_date
      
      generationsToday = profile.generations_today
      if (lastGenDate !== today) {
        generationsToday = 0
      }

      // Enforce limits for non-premium users
      if (!profile.is_premium && generationsToday >= 3) {
        return NextResponse.json(
          { error: 'Free users are limited to 3 generations per day. Upgrade to Premium for unlimited generations!' },
          { status: 403 }
        )
      }

      // Get names the user has already seen
      const { data: seenNames } = await supabase
        .from('user_seen_names')
        .select('name_id, names(name)')
        .eq('user_id', user.id)

      seenNamesList = seenNames?.map(sn => (sn.names as any).name) || []
    }

    const allExcludedNames = [...seenNamesList, ...(generatedNames || [])]

    // Build the prompt for OpenAI
    const genderPrompt =
      gender === 'any'
        ? 'any gender (boy, girl, or unisex)'
        : gender === 'boy'
        ? 'boy'
        : gender === 'girl'
        ? 'girl'
        : 'unisex'

    let prompt = `Generate 5 unique baby names for a ${genderPrompt}.`

    if (characteristics.length > 0) {
      prompt += `\n\nThe names should have these characteristics: ${characteristics.join(', ')}.`
    }

    if (specificOptions) {
      // Handle the new characteristic values format with detailed instructions
      Object.entries(specificOptions).forEach(([key, value]) => {
        if (value) {
          // Map characteristic to specific instruction
          switch (key) {
            case 'Origin':
              prompt += `\n\nIMPORTANT: All names MUST be of ${value} origin.`
              break
            case 'Meaning':
              prompt += `\n\nIMPORTANT: Names should have meanings related to: ${value}`
              break
            case 'Uniqueness':
              prompt += `\n\nIMPORTANT: Names should be ${value}`
              break
            case 'Popularity':
              prompt += `\n\nIMPORTANT: Names should be ${value}`
              break
            case 'Sound':
              prompt += `\n\nIMPORTANT: Names should have ${value}`
              break
            case 'Length':
              prompt += `\n\nIMPORTANT: Names should be ${value}`
              break
            case 'Cultural Significance':
              prompt += `\n\nIMPORTANT: Names should have ${value} significance`
              break
            case 'Spelling':
              prompt += `\n\nIMPORTANT: Names should have ${value} spellings`
              break
            case 'Family Tradition':
              prompt += `\n\nIMPORTANT: Names should follow ${value} tradition`
              break
            case 'Religious Significance':
              prompt += `\n\nIMPORTANT: Names should have ${value} religious significance`
              break
            case 'Nickname Potential':
              prompt += `\n\nIMPORTANT: Names should have ${value} nickname potential`
              break
            case 'Starts with the letter':
              prompt += `\n\nIMPORTANT: All names MUST start with the letter "${value}"`
              break
            default:
              prompt += `\n\n${key}: ${value}`
          }
        }
      })
    }

    if (allExcludedNames.length > 0) {
      prompt += `\n\nDo NOT suggest any of these names that the user has already seen: ${allExcludedNames.join(', ')}`
    }

    prompt += `\n\nFor each name, provide:
1. The name itself
2. Gender (male, female, or unisex)
3. Origin/etymology
4. Meaning
5. Relevant characteristics from this list: ${characteristics.join(', ')}

Format as JSON array with this structure:
[
  {
    "name": "string",
    "gender": "male" | "female" | "unisex",
    "origin": "string",
    "meaning": "string",
    "characteristics": ["string"]
  }
]`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful baby name expert. Always respond with valid JSON arrays containing baby name suggestions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let names: NameData[]
    try {
      names = JSON.parse(content)
    } catch (e) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        names = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse OpenAI response')
      }
    }

    // Store names in database and track as seen by user (only for authenticated users)
    if (user) {
      for (const nameData of names) {
        // Check if name already exists
        const { data: existingName } = await supabase
          .from('names')
          .select('id')
          .eq('name', nameData.name)
          .single()

        let nameId: string

        if (existingName) {
          nameId = existingName.id
        } else {
          // Insert new name
          const { data: newName, error: insertError } = await supabase
            .from('names')
            .insert({
              name: nameData.name,
              gender: nameData.gender,
              origin: nameData.origin,
              meaning: nameData.meaning,
              characteristics: nameData.characteristics,
            })
            .select('id')
            .single()

          if (insertError || !newName) {
            console.error('Error inserting name:', insertError)
            continue
          }

          nameId = newName.id
        }

        // Mark as seen by user
        await supabase.from('user_seen_names').insert({
          user_id: user.id,
          name_id: nameId,
        })
      }

      // Update user's generation count
      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('profiles')
        .update({
          generations_today: generationsToday + 1,
          last_generation_date: today,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({ names })
  } catch (error: any) {
    console.error('Error generating names:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate names' },
      { status: 500 }
    )
  }
}
