# Sale Details

### GET /v2/order/:id

Retrieve the details of a single sale, for example to work with the list of items in a completed transaction's cart.

**Input Parameters**

Only the UUID of the sale, exchange, or draft is required.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order/:id' \
  -H 'Authorization: Bearer ...'
```

**Response Model**

| Field | Description |
| --- | --- |
| id | Unique order identifier |
| parent_id | Parent order identifier |
| company_id | Company identifier |
| order_number | Order number |
| order_status | Order status |
| order_detail.id | Order detail identifier |
| order_detail.order_id | Order identifier |
| order_detail.customer.customer_type | Customer type |
| order_detail.user_id | ID of the user who placed the order |
| order_detail.user.id | User identifier |
| order_detail.user.name | User name |
| order_detail.user.first_name | User first name |
| order_detail.user.last_name | User last name |
| order_detail.cashbox_name | Cashbox name |
| order_detail.cashbox_id | Cashbox identifier |
| order_detail.cashbox_history_id | Cashbox history identifier |
| order_detail.shift_id | Shift identifier |
| order_detail.shop_id | Shop identifier |
| order_detail.shop.id | Shop identifier (inside "shop" object) |
| order_detail.shop.name | Shop name |
| order_detail.total_price | Total order price |
| order_detail.has_discount | Discount present indicator |
| order_detail.total_products_measurement_value | Total quantity of products in the order |
| order_detail.total_sets_measurement_value | Total quantity of sets in the order |
| order_detail.total_services_measurement_value | Total quantity of services in the order |
| order_detail.total_returned_measurement_value | Total quantity of returned items in the order |
| order_detail.version_number | Order version |
| order_detail.comment | Order comment |
| order_detail.created_at | Order creation date |
| order_detail.created_at_utc | Order creation date in UTC |
| order_detail.order_items[].id | Order item identifier |
| order_detail.order_items[].sellers[].seller_id | Seller identifier |
| order_detail.order_items[].sellers[].seller.name | Seller name |
| order_detail.order_items[].product.id | Product identifier |
| order_detail.order_items[].product.name | Product name |
| order_detail.order_items[].product.base_name | Product base name |
| order_detail.order_items[].product.barcode | Product barcode |
| order_detail.order_items[].product.sku | Product SKU |
| order_detail.order_items[].product.category_name | Product category name |
| order_detail.order_items[].product.brand_name | Product brand name |
| order_detail.order_items[].product.retail_price | Product retail price |
| order_detail.order_items[].product.supply_price | Product supply price |
| order_detail.order_items[].product.measurement_unit | Product unit of measurement |
| order_detail.order_items[].retail_price | Item retail price |
| order_detail.order_items[].supply_price | Item supply price |
| order_detail.order_items[].total_price | Item total price |
| order_detail.order_items[].sale_price | Item sale price |
| order_detail.order_items[].discount_value | Discount value |
| order_detail.order_items[].discount_unit | Discount unit |
| order_detail.order_items[].discount_amount | Discount amount |
| order_detail.order_items[].discount_percent | Discount percentage |
| order_detail.order_items[].measurement_value | Item quantity |
| order_detail.order_items[].returned_measurement_value | Returned quantity |
| order_detail.order_items[].is_returned | Returned indicator |
| order_detail.order_items[].promo_id | Promotion identifier |
| order_detail.order_payments[].id | Payment identifier |
| order_detail.order_payments[].company_payment_type.name | Payment type name |
| order_detail.order_payments[].paid_amount | Amount paid |
| order_detail.order_payments[].returned_amount | Amount returned |
| order_detail.order_payments[].is_certificate | Certificate indicator |
| order_detail.order_payments[].is_voucher | Voucher indicator |
| order_detail.with_cashback | Cashback indicator |
| order_detail.loyalty_balance_income | Loyalty balance income |
| order_detail.loyalty_balance_outcome | Loyalty balance outcome |
| order_detail.loyalty_payment | Loyalty payment amount |
| order_detail.gift_card_payment | Gift card payment amount |
| order_type | Order type |
| created_at | Order creation date |
| created_at_utc | Order creation date in UTC |
| debt | Order debt |
| customer_id | Customer identifier |
| finished_at | Order completion date |
| sold_at | Sale date |
| display_sold_at | Display sale date |
| park_status | Postponed status |
| updated_at | Order update date |
| has_insurance | Insurance indicator |

**Example response**

```json
{
  "id": "e44e0ee4-ac8e-4ee0-b328-c8d54ff1b01a",
  "parent_id": "",
  "company_id": "17a36439-d140-454d-aedb-ae1585681db1",
  "order_number": "9606628401",
  "order_status": "ef61ab2b-76c9-4b18-85a3-ba25a1f3defb",
  "order_detail": {
    "id": "ecfa9e86-359d-4586-9a2a-a47a07bf934d",
    "customer": { "customer_type": "new" },
    "user": { "id": "90219ac7-88b7-43f6-bed9-5c6761aefa71", "name": "v z" },
    "cashbox_name": "Cashbox vadim-test-2",
    "shop": { "id": "803b542d-51e5-41ea-9124-51f248536286", "name": "Store vadim-test-2" },
    "total_price": 15000,
    "has_discount": false,
    "order_items": [
      {
        "id": "dc0b1564-03b7-4492-a155-6c7a3a88eab9",
        "product": {
          "id": "31a4c573-6a24-499e-9201-fab51d343d63",
          "name": "12121",
          "barcode": "2000000003528",
          "sku": "PTH-23617"
        },
        "total_price": 15000,
        "sale_price": 15000,
        "measurement_value": 1,
        "is_returned": false
      }
    ],
    "order_payments": [
      {
        "id": "cb90f9e2-56bf-4458-abd5-e426c86c4c31",
        "company_payment_type": {
          "name": "Cash",
          "payment_type_id": "00ed9cff-9576-432f-849b-7bbcc2fed640"
        },
        "paid_amount": 15000,
        "returned_amount": 0
      }
    ]
  },
  "order_type": "SALE",
  "created_at": "2025-02-24 00:35:22",
  "created_at_utc": "2025-02-23 19:35:22",
  "finished_at": "2025-02-23T19:35:32.630567Z",
  "sold_at": "2025-02-23T19:35:32Z",
  "display_sold_at": "2025-02-24 00:35:32",
  "updated_at": "2025-02-24 00:35:32",
  "has_insurance": false,
  "insurance": null
}
```
