'use client'

import { useEffect, useState } from 'react'
import ResourceUploader from '@/components/admin/resource-uploader'
import { ImageIcon, Film, Music, FileText, Archive, Paperclip, Trash2, Loader2 } from 'lucide-react'

interface ResourceData { id: string; name: string; type: string; url: string; blobUrl: string | null; mimeType: string | null; size: number | null }

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    const res = await fetch('/api/resources')
    const data = await res.json()
    setResources(data.resources as ResourceData[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este recurso?')) return
    await fetch('/api/resources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setResources(resources.filter((r) => r.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon className="w-8 h-8 text-indigo-500" />
      case 'VIDEO': return <Film className="w-8 h-8 text-rose-500" />
      case 'AUDIO': return <Music className="w-8 h-8 text-emerald-500" />
      case 'DOCUMENT': return <FileText className="w-8 h-8 text-amber-500" />
      case 'ARCHIVE': return <Archive className="w-8 h-8 text-slate-500" />
      default: return <Paperclip className="w-8 h-8 text-muted-foreground" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'IMAGE': return 'text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10'
      case 'VIDEO': return 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'
      case 'AUDIO': return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
      case 'DOCUMENT': return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
      case 'ARCHIVE': return 'text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Biblioteca de recursos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Administra imágenes, videos y archivos</p>
      </div>

      <ResourceUploader onUploadComplete={loadResources} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-3 text-sm text-muted-foreground">Cargando recursos...</span>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {resources.map((resource) => (
            <div key={resource.id} className="group bg-card border border-border rounded-2xl overflow-hidden card-hover">
              {resource.type === 'IMAGE' && resource.blobUrl ? (
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={resource.blobUrl}
                    alt={resource.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center bg-muted/50">
                  {getTypeIcon(resource.type)}
                </div>
              )}
              <div className="p-4">
                <p className="font-medium text-foreground text-sm truncate mb-2">{resource.name}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getTypeBadge(resource.type)}`}>
                    {resource.type}
                  </span>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ImageIcon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No tienes recursos aún</h3>
          <p className="text-sm text-muted-foreground">Sube tu primer archivo usando el área de arriba</p>
        </div>
      )}
    </div>
  )
}
