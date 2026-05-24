'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { LogOut, Sun, Moon, Monitor, User } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/pages': 'Páginas',
  '/admin/pages/new': 'Nueva página',
  '/admin/sections': 'Secciones',
  '/admin/resources': 'Recursos',
  '/admin/menus': 'Menús',
  '/admin/users': 'Usuarios',
  '/admin/audit-logs': 'Historial',
}

export default function AdminHeader({ user }: { user: { id: string; email: string; role: string } }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    setIsLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const currentTitle = pageTitles[pathname] ||
    (pathname.startsWith('/admin/pages/') ? 'Editor de página' : 'Admin')

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const themeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4" />
    if (theme === 'light') return <Sun className="w-4 h-4" />
    return <Monitor className="w-4 h-4" />
  }

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Page title */}
        <div>
          <h2 className="text-base font-semibold text-foreground">{currentTitle}</h2>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title={`Tema: ${theme}`}
          >
            {themeIcon()}
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 pl-2 ml-2 border-l border-border">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">{user.email}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
