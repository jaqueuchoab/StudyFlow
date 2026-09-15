import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// POST /api/auth/login - Login simples com email e senha
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' })
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ error: 'Erro interno ao realizar login.' })
  }
})

// POST /api/auth/register - Cadastro simples
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' })
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existing) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password
      }
    })

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    console.error('Erro no cadastro:', err)
    return res.status(500).json({ error: 'Erro interno ao criar conta.' })
  }
})

export default router
