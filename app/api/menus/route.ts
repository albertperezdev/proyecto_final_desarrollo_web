import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function GET() {
  const menus = await db.getMenus()
  return NextResponse.json({ menus })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const body = await req.json()
  const menu = await db.createMenu(session.id, body)
  return NextResponse.json({ menu })
}
