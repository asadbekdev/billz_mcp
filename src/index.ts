#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { billzFetch } from "./billz-client.js";

const server = new McpServer({
  name: "billz-mcp",
  version: "1.0.0",
  description: "MCP server for BILLZ POS/Retail API",
});

// ─── HELPER ─────────────────────────────────────────────────────────────────

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

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
  }
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
  }
);

server.tool(
  "billz_patch_product_custom_field",
  "Add or edit a custom field value on a product",
  {
    product_id: z.string().describe("Product UUID"),
    custom_fields: z.array(
      z.object({ custom_field_id: z.string(), custom_field_value: z.string() })
    ),
  },
  async ({ product_id, custom_fields }) => {
    const data = await billzFetch("PATCH", `/v2/product/${product_id}/patch-groups`, { body: { custom_fields } });
    return ok(data);
  }
);

server.tool(
  "billz_create_product",
  "Create a single product",
  {
    barcode: z.string(),
    sku: z.string(),
    name: z.string(),
    product_type_id: z.string().describe("Simple product: 69e939aa-9b8f-46a9-b605-8b2675475b7b | Service: 5a0e556a-15f8-47ac-ae07-46972f3c6ab4 | Bundle: 864c77c7-5407-45dc-8289-3162b71dc653"),
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
    const data = await billzFetch("POST", "/v2/product?Billz-Response-Channel=HTTP", { body });
    return ok(data);
  }
);

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

server.tool(
  "billz_create_customer",
  "Create a new customer",
  {
    first_name: z.string(),
    last_name: z.string().optional(),
    phone_number: z.string().describe("Phone number e.g. +998000000000"),
    date_of_birth: z.string().optional().describe("Format: 2022-05-14"),
    gender: z.number().int().min(0).max(2).optional().describe("0=unknown 1=male 2=female"),
    chat_id: z.string().optional().describe("Telegram chat_id"),
  },
  async (body) => {
    const data = await billzFetch("POST", "/v1/client", { body });
    return ok(data);
  }
);

server.tool(
  "billz_get_customers",
  "Get list of customers",
  {
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
    search: z.string().optional(),
    phone_number: z.string().optional(),
    chat_id: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/client", { params });
    return ok(data);
  }
);

server.tool(
  "billz_update_customer",
  "Update customer info",
  {
    id: z.string().describe("Customer UUID"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    date_of_birth: z.string().optional(),
    phone_number: z.array(z.string()).optional(),
    gender: z.number().int().min(0).max(2).optional(),
  },
  async ({ id, ...body }) => {
    const data = await billzFetch("PUT", `/v1/client/${id}`, { body });
    return ok(data);
  }
);

server.tool(
  "billz_get_customer",
  "Get detailed info for a single customer",
  { id: z.string().describe("Customer UUID") },
  async ({ id }) => {
    const data = await billzFetch("GET", `/v1/customer/${id}`);
    return ok(data);
  }
);

server.tool(
  "billz_set_customer_balance",
  "Manually set a customer's cashback balance",
  {
    id: z.string().describe("Customer UUID"),
    balance: z.number().int(),
  },
  async ({ id, balance }) => {
    const data = await billzFetch("PATCH", `/v1/customer/set-balance/${id}`, { body: { balance } });
    return ok(data);
  }
);

server.tool(
  "billz_create_customer_card",
  "Create a loyalty card for a customer",
  { customer_id: z.string() },
  async ({ customer_id }) => {
    const data = await billzFetch("POST", "/v1/client-card", { body: { customer_id } });
    return ok(data);
  }
);

server.tool(
  "billz_get_customers_by_chat_id",
  "Get customers by Telegram chat_id",
  {
    chat_id: z.string(),
    page: z.number().int().optional(),
    limit: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/client-by-chat-id", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_loyalty_program",
  "Get loyalty program settings",
  {},
  async () => {
    const data = await billzFetch("GET", "/v1/loyalty-program");
    return ok(data);
  }
);

server.tool(
  "billz_get_debt_stats",
  "Get debt statistics for a customer",
  { customer_id: z.string() },
  async ({ customer_id }) => {
    const data = await billzFetch("GET", "/v1/debt-stats", { params: { customer_id } });
    return ok(data);
  }
);

server.tool(
  "billz_get_debts",
  "Get list of debts for a customer",
  {
    customer_id: z.string(),
    page: z.number().int().optional(),
    limit: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/debt", { params });
    return ok(data);
  }
);

// ─── SALES ───────────────────────────────────────────────────────────────────

server.tool(
  "billz_create_sale",
  "Create a new sale draft. Returns sale id and order_number.",
  {
    shop_id: z.string(),
    cashbox_id: z.string(),
  },
  async ({ shop_id, cashbox_id }) => {
    const data = await billzFetch("POST", "/v2/order?Billz-Response-Channel=HTTP", {
      headers: { "platform-id": "7d4a4c38-dd84-4902-b744-0488b80a4c01" },
      body: { shop_id, cashbox_id },
    });
    return ok(data);
  }
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
    const data = await billzFetch("POST", `/v2/order-product/${order_id}?Billz-Response-Channel=HTTP`, {
      body: { ...body, response_type: "HTTP" },
    });
    return ok(data);
  }
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
    const data = await billzFetch("POST", `/v2/order-manual-discount/${order_id}?Billz-Response-Channel=HTTP`, { body });
    return ok(data);
  }
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
    const data = await billzFetch("PUT", `/v2/order-customer-new/${order_id}?Billz-Response-Channel=HTTP`, { body });
    return ok(data);
  }
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
    const data = await billzFetch("POST", `/v2/order-payment/${order_id}?Billz-Response-Channel=HTTP`, { body });
    return ok(data);
  }
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
    const data = await billzFetch("POST", "/v2/order/create_postpone?Billz-Response-Channel=HTTP", { body });
    return ok(data);
  }
);

server.tool(
  "billz_recalculate_order_bill",
  "Recalculate order bill (e.g. after adding gift cards)",
  { order_id: z.string() },
  async ({ order_id }) => {
    const data = await billzFetch("POST", `/v1/recalculate-order-bill/${order_id}?Billz-Response-Channel=HTTP`);
    return ok(data);
  }
);

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
    const data = await billzFetch("GET", "/v1/orders", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_sale_details",
  "Get details of a specific sale",
  { order_id: z.string() },
  async ({ order_id }) => {
    const data = await billzFetch("GET", `/v2/order/${order_id}`);
    return ok(data);
  }
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
  }
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
  }
);

// ─── SUPPLIER ORDERS ─────────────────────────────────────────────────────────

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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
);

server.tool(
  "billz_send_supplier_order",
  "Change supplier order status to 'Sent'",
  { id: z.string().describe("Supplier order UUID") },
  async ({ id }) => {
    const data = await billzFetch("PATCH", "/v2/supplier-order/change-status", {
      headers: { "Billz-Response-Channel": "HTTP" },
      body: { id },
    });
    return ok(data);
  }
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
  }
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
  }
);

// ─── TRANSFERS ───────────────────────────────────────────────────────────────

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
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
);

server.tool(
  "billz_send_transfer",
  "Mark a transfer as sent",
  { transfer_id: z.string() },
  async ({ transfer_id }) => {
    const data = await billzFetch("POST", `/v2/transfer/${transfer_id}/send`, {
      headers: { "Billz-Response-Channel": "HTTP" },
    });
    return ok(data);
  }
);

server.tool(
  "billz_cancel_transfer",
  "Cancel a transfer",
  { transfer_id: z.string() },
  async ({ transfer_id }) => {
    const data = await billzFetch("DELETE", `/v2/transfer/${transfer_id}`, {
      headers: { "Billz-Response-Channel": "HTTP" },
    });
    return ok(data);
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body: { use_departure_price: use_departure_price ?? false },
    });
    return ok(data);
  }
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
      headers: { "Billz-Response-Channel": "HTTP" },
      body,
    });
    return ok(data);
  }
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
  }
);

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

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
  }
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
  }
);

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────

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
      headers: { "platform-id": "7d4a4c38-dd84-4902-b744-0488b80a4c01" },
      params,
    });
    return ok(data);
  }
);

server.tool(
  "billz_get_promo",
  "Get details of a specific promotion",
  { id: z.string() },
  async ({ id }) => {
    const data = await billzFetch("GET", `/v1/promo/${id}`, {
      headers: { "platform-id": "7d4a4c38-dd84-4902-b744-0488b80a4c01" },
    });
    return ok(data);
  }
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
      headers: { "platform-id": "7d4a4c38-dd84-4902-b744-0488b80a4c01" },
      params,
    });
    return ok(data);
  }
);

// ─── REPORTS ─────────────────────────────────────────────────────────────────

server.tool(
  "billz_report_general_table",
  "General summary report table (sales, products, customers, sellers stats)",
  {
    start_date: z.string().describe("YYYY-MM-DD"),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional().describe("e.g. UZS, USD"),
    detalization: z.enum(["day", "week", "month", "year"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/general-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_general_totals",
  "General summary report totals (sums)",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/general-report", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_transactions_table",
  "Transactions report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    cashier_ids: z.string().optional(),
    seller_ids: z.string().optional(),
    transaction_types: z.string().optional().describe("SALE, EXCHANGE, RETURN"),
    payment_type_ids: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/transaction-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_transactions_totals",
  "Transactions report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/transaction-report-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_products_table",
  "Product sales report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    detalization: z.enum(["day", "week", "month", "year"]).optional(),
    detalization_by_position: z.boolean().optional(),
    price_type: z.number().int().min(0).max(3).optional().describe("0=all 1=retail 2=free 3=wholesale"),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/product-general-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_products_totals",
  "Product sales report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/product-general-report", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_product_performance_table",
  "Product performance/movement report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/report-product-performance-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_product_performance_totals",
  "Product performance report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/report-product-performance-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_imports_table",
  "Imports report table (how imported stock sells)",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    import_type: z.enum(["import", "supplier_order"]).optional(),
    detalization: z.enum(["day", "week", "month", "year"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/import-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_imports_totals",
  "Imports report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    import_type: z.enum(["import", "supplier_order"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/import-report-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_sales_by_suppliers_table",
  "Sales by suppliers report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    supplier_ids: z.string().optional(),
    currency: z.string().optional(),
    detalization: z.enum(["day", "week", "month", "year"]).optional(),
    price_type: z.number().int().min(0).max(3).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/product-sells-by-suppliers-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_order_returns_table",
  "Supplier order returns report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    display_currency: z.string().optional(),
    detalization: z.enum(["hour", "day", "week", "month", "year"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/supplier-order-return-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_order_returns_totals",
  "Supplier order returns report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    display_currency: z.string().optional(),
    detalization: z.enum(["hour", "day", "week", "month", "year"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/supplier-order-return-report-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_stocktaking_summary",
  "Stocktaking (inventory count) summary report table",
  {
    stocktaking_guid: z.string(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/api/v1/stocktaking-summary-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_stocktaking_summary_totals",
  "Stocktaking summary totals",
  {
    stocktaking_guid: z.string(),
    currency: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/api/v1/stocktaking-summary-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_stock",
  "Stock on hand report (inventory levels at a specific date)",
  {
    report_date: z.string().describe("Format: YYYY-MM-DD"),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/stock-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_write_offs",
  "Write-offs report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/write-off-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_sellers_table",
  "Seller performance report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    detalization: z.enum(["day", "week", "month", "year"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/seller-general-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_customers_table",
  "Customer statistics report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/customer-general-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_customers_totals",
  "Customer statistics report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/customer-general-report", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_customer_purchases_table",
  "Customer purchases report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    with_customers: z.boolean().optional().describe("true=only purchases with customers"),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/customer-purchases-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_customer_purchases_totals",
  "Customer purchases report totals",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
    with_customers: z.boolean().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/customer-purchases-totals", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_profit_loss",
  "Profit and loss report",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    currency: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/profit-and-lose", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_cashflow_table",
  "Cash flow / financial transactions report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    operation: z.string().optional().describe("1=Income,2=Expense,3=ShiftClose,4=Transfer,5=Conversion,6=Collection,7=CashboxOpen (comma-separated)"),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/cashflow-report-table", { params });
    return ok(data);
  }
);

server.tool(
  "billz_report_transfers_table",
  "Inventory transfers report table",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
    display_currency: z.string().optional(),
    group_by: z.enum(["transfer_name", "product_name", "sku"]).optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/transfer-report-table", { params });
    return ok(data);
  }
);

// ─── AUXILIARY ───────────────────────────────────────────────────────────────

server.tool(
  "billz_get_company",
  "Get current company info",
  {},
  async () => {
    const data = await billzFetch("GET", "/v1/company");
    return ok(data);
  }
);

server.tool(
  "billz_get_shops",
  "Get list of shops",
  {
    limit: z.number().int().optional(),
    only_allowed: z.boolean().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/shop", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_users",
  "Get list of users (cashiers, sellers)",
  {
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/user", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_suppliers",
  "Get list of suppliers",
  {
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
    search: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/supplier", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_categories",
  "Get product categories",
  {
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
    search: z.string().optional(),
    is_deleted: z.boolean().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v2/category", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_brands",
  "Get list of product brands",
  {
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
    search: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v2/brand", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_product_characteristics",
  "Get product custom field definitions",
  { limit: z.number().int().optional() },
  async (params) => {
    const data = await billzFetch("GET", "/v2/product-characteristic", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_measurement_units",
  "Get list of measurement units",
  {},
  async () => {
    const data = await billzFetch("GET", "/v2/measurement-unit");
    return ok(data);
  }
);

server.tool(
  "billz_get_product_types",
  "Get list of product types (simple, service, bundle)",
  {},
  async () => {
    const data = await billzFetch("GET", "/v2/product-types");
    return ok(data);
  }
);

server.tool(
  "billz_get_cashboxes",
  "Get list of cashboxes (POS terminals)",
  { limit: z.number().int().optional() },
  async (params) => {
    const data = await billzFetch("GET", "/v1/cash-box", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_payment_types",
  "Get list of payment methods",
  { limit: z.number().int().optional() },
  async (params) => {
    const data = await billzFetch("GET", "/v1/company-payment-type", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_currencies",
  "Get list of company currencies",
  {},
  async () => {
    const data = await billzFetch("GET", "/v2/company-currencies");
    return ok(data);
  }
);

server.tool(
  "billz_get_currency_rates",
  "Get currency exchange rate history",
  {
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    currency: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v2/company-currency-rates", { params });
    return ok(data);
  }
);

server.tool(
  "billz_get_report_payment_types",
  "Get payment type list for transaction reports",
  {
    start_date: z.string(),
    end_date: z.string().optional(),
    shop_ids: z.string().optional(),
  },
  async (params) => {
    const data = await billzFetch("GET", "/v1/transaction-report-payments", { params });
    return ok(data);
  }
);

// ─── START ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
