import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { billzFetch } from "../billz-client.js";
import { ok, type McpMode } from "../helpers.js";

export function register(server: McpServer, _mode: McpMode) {
  server.tool(
    "billz_search_gift_cards",
    "Search gift cards / certificates",
    {
      search: z.string().optional().describe("Search by code or name"),
      limit: z.number().int().optional(),
      page: z.number().int().optional(),
    },
    async (params) => {
      const data = await billzFetch("GET", "/v1/gift-card/search", { params });
      return ok(data);
    },
  );

  server.tool(
    "billz_create_gift_card",
    "Create a new gift card / certificate",
    {
      name: z.string(),
      code: z.string().describe("Unique card code"),
      amount: z.number().describe("Card value"),
      expiry_date: z.string().optional().describe("Format: YYYY-MM-DD"),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v1/gift-card", { body });
      return ok(data);
    },
  );

  server.tool(
    "billz_add_certificate_to_sale",
    "Add a certificate/gift card to a sale",
    {
      order_id: z.string(),
      gift_card_id: z.string(),
    },
    async ({ order_id, gift_card_id }) => {
      const data = await billzFetch("POST", `/v2/order-gift-card/${order_id}`, {
        body: { gift_card_id },
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_remove_certificate_from_sale",
    "Remove a certificate/gift card from a sale",
    {
      order_id: z.string(),
      gift_card_id: z.string(),
    },
    async ({ order_id, gift_card_id }) => {
      const data = await billzFetch("DELETE", `/v2/order-gift-card/${order_id}/${gift_card_id}`, {
        httpResponse: true,
      });
      return ok(data);
    },
  );

  server.tool(
    "billz_pay_with_certificate",
    "Pay for a sale using a gift card / certificate",
    {
      gift_card_id: z.string(),
      order_id: z.string(),
      amount: z.number().describe("Amount to pay from this card"),
    },
    async (body) => {
      const data = await billzFetch("POST", "/v1/gift-card/pay", { body });
      return ok(data);
    },
  );
}
