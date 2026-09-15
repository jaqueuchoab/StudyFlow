/**
 * Utility functions for date manipulation and risk zone calculation
 */

export function parseDate(dateStr) {
  if (!dateStr) return null
  if (dateStr instanceof Date) return dateStr
  const dateOnly = typeof dateStr === 'string' ? dateStr.split('T')[0] : ''
  const parts = dateOnly.split('-').map(Number)
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    const fallback = new Date(dateStr)
    return isNaN(fallback.getTime()) ? null : fallback
  }
  return new Date(parts[0], parts[1] - 1, parts[2])
}

export function formatDate(dateStr, options = { day: '2-digit', month: 'short' }) {
  if (!dateStr) return 'Sem prazo'
  const date = parseDate(dateStr)
  if (!date || isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('pt-BR', options)
}

export function formatDateFull(dateStr) {
  if (!dateStr) return 'Sem prazo'
  const date = parseDate(dateStr)
  if (!date || isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * Calculates remaining days between today and the due date
 * Positive: days until due
 * 0: due today
 * Negative: overdue
 */
export function getDaysRemaining(dateStr) {
  if (!dateStr) return 999
  const target = parseDate(dateStr)
  if (!target || isNaN(target.getTime())) return 999
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Technical Spec Rule: Zona de risco
 * Atividade não concluída com prazo de entrega em até 3 dias a partir da data atual (dueDate - hoje <= 3)
 */
export function isRiskZone(activity) {
  if (!activity || activity.status === 'concluida') return false
  if (!activity.dueDate) return false
  const days = getDaysRemaining(activity.dueDate)
  return days <= 3
}

export function isOverdue(activity) {
  if (!activity || activity.status === 'concluida') return false
  if (!activity.dueDate) return false
  return getDaysRemaining(activity.dueDate) < 0
}

/**
 * Quadro de prioridades algorithm:
 * Ordering based on priority weight and due date proximity
 */
export function calculatePriorityScore(activity) {
  if (!activity) return 0
  if (activity.status === 'concluida') return -100

  // Priority weight
  const priorityWeights = {
    alta: 30,
    media: 20,
    baixa: 10
  }
  let score = priorityWeights[activity.priority] || 10

  // Date urgency weight
  const days = getDaysRemaining(activity.dueDate)
  if (days < 0) {
    score += 50 // Overdue is critical
  } else if (days === 0) {
    score += 40 // Due today
  } else if (days <= 3) {
    score += 30 // Risk zone (<= 3 days)
  } else if (days <= 7) {
    score += 15 // Due this week
  } else {
    score += 5
  }

  return score
}
