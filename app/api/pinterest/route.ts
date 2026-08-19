import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const token = process.env.PINTEREST_ACCESS_TOKEN
    const boardId = req.nextUrl.searchParams.get('boardId')

    const res = await fetch(
        `https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=25`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()
    return NextResponse.json(data)
}