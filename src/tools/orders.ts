import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_create_supplier_order",
    "Create a new supplier order",
    {
      name: z.string(),
      shop_id: z.string(),
      supplier_id: z.string(),
      accepting_date: z.string().describe("Format: 2024-12-17"),
      payment_date: z.string().optional(),
      is_from_file: z.boolean().optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/supplier-order", {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_add_product_to_supplier_order",
    "Add a product to a supplier order",
    {
      supplier_order_id: z.string(),
      product_id: z.string(),
      ordered_measurement_value: z.number(),
      retail_price: z.number(),
      supply_price: z.number(),
    },
    async (body) => {
      const data = await billzFetch("PUT", "/v2/supplier-order/add-item", {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_update_supplier_order",
    "Update an unsent supplier order",
    {
      id: z.string(),
      name: z.string().optional(),
      shop_id: z.string().optional(),
      supplier_id: z.string().optional(),
      accepting_date: z.string().optional(),
      comment: z.string().optional(),
    },
    async ({ id, ...body }) => {
      const data = await billzFetch("PUT", `/v2/supplier-order/update/${id}`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_send_supplier_order",
    "Change supplier order status to 'Sent'",
    { id: z.string().describe("Supplier order UUID") },
    async ({ id }) => {
      const data = await billzFetch("PATCH", "/v2/supplier-order/change-status", {
        body: { id },
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_supplier_orders",
    "Get list of supplier orders",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      shop_ids: z.string().optional(),
      supplier_ids: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      status_id: z.string().optional(),
      payment_status: z.string().optional(),
      type: z.string().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v2/supplier-order", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_supplier_order_products",
    "Get products in a supplier order",
    {
      order_id: z.string(),
      shop_id: z.string(),
      status: z.string().optional().describe("Use 'added' for added items"),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async ({ order_id, ...params }) => {
      const data = await billzFetch("GET", `/v2/supplier-order-products/${order_id}`, { params });
      return ok(data);
    },
  );
}
