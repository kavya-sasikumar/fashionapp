import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query')
    const token = process.env.PINTEREST_ACCESS_TOKEN

    const res = await fetch(
        'https://api.pinterest.com/v5/pins?query=${encodeURIComponent(query!)}&page_size=6', 
    { headers: { Authorization: 'Bearer ${token}' } }
    )

    const data = await res.json()
    return NextResponse.json(data)
}