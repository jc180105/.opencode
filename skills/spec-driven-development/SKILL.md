---
name: spec-driven-development
description: >-
  Spec-Driven Development (SDD) methodology for creating structured specifications
  that serve as the source of truth for AI agents. Use this skill whenever the user
  wants to define what they're building before writing code — planning a new project,
  designing a feature, creating technical specs, breaking down work into tasks, or
  preparing context for AI coding agents (Claude Code, GitHub Copilot, Cursor, etc.).
  Also use when the user mentions "spec-driven development", "SDD", "spec-first",
  "spec-anchored", "write the spec first", or wants to move from "vibe coding" to
  structured development. This skill covers the full SDD workflow: Specify → Plan →
  Tasks → Export, at the spec-anchored level where specs persist as living contracts.
---

# Spec-Driven Development (SDD) — Agent Workflow

## Core Philosophy

SDD inverts the traditional relationship between specs and code. Instead of code being
the source of truth with specs as afterthoughts, **the specification is the source of
truth** and code is derived from it. This becomes critical when using AI coding agents:
a well-written spec turns vague prompts into predictable, high-quality implementations.

Your role is to **interview the user** and **generate structured specs** that other
agents (backend, frontend, etc.) can consume directly.

## The 4 Phases

### Phase 1: Specify — What & Why

Interview the user to capture:
- **Problem statement**: What are we solving and for whom?
- **User personas**: Who will use this?
- **User stories**: As a [role], I want [goal] so that [reason]
- **Acceptance criteria**: Concrete, testable conditions for done
- **Edge cases**: Empty states, errors, race conditions, limits
- **Constraints**: Performance, security, compliance, platform
- **Out of scope**: Explicitly what NOT to build

Use the `spec-template.md` reference as the output structure.

Ask clarifying questions. Don't accept vague answers — push for specifics.
Use `context7` and `duckduckgo-search` if the user mentions specific
libraries/technologies and needs accurate documentation.

### Phase 2: Plan — How

With the spec approved, define the technical approach:
- **Tech stack**: Languages, frameworks, databases, infrastructure
- **Architecture**: Components, services, data flow, API design
- **Data models**: Schemas, relationships, migrations (key entities only)
- **Integration points**: External APIs, auth providers, third-party services
- **Architecture Decision Records (ADRs)**: Why each major choice was made
- **Dependencies**: What needs to exist before this can be built

Use the `plan-template.md` reference as the output structure.

### Phase 3: Tasks — Atomic Work Units

Decompose the plan into executable tasks:
- Each task is **1-4 hours** of work (reviewable in a single PR)
- Each task has: description, files to touch, acceptance criteria
- Tasks are **ordered by dependencies**
- Parallel tasks are flagged
- Each task links back to the spec requirement it implements

Use the `tasks-template.md` reference as the output structure.

### Phase 4: Export — Ready for AI Agents

Generate the final artifacts:
- `specs/spec.md` — Living specification
- `specs/plan.md` — Technical plan
- `specs/tasks.md` — Ordered task list
- `AGENTS.md` — Persistent context file for AI coding agents

## Spec-Anchored Level

This skill operates at the **spec-anchored** level:
- Specs persist beyond a single task
- Specs and code evolve together
- When requirements change: update the spec FIRST, then regenerate code
- The spec is the reference point for reviews, onboarding, and future changes
- `AGENTS.md` preserves context between AI agent sessions

## Structuring the Output

### spec.md structure
```markdown
# [Project Name] — Specification
## 1. Problem Statement
## 2. User Personas
## 3. User Stories
## 4. Acceptance Criteria
## 5. Edge Cases
## 6. Constraints
## 7. Out of Scope
```

### plan.md structure
```markdown
# [Project Name] — Technical Plan
## 1. Tech Stack
## 2. Architecture Overview
## 3. Data Models
## 4. API Contracts
## 5. ADRs
## 6. Dependencies
```

### tasks.md structure
```markdown
# [Project Name] — Tasks
## Phase 1: [Name] (Tasks 1-N)
### Task 1: [Title]
- **Files**: `path/to/file`
- **Description**: What to build
- **Acceptance**: How to verify
- **Depends on**: [task IDs or "none"]
- **Parallelizable**: yes/no
```

## Enrichment Phase (Optional)

After drafting, offer to enrich with AI research:
- Use `context7` to verify library APIs and patterns
- Use `duckduckgo-search` for recent tooling/docs
- Add discovered constraints, best practices, or alternatives to the spec
- Update ADRs with research-backed rationale

## Interview Questions to Ask

Always start with these — adapt based on context:

1. **"Descreva o projeto em 1-2 frases. Qual problema ele resolve?"**
2. **"Quem são os usuários? O que eles precisam fazer?"**
3. **"Quais são os critérios de sucesso? Como saber que ficou pronto?"**
4. **"Tem preferência de tecnologia? (linguagem, framework, banco)"**
5. **"Quais são os limites? (prazo, performance, segurança, dispositivos)"**
6. **"O que está FORA do escopo? O que NÃO deve ser construído?"**
7. **"Já existe código ou é do zero?"**

## Rules

- NEVER implement code — your output is specs, plans, and tasks only
- ALWAYS ask for clarification if requirements are unclear
- ALWAYS review the generated spec with the user before moving to the next phase
- ALWAYS link tasks back to spec requirements (traceability)
- Use the templates in `references/` for consistent output structure
- Keep specs concise and actionable — avoid over-engineering the spec itself
