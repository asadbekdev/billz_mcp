# Supplier Orders

Methods for working with supplier orders.

> All write methods require the header `Billz-Response-Channel: HTTP`.

---

## Create New Order {#create-order}

### POST /v2/supplier-order

Creates a new supplier order. Products are added separately.

**Body parameters**

| Field | Description |
| --- | --- |
| name | Order name |
| accepting_date | Expected acceptance date |
| is_from_file | Loaded from file indicator |
| payment_date | Payment date |
| shop_id | Shop UUID |
| supplier_id | Supplier UUID |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/supplier-order' \
  -X POST \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  --data-raw '{
    "name": "new order",
    "accepting_date": "2024-12-17",
    "is_from_file": false,
    "payment_date": "",
    "shop_id": "6f244db4-75d6-4fac-9841-14867d45e36a",
    "supplier_id": "28110831-9bc5-485f-830c-18472f9481b1"
  }'
```

---

## Add Products to Order {#add-products}

### PUT /v2/supplier-order/add-item

Adds a product to an existing order.

**Body parameters**

| Field | Description |
| --- | --- |
| supplier_order_id | Order UUID |
| product_id | Product UUID |
| ordered_measurement_value | Quantity ordered |
| retail_price | Retail price |
| supply_price | Supply price |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/supplier-order/add-item' \
  -X PUT \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  --data-raw '{
    "ordered_measurement_value": 1,
    "product_id": "aba9d9ad-5d37-4836-81a4-9a60648d087e",
    "retail_price": 110000,
    "supplier_order_id": "e8f19b80-6b2c-41ec-ad0f-0f4fe60aa191",
    "supply_price": 1
  }'
```

---

## Update Order {#update-order}

### PUT /v2/supplier-order/update/:id

Updates an order that has not yet been submitted. Uses the same body as Create.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/supplier-order/update/:id' \
  -X PUT \
  -H 'Authorization: Bearer ..' \
  -H 'Billz-Response-Channel: HTTP' \
  --data-raw '{
    "accepting_date": "2024-12-17",
    "settlement_type": "commission",
    "shop_id": "70919136-9481-4c7e-8581-685d750d67a9",
    "supplier_id": "5f4c5af2-3320-4fa4-aed9-65a35e1dab8f",
    "name": "new order 2",
    "comment": ""
  }'
```

---

## Submit Order {#submit-order}

### PATCH /v2/supplier-order/change-status

Moves the order to **Placed** status.

**Body parameters**

| Field | Description |
| --- | --- |
| id | Order UUID |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/supplier-order/change-status' \
  -X PATCH \
  -H 'Authorization: Bearer ..' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  --data-raw '{ "id": "e8f19b80-6b2c-41ec-ad0f-0f4fe60aa191" }'
```

---

## List Orders {#list-orders}

### GET /v2/supplier-order

Returns the list of supplier orders.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/supplier-order?limit=10&page=1' \
  -H 'Authorization: Bearer ...'
```

**Query parameters**

| Parameter | Description |
| --- | --- |
| limit / page | Pagination |
| shop_ids | Shop UUIDs |
| start_date / end_date | Order creation date range |
| accept_start_date / accept_end_date | Acceptance date range |
| status_id | Order status ID |
| supplier_ids | Supplier IDs |
| from_supply_price / to_supply_price | Supply price range |
| from_measurement_value / to_measurement_value | Quantity range |
| payment_status | Payment status |
| type | Order type |

**Response fields** (key fields)

| Field | Description |
| --- | --- |
| id | Order UUID |
| name | Order name |
| external_id | External ID |
| shop_id / shop.name | Shop |
| supplier_id / supplier.name | Supplier |
| status_id | Status ID |
| total_supply_price | Total supply price |
| total_retail_price | Total retail price |
| total_paid_amount | Total paid |
| accepting_date | Acceptance date |
| total_measurement_value | Total quantity |
| created_by | Created by |
| settlement_type | Settlement type |
| is_finished | Whether order is complete |

---

## List Order Products {#list-order-products}

### GET /v2/supplier-order-products/:id

Returns products added to a specific order.

```bash
curl 'https://api-admin.billz.ai/v2/supplier-order-products/:id?page=1&limit=10&status=added&shop_id=:shop_id' \
  -X GET \
  -H 'Authorization: Bearer ..'
```

**Query parameters**

| Parameter | Description |
| --- | --- |
| shop_id | Shop the order is for |
| status | Use `added` for added products |
| limit / page | Pagination |

**Response**

| Field | Description |
| --- | --- |
| count | Total count |
| product_ids | Array of product IDs |
| items[].product_id | Product ID |
| items[].ordered_measurement_value | Quantity ordered |
| items[].retail_price / supply_price | Prices |
| items[].product.name / sku / barcode | Product details |

---

## Order Statuses {#order-statuses}

| Status | ID |
| --- | --- |
| Draft | `0aafc362-bdb1-45d5-bc01-1ca2c430e87a` |
| Placed | `a9b3bf48-fca5-4354-af89-de04c5d0920b` |
| Accepted | `37dda94a-88c8-4a84-83c7-29bd606c6f06` |
| Cancelled | `e23c1284-8787-4786-8be2-e06530d46d4c` |
| Returned | `4d6bff58-45f2-443e-83d6-7a9170e7d5ab` |
