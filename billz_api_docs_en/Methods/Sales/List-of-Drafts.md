# List of Drafts

Drafts are incomplete sales. Items in drafts are **not locked** and can be sold in other transactions.

Retrieve and filter the list using `GET /v2/order-notes`.

If you only have a sale ID, customer, or user ID, use the `search` parameter.

**Query Parameters**

| Parameter | Description |
| --- | --- |
| limit | Records per page |
| page | Page number |
| start_date | Drafts created from date |
| end_date | Drafts created to date |
| client | Customer identifier |
| search | Search query |
| future_time_is_null | Indicator whether future time is empty |
| order_park_status | Order park status (`active`, `expired`, `completed`) |
| shop_id | Shop identifier |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order-notes?limit=5&page=1&client=&shop_id=803b542d-51e5-41ea-9124-51f248536286' \
  -H 'Authorization: Bearer ...'
```

**Response Fields**

| Field | Description |
| --- | --- |
| count | Total record count |
| orders[].id | Sale identifier |
| orders[].parent_id | Parent sale identifier (for returns) |
| orders[].order_number | Sale number |
| orders[].order_status | Sale status |
| orders[].order_detail.customer.id | Customer identifier |
| orders[].order_detail.user.id | Cashier identifier |
| orders[].order_detail.cashbox_name | Cashbox name |
| orders[].order_detail.shop.name | Shop name |
| orders[].order_detail.total_price | Total price |
| orders[].order_detail.has_discount | Discount present |
| orders[].order_detail.comment | Comment |
| orders[].order_detail.with_cashback | Cashback amount |
| orders[].order_detail.loyalty_payment | Loyalty payment |
| orders[].order_type | Sale type |
| orders[].created_at | Creation date |
| orders[].future_time | Future time (for postponed) |
| orders[].debt | Sale debt |
| orders[].park_status | Park status |
| orders[].updated_at | Update date |

**Example response**

```json
{
  "count": 2,
  "orders": [
    {
      "id": "5fffc042-afe5-48bf-8203-eb72b27500da",
      "order_number": "213945",
      "order_detail": {
        "cashbox_name": "Cashbox vadim-test-2",
        "shop": { "name": "Store vadim-test-2" },
        "total_price": 254100,
        "has_discount": true,
        "total_products_measurement_value": 3
      },
      "order_type": "SALE",
      "future_time": "",
      "park_status": "",
      "exchange_disabled": false
    }
  ]
}
```
