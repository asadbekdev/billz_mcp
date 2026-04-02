# BILLZ MCP Server

MCP server for the [BILLZ](https://billz.ai) POS/Retail API 2.0.

## Modes

| Mode | Tools | Description |
|------|-------|-------------|
| `analytics` (default) | **18** | Read-only analytics & lookup — safe for AI agents |
| `full` | **80+** | All tools including write operations (sales, write-offs, transfers, etc.) |

Set via `BILLZ_MCP_MODE` environment variable.

## Setup

### 1. Build

```bash
cd billz_mcp
npm install
npm run build
```

### 2. Get your API key

In BILLZ Admin → Settings → Integrations → create an API key.

### 3. Add to Cursor (or any MCP client)

```json
{
  "mcpServers": {
    "billz": {
      "command": "node",
      "args": ["/absolute/path/to/billz_mcp/dist/index.js"],
      "env": {
        "BILLZ_SECRET_KEY": "your_secret_key_here",
        "BILLZ_MCP_MODE": "analytics"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BILLZ_SECRET_KEY` | **Yes** | — | API integration key from BILLZ Admin |
| `BILLZ_MCP_MODE` | No | `analytics` | `analytics` (18 tools) or `full` (80+) |
| `BILLZ_PLATFORM_ID` | No | built-in | Platform ID header value |

## Analytics Mode (default) — 18 tools

### Products (2)
| Tool | Description |
|------|-------------|
| `billz_get_products` | List products (delta sync via `last_updated_date`) |
| `billz_filter_products` | Advanced product search with filters |

### Sales (3)
| Tool | Description |
|------|-------------|
| `billz_get_sales` | List completed sales |
| `billz_get_sale_details` | Single sale deep dive |
| `billz_search_sales` | Advanced sales search (v3) |

### Customers (3)
| Tool | Description |
|------|-------------|
| `billz_get_customers` | List/search customers |
| `billz_get_customer` | Single customer detail |
| `billz_get_debt_stats` | Debt overview |

### Reports (6)
| Tool | Description |
|------|-------------|
| `billz_report_general_table` | KPI dashboard (sales, products, customers) |
| `billz_report_general_totals` | KPI totals/sums |
| `billz_report_products_table` | Sales by product |
| `billz_report_customers_table` | Customer analytics |
| `billz_report_profit_loss` | Profit & loss |
| `billz_report_stock` | Inventory levels by date |

### Reference Data (4)
| Tool | Description |
|------|-------------|
| `billz_get_shops` | Shop list |
| `billz_get_categories` | Product categories |
| `billz_get_brands` | Product brands |
| `billz_get_product_characteristics` | Custom field definitions |

## Full Mode — additional tools

Set `BILLZ_MCP_MODE=full` to unlock all 80+ tools including:

- **Products**: create, patch custom fields
- **Sales**: create draft, add products, apply discount, attach customer, complete, postpone, manage drafts
- **Customers**: create, update, set balance, loyalty cards
- **Supplier Orders**: create, add products, update, send
- **Transfers**: create, add products, send, cancel, accept, update
- **Imports**: bulk import products
- **Promotions**: list promos, details, promo products
- **Write-offs**: create, add products, cancel, complete, reasons
- **Stocktaking**: list sessions
- **Certificates/Gift Cards**: search, create, add/remove from sale, pay
- **Reports**: 19 additional report tools (transactions, performance, imports, suppliers, etc.)
- **Auxiliary**: company, users, suppliers, measurement units, cashboxes, payment types, currencies

## MCP Resources

API documentation is exposed as MCP resources via `billz://docs/{key}` (available in both modes).

## Project Structure

```
src/
  index.ts              Server init, mode gating, module registration
  billz-client.ts       HTTP client with JWT auth & 401 retry
  helpers.ts            Shared ok() helper, McpMode type
  resources.ts          MCP resources (API docs)
  tools/
    products.ts         2 analytics + 3 full
    customers.ts        3 analytics + 7 full
    sales.ts            3 analytics + 12 full
    reports.ts          6 analytics + 19 full
    auxiliary.ts        4 analytics + 10 full
    orders.ts           6 full-only
    transfers.ts        8 full-only
    imports.ts          2 full-only
    promotions.ts       3 full-only
    writeoffs.ts        5 full-only
    stocktaking.ts      1 full-only
    certificates.ts     5 full-only
```
