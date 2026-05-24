'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Link as LinkIcon, LayoutGrid } from 'lucide-react'

export default function MenuEditor({
  menu, onDelete, onUpdate,
}: {
  menu: Record<string, unknown>
  onDelete: () => void
  onUpdate: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [parentId, setParentId] = useState('')

  const items = (menu.items as Record<string, unknown>[]) || (menu.MenuItem as Record<string, unknown>[]) || []
  const topLevelItems = items.filter((item: Record<string, unknown>) => !item.parentId)

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim() || !newUrl.trim()) return

    await fetch('/api/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menuId: menu.id as string, label: newLabel, url: newUrl, order: items.length, parentId: parentId || undefined,
      }),
    })
    setNewLabel(''); setNewUrl(''); setParentId('')
    onUpdate()
  }

  const handleDeleteItem = async (itemId: string) => {
    await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' })
    onUpdate()
  }

  const renderItems = (itemsList: Record<string, unknown>[], depth = 0) => (
    <div className="space-y-1.5" style={{ marginLeft: depth * 20 }}>
      {itemsList.map((item: Record<string, unknown>) => {
        const childItems = items.filter((i: Record<string, unknown>) => i.parentId === item.id)
        return (
          <div key={item.id as string}>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border/50 hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{item.label as string}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.url as string}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id as string)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {childItems.length > 0 && renderItems(childItems, depth + 1)}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{menu.name as string}</h3>
            <p className="text-xs text-muted-foreground font-mono">/{menu.slug as string}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-5 space-y-4 animate-fade-in">
          {items.length > 0 && <div className="mb-4">{renderItems(topLevelItems)}</div>}

          <form onSubmit={handleAddItem} className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Agregar elemento
            </h4>
            <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Etiqueta"
              className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
            <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="URL"
              className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono" />
            {topLevelItems.length > 0 && (
              <select value={parentId} onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                <option value="">Sin padre (nivel superior)</option>
                {topLevelItems.map((item: Record<string, unknown>) => (
                  <option key={item.id as string} value={item.id as string}>Hijo de: {item.label as string}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-md">
                <Plus className="w-4 h-4" />
                Agregar
              </button>
              <button type="button" onClick={onDelete} className="px-4 py-2.5 bg-destructive/10 text-destructive rounded-xl font-medium text-sm hover:bg-destructive/20 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
