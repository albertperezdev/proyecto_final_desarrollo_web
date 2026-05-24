import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const profile = await prisma.profile.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, role: true, firstName: true, lastName: true },
  })

  return profile
}
