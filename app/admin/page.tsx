import { getCurrentUser } from '@/lib/user'
import { db } from '@/lib/db/services'
import Link from 'next/link'
import {
  FileText, ImageIcon, Activity, Plus, LayoutGrid,
  ArrowRight, TrendingUp, Clock
} from 'lucide-react'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user) return null

  const pages = await db.getPages(user.id)
  const resources = await db.getResources(user.id)
  const auditLogs = await db.getAuditLogs(user.id, 5)

  const stats = [
    {
      label: 'Páginas',
      value: pages.length,
      href: '/admin/pages',
      icon: FileText,
      gradient: 'from-indigo-500 to-purple-500',
      bgLight: 'bg-indigo-50 dark:bg-indigo-500/10',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Recursos',
      value: resources.length,
      href: '/admin/resources',
      icon: ImageIcon,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 dark:bg-amber-500/10',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Actividad',
      value: auditLogs.length,
      href: '/admin/audit-logs',
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="w-3.5 h-3.5" />
      case 'UPDATE': return <TrendingUp className="w-3.5 h-3.5" />
      case 'DELETE': return <Activity className="w-3.5 h-3.5" />
      default: return <Clock className="w-3.5 h-3.5" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
      case 'UPDATE': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10'
      case 'DELETE': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Bienvenido de vuelta 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Aquí tienes un resumen de tu contenido
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-card border border-border rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bgLight} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/admin/pages/new"
            className="group flex items-center gap-3 px-5 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Nueva página</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="/admin/menus"
            className="group flex items-center gap-3 px-5 py-3.5 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            </div>
            <span>Administrar menús</span>
            <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {auditLogs.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Actividad reciente
            </h2>
            <Link href="/admin/audit-logs" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              Ver todo
            </Link>
          </div>
          <div className="space-y-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
