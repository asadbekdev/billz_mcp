import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch, getPlatformId } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, mode: McpMode) {
  server.tool(
    "billz_get_sales",
    "Get list of completed sales",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      shop_ids: z.string().optional().describe("Comma-separated shop UUIDs"),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    },
    async (params) => {
      // /v1/orders returns 404 — Billz docs: list sales via GET /v3/order-search
      const data = await billzFetch("GET", "/v3/order-search", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_sale_details",
    "Get details of a specific sale",
    { order_id: z.string() },
    async ({ order_id }) => {
      const data = await billzFetch("GET", `/v2/order/${order_id}`);
      return ok(data);
    },
  );

  server.tool(
    "billz_search_sales",
    "Search sales with advanced filters (v3 endpoint)",
    {
      search: z.string().optional().describe("Search by order number, customer name, phone"),
      shop_ids: z.string().optional().describe("Comma-separated shop UUIDs"),
      cashier_ids: z.string().optional().describe("Comma-separated cashier UUIDs"),
      seller_ids: z.string().optional().describe("Comma-separated seller UUIDs"),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      status: z.string().optional().describe("e.g. completed, draft, postponed"),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v3/order-search", { params });
      return ok(data);
    },
  );

  if (mode !== "full") return;

  server.tool(
    "billz_create_sale",
    "Create a new sale draft. Returns sale id and order_number.",
    {
      shop_id: z.string(),
      cashbox_id: z.string(),
    },
    async ({ shop_id, cashbox_id }) => {
      const data = await billzFetch("POST", "/v2/order", {
        headers: { "platform-id": getPlatformId() },
        body: { shop_id, cashbox_id },
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_add_product_to_sale",
    "Add a product to an open sale draft",
    {
      order_id: z.string(),
      product_id: z.string(),
      sold_measurement_value: z.number(),
      used_wholesale_price: z.boolean().optional(),
      use_free_price: z.boolean().optional(),
      free_price: z.number().optional(),
      is_manual: z.boolean().optional(),
      seller_ids: z.array(z.string()).optional(),
    },
    async ({ order_id, ...body }) => {
      const data = await billzFetch("POST", `/v2/order-product/${order_id}`, {
        body: { ...body, response_type: "HTTP" },
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_apply_discount",
    "Apply manual discount to entire cart or a specific product",
    {
      order_id: z.string(),
      discount_unit: z.enum(["PERCENTAGE", "CURRENCY"]),
      discount_value: z.number(),
      product_id: z.string().optional(),
    },
    async ({ order_id, ...body }) => {
      const data = await billzFetch("POST", `/v2/order-manual-discount/${order_id}`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_attach_customer_to_sale",
    "Attach a customer to an open sale",
    {
      order_id: z.string(),
      customer_id: z.string(),
      check_auth_code: z.boolean().optional(),
    },
    async ({ order_id, ...body }) => {
      const data = await billzFetch("PUT", `/v2/order-customer-new/${order_id}`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_complete_sale",
    "Finalize a sale with payment info",
    {
      order_id: z.string(),
      payments: z.array(z.object({
        company_payment_type_id: z.string(),
        paid_amount: z.number(),
        returned_amount: z.number().optional(),
        company_payment_type: z.object({ name: z.string() }).optional(),
      })),
      comment: z.string().optional(),
      with_cashback: z.number().optional(),
      without_cashback: z.boolean().optional(),
      skip_ofd: z.boolean().optional(),
    },
    async ({ order_id, ...body }) => {
      const data = await billzFetch("POST", `/v2/order-payment/${order_id}`, {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_postpone_sale",
    "Save a sale draft as a postponed order (reserved stock)",
    {
      order_id: z.string(),
      time: z.string().describe("Expiry time, format: 2024-07-16 06:47:30"),
      comment: z.string().optional(),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v2/order/create_postpone", {
        body,
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_recalculate_order_bill",
    "Recalculate order bill (e.g. after adding gift cards)",
    { order_id: z.string() },
    async ({ order_id }) => {
      const data = await billzFetch("POST", `/v1/recalculate-order-bill/${order_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_postponed_sales",
    "Get list of postponed sales",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
      shop_ids: z.string().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v1/postponed-orders", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_draft_sales",
    "Get list of draft sales",
    {
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v1/draft-orders", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_remove_item_from_draft",
    "Remove a product from a draft/open sale",
    {
      order_id: z.string(),
      product_id: z.string(),
    },
    async ({ order_id, product_id }) => {
      const data = await billzFetch("DELETE", `/v2/order-product/${order_id}/${product_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_delete_draft",
    "Delete a draft sale entirely",
    { order_id: z.string() },
    async ({ order_id }) => {
      const data = await billzFetch("DELETE", `/v2/order/${order_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_cancel_postponed",
    "Cancel a postponed sale (releases reserved stock)",
    {
      order_id: z.string(),
    },
    async ({ order_id }) => {
      const data = await billzFetch("PUT", "/v2/order/cancel_postpone", {
        body: { order_id },
        httpResponse: true,
      });
      return ok(data);
    },
  );
}
