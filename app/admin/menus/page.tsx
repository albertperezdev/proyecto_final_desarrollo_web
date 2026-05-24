'use client'

import { useEffect, useState } from 'react'
import MenuEditor from '@/components/admin/menu-editor'
import { LayoutGrid, Plus, Loader2 } from 'lucide-react'

interface MenuData { id: string; name: string; slug: string; description: string | null }

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMenus() }, [])

  const loadMenus = async () => {
    const res = await fetch('/api/menus')
    const data = await res.json()
    setMenus(data.menus as MenuData[])
    setLoading(false)
  }

  const handleCreateMenu = async (name: string, slug: string) => {
    const res = await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    const data = await res.json()
    setMenus([data.menu as MenuData, ...menus])
  }

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este menú?')) return
    await fetch(`/api/menus/${id}`, { method: 'DELETE' })
    setMenus(menus.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Menús de navegación</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Administra los menús de tu sitio web</p>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-3 text-sm text-muted-foreground">Cargando menús...</span>
          </div>
        ) : menus.length > 0 ? (
          <div className="stagger-children space-y-4">
            {menus.map((menu) => <MenuEditor key={menu.id} menu={menu as unknown as Record<string, unknown>} onDelete={() => handleDeleteMenu(menu.id)} onUpdate={loadMenus} />)}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <LayoutGrid className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tienes menús aún</h3>
            <p className="text-sm text-muted-foreground">Crea tu primer menú usando el formulario de abajo</p>
          </div>
        )}
      </div>

      {/* Create menu form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Crear nuevo menú
        </h3>
        <MenuCreator onCreate={handleCreateMenu} />
      </div>
    </div>
  )
}

function MenuCreator({ onCreate }: { onCreate: (name: string, slug: string) => void }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onCreate(name, slug); setName(''); setSlug('') }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Nombre del menú</label>
        <input type="text" value={name} onChange={(e) => { setName(e.target.value); setSlug(generateSlug(e.target.value)) }} required
          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Menú principal" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
          className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono" placeholder="menu-principal" />
      </div>
      <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
        <Plus className="w-4 h-4" />
        Crear menú
      </button>
    </form>
  )
}
