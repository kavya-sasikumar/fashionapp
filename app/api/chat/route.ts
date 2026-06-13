import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a warm, knowledgeable personal fashion stylist. Help users find outfits, understand sizing, and discover their personal style. Be specific, encouraging, and friendly. Keep responses concise.',
    messages
  })

  return result.toTextStreamResponse()
}