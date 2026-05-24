import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/', 'video/', 'audio/', 'application/pdf', 'application/zip']

function getResourceType(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'IMAGE' as const
  if (mimeType.startsWith('video/')) return 'VIDEO' as const
  if (mimeType.startsWith('audio/')) return 'AUDIO' as const
  if (mimeType.includes('pdf')) return 'DOCUMENT' as const
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'ARCHIVE' as const
  return 'DOCUMENT' as const
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    const allowed = ALLOWED_TYPES.some((t) => file.type.startsWith(t))
    if (!allowed) {
      return NextResponse.json({ error: 'Tipo de archivo no soportado' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(file.name)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const filepath = path.join(uploadsDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    const resource = await db.createResource(session.id, {
      name: file.name,
      type: getResourceType(file.type),
      url,
      blobUrl: url,
      mimeType: file.type,
      size: file.size,
    })

    return NextResponse.json({ success: true, resource })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
  }
}
