# StudyFlow — Gestão Universitária

> Plataforma intuitiva para estudantes universitários gerenciarem disciplinas, prazos e atividades com foco em priorização inteligente e equilíbrio nos estudos.

**Acesse a aplicação em produção:** [https://studyflow-validation.vercel.app/](https://studyflow-validation.vercel.app/)

---

## Sobre o Projeto

O **StudyFlow** ajuda com a sobrecarga de prazos e a desorganização comum na vida acadêmica. 

### Principais Funcionalidades

- **Dashboard Acadêmico**:
  - Resumo rápido com indicadores de **Disciplinas**, **A Fazer** e **Concluídas**.
  - **Zona de Risco**: Destaque automático para atividades com prazos críticos.
  - **Quadro de Prioridades**: Exibição inteligente que ordena tarefas combinando nível de prioridade (alta, média, baixa) e proximidade da data de entrega.
- **Gestão de Disciplinas**:
  - Cadastro, edição, visualização detalhada e exclusão de matérias.
- **Gestão de Atividades & Tarefas**:
  - Organização por categorias: *Trabalho Avaliativo*, *Prova*, *Seminário*, *Atividade Pontual* e *Revisão*.
  - Controle de status simplificado (*A Fazer*, *Em Andamento*, *Concluída*).
  - Modais responsivos para criação, edição e consulta detalhada com formatação clara de datas.
- **Totalmente Responsivo**:
  - Layout adaptado para navegação fluida em smartphones, tablets e desktops.
  - Menu lateral retrátil.

---

## Tecnologias Utilizadas

### **Frontend**
- **Vue 3** 
- **Vite** 
- **Vue Router 4**
- **Bootstrap 5**
- **CSS3**

### **Backend & Banco de Dados**
- **Node.js** & **Express**
- **Prisma ORM**
- **PostgreSQL**

---

## Instruções para Execução Local

### **Pré-requisitos**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

---

### **1. Clonar o repositório**
```bash
git clone https://github.com/jaqueuchoab/StudyFlow-.git
cd StudyFlow-
```

### **2. Instalar as dependências**
Instala as dependências da raiz (frontend) e do servidor (backend):
```bash
npm install
```

### **3. Configurar as Variáveis de Ambiente**
Crie um arquivo `.env` dentro da pasta `server/` com a URL do seu banco de dados PostgreSQL:

(Solicite ao autor o arquivo .env)

Gere os artefatos do Prisma:
```bash
npm --prefix server run prisma:generate
```

> *(Opcional)* Para sincronizar o schema com o banco:
> ```bash
> npm --prefix server run prisma:push
> ```

---

### **4. Rodar a aplicação**

#### Iniciar o Backend (Porta 3000):
```bash
npm run server
```

#### Iniciar o Frontend (Vite - Porta 5173):
Em outro terminal:
```bash
npm run dev
```

Abra seu navegador em: `http://localhost:5173`

---

## Acesso Online & Teste

Você pode acessar a versão já publicada em produção:

🔗 **[https://studyflow-validation.vercel.app/](https://studyflow-validation.vercel.app/)**

- **Acesso direto**: Ao entrar na aplicação, já existem dados de teste cadastrados para exploração imediata de todas as funcionalidades.
- **Novo cadastro**: Você também pode criar uma conta do zero na tela de Login para gerenciar suas próprias matérias e atividades personalizadas.

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo de licença para mais detalhes.
