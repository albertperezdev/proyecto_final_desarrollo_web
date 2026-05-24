import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, role: true, firstName: true, lastName: true, avatar: true },
  })

  return NextResponse.json({ user: profile })
}
