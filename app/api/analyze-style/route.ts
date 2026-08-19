import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  try {
    const { imageUrls } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, knowledgeable personal fashion stylist. Analyze the outfit style images the user has selected and describe their personal aesthetic in 2-3 sentences, written directly to them in second person. Be specific about the style (e.g. romantic, minimalist, edgy) and what kind of pieces they gravitate toward.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Here are the 3 outfit styles I selected:' },
            ...imageUrls.map((url: string) => ({
              type: 'image_url',
              image_url: { url },
            })),
          ],
        },
      ],
    })

    const text = response.choices[0].message.content
    return NextResponse.json({ text })

  } catch (error) {
    console.error('OpenAI analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze styles' }, { status: 500 })
  }
}