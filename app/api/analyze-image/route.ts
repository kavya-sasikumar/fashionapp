import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64
              }
            },
            {
              type: 'text',
              text: `Analyze this full-body photo and estimate the person's body measurements.

              Please provide your best estimates for:
              - Bust/Chest circumference (in inches)
              - Waist circumference (in inches)
              - Hip circumference (in inches)

              Return ONLY a JSON object with this exact format, no other text:
              {"bust": NUMBER, "waist": NUMBER, "hips": NUMBER}

              Use standard clothing measurement conventions. For reference:
              - XS women typically: bust 33", waist 25", hips 35"
              - S women typically: bust 35", waist 27", hips 37"
              - M women typically: bust 37.4", waist 29", hips 39"
              - L women typically: bust 40.5", waist 31", hips 42"
              - XS men typically: chest 35", waist 28", hips 36"
              - S men typically: chest 37", waist 30", hips 38"
              - M men typically: chest 39", waist 32", hips 40"`
            }
          ]
        }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse measurements from response')
    }

    const measurements = JSON.parse(jsonMatch[0])
    return NextResponse.json(measurements)

  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }
}
