import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_get_stocktakings",
    "Get list of stocktaking (inventory count) sessions",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      shop_ids: z.string().optional().describe("Comma-separated shop UUIDs"),
      status: z.string().optional().describe("e.g. in_progress, completed"),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v2/stocktaking", { params });
      return ok(data);
    },
  );
}
