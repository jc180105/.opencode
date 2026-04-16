---
name: create-context
description: Gera estrutura opencode-context automaticamente para o projeto atual
---

# Create Context Skill

## Quando Usar
- "cria o contexto do projeto"
- "gera o opencode-context"

## IMPORTANTE: Detecção de Projeto
1. NÃO use path hardcoded como D:\managerkit
2. Use o diretório atual de trabalho (pwd)
3. Se o usuário não especificar, use ./opencode-context/

## O que Faz
1. Detecta o projeto atual via pwd (diretório de trabalho)
2. Identifica tipo de projeto (package.json, cargo.toml, go.mod, etc)
3. Escaneia estrutura de arquivos
4. Gera opencode-context/ NO DIRETÓRIO ATUAL (não em outro lugar)

## Importante
- O contexto DEVE ser criado no projeto onde o usuário está trabalhando
- Use caminho relativo "./opencode-context/" não caminhos absolutos