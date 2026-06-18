import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, knowledgeable personal fashion stylist. Help users find outfits, understand sizing, and discover their personal style. Be specific, encouraging, and friendly. Keep responses concise.'
        },
        ...messages
      ]
    })

    const text = response.choices[0].message.content
    return NextResponse.json({ text })

  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}