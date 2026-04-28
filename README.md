# Sistema Web de Controle de Oficinas e Participantes (ELLP)

## Requisitos Funcionais

### 1.1 Usuários e Acesso
RF01: O sistema deve permitir o cadastro de usuários com perfis (administrador e professor/tutor). 
RF02: O sistema deve permitir autenticação por meio de login e logout.  
RF03: O sistema deve controlar o acesso às funcionalidades conforme o perfil do usuário. 

### 1.2 Oficinas  
RF04: O sistema deve permitir o cadastro de oficinas contendo tema, descrição e data.  
RF05: O sistema deve permitir a listagem das oficinas cadastradas.
RF06: O sistema deve permitir a edição e exclusão de oficinas.  
RF07: O sistema deve permitir associar professores/tutores às oficinas. 

### 1.3 Alunos  
RF08: O sistema deve permitir o cadastro de alunos (nome, idade e escola).  
RF09: O sistema deve permitir a listagem dos alunos cadastrados.  
RF10: O sistema deve permitir vincular alunos às oficinas.  
RF11: O sistema deve permitir visualizar os alunos vinculados a uma oficina.

### 1.4 Certificados 
RF12: O sistema deve gerar certificados contendo o nome do aluno e a oficina participante.  RF13: O sistema deve permitir a exportação do certificado em formato PDF. 

### 1.5 Visualização de Dados 
RF14: O sistema deve apresentar a quantidade de alunos por oficina.  
RF15: O sistema deve apresentar listagem de oficinas com seus respectivos participantes

## Requisitos Não Funcionais

### 2.1 Tecnologia
RNF01: O sistema deve ser acessível via navegador web.
RNF02: O sistema deve utilizar tecnologias amplamente conhecidas e de fácil implementação
RNF03: O sistema deve utilizar banco de dados relacional. 

### 2.2 Desempenho  
RNF04: O tempo de resposta das requisições não deve exceder 2 segundosem condições normais de uso.

### 2.3 Segurança 
RNF05: As senhas dos usuários devem ser armazenadas de forma criptografada.  
RNF06: O sistema deve exigir autenticação para acesso às funcionalidadesprotegidas.

### 2.4 Qualidade
RNF07: O sistema deve possuir testes automatizados básicos para suas principais funcionalidades.
RNF08: O código-fonte deve ser versionado em repositório Git.

# Definição da arquitetura do sistema

## Linguagens:
Frontend: HTML, CSS e JavaScript e eventuais frameworks e bibliotecas adicionais.  
Backend: Node.js com Express.  Banco de Dados: PostgreSQL com Supabase (gerenciador de banco de dados online).  

## Estrutura e organização: 
Padrão de projeto: MVC (Model-View-Controller).
Metodologia: SCRUM.
Framework de organização: Kanban

### Sprint 1 
06/04 - 10/05  
Implementação de autenticação (login/logout).  CRUD de oficinas.  CRUD de alunos.


### Sprint 2 25/05 - 28/06 

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
│  │  │ • listByStd  │  │              │  │              │  │   │
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
│                    BANCO DE DADOS (MySQL)                        │
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
Implementação do vínculo entre alunos e oficinas.  Geração de certificados.  Implementação de listagens e visualizações.
Entrega 05/07


