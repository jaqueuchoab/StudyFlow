import prisma from './prisma.js'

async function seed() {
  console.log('🌱 Populando banco de dados com dados iniciais...')

  // 1. Criar ou buscar usuário padrão
  let user = await prisma.user.findUnique({
    where: { email: 'estudante@studyflow.com' }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Estudante',
        email: 'estudante@studyflow.com',
        password: '123'
      }
    })
    console.log('✅ Usuário padrão criado: estudante@studyflow.com / senha: 123')
  }

  // 2. Criar Disciplinas de exemplo se não existirem
  const count = await prisma.discipline.count({ where: { userId: user.id } })
  if (count === 0) {
    const calc = await prisma.discipline.create({
      data: {
        name: 'Cálculo Numérico',
        professor: 'Prof. Dr. Ricardo Santos',
        course: 'Ciência da Computação',
        workload: 72,
        description: 'Métodos numéricos para resolução de equações, interpolação, integração e diferenciação numérica.',
        themeColor: '#8366C5',
        userId: user.id
      }
    })

    const eda = await prisma.discipline.create({
      data: {
        name: 'Estruturas de Dados Avançadas',
        professor: 'Profa. Mariana Lima',
        course: 'Ciência da Computação',
        workload: 80,
        description: 'Árvores balanceadas, grafos, heaps, tabelas hash otimizadas e algoritmos de fluxo em rede.',
        themeColor: '#8366C5',
        userId: user.id
      }
    })

    const ia = await prisma.discipline.create({
      data: {
        name: 'Inteligência Artificial',
        professor: 'Profa. Beatriz Mendes',
        course: 'Ciência da Computação',
        workload: 72,
        description: 'Busca heurística, redes neurais profundas, aprendizado por reforço e visão computacional.',
        themeColor: '#C2D039',
        userId: user.id
      }
    })

    const today = new Date()
    const addDays = (d, days) => {
      const copy = new Date(d)
      copy.setDate(copy.getDate() + days)
      return copy
    }

    // Atividades
    await prisma.activity.createMany({
      data: [
        {
          name: 'Trabalho Avaliativo: Método de Newton–Raphson',
          description: 'Implementação computacional do método iterativo com estimativa de erro relativo.',
          dueDate: addDays(today, 2),
          category: 'trabalho_avaliativo',
          priority: 'alta',
          status: 'em_andamento',
          disciplineId: calc.id,
          userId: user.id
        },
        {
          name: 'Prova P2: Interpolação Polinomial',
          description: 'Avaliação presencial abordando polinômios de Lagrange, Newton e Splines.',
          dueDate: addDays(today, 6),
          category: 'prova',
          priority: 'alta',
          status: 'a_fazer',
          disciplineId: calc.id,
          userId: user.id
        },
        {
          name: 'Trabalho Prático de Compiladores',
          description: 'Implementação do analisador sintático preditivo tabular com tratamento recursivo.',
          dueDate: addDays(today, 2),
          category: 'trabalho_avaliativo',
          priority: 'alta',
          status: 'em_andamento',
          disciplineId: eda.id,
          userId: user.id
        },
        {
          name: 'Seminário de IA & Redes Neurais',
          description: 'Slides sobre algoritmos de busca heurística A* e preparação da apresentação.',
          dueDate: addDays(today, 1),
          category: 'seminario',
          priority: 'alta',
          status: 'a_fazer',
          disciplineId: ia.id,
          userId: user.id
        }
      ]
    })
    console.log('✅ Disciplinas e atividades de exemplo inseridas com sucesso!')
  }

  console.log('✨ Seed finalizado!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
