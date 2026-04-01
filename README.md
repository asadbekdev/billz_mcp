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
        "BILLZ_SECRET_KEY": "your_secret_key_here"
      }
    }
  }
}
```

Or run directly:

```bash
BILLZ_SECRET_KEY=your_key node dist/index.js
```

## Available Tools (60+)

### Products
| Tool | Description |
|------|-------------|
| `billz_get_products` | List products (with delta sync via `last_updated_date`) |
| `billz_filter_products` | Advanced product filter |
| `billz_patch_product_custom_field` | Edit custom field on a product |
| `billz_create_product` | Create a single product |

### Customers
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

### Sales
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

### Supplier Orders
| Tool | Description |
|------|-------------|
| `billz_create_supplier_order` | Create order |
| `billz_add_product_to_supplier_order` | Add product |
| `billz_update_supplier_order` | Update unsent order |
| `billz_send_supplier_order` | Send/submit order |
| `billz_get_supplier_orders` | List orders |
| `billz_get_supplier_order_products` | Products in order |

### Transfers
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

### Imports
| Tool | Description |
|------|-------------|
| `billz_import_products` | Bulk import products (async) |
| `billz_get_imports` | List imports |

### Promotions
| Tool | Description |
|------|-------------|
| `billz_get_promos` | List promotions |
| `billz_get_promo` | Promo details |
| `billz_get_promo_products` | Products in promo |

### Reports (18 tools)
General, Transactions, Products, Product Performance, Imports, Sales by Suppliers, Order Returns, Stocktaking, Stock, Write-offs, Sellers, Customers, Customer Purchases, Profit & Loss, Cash Flow, Transfers.

### Auxiliary
Company, Shops, Users, Suppliers, Categories, Brands, Product Characteristics, Measurement Units, Product Types, Cashboxes, Payment Types, Currencies, Currency Rates, Report Payment Types.
