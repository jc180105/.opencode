---
name: create-spec
description: Gera e atualiza SPEC.md automaticamente
---

# Create Spec Skill

## Detecção de Projeto
1. Detecta diretório atual (pwd)
2. Identifica tipo de projeto (package.json, cargo.toml, go.mod, etc)
3. Escaneia estrutura de arquivos
4. Gera spec baseado no que encontrar

## Quando Usar
- "cria o spec do projeto"
- "gera SPEC.md"
- "atualiza o SPEC.md"
- Detectada mudança significativa no projeto

## O que Faz

### 1. Criar SPEC.md (primeira vez)
1. Detecta o projeto atual
2. Escaneia estrutura (package.json, tecnologia, padrões)
3. Gera SPEC.md com:
   - Nome do projeto
   - Tech stack
   - Convenções de código
   - Padrões de API
   - Estrutura de diretórios

### 2. Atualizar SPEC.md

#### Modo Manual
- Quando você pede: "atualiza o SPEC.md"
- Adiciona novas regras ou atualiza as existentes

#### Modo Automático
- Detecta mudança significativa:
  - Nova dependência no package.json
  - Nova pasta ou arquivo de config
  - Mudança em conventions
- Sugere atualização com diff do que mudou

## Formato do SPEC.md

```markdown
# SPEC.md - {nome-do-projeto}

## Projeto
{nome} - {descrição}

## Tech Stack
- Frontend: {framework}
- Backend: {framework}
- Database: {bd}
- Outras ferramentas

## Convenções
- Commits: conventionalcommits
- Código: {padrão}
- Nomeação: {padrão}

## Estrutura
/src
  /api      ← API routes
  /components  ← Componentes
  /lib     ← Utilitários
  ...

## regras Adicionais
- {regra 1}
- {regra 2}
```

## Como Atualizar
1. Detectar o que mudou desde a última versão
2. Mostrar diff para aprovação
3. Aplicar mudanças no SPEC.md