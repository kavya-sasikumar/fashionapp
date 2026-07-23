import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

async function analyzeClothingWithClaude(base64: string, mediaType: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this clothing item and return ONLY a JSON object with this exact format:
{"item_description": "brief description", "color": "main color", "category": "category like Tops, Bottoms, Dresses, Jackets, etc"}

Be concise.`,
            },
          ],
        },
      ],
    }),
  })

  const data = await response.json()
  const content = data.content[0]

  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse clothing analysis')
  }

  return JSON.parse(jsonMatch[0])
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    // Store image as base64 data URL (Claude analysis disabled temporarily)
    const imageDataUrl = `data:${mediaType};base64,${base64}`

    const { data: itemData, error: dbError } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: userId,
        image_url: imageDataUrl,
        item_description: 'Clothing item',
        color: 'Unknown',
        category: 'Uncategorized',
      })
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    return NextResponse.json(itemData)
  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.message : JSON.stringify(error))
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upload item',
      details: JSON.stringify(error)
    }, { status: 500 })
  }
}
