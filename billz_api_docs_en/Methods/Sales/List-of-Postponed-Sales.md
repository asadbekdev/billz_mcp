# List of Postponed Sales

Postponed sales are incomplete sales that **lock** the selected product stock — the items cannot be sold in other transactions until the hold is released.

Retrieve and filter the list using `GET /v2/order-notes`.

If you only have a sale ID, customer, or user ID, use the `search` parameter.

**Query Parameters**

| Parameter | Description |
| --- | --- |
| limit | Records per page |
| page | Page number |
| start_date | Postponed sales created from date |
| end_date | Postponed sales created to date |
| client | Customer identifier |
| search | Search query |
| future_time_is_null | Indicator whether future time is empty |
| order_park_status | Order park status (`active`, `expired`, `completed`) |
| shop_id | Shop identifier |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order-notes?limit=5&page=1&client=&future_time_is_null=false&order_park_status=active%2Cexpired&shop_id=803b542d-51e5-41ea-9124-51f248536286' \
  -H 'Authorization: Bearer ...'
```

**Response Model**

| Field | Description |
| --- | --- |
| count | Total record count |
| orders[].id | Sale identifier |
| orders[].parent_id | Parent sale identifier (for returns) |
| orders[].company_id | Company identifier |
| orders[].order_number | Sale number |
| orders[].order_status | Sale status |
| orders[].order_detail.customer.id | Customer identifier |
| orders[].order_detail.customer.name | Customer name |
| orders[].order_detail.user.id | Cashier identifier |
| orders[].order_detail.user.name | Cashier name |
| orders[].order_detail.cashbox_name | Cashbox name |
| orders[].order_detail.shop_id | Shop identifier |
| orders[].order_detail.shop.name | Shop name |
| orders[].order_detail.total_price | Total sale price |
| orders[].order_detail.has_discount | Discount present indicator |
| orders[].order_detail.comment | Sale comment |
| orders[].order_detail.with_cashback | Cashback amount |
| orders[].order_detail.loyalty_payment | Loyalty payment |
| orders[].order_detail.gift_card_payment | Gift card payment |
| orders[].order_detail.is_authorized | Authorization indicator |
| orders[].order_detail.has_certificate | Certificate present indicator |
| orders[].order_detail.has_voucher | Voucher present indicator |
| orders[].order_type | Sale type |
| orders[].created_at | Sale creation date |
| orders[].created_at_utc | Sale creation date in UTC |
| orders[].future_time | Future scheduled time (for postponed sales) |
| orders[].debt | Sale debt |
| orders[].customer_id | Customer identifier |
| orders[].finished_at | Actual completion date |
| orders[].sold_at | Sale date (editable) |
| orders[].display_sold_at | Display sale date |
| orders[].order_debt_payments | Debt payments |
| orders[].park_status | Postponed sale status |
| orders[].exchange_disabled | Exchange disabled indicator |
| orders[].total_remaining_debt_in_chain | Total remaining debt |
| orders[].updated_at | Sale update date |

**Example response**

```json
{
  "count": 2,
  "orders": [
    {
      "id": "e4c86736-d680-4dd2-b88a-84901798076e",
      "order_number": "901344",
      "order_detail": {
        "cashbox_name": "Cashbox vadim-test-2",
        "shop": { "name": "Store vadim-test-2" },
        "total_price": 15000,
        "has_discount": false
      },
      "order_type": "SALE",
      "future_time": "2024-11-15 23:59:59",
      "park_status": "expired",
      "exchange_disabled": false,
      "total_remaining_debt_in_chain": 0
    }
  ]
}
```
