# CMS Sistema - Content Management System

Sistema completo de gestión de contenidos construido con **Next.js 16**, **Prisma ORM** y **PostgreSQL**.

## Características

- **Autenticación**: Login/registro con JWT + bcrypt
- **Gestión de Páginas**: CRUD completo con estados (DRAFT, PUBLISHED, ARCHIVED)
- **Secciones Dinámicas**: HERO, GALLERY, CTA, TEXT, FEATURES, TESTIMONIALS
- **Biblioteca Multimedia**: Upload de imágenes, videos, audio, documentos
- **Sistema de Menús**: Menús jerárquicos y personalizables
- **Gestión de Usuarios**: Roles (ADMIN, EDITOR, VIEWER)
- **Historial de Cambios**: Audit log de todas las acciones
- **Dashboard Admin**: Panel con estadísticas y acciones rápidas
- **Frontend Público**: Páginas publicadas visibles para visitantes
- **SEO**: Metadatos, Open Graph, títulos y descripciones

## Requisitos

- Node.js 18+
- Docker (con PostgreSQL)
- npm o pnpm

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd cms-system
npm install
```

### 2. Levantar PostgreSQL con Docker

Si no tenés un contenedor PostgreSQL, crealo:

```bash
docker run --name my-postgres -e POSTGRES_USER=alumno -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=course-db -p 5432:5432 -d postgres:16
```

Crear la base de datos `cms`:

```bash
docker exec my-postgres psql -U alumno -d course-db -c "CREATE DATABASE cms;"
```

### 3. Configurar variables de entorno

Copiá `.env.example` a `.env` o crealo con:

```env
DATABASE_URL="postgresql://alumno:123456@localhost:5432/cms"
JWT_SECRET="cambia-esta-clave-por-una-segura"
```

> Si usás otro usuario/contraseña, ajustá `DATABASE_URL` según corresponda.

### 4. Migrar la base de datos

```bash
npx prisma migrate dev --name init
```

Esto crea todas las tablas necesarias en la base `cms`.

### 5. Crear primer usuario ADMIN

Ejecutá el proyecto:

```bash
npm run dev
```

Abrí `http://localhost:3000`, registrate con tu email, y luego ejecutá en otra terminal:

```bash
docker exec my-postgres psql -U alumno -d course-db -c "UPDATE \"Profile\" SET \"role\" = 'ADMIN' WHERE \"email\" = 'tu@email.com';"
```

### 6. Desarrollo

```bash
npm run dev
```

El servidor se levanta en `http://localhost:3000`.

## Estructura del proyecto

```
app/
  /auth             # Login y registro
  /admin            # Panel administrativo
    /pages          # Gestión de páginas
    /sections       # Gestión de secciones
    /resources      # Biblioteca multimedia
    /menus          # Gestión de menús
    /users          # Gestión de usuarios
    /audit-logs     # Historial de cambios
  /[slug]           # Páginas públicas dinámicas

lib/
  /prisma.ts        # Cliente Prisma singleton
  /auth.ts          # Autenticación JWT + bcrypt
  /user.ts          # Helper para obtener usuario actual
  /db/services.ts   # Servicios de base de datos

app/api/            # API routes (autenticación, CRUD, upload)
components/admin    # Componentes del panel
prisma/schema.prisma # Esquema de base de datos
scripts/            # Scripts SQL
public/uploads/     # Archivos subidos
```

## Uso

### Admin Panel

**URL**: `http://localhost:3000/admin`

1. Iniciá sesión con tu cuenta de ADMIN
2. Crea páginas con secciones dinámicas
3. Subí recursos multimedia
4. Configurá menús de navegación
5. Publicá contenido

### Frontend Público

- Inicio: `http://localhost:3000/`
- Página: `http://localhost:3000/[slug]`

## Comandos útiles

```bash
# Ver contenedores activos
docker ps

# Acceder a la consola de PostgreSQL
docker exec -it my-postgres psql -U alumno -d course-db

# Ver tablas creadas
\dt

# Resetear base de datos (borra todo)
npx prisma migrate reset

# Abrir Prisma Studio (interfaz gráfica de la BD)
npx prisma studio
```

## Personalización

### Agregar nuevos tipos de sección

1. Agrega el valor al enum `SectionType` en `prisma/schema.prisma`
2. Ejecuta `npx prisma migrate dev`
3. Agrega UI en `components/admin/section-editor.tsx`
4. Agrega renderizado en `app/[slug]/page.tsx`

### Cambiar roles

```sql
UPDATE "Profile" SET "role" = 'ADMIN' WHERE "email" = 'usuario@email.com';
```
