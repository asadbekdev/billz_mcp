# Promotions

---

## List of Promotions {#list-promotions}

### GET /v1/promo

Returns the list of available promotions. Supports search by `external_id`, promotion name, and shop name.

**Query parameters**

| Name | Type | Description |
| --- | --- | --- |
| limit | int | Items per page. Default: 100 |
| page | int | Page number |
| search | string | Search string: external_id, name, or shop |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/promo?limit=10&page=1' \
  -H 'Authorization: Bearer ..' \
  -H 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01'
```

**Response fields**

| Field | Type | Description |
| --- | --- | --- |
| promos[].id | string | Promotion UUID |
| promos[].code | string | Promotion code (empty if not set) |
| promos[].company_id | string | Company ID |
| promos[].name | string | Promotion name |
| promos[].type_id | string | Promotion type ID |
| promos[].type_name | string | Promotion type name (e.g., `PERCENTAGE`) |
| promos[].status_id | string | Status ID |
| promos[].status_name | string | Status name (e.g., `DRAFT`) |
| promos[].start_date | string | Start date/time (`YYYY-MM-DD HH:MM`) |
| promos[].end_date | string | End date/time (`YYYY-MM-DD HH:MM`) |
| promos[].shop_ids | []string | Shop IDs where promotion is active |
| promos[].external_id | int | External ID |
| promos[].percentage.Int64 | int | Discount percentage |
| promos[].shop_names | []string | Shop names |
| promos[].works_on_retail_price | bool | Applies to retail price |
| promos[].works_on_free_price | bool | Applies to free price |
| promos[].works_on_wholesale_price | bool | Applies to wholesale price |
| total | int | Total count |
| total_active | int | Active count |
| total_not_active | int | Inactive count |
| total_planning | int | Planned count |

**Example response**

```json
{
    "promos": [
        {
            "id": "d4a58708-c1ed-40f7-ab54-e47bf9cb6422",
            "code": "",
            "name": "wwwew",
            "type_name": "PERCENTAGE",
            "status_name": "DRAFT",
            "start_date": "2024-09-30 08:00",
            "end_date": "2024-10-04 18:00",
            "shop_ids": ["6f244db4-75d6-4fac-9841-14867d45e36a"],
            "external_id": 477190,
            "percentage": { "Int64": 10, "Valid": true },
            "works_on_retail_price": true,
            "works_on_free_price": false,
            "works_on_wholesale_price": false
        }
    ],
    "total": 1,
    "total_active": 0,
    "total_not_active": 1,
    "total_planning": 0
}
```

---

## Promotion Details {#promotion-details}

### GET /v1/promo/:id

Returns the full details of a single promotion.

**Path parameters**

| Name | Type | Description |
| --- | --- | --- |
| id | string | Promotion UUID |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/promo/fc3140ba-825d-4c2d-a579-6dc29f7c7e85' \
  -H 'Authorization: Bearer ..' \
  -H 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01'
```

**Response fields** (key fields)

| Field | Description |
| --- | --- |
| id | Promotion UUID |
| name | Promotion name |
| type_id / status_id | Type and status IDs |
| start_date / end_date | Date range (ISO 8601) |
| shop_ids | Active shop IDs |
| percentage | Discount percentage |
| work_with_others | Can combine with other promotions |
| works_on_retail_price | Applies to retail price |
| works_on_free_price | Applies to free price |
| works_on_wholesale_price | Applies to wholesale price |
| apply_type | Application type (e.g., `auto`) |
| by_products | Applies per product |
| by_groups | Applies per group |

---

## Products in Promotion {#promotion-products}

### GET /v1/promo/:id/products

Returns the list of products in a promotion.

**Query parameters**

| Name | Type | Description |
| --- | --- | --- |
| limit | int | Items per page. Default: 100 |
| page | int | Page number |
| type | string | Operation type on products: `added` |
| in_sale | bool | Only active products: `true` or `false` |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/promo/fc3140ba-825d-4c2d-a579-6dc29f7c7e85/products?type=added&in_sale=true&page=1&limit=5' \
  -H 'Authorization: Bearer ..' \
  -H 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01'
```

**Response** includes `products[]`, `count`, `statistics`, and `statistics_by_status`.

Key product fields:

| Field | Description |
| --- | --- |
| id | Product UUID |
| name | Product name |
| sku | SKU |
| barcode | Barcode |
| retail_price | Retail price |
| supply_price | Supply price |
| measurement_values | Stock quantities |
| shop_measurement_values | Per-shop stock |
| shop_prices | Per-shop prices |
| is_added_to_promo | Whether product is in the promotion |
| fixed_price | Fixed price (0 if not set) |
