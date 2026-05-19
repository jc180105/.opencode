"""
graphify_serve_wrapper.py — MCP wrapper multi-projeto para o Graphify.

Detecta automaticamente o graph.json do projeto atual:
1. Verifica GRAPHIFY_GRAPH_PATH (override manual por sessão)
2. Sobe do CWD procurando graphify-out/graph.json (auto-detect do projeto)
3. Se não achar, cria um grafo vazio no CWD para o MCP não crashar

Uso no opencode.json:
  "command": ["python", "scripts/graphify_serve_wrapper.py"]

Troca de projeto: basta mudar de diretório — o wrapper auto-detecta.
Override manual: set GRAPHIFY_GRAPH_PATH=D:\\MeuProjeto\\graphify-out\\graph.json
"""
import sys
import os
import json
from pathlib import Path
import subprocess


# ── Indicadores de raiz de projeto (qualquer um destes = raiz) ──────────────
PROJECT_ROOT_MARKERS = [
    "package.json",
    "pyproject.toml",
    "setup.py",
    "Cargo.toml",
    "go.mod",
    ".git",
    "opencode.json",
    "prisma",
]

GRAPH_RELATIVE = Path("graphify-out") / "graph.json"


def find_graph_in_parents(start: Path, max_levels: int = 8) -> Path | None:
    """Sobe a árvore de diretórios procurando graphify-out/graph.json."""
    current = start.resolve()
    for _ in range(max_levels):
        candidate = current / GRAPH_RELATIVE
        if candidate.exists():
            return candidate
        # Para na raiz do sistema de arquivos
        if current.parent == current:
            break
        current = current.parent
    return None


def find_project_root(start: Path, max_levels: int = 8) -> Path:
    """Encontra a raiz do projeto subindo a árvore pelos markers conhecidos."""
    current = start.resolve()
    best = current  # fallback: diretório atual
    for _ in range(max_levels):
        for marker in PROJECT_ROOT_MARKERS:
            if (current / marker).exists():
                best = current
                break
        if current.parent == current:
            break
        current = current.parent
    return best


def create_empty_graph(path: Path) -> None:
    """Cria um grafo vazio para o MCP iniciar sem crashar."""
    path.parent.mkdir(parents=True, exist_ok=True)
    empty = {
        "nodes": [],
        "edges": [],
        "hyperedges": [],
        "_note": "Grafo vazio — rode /graphify no projeto para indexar o codebase."
    }
    path.write_text(json.dumps(empty, indent=2), encoding="utf-8")


def resolve_graph_path() -> Path:
    """Resolve o caminho do graph.json usando a estratégia multi-projeto."""
    cwd = Path.cwd()

    # 1. Override manual via env var
    env_override = os.environ.get("GRAPHIFY_GRAPH_PATH", "").strip()
    if env_override:
        p = Path(env_override)
        if p.exists():
            print(f"[graphify] Using GRAPHIFY_GRAPH_PATH: {p}", file=sys.stderr)
            return p
        else:
            print(f"[graphify] GRAPHIFY_GRAPH_PATH set but not found: {p}", file=sys.stderr)
            print(f"[graphify] Falling back to auto-detection...", file=sys.stderr)

    # 2. Argumento posicional (passado pelo opencode.json)
    if len(sys.argv) > 1:
        p = Path(sys.argv[1]).resolve()
        if p.exists():
            print(f"[graphify] Using argument path: {p}", file=sys.stderr)
            return p

    # 3. Auto-detect: sobe a árvore a partir do CWD
    found = find_graph_in_parents(cwd)
    if found:
        print(f"[graphify] Auto-detected graph: {found}", file=sys.stderr)
        return found

    # 4. Fallback: cria grafo vazio na raiz do projeto atual
    root = find_project_root(cwd)
    fallback = root / GRAPH_RELATIVE
    print(f"[graphify] No graph found — creating empty graph at: {fallback}", file=sys.stderr)
    print(f"[graphify] Run /graphify in your project to index the codebase.", file=sys.stderr)
    create_empty_graph(fallback)
    return fallback


def main():
    graph_path = resolve_graph_path()
    print(f"[graphify] Starting MCP server → {graph_path}", file=sys.stderr)

    result = subprocess.run(
        [sys.executable, "-m", "graphify.serve", str(graph_path)],
        stdin=sys.stdin,
        stdout=sys.stdout,
        stderr=sys.stderr,
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
