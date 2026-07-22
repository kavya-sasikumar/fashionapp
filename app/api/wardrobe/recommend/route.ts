import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function generateOutfitRecommendations(items: any[]) {
  const itemsList = items
    .map(
      (item) =>
        `- ${item.item_description} (Color: ${item.color}, Category: ${item.category})`
    )
    .join('\n')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a fashion stylist. Based on these wardrobe items, create 5 outfit combinations with styling tips.

Wardrobe Items:
${itemsList}

Return ONLY a JSON array with this exact format (no markdown, just raw JSON):
[
  {
    "items": ["item 1", "item 2", "item 3"],
    "description": "brief outfit description",
    "styleTips": ["tip 1", "tip 2", "tip 3"],
    "occasion": "where to wear this"
  }
]

Make sure to:
1. Create realistic outfit combinations
2. Provide specific styling tips for matching
3. Suggest appropriate occasions
4. Consider color harmony and balance
5. Mix different pieces from the wardrobe

Return ONLY the JSON array, nothing else.`,
        },
      ],
    }),
  })

  const data = await response.json()
  const content = data.content[0]

  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Could not parse recommendations')
  }

  return JSON.parse(jsonMatch[0])
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: items, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    if (!items || items.length < 1) {
      return NextResponse.json(
        { error: 'Need at least 1 item in wardrobe for recommendations' },
        { status: 400 }
      )
    }

    const outfits = await generateOutfitRecommendations(items)

    return NextResponse.json({ outfits })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
