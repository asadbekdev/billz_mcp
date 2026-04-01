# Imports

Methods for importing products into BILLZ.

> All write methods require the `Billz-Response-Channel: HTTP` header for synchronous responses, or use webhooks for async operations.

---

## Create Import with Products {#create-with-products}

### POST /v2/product-import/create-with-products

Creates an import with new or existing products. This method works **asynchronously** — it returns a `correlation_id` immediately, and the final result is delivered via **webhook** (contact developers to connect a webhook).

**Example request**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/product-import/create-with-products' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ...' \
  --data '{
    "shop_id": "32216bdd-28c6-4fd4-923a-4e9dd8a9263f",
    "products": [
      {
        "id": "",
        "name": "Nike Air Force 1",
        "barcode": "20000003143",
        "sku": "NK-AF1-D23",
        "description": "Nike Air Force 1. Classical Shoes",
        "measurement_value": 1,
        "retail_price": 20,
        "supply_price": 10,
        "wholesale_price": 15,
        "measurement_unit_id": "2e77e0b3-f173-4f77-b39a-5ec7f36c501a",
        "category_ids": ["f31da3e2-cded-478f-abb3-8b6d72c43653"],
        "brand_id": "3a862e16-9e10-4850-9fd1-abe28c2a19b9",
        "supplier_id": "cf2bf476-2215-4d19-be78-e36ba9610408",
        "product_custom_fields": [
          {
            "product_characteristic_id": "4a8b56ca-4fea-4454-8171-72226873665b",
            "value": "Black"
          }
        ]
      }
    ]
  }'
```

**Body parameters**

| Field | Description |
| --- | --- |
| shop_id | Shop ID |
| products[].id | Product ID (pass for existing products, leave empty for new) |
| products[].name | Product name |
| products[].barcode | Barcode |
| products[].sku | SKU |
| products[].description | Description |
| products[].measurement_value | Import quantity |
| products[].retail_price | Retail price (replaces current shop price if different) |
| products[].supply_price | Supply price |
| products[].wholesale_price | Wholesale price |
| products[].measurement_unit_id | Measurement unit ID |
| products[].category_ids | Category IDs |
| products[].brand_id | Brand ID |
| products[].supplier_id | Supplier ID |
| products[].product_custom_fields | Custom field values |

**Webhook response**

When the operation completes, the webhook receives the full object with the original `correlation_id`. Check `status_code === 200` for success.

---

## List Imports {#list}

### GET /v2/import

Returns the list of imports for the shop.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/import?limit=10&page=1' \
  -H 'Authorization: Bearer ...'
```

**Query parameters**

| Parameter | Description |
| --- | --- |
| limit | Max items per page |
| page | Page number |
| shops | Comma-separated shop IDs |
| start_date | Start date |
| end_date | End date |

---

## Create Single Product {#create-product}

### POST /v2/product

Creates a product on the fly without an explicit import.

> **Note:** This method uses WebSocket by default. Use the `Billz-Response-Channel: HTTP` header for an immediate synchronous response.

**Required fields**

- `barcode`
- `sku`
- `name`
- `product_type_id`
- `measurement_unit_id`
- `company_id`
- `shipments[]` — stock array with quantity per shop
- `shop_prices[]` — price array for all shops

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/product?Billz-Response-Channel=HTTP' \
  -X POST \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "barcode": "24409390003634",
    "company_id": "17a36439-d140-454d-aedb-ae1585681db1",
    "measurement_unit_id": "c5336f71-d684-4e2e-b5bc-307138593543",
    "name": "New Product",
    "product_type_id": "69e939aa-9b8f-46a9-b605-8b2675475b7b",
    "retail_price": 11000,
    "shipments": [
      {
        "has_trigger": false,
        "measurement_value": 1,
        "shop_id": "6f244db4-75d6-4fac-9841-14867d45e36a",
        "small_left_measurement_value": 0,
        "total_measurement_value": 1
      }
    ],
    "shop_prices": [
      {
        "shop_id": "6f244db4-75d6-4fac-9841-14867d45e36a",
        "retail_price": 11000,
        "supply_price": 1,
        "wholesale_price": 0,
        "min_price": 0,
        "max_price": 0
      }
    ],
    "sku": "JSI-62299",
    "supplier_ids": [],
    "supply_price": 1
  }'
```

**Response**

Returns the full product object wrapped in the standard response envelope (`session_id`, `status_code`, `id`, `error`, `data`).
