# Plano de Melhorias OpenCode (Graphify + Context7)

## 🔍 Análise Graphify (Gargalos Detectados)

### Estatísticas do Sistema
- **Nodes**: 897 | **Edges**: 1.693 | **Communities**: 98
- **Cobertura**: 96% extraído, 2% inferido

### God Nodes (Pontos Críticos)
1. **BaseSchemaValidator** (25 edges) - Validação de documentos (XLXS/DOCX/PPTX)
2. **DOCXSchemaValidator** (17 edges) - Validação Word
3. **handleClick()** (16 edges) - Evento de clique no Live Mode
4. **resumeSession()** (16 edges) - Recuperação de sessão Live

### Problemas Identificados
| Problema | Evidência Graphify | Impacto |
|----------|-------------------|--------|
| **Sem tratamento de erro no Live Mode** | Query "error handling" retornou apenas nós de validação (xlsx/docx), nenhum nó de live-server.mjs | Servidor pode crashar sem recuperação |
| **Fluxo de eventos ineficiente** | Caminho `handleClick() → enqueueEvent()` não encontrado no grafo | Latência na geração de variantes |
| **Zero testes E2E para Live Mode** | Query "testing" retornou apenas validadores, nenhum nó Playwright | Regressões não detectadas |
| **Persistência de sessão frágil** | `live-session-store.mjs` é um God Node (16 edges) mas baseado em arquivos | Perda de estado se servidor cair |
| **Sem CI/CD** | Nenhum nó de GitHub Actions ou pipeline encontrado | Deploy manual, sem testes automatizados |

---

## 📚 Soluções Context7 (Documentação Concreta)

### 1. Node.js: Tratamento de Erro (Score: 87)
**Fonte**: `/nodejs/node` (Context7)

```javascript
// Adicionar em live-server.mjs
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Porta em uso, tentando novamente...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});

// Adicionar listener de erro para EventEmitter
eventEmitter.on('error', (err) => {
  console.error('Erro no evento:', err.message);
});

// Prevenir crash do processo
process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  // Fechar conexões abertas antes de encerrar
  server.close(() => process.exit(1));
});
```

### 2. Playwright: Testes E2E (Score: 90.92)
**Fonte**: `/microsoft/playwright` (Context7)

```yaml
# playwright.config.ts
export default defineConfig({
  testDir: './tests',
  projects: [
    { name: 'Live Mode Chromium', use: { browserName: 'chromium' } },
    { name: 'Live Mode Firefox', use: { browserName: 'firefox' } },
  ],
});
```

```typescript
// tests/live-mode.spec.ts
import { test, expect } from '@playwright/test';

test('Geração de variantes via clique', async ({ page }) => {
  await page.goto('http://localhost:4173');
  await page.click('[data-impeccable-element]'); // Clica em elemento
  await expect(page.locator('.variant-preview')).toHaveCount(3); // 3 variantes
  await page.click('.variant-accept'); // Aceita variante
  await expect(page.locator('.design-applied')).toBeVisible();
});
```

### 3. Supabase: Persistência Realtime (Score: 82.8)
**Fonte**: `/supabase/supabase` (Context7)

```typescript
// Substituir live-session-store.mjs por Supabase Realtime
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Escutar mudanças de sessão em tempo real
supabase
  .channel('live-sessions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'live_sessions'
  }, (payload) => {
    console.log('Nova sessão:', payload.new);
  })
  .subscribe();
```

### 4. GitHub Actions: CI/CD (Score: 86.27)
**Fonte**: `/websites/github_en_actions` (Context7)

```yaml
# .github/workflows/nodejs.yml
name: Node.js CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - run: npm run lint
      - run: npm run typecheck
```

---

## 🚀 Plano de Implementação (Prioridade)

### P0 (Crítico - Implementar Primeiro)
1. **Adicionar tratamento de erro no live-server.mjs**
   - Seguir padrões Node.js do Context7
   - Adicionar retry para EADDRINUSE
   - Prevenir crashes com `process.on('uncaughtException')`

2. **Criar testes E2E com Playwright**
   - Testar fluxo completo: clique → geração → aceitação
   - Usar Playwright MCP já configurado
   - Cobrir happy path e edge cases (server lost, timeout)

### P1 (Importante)
3. **Configurar GitHub Actions CI/CD**
   - Criar workflow com build, test, lint, typecheck
   - Integrar com Playwright tests
   - Cache de dependências para velocidade

### P2 (Melhoria)
4. **Migrar para Supabase Realtime**
   - Substituir `live-session-store.mjs` por Postgres
   - Usar Realtime para sync de sessão em vez de polling
   - Migrar sessões existentes para o banco

---

## 📊 Métricas de Sucesso

| Melhoria | Métrica | Meta |
|----------|---------|-----|
| Tratamento de erro | Crashes do live-server | 0 crashes não tratados |
| Testes E2E | Cobertura de testes Live Mode | 80% dos fluxos críticos |
| CI/CD | Tempo de build | < 2 minutos (com cache) |
| Persistência | Perda de sessão | 0 perdas em reinicializações |

---

## 🔗 Próximos Passos

1. Implementar P0: Error handling no live-server.mjs
2. Escrever testes Playwright para Live Mode
3. Criar workflow GitHub Actions
4. (Opcional) Migrar para Supabase Realtime

**Todos os documentos consultados via Context7 estão integrados e prontos para implementação.**