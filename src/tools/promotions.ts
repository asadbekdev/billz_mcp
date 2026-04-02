import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch, getPlatformId } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_get_promos",
    "Get list of promotions",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      search: z.string().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v1/promo", {
        headers: { "platform-id": getPlatformId() },
        params,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_promo",
    "Get details of a specific promotion",
    { id: z.string() },
    async ({ id }) => {
      const data = await billzFetch("GET", `/v1/promo/${id}`, {
        headers: { "platform-id": getPlatformId() },
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_promo_products",
    "Get products in a promotion",
    {
      id: z.string().describe("Promo UUID"),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      type: z.string().optional().describe("Use 'added' for added products"),
      in_sale: z.boolean().optional(),
    },
    async ({ id, ...params }) => {
      const data = await billzFetch("GET", `/v1/promo/${id}/products`, {
        headers: { "platform-id": getPlatformId() },
        params,
      });
      return ok(data);
    },
  );
}
