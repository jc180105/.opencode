# Sistema de Agentes OpenCode

## Regra #1: Graphify First (com critério)
Agentes DEVEM chamar `graphify_query_graph` antes de mudanças que afetam arquitetura, múltiplos arquivos ou lógica desconhecida. Para tarefas simples e pontuais (corrigir um typo, ajustar um estilo, editar 1 arquivo já conhecido), o Graphify é opcional — use o julgamento.

**Use sempre:** refatorações, novas features, debugging de causa desconhecida, mudanças arquiteturais.
**Opcional:** correções pontuais em arquivos já vistos no contexto da conversa.

> NÃO leia o SKILL.md do graphify para fazer queries — use direto o MCP tool `graphify_query_graph`. O SKILL.md só é necessário para rodar o pipeline `/graphify` completo.

### ⚠️ Projeto novo (grafo ainda não existe)
Se `graphify_query_graph` retornar erro, grafo vazio ou "no graph found":
1. **Não tente consertar o graphify** — isso não é sua responsabilidade agora.
2. **Prossiga com a tarefa** usando `list_files` e leitura direta de arquivos para entender o código.
3. O grafo será construído depois com `/graphify` quando o projeto tiver conteúdo suficiente.
4. **Regra: graphify é um auxílio, não um bloqueador.** Se não está disponível, continue.

## Regra #2: MCP First — Nunca Invente
NUNCA assuma ou invente APIs, schemas ou comportamentos de bibliotecas. SEMPRE use MCPs antes de escrever código:
- **context7** → documentação atualizada de qualquer lib (resolve-library-id + get-library-docs)
- **supabase MCP** → operações de banco de dados, schema, auth
- **github MCP** → repositórios, CI/CD, PRs, secrets
- **graphify** → mapa do codebase atual

## Regra #3: Windows-First (cross-platform aware)
O ambiente primário é **Windows 11 com PowerShell**. Regras obrigatórias:
- Encadeamento de comandos: use `;` (NÃO `&&`)
  - ❌ `npm install && npm run dev`
  - ✅ `npm install; npm run dev`
- Python: use `python` (NÃO `python3`) — se falhar, tente `py`
  - ✅ `python -m pip install <pkg>`
  - ✅ `python -m venv .venv`
  - ✅ `.venv\Scripts\Activate.ps1` (Windows) ou `.venv/bin/activate` (Linux/Mac)
- Paths em Python: sempre use `pathlib.Path` (nunca hardcode `/` ou `\`)
- Verificar binário: use `where <cmd>` (NÃO `which <cmd>`)
- Scripts locais: `.ps1` (PowerShell). Scripts Docker/CI: `.sh` (bash OK lá)

## Regra #4: Skills São Contextuais (não sempre obrigatórias)
Skills devem ser lidas quando o contexto da tarefa realmente exige — não automaticamente em toda execução. Isso economiza tokens e mantém o contexto relevante.

**Quando ler skills de design (`impeccable`, `awesome-design`):**
- ✅ Criar ou redesenhar um componente/página
- ✅ Tarefa explicitamente de UI/UX
- ❌ Corrigir bug de lógica, ajustar validação, editar config

**Quando ler `awesome-design`:** Escolha APENAS 1 site por nome. Nunca liste toda a pasta `design-md/`.

**Quando ler skills de backend (`backend`, `production-code-audit`):**
- ✅ Criar nova API, refatorar camada de dados, revisar segurança
- ❌ Pequenas correções em arquivos já conhecidos no contexto

**Quando ler `code-review`:** Sempre que a tarefa for revisão de código.
**Quando ler `clean-code`:** Se você sentir que a lógica está ficando muito longa ou complexa, pare e leia para se corrigir.

## Regra #5: Shared Memory para Times (Open Multi-Agent Pattern via MCP)
Quando Maestro delega para um **TIME** (não agente isolado), os agentes DEVEM usar o **Memory MCP**:
1. **Ler memória compartilhada antes de começar**: 
   Use a tool `memory_read(team_name="feature-team")` para ver o que outros agentes fizeram.
2. **Escrever resultados para outros agentes**:
   Use a tool `memory_write(team_name="feature-team", agent_name="backend", key="api_design", value={"endpoints": ["/users"]})`
3. **Verificar trabalho de outros agentes antes de iniciar**:
   - Frontend deve ler o que Backend escreveu sobre APIs
   - QA deve ler o que Frontend e Backend implementaram
   - DevOps deve ler o que Security auditou
4. **Usar chaves (keys) descritivas**: Use nomes claros como `api_design`, `database_schema`, `ui_components`, `test_results`
5. **Times configurados no `opencode.json`**:
   - `feature-team`: frontend + backend + qa (sharedMemory: true)
   - `infra-team`: devops + security (sharedMemory: true)
   - `data-team`: data-engineer + backend (sharedMemory: true)
 
## Regra #6: State Persistence (LangGraph Pattern via MCP)
Quando um agente executa tarefas multi-etapas ou mantém contexto entre delegações, DEVE usar as tools do Memory MCP para persistir o estado:

1. **Salvar estado da tarefa atual**:
   Use `state_save(thread_id="feature_X_dev", agent_name="backend", state={"step": 1, "progress": "50%"})`
   
2. **Retomar estado se for re-delegado**:
   Use `state_get(thread_id="feature_X_dev", agent_name="backend")` para pegar onde parou.

**Benefícios:**
- ✅ Estado persiste entre delegações do Maestro via chamadas de ferramentas nativas
- ✅ Chega de gerar e executar código Python para salvar memória
- ✅ Suporte a múltiplos agentes por thread
- ✅ Funciona de forma invisível via SQLite em background

## Regra #7: Anti-Overengineering (Clean Code)
IAs tendem a escrever código gigante e complexo para tarefas simples. Isso é PROIBIDO.
- **YAGNI (You Aren't Gonna Need It)**: Faça apenas o que foi pedido, nada a mais. Sem abstrações "para o futuro".
- **Early Returns**: Use cláusulas de guarda. Sem "ifs" aninhados.
- **Sem código morto**: Nunca comente código velho. Delete-o.
- Em caso de dúvida, leia a skill `clean-code`. Menos código é sempre melhor.

## Regras Fundamentais
- **Maestro**: Único manager. Apenas delega, NUNCA executa. Permissões: edit=deny, bash=deny.
- **Subagents**: 7 especialistas que executam. Apenas Maestro pode delegar.
- **Context7**: Documentação atualizada de libs. Usar ANTES de escrever código para não inventar APIs.
- **find-docs**: Complementa context7 para docs não cobertos.

## Time

### Times com Shared Memory (Open Multi-Agent Pattern)

| Time | Agentes | Shared Memory | maxConcurrency | Propósito |
|------|----------|---------------|----------------|-----------|
| **feature-team** | frontend, backend, qa | ✅ true | 2 | Desenvolvimento de features completas |
| **infra-team** | devops, security | ✅ true | 1 | Infraestrutura e segurança |
| **data-team** | data-engineer, backend | ✅ true | 2 | Banco de dados e backend data |

### Agentes Individuais

| Agente | Função | Skills Chave | MCPs Obrigatórios |
|--------|--------|--------------|-------------------|
| Maestro | Orquestrador (só delega) | graphify, context7-mcp, find-skills, find-docs | graphify, context7, duckduckgo-search |
| Frontend | UI/UX + Design | impeccable, awesome-design, frontend, find-docs | graphify, context7, figma |
| Backend | APIs + lógica de negócio | backend, production-code-audit, find-docs | graphify, context7, supabase |
| Security | Auditoria + OWASP | security, production-code-audit, find-docs | graphify, context7, github |
| Data Engineer | Supabase + database | database, find-docs | graphify, context7, **supabase** |
| QA | Testes + acessibilidade | testing, find-docs | graphify, context7, playwright |
| DevOps | CI/CD + infraestrutura | devops, find-docs | graphify, context7, github |
| Code Review | Revisão (só reporta, nunca edita) | code-review, find-docs | graphify, context7 |

## Workflow de Delegação

1. Humano pede ao Maestro
2. Maestro chama `graphify_query_graph` para entender contexto
3. Maestro usa `context7` se a tarefa envolve uma biblioteca específica
4. Maestro delega para subagent(s) correto(s) com contexto completo
5. Subagent chama `graphify_query_graph` para entender código existente
6. Subagent usa `context7` para documentação atualizada da lib
7. Subagent executa a tarefa usando suas skills obrigatórias
8. Code Review valida (se necessário)
9. Humano aprova resultado final

## Python Cross-Platform Cheatsheet

```powershell
# Criar venv (Windows)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Instalar deps
python -m pip install -r requirements.txt

# Rodar script
python script.py

# Rodar módulo
python -m pytest
python -m uvicorn app:main --reload
```

```bash
# Criar venv (Linux/Mac/Docker)
python3 -m venv .venv
source .venv/bin/activate

# Instalar deps
python3 -m pip install -r requirements.txt
```

Em código Python, sempre use `pathlib.Path` para caminhos:
```python
from pathlib import Path

# Cross-platform — funciona no Windows E no Linux
base = Path(__file__).parent
data_file = base / "data" / "file.json"
```
