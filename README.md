# BILLZ MCP Server

MCP server for the [BILLZ](https://billz.ai) POS/Retail API 2.0.

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

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "billz": {
      "command": "node",
      "args": ["/absolute/path/to/billz_mcp/dist/index.js"],
      "env": {
        "BILLZ_SECRET_KEY": "your_secret_key_here",
        "BILLZ_PLATFORM_ID": "7d4a4c38-dd84-4902-b744-0488b80a4c01"
      }
    }
  }
}
```

Or run directly:

```bash
BILLZ_SECRET_KEY=your_key node dist/index.js
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BILLZ_SECRET_KEY` | **Yes** | API integration key from BILLZ Admin |
| `BILLZ_PLATFORM_ID` | No | Platform ID header value (has default) |

See `.env.example` for a template.

## Available Tools (80+)

### Products (4 tools)
| Tool | Description |
|------|-------------|
| `billz_get_products` | List products (with delta sync via `last_updated_date`) |
| `billz_filter_products` | Advanced product filter |
| `billz_patch_product_custom_field` | Edit custom field on a product |
| `billz_create_product` | Create a single product |

### Customers (10 tools)
| Tool | Description |
|------|-------------|
| `billz_create_customer` | Create customer |
| `billz_get_customers` | List customers |
| `billz_update_customer` | Update customer |
| `billz_get_customer` | Get customer details |
| `billz_set_customer_balance` | Set cashback balance |
| `billz_create_customer_card` | Issue loyalty card |
| `billz_get_customers_by_chat_id` | Find by Telegram chat_id |
| `billz_get_loyalty_program` | Get loyalty program config |
| `billz_get_debt_stats` | Debt statistics |
| `billz_get_debts` | List debts |

### Sales (15 tools)
| Tool | Description |
|------|-------------|
| `billz_create_sale` | Open new sale draft |
| `billz_add_product_to_sale` | Add product to draft |
| `billz_apply_discount` | Apply manual discount |
| `billz_attach_customer_to_sale` | Attach customer |
| `billz_complete_sale` | Finalize with payment |
| `billz_postpone_sale` | Save as postponed |
| `billz_recalculate_order_bill` | Recalculate (e.g. after gift cards) |
| `billz_get_sales` | List completed sales |
| `billz_get_sale_details` | Sale details |
| `billz_get_postponed_sales` | List postponed sales |
| `billz_get_draft_sales` | List draft sales |
| `billz_remove_item_from_draft` | Remove product from draft |
| `billz_delete_draft` | Delete a draft sale |
| `billz_cancel_postponed` | Cancel postponed sale |
| `billz_search_sales` | Advanced sales search (v3) |

### Supplier Orders (6 tools)
| Tool | Description |
|------|-------------|
| `billz_create_supplier_order` | Create order |
| `billz_add_product_to_supplier_order` | Add product |
| `billz_update_supplier_order` | Update unsent order |
| `billz_send_supplier_order` | Send/submit order |
| `billz_get_supplier_orders` | List orders |
| `billz_get_supplier_order_products` | Products in order |

### Transfers (8 tools)
| Tool | Description |
|------|-------------|
| `billz_get_transfers` | List transfers |
| `billz_create_transfer` | Create transfer |
| `billz_add_product_to_transfer` | Add product |
| `billz_send_transfer` | Send transfer |
| `billz_cancel_transfer` | Cancel transfer |
| `billz_accept_transfer` | Accept at destination |
| `billz_update_transfer` | Update transfer |
| `billz_get_transfer_products` | Products in transfer |

### Imports (2 tools)
| Tool | Description |
|------|-------------|
| `billz_import_products` | Bulk import products (async) |
| `billz_get_imports` | List imports |

### Promotions (3 tools)
| Tool | Description |
|------|-------------|
| `billz_get_promos` | List promotions |
| `billz_get_promo` | Promo details |
| `billz_get_promo_products` | Products in promo |

### Write-offs (5 tools)
| Tool | Description |
|------|-------------|
| `billz_create_writeoff` | Create write-off document |
| `billz_add_product_to_writeoff` | Add product to write-off |
| `billz_cancel_writeoff` | Cancel write-off |
| `billz_complete_writeoff` | Finalize write-off |
| `billz_get_writeoff_reasons` | List write-off reasons |

### Stocktaking (1 tool)
| Tool | Description |
|------|-------------|
| `billz_get_stocktakings` | List stocktaking sessions |

### Certificates / Gift Cards (5 tools)
| Tool | Description |
|------|-------------|
| `billz_search_gift_cards` | Search gift cards |
| `billz_create_gift_card` | Create gift card |
| `billz_add_certificate_to_sale` | Add certificate to sale |
| `billz_remove_certificate_from_sale` | Remove certificate from sale |
| `billz_pay_with_certificate` | Pay with gift card |

### Reports (25 tools)
General, Transactions, Products, Product Performance, Imports, Sales by Suppliers, Order Returns, Stocktaking Summary, Stock, Write-offs, Sellers, Customers, Customer Purchases, Profit & Loss, Cash Flow, Transfers.

### Auxiliary (14 tools)
Company, Shops, Users, Suppliers, Categories, Brands, Product Characteristics, Measurement Units, Product Types, Cashboxes, Payment Types, Currencies, Currency Rates, Report Payment Types.

## MCP Resources

The server also exposes API documentation as MCP resources. LLMs can read endpoint details on demand via the `billz://docs/{key}` URI pattern.

## Project Structure

```
src/
  index.ts              Server init, imports all modules
  billz-client.ts       HTTP client with JWT auth & 401 retry
  helpers.ts            Shared ok() response helper
  resources.ts          MCP resources (API docs)
  tools/
    products.ts         Product tools
    customers.ts        Customer tools
    sales.ts            Sales, drafts, postponed tools
    orders.ts           Supplier order tools
    transfers.ts        Transfer tools
    imports.ts          Import tools
    promotions.ts       Promotion tools
    reports.ts          Report tools
    auxiliary.ts        Reference data tools
    writeoffs.ts        Write-off tools
    stocktaking.ts      Stocktaking tools
    certificates.ts     Gift card / certificate tools
```
