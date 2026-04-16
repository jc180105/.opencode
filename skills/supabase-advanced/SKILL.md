---
name: supabase-advanced
description: "Advanced database patterns for Supabase, including Row Level Security (RLS), Postgres Functions, Edge Functions, and Realtime subscriptions."
---

# Supabase Advanced - Database & Auth Architecture

Expert guide for building secure and scalable backends with Supabase.

## Core Principles

- **Security First**: Always use RLS (Row Level Security) with dedicated policies.
- **Serverless Logic**: Use Edge Functions for compute-intensive or private tasks.
- **Database Functions**: Move complex data logic to PL/pgSQL functions for performance.
- **Realtime**: Optimize for low-latency updates with Realtime extensions.

## Architecture Patterns

- **Schema Design**: Follow 3NF or 4NF where possible, use appropriate indexing (`B-tree`, `GIN`).
- **Auth**: Integrate with Next.js using `ssr` package for server-side auth validation.
- **Storage**: Manage large assets with Supabase Storage and private buckets.

## Best Practices

1.  **RLS Policies**: Never use `true` for a policy unless it's a public table.
2.  **Secret Management**: Never expose the `SERVICE_ROLE_KEY` on the client.
3.  **Migrations**: Use Supabase CLI to manage schema migrations (`supabase migration new`).
4.  **Local Dev**: Use the Supabase local emulator for faster testing.
