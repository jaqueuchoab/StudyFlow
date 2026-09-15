/**
 * StudyFlow API Client
 * Replaces localStorage with backend Node.js + Prisma API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api')

// Helper para obter o usuário atual salvo na sessão local
export function getCurrentUser() {
  const user = localStorage.getItem('studyflow:user')
  try {
    return user ? JSON.parse(user) : null
  } catch (e) {
    return null
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('studyflow:user', JSON.stringify(user))
  } else {
    localStorage.removeItem('studyflow:user')
  }
}

export function logout() {
  localStorage.removeItem('studyflow:user')
}

// Helper genérico para requisições HTTP com header de usuário
async function request(endpoint, options = {}) {
  const user = getCurrentUser()
  const headers = {
    'Content-Type': 'application/json',
    ...(user?.id ? { 'x-user-id': user.id } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Erro na requisição: ${response.statusText}`)
  }

  return response.json()
}

// ----------------- Auth ----------------- //
export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  setCurrentUser(data)
  return data
}

export async function register(name, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  })
  setCurrentUser(data)
  return data
}

// ----------------- Disciplines ----------------- //
const disciplineCache = new Map()

export function getCachedDiscipline(id) {
  return disciplineCache.get(id) || null
}

export async function getDisciplinesWithMetrics() {
  const list = await request('/disciplines')
  if (Array.isArray(list)) {
    list.forEach(d => {
      const existing = disciplineCache.get(d.id)
      disciplineCache.set(d.id, { ...existing, ...d })
    })
  }
  return list
}

export async function getDisciplines() {
  return getDisciplinesWithMetrics()
}

export async function getDisciplineById(id) {
  const data = await request(`/disciplines/${id}`)
  disciplineCache.set(id, data)
  return data
}

export async function saveDiscipline(discipline) {
  if (discipline.id && !discipline.id.startsWith('disc_')) {
    return request(`/disciplines/${discipline.id}`, {
      method: 'PUT',
      body: JSON.stringify(discipline)
    })
  } else {
    return request('/disciplines', {
      method: 'POST',
      body: JSON.stringify(discipline)
    })
  }
}

export async function deleteDiscipline(id) {
  return request(`/disciplines/${id}`, {
    method: 'DELETE'
  })
}

// ----------------- Activities ----------------- //
export async function getActivities() {
  return request('/activities')
}

export async function getActivitiesByParent(parentType, parentId) {
  return request(`/activities?disciplineId=${parentId}`)
}

export async function saveActivity(activity) {
  if (activity.id && !activity.id.startsWith('act_')) {
    return request(`/activities/${activity.id}`, {
      method: 'PUT',
      body: JSON.stringify(activity)
    })
  } else {
    return request('/activities', {
      method: 'POST',
      body: JSON.stringify(activity)
    })
  }
}

export async function updateActivityStatus(id, status) {
  return request(`/activities/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function deleteActivity(id) {
  return request(`/activities/${id}`, {
    method: 'DELETE'
  })
}

// ----------------- Dashboard Stats & Priority Board ----------------- //
export async function getDashboardData() {
  return request('/dashboard/stats')
}

export async function getDashboardStats() {
  const data = await request('/dashboard/stats')
  return data.stats
}

export async function getUrgentActivities() {
  const data = await request('/dashboard/stats')
  return data.urgentActivities
}

export async function getPriorityBoardActivities() {
  const data = await request('/dashboard/stats')
  return data.priorityActivities
}
