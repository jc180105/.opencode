# OpenCode Knowledge Base (RAG)

Esta é a base de conhecimento central que alimenta a memória de longo prazo (RAG) de todos os seus agentes.

## Seções

- `/lessons-learned/`: Documentação de bugs resolvidos e arquiteturas aprovadas.
- `/project-blueprints/`: Visão geral da arquitetura de cada projeto (ex: ManagerKit).
- `/design-decisions/`: Registro de decisões estéticas e escolhas de cores.

## Primeiras Instruções

Cada vez que um agente resolver um problema complexo, ele deve criar um **Knowledge Item (KI)** nesta pasta.

### KI Atual: ManagerKit Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Auth/Backend**: Supabase (PostgreSQL + RLS)
- **Deployment**: Railway
- **Decisão**: Usar Arquitetura Hexagonal para o core de negócios.
