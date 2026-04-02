import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, mode: McpMode) {
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
    },
  );

  server.tool(
    "billz_get_customer",
    "Get detailed info for a single customer",
    { id: z.string().describe("Customer UUID") },
    async ({ id }) => {
      const data = await billzFetch("GET", `/v1/customer/${id}`);
      return ok(data);
    },
  );

  server.tool(
    "billz_get_debt_stats",
    "Get debt statistics for a customer",
    { customer_id: z.string() },
    async ({ customer_id }) => {
      const data = await billzFetch("GET", "/v1/debt-stats", { params: { customer_id } });
      return ok(data);
    },
  );

  if (mode !== "full") return;

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
    },
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
    },
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
    },
  );

  server.tool(
    "billz_create_customer_card",
    "Create a loyalty card for a customer",
    { customer_id: z.string() },
    async ({ customer_id }) => {
      const data = await billzFetch("POST", "/v1/client-card", { body: { customer_id } });
      return ok(data);
    },
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
    },
  );

  server.tool(
    "billz_get_loyalty_program",
    "Get loyalty program settings",
    {},
    async () => {
      const data = await billzFetch("GET", "/v1/loyalty-program");
      return ok(data);
    },
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
    },
  );
}
