import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// Funções utilitárias de pontuação e risco
function calculatePriorityScore(activity) {
  let score = 0
  if (activity.priority === 'alta') score += 50
  if (activity.priority === 'media') score += 30
  if (activity.priority === 'baixa') score += 10

  if (activity.status === 'a_fazer') score += 20
  if (activity.status === 'em_andamento') score += 15
  if (activity.status === 'concluida') score -= 100

  if (activity.dueDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(activity.dueDate)
    due.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) score += 40 // Overdue
    else if (diffDays <= 1) score += 35
    else if (diffDays <= 3) score += 25
    else if (diffDays <= 7) score += 15
  }

  return score
}

function isRiskZone(activity) {
  if (activity.status === 'concluida') return false
  if (!activity.dueDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(activity.dueDate)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

  return diffDays <= 3
}

// GET /api/dashboard/stats - Métricas do painel, atividades da zona de risco e quadro de prioridades
router.get('/stats', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId
    const where = userId ? { userId } : {}

    const disciplines = await prisma.discipline.findMany({ where })
    const activities = await prisma.activity.findMany({
      where,
      include: {
        discipline: true
      }
    })

    const formattedActivities = activities.map(act => ({
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
      score: calculatePriorityScore(act),
      isRisk: isRiskZone(act)
    }))

    const pendingActivities = formattedActivities.filter(a => a.status !== 'concluida')
    const completedActivities = formattedActivities.filter(a => a.status === 'concluida')
    const riskActivities = formattedActivities.filter(a => a.isRisk)

    // Ordenar urgentes por proximidade de data
    const urgentSorted = [...pendingActivities].sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

    // Ordenar quadro de prioridades por score decrescente
    const priorityBoardSorted = [...formattedActivities].sort((a, b) => b.score - a.score)

    return res.json({
      stats: {
        totalDisciplines: disciplines.length,
        totalActivities: activities.length,
        pendingCount: pendingActivities.length,
        completedCount: completedActivities.length,
        riskCount: riskActivities.length
      },
      urgentActivities: urgentSorted.slice(0, 6),
      priorityActivities: priorityBoardSorted
    })
  } catch (err) {
    console.error('Erro ao buscar dados da dashboard:', err)
    return res.status(500).json({ error: 'Erro ao buscar dados da dashboard.' })
  }
})

export default router
