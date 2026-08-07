import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import postgres from 'postgres'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  const { id } = await params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = postgres(process.env.DATABASE_URL!)

    await sql`
      DELETE FROM wardrobe_items
      WHERE id = ${id} AND user_id = ${userId}
    `

    await sql.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
