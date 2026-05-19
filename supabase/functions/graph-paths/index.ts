// Serve graphify path data
// Endpoint: /api/graph-paths
// Returns: { nodes: [], edges: [], communities: [] }

import graphPaths from "./graphify-paths.json" with { type: "json" };

// Helper to add CORS headers
function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET, OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Extract unique nodes from all delegation paths
function extractNodes() {
  const nodesSet = new Set<string>();
  
  // Add nodes from delegation paths
  graphPaths.delegation_paths.forEach((path: any) => {
    path.path.forEach((step: any) => {
      nodesSet.add(step.component);
    });
  });

  // Add participants from team workflows
  [
    ...graphPaths.feature_team_workflow.participants,
    ...graphPaths.infra_team_workflow.participants
  ].forEach((participant: string) => {
    nodesSet.add(participant);
  });

  return Array.from(nodesSet).map((name, id) => ({
    id,
    name,
    type: name.includes("Agent") ? "agent" : name.includes("MCP") ? "mcp" : "other"
  }));
}

// Extract edges from delegation paths
function extractEdges(nodes: Array<{ id: number, name: string }>) {
  const edges: Array<{ source: number, target: number, label: string }> = [];
  const nodeMap = new Map(nodes.map(n => [n.name, n.id]));

  graphPaths.delegation_paths.forEach((path: any) => {
    for (let i = 0; i < path.path.length - 1; i++) {
      const sourceName = path.path[i].component;
      const targetName = path.path[i + 1].component;
      const sourceId = nodeMap.get(sourceName);
      const targetId = nodeMap.get(targetName);
      
      if (sourceId !== undefined && targetId !== undefined) {
        edges.push({
          source: sourceId,
          target: targetId,
          label: path.path[i + 1].action
        });
      }
    }
  });

  return edges;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return withCors(new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 }));
  }

  try {
    const nodes = extractNodes();
    const edges = extractEdges(nodes);
    
    // Communities (simplified from graph stats)
    const communities = graphPaths.analysis.graph_stats.god_nodes_top_5.map(
      (node: string, index: number) => ({
        id: index,
        nodes: [node.split(" ")[0]] // Extract node name from "NodeName (edges)"
      })
    );

    const responseData = { nodes, edges, communities };
    return withCors(new Response(JSON.stringify(responseData), { status: 200 }));
  } catch (error) {
    console.error("Error processing graph paths:", error);
    return withCors(new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 }));
  }
});
