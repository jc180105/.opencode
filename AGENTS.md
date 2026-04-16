# OpenCode Agents

Este projeto segue uma arquitetura Multi-Agent Orchestration otimizada para o projeto atual.

---

## Fluxo de Execução

```
Usuário → build (primary)
            ↓ delega via @menção
  @Artist / @Engine / @Guardian / @Librarian / @explore (subagents)
            ↓
          Contexto (opencode-context/)
            ↓
         Execução
```

---

## Primary Agent
### build
- **Modo**: primary (Tab para alternar)
- **Descrição**: Agente principal de desenvolvimento com orquestração inteligente
- **Capacidade**: Executa diretamente OU delega para subagentes via `@menção`
- **Regra**: Pode fazer tudo — lê contexto, executa, e invoca subagentes quando necessário

**Matriz de Delegação:**
| Pedido contém | Delegar para |
|--------------|-------------|
| UI/Visual: botão, tela, estilo, cor, animação | @Artist |
| Backend: API, banco, hook, dados | @Engine |
| Validação: teste, segurança, review | @Guardian |
| Memória: documente, lembre, contexto | @Librarian |
| Explorar: buscar, encontrar, pesquisar | @explore |

---

## Subagentes Especialistas

### @Artist (`.ui-ux`)
- **Modo**: all
- **Descrição**: Design Premium (UI/UX)
- **Stack**: Detecta automaticamente via skill react-component e ui-ux-pro-max
- **Contexto**: Lê conventions.md, stack.md, components.md do opencode-context/

### @Engine (`.roo`)
- **Modo**: all
- **Descrição**: Backend e Lógica
- **Stack**: Detecta automaticamente via skills sql-database e rest-api
- **Contexto**: Lê database.md, api.md, queries.md do opencode-context/

### @Guardian (`.kilocode`)
- **Modo**: all
- **Descrição**: Segurança e Testes
- **Stack**: Detecta automaticamente via conventions.md e skills
- **Contexto**: Lê conventions.md para code review

### @Librarian (`.augment`)
- **Modo**: all
- **Descrição**: Conhecimento e RAG
- **Contexto**: Lê todo opencode-context/ para informações

### @explore
- **Modo**: subagent
- **Descrição**: Exploração somente-leitura da codebase
- **Ferramentas**: Apenas leitura (write/edit/bash desabilitados)
- **Quando usar**: Buscar arquivos, pesquisar código, entender estrutura

---

## Regras de Carregamento Externo

> [!IMPORTANT]
> **CRITICAL**: Quando encontrar uma referência a um arquivo de contexto ou regra (ex: `@opencode-context/conventions.md`), use a ferramenta de leitura para carregá-lo apenas se for RELEVANTE para a tarefa atual. 

**Instruções de Carregamento:**
- NÃO carregue todas as referências preventivamente.
- Trate o conteúdo carregado como obrigatório ("mandatory").
- Siga referências recursivamente se necessário.

---

## Contexto do Projeto

O contexto principal está em: `./opencode-context/` e é injetado globalmente via `opencode.json`.

| Arquivo | Descrição |
|---------|-----------|
| @project.md | Visão geral do projeto e objetivos |
| @database.md | Schema do banco de dados e relacionamentos |
| @stack.md | Stack tecnológica detalhada |
| @conventions.md | Padrões de código e estilo |
| @components.md | Biblioteca de componentes disponíveis |
| @api.md | Definição de endpoints e hooks |
| @queries.md | Queries SQL otimizadas |

---

## Exemplos de Uso

### Pedido Simples (UI)
```
> "mude a cor do botão para azul"

Maestro: "Delegando para @Artist: tarefa de UI/Visual"
Artist: [executa e retorna "✅ Feito"]
```

### Pedido Complexo (Backend)
```
> "adicione um novo hook para buscar inquilinos"

Maestro: [se necessário, faz 1–3 clarificações e então delega para @Engine]
Engine: [executa e retorna "✅ Feito"]
```

### Pedido Híbrido
```
> "crie uma tela de login completa"

Maestro: [delega para @Engine (backend) + @Artist (UI)]
```

### Pedido de Revisão
```
> "valide se o código está correto"

Maestro: "Delegando para @Guardian: tarefa de revisão"
Guardian: [revisa e retorna "✅ Aprovado" ou "⚠️ Issues..."]
```

---

## Outputs Padronizados

| Agent | Output |
|-------|--------|
| **Maestro** | "Delegando para @[Agent]: [motivo]" |
| **Artist** | "✅ Feito: [descrição]" ou "⚠️ Issues: [lista]" |
| **Engine** | "✅ Feito: [descrição]" ou "⚠️ Issues: [lista]" |
| **Guardian** | "✅ Aprovado" ou "⚠️ Issues: [lista]" |
| **Librarian** | "✅ Info: [resumo]" ou "❓ Não encontrei" |

---

## Regras

1. **Maestro não executa** - só delega
2. **Artists leem contexto** antes de executar
3. **Plan Mode** = só planeja, não executa
4. **All Mode** = executa a tarefa

---

## Quick Reference

| Você quer... | Use... |
|-------------|--------|
| Delegar tarefa | @maestro |
| UI/Design/Estilo | @artist |
| Backend/Lógica/DB | @engine |
| Revisão/Testes | @guardian |
| Informação | @librarian |
| Explorar código | @explore |

---

## Skills Disponíveis

Skills genéricas (~/.config/opencode/skills/):

| Skill | Descrição | Usado por |
|-------|-----------|----------|
| sql-database | Convenções SQL/Postgres | Engine |
| rest-api | Padrões REST API | Engine |
| react-component | Padrões React | Artist |
| task-planning | Fluxo de planejamento | (opcional) |
| delegation-pattern | Como delegar | Maestro |
| context-loading | Como carregar contexto | Todos |
| create-context | Gera opencode-context/ | Librarian |
| create-spec | Gera/atualiza SPEC.md | Librarian |

---
