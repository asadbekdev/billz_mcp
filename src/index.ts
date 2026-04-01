#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

const server = new McpServer({
  name: "billz-mcp",
  version: "1.1.0",
  description: "MCP server for BILLZ POS/Retail API",
});

products(server);
customers(server);
sales(server);
orders(server);
transfers(server);
imports(server);
promotions(server);
reports(server);
auxiliary(server);
writeoffs(server);
stocktaking(server);
certificates(server);
resources(server);

const transport = new StdioServerTransport();
await server.connect(transport);
