'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Search, Globe, Save, Loader2 } from 'lucide-react'

export default function NewPagePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', seoTitle: '', seoDescription: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      if (data.user) setUserId(data.user.id)
      else router.push('/auth/login')
    })
  }, [router])

  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')

  const handleTitleChange = (value: string) => setFormData((prev) => ({ ...prev, title: value, slug: generateSlug(value) }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!userId) { setError('No autenticado'); return }
    setLoading(true)

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title, slug: formData.slug, description: formData.description, seoTitle: formData.seoTitle, seoDescription: formData.seoDescription,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la página')
      router.push(`/admin/pages/${data.page.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la página')
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nueva página</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Crea una nueva página para tu sitio web</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Información general
          </h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Título <span className="text-destructive">*</span></label>
            <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required
              className={inputClass} placeholder="Título de la página" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Slug <span className="text-destructive">*</span></label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} required
              className={`${inputClass} font-mono`} placeholder="titulo-de-la-pagina" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
            <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={inputClass} placeholder="Descripción breve de la página" rows={3} />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            SEO
          </h2>

          {/* SEO Preview */}
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Vista previa de búsqueda</p>
            <div className="space-y-1">
              <p className="text-blue-600 dark:text-blue-400 text-base font-medium truncate">
                {formData.seoTitle || formData.title || 'Título de la página'}
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-1">
                <Globe className="w-3 h-3" />
                tusitio.com/{formData.slug || 'slug'}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formData.seoDescription || formData.description || 'Descripción de la página que aparecerá en los resultados de búsqueda...'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">SEO Title</label>
            <input type="text" value={formData.seoTitle} onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
              className={inputClass} placeholder="Título para SEO (se usa el título principal si está vacío)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">SEO Description</label>
            <textarea value={formData.seoDescription} onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
              className={inputClass} placeholder="Descripción para motores de búsqueda" rows={3} />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium animate-scale-in">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md hover:shadow-lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando página...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Crear página
            </>
          )}
        </button>
      </form>
    </div>
  )
}
