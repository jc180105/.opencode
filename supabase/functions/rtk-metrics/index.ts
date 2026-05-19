// Serve RTK token economy data from rtk-gains.json
// Endpoint: /api/rtk-metrics
// Returns: { economy_pct, tokens_saved, trend, history: [] }

import rtkGains from "./rtk-gains.json" with { type: "json" };

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

// Calculate trend from daily data (positive = improving, negative = declining)
function calculateTrend(dailyData: Array<{ savings_pct: number }>): number {
  if (dailyData.length < 2) return 0;
  const lastTwo = dailyData.slice(-2);
  return lastTwo[1].savings_pct - lastTwo[0].savings_pct;
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
    const { summary, daily } = rtkGains;
    
    const responseData = {
      economy_pct: summary.avg_savings_pct,
      tokens_saved: summary.total_saved,
      trend: parseFloat(calculateTrend(daily).toFixed(2)),
      history: daily.map((entry: any) => ({
        date: entry.date,
        savings_pct: entry.savings_pct,
        tokens_saved: entry.saved_tokens,
        commands: entry.commands
      }))
    };

    return withCors(new Response(JSON.stringify(responseData), { status: 200 }));
  } catch (error) {
    console.error("Error processing RTK metrics:", error);
    return withCors(new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 }));
  }
});
