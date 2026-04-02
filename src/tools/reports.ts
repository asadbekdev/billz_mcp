import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, mode: McpMode) {
  // ── Analytics tools (always registered) ──────────────────────────────

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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );

  if (mode !== "full") return;

  // ── Full-mode report tools ───────────────────────────────────────────

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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );
}
