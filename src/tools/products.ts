import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, mode: McpMode) {
  server.tool(
    "billz_get_products",
    "Get list of products. Use last_updated_date to sync only changed products. Returns category_name, category_id, photos at top level.",
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
    "Filter/search products with advanced criteria. Valid status values: 'all' | 'active' | 'inactive'. Use product_field_filters for custom field filtering (field_type: 'custom' or 'attribute').",
    {
      status: z.enum(["all", "active", "inactive"]).optional().describe("'all' | 'active' | 'inactive' — only these three are valid"),
      field_search_key: z.string().optional().describe("Free-text search across product fields"),
      shop_ids: z.array(z.string()).optional(),
      category_ids: z.array(z.string()).optional(),
      skus: z.array(z.string()).optional(),
      brand_ids: z.array(z.string()).optional(),
      supplier_ids: z.array(z.string()).optional(),
      measurement_unit_ids: z.array(z.string()).optional(),
      product_field_filters: z.array(z.object({
        field_id: z.string(),
        field_type: z.enum(["custom", "attribute"]),
        field_values: z.array(z.string()),
      })).optional().describe("Filter by custom fields (field_type:'custom') or attributes (field_type:'attribute')"),
      supply_price_from: z.number().optional(),
      supply_price_to: z.number().optional(),
      retail_price_from: z.number().optional(),
      retail_price_to: z.number().optional(),
      whole_sale_price_from: z.number().optional(),
      whole_sale_price_to: z.number().optional(),
      is_free_price: z.boolean().nullable().optional(),
      group_variations: z.boolean().optional().describe("Group product variations together"),
      archived_list: z.boolean().optional().describe("Include archived products"),
      statistics: z.boolean().optional().describe("Include custom field definitions in response"),
      limit: z.number().int().max(100).optional(),
      page: z.number().int().optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/product-search-with-filters", { body });
      return ok(data);
    },
  );

  if (mode !== "full") return;

  server.tool(
    "billz_patch_product_custom_field",
    "Add or edit a custom field value on a product (docs endpoint)",
    {
      product_id: z.string().describe("Product UUID"),
      custom_fields: z.array(
        z.object({ custom_field_id: z.string(), custom_field_value: z.string() }),
      ),
    },
    async ({ product_id, custom_fields }) => {
      const data = await billzFetch(
        "PATCH",
        `/v2/product/${product_id}/patch-props`,
        { body: { custom_fields }, httpResponse: true },
      );
      return ok(data);
    },
  );

  server.tool(
    "billz_upsert_product_field",
    "Add or edit product custom field via /v2/product-field (for environments using this variant)",
    {
      payload: z.record(z.any()).describe("Raw API body for /v2/product-field"),
    },
    async ({ payload }) => {
      const data = await billzFetch("POST", "/v2/product-field", {
        body: payload,
        httpResponse: true,
      });
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
