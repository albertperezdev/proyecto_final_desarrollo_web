import { getCurrentUser } from '@/lib/user'
import { db } from '@/lib/db/services'
import {
  ClipboardList, Plus, RefreshCw, Trash2, Send,
  FileText, Layers, ImageIcon, LayoutGrid, Calendar, Clock
} from 'lucide-react'

export default async function AuditLogsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const auditLogs = await db.getAuditLogs(user.id, 100)

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE': return { color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', icon: <Plus className="w-3.5 h-3.5" /> }
      case 'UPDATE': return { color: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10', icon: <RefreshCw className="w-3.5 h-3.5" /> }
      case 'DELETE': return { color: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10', icon: <Trash2 className="w-3.5 h-3.5" /> }
      case 'PUBLISH': return { color: 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10', icon: <Send className="w-3.5 h-3.5" /> }
      default: return { color: 'text-muted-foreground bg-muted', icon: <Clock className="w-3.5 h-3.5" /> }
    }
  }

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'Page': return <FileText className="w-4 h-4" />
      case 'Section': return <Layers className="w-4 h-4" />
      case 'Resource': return <ImageIcon className="w-4 h-4" />
      case 'MenuItem': return <LayoutGrid className="w-4 h-4" />
      default: return <ClipboardList className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historial de cambios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Registro de todas tus acciones en el CMS</p>
        </div>
        {auditLogs.length > 0 && (
          <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {auditLogs.length} registros
          </span>
        )}
      </div>

      {auditLogs.length > 0 ? (
        <div className="space-y-2 stagger-children">
          {auditLogs.map((log) => {
            const actionBadge = getActionBadge(log.action)
            return (
              <div key={log.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 card-hover">
                {/* Entity icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${actionBadge.color}`}>
                  {getEntityIcon(log.entity)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${actionBadge.color}`}>
                      {actionBadge.icon}
                      {log.action}
                    </span>
                    <span className="text-sm font-medium text-foreground">{log.entity}</span>
                    <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                      {log.entityId.slice(0, 8)}...
                    </code>
                  </div>
                  {log.changes && (
                    <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
                      {JSON.stringify(log.changes).slice(0, 120)}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs whitespace-nowrap">{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground/70">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay cambios registrados</h3>
          <p className="text-sm text-muted-foreground">Las acciones que realices en el CMS se registrarán aquí</p>
        </div>
      )}
    </div>
  )
}
