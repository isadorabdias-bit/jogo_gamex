# 🎮 MathPlay Solutions

> **Plataforma Educacional Gamificada de Matemática para o Ensino Fundamental II (11 a 14 anos)**

A **MathPlay Solutions** transforma o aprendizado de Matemática em uma jornada dinâmica, intuitiva e acessível por meio de uma trilha de aprendizagem em formato de mapa de fases, jogos matemáticos interativos com mecânicas didáticas avançadas e acompanhamento detalhado de desempenho para alunos e professores.

---

## 🌟 Principais Recursos

- **Trilha de Aprendizagem (Mapa de Fases)**:
  - Navegação visual sequencial estilo mapa de jogo (*Duolingo / Mario World*).
  - 6 estações desafiadoras com desbloqueio gradual e conquista de até 3 estrelas por fase.
- **2 Jogos Educativos Completos (Ensino Fundamental II)**:
  1. ⚖️ **Balança das Equações** (*Álgebra e Equações de 1º Grau*):
     - Balança interativa de dois pratos que se inclina e se equilibra com caixas de variáveis \(x\) e blocos de peso.
     - Dicas progressivas em 3 etapas sem entregar a resposta final.
     - Explicação didática imediata pós-erro com passo a passo das operações inversas.
     - Níveis adaptativos: Fácil (1 etapa), Médio (2 etapas com coeficientes), Difícil (incógnita em ambos os membros).
  2. 🍕 **Mestre das Frações & Porcentagens** (*Aritmética e Geometria Visual*):
     - Gráficos vetoriais SVG dinâmicos de fatias de pizza e barras particionadas.
     - Identificação de frações, frações equivalentes, frações irredutíveis e conversão para porcentagem.
     - Dicas progressivas em 3 etapas e feedback visual ilustrado ao errar.
     - Níveis adaptativos: Fácil, Médio e Difícil.
- **Gamificação Completa**:
  - Sistema de XP e Níveis contínuos.
  - Galeria de 8 Insígnias/Medalhas desbloqueáveis (com notificação comemorativa e confetes).
  - Multiplicador de combo por acertos seguidos e efeitos sonoros procedurais via Web Audio API.
- **Dashboards Diferenciados**:
  - **Painel do Aluno**: Nível, taxa global de acertos (%), estrelas na trilha, mural de medalhas e histórico completo de partidas gravadas no banco.
  - **Ranking (Leaderboard)**: Pódio dos 3 melhores alunos e classificação geral por XP.
  - **Painel Pedagógico do Professor**: Métricas da turma (taxa de acerto coletiva, partidas jogadas), lista de alunos com filtro de busca e feed de atividades em tempo real.
- **Autenticação & Banco de Dados Real**:
  - Sessão persistente via JWT (`/api/auth/me`).
  - Banco de dados relacional **SQLite** nativo (`backend/data/mathplay.db`), sem necessidade de instalar servidores externos de banco.

---

## 🚀 Stack Tecnológica

| Camada | Tecnologias |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API |
| **Backend** | Node.js, Express, CORS, JWT (`jsonwebtoken`), Bcryptjs |
| **Banco de Dados** | SQLite Relacional (`mathplay.db`) com integridade referencial via Chaves Estrangeiras |

---

## 📁 Estrutura de Pastas do Projeto

```
jogo_gamex/
├── backend/
│   ├── data/
│   │   └── mathplay.db              # Banco de dados relacional SQLite
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Inicialização das tabelas SQLite
│   │   ├── controllers/
│   │   │   ├── authController.js    # Registro, login, getMe e perfil
│   │   │   ├── gameController.js    # Banco de questões e persistência com gamificação
│   │   │   └── statsController.js   # Dashboards, ranking e painel do professor
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # Validação de JWT e verificação de perfil
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth
│   │   │   ├── gameRoutes.js        # /api/games
│   │   │   └── statsRoutes.js       # /api/stats
│   │   ├── data/
│   │   │   └── seeds.js             # Povoamento inicial (badges, alunos e professor)
│   │   └── server.js                # Servidor Express (porta 3001)
│   ├── package.json
│   └── test-api.js                  # Script de teste automatizado de integração
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Barra de status, XP, som e navegação
│   │   │   ├── Footer.jsx           # Rodapé com informações pedagógicas
│   │   │   ├── AvatarIcon.jsx       # 8 opções de avatares estilizados
│   │   │   └── BadgeModal.jsx       # Modal festivo com confetes
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Sessão persistente e estado global do usuário
│   │   ├── games/
│   │   │   ├── EquationGame.jsx     # Jogo 1: Balança das Equações
│   │   │   └── FractionGame.jsx     # Jogo 2: Mestre das Frações & Porcentagens
│   │   ├── pages/
│   │   │   ├── HomeHub.jsx          # Trilha de aprendizagem em mapa de fases
│   │   │   ├── Dashboard.jsx        # Estatísticas do estudante e histórico
│   │   │   ├── Leaderboard.jsx      # Ranking geral dos estudantes
│   │   │   ├── TeacherPanel.jsx     # Painel pedagógico do professor
│   │   │   ├── Profile.jsx          # Personalização de avatar e dados
│   │   │   ├── Login.jsx            # Login com atalhos para contas demo
│   │   │   └── Register.jsx         # Cadastro de Aluno ou Professor
│   │   ├── services/
│   │   │   └── api.js               # Cliente HTTP com injeção automática de token
│   │   ├── utils/
│   │   │   └── audio.js             # Sintetizador procedural Web Audio API
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json                     # Scripts raiz de atalho
└── README.md                        # Este documento
```

---

## ⚡ Instruções de Instalação e Execução

### Pré-requisitos
- **Node.js** v20 ou superior (testado com Node v22).
- **npm** v10 ou superior.

---

### Passo 1: Instalação das Dependências

Abra um terminal na pasta raiz do projeto (`jogo_gamex`):

```bash
# Instala as dependências do Backend e do Frontend
npm run install:all
```

*(Ou instale separadamente: `cd backend && npm install`, depois `cd ../frontend && npm install --legacy-peer-deps`)*

---

### Passo 2: Inicializar o Banco de Dados (Seeds)

Popula o SQLite com insígnias, contas de teste e histórico:

```bash
npm run seed
```

---

### Passo 3: Executar a Aplicação

Em dois terminais separados (ou usando seus comandos habituais):

#### Terminal 1 — Backend:
```bash
npm run start:backend
```
> O servidor iniciará em `http://localhost:3001` com SQLite pronto.

#### Terminal 2 — Frontend:
```bash
npm run start:frontend
```
> O Vite iniciará o frontend em `http://localhost:5173`. Acesse essa URL no seu navegador!

---

## 🔑 Contas Demonstrativas para Avaliação

A tela de login possui **botões de preenchimento rápido em 1 clique**:

| Papel | E-mail | Senha | Descrição |
|---|---|---|---|
| **Aluno** | `aluno@mathplay.com` | `senha123` | Lucas Silva (7º Ano) — com histórico, estrelas e XP na trilha. |
| **Professor** | `professor@mathplay.com` | `senha123` | Prof. Carlos Oliveira — acesso liberado ao **Painel do Professor**. |

*Você também pode cadastrar novos alunos ou professores livremente pela tela de cadastro.*

---

## 🧪 Verificação Automatizada da API

Para rodar os testes automatizados que validam todas as rotas (login, questões, salvamento de sessão com XP/insígnias e painel do professor):

```bash
npm run test:backend
```

---

## 🎯 Relação com os Requisitos do Projeto

- [x] **Autenticação & Usuários**: Perfis de Aluno e Professor, sessão persistente via JWT, tela de edição de perfil e avatares.
- [x] **Banco de Dados Real**: SQLite relacional (`mathplay.db`) com histórico de partidas, pontuação, acertos/erros, estrelas na trilha e insígnias.
- [x] **UI/UX Responsiva e Acessível**: Design *mobile-first* com Tailwind CSS, paleta lúdica para faixa de 11 a 14 anos, e sintetizador de áudio procedural leve.
- [x] **Painel do Usuário (Dashboard)**: Estatísticas completas, medalhas com requisitos de bloqueio/desbloqueio, taxa de acerto (%) e tabela com dados gravados no banco.
- [x] **Página Inicial (Hub)**: Trilha de aprendizagem em formato de mapa de fases conectadas com estrelas e status de progressão.
- [x] **2 Jogos Educativos Completos**: Balança das Equações e Mestre das Frações, cada um com Dicas Progressivas (3 níveis), Feedback Didático Pós-Erro, Níveis Adaptativos e Recompensas Visuais.
- [x] **Painel do Professor**: Métricas agregadas da turma, histórico de atividades recentes e visão individual dos alunos.
