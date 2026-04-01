import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok } from "../helpers.js";

export function register(server: McpServer) {
  server.tool(
    "billz_get_transfers",
    "Get list of inventory transfers",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      departure_shops: z.string().optional().describe("Comma-separated shop UUIDs"),
      arrival_shops: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      arrival_date_start: z.string().optional(),
      arrival_date_end: z.string().optional(),
      status_ids: z.string().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v2/transfer", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_create_transfer",
    "Create a new inventory transfer between shops",
    {
      departure_shop_id: z.string(),
      arrival_shop_id: z.string(),
      name: z.string(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/transfer", {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_add_product_to_transfer",
    "Add a product to a transfer",
    {
      transfer_id: z.string(),
      product_id: z.string(),
      departure_shop_id: z.string(),
      arrival_shop_id: z.string(),
      transfer_measurement_value: z.number(),
      is_scan: z.boolean().optional(),
    },
    async ({ transfer_id, ...body }) => {
      const data = await billzFetch("POST", `/v2/transfer/${transfer_id}/add`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_send_transfer",
    "Mark a transfer as sent",
    { transfer_id: z.string() },
    async ({ transfer_id }) => {
      const data = await billzFetch("POST", `/v2/transfer/${transfer_id}/send`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_cancel_transfer",
    "Cancel a transfer",
    { transfer_id: z.string() },
    async ({ transfer_id }) => {
      const data = await billzFetch("DELETE", `/v2/transfer/${transfer_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_accept_transfer",
    "Accept/finish a transfer at the destination shop",
    {
      transfer_id: z.string(),
      use_departure_price: z.boolean().optional(),
    },
    async ({ transfer_id, use_departure_price }) => {
      const data = await billzFetch("PUT", `/v2/transfer/finish/${transfer_id}`, {
        body: { use_departure_price: use_departure_price ?? false },
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_update_transfer",
    "Update transfer name or shop assignments",
    {
      transfer_id: z.string(),
      name: z.string().optional(),
      departure_shop_id: z.string().optional(),
      arrival_shop_id: z.string().optional(),
    },
    async ({ transfer_id, ...body }) => {
      const data = await billzFetch("PUT", `/v2/transfer/update/${transfer_id}`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_transfer_products",
    "Get products in a transfer",
    {
      transfer_id: z.string(),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async ({ transfer_id, ...params }) => {
      const data = await billzFetch("GET", `/v2/transfer/${transfer_id}/items`, { params });
      return ok(data);
    },
  );
}
