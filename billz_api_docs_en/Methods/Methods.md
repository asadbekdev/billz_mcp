# Methods

This page describes the methods available for the BILLZ 2.0 API.

---

# Products

### Product Methods

- [Get Products](./Products/Get-Products.md)
- [Add / Edit Product Custom Field](./Products/Add-Edit-Product-Custom-Field.md)
- [Filter Products](./Products/Filter-Products.md)

---

# Customers

### Customer Methods

- [Create a Customer](./Customers/Customers.md#create-customer)
- [Get List of Customers](./Customers/Customers.md#get-customers)
- [Update a Customer](./Customers/Customers.md#update-customer)
- [Get Customer Details](./Customers/Customers.md#customer-details)
- [Update Cashback](./Customers/Customers.md#update-cashback)
- [Create Customer Card](./Customers/Customers.md#create-customer-card)
- [Get Customers by chat_id](./Customers/Customers.md#get-by-chat-id)
- [Get Loyalty Program](./Customers/Customers.md#loyalty-program)

---

# Sales

> ⚠️ **Note**: This section is experimental. Currently implemented via JSON-RPC.

### Sale Methods

- [Create New Sale](./Sales/Sale.md#create-sale)
- [Add Product](./Sales/Sale.md#add-product)
- [Attach Customer](./Sales/Sale.md#attach-customer)
- [Complete Sale](./Sales/Sale.md#complete-sale)
- [Postpone Sale](./Sales/Sale.md#postpone-sale)
- [Discounts](./Sales/Sale.md#discounts)
- [Recalculate Receipt](./Sales/Sale.md#recalculate)

### Drafts & Postponed Sales

- [Remove Item from Draft/Postponed](./Sales/Drafts-and-Postponed.md#remove-item)
- [Delete Draft](./Sales/Drafts-and-Postponed.md#delete-draft)
- [Cancel Postponed Sale](./Sales/Drafts-and-Postponed.md#cancel-postponed)

### Certificates & Gift Cards

- [Search Gift Cards](./Sales/Certificates.md#search-gift-cards)
- [Create Card](./Sales/Certificates.md#create-card)
- [Add Certificate to Sale](./Sales/Certificates.md#add-to-sale)
- [Remove Certificate from Sale](./Sales/Certificates.md#remove-from-sale)
- [Pay with Certificate](./Sales/Certificates.md#pay-with-certificate)

### Lists

- [List of Sales](./Sales/List-of-Sales.md)
- [List of Drafts](./Sales/List-of-Drafts.md)
- [List of Postponed Sales](./Sales/List-of-Postponed-Sales.md)
- [Sale Details](./Sales/Sale-Details.md)

---

# Adding Products to BILLZ

### Imports

- [Create with Products](./Imports/Imports.md#create-with-products)
- [List](./Imports/Imports.md#list)
- [Create Single Product](./Imports/Imports.md#create-single-product)

### Supplier Orders

- [Create New Order](./Orders/Orders.md#create-order)
- [Add Products](./Orders/Orders.md#add-products)
- [Edit Unsent Order](./Orders/Orders.md#update-order)
- [Submit Order](./Orders/Orders.md#submit-order)
- [List of Orders](./Orders/Orders.md#list-orders)
- [List of Products in Order](./Orders/Orders.md#list-order-products)

---

# Reports

### Store

- [Summary](./Reports/Reports.md#summary)
- [Transactions](./Reports/Reports.md#transactions)

### Sellers

- [Sellers](./Reports/Reports.md#sellers)

### Customers

- [Customer Purchases](./Reports/Reports.md#customer-purchases)

### Finance

- [Profit & Loss](./Reports/Reports.md#profit-loss)
- [Financial Transactions](./Reports/Reports.md#financial-transactions)

### Products

- [Sales by Products](./Reports/Reports.md#sales-by-products)
- [Product Performance](./Reports/Reports.md#product-performance)
- [Imports](./Reports/Reports.md#imports)
- [Sales by Suppliers](./Reports/Reports.md#sales-by-suppliers)
- [Order Returns](./Reports/Reports.md#order-returns)
- [Stocktaking Results](./Reports/Reports.md#stocktaking-results)
- [Stocktaking Results (Total)](./Reports/Reports.md#stocktaking-results-total)
- [Stock Balances](./Reports/Reports.md#stock-balances)
- [Write-offs](./Reports/Reports.md#write-offs)
- [Transfers](./Reports/Reports.md#transfers-report)

---

# Promotions

- [List of Promotions](./Promotions/Promotions.md#list)
- [Promotion Details](./Promotions/Promotions.md#details)
- [Products in Promotion](./Promotions/Promotions.md#products)

---

# Transfers

> ⚠️ To receive a response, you must include the required header `Billz-Response-Channel: HTTP` in every request.

- [List of Transfers](./Transfers/Transfers.md#list)
- [Create Transfer](./Transfers/Transfers.md#create)
- [Add Product to Transfer](./Transfers/Transfers.md#add-product)
- [Send Transfer](./Transfers/Transfers.md#send)
- [Cancel Transfer](./Transfers/Transfers.md#cancel)
- [Complete (Accept) Transfer](./Transfers/Transfers.md#complete)
- [Edit Transfer](./Transfers/Transfers.md#edit)
- [List of Transfer Statuses](./Transfers/Transfers.md#statuses)
- [Transfer Items](./Transfers/Transfer-Items.md)

Once completed, a transfer cannot be cancelled.

---

# Write-offs

> ⚠️ To receive a response, you must include the required header `Billz-Response-Channel: HTTP`.

Write-off process consists of three steps:
1. Create a new write-off process (no items yet)
2. Add items to the write-off
3. Complete the write-off process

After completion, products are queued for write-off and processed asynchronously.

### Create Write-off

**Request body**

```bash
curl 'https://api-admin.billz.ai/v2/write-off' \
  -H 'Authorization: Bearer .....' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "comment": "",
    "name": "Write-off 2024.09.16 12:19",
    "reason_id": "d6ccea76-7412-48b0-bad3-e0bc0f41673f",
    "shop_id": "70919136-9481-4c7e-8581-685d750d67a9"
  }'
```

Response returns the write-off ID to use in subsequent requests.

### Add Product to Write-off

`:id` is the write-off ID.

```bash
curl --request POST \
  --url https://api-admin.billz.ai/v2/write-off/:id/add \
  --header 'Authorization: Bearer ..' \
  --header 'Content-Type: application/json' \
  --data '{
    "shop_id": "70919136-9481-4c7e-8581-685d750d67a9",
    "product_id": "aba9d9ad-5d37-4836-81a4-9a60648d087e",
    "writeoff_measurement_value": 1
  }'
```

### Cancel Write-off

Cancels an incomplete write-off. `:id` is the write-off ID.

```bash
curl 'https://api-admin.billz.ai/v2/write-off/cancel/:id' \
  -X 'PUT' \
  -H 'Authorization: Bearer .....' \
  -H 'Content-Type: application/json'
```

### Complete Write-off

`:id` is the write-off ID.

```bash
curl 'https://api-admin.billz.ai/v2/write-off/finish/:id' \
  -X 'PUT' \
  -H 'Authorization: Bearer .....' \
  -H 'Content-Type: application/json'
```

### Write-off Reasons

```bash
curl 'https://api-admin.billz.ai/v2/write-off-reason?company_id=:id&limit=8'
```

Response:
- **id** — reason ID, used when creating a write-off
- **name** — reason name

```json
{
  "count": 5,
  "write_off_reasons": [
    { "id": "d6ccea76-7412-48b0-bad3-e0bc0f41673f", "name": "Other" },
    { "id": "d6ccea76-7412-48b0-bad3-e0bc0f41673d", "name": "Defect" },
    { "id": "d6ccea76-7412-48b0-bad3-e0bc0f41673e", "name": "Loss" },
    { "id": "5b104109-dd54-4617-a9bc-97fa35270f53", "name": "Stocktaking" },
    { "id": "9f6165e6-b9f5-4484-b958-b213d1847aee", "name": "Catalog write-off" }
  ]
}
```

---

# Stocktaking

### List of Stocktakings

**Query parameters**

- `company_id` — Company ID
- `search` — Search string
- `shop_ids` — Filter by shop IDs (comma-separated)
- `start_created_date` — Stocktaking started from date
- `start_finished_date` — Stocktaking started to date
- `end_created_date` — Stocktaking finished from date
- `end_finished_date` — Stocktaking finished to date
- `status_ids` — Filter by status IDs (comma-separated)
- `type` — Filter by stocktaking type
- `limit` — Items per page
- `page` — Page number

**Example request**

```bash
curl -X 'GET' \
  'https://api-admin.billz.ai/v2/stocktaking?company_id=17a36439-d140-454d-aedb-ae1585681db1&limit=10&page=1&search=12121&shop_ids=6f244db4-75d6-4fac-9841-14867d45e36a&start_created_date=2024-11-12&start_finished_date=2024-11-14&end_created_date=2024-11-19&end_finished_date=2024-11-22&status_ids=7cbb2295-559e-4b72-a3c1-11ac24dffc6b&type=full' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ...'
```

**Example response**

```json
{
  "count": 7,
  "stocktakings": [
    {
      "id": "a92467bb-75ec-435c-8acc-83b84911193d",
      "external_id": 579703,
      "name": "Stocktaking 2024.05.31 11:21",
      "shop_id": "6f244db4-75d6-4fac-9841-14867d45e36a",
      "shop_name": "store-4",
      "total_measurement_value": 788,
      "new_products": 0,
      "shortage": 787,
      "postponed": 0,
      "surplus": 0,
      "difference_sum": -21603094,
      "type": "FULL",
      "status_id": "7cbb2295-559e-4b72-a3c1-11ac24dffc6b",
      "process_percentage": 0,
      "created_at": "2024-05-31 11:22:07",
      "finished_at": ""
    }
  ]
}
```

---

# Auxiliary Methods

- [Auxiliary Methods](./Auxiliary/Auxiliary-Methods.md)

---

# See Also

- [Imports](./Imports/Imports.md)
- [Supplier Orders](./Orders/Orders.md)
- [Sale](./Sales/Sale.md)
- [Drafts & Postponed](./Sales/Drafts-and-Postponed.md)
- [Certificates](./Sales/Certificates.md)
- [Reports](./Reports/Reports.md)
- [List of Drafts](./Sales/List-of-Drafts.md)
- [List of Postponed Sales](./Sales/List-of-Postponed-Sales.md)
- [List of Sales](./Sales/List-of-Sales.md)
- [Customers](./Customers/Customers.md)
- [Promotions](./Promotions/Promotions.md)
- [Auxiliary Methods](./Auxiliary/Auxiliary-Methods.md)
- [Transfers](./Transfers/Transfers.md)
