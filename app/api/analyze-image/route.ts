import { NextResponse } from 'next/server'
import https from 'https'

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

    const payload = JSON.stringify({
      model: 'gpt-4o',
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
    })

    const result = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        rejectUnauthorized: false,
      }

      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) })
          } catch (e) {
            resolve({ status: res.statusCode, body: data })
          }
        })
      })

      req.on('error', reject)
      req.write(payload)
      req.end()
    })

    if (!result.body || typeof result.body !== 'object') {
      console.error('Invalid response:', result)
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 })
    }

    if (result.status !== 200) {
      console.error('OpenAI API error:', result.body)
      return NextResponse.json({
        error: 'Failed to analyze image',
        details: JSON.stringify(result.body)
      }, { status: 500 })
    }

    const content = result.body.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 })
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
