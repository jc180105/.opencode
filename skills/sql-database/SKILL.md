---
name: sql-database
description: Convenções e padrões para bancos SQL/Postgres
---

# SQL Database Skill

## Detecção de Banco
- Detecta tipo de banco (PostgreSQL, MySQL, SQLite) pelo arquivo de config
- Lê schema do arquivo de configuração do banco
- Identifica provider (Supabase, Prisma, Drizzle, etc)

## Padrões de Tabela
- snake_case para nomes de tabelas e colunas
- UUID para chaves primárias
- created_at / updated_at (TIMESTAMPTZ)
- deleted_at para soft delete

## Índices
- idx_{tabela}_{coluna} para chaves estrangeiras
- UNIQUE para campos que precisam de duplicação

## Convenções
- RLS (Row Level Security) habilitado
- created_by / updated_by para tracking