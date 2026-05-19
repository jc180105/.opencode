# OpenCode Multi-Agent System Architecture

**Generated**: 2026-05-07T00:00:00Z  
**Depth**: 3 levels  
**Nodes Analyzed**: 31 unique components  
**Communities**: 17 agent skill ecosystems

## System Overview

The OpenCode multi-agent system is a distributed orchestration framework that enables collaborative development through specialized agents, MCPs (Model Context Protocol), and persistent state management.

### Core Components

#### 1. Orchestration Layer
- **Maestro Agent**: Central coordinator (delegation only, no execution)
- **State Manager**: LangGraph-compatible checkpointing (SQLite backend)
- **Shared Memory**: Inter-agent communication for teams
- **Linear MCP**: Integrated issue/project tracking (8 agents)

#### 2. Specialist Agents (7 Executors)

| Agent | Role | Key Skills | MCPs |
|-------|------|-----------|------|
| **Frontend** | UI/UX Design | impeccable, frontend-design | graphify, context7, linear |
| **Backend** | API & Business Logic | backend-development, production-code-audit | graphify, context7, supabase, linear |
| **Security** | Code Audit & OWASP | security, production-code-audit | graphify, context7, github, linear |
| **Data Engineer** | Database & Supabase | database-design | graphify, context7, supabase, linear |
| **QA** | Testing & Accessibility | testing, find-docs | graphify, context7, linear |
| **DevOps** | CI/CD & Infrastructure | devops-engineer, find-docs | graphify, context7, github, linear |
| **Code Review** | Code Validation (read-only) | code-review, find-docs | graphify, context7, linear |

#### 3. Team Organizations (with Shared Memory)

```
┌─ feature-team ───────────────────┐
│ • Frontend Agent                  │
│ • Backend Agent                   │
│ • QA Agent                        │
│ maxConcurrency: 2                 │
│ Shared Memory: ✓ enabled          │
└───────────────────────────────────┘

┌─ infra-team ──────────────────────┐
│ • DevOps Agent                    │
│ • Security Agent                  │
│ maxConcurrency: 1                 │
│ Shared Memory: ✓ enabled          │
└───────────────────────────────────┘

┌─ data-team ───────────────────────┐
│ • Data Engineer Agent             │
│ • Backend Agent                   │
│ maxConcurrency: 2                 │
│ Shared Memory: ✓ enabled          │
└───────────────────────────────────┘
```

#### 4. MCPs (Model Context Protocol Integrations)

| MCP | Purpose | Usage |
|-----|---------|-------|
| **graphify** | Knowledge graph analysis, codebase mapping | Architecture queries, dependency analysis |
| **context7** | Real-time documentation for libraries | API reference, framework examples |
| **github** | Repository management, CI/CD, PRs | Version control, Actions, secrets |
| **linear** | Issue tracking, project management | Task delegation, milestone tracking |
| **supabase** | Database operations, schema migrations | Data layer management |

### System Rules (MANDATORY)

#### Rule #1: Graphify First
- **Always** query graphify before any action
- Graphify provides codebase map, functions, dependencies, architecture

#### Rule #2: MCP First
- Never invent APIs or schemas
- Use context7 for library documentation
- Use supabase for DB operations
- Use github for CI/CD workflows

#### Rule #3: Windows-First (Cross-Platform)
- Primary: Windows 11 PowerShell
- Command chaining: `;` (NOT `&&`)
- Python: `python` locally, `python3` in Docker
- Paths: Always use `pathlib.Path`

#### Rule #4: Skills are Mandatory
- Load skills before coding (impeccable for UI, backend for APIs, etc.)
- Skills provide templates and patterns

#### Rule #5: Shared Memory for Teams
- Read memory before starting: `SharedMemory("feature-team").read()`
- Write results: `memory.write("backend", "api_design", {...})`
- Teams can track each other's progress

#### Rule #6: State Persistence (LangGraph Pattern)
- Generate unique thread_id per conversation
- Save state: `AgentStateManager.save_state(thread_id, agent_name, state)`
- Resume: `AgentStateManager.get_state(thread_id, agent_name)`
- Checkpoint format: `{"configurable": {"thread_id": "..."}}`

#### Rule #7: Linear MCP for Project Management
- Linear is primary (GitHub Issues secondary)
- All agents must use Linear for tasks
- Workflow: graphify → linear_list_issues → execute → linear_save_issue

### Delegation Workflow

```
1. Human → Maestro (task request)
2. Maestro → graphify_query_graph (understand context)
3. Maestro → context7 (library docs)
4. Maestro → delegate to specialist agent(s)
5. Agent → graphify_query_graph (existing code)
6. Agent → context7 (library documentation)
7. Agent → execute using skills + MCPs
8. Code Review → validate (if needed)
9. Maestro → report to human
```

### Token Economy (RTK Integration)

**Current Status** (as of 2026-05-07):
- **Total Commands**: 147
- **Input Tokens**: 48.7K
- **Output Tokens**: 15.2K
- **Tokens Saved**: 32.8K (**67.4%**)
- **Average Execution**: 2.4s per command
- **Efficiency**: ████████████████░░░░░░░░ 67.4%

**Daily Breakdown**:
- 2026-03-19: 85.4% savings (1 cmd, 88 tokens)
- 2026-05-05: 0.0% savings (80 cmds, 2 tokens)
- 2026-05-06: 64.0% savings (30 cmds, 9.4K tokens)
- 2026-05-07: 86.9% savings (36 cmds, 23.3K tokens)

**Top Optimization** (eslint): 9.0K tokens saved, 97.8% efficiency

### Connectivity Matrix

```
┌─────────────────────────────────────────────────────────┐
│                 AGENT ↔ MCP MATRIX                      │
├─────────────────────────────────────────────────────────┤
│ Maestro      → graphify, context7, linear               │
│ Frontend     → graphify, context7, linear               │
│ Backend      → graphify, context7, supabase, linear     │
│ Security     → graphify, context7, github, linear       │
│ Data Eng     → graphify, context7, supabase, linear     │
│ QA           → graphify, context7, linear               │
│ DevOps       → graphify, context7, github, linear       │
│ Code Review  → graphify, context7, linear               │
└─────────────────────────────────────────────────────────┘
```

### State Persistence Architecture

```
┌─ AgentStateManager (SQLite Backend) ─────────────┐
│                                                   │
│  checkpoint_table:                               │
│  ├─ thread_id (conversation identifier)         │
│  ├─ agent_name (specialist agent)                │
│  ├─ state (JSON serialized agent state)          │
│  ├─ timestamp (checkpoint moment)                │
│  └─ order (sequence in conversation)             │
│                                                   │
│  Methods:                                         │
│  ├─ save_state(thread_id, agent, state)         │
│  ├─ get_state(thread_id, agent)                 │
│  ├─ get_state_snapshot(thread_id, agent)        │
│  ├─ list_threads()                              │
│  ├─ list_checkpoints(thread_id, agent)          │
│  └─ get_thread_history(thread_id)               │
│                                                   │
│  Location: scripts/state_manager.py              │
└────────────────────────────────────────────────────┘
```

### Shared Memory Schema (Per Team)

```json
{
  "team_name": "feature-team",
  "entries": [
    {
      "component": "backend",
      "key": "api_design",
      "value": { "endpoints": [...] },
      "timestamp": "2026-05-07T10:00:00Z",
      "agent": "backend-agent"
    }
  ]
}
```

### System Health Indicators

✅ **Active**:
- Maestro orchestration working
- Linear MCP integrated (5 active issues)
- Shared Memory operational (7 entries)
- State Manager active (checkpoints stored)
- All 5 MCPs functional
- graphify cached @ 1.0ms performance

⚠️ **Warnings**:
- RTK hook not installed (run `rtk init -g` for automatic savings)
- Claude Code projects directory not found (impacts `rtk discover`)

### Performance Baselines

| Operation | Latency | Status |
|-----------|---------|--------|
| graphify query | 1.0ms | ✓ cached |
| context7 lookup | ~200ms | ✓ normal |
| linear_list_issues | ~150ms | ✓ normal |
| supabase execute_sql | ~50ms | ✓ normal |
| github API call | ~300ms | ✓ normal |

## Conclusion

The OpenCode multi-agent system is **fully operational** at 75% capacity with:
- ✅ 7 specialist agents ready
- ✅ 5 MCPs integrated
- ✅ 3 team organizations active
- ✅ Shared memory & state persistence working
- ✅ 67.4% token efficiency achieved

**Recommendations**:
1. Install RTK hook: `rtk init -g` for automatic token savings
2. Set up Claude Code projects directory for `rtk discover`
3. Monitor Linear issues regularly (currently 5 active)
4. Scale feature-team parallel tasks if needed (maxConcurrency: 2)
