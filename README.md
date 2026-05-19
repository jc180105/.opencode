# 🤖 OpenCode — Sistema Multi-Agente Autônomo

Um ambiente avançado e autônomo baseado em múltiplos agentes inteligentes para desenvolvimento de software de ponta a ponta. 

O OpenCode utiliza uma arquitetura orquestrada (Maestro) que delega tarefas para agentes especialistas (Frontend, Backend, Security, DevOps, etc.), usando as tecnologias mais modernas de contexto (Model Context Protocol - MCP) para integração contínua e compreensão profunda do código.

---

## 🚀 Como Usar

Para iniciar o OpenCode em qualquer projeto:

```powershell
cd caminho\para\seu-projeto
opencode
```

Em seguida, basta pedir ao **Maestro** o que você deseja construir:
> *"Maestro, crie um novo endpoint para autenticação de usuários, atualize o schema no banco de dados e garanta que o frontend tenha uma tela de login moderna."*

---

## 🏗️ Arquitetura de Agentes

O sistema opera com 1 Orquestrador e 8 Especialistas:

| Agente | Função | Habilidades Principais |
|:---|:---|:---|
| 👑 **Maestro** | Orquestrador. Pensa, entende o contexto e delega tarefas. NUNCA programa. | `graphify`, `context7`, orquestração |
| 📝 **SDD** | Transforma ideias em especificações (specs), planos e tarefas. | `spec-driven-development` |
| 🎨 **Frontend** | Cria interfaces bonitas e funcionais (UI/UX). | `impeccable`, `theme-factory`, `awesome-design` |
| ⚙️ **Backend** | Desenvolve APIs, lógica de negócios e integrações. | `backend-development`, `python-cross-platform` |
| 🛡️ **Security** | Auditoria cibernética contínua, validações OWASP. | `security`, `production-code-audit` |
| 💾 **Data Engineer**| Cuida de bancos de dados, integrações com Supabase e schemas. | `database-design` |
| 🧪 **QA** | Testes automatizados (E2E com Playwright, pytest, etc). | `webapp-testing` |
| ☁️ **DevOps** | CI/CD, Docker, Infraestrutura como Código. | `devops-engineer` |
| 👁️ **Code Review** | Avalia o código gerado, nunca edita, apenas reporta e cobra padrões. | `code-review` |

---

## 🔌 Integrações MCP (Model Context Protocol)

O OpenCode é altamente conectado ao seu ambiente e ao mundo exterior usando MCPs nativos:

- 🧠 **Graphify (Local)**: O cérebro do sistema. Gera um grafo de conhecimento do seu código para que os agentes entendam como tudo se conecta.
- 📚 **Context7 (Remote)**: Busca as documentações mais atualizadas (APIs, Frameworks) antes de escrever qualquer código.
- 🐙 **GitHub (Local)**: Gerencia repositórios, Pull Requests e Actions.
- 🗄️ **Supabase (Remote)**: Controle total de operações de banco de dados, schemas e autenticação.
- 💾 **Memory (Local)**: Memória compartilhada. Os agentes "lembram" das decisões uns dos outros através de estados persistentes.
- 🌐 **Playwright & Search**: Testes visuais, inspeção web e buscas via internet no DuckDuckGo.
- 🎨 **Figma (Local)**: Extrai tokens de design, layouts e componentes diretamente das URLs do Figma.

---

## 📁 Estrutura do Diretório `.opencode`

```text
.config/opencode/
├── opencode.json       # Configuração principal (agentes, permissões, MCPs)
├── AGENTS.md           # Regras globais de convivência e cross-platform
├── .env                # Credenciais seguras (ex: GITHUB_PAT, FIGMA_TOKEN)
├── plugins/            # Scripts como rtk.ts (token saver) e hooks
├── scripts/            # Scripts em Python e automações gerais
└── skills/             # Diretório de Skills (Markdown instrucional por contexto)
```

---

## 🛠️ Troubleshooting

Caso encontre problemas durante o uso:

- **Agente escrevendo código errado?** O Maestro corrige os agentes através do Code Review. Mas verifique a skill `clean-code` se a complexidade for alta.
- **Graphify não mapeou?** Verifique se o comando `python -m graphify.serve` está operando. Ele mapeia sozinho o grafo da aplicação.
- **Ambiente OS:** OpenCode tem mentalidade Cross-Platform, mas é testado nativamente em **Windows 11 (PowerShell)**. O `AGENTS.md` garante que comandos multiplataforma (`pathlib`, `python -m`) sejam sempre priorizados.

---
*Ambiente OpenCode - Pronto para Produção* 🚀
