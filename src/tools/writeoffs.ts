import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_create_writeoff",
    "Create a new write-off document",
    {
      shop_id: z.string(),
      reason_id: z.string().describe("Write-off reason UUID from billz_get_writeoff_reasons"),
      comment: z.string().optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/write-off", {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_add_product_to_writeoff",
    "Add a product to an existing write-off",
    {
      writeoff_id: z.string(),
      product_id: z.string(),
      measurement_value: z.number().describe("Quantity to write off"),
    },
    async ({ writeoff_id, ...body }) => {
      const data = await billzFetch("POST", `/v2/write-off/${writeoff_id}/add`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_cancel_writeoff",
    "Cancel a write-off document",
    { writeoff_id: z.string() },
    async ({ writeoff_id }) => {
      const data = await billzFetch("PUT", `/v2/write-off/cancel/${writeoff_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_complete_writeoff",
    "Complete/finalize a write-off document",
    { writeoff_id: z.string() },
    async ({ writeoff_id }) => {
      const data = await billzFetch("PUT", `/v2/write-off/finish/${writeoff_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_writeoff_reasons",
    "Get list of write-off reasons",
    {},
    async () => {
      const data = await billzFetch("GET", "/v2/write-off-reason");
      return ok(data);
    },
  );
}
