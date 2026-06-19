# Sistema Web de Controle de Oficinas e Participantes (ELLP)

## Como utilizar

Certifique-se de possuir Git, Node.js (>= 18) e npm instalados.

### Setup automatizado (Windows)

Execute o PowerShell como administrador e rode:

```powershell
.\setup.ps1
```

O script verifica/instala Git e Node via winget, clona o repositório, instala as dependências e executa as migrações do banco.

### Setup manual

```bash
git clone https://github.com/abnerns/projeto-oficina2.git
cd projeto-oficina2
npm install
```

### Execução

```bash
npm run dev    # Front-end (porta 8080)
npm run back   # Back-end  (porta 3333)
```

Acesse o sistema em `http://localhost:8080`.

### Testes

```bash
npm test                  # Backend  (7 testes de API com node:test)
npm run test:front        # Frontend (92 testes Vitest, execução única)
npm run test:front:watch  # Frontend (modo watch)
```

### Certifique-se de que:

- O arquivo `.env` esteja localizado na raiz do projeto com as variáveis de ambiente necessárias.
- O arquivo `serviceAccount.json` esteja localizado em `back-end/src/common/admin/` e configurado corretamente.

---

## Requisitos Funcionais

### 1.1 Usuários e Acesso

| RF | Descrição | Prioridade |
|----|-----------|------------|
| RF01 | O sistema deve permitir o cadastro de usuários com perfis (administrador e professor/tutor). | 🔴 Alta |
| RF02 | O sistema deve permitir autenticação por meio de login e logout. | 🔴 Alta |
| RF03 | O sistema deve controlar o acesso às funcionalidades conforme o perfil do usuário. | 🔴 Alta |

### 1.2 Oficinas

| RF | Descrição | Prioridade |
|----|-----------|------------|
| RF04 | O sistema deve permitir o cadastro de oficinas contendo tema, descrição e data. | 🔴 Alta |
| RF05 | O sistema deve permitir a listagem das oficinas cadastradas. | 🔴 Alta |
| RF06 | O sistema deve permitir a edição e exclusão de oficinas. | 🟡 Média |
| RF07 | O sistema deve permitir associar professores/tutores às oficinas. | 🟡 Média |

### 1.3 Alunos

| RF | Descrição | Prioridade |
|----|-----------|------------|
| RF08 | O sistema deve permitir o cadastro de alunos (nome, idade e escola). | 🔴 Alta |
| RF09 | O sistema deve permitir a listagem dos alunos cadastrados. | 🔴 Alta |
| RF10 | O sistema deve permitir vincular alunos às oficinas. | 🟡 Média |
| RF11 | O sistema deve permitir visualizar os alunos vinculados a uma oficina. | 🟡 Média |

### 1.4 Certificados

| RF | Descrição | Prioridade |
|----|-----------|------------|
| RF12 | O sistema deve gerar certificados contendo o nome do aluno e a oficina participante. | 🔴 Alta |
| RF13 | O sistema deve permitir a exportação do certificado em formato PDF. | 🟡 Média |

### 1.5 Visualização de Dados

| RF | Descrição | Prioridade |
|----|-----------|------------|
| RF14 | O sistema deve apresentar a quantidade de alunos por oficina. | 🟢 Baixa |
| RF15 | O sistema deve apresentar listagem de oficinas com seus respectivos participantes. | 🟢 Baixa |

---

## Requisitos Não Funcionais

### 2.1 Tecnologia
RNF01: O sistema deve ser acessível via navegador web.  
RNF02: O sistema deve utilizar tecnologias amplamente conhecidas e de fácil implementação.  
RNF03: O sistema deve utilizar banco de dados relacional.

### 2.2 Desempenho
RNF04: O tempo de resposta das requisições não deve exceder 2 segundos em condições normais de uso.

### 2.3 Segurança
RNF05: As senhas dos usuários devem ser armazenadas de forma criptografada.  
RNF06: O sistema deve exigir autenticação para acesso às funcionalidades protegidas.

### 2.4 Qualidade
RNF07: O sistema deve possuir testes automatizados básicos para suas principais funcionalidades.  
RNF08: O código-fonte deve ser versionado em repositório Git.

---

## Cronograma das Sprints

Metodologia: SCRUM.  
Framework de organização: Kanban.

### Sprint 1 — 06/04 a 15/05

**Objetivo:** Implementar a base do sistema: autenticação, CRUD de oficinas e CRUD de alunos, integração front-end/back-end e setup da infraestrutura.

**Atividades realizadas:**

| Atividade | RF / RNF | Descrição |
|-----------|----------|-----------|
| Setup do repositório Git e arquitetura inicial | RNF08 | Inicialização do projeto com Vite + React + Express + Supabase |
| Tela de login e cadastro de usuários | RF01, RF02 | Formulários de login (email/senha e Google) e registro com seleção de perfil |
| Autenticação local e Google Firebase | RF01, RF02 | Integração com Firebase Auth + backend local com JWT |
| Controle de acesso por perfil | RF03 | Componente RoleGuard para restringir rotas (admin/professor) |
| Cadastro, listagem, edição e exclusão de oficinas | RF04, RF05, RF06 | CRUD completo de oficinas com formulários e cards |
| Associação de professores às oficinas | RF07 | Seletor multi-professores + tabela de associação |
| Cadastro e listagem de alunos | RF08, RF09 | CRUD completo de alunos com formulário e tabela |
| Integração front-end/back-end | — | Todos os contextos consumindo API real |
| Migração para Supabase | — | Refatoração do banco de dados local para Supabase (PostgreSQL) |

**Arquivos criados/modificados:** Estrutura inicial do front-end (Vite + React 19 + Tailwind 4 + shadcn/ui), back-end (Express 5 + PostgreSQL), autenticação Firebase, CRUDs de oficinas e alunos, migrações do banco.

---

### Sprint 2 — 16/05 a 28/06 (entrega 05/07)

**Objetivo:** Completar as funcionalidades restantes: vínculo aluno-oficina, certificados PDF, dashboard com estatísticas, testes automatizados (backend e frontend) e refinamentos finais.

**Atividades realizadas:**

| Atividade | RF / RNF | Descrição |
|-----------|----------|-----------|
| Vincular alunos às oficinas | RF10 | Tabela `oficina_alunos`, enrollment individual e em lote por escola |
| Visualizar alunos vinculados | RF11 | Aba de participantes no detalhe da oficina |
| Geração de certificados | RF12 | PDF A4 paisagem com nome do aluno, oficina e data |
| Exportação de certificados em PDF | RF13 | Rota `GET /certificate/:alunoId/:oficinaId` com download |
| Quantidade de alunos por oficina | RF14 | Dashboard exibe total de alunos, média por oficina e cards com contagem |
| Listagem de oficinas com participantes | RF15 | Cards de oficina com `studentCount` e dashboard com workshops recentes |
| Testes automatizados — Backend | RNF07 | 7 testes de API com `node:test` (CRUD alunos/oficinas, dashboard, validação) |
| Testes automatizados — Frontend | RNF07 | 92 testes com Vitest + Testing Library (16 arquivos: contexts, components, pages) |
| Cadastro em lote de alunos por escola | RF08 | `POST /create-alunos-batch` + interface "Adicionar por Escola" |
| Vinculação em lote por escola | RF10 | `POST /enroll-alunos-batch` + interface "Vincular por Escola" |
| Refinamentos e correções | — | Ajustes de layout, tratamento de erros, loading states |

**Arquivos criados/modificados:**

| Arquivo | Descrição |
|---------|-----------|
| `back-end/src/models/studentModel.js` | Modelo CRUD de alunos |
| `back-end/src/models/participantModel.js` | Modelo de vínculo aluno-oficina |
| `back-end/src/models/instructorModel.js` | Modelo de associação professor-oficina |
| `back-end/src/models/certificateModel.js` | Geração de certificados PDF |
| `back-end/src/models/dashboardModel.js` | Estatísticas do dashboard |
| `back-end/src/test-api.mjs` | 7 testes de API |
| `back-end/src/migrate.js` | Migração das tabelas |
| `src/routes/_app.certificates.tsx` | Página de certificados |
| `src/components/ui-kit/RoleGuard.tsx` | Componente de proteção por perfil |
| `src/__tests__/` (16 arquivos) | 92 testes frontend (Vitest) |
| `vitest.config.ts` | Configuração do Vitest |
| `src/context/` (4 arquivos) | Contextos reescritos para API |
| `src/routes/register.tsx` | Formulário completo de registro |
| `src/routes/_app.students.tsx` | Cadastro em lote e loading states |
| `src/routes/_app.index.tsx` | Dashboard com estatísticas reais |
| `src/components/workshops/` (3 arquivos) | MultiSelectTeachers, WorkshopCard, WorkshopStudents |
| `package.json` | Scripts test, migrate, test:front |

---

## Arquitetura do Sistema

### Linguagens
Frontend: HTML, CSS e JavaScript (React 19 + TypeScript).  
Backend: Node.js com Express 5.  
Banco de Dados: PostgreSQL com Supabase.

### Estrutura e organização
Padrão de projeto: MVC (Model-View-Controller).  
Metodologia: SCRUM.  
Framework de organização: Kanban.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    VIEW (React 19)                        │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐  │  │
│  │  │  Dashboard     │  │  Workshop      │  │ Student    │  │  │
│  │  │  Page          │  │  Management    │  │ Management │  │  │
│  │  └────────────────┘  └────────────────┘  └────────────┘  │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐  │  │
│  │  │  Certificate   │  │  Login Page    │  │ Navbar     │  │  │
│  │  │  Export        │  │                │  │ Component  │  │  │
│  │  └────────────────┘  └────────────────┘  └────────────┘  │  │
│  │                                                             │  │
│  │  Tailwind CSS 4 + shadcn/ui Components                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                    HTTP/WebSocket (tRPC)                        │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                    SERVIDOR (Node.js/Express)                   │
│                              │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │              CONTROLLER (tRPC Routers)                  │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Auth Router  │  │ Workshop     │  │ Student      │  │   │
│  │  │              │  │ Router       │  │ Router       │  │   │
│  │  │ • login      │  │              │  │              │  │   │
│  │  │ • logout     │  │ • create     │  │ • create     │  │   │
│  │  │ • me         │  │ • list       │  │ • list       │  │   │
│  │  │ • checkRole  │  │ • update     │  │ • update     │  │   │
│  │  │              │  │ • delete     │  │ • delete     │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Participant  │  │ Certificate  │  │ Dashboard    │  │   │
│  │  │ Router       │  │ Router       │  │ Router       │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ • enroll     │  │ • generate   │  │ • stats      │  │   │
│  │  │ • unenroll   │  │ • export     │  │ • workshops  │  │   │
│  │  │ • listByWS   │  │ • preview    │  │ • students   │  │   │
│  │  │ • listByStd  │  │              │  │ • teachers   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                          │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │              MODEL (Database Layer)                      │   │
│  │                                                          │   │
│  │  Drizzle ORM - Query Builders & Type Safety            │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Database Functions (server/db.ts)              │  │   │
│  │  │                                                  │  │   │
│  │  │  • createWorkshop()                             │  │   │
│  │  │  • getWorkshops()                               │  │   │
│  │  │  • updateWorkshop()                             │  │   │
│  │  │  • deleteWorkshop()                             │  │   │
│  │  │  • createStudent()                              │  │   │
│  │  │  • getStudents()                                │  │   │
│  │  │  • addStudentToWorkshop()                        │  │   │
│  │  │  • getWorkshopParticipants()                     │  │   │
│  │  │  • getDashboardStats()                          │  │   │
│  │  │  • ... (mais 20+ funções)                       │  │   │
│  │  │                                                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                    SQL Queries (MySQL Protocol)
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                    BANCO DE DADOS (PostgreSQL)                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ users        │  │ workshops    │  │ students     │           │
│  │              │  │              │  │              │           │
│  │ • id         │  │ • id         │  │ • id         │           │
│  │ • openId     │  │ • title      │  │ • name       │           │
│  │ • name       │  │ • description│  │ • age        │           │
│  │ • email      │  │ • date       │  │ • school     │           │
│  │ • role       │  │ • createdBy  │  │ • createdAt  │           │
│  │ • createdAt  │  │ • createdAt  │  │ • updatedAt  │           │
│  │ • updatedAt  │  │ • updatedAt  │  │              │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │ workshop_participants    │  │ workshop_instructors         │  │
│  │                          │  │                              │  │
│  │ • id                     │  │ • id                         │  │
│  │ • workshopId (FK)        │  │ • workshopId (FK)            │  │
│  │ • studentId (FK)         │  │ • instructorId (FK)          │  │
│  │ • enrolledAt             │  │ • createdAt                  │  │
│  │ • certificateGeneratedAt │  │                              │  │
│  │                          │  │                              │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```
