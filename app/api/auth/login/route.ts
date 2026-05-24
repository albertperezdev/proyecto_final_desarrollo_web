import prisma from '@/lib/prisma'
import { comparePassword, createToken, setSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({ where: { email } })
    if (!profile) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const valid = await comparePassword(password, profile.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createToken({ id: profile.id, email: profile.email, role: profile.role })
    await setSession(token)

    return NextResponse.json({ success: true, user: { id: profile.id, email: profile.email, role: profile.role } })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
