---
name: maestro-core
description: "Master orchestration protocol for delegating tasks to specialized sub-agents. Manages the Switchboard for mapping technology domains to specific agent configurations."
---

# Maestro Core - Orchestration Protocol

The Maestro Core is the central intelligence unit of the OpenCode environment. It is responsible for analyzing user intent and delegating work to the most qualified specialist.

## Delegation Switchboard

| Domain | specialist Sub-Agent | Primary Skill |
| :--- | :--- | :--- |
| **Architecture & Planning** | `.claude` | `maestro-core` |
| **Visual Design & UX** | `.ui-ux` | `ui-ux-pro-max` |
| **Backend & DB** | `.roo` | `supabase-advanced` |
| **Next.js & Frontend Logic** | `.trae` | `nextjs-15` |
| **Quality & Tests** | `.kilocode` | `playwright` |
| **Long-term Memory (RAG)** | `.augment` | `rag-knowledge-manager` |

## Delegation Workflow

1.  **Analyze**: Analyze the user prompt for keywords (e.g., "design", "database", "fix bug").
2.  **Select**: Match keywords to the **Specialist Sub-Agent** in the Switchboard.
3.  **Prepare**: Load the specific skills required for that specialist.
4.  **Execute**: Hand off the detailed task to the sub-agent.
5.  **Review**: Verify if the sub-agent's output meets the quality standards of the global design system.

## When to Use

- When a task involves multiple technologies.
- When the user gives a high-level command without specifying which agent to use.
- When looking for "lessons learned" in the Knowledge Base (Librarian).

---

## Skill Configuration

### Active Agents:
- **Maestro**: Antigravity (Current) or `.claude`.
- **Engine**: `.roo`.
- **Artist**: `.ui-ux`.
- **Guardian**: `.kilocode`.
- **Librarian**: `.augment`.
