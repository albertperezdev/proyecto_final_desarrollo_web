import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.deleteMenu(id)
  return NextResponse.json({ success: true })
}
