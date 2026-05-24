'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
  LayoutDashboard, FileText, Layers, ImageIcon,
  Menu as MenuIcon, Users, ClipboardList, Sparkles, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Páginas', icon: FileText },
  { href: '/admin/sections', label: 'Secciones', icon: Layers },
  { href: '/admin/resources', label: 'Recursos', icon: ImageIcon },
  { href: '/admin/menus', label: 'Menús', icon: MenuIcon },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/audit-logs', label: 'Historial', icon: ClipboardList },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-[260px] bg-card border-r border-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-foreground tracking-tight block leading-tight">CMS Admin</span>
            <span className="text-[11px] text-muted-foreground leading-none">Panel de control</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-2 pb-3">
          Navegación
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={clsx(
                'w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200',
                !active && 'group-hover:scale-110'
              )} />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="w-4 h-4 opacity-60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-3 py-3 rounded-xl bg-muted/60 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            CMS Sistema v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}
