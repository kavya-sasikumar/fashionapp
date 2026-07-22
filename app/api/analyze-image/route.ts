import { NextResponse } from 'next/server'

async function callAnthropicAPI(base64: string, mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
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
                text: `Based on this photo, estimate what clothing size this person would typically wear. This is for a clothing fit recommendation tool.

Return ONLY a JSON object with this exact format, no other text:
{"bust": NUMBER, "waist": NUMBER, "hips": NUMBER}

Provide realistic clothing size estimates. Reference sizes:
- XS: bust 33", waist 25", hips 35"
- S: bust 35", waist 27", hips 37"
- M: bust 37.4", waist 29", hips 39"
- L: bust 40.5", waist 31", hips 42"
- XL: bust 43", waist 33", hips 44"`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API error:', error)
      throw new Error(`API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.content[0]

    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    console.log('Claude response:', content.text)

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('Could not find JSON in response:', content.text)
      throw new Error('Could not parse measurements from response')
    }

    const measurements = JSON.parse(jsonMatch[0])
    return NextResponse.json(measurements)
    } catch (error) {
      console.error('Image analysis error:', error)
      if (i === retries - 1) {
        return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
      }
    }
  }
  return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
}

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

    return await callAnthropicAPI(base64, mediaType)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}
