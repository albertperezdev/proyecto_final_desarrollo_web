import prisma from '@/lib/prisma'
import { Prisma, SectionType, ResourceType, PageStatus } from '@prisma/client'

type AuditLogAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH'
type AuditLogEntity = 'Page' | 'Section' | 'Resource' | 'MenuItem'

async function createAuditLogEntry(params: {
  action: AuditLogAction
  entity: AuditLogEntity
  entityId: string
  userId: string
  changes?: Prisma.InputJsonValue
  pageId?: string
  sectionId?: string
  resourceId?: string
}) {
  await prisma.auditLog.create({ data: params as unknown as Prisma.AuditLogUncheckedCreateInput })
}

export const db = {
  async getProfile(id: string) {
    return prisma.profile.findUnique({ where: { id } })
  },

  async updateProfile(id: string, updates: Prisma.ProfileUpdateInput) {
    return prisma.profile.update({ where: { id }, data: updates })
  },

  async getAllProfiles() {
    return prisma.profile.findMany({ orderBy: { createdAt: 'desc' } })
  },

  // Page operations
  async createPage(userId: string, data: { title: string; slug: string; description?: string; seoTitle?: string; seoDescription?: string }) {
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        createdBy: userId,
      },
    })
    await createAuditLogEntry({ action: 'CREATE', entity: 'Page', entityId: page.id, userId })
    return page
  },

  async getPage(id: string) {
    return prisma.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { order: 'asc' } } },
    })
  },

  async getPageBySlug(slug: string) {
    return prisma.page.findUnique({
      where: { slug },
      include: { sections: { orderBy: { order: 'asc' } } },
    })
  },

  async getPublishedPages() {
    return prisma.page.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
  },

  async getPages(userId: string) {
    return prisma.page.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getAllPages() {
    return prisma.page.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async updatePage(id: string, userId: string, updates: Prisma.PageUpdateInput) {
    const page = await prisma.page.update({ where: { id }, data: updates })
    await createAuditLogEntry({ action: 'UPDATE', entity: 'Page', entityId: id, userId, changes: updates as Prisma.InputJsonValue })
    return page
  },

  async publishPage(id: string, userId: string) {
    const page = await prisma.page.update({
      where: { id },
      data: { published: true, status: 'PUBLISHED' as PageStatus, publishedAt: new Date() },
    })
    await createAuditLogEntry({ action: 'PUBLISH', entity: 'Page', entityId: id, userId })
    return page
  },

  async deletePage(id: string, userId: string) {
    await createAuditLogEntry({ action: 'DELETE', entity: 'Page', entityId: id, userId })
    await prisma.page.delete({ where: { id } })
  },

  // Section operations
  async createSection(userId: string, data: { pageId: string; title: string; type: SectionType; content?: Prisma.InputJsonValue; order?: number }) {
    const section = await prisma.section.create({
      data: {
        pageId: data.pageId,
        title: data.title,
        type: data.type,
        content: data.content ?? Prisma.DbNull,
        order: data.order ?? 0,
        createdBy: userId,
      },
    })
    await createAuditLogEntry({ action: 'CREATE', entity: 'Section', entityId: section.id, userId, pageId: section.pageId })
    return section
  },

  async updateSection(id: string, userId: string, updates: Prisma.SectionUpdateInput) {
    const section = await prisma.section.update({ where: { id }, data: updates })
    await createAuditLogEntry({ action: 'UPDATE', entity: 'Section', entityId: id, userId, pageId: section.pageId })
    return section
  },

  async deleteSection(id: string, userId: string) {
    const section = await prisma.section.findUnique({ where: { id } })
    await createAuditLogEntry({ action: 'DELETE', entity: 'Section', entityId: id, userId, pageId: section?.pageId })
    await prisma.section.delete({ where: { id } })
  },

  async getSectionsByPage(pageId: string) {
    return prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    })
  },

  async getSections(userId: string) {
    return prisma.section.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Resource operations
  async createResource(userId: string, data: { name: string; type: ResourceType; url: string; blobUrl?: string; mimeType?: string; size?: number; sectionId?: string }) {
    const resource = await prisma.resource.create({
      data: { ...data, createdBy: userId } as unknown as Prisma.ResourceUncheckedCreateInput,
    })
    await createAuditLogEntry({ action: 'CREATE', entity: 'Resource', entityId: resource.id, userId })
    return resource
  },

  async getResources(userId: string) {
    return prisma.resource.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getResourcesBySection(sectionId: string) {
    return prisma.resource.findMany({ where: { sectionId } })
  },

  async deleteResource(id: string, userId: string) {
    await createAuditLogEntry({ action: 'DELETE', entity: 'Resource', entityId: id, userId })
    await prisma.resource.delete({ where: { id } })
  },

  // Menu operations
  async createMenu(userId: string, data: { name: string; slug: string; description?: string }) {
    return prisma.menu.create({ data })
  },

  async getMenus() {
    return prisma.menu.findMany({
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
  },

  async deleteMenu(id: string) {
    await prisma.menu.delete({ where: { id } })
  },

  // MenuItem operations
  async createMenuItem(userId: string, data: { menuId: string; label: string; url: string; order?: number; parentId?: string }) {
    const item = await prisma.menuItem.create({
      data: { ...data, order: data.order ?? 0, createdBy: userId },
    })
    await createAuditLogEntry({ action: 'CREATE', entity: 'MenuItem', entityId: item.id, userId })
    return item
  },

  async deleteMenuItem(id: string, userId: string) {
    await createAuditLogEntry({ action: 'DELETE', entity: 'MenuItem', entityId: id, userId })
    await prisma.menuItem.delete({ where: { id } })
  },

  // AuditLog operations
  async getAuditLogs(userId?: string, limit = 100) {
    const where = userId ? { userId } : {}
    return prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },
}
