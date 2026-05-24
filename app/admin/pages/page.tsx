import { getCurrentUser } from '@/lib/user'
import { db } from '@/lib/db/services'
import Link from 'next/link'
import { Plus, FileText, ExternalLink, Calendar } from 'lucide-react'

export default async function PagesPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const pages = await db.getPages(user.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
      case 'DRAFT':
        return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publicado'
      case 'DRAFT': return 'Borrador'
      case 'ARCHIVED': return 'Archivado'
      default: return status
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Páginas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Administra todas tus páginas</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nueva página
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-mono">/{page.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(page.status)}`}>
                      {getStatusLabel(page.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">{new Date(page.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Editar
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No tienes páginas aún</h3>
          <p className="text-sm text-muted-foreground mb-6">Comienza creando tu primera página para tu sitio web</p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Crear primera página
          </Link>
        </div>
      )}
    </div>
  )
}
