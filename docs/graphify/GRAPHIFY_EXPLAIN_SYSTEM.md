# 🧠 Graphify System Explanation: OpenCode Architecture

**Análise completa via Graphify MCP**  
**897 nodes, 1.693 edges, 98 communities**

---

## 1️⃣ Camada Superior: Maestro (Orquestrador)

### O que é?
O Maestro é um agent manager que **nunca executa tarefas diretamente**. Ele apenas delega para 7 subagents especializados.

### Fluxo
```
Você: "Maestro, crie login page"
       ↓
Maestro (AGENTS.md):
  ├─ Frontend Agent → Design + HTML/CSS
  ├─ Backend Agent → API /login, /register
  ├─ Data Engineer → Tabela users no Supabase
  └─ Code Review Agent → Relatório de qualidade
```

### Configuração
- `opencode.json` → Define agents e MCPs
- `AGENTS.md` → Documentação completa dos 7 agentes
- **Permissões**: `edit: deny, bash: deny` (puro delegador)

---

## 2️⃣ Design System: Impeccable Live Mode

### Community 0: Live Mode Subsystem (71 nodes)

**Core Files:**
- `live-server.mjs` - Servidor central (event queue)
- `live-poll.mjs` - Client polling (browser ↔ server)
- `live-browser.js` - Injeção no browser + UI interativa
- `live-session-store.mjs` - Persistência (journal + snapshots)
- `live-complete.mjs` - Aceitar/descartar variantes
- `impeccable-live-autopilot.py` - Gerador automático

### Fluxo: User clica elemento

```
Browser: handleClick() [live-browser.js:L2345]
  ↓
sendEvent("generate", element)
  ↓
live-server.mjs: enqueueEvent()
  ↓
impeccable-live-autopilot.py: polls continuamente
  ↓
live-wrap.mjs: gera 3 variantes CSS
  ↓
live-session-store.mjs: persiste em journal
  ↓
Browser renderiza 3 versões lado a lado
  ↓
User: handleAccept() ou handleDiscard()
  ↓
live-complete.mjs: snapshot salvo no HTML
```

### Estrutura de Dados

**Event:**
```json
{
  "id": "session-123",
  "type": "generate",
  "element": {
    "tagName": "button",
    "id": "cta-primary",
    "textContent": "Start Designing"
  },
  "count": 3,
  "params": {}
}
```

**Variant:**
```css
/* Variante 1: Vermelho */
[data-variant="1"] button { background: #dc2626; }

/* Variante 2: Laranja */
[data-variant="2"] button { background: #ff6b35; }

/* Variante 3: Roxo */
[data-variant="3"] button { background: #7c3aed; }
```

---

## 3️⃣ Design Tokens: DESIGN.md Parsing

### Community 6: Design Parser (detecta tokens automaticamente)

**Funções:**
- `parseDesignMd()` - Lê DESIGN.md
- `extractColors()` - Extrai palette (Primary, Accent, Neutrals)
- `extractTypography()` - Scale 1.2x (13px → 48px)
- `extractElevation()` - Shadows (sm, md, lg, xl)

### Exemplo DESIGN.md Parsing

```markdown
# Color Palette

### Primary (Azul Profundo)
- `--color-primary`: #1a4a9e

Parseado como:
{
  "colors": {
    "primary": {
      "name": "Primary (Azul Profundo)",
      "hex": "#1a4a9e",
      "usage": "Primary buttons, headings"
    }
  }
}
```

---

## 4️⃣ Knowledge Graph: God Nodes

### Conceitos Mais Conectados

| Nó | Edges | Função |
|-----|--------|---------|
| **BaseSchemaValidator** | 25 | Validação core (todas as skills) |
| **handleClick()** | 16 | Event handler Live Mode |
| **resumeSession()** | 16 | Recuperação de sessões |
| **renderDesignVisual()** | 15 | Renderização de visuais |
| **el()** | 13 | DOM element lookup |
| **wrapCli()** | 13 | CLI wrapper utilidade |

### Por que são importantes?

1. **BaseSchemaValidator**: Valida PRODUCT.md, DESIGN.md, landing page
2. **handleClick()**: Inicia geração de variantes
3. **resumeSession()**: Recupera trabalho interrompido
4. **renderDesignVisual()**: Mostra 3 variantes no browser

---

## 5️⃣ Communities (Subsistemas)

### Top 5 Communities

| Community | Nodes | Propósito |
|-----------|-------|-----------|
| **0** | 71 | Impeccable Live Mode (server + poll + session store) |
| **2** | 48 | Modern screenshot rendering (screenshots variantes) |
| **4** | 42 | Browser DOM manipulation (click handlers) |
| **7** | 38 | Visual rendering + typography |
| **10** | 35 | Event handling + interaction |

### Mapa Visual

```
┌─ Community 0: Live Mode Server ─┐
│  live-server.mjs                │
│  live-poll.mjs                  │
│  live-session-store.mjs         │
│  ↓                              │
└─────────────────────────────────┘
        ↓
┌─ Community 4: Browser Handler ──┐
│  live-browser.js:handleClick()  │
│  live-browser.js:handleKeyDown()│
│  ↓                              │
└─────────────────────────────────┘
        ↓
┌─ Community 2: Screenshot Render ┐
│  modern-screenshot.umd.js       │
│  Renderiza 3 variantes PNG      │
│  ↓                              │
└─────────────────────────────────┘
        ↓
┌─ Community 7: Typography ────────┐
│  renderDesignVisual()           │
│  fetchDesignSystem()            │
└─────────────────────────────────┘
```

---

## 6️⃣ MCPs: Extensões do Sistema

### Configurados em `opencode.json`

| MCP | Função | Quando usar |
|-----|--------|-------------|
| **Context7** | Docs atualizadas (Express, React, etc.) | `context7_query-docs` |
| **Graphify** | Knowledge graph do codebase | `graphify_query_graph` |
| **GitHub** | Gerencia repos, PRs, issues | Git automation |
| **Linear** | Gerencia tasks e sprints | Project planning |
| **Playwright** | Browser automation (QA) | E2E testing |
| **Supabase** | Database multi-projeto | Data management |

---

## 7️⃣ Skills: Conhecimento Especializado

### 7 Subagent Skills

```
skills/
├── impeccable/              → Design system + Live Mode
├── backend/                 → API design, authentication
├── security/                → OWASP Top 10, vulnerabilities
├── data-engineer/           → Supabase, SQL, migrations
├── qa/                      → Playwright, E2E testing
├── devops/                  → CI/CD, infrastructure
└── code-review/             → Security, performance, design
```

**Como funciona:**
```
Você: "Maestro, crie login"
Maestro: "Frontend Agent, use /impeccable teach"
Frontend Agent:
  1. Carrega skill impeccable
  2. Executa /impeccable teach
  3. Cria PRODUCT.md
  4. Entra em Live Mode
  5. Gera design interativamente
```

---

## 8️⃣ Fluxo End-to-End: Completo

### Cenário: "Crie landing page moderna"

```
1. [Você] "Maestro, crie landing page"
   
2. [Maestro] Delega para Frontend Agent
   
3. [Frontend] Executa 3 passos:
   a) /impeccable teach → Cria PRODUCT.md
      - Brand: Azul + Laranja
      - Tone: Minimalista, editorial
      
   b) Cria HTML base em test-live/index.html
      - Hero section
      - Feature cards (3 colunas)
      - CTA section
      
   c) npm run live:start
      - Page server (localhost:4173)
      - Helper (injeta live.js)
      - Autopilot (polls continuamente)
      
4. [You] Abre http://localhost:4173
   - Clica em "Start Designing" button
   - "Generate" panel aparece
   - Autopilot cria 3 variantes:
     * Variante 1: Azul claro (#4a7fd6)
     * Variante 2: Laranja (#ff6b35)
     * Variante 3: Verde (#10b981)
   - Você escolhe Variante 2
   - Variante foldeada no HTML
   
5. [Frontend] Itera sobre hero title
   - Clica em "OpenCode Impeccable"
   - Autopilot gera:
     * Cor: Laranja
     * Tipografia: 3xl (40px) vs 4xl (48px)
     * Espaçamento: aumenta letter-spacing
   
6. [Maestro] Delega para Backend Agent
   - Backend: "Crie API de design tokens"
   - Context7 busca docs Express
   - Backend cria GET /api/design/tokens
   
7. [Maestro] Delega para Code Review
   - Code Review: "Analise HTML + CSS"
   - Relatório: Nielsen's heuristics
   - Feedback: Melhorar contrast ratio
   
8. [Você] Aprova e commita!
```

---

## 9️⃣ Insights do Graphify

### Surprising Connections (Cross-comunidade)

```
BaseSchemaValidator [validator.ts]
  ↔ renderDesignVisual() [live-browser.js]
  
Por que? Ambos validam/renderizam design tokens
Confiança: INFERRED
```

### Anomalias Detectadas

- ✅ Nenhuma circular dependency
- ✅ Live Mode isolado (Community 0)
- ✅ Design Parser bem integrado
- ⚠️ handleClick() com 16 edges (considerar split em future)

---

## 🔟 Resumo: Arquitetura Completa

```
┌─────────────────────────────────────────────────┐
│          Você (Terminal/CLI)                    │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│      Maestro (Agent Orchestrator)               │
│    (Puro delegador, nunca executa)              │
└─┬─────┬──────────┬──────────┬────────┬──────┬───┘
  │     │          │          │        │      │
  ▼     ▼          ▼          ▼        ▼      ▼
┌──┐ ┌──┐      ┌──────┐   ┌──────┐  ┌──┐  ┌──────┐
│FR│ │BA│      │Data  │   │QA    │  │DO│  │Code  │
│ON│ │CK│      │Engr  │   │Test  │  │Ps│  │Revie │
│TE│ │EN│      │      │   │      │  │  │  │      │
│ND│ │D │      │      │   │      │  │  │  │      │
└──┘ └──┘      └──────┘   └──────┘  └──┘  └──────┘

Cada Agent tem:
- Skills (conhecimento especializado)
- MCPs (extensões do sistema)
- Permissões (edit/bash allow/deny)
```

---

## ✅ Checklist: Entender o Sistema

- [x] **Maestro**: Delegador, 7 subagents
- [x] **Community 0**: Live Mode (71 nodes)
- [x] **Fluxo**: Click → enqueue → autopilot → render → accept
- [x] **God Nodes**: BaseSchemaValidator, handleClick, resumeSession
- [x] **MCPs**: Context7, Graphify, GitHub, Linear, Playwright, Supabase
- [x] **Skills**: 7 agentes especializados
- [x] **Design Tokens**: Parseados de DESIGN.md
- [x] **End-to-End**: Landing page com Live Mode

---

## 🎯 Próxima Ação

```bash
# Explore o grafo você mesmo
graphify_query_graph --depth 4 \
  --question "Como data engineer cria tabelas?"

# Encontre god nodes
graphify_god_nodes --top_n 20

# Mapear comunidades
graphify_get_community --community_id 1
```

**O sistema está pronto. Você compreende a arquitetura!** 🚀
