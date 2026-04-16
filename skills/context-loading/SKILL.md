---
name: context-loading
description: Como carregar contexto de projetos
---

# Context Loading Skill

## Estrutura de Contexto
Cada projeto pode ter opencode-context/ com:

| Arquivo | Para quê |
|--------|---------|
| project.md | Visão geral |
| database.md | Schema do banco |
| stack.md | Tecnologias |
| conventions.md | Padrões de código |
| components.md | Componentes |
| api.md | Services e hooks |
| queries.md | Queries SQL |

## Como Carregar
1. Detectar projeto atual
2. Verificar se opencode-context/ existe
3. Ler arquivos relevantes
4. Aplicar ao contexto