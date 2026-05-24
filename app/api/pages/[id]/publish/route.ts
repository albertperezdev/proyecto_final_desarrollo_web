import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const page = await db.publishPage(id, session.id)
  return NextResponse.json({ page })
}
