---
name: graphify
description: Query the knowledge graph of the current codebase. Use graphify_query_graph MCP tool to understand architecture, functions, and dependencies before making changes.
trigger: /graphify
---

# Graphify — Referência Rápida para Agentes

> **Para agentes:** Use o MCP tool `graphify_query_graph` diretamente. Você NÃO precisa ler este arquivo para fazer queries — ele existe como referência de sintaxe.

## Como consultar o grafo (uso cotidiano)

```
graphify_query_graph(query="<sua pergunta sobre o codebase>")
graphify_query_graph(query="<pergunta>" --budget 1500)   # limitar tokens de resposta
```

**Exemplos práticos:**
```
graphify_query_graph(query="onde está a lógica de autenticação?")
graphify_query_graph(query="quais funções chamam processPayment?")
graphify_query_graph(query="qual é a arquitetura geral do projeto?")
graphify_query_graph(query="quais arquivos lidam com o banco de dados?")
```

## Comandos CLI disponíveis

```
/graphify                          # pipeline completo no diretório atual
/graphify <path>                   # pipeline em path específico
/graphify <path> --update          # incremental — só arquivos novos/alterados
/graphify query "<pergunta>"       # BFS query
/graphify query "<pergunta>" --dfs # DFS — traça um caminho específico
/graphify explain "<Conceito>"     # explicação em linguagem simples de um nó
/graphify path "ModA" "ModB"       # caminho mais curto entre dois conceitos
```

## Quando usar o pipeline completo (`/graphify`)

Só rode o pipeline se o grafo não existir ainda ou o codebase mudou muito.
Para indexação inicial ou re-indexação, leia `SKILL_FULL.md` nesta mesma pasta — ele tem o pipeline completo passo a passo.

## Saídas do pipeline

```
graphify-out/
  graph.html        → grafo interativo (abrir no browser)
  GRAPH_REPORT.md   → relatório de auditoria
  graph.json        → dados brutos do grafo
```

## Regra de uso para agentes

1. **Sempre** chame `graphify_query_graph` antes de fazer mudanças arquiteturais
2. **Não** leia o SKILL_FULL.md a menos que precise rodar o pipeline completo
3. **Use `--budget`** para limitar a resposta quando só precisa de contexto rápido
