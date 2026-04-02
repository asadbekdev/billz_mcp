#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { McpMode } from "./helpers.js";
import { register as products } from "./tools/products.js";
import { register as customers } from "./tools/customers.js";
import { register as sales } from "./tools/sales.js";
import { register as orders } from "./tools/orders.js";
import { register as transfers } from "./tools/transfers.js";
import { register as imports } from "./tools/imports.js";
import { register as promotions } from "./tools/promotions.js";
import { register as reports } from "./tools/reports.js";
import { register as auxiliary } from "./tools/auxiliary.js";
import { register as writeoffs } from "./tools/writeoffs.js";
import { register as stocktaking } from "./tools/stocktaking.js";
import { register as certificates } from "./tools/certificates.js";
import { register as resources } from "./resources.js";

const mode: McpMode =
  process.env.BILLZ_MCP_MODE === "full" ? "full" : "analytics";

const server = new McpServer({
  name: "billz-mcp",
  version: "1.2.0",
  description:
    mode === "analytics"
      ? "BILLZ Analytics MCP — 18 read-only tools for products, sales, customers & reports"
      : "BILLZ MCP — full 80+ tool suite for BILLZ POS/Retail API",
});

products(server, mode);
customers(server, mode);
sales(server, mode);
reports(server, mode);
auxiliary(server, mode);

if (mode === "full") {
  orders(server, mode);
  transfers(server, mode);
  imports(server, mode);
  promotions(server, mode);
  writeoffs(server, mode);
  stocktaking(server, mode);
  certificates(server, mode);
}

resources(server);

const transport = new StdioServerTransport();
await server.connect(transport);
