import prisma from '@/lib/prisma'
import { hashPassword, createToken, setSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const existing = await prisma.profile.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const profile = await prisma.profile.create({
      data: { email, passwordHash, firstName, lastName },
    })

    const token = await createToken({ id: profile.id, email: profile.email, role: profile.role })
    await setSession(token)

    return NextResponse.json({ success: true, user: { id: profile.id, email: profile.email, role: profile.role } })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
