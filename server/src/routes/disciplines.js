import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET /api/disciplines - Listar disciplinas com contagem de pendências e total
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId

    const where = userId ? { userId } : {}

    const disciplines = await prisma.discipline.findMany({
      where,
      include: {
        activities: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const enriched = disciplines.map(disc => {
      // Pendência real: atividade não concluída com prazo já vencido
      const pending = disc.activities.filter(a => {
        if (a.status === 'concluida') return false
        if (!a.dueDate) return false
        const due = new Date(a.dueDate)
        due.setHours(0, 0, 0, 0)
        return due < today
      }).length

      const completed = disc.activities.filter(a => a.status === 'concluida').length
      const total = disc.activities.length

      return {
        id: disc.id,
        name: disc.name,
        professor: disc.professor,
        course: disc.course,
        workload: disc.workload,
        description: disc.description,
        themeColor: disc.themeColor,
        illustration: disc.illustration,
        userId: disc.userId,
        createdAt: disc.createdAt,
        updatedAt: disc.updatedAt,
        totalActivities: total,
        pendingActivities: pending,
        completedActivities: completed,
        progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    })

    return res.json(enriched)
  } catch (err) {
    console.error('Erro ao listar disciplinas:', err)
    return res.status(500).json({ error: 'Erro ao buscar disciplinas.' })
  }
})

// GET /api/disciplines/:id - Buscar disciplina por ID com suas atividades
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const discipline = await prisma.discipline.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { dueDate: 'asc' }
        }
      }
    })

    if (!discipline) {
      return res.status(404).json({ error: 'Disciplina não encontrada.' })
    }

    return res.json(discipline)
  } catch (err) {
    console.error('Erro ao buscar disciplina:', err)
    return res.status(500).json({ error: 'Erro ao buscar disciplina.' })
  }
})

// POST /api/disciplines - Criar nova disciplina
router.post('/', async (req, res) => {
  try {
    const { name, professor, course, workload, description, themeColor, illustration, userId } = req.body

    if (!name) {
      return res.status(400).json({ error: 'O nome da disciplina é obrigatório.' })
    }

    // Se userId não for fornecido, pegar o primeiro usuário cadastrado como fallback
    let targetUserId = userId || req.headers['x-user-id']
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst()
      if (firstUser) targetUserId = firstUser.id
    }

    if (!targetUserId) {
      return res.status(400).json({ error: 'Usuário não identificado.' })
    }

    const newDiscipline = await prisma.discipline.create({
      data: {
        name: name.trim(),
        professor: professor?.trim() || null,
        course: course?.trim() || null,
        workload: Number(workload) || 60,
        description: description?.trim() || null,
        themeColor: themeColor || '#8366C5',
        illustration: illustration || 'desktop',
        userId: targetUserId
      }
    })

    return res.status(201).json(newDiscipline)
  } catch (err) {
    console.error('Erro ao criar disciplina:', err)
    return res.status(500).json({ error: 'Erro ao criar disciplina.' })
  }
})

// PUT /api/disciplines/:id - Atualizar disciplina
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, professor, course, workload, description, themeColor, illustration } = req.body

    const updated = await prisma.discipline.update({
      where: { id },
      data: {
        name: name?.trim(),
        professor: professor?.trim(),
        course: course?.trim(),
        workload: workload ? Number(workload) : undefined,
        description: description?.trim(),
        themeColor,
        illustration
      }
    })

    return res.json(updated)
  } catch (err) {
    console.error('Erro ao atualizar disciplina:', err)
    return res.status(500).json({ error: 'Erro ao atualizar disciplina.' })
  }
})

// DELETE /api/disciplines/:id - Excluir disciplina
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.discipline.delete({
      where: { id }
    })

    return res.json({ message: 'Disciplina excluída com sucesso.' })
  } catch (err) {
    console.error('Erro ao excluir disciplina:', err)
    return res.status(500).json({ error: 'Erro ao excluir disciplina.' })
  }
})

export default router
