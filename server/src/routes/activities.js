import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET /api/activities - Listar todas as atividades
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId
    const disciplineId = req.query.disciplineId

    const where = {}
    if (userId) where.userId = userId
    if (disciplineId) where.disciplineId = disciplineId

    const activities = await prisma.activity.findMany({
      where,
      include: {
        discipline: true
      },
      orderBy: { dueDate: 'asc' }
    })

    const formatted = activities.map(act => ({
      id: act.id,
      name: act.name,
      description: act.description,
      dueDate: act.dueDate ? act.dueDate.toISOString().split('T')[0] : null,
      category: act.category,
      priority: act.priority,
      status: act.status,
      completedAt: act.completedAt,
      parentId: act.disciplineId,
      parentType: 'discipline',
      parentName: act.discipline?.name || 'Geral',
      parentColor: act.discipline?.themeColor || '#8366C5',
      userId: act.userId,
      createdAt: act.createdAt,
      updatedAt: act.updatedAt
    }))

    return res.json(formatted)
  } catch (err) {
    console.error('Erro ao listar atividades:', err)
    return res.status(500).json({ error: 'Erro ao buscar atividades.' })
  }
})

// POST /api/activities - Criar nova atividade
router.post('/', async (req, res) => {
  try {
    const { name, description, dueDate, category, priority, status, disciplineId, parentId, userId } = req.body

    if (!name) {
      return res.status(400).json({ error: 'O nome da atividade é obrigatório.' })
    }

    const targetDisciplineId = disciplineId || parentId || null

    let targetUserId = userId || req.headers['x-user-id']
    if (!targetUserId) {
      if (targetDisciplineId) {
        const disc = await prisma.discipline.findUnique({ where: { id: targetDisciplineId } })
        if (disc) targetUserId = disc.userId
      }
      if (!targetUserId) {
        const firstUser = await prisma.user.findFirst()
        if (firstUser) targetUserId = firstUser.id
      }
    }

    if (!targetUserId) {
      return res.status(400).json({ error: 'Usuário não identificado.' })
    }

    const newActivity = await prisma.activity.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || 'atividade_pontual',
        priority: priority || 'media',
        status: status || 'a_fazer',
        disciplineId: targetDisciplineId,
        userId: targetUserId
      },
      include: {
        discipline: true
      }
    })

    return res.status(201).json({
      id: newActivity.id,
      name: newActivity.name,
      description: newActivity.description,
      dueDate: newActivity.dueDate ? newActivity.dueDate.toISOString().split('T')[0] : null,
      category: newActivity.category,
      priority: newActivity.priority,
      status: newActivity.status,
      completedAt: newActivity.completedAt,
      parentId: newActivity.disciplineId,
      parentType: 'discipline',
      parentName: newActivity.discipline?.name || 'Geral',
      parentColor: newActivity.discipline?.themeColor || '#8366C5',
      userId: newActivity.userId,
      createdAt: newActivity.createdAt,
      updatedAt: newActivity.updatedAt
    })
  } catch (err) {
    console.error('Erro ao criar atividade:', err)
    return res.status(500).json({ error: 'Erro ao criar atividade.' })
  }
})

// PUT /api/activities/:id - Atualizar atividade completa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, dueDate, category, priority, status, disciplineId, parentId } = req.body

    const targetDisciplineId = disciplineId || parentId !== undefined ? (disciplineId || parentId) : undefined

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        category,
        priority,
        status,
        disciplineId: targetDisciplineId
      },
      include: {
        discipline: true
      }
    })

    return res.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      dueDate: updated.dueDate ? updated.dueDate.toISOString().split('T')[0] : null,
      category: updated.category,
      priority: updated.priority,
      status: updated.status,
      completedAt: updated.completedAt,
      parentId: updated.disciplineId,
      parentType: 'discipline',
      parentName: updated.discipline?.name || 'Geral',
      parentColor: updated.discipline?.themeColor || '#8366C5'
    })
  } catch (err) {
    console.error('Erro ao atualizar atividade:', err)
    return res.status(500).json({ error: 'Erro ao atualizar atividade.' })
  }
})

// PATCH /api/activities/:id/status - Atualização rápida de status (a_fazer, em_andamento, concluida)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório.' })
    }

    const completedAt = status === 'concluida' 
      ? 'hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : null

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        status,
        completedAt
      }
    })

    return res.json(updated)
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
    return res.status(500).json({ error: 'Erro ao atualizar status.' })
  }
})

// DELETE /api/activities/:id - Excluir atividade
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.activity.delete({
      where: { id }
    })

    return res.json({ message: 'Atividade excluída com sucesso.' })
  } catch (err) {
    console.error('Erro ao excluir atividade:', err)
    return res.status(500).json({ error: 'Erro ao excluir atividade.' })
  }
})

export default router
