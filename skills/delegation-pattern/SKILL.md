---
name: delegation-pattern
description: Como orquestrar tarefas entre especialistas
---

# Delegation Pattern Skill

## Matriz de Delegação
| Quando | Delegar para |
|--------|-----------|
| UI/Visual | @Artist |
| Backend/DB | @Engine |
| Teste/Security | @Guardian |
| Conhecimento | @Librarian |

## Handoff
- Passar contexto técnico relevante (Stack e Regras)
- Explicar o que precisa (Tarefa precisa)
- Definir critérios de aceite claro
- Agent especialista executa e retorna resultado

## Output
"Delegando para @[agente]: [motivo]"