import { NextResponse } from 'next/server'

export async function POST(request: any) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mediaType};base64,${base64}`,
                },
              },
              {
                type: 'text',
                text: `Analyze this image and provide measurements. Return ONLY JSON:
{"bust": NUMBER, "waist": NUMBER, "hips": NUMBER}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API error:', error)
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.content[0]

    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse measurements' }, { status: 500 })
    }

    const measurements = JSON.parse(jsonMatch[0])
    return NextResponse.json(measurements)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function POST(request: any) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
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
                  data: base64,
                },
              },
              {
                type: 'text',
                text: `Analyze this image and provide measurements. Return ONLY JSON:
{"bust": NUMBER, "waist": NUMBER, "hips": NUMBER}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      console.error('OpenAI API error:', error)
      return NextResponse.json({
        error: 'Failed to analyze image',
        details: JSON.stringify(error)
      }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse measurements' }, { status: 500 })
    }

    const measurements = JSON.parse(jsonMatch[0])
    return NextResponse.json(measurements)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('Analyze image error:', errorMsg)
    return NextResponse.json({
      error: 'Failed to process image',
      details: errorMsg
    }, { status: 500 })
  }
}