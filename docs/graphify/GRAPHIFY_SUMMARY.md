# Graphify Knowledge Graph Summary

**Última atualização**: 04/05/2026  
**Total de Nós**: 897  
**Total de Edges**: 1.693  
**Comunidades**: 98 clusters  
**Confiança**: 96% extracted, 2% inferred

---

## 🧠 Arquitetura Identificada

### Community 0: Impeccable Live Mode (71 nodes)
Core do sistema de iteração visual em tempo real.

**Subsistemas principais:**
- `impeccable-paths.mjs` → Resolução de caminhos e configuração
- `live-server.mjs` → Servidor central (event queue, polling, broadcast)
- `live-poll.mjs` → Client polling (browser ↔ server)
- `live-session-store.mjs` → Persistência de sessões (journal + snapshots)
- `live-complete.mjs` → Finalização de variantes (accept/discard)
- `live-resume.mjs` → Recuperação de sessões interrompidas

**Fluxo crítico:**
1. User clica elemento → `live-browser.js:handleClick()`
2. Servidor enfileira event → `enqueueEvent()` em `live-server.mjs`
3. Browser polla → `live-poll.mjs:pollCli()`
4. Autopilot processa → Python `impeccable-live-autopilot.py`
5. Variantes geradas → `live-wrap.mjs`
6. User aceita → `live-complete.mjs` registra snapshot

---

## 🔑 God Nodes (Conceitos + Conectados)

| Nó | Edges | Tipo | Propósito |
|-----|--------|------|-----------|
| `BaseSchemaValidator` | 25 | Class | Validação de schema (base para todos) |
| `DOCXSchemaValidator` | 17 | Class | Validação específica para .docx |
| `handleClick()` | 16 | Function | Event handler principal no browser |
| `handleKeyDown()` | 16 | Function | Keyboard shortcuts |
| `resumeSession()` | 16 | Function | Recover from interruptions |
| `renderDesignVisual()` | 15 | Function | Renderização de visuais |
| `el()` | 13 | Function | Element lookup utility |
| `wrapCli()` | 13 | Function | CLI wrapper |
| `k()` | 13 | Function | Utility (minified) |
| `readLiveServerInfo()` | 12 | Function | Lê config do servidor |

---

## 🎨 Design System Integration

### PRODUCT.md
- **Brand**: Azul profundo (#1a4a9e) + Laranja (#ff6b35)
- **Tone**: Moderno, minimalista, editorial
- **Users**: Designers + Developers iterando UI
- **Anti-patterns**: Sem glassmorphism, gradientes arco-íris, hero metrics

### DESIGN.md
- **Typography**: Scale 1.2x (13px → 48px)
- **Spacing**: Scale 4px → 72px
- **Colors**: Tintados em azul claro (chroma 0.008–0.01)
- **Components**: Button, Card, Hero (sem nested cards)

### Landing Page
- `test-live/index.html` (moderna, clean, responsiva)
- Seções: Hero + Features (3 cards) + Code + CTA
- Markers para Live: `<!-- Variants: insert below this line -->`

---

## 🔄 Fluxo de Geração de Variantes (V2)

```
Browser (User clica)
    ↓
live.mjs (injecta live.js)
    ↓
handleClick() → sendEvent("generate", element)
    ↓
live-server.mjs → enqueueEvent()
    ↓
impeccable-live-autopilot.py (polls continuamente)
    ↓
live-wrap.mjs (gera 3 variantes CSS)
    ↓
HTML atualizado + variantes adicionadas
    ↓
Browser renderiza 3 versões
    ↓
User: Accept/Discard
    ↓
live-complete.mjs → snapshot persistido
```

---

## 📊 Comunidades Principais (Top 5)

1. **Community 0** (71 nodes): Impeccable Live Mode subsystem
2. **Community 2** (48 nodes): Modern screenshot rendering
3. **Community 4** (42 nodes): Browser DOM manipulation
4. **Community 7** (38 nodes): Visual rendering + typography
5. **Community 10** (35 nodes): Event handling + interaction

---

## 🚀 Comandos Graphify Úteis

```bash
# Query com BFS (3 hops)
graphify_query_graph --depth 3 --mode bfs \
  --question "Como Live Mode gera variantes?"

# Caminho mais curto
graphify_shortest_path --source "live-poll.mjs" \
  --target "live-browser.js"

# Detalhes de um node
graphify_get_node --label "handleClick()"

# Vizinhos de um nó
graphify_get_neighbors --label "enqueueEvent()" \
  --relation_filter "calls"

# Membros de uma comunidade
graphify_get_community --community_id 0

# Stats gerais
graphify_graph_stats
```

---

## ✅ Validação

- ✅ Live server: `localhost:8400` 
- ✅ Helper injected: `test-live/index.html`
- ✅ Autopilot: Python process ativo
- ✅ PRODUCT.md: Brand guidelines definido
- ✅ DESIGN.md: Tokens CSS exportado
- ✅ Knowledge graph: 897 nodes, 1.693 edges

---

## 📝 Próximos Passos

1. **E2E Testing**: Usar Playwright MCP para testar Live Mode
2. **Performance**: Medir tempo de geração de variantes
3. **Analytics**: Exportar dados de eventos para análise
4. **Design Extraction**: Usar `$impeccable extract` para tokens do código
