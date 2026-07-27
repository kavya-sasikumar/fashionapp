import { NextRequest, NextResponse } from 'next/server'
import { getBoardId } from '@/lib/boardMap'

export async function GET(req: NextRequest) {
    const token = process.env.PINTEREST_ACCESS_TOKEN
    const event = req.nextUrl.searchParams.get('event')
    const gender = req.nextUrl.searchParams.get('gender') as 'women' | 'men'

    const boardId = event && gender ? getBoardId(event, gender) : undefined

    console.log('Token exists:', !!token, 'Length:', token?.length)
    console.log('Event:', event, 'Gender:', gender, 'Board ID:', boardId)

    if (!boardId) {
        return NextResponse.json({ error: 'Unknown board' }, { status: 400 })
    }

    const res = await fetch(
        `https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=25`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()
    return NextResponse.json(data)
}