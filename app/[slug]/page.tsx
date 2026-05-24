import { db } from '@/lib/db/services'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await db.getPageBySlug(slug)

  if (!page || !page.published) return { title: 'Página no encontrada' }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description || undefined,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.description || undefined,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
  }
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const page = await db.getPageBySlug(slug)

  if (!page || !page.published) {
    notFound()
  }

  const menus = await db.getMenus()
  const menu = menus.find((m) => m.slug === 'main-menu')

  return (
    <div className="min-h-screen bg-background">
      {menu && (
        <nav className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex gap-8">
            {menu.items.filter((item) => !item.parentId).map((item) => (
              <a key={item.id} href={item.url} className="text-foreground hover:text-primary transition">
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-lg text-muted-foreground mb-8">{page.description}</p>
        )}

        {page.sections.length > 0 && (
          <div className="space-y-8">
            {page.sections.map((section) => (
              <section key={section.id} className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>

                {section.type === 'TEXT' && section.content && (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: (section.content as Record<string, string>).html || '' }}
                  />
                )}

                {section.type === 'GALLERY' && section.content && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.isArray((section.content as Record<string, string[]>).images) &&
                      (section.content as Record<string, string[]>).images.map((image: string, idx: number) => (
                        <img key={idx} src={image} alt={`Gallery item ${idx + 1}`} className="rounded-md object-cover w-full h-48" />
                      ))}
                  </div>
                )}

                {section.type === 'HERO' && section.content && (
                  <div className="text-center py-12">
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      {(section.content as Record<string, string>).heading}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {(section.content as Record<string, string>).subtitle}
                    </p>
                    {(section.content as Record<string, string>).ctaUrl && (
                      <a
                        href={(section.content as Record<string, string>).ctaUrl}
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
                      >
                        {(section.content as Record<string, string>).ctaText || 'Learn more'}
                      </a>
                    )}
                  </div>
                )}

                {section.type === 'CTA' && section.content && (
                  <div className="text-center py-8">
                    <p className="text-xl text-foreground mb-4">
                      {(section.content as Record<string, string>).text}
                    </p>
                    {(section.content as Record<string, string>).buttonUrl && (
                      <a
                        href={(section.content as Record<string, string>).buttonUrl}
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
                      >
                        {(section.content as Record<string, string>).buttonText || 'Más información'}
                      </a>
                    )}
                  </div>
                )}

                {section.type === 'FEATURES' && section.content && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.isArray((section.content as Record<string, unknown[]>).items) &&
                      (section.content as Record<string, unknown[]>).items.map((item: unknown, idx: number) => {
                        const feat = item as Record<string, string>
                        return (
                          <div key={idx} className="text-center">
                            <h4 className="font-bold text-foreground mb-2">{feat.title}</h4>
                            <p className="text-sm text-muted-foreground">{feat.description}</p>
                          </div>
                        )
                      })}
                  </div>
                )}

                {section.type === 'TESTIMONIALS' && section.content && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray((section.content as Record<string, unknown[]>).items) &&
                      (section.content as Record<string, unknown[]>).items.map((item: unknown, idx: number) => {
                        const test = item as Record<string, string>
                        return (
                          <div key={idx} className="bg-muted p-6 rounded-lg">
                            <p className="text-foreground mb-4 italic">&ldquo;{test.text}&rdquo;</p>
                            <p className="text-sm font-medium text-foreground">{test.author}</p>
                          </div>
                        )
                      })}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
