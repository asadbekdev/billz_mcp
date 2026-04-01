# Transfer Items

### GET /v2/transfer-items/:id

Returns the list of products in a transfer.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/transfer-items/:id?limit=5&page=1' \
  -H 'authorization: Bearer ...'
```

**Response Fields**

| Field | Description |
| --- | --- |
| items[].id | Item identifier |
| items[].transfer_id | Transfer identifier |
| items[].product_id | Product identifier |
| items[].transfer_measurement_value | Transfer quantity |
| items[].updated_at | Item update date |
| items[].product.id | Product identifier |
| items[].product.parent_id | Parent product identifier |
| items[].product.company_id | Company identifier |
| items[].product.name | Product name |
| items[].product.sku | Product SKU |
| items[].product.barcode | Product barcode |
| items[].product.category_name | Product category name |
| items[].product.departure_shop_measurement_value.shop_id | Departure shop identifier |
| items[].product.departure_shop_measurement_value.total_measurement_value | Total stock in departure shop |
| items[].product.departure_shop_measurement_value.total_active_measurement_value | Active stock in departure shop |
| items[].product.departure_shop_measurement_value.total_supply_sum | Total supply value in departure shop |
| items[].product.departure_shop_measurement_value.total_retail_sum | Total retail value in departure shop |
| items[].product.arrival_shop_measurement_values.shop_id | Arrival shop identifier |
| items[].product.arrival_shop_measurement_values.total_measurement_value | Total stock in arrival shop |
| items[].product.arrival_shop_measurement_values.total_active_measurement_value | Active stock in arrival shop |
| items[].product.departure_shop_retail_price | Retail price in departure shop |
| items[].product.arrival_shop_retail_price | Retail price in arrival shop |
| items[].product.measurement_values.total_measurement_value | Total stock across all shops |
| items[].product.supply_price | Supply price |
| items[].product.measurement_unit.id | Unit of measurement ID |
| items[].product.measurement_unit.name | Unit of measurement name |
| items[].product.measurement_unit.short_name | Unit of measurement short name |
| items[].product.base_name | Product base name |
| items[].arrived_measurement_value | Arrived quantity |
| items[].product_info | Full product info object (same structure as product) |
| count | Total item count |
| total_measurement_value | Total product quantity |
| total_transfer_value | Total transfer quantity |
| total_supply_price | Total supply price |
| total_retail_price | Total retail price |
| fields[].name | Column field name |
| fields[].sequence_number | Column order |
| fields[].is_active | Column active indicator |
| fields[].is_attribute | Attribute indicator |
| fields[].is_custom_field | Custom field indicator |
| stocktaking_id | Stocktaking identifier |

**Example response**

```json
{
  "items": [
    {
      "id": "83b9dfe5-4aab-46ec-94c2-c84c24072643",
      "transfer_id": "b9e68ec4-25ae-4255-8c0a-4af56358c5a4",
      "product_id": "31a4c573-6a24-499e-9201-fab51d343d63",
      "transfer_measurement_value": 1,
      "updated_at": "2024-09-26",
      "product": {
        "id": "31a4c573-6a24-499e-9201-fab51d343d63",
        "name": "12121",
        "sku": "PTH-23617",
        "barcode": "2000000003528",
        "departure_shop_retail_price": 14000,
        "arrival_shop_retail_price": 13000,
        "measurement_unit": {
          "id": "c5336f71-d684-4e2e-b5bc-307138593543",
          "name": "Piece",
          "short_name": "pcs",
          "precision": "1"
        }
      },
      "arrived_measurement_value": 0
    }
  ],
  "count": 2,
  "total_measurement_value": 1122,
  "total_transfer_value": 11,
  "total_supply_price": 0,
  "total_retail_price": 0
}
```
