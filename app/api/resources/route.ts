import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const resources = await db.getResources(session.id)
  return NextResponse.json({ resources })
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await req.json()
  await db.deleteResource(id, session.id)
  return NextResponse.json({ success: true })
}
