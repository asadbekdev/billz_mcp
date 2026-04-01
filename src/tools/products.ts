import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok } from "../helpers.js";

export function register(server: McpServer) {
  server.tool(
    "billz_get_products",
    "Get list of products. Use last_updated_date to sync only changed products.",
    {
      limit: z.number().int().max(100).optional().describe("Max items per page (default 100)"),
      page: z.number().int().optional().describe("Page number"),
      last_updated_date: z.string().optional().describe("Sync from date, format: 2022-05-14 00:00:00 (UTC)"),
      search: z.string().optional().describe("Search string"),
    },
    async ({ limit, page, last_updated_date, search }) => {
      const data = await billzFetch("GET", "/v2/products", { params: { limit, page, last_updated_date, search } });
      return ok(data);
    },
  );

  server.tool(
    "billz_filter_products",
    "Filter products with advanced criteria",
    {
      shop_ids: z.array(z.string()).optional(),
      category_ids: z.array(z.string()).optional(),
      skus: z.array(z.string()).optional(),
      brand_ids: z.array(z.string()).optional(),
      supplier_ids: z.array(z.string()).optional(),
      supply_price_from: z.number().optional(),
      supply_price_to: z.number().optional(),
      retail_price_from: z.number().optional(),
      retail_price_to: z.number().optional(),
      group_variations: z.boolean().optional(),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/products/filter", { body });
      return ok(data);
    },
  );

  server.tool(
    "billz_patch_product_custom_field",
    "Add or edit a custom field value on a product",
    {
      product_id: z.string().describe("Product UUID"),
      custom_fields: z.array(
        z.object({ custom_field_id: z.string(), custom_field_value: z.string() }),
      ),
    },
    async ({ product_id, custom_fields }) => {
      const data = await billzFetch("PATCH", `/v2/product/${product_id}/patch-groups`, { body: { custom_fields } });
      return ok(data);
    },
  );

  server.tool(
    "billz_create_product",
    "Create a single product",
    {
      barcode: z.string(),
      sku: z.string(),
      name: z.string(),
      product_type_id: z.string().describe("Simple: 69e939aa-9b8f-46a9-b605-8b2675475b7b | Service: 5a0e556a-15f8-47ac-ae07-46972f3c6ab4 | Bundle: 864c77c7-5407-45dc-8289-3162b71dc653"),
      measurement_unit_id: z.string(),
      company_id: z.string(),
      description: z.string().optional(),
      brand_id: z.string().optional(),
      category_ids: z.array(z.string()).optional(),
      supplier_ids: z.array(z.string()).optional(),
      retail_price: z.number().optional(),
      supply_price: z.number().optional(),
      wholesale_price: z.number().optional(),
      is_variative: z.boolean().optional(),
      free_price: z.boolean().optional(),
      shipments: z.array(z.object({
        shop_id: z.string(),
        measurement_value: z.number(),
        total_measurement_value: z.number(),
        has_trigger: z.boolean().optional(),
        small_left_measurement_value: z.number().optional(),
      })).optional(),
      shop_prices: z.array(z.object({
        shop_id: z.string(),
        retail_price: z.number(),
        supply_price: z.number(),
        wholesale_price: z.number().optional(),
        min_price: z.number().optional(),
        max_price: z.number().optional(),
      })).optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/product", { body, httpResponse: true });
      return ok(data);
    },
  );
}
