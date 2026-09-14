/**
 * LocalStorage Service for StudyFlow
 * Implements CRUD for Disciplines and Activities with initial seed data matching Figma prototype
 */
import { isRiskZone, calculatePriorityScore, getDaysRemaining } from '../utils/dateUtils'

const STORAGE_KEYS = {
  DISCIPLINES: 'studyflow:disciplines',
  PARALLEL_STUDIES: 'studyflow:parallelStudies',
  ACTIVITIES: 'studyflow:activities',
  INITIALIZED: 'studyflow:initialized_v4'
}

// Initial realistic seed data matching Figma prototype
function getInitialSeedData() {
  const today = new Date()
  const formatDate = (daysOffset) => {
    const d = new Date(today)
    d.setDate(d.getDate() + daysOffset)
    return d.toISOString().split('T')[0]
  }

  const disciplines = [
    {
      id: 'disc-calc',
      name: 'Cálculo Numérico',
      professor: 'Prof. Dr. Ricardo Santos',
      course: 'Ciência da Computação',
      workload: 72,
      description: 'Métodos numéricos para resolução de equações, interpolação, integração e diferenciação numérica.',
      themeColor: '#8366C5',
      illustration: 'desktop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-eda',
      name: 'Estruturas de Dados Avançadas',
      professor: 'Profa. Mariana Lima',
      course: 'Ciência da Computação',
      workload: 80,
      description: 'Árvores balanceadas, grafos, heaps, tabelas hash otimizadas e algoritmos de fluxo em rede.',
      themeColor: '#8366C5',
      illustration: 'code-square',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-as',
      name: 'Arquitetura de Software',
      professor: 'Prof. Carlos Eduardo',
      course: 'Engenharia de Software',
      workload: 60,
      description: 'Estilos arquiteturais, microserviços, Clean Architecture, mensageria e resiliência.',
      themeColor: '#8366C5',
      illustration: 'cpu',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-ia',
      name: 'Inteligência Artificial',
      professor: 'Profa. Beatriz Mendes',
      course: 'Ciência da Computação',
      workload: 72,
      description: 'Busca heurística, redes neurais profundas, aprendizado por reforço e visão computacional.',
      themeColor: '#C2D039',
      illustration: 'cpu',
      createdAt: new Date().toISOString()
    },
    {
      id: 'disc-rc',
      name: 'Redes de Computadores',
      professor: 'Prof. Roberto Alencar',
      course: 'Ciência da Computação',
      workload: 60,
      description: 'Camadas OSI/TCP-IP, roteamento, protocolos de transporte, segurança e sockets.',
      themeColor: '#8366C5',
      illustration: 'desktop',
      createdAt: new Date().toISOString()
    }
  ]

  const activities = [
    // Cálculo Numérico (matching Figma detail screen)
    {
      id: 'act-calc-1',
      name: 'Trabalho Avaliativo: Método de Newton–Raphson',
      description: 'Implementação computacional do método iterativo com estimativa de erro relativo e taxa de convergência.',
      dueDate: formatDate(2),
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'em_andamento',
      parentType: 'discipline',
      parentId: 'disc-calc',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-calc-2',
      name: 'Prova P2: Interpolação Polinomial',
      description: 'Avaliação presencial abordando polinômios de Lagrange, Newton e Splines cúbicos.',
      dueDate: formatDate(6),
      category: 'prova',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-calc',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-calc-3',
      name: 'Lista 3 de Exercícios',
      description: 'Resolução dos exercícios de eliminação de Gauss e fatoração LU com pivotamento parcial.',
      dueDate: formatDate(-3),
      category: 'atividade_pontual',
      priority: 'media',
      status: 'concluida',
      completedAt: '10 de Outubro',
      parentType: 'discipline',
      parentId: 'disc-calc',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-calc-4',
      name: 'Revisão para Exame Final',
      description: 'Resolução das provas anteriores e revisão geral de quadratura gaussiana.',
      dueDate: formatDate(20),
      category: 'revisao',
      priority: 'baixa',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-calc',
      createdAt: new Date().toISOString()
    },
    // Other disciplines
    {
      id: 'act-1',
      name: 'Seminário de IA & Redes Neurais',
      description: 'Slides sobre algoritmos de busca heurística A* e preparação da apresentação em equipe.',
      dueDate: formatDate(1),
      category: 'seminario',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-ia',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-2',
      name: 'Trabalho Prático de Compiladores',
      description: 'Implementação do analisador sintático preditivo tabular com tratamento recursivo.',
      dueDate: formatDate(2),
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'em_andamento',
      parentType: 'discipline',
      parentId: 'disc-eda',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-3',
      name: 'Implementação de Algoritmo de Consenso Raft',
      description: 'Implementação de eleição de líder e replicação de log distribuído.',
      dueDate: formatDate(5),
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-as',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-4',
      name: 'Otimização de Índices e B-Trees em PostgreSQL',
      description: 'Análise de performance com EXPLAIN ANALYZE e criação de índices parciais.',
      dueDate: formatDate(7),
      category: 'atividade_pontual',
      priority: 'alta',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-rc',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-5',
      name: 'Diagramação de Casos de Uso & Arquitetura C4',
      description: 'Elaboração dos diagramas de contexto, contêiner e componentes da aplicação.',
      dueDate: formatDate(12),
      category: 'revisao',
      priority: 'media',
      status: 'a_fazer',
      parentType: 'discipline',
      parentId: 'disc-as',
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
    if (newStatus === 'concluida') {
      target.completedAt = 'hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
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
    const discActivities = activities.filter(a => {
      if (a.parentId && String(a.parentId) === String(disc.id)) return true
      if (a.parentName && disc.name && a.parentName.trim().toLowerCase() === disc.name.trim().toLowerCase()) return true
      return false
    })
    const pending = discActivities.filter(a => a.status !== 'concluida').length
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
      parentColor: parent?.themeColor || '#8366C5',
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
      parentColor: parent?.themeColor || '#8366C5'
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
