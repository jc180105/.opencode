# OpenCode Specialist Architecture (Elite Edition) 🚀

This is a high-performance, multi-agent developer configuration for the **OpenCode** CLI. It transforms a standard AI agent into a coordinated team of specialists (Artist, Engine, Guardian, Librarian) led by a **Maestro** and a **Prompt Refiner**.

## 🛠️ Architecture

Inspired by **Qoder**, this setup implements a strict "Refinement-First" protocol:

1.  **@Maestro (Leader)**: Receives your request and delegates to the Refiner.
2.  **@Refiner (Architect)**: Transforms vague ideas into professional technical specifications.
3.  **Specialists**:
    -   **@Artist**: UI/UX Master (React 18, Tailwind v4, Framer Motion).
    -   **@Engine**: Backend Expert (Supabase, PostgreSQL, RLS).
    -   **@Guardian**: Quality Assurance (Security, Types, Testing).
    -   **@Librarian**: Project Context & Memory.

## 📥 Installation

Follow these steps to use this architecture in your own project:

### 1. Requirements
Ensure you have the latest **OpenCode** CLI installed.

### 2. Setup Configuration
Copy the contents of this repository into your global OpenCode configuration directory:
- **Windows**: `C:\Users\<User>\.config\opencode\`
- **Mac/Linux**: `~/.config/opencode/`

### 3. Synchronize Skills
Run the following commands to ensure all elite skills are available:
```bash
# General Skills
npx skills add yuniorglez/gemini-elite-core@subagent-orchestrator -y
npx skills add ederheisler/agent-skills@tailwind-v4-shadcn -y
npx skills add schoepplake/framer-motion-skill@framer-motion -y
npx skills add supabase/agent-skills@supabase-postgres-best-practices -y
npx skills add currents-dev/playwright-best-practices-skill@playwright-best-practices -y

# Refinement Skills
npx skills add borghei/claude-skills@senior-prompt-engineer -y
npx skills add nilecui/skillsbase@prompt-engineering-patterns -y
```

## 🚀 Usage

Simply run `opencode` in your project directory. 

**Pro Tip**: You can call the Refiner directly to see the technical blueprint of an idea before coding:
> `@Refiner quero criar um sistema de assinaturas com Stripe`

---
*Created by Pedro & Antigravity (Advanced Agentic Architecture 2026)*
