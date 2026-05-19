// Graphify OpenCode plugin — the brain of the agent system.
// Ensures agents are aware of the knowledge graph, its freshness, and use it.
// Cross-platform: works on Windows (PowerShell) and Linux/macOS.
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";

export const GraphifyPlugin = async ({ directory }) => {
  const graphPath = join(directory, "graphify-out", "graph.json");
  const reportPath = join(directory, "graphify-out", "GRAPH_REPORT.md");
  let hasGraph = existsSync(graphPath);

  // Get graph freshness info
  let graphAge = "";
  let graphIsStale = false;
  if (hasGraph) {
    try {
      const stats = statSync(graphPath);
      const ageMs = Date.now() - stats.mtimeMs;
      const ageHours = Math.floor(ageMs / 1000 / 60 / 60);
      const ageMins = Math.floor(ageMs / 1000 / 60);
      if (ageHours >= 24) {
        graphAge = `${ageHours}h old — consider re-running graphify`;
        graphIsStale = true;
      } else if (ageHours >= 1) {
        graphAge = `${ageHours}h old`;
      } else {
        graphAge = `${ageMins}min old`;
      }
    } catch {}
  }

  // Cache god nodes summary from report (extract once, reuse)
  let godNodesSummary = "";
  if (hasGraph && existsSync(reportPath)) {
    try {
      const report = readFileSync(reportPath, "utf-8");
      const lines = report.split("\n").slice(0, 40);
      godNodesSummary = lines.join("\n").substring(0, 1500);
    } catch {}
  }

  // Build a reusable context hint string (no bash/echo required)
  const buildHint = (count) => {
    if (!hasGraph) return "";
    const freshnessWarning = graphIsStale
      ? `\n⚠️  GRAPH IS STALE (${graphAge}) — run graphify again for accuracy`
      : `\n✅ Graph freshness: ${graphAge}`;

    if (count === 0 && godNodesSummary) {
      return `[graphify] Knowledge graph ACTIVE.${freshnessWarning}\nCall graphify_query_graph before architectural changes. If graph is empty (new project), proceed with the task — graphify becomes useful after code exists.\n\n${godNodesSummary}`;
    }
    return `[graphify] Graph available (${graphAge}). Call graphify_query_graph for codebase queries.`;
  };

  let injectedCount = 0;

  return {
    // Inject context + freshness on system prompt (OS-independent)
    // Only injects when graph exists — new projects get no injection (no confusion)
    "system.prompt": async (prompt) => {
      if (!hasGraph) {
        hasGraph = existsSync(graphPath);
        if (!hasGraph) return prompt; // New project: no graph yet, don't inject
      }

      if (injectedCount < 3) {
        const hint = buildHint(injectedCount);
        injectedCount++;
        return hint ? `${prompt}\n\n---\n${hint}\n---` : prompt;
      }
      return prompt;
    },

    // Also inject on first bash/shell call for belt-and-suspenders coverage
    "tool.execute.before": async (input, output) => {
      if (!hasGraph) {
        hasGraph = existsSync(graphPath);
        if (!hasGraph) return;
      }

      const tool = String(input?.tool ?? "").toLowerCase();

      if ((tool === "bash" || tool === "shell") && injectedCount < 3) {
        const args = output?.args;
        if (args && typeof args === "object") {
          const command = args.command;
          if (typeof command === "string" && command) {
            // Comments (#) work in both PowerShell and bash
            const staleMark = graphIsStale ? " [STALE — re-run graphify]" : ` [${graphAge}]`;
            const hint = godNodesSummary
              ? `# [graphify] Graph active${staleMark} — see graphify-out/GRAPH_REPORT.md\n`
              : `# [graphify] Graph available at graphify-out/graph.json${staleMark}\n`;
            args.command = hint + command;
            injectedCount++;
          }
        }
      }
    },
  };
};
