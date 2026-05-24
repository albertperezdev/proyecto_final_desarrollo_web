import { getCurrentUser } from '@/lib/user'
import { db } from '@/lib/db/services'
import { Users, Calendar, Shield, UserCog, UserPen } from 'lucide-react'

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Acceso restringido</h3>
          <p className="text-sm text-muted-foreground">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    )
  }

  const profiles = await db.getAllProfiles()

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
      case 'EDITOR': return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
      default: return 'text-muted-foreground bg-muted border-border'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <UserCog className="w-3.5 h-3.5" />
      case 'EDITOR': return <UserPen className="w-3.5 h-3.5" />
      default: return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de usuarios</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Administra los usuarios del CMS</p>
      </div>

      {profiles.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {(p.firstName?.[0] || p.email[0]).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-foreground text-sm">{p.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{p.firstName} {p.lastName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(p.role)}`}>
                      {getRoleIcon(p.role)}
                      {p.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay usuarios registrados</h3>
          <p className="text-sm text-muted-foreground">Los usuarios aparecerán aquí una vez que se registren</p>
        </div>
      )}
    </div>
  )
}
