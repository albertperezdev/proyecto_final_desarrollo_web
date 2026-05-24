import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const section = await db.updateSection(id, session.id, body)
  return NextResponse.json({ section })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  await db.deleteSection(id, session.id)
  return NextResponse.json({ success: true })
}
