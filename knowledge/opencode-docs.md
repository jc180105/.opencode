# OpenCode Documentation - Reference Guide

## 📚 Documentação Oficial
- Site: https://opencode.ai/docs/
- Suporte a 75+ modelos

## 🏗️ Estrutura de Arquivos

### Arquivos de Configuração
| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| opencode.json | ~/.config/opencode/ | Config principal |
| AGENTS.md | ~/.config/opencode/ | Documentação dos agentes |
| agent-registry.json | ~/.config/opencode/ | Registro de agentes |
| score-data.json | ~/.config/opencode/ | Métricas |
| auto-heiling-rules.json | ~/.config/opencode/ | Regras auto-correção |

### Agentes
| Caminho | Descrição |
|---------|-----------|
| ~/.config/opencode/.agents/ | Definições em markdown |
| ~/.config/opencode/agents/ | Agentes alternativos |

### Skills
| Caminho | Descrição |
|---------|-----------|
| ~/.config/opencode/skills/ | Skills do sistema |
| .opencode/skills/ | Skills por projeto |

## 🔧 Configuração de Agentes

### Via JSON (opencode.json)
```json
{
  "agent": {
    "nome": {
      "name": "Nome",
      "description": "Descrição",
      "prompt": "System prompt",
      "mode": "all" | "subagent",
      "permission": {
        "read": "allow",
        "edit": "ask",
        "bash": "deny"
      }
    }
  }
}
```

### Via Markdown
```markdown
---
name: nome
description: Descrição
mode: all
---
# Prompt do agente
```

## 📁 Estrutura de Diretórios

- `.agents/` - Definições de agentes
- `.opencode/agents/` - Agentes por projeto
- `skills/` - Skills do sistema
- `.opencode/skills/` - Skills por projeto
- `commands/` - Comandos customizados
- `modes/` - Modos de operação
- `plugins/` - Plugins
- `tools/` - Ferramentas customizadas

## 🎯 Tipos de Agentes

| Tipo | Descrição | Como ativar |
|------|-----------|-------------|
| Primary | Agente principal | TAB ou @ |
| Subagent | Agente secundário | .nome |

## ⚙️ Comandos Úteis

- `/agents` - Lista agentes disponíveis
- `/skills` - Lista skills
- `/models` - Lista modelos
- `opencode agent create` - Criar novo agente

## 🔐 Permissões

| Nível | O que permite |
|-------|---------------|
| allow | Sempre permite |
| deny | Sempre nega |
| ask | Pergunta |

## 📖 Mais Informações
- Docs: https://opencode.ai/docs/
- GitHub: https://github.com/anomalyco/opencode