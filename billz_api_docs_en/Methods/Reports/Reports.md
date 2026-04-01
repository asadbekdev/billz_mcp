# Reports

Methods for working with BILLZ reports.

---

## Shop

- [Summary](#summary)
- [Transactions](#transactions)

## Sellers

- [Sellers](#sellers)

## Customers

- [Customer Purchases](#customer-purchases)

## Finance

- [Profit & Loss](#profit-and-loss)
- [Financial Transactions](#financial-transactions)

## Products

- [Sales by Products](#sales-by-products)
- [Product Performance](#product-performance)
- [Imports Report](#imports-report)
- [Sales by Suppliers](#sales-by-suppliers)
- [Order Returns](#order-returns)
- [Stocktaking Results](#stocktaking-results)
- [Stocktaking Totals](#stocktaking-totals)
- [Stock Report](#stock-report)
- [Write-offs](#write-offs)
- [Transfers Report](#transfers-report)

---

## Summary {#summary}

General statistics for the main shop metrics including sales, products, customers, and sellers.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date | Start date |
| end_date | End date (optional for single day) |
| page | Page number |
| limit | Items per page |
| shop_ids | Comma-separated list of shop UUIDs |
| currency | Currency code (UZS, USD, KZT, etc.) |
| detalization | Grouping level: `day`, `week`, `month`, `year` |

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/general-report-table?start_date=2023-05-08&limit=10&page=1&shop_ids=...&currency=UZS&detalization=day' \
  -H 'Authorization: Bearer ...'
```

**Response fields**

| Field | Description |
| --- | --- |
| date | Date |
| shop_name | Shop |
| gross_sales | Gross revenue |
| discount_sum | Total discount |
| discount_percent | Discount percentage |
| products_returned | Number of returned items |
| returned_retail_price | Returns at retail price |
| returned_discount_price | Returns at discounted price |
| returned_supply_price | Returns at supply price |
| net_gross_sales | Net revenue |
| target | Revenue target |
| gross_profit | Gross profit |
| average_extra_charge | Average markup |
| products_sold | Items sold |
| transactions_count | Total transactions |
| sales | Sale transactions |
| returns_count | Return transactions |
| exchanges_count | Exchange transactions |
| average_measurement_value | Average items per receipt |
| average_cheque | Average receipt |
| average_price | Average item price |
| sales_per_square | Sales per square meter |

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/general-report?start_date=2023-05-08&limit=10&page=1&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Transactions {#transactions}

Detailed transaction statistics.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date | Start date |
| end_date | End date |
| page / limit | Pagination |
| shop_ids | Comma-separated shop UUIDs |
| cashier_ids | Cashier IDs |
| seller_ids | Seller IDs |
| transaction_type | Transaction type: `SALE`, `EXCHANGE`, `RETURN` |
| payment_type_ids | Payment type IDs |

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/transaction-report-table?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/transaction-report-totals?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...' \
  -H 'Authorization: Bearer ...'
```

---

## Sales by Products {#sales-by-products}

Shows which products are selling well, with breakdowns by category, color, size, and other attributes.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date | Start of sales period (`YYYY-MM-DD`) |
| end_date | End of sales period (optional for single day) |
| page | Min 1 |
| limit | Max 1000 |
| shop_ids | Comma-separated shop UUIDs |
| currency | Currency code |
| detalization | Grouping: `day`, `week`, `month`, `year`; omit for no grouping |
| detalization_by_position | `true` to group by price; `false` (default) |
| price_type | `0` all (default), `1` retail, `2` free, `3` wholesale |

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/product-general-table?start_date=2023-05-08&page=1&limit=10&shop_ids=...&currency=UZS&detalization=day&detalization_by_position=true' \
  -H 'Authorization: Bearer ...'
```

**Response fields**

| Field | Description |
| --- | --- |
| product_name | Product name |
| product_sku | SKU |
| product_barcode | Barcode |
| product_categories | Categories |
| product_brand_name | Brand |
| product_suppliers | Suppliers |
| product_is_archived | Archived |
| custom_fields | Custom fields |
| sold_measurement_value | Quantity sold |
| returned_measurement_value | Quantity returned |
| net_sold_measurement_value | Sold minus returns |
| gross_sales | Sales without discount |
| returned_sales_sum | Return amount |
| sold_with_discount | Sales with discount minus returns |
| sold_supply_sum | Sales at supply price |
| net_profit | Gross profit |
| average_margin | Average markup |
| discount | Discount |

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/product-general-report?start_date=2023-05-08&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Product Performance {#product-performance}

Shows all product movements from start to end of the period (opening stock, sold, closing stock).

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/report-product-performance-table?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/report-product-performance-totals?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Imports Report {#imports-report}

Analyzes how deliveries made during a specific period are selling.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date / end_date | Date range |
| page / limit | Pagination |
| shop_ids | Shop UUIDs |
| currency | Currency code |
| import_type | `import` for imports, `supplier_order` for orders; omit for both |
| detalization | Grouping level |

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/import-report-table?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS&import_type=import' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/import-report-totals?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS&import_type=supplier_order' \
  -H 'Authorization: Bearer ...'
```

---

## Sales by Suppliers {#sales-by-suppliers}

Shows product sales broken down by supplier.

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/product-sells-by-suppliers-table?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&supplier_ids=...&shop_ids=...&detalization=day' \
  -H 'Authorization: Bearer ...'
```

**Response fields**

| Field | Description |
| --- | --- |
| date | Date |
| supplier_name | Supplier |
| product_name | Product name |
| product_sku | SKU |
| product_barcode | Barcode |
| product_categories | Categories |
| product_brand_name | Brand |
| custom_fields | Custom fields |
| sold_measurement_value | Quantity sold |
| returned_measurement_value | Quantity returned |
| net_sold_measurement_value | Sold minus returns |
| gross_sales | Sales without discount |
| returned_sales_sum | Return amount |
| net_sales | Net sales with discount |
| net_profit | Gross profit |
| sold_supply_sum | Sales at supply price |
| average_margin | Average markup |
| discount | Discount |

---

## Order Returns {#order-returns}

Shows products returned to suppliers from orders.

**Query parameters:** `start_date`, `end_date`, `shop_ids`, `display_currency`, `detalization` (`hour`, `day`, `week`, `month`, `year`), `page`, `limit`

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/supplier-order-return-report-table?start_date=2023-01-01&end_date=2023-05-08&page=1&limit=10&shop_ids=...&display_currency=UZS&detalization=day' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/supplier-order-return-report-totals?start_date=2023-01-01&end_date=2023-05-08&page=1&limit=10&shop_ids=...&display_currency=UZS&detalization=day' \
  -H 'Authorization: Bearer ...'
```

---

## Stocktaking Results {#stocktaking-results}

Summarizes a completed stocktaking. Shows all product movements, plus auto-imports and auto-write-offs with supply and retail prices.

**Query parameters**

| Parameter | Description |
| --- | --- |
| stocktaking_guid | UUID of the completed stocktaking |
| currency | Currency for price display |
| page | Page number |
| limit | Items per page |

**Request**

```bash
curl -X GET 'https://api-admin.billz.ai/api/v1/stocktaking-summary-table?page=1&limit=10&stocktaking_guid=eeeeaf2b-1360-4f03-aa74-87ad7cc2edd7&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

**Response fields** (key fields)

| Field | Description |
| --- | --- |
| stocktaking_id | Stocktaking UUID |
| product_id / product_name | Product |
| expected_measurement_value | Expected count (declared) |
| scanned_measurement_value | Scanned count |
| sold_measurement_value | Sold during stocktaking |
| written_off_measurement_value | Written off during stocktaking |
| imported_after_stocktaking_finish | Auto-imported after completion |
| imported_supply_price_sum | Auto-import total supply price |
| imported_retail_price_sum | Auto-import total retail price |
| written_off_after_stocktaking | Auto-written-off after completion |
| written_off_supply_price_sum | Auto write-off total supply price |
| written_off_retail_price_sum | Auto write-off total retail price |

---

## Stocktaking Totals {#stocktaking-totals}

Returns totals row for the Stocktaking Results table.

**Query parameters:** `stocktaking_guid`, `currency`

```bash
curl -X GET 'https://api-admin.billz.ai/api/v1/stocktaking-summary-totals?stocktaking_guid=eeeeaf2b-1360-4f03-aa74-87ad7cc2edd7&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Stock Report {#stock-report}

Shows product stock balances as of a specific date (end of day).

**Query parameters**

| Parameter | Description |
| --- | --- |
| report_date | Report date |
| page / limit | Pagination |
| shop_ids | Shop UUIDs |
| currency | Currency code |

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/stock-report-table?report_date=2023-01-01&page=1&limit=10&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Write-offs {#write-offs}

Shows all products written off during the selected period.

**Query parameters:** `start_date`, `end_date`, `page`, `limit`, `shop_ids`, `currency`

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/write-off-report-table?start_date=2023-01-01&page=1&limit=10&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Sellers {#sellers}

Evaluates seller performance by sales, average receipt, average items per receipt, and more.

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/seller-general-table?start_date=2023-01-01&end_date=2023-05-08&page=1&limit=10&shop_ids=...&currency=UZS&detalization=day' \
  -H 'Authorization: Bearer ...'
```

---

## Customer Purchases {#customer-purchases}

Sales statistics broken down by customer.

**Query parameters:** same as other reports, plus `with_customers` (`true` = only sales with attached customers, `false` = all sales).

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/customer-purchases-table?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS&with_customers=true' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/customer-purchases-totals?start_date=2023-01-01&page=1&limit=10&end_date=2023-05-08&shop_ids=...&currency=UZS&with_customers=true' \
  -H 'Authorization: Bearer ...'
```

---

## Customers Report {#customers-report}

Shows new vs. returning customers, average receipts, and other customer metrics.

**Table request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/customer-general-table?start_date=2023-01-01&end_date=2023-05-08&limit=10&page=1&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

**Totals request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/customer-general-report?start_date=2023-01-01&end_date=2023-05-08&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Profit & Loss {#profit-and-loss}

Detailed profit and loss report.

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/profit-and-lose?start_date=2023-01-01&end_date=2023-05-08&shop_ids=...&currency=UZS' \
  -H 'Authorization: Bearer ...'
```

---

## Financial Transactions {#financial-transactions}

Detailed cashflow report.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date / end_date | Date range |
| page / limit | Pagination |
| shop_ids | Shop UUIDs |
| operation | Operation types (comma-separated): `1` Income, `2` Expense, `3` Shift close, `4` Transfer, `5` Conversion, `6` Cash collection, `7` Cash register open |

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/cashflow-report-table?start_date=2023-01-01&end_date=2023-05-08&operation=1,2&shop_ids=...' \
  -H 'Authorization: Bearer ...'
```

---

## Transfers Report {#transfers-report}

Detailed report on product transfers between shops.

**Query parameters**

| Parameter | Description |
| --- | --- |
| start_date / end_date | Date range |
| page / limit | Pagination |
| shop_ids | Shop UUIDs |
| display_currency | Currency code |
| group_by | Grouping: omit for none, `transfer_name`, `product_name`, `sku` |

```bash
curl 'https://api-admin.billz.ai/v1/transfer-report-table?start_date=2025-11-30&shop_ids=...&display_currency=UZS&page=1&limit=10&group_by=sku' \
  -H 'Authorization: Bearer ...'
```

**Response fields**

| Field | Type | Description |
| --- | --- | --- |
| transfer_id | string | Transfer ID |
| external_id | string | External transfer ID |
| product_id | string | Product ID |
| created_at | datetime | Created date |
| accepted_at | datetime | Accepted date |
| name | string | Transfer name |
| from_shop_id / from_shop | string | Sending shop |
| to_shop_id / to_shop | string | Receiving shop |
| product_name | string | Product name |
| product_sku | string | SKU |
| product_barcode | string | Barcode |
| sum_supply_price | number | Total supply price |
| sum_retail_price | number | Total retail price |
| sent_quantity | number | Quantity sent |
| arrived_quantity | number | Quantity arrived |
| supplier | string | Supplier |
| measurement_name | string | Unit of measure |
