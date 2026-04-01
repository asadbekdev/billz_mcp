# Get Products

### GET /v2/products

Returns a list of products. If `last_updated_date` is provided, only products modified after that date are returned (in **UTC**). The optional `page` and `limit` parameters support pagination.

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| limit | int | Items per page. Default: 100 |
| page | int | Page number |
| last_updated_date | string | Last sync time. Format: `2022-05-14 00:00:00` (UTC) |
| search | string | Search string |

> ⚠️ **Note:** The `last_updated_date` parameter accepts date and time in **UTC**.

**Example request**

```bash
curl -X 'GET' \
  'https://api-admin.billz.ai/v2/products?limit=5&search=Nike' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ..'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| count | int | Total number of products |
| products | []object | List of products |
| products[].id | uuid | Product ID |
| products[].name | string | Product name |
| products[].sku | string | SKU |
| products[].barcode | string | Barcode |
| products[].retail_price | float | Retail price |
| products[].supply_price | float | Supply price |
| products[].wholesale_price | float | Wholesale price |
| products[].measurement_unit | object | Unit of measurement |
| products[].shop_measurement_values | []object | Stock per shop |
| products[].shop_prices | []object | Prices per shop |
| products[].categories | []object | Product categories |
| products[].brand_id | uuid | Brand ID |
| products[].brand_name | string | Brand name |
| products[].category_id | uuid | Primary category ID |
| products[].category_name | string | Primary category name |
| products[].custom_fields | []object | Custom product fields |
| products[].updated_at | string | Last updated timestamp |
