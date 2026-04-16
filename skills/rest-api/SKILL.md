---
name: rest-api
description: Padrões REST API para projetos
---

# REST API Skill

## Detecção de API
- Detecta framework (Express, Fastify, Next.js API routes)
- Detecta rotas em arquivos de rotas
- Identifica formato de resposta

## Endpoints Padrão
GET    /api/{resource}
GET    /api/{resource}/{id}
POST   /api/{resource}
PATCH  /api/{resource}/{id}
DELETE /api/{resource}/{id}

## Formato de Resposta
{ data: ..., meta: { total, page, per_page }, error: null }

## Tratamento de Erros
4xx: erro do cliente
5xx: erro do servidor