import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import postgres from 'postgres'

async function generateOutfitRecommendations(items: any[]) {
  const itemsList = items
    .map((item) => `- ${item.item_description} (Color: ${item.color}, Category: ${item.category})`)
    .join('\n')

  try {
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
            content: `You are a fashion stylist. Based on these wardrobe items, create 3 outfit combinations with styling tips.

Wardrobe Items:
${itemsList}

Return ONLY a JSON array with this exact format (no markdown, just raw JSON):
[
  {
    "items": ["item 1", "item 2", "item 3"],
    "description": "brief outfit description",
    "styleTips": ["tip 1", "tip 2"],
    "occasion": "where to wear this"
  }
]

Return ONLY the JSON array.`,
          },
        ],
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.content?.[0]?.text) {
        const jsonMatch = data.content[0].text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      }
    }
  } catch (error) {
    console.error('Claude API error:', error)
  }

  // Fallback: Generate simple recommendations
  return items.slice(0, 3).map((item, i) => ({
    items: [item.item_description],
    description: `Outfit ${i + 1} featuring ${item.item_description}`,
    styleTips: [`Pair with complementary pieces`, `Consider the ${item.color} color`],
    occasion: 'Casual wear',
  }))
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = postgres(process.env.DATABASE_URL!)

    const items = await sql`SELECT * FROM wardrobe_items WHERE user_id = ${userId}`

    await sql.end()

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
