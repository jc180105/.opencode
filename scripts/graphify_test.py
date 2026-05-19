"""
graphify_test.py -- Testa as APIs de explain e path do graphify localmente.
Descobre god nodes e caminhos entre conceitos no graph.json do projeto.
"""
from pathlib import Path
import json
import sys
import os

# Force UTF-8 output on Windows (prevents cp1252 errors)
if os.name == "nt":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def test_graphify_explain_and_path(graph_path: Path):
    from graphify.build import build_from_json
    from graphify.analyze import god_nodes, surprising_connections
    import networkx as nx

    print("\n=== GRAPHIFY EXPLAIN & PATH TEST ===")
    print(f"Graph: {graph_path}\n")

    data = json.loads(graph_path.read_text(encoding="utf-8"))
    node_count = len(data.get("nodes", []))
    edge_count = len(data.get("edges", []))
    print(f"Graph loaded: {node_count} nodes, {edge_count} edges")

    if node_count == 0:
        print("\n[NOTA] Grafo vazio -- rode /graphify no projeto primeiro para indexar.")
        print("       graphify explain e graphify path precisam de um grafo com dados reais.")
        print("\nComo indexar:")
        print("  1. Abra o OpenCode no diretorio do projeto")
        print("  2. Digite: /graphify .")
        print("  3. Aguarde a indexacao completar")
        print("  4. Execute este script novamente")
        return

    G = build_from_json(data)

    # --- GRAPHIFY EXPLAIN ---
    print("\n--- graphify explain (top god nodes) ---")
    gods = god_nodes(G)
    for i, g in enumerate(gods[:5], 1):
        node_id = g["id"]
        label = g.get("label", node_id)
        degree = g.get("degree", "?")
        neighbors = list(G.neighbors(node_id))[:3]
        print(f"{i}. {label} (degree={degree})")
        print(f"   Connected to: {', '.join(neighbors)}")
        print()

    # --- GRAPHIFY PATH ---
    print("\n--- graphify path (shortest path between concepts) ---")
    # Use god nodes as interesting path endpoints
    if len(gods) >= 2:
        pairs = [(gods[i]["id"], gods[-(i+1)]["id"]) for i in range(min(3, len(gods)//2))]
        for src, tgt in pairs:
            if src == tgt:
                continue
            try:
                path = nx.shortest_path(G, source=src, target=tgt)
                print(f"Path: {src} -> {tgt}")
                print(f"  Steps ({len(path)}): {' -> '.join(path)}")
            except nx.NetworkXNoPath:
                print(f"Path: {src} -> {tgt}: No path (nodes in different components)")
            except Exception as e:
                print(f"Path: {src} -> {tgt}: {type(e).__name__}: {e}")
            print()
    else:
        print("  Not enough god nodes to compute paths")

    # --- SURPRISING CONNECTIONS ---
    print("\n--- graphify surprising_connections ---")
    from graphify.cluster import cluster
    communities = cluster(G)
    surprises = surprising_connections(G, communities)
    for s in surprises[:3]:
        print(f"  Surprise: {s}")

    print(f"\n=== DONE ===")
    print(f"  - graphify explain: {len(gods)} god nodes found")
    print(f"  - graphify path:    tested {min(3, len(gods)//2)} pairs")
    print(f"  - graphify surprises: {len(surprises)} found")


if __name__ == "__main__":
    # Auto-detect graph
    candidates = [
        Path("D:/TesteGemma/zenith/graphify-out/graph.json"),
        Path("graphify-out/graph.json"),
        Path("../graphify-out/graph.json"),
    ]
    if len(sys.argv) > 1:
        candidates = [Path(sys.argv[1])] + candidates

    graph_path = None
    for c in candidates:
        if c.exists():
            graph_path = c
            break

    if not graph_path:
        print("[ERROR] Nenhum graph.json encontrado.")
        print("Caminhos tentados:")
        for c in candidates:
            print(f"  {c}: {'EXISTS' if c.exists() else 'not found'}")
        sys.exit(1)

    test_graphify_explain_and_path(graph_path)
