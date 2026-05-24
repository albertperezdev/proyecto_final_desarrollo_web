# Guía de Despliegue - CMS Sistema


### 1. Preparar el proyecto

```bash
# Asegurate que todo esté en git
git init
git add .
git commit -m "Initial commit: CMS Sistema"

# Push a GitHub
git push origin main
```

### 3. Configurar variables de entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```
DATABASE_URL = postgresql://...
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
BLOB_READ_WRITE_TOKEN = vercel_blob_...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = https://tudominio.com/auth/callback
```

### 4. Configurar base de datos

#### Opción A: Supabase (Recomendado)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia `DATABASE_URL` desde Supabase > Database > Connection String
3. Ejecuta las migraciones en Supabase SQL Editor:

```sql
-- Copia todo el contenido de scripts/001_init_cms.sql
-- Pégalo en Supabase SQL Editor y ejecuta
```

#### Opción B: Neon

1. Crea un proyecto en [neon.tech](https://neon.tech)
2. Copia `DATABASE_URL`
3. Ejecuta migraciones igual que con Supabase

### 5. Configurar Vercel Blob (Opcional)

Para habilitar la carga de multimedia:

1. En Vercel Dashboard > Storage > Create Database
2. Selecciona "Blob"
3. Copia `BLOB_READ_WRITE_TOKEN`

### 6. Deploy

```bash
git push origin main
```

Vercel deployará automáticamente. El site estará disponible en `https://tudominio.vercel.app`

## Configuración del dominio personalizado

1. En Vercel Dashboard > Domains
2. Agrega tu dominio personalizado
3. Actualiza los DNS según las instrucciones

## Verificar que todo funciona

1. **Página de inicio**: `https://tudominio.com/`
2. **Login**: `https://tudominio.com/auth/login`
3. **Panel admin**: `https://tudominio.com/admin` (requiere autenticación)

## Monitoreo y mantenimiento

### Ver logs

```bash
vercel logs --follow
```

### Variables de entorno

Puedes cambiar variables sin redeploy en Vercel Dashboard > Settings > Environment Variables

### Backups

Supabase hace backups automáticos. Ve a Supabase Dashboard > Database > Backups

## Troubleshooting en producción

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"

Verifica que las variables de entorno estén en Vercel Dashboard, no en `.env`

### Error: "BLOB_READ_WRITE_TOKEN is missing"

Agrega el token en Vercel Settings > Environment Variables

### Base de datos no conecta

Verifica que `DATABASE_URL` sea correcta y que Supabase no esté en pausa por inactividad

### Build falla

```bash
# En local, intenta:
pnpm install
pnpm exec prisma generate
pnpm build

# Si hay error, chequea:
# - Node.js version (debe ser 18+)
# - Todas las dependencias estén instaladas
# - DATABASE_URL sea válido
```

## Escalar a producción

### 1. Aumentar recursos

- **Supabase**: Plan Pro
- **Vercel**: Usar serverless con Pro/Enterprise
- **Blob**: Aumentar quota si es necesario

### 2. Optimizaciones

```typescript
// En next.config.js
export default {
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  // Enable React Compiler (nuevo en Next.js 16)
  reactCompiler: true,
}
```

### 3. CDN para recursos

```typescript
// En components para cargar imágenes
<Image
  src={imageUrl}
  alt="..."
  width={400}
  height={300}
  priority={false}
  // Vercel auto-optimiza imágenes
/>
```

## Performance

### Benchmarks esperados

- Tiempo de carga: < 2s (Lighthouse > 80)
- TTFB: < 200ms
- Core Web Vitals: Green

### Mejoras recomendadas

1. Habilitar Image Optimization (automático en Vercel)
2. Usar Database Connection Pooling (Supabase Pro)
3. Implementar caching con Redis (Upstash)

## Seguridad en producción

### Checklist

- [ ] Todas las variables secretas en environment variables
- [ ] `.env` no está en git (revisar `.gitignore`)
- [ ] RLS está habilitado en Supabase
- [ ] HTTPS es obligatorio
- [ ] Dominios permitidos están configurados en CORS
- [ ] Rate limiting está implementado
- [ ] Backups regulares están habilitados

### Headers de seguridad

Vercel automáticamente configura:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Rollback

Si algo sale mal en una versión:

```bash
# En Vercel Dashboard > Deployments
# Selecciona un deployment anterior y click "Promote to Production"
```

## Soporte

- **Vercel**: [vercel.com/help](https://vercel.com/help)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org](https://nextjs.org)
