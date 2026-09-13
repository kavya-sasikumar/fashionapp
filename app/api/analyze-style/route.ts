import { NextResponse } from 'next/server'

async function urlToBase64(url: string) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const mediaType = res.headers.get('content-type') || 'image/jpeg'
  return { base64, mediaType }
}

export async function POST(req: Request) {
  try {
    const { imageUrls } = await req.json()

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'No image URLs provided' }, { status: 400 })
    }

    const imageBlocks = await Promise.all(
      imageUrls.map(async (url: string) => {
        const { base64, mediaType } = await urlToBase64(url)
        return {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        }
      })
    )

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system:
          'You are a warm, knowledgeable personal fashion stylist. ' +
          'Analyze the outfit style images the user has selected and describe their personal aesthetic in 2-3 sentences, ' +
          '-Write directly in second person (e.g. romantic, minimalist, edgy) and what kind of pieces they gravitate toward.',
        messages: [
          {
            role: 'user',
            content: [
              ...imageBlocks,
              { type: 'text', text: 'Here are the 3 outfit styles I selected:' },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API error:', error)
      return NextResponse.json({ error: 'Failed to analyze styles' }, { status: 500 })
    }

    const data = await response.json()
    const textBlock = data.content.find((b: any) => b.type === 'text')

    if (!textBlock) {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    return NextResponse.json({ text: textBlock.text })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}