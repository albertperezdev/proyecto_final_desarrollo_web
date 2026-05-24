'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionEditor from '@/components/admin/section-editor'
import {
  ArrowLeft, Save, Trash2, Send, Loader2, Plus,
  FileText, Search, Info, CheckCircle2, AlertCircle, Calendar, Clock
} from 'lucide-react'

interface PageData { id: string; title: string; slug: string; description: string | null; content: unknown; status: string; seoTitle: string | null; seoDescription: string | null; ogImage: string | null; published: boolean; publishedAt: string | null; createdAt: string; updatedAt: string }
interface SectionData { id: string; pageId: string; title: string; type: string; content: unknown; order: number }

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string

  const [page, setPage] = useState<PageData | null>(null)
  const [sections, setSections] = useState<SectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', seoTitle: '', seoDescription: '', status: 'DRAFT' })

  useEffect(() => { loadPage() }, [pageId])

  const loadPage = async () => {
    const res = await fetch(`/api/pages/${pageId}`)
    const data = await res.json()
    const pageData = data.page
    if (pageData) {
      setPage(pageData as PageData)
      setFormData({ title: pageData.title, slug: pageData.slug, description: pageData.description || '', seoTitle: pageData.seoTitle || '', seoDescription: pageData.seoDescription || '', status: pageData.status })
      setSections((pageData.sections || []) as SectionData[])
    }
    setLoading(false)
  }

  const handleSavePage = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, slug: formData.slug, description: formData.description, seoTitle: formData.seoTitle, seoDescription: formData.seoDescription, status: formData.status }),
      })
      if (!res.ok) throw new Error()
      setMessage({ type: 'success', text: 'Página actualizada exitosamente' })
      setTimeout(() => setMessage(null), 3000)
    } catch { setMessage({ type: 'error', text: 'Error al actualizar la página' }) }
  }

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}/publish`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setMessage({ type: 'success', text: 'Página publicada exitosamente' })
      loadPage()
      setTimeout(() => setMessage(null), 3000)
    } catch { setMessage({ type: 'error', text: 'Error al publicar la página' }) }
  }

  const handleDeletePage = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta página?')) return
    try {
      const res = await fetch(`/api/pages/${pageId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.push('/admin/pages')
    } catch { setMessage({ type: 'error', text: 'Error al eliminar la página' }) }
  }

  const handleAddSection = async (type: string) => {
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, title: `Nueva sección ${type}`, type, content: {}, order: sections.length }),
      })
      if (!res.ok) throw new Error()
      setMessage({ type: 'success', text: 'Sección agregada' })
      loadPage()
      setTimeout(() => setMessage(null), 3000)
    } catch { setMessage({ type: 'error', text: 'Error al agregar sección' }) }
  }

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return { color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', label: 'Publicado' }
      case 'DRAFT': return { color: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', label: 'Borrador' }
      case 'ARCHIVED': return { color: 'text-muted-foreground bg-muted border-border', label: 'Archivado' }
      default: return { color: 'text-muted-foreground bg-muted border-border', label: status }
    }
  }

  const sectionTypeColors: Record<string, string> = {
    HERO: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10',
    TEXT: 'text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10',
    GALLERY: 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10',
    CTA: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10',
    FEATURES: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10',
    TESTIMONIALS: 'text-pink-700 bg-pink-50 dark:text-pink-400 dark:bg-pink-500/10',
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center animate-fade-in">
        <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Cargando página...</p>
      </div>
    </div>
  )

  if (!page) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Página no encontrada</p>
      </div>
    </div>
  )

  const statusBadge = getStatusBadge(formData.status)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-scale-in ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-destructive text-destructive-foreground'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-2 opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{formData.title || 'Sin título'}</h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Edita los detalles de tu página</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Información general
            </h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Título</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
              <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className={inputClass} rows={4} />
            </div>

            {/* SEO */}
            <div className="border-t border-border pt-4 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                SEO
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">SEO Description</label>
                <textarea value={formData.seoDescription} onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  className={inputClass} rows={3} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSavePage} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
              {formData.status === 'DRAFT' && (
                <button onClick={handlePublish} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-all shadow-md">
                  <Send className="w-4 h-4" />
                  Publicar
                </button>
              )}
              <button onClick={handleDeletePage} className="px-4 py-2.5 bg-destructive/10 text-destructive rounded-xl font-medium text-sm hover:bg-destructive/20 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Secciones
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['HERO', 'TEXT', 'GALLERY', 'CTA', 'FEATURES', 'TESTIMONIALS'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 ${sectionTypeColors[type] || 'text-muted-foreground bg-muted'}`}
                >
                  + {type}
                </button>
              ))}
            </div>
            {sections.length > 0 ? (
              <div className="space-y-2">{sections.map((section) => <SectionEditor key={section.id} section={section as unknown as Record<string, unknown>} onUpdate={loadPage} />)}</div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No hay secciones aún. Agrega una arriba.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Estado
            </h3>
            <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className={inputClass}>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </div>

          {/* Page info */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Información
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID:</span>
                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">{pageId.slice(0, 8)}...</code>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Creado: {new Date(page.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>Actualizado: {new Date(page.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
