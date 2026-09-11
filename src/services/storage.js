/**
 * LocalStorage Service for StudyFlow
 * Implements CRUD for Disciplines and Activities with initial seed data
 */
import { isRiskZone, calculatePriorityScore, getDaysRemaining } from '../utils/dateUtils'

const STORAGE_KEYS = {
  DISCIPLINES: 'studyflow:disciplines',
  PARALLEL_STUDIES: 'studyflow:parallelStudies',
  ACTIVITIES: 'studyflow:activities',
  INITIALIZED: 'studyflow:initialized_v1'
}

// Initial realistic seed data matching the Graphic Garden and eCoursie visual themes
function getInitialSeedData() {
  const today = new Date()
  const formatDate = (daysOffset) => {
    const d = new Date(today)
    d.setDate(d.getDate() + daysOffset)
    return d.toISOString().split('T')[0]
  }

  const disciplines = [
    {
      id: 'disc-so-01',
      name: 'Sistemas Operacionais',
      professor: 'Prof. Mark Lee',
      course: 'Ciência da Computação',
      workload: 60,
      description: 'Estudo dos conceitos fundamentais de abstração de SO, gerenciamento de processos, memória virtual e concorrência.',
      themeColor: '#A184E5',
      illustration: 'desktop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-ia-02',
      name: 'Inteligência Artificial',
      professor: 'Prof. Jung Jaehyun',
      course: 'Engenharia de Software',
      workload: 80,
      description: 'Conceitos de aprendizado de máquina, busca heurística, redes neurais e agentes autônomos.',
      themeColor: '#C2D039',
      illustration: 'cpu',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-es-03',
      name: 'Engenharia de Software',
      professor: 'Prof. Kim Taeyong',
      course: 'Sistemas de Informação',
      workload: 60,
      description: 'Metodologias ágeis, Clean Architecture, Design Patterns e boas práticas de entrega contínua.',
      themeColor: '#F5F4E3',
      illustration: 'code-square',
      createdAt: new Date().toISOString()
    }
  ]

  const activities = [
    {
      id: 'act-1',
      name: 'Trabalho Prático: Escalonador de Processos Round-Robin',
      description: 'Implementação de simulador em C/Java para escalonamento com troca de contexto e cálculo de turnaround.',
      dueDate: formatDate(2), // Zona de risco! (<= 3 dias)
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'em_andamento',
      parentType: 'discipline',
      parentId: 'disc-so-01',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-2',
      name: 'Seminário: Sistemas de Arquivos Modernos e Journaling',
      description: 'Apresentação em equipe de 20 minutos abordando ZFS, ext4 e Btrfs.',
      dueDate: formatDate(6),
      category: 'seminario',
      priority: 'media',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-so-01',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-3',
      name: 'Prova Regimental: P1 de Inteligência Artificial',
      description: 'Avaliação presencial contendo algoritmos A*, Minimax e conceitos de aprendizado supervisionado.',
      dueDate: formatDate(1), // Zona de risco iminente! (amanhã)
      category: 'prova',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-ia-02',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-4',
      name: 'Atividade Prática: Classificador com Scikit-Learn',
      description: 'Notebook Jupyter com pré-processamento, métricas de acurácia, F1-Score e matriz de confusão.',
      dueDate: formatDate(8),
      category: 'atividade_pontual',
      priority: 'media',
      status: 'concluida',
      parentType: 'discipline',
      parentId: 'disc-ia-02',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-5',
      name: 'Revisão e Diagramação: Diagrama de Classes UML',
      description: 'Refatoração dos modelos de domínio para entrega da sprint 2.',
      dueDate: formatDate(3), // Zona de risco!
      category: 'revisao',
      priority: 'baixa',
      status: 'em_andamento',
      parentType: 'discipline',
      parentId: 'disc-es-03',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-6',
      name: 'Trabalho de Especificação: Histórias de Usuário & MVP',
      description: 'Definição de critérios de aceite e mapa de personas.',
      dueDate: formatDate(-1), // Atrasada para teste de alerta
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-es-03',
      createdAt: new Date().toISOString()
    }
  ]

  return { disciplines, activities }
}

export function initStorage() {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (!isInitialized) {
    const seed = getInitialSeedData()
    localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(seed.disciplines))
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(seed.activities))
    localStorage.setItem(STORAGE_KEYS.PARALLEL_STUDIES, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
}

// ----------------- Disciplines CRUD ----------------- //

export function getDisciplines() {
  initStorage()
  const data = localStorage.getItem(STORAGE_KEYS.DISCIPLINES)
  try {
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error parsing disciplines', e)
    return []
  }
}

export function getDisciplineById(id) {
  const disciplines = getDisciplines()
  return disciplines.find(d => d.id === id) || null
}

export function saveDiscipline(discipline) {
  const disciplines = getDisciplines()
  if (discipline.id) {
    // Update
    const idx = disciplines.findIndex(d => d.id === discipline.id)
    if (idx !== -1) {
      disciplines[idx] = { ...disciplines[idx], ...discipline }
    } else {
      disciplines.push(discipline)
    }
  } else {
    // Create new
    const newDiscipline = {
      ...discipline,
      id: 'disc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString()
    }
    disciplines.push(newDiscipline)
  }
  localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(disciplines))
  return discipline
}

export function deleteDiscipline(id) {
  const disciplines = getDisciplines().filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEYS.DISCIPLINES, JSON.stringify(disciplines))

  // Also remove associated activities
  const activities = getActivities().filter(a => !(a.parentType === 'discipline' && a.parentId === id))
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}

// ----------------- Activities CRUD ----------------- //

export function getActivities() {
  initStorage()
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
  try {
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error parsing activities', e)
    return []
  }
}

export function getActivityById(id) {
  const activities = getActivities()
  return activities.find(a => a.id === id) || null
}

export function getActivitiesByParent(parentType, parentId) {
  const activities = getActivities()
  return activities.filter(a => a.parentType === parentType && a.parentId === parentId)
}

export function saveActivity(activity) {
  const activities = getActivities()
  if (activity.id) {
    const idx = activities.findIndex(a => a.id === activity.id)
    if (idx !== -1) {
      activities[idx] = { ...activities[idx], ...activity }
    } else {
      activities.push(activity)
    }
  } else {
    const newActivity = {
      ...activity,
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString()
    }
    activities.push(newActivity)
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
  return activity
}

export function updateActivityStatus(id, newStatus) {
  const activities = getActivities()
  const target = activities.find(a => a.id === id)
  if (target) {
    target.status = newStatus
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
  }
}

export function deleteActivity(id) {
  const activities = getActivities().filter(a => a.id !== id)
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
}

// ----------------- Analytics & Stats ----------------- //

export function getDashboardStats() {
  const disciplines = getDisciplines()
  const activities = getActivities()

  const pendingActivities = activities.filter(a => a.status === 'a_fazer' || a.status === 'em_andamento')
  const completedActivities = activities.filter(a => a.status === 'concluida')
  const riskActivities = activities.filter(a => isRiskZone(a))

  return {
    totalDisciplines: disciplines.length,
    totalActivities: activities.length,
    pendingCount: pendingActivities.length,
    completedCount: completedActivities.length,
    riskCount: riskActivities.length,
    riskActivities
  }
}

/**
 * Gets disciplines enriched with activity counts (pending and total)
 */
export function getDisciplinesWithMetrics() {
  const disciplines = getDisciplines()
  const activities = getActivities()

  return disciplines.map(disc => {
    const discActivities = activities.filter(a => a.parentType === 'discipline' && a.parentId === disc.id)
    const pending = discActivities.filter(a => a.status === 'a_fazer' || a.status === 'em_andamento').length
    const completed = discActivities.filter(a => a.status === 'concluida').length

    return {
      ...disc,
      totalActivities: discActivities.length,
      pendingActivities: pending,
      completedActivities: completed,
      progressPercent: discActivities.length > 0 ? Math.round((completed / discActivities.length) * 100) : 0
    }
  })
}

/**
 * Gets sorted activities for the Priority Board
 */
export function getPriorityBoardActivities() {
  const activities = getActivities()
  const disciplines = getDisciplines()

  const enriched = activities.map(act => {
    const parent = act.parentType === 'discipline' ? disciplines.find(d => d.id === act.parentId) : null
    return {
      ...act,
      parentName: parent ? parent.name : 'Outro',
      parentColor: parent?.themeColor || '#A184E5',
      score: calculatePriorityScore(act)
    }
  })

  // Sort descending by priority score
  return enriched.sort((a, b) => b.score - a.score)
}

/**
 * Gets urgent pending activities sorted strictly by due date proximity
 */
export function getUrgentActivities(limit = 6) {
  const activities = getActivities()
  const disciplines = getDisciplines()

  const pending = activities.filter(a => a.status !== 'concluida')
  const enriched = pending.map(act => {
    const parent = act.parentType === 'discipline' ? disciplines.find(d => d.id === act.parentId) : null
    return {
      ...act,
      parentName: parent ? parent.name : 'Disciplina',
      parentColor: parent?.themeColor || '#A184E5'
    }
  })

  // Sort ascending by remaining days (closest deadline first)
  enriched.sort((a, b) => getDaysRemaining(a.dueDate) - getDaysRemaining(b.dueDate))
  return limit ? enriched.slice(0, limit) : enriched
}

export function resetToSeed() {
  localStorage.removeItem(STORAGE_KEYS.DISCIPLINES)
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES)
  localStorage.removeItem(STORAGE_KEYS.PARALLEL_STUDIES)
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
  initStorage()
}
