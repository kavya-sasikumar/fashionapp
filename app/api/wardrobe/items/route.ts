import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import postgres from 'postgres'

export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = postgres(process.env.DATABASE_URL!)

    const items = await sql`
      SELECT * FROM wardrobe_items
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    await sql.end()

    return NextResponse.json(items)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
