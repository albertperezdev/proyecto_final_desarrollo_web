import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db/services'
import {
  FileText, ImageIcon, LayoutGrid, Layers, BarChart3,
  ClipboardList, ArrowRight, Sparkles, Zap, Shield
} from 'lucide-react'

export default async function HomePage() {
  const session = await getSession()
  const publishedPages = await db.getPublishedPages()

  const features = [
    { icon: FileText, title: 'Gestión de Páginas', desc: 'Crea y administra páginas con editor visual intuitivo y vista previa en tiempo real', color: 'from-indigo-500 to-purple-500' },
    { icon: ImageIcon, title: 'Biblioteca Multimedia', desc: 'Sube imágenes, videos y archivos. Organiza y optimiza tu contenido multimedia', color: 'from-amber-500 to-orange-500' },
    { icon: LayoutGrid, title: 'Menús Personalizados', desc: 'Configura menús de navegación multi-nivel sin necesidad de escribir código', color: 'from-emerald-500 to-teal-500' },
    { icon: Layers, title: 'Secciones Flexibles', desc: 'Plantillas hero, galerías, CTAs, testimonios y más listas para usar', color: 'from-rose-500 to-pink-500' },
    { icon: BarChart3, title: 'Dashboard Intuitivo', desc: 'Panel de control con métricas, acciones rápidas y vista general del contenido', color: 'from-cyan-500 to-blue-500' },
    { icon: ClipboardList, title: 'Historial de Cambios', desc: 'Auditoría completa: registra cada acción con detalle y trazabilidad', color: 'from-violet-500 to-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">CMS Sistema</span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                Admin Panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-foreground/80 hover:text-foreground font-medium text-sm transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                >
                  Registrarse
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <Zap className="w-3.5 h-3.5" />
              Plataforma CMS moderna y eficiente
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Gestión de Contenidos
            <br />
            <span className="gradient-text">Simple y Poderosa</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            Administra páginas, secciones, recursos y menús de forma fácil y eficiente.
            Todo lo que necesitas para gestionar tu sitio web en un solo lugar.
          </p>

          {!session && (
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground rounded-xl font-semibold text-base hover:bg-muted transition-all"
              >
                Ya tengo cuenta
              </Link>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '320ms' }}>
            {[
              { icon: Shield, text: 'Seguro' },
              { icon: Zap, text: 'Rápido' },
              { icon: Sparkles, text: 'Moderno' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-muted-foreground text-sm">
                <badge.icon className="w-4 h-4 text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Herramientas potentes y fáciles de usar para gestionar tu contenido web
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-card border border-border rounded-2xl p-7 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Published Pages ── */}
      {publishedPages.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">Páginas publicadas</h2>
                <p className="text-muted-foreground">Explora el contenido disponible</p>
              </div>
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {publishedPages.length} {publishedPages.length === 1 ? 'página' : 'páginas'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {publishedPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="group bg-card border border-border rounded-2xl p-7 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{page.description}</p>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <span className="text-xs text-primary font-medium">Leer más</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-foreground text-sm">CMS Sistema</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CMS Sistema. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
