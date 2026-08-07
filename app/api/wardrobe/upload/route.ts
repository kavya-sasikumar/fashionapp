import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import postgres from 'postgres'

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = postgres(process.env.DATABASE_URL!)

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = file.type

    const imageDataUrl = `data:${mediaType};base64,${base64}`

    const result = await sql`
      INSERT INTO wardrobe_items (user_id, image_url, item_description, color, category)
      VALUES (${userId}, ${imageDataUrl}, 'Clothing item', 'Unknown', 'Uncategorized')
      RETURNING *
    `

    await sql.end()

    return NextResponse.json(result[0])
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('Upload error:', errorMsg)
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}
