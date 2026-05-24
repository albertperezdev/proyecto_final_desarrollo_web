'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Save, RotateCcw, Trash2 } from 'lucide-react'

const SECTION_TEMPLATES: Record<string, Record<string, unknown>> = {
  HERO: { heading: '', subtitle: '', ctaText: '', ctaUrl: '' },
  TEXT: { html: '' },
  GALLERY: { images: [] },
  CTA: { text: '', buttonText: '', buttonUrl: '' },
  FEATURES: { items: [] },
  TESTIMONIALS: { items: [] },
}

export default function SectionEditor({
  section, onUpdate,
}: {
  section: Record<string, unknown>
  onUpdate: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState<Record<string, unknown>>((section.content as Record<string, unknown>) || {})

  const sectionType = section.type as string

  const handleUpdate = async () => {
    await fetch(`/api/sections/${section.id as string}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    onUpdate()
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sección?')) return
    await fetch(`/api/sections/${section.id as string}`, { method: 'DELETE' })
    onUpdate()
  }

  const handleResetTemplate = () => {
    const template = SECTION_TEMPLATES[sectionType]
    if (template) setContent({ ...template } as Record<string, unknown>)
  }

  const getSectionTypeBadge = (type: string) => {
    switch (type) {
      case 'HERO': return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10'
      case 'TEXT': return 'text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10'
      case 'GALLERY': return 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10'
      case 'CTA': return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
      case 'FEATURES': return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
      case 'TESTIMONIALS': return 'text-pink-700 bg-pink-50 dark:text-pink-400 dark:bg-pink-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"

  const renderContentFields = () => {
    switch (sectionType) {
      case 'HERO':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Heading</label>
              <input type="text" value={(content.heading as string) || ''} onChange={(e) => setContent({ ...content, heading: e.target.value })}
                placeholder="Título principal" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Subtítulo</label>
              <input type="text" value={(content.subtitle as string) || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Texto descriptivo" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Texto del botón</label>
                <input type="text" value={(content.ctaText as string) || ''} onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                  placeholder="CTA text" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">URL del botón</label>
                <input type="text" value={(content.ctaUrl as string) || ''} onChange={(e) => setContent({ ...content, ctaUrl: e.target.value })}
                  placeholder="https://..." className={`${inputClass} font-mono`} />
              </div>
            </div>
          </div>
        )
      case 'TEXT':
        return (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Contenido HTML</label>
            <textarea value={(content.html as string) || ''} onChange={(e) => setContent({ ...content, html: e.target.value })}
              placeholder="<p>Tu contenido aquí...</p>" className={`${inputClass} font-mono`} rows={6} />
          </div>
        )
      case 'GALLERY':
        return (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">URLs de imágenes (una por línea)</label>
            <textarea value={((content.images as string[]) || []).join('\n')} onChange={(e) => setContent({ ...content, images: e.target.value.split('\n').filter(Boolean) })}
              placeholder="https://ejemplo.com/imagen1.jpg" className={`${inputClass} font-mono`} rows={4} />
          </div>
        )
      default:
        return (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Contenido JSON</label>
            <textarea value={JSON.stringify(content, null, 2)} onChange={(e) => { try { setContent(JSON.parse(e.target.value)) } catch { } }}
              className={`${inputClass} font-mono text-xs`} rows={6} />
          </div>
        )
    }
  }

  return (
    <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <p className="font-medium text-foreground text-sm">{section.title as string}</p>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getSectionTypeBadge(sectionType)}`}>{sectionType}</span>
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4 animate-fade-in">
          {renderContentFields()}
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-xs hover:bg-primary/90 transition-all shadow-md">
              <Save className="w-3.5 h-3.5" />
              Guardar
            </button>
            <button onClick={handleResetTemplate} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-muted text-foreground rounded-xl font-medium text-xs hover:bg-muted/80 transition-all border border-border">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button onClick={handleDelete} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-destructive/10 text-destructive rounded-xl font-medium text-xs hover:bg-destructive/20 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
