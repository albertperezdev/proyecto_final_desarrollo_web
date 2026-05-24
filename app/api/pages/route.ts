import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const pages = await db.getPages(session.id)
  return NextResponse.json({ pages })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const body = await req.json()
  const page = await db.createPage(session.id, body)
  return NextResponse.json({ page })
}
