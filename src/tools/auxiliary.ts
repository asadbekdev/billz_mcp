import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok } from "../helpers.js";

export function register(server: McpServer) {
  server.tool(
    "billz_get_company",
    "Get current company info",
    {},
    async () => {
      const data = await billzFetch("GET", "/v1/company");
      return ok(data);
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );

  server.tool(
    "billz_get_product_characteristics",
    "Get product custom field definitions",
    { limit: z.number().int().optional() },
    async (params) => {
      const data = await billzFetch("GET", "/v2/product-characteristic", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_measurement_units",
    "Get list of measurement units",
    {},
    async () => {
      const data = await billzFetch("GET", "/v2/measurement-unit");
      return ok(data);
    },
  );

  server.tool(
    "billz_get_product_types",
    "Get list of product types (simple, service, bundle)",
    {},
    async () => {
      const data = await billzFetch("GET", "/v2/product-types");
      return ok(data);
    },
  );

  server.tool(
    "billz_get_cashboxes",
    "Get list of cashboxes (POS terminals)",
    { limit: z.number().int().optional() },
    async (params) => {
      const data = await billzFetch("GET", "/v1/cash-box", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_payment_types",
    "Get list of payment methods",
    { limit: z.number().int().optional() },
    async (params) => {
      const data = await billzFetch("GET", "/v1/company-payment-type", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_get_currencies",
    "Get list of company currencies",
    {},
    async () => {
      const data = await billzFetch("GET", "/v2/company-currencies");
      return ok(data);
    },
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
    },
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
    },
  );
}
