import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_import_products",
    "Import products (create or update) in bulk. Async — response comes via webhook.",
    {
      shop_id: z.string(),
      products: z.array(z.object({
        id: z.string().optional().describe("Leave empty for new product"),
        name: z.string(),
        barcode: z.string(),
        sku: z.string(),
        description: z.string().optional(),
        measurement_value: z.number(),
        retail_price: z.number(),
        supply_price: z.number(),
        wholesale_price: z.number().optional(),
        measurement_unit_id: z.string(),
        category_ids: z.array(z.string()).optional(),
        brand_id: z.string().optional(),
        supplier_id: z.string().optional(),
        product_custom_fields: z.array(z.object({
          product_characteristic_id: z.string(),
          value: z.string(),
        })).optional(),
      })),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/product-import/create-with-products", { body });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_imports",
    "Get list of product imports",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      shops: z.string().optional().describe("Comma-separated shop UUIDs"),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v2/import", { params });
      return ok(data);
    },
  );
}
