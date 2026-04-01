# List of Sales

### GET /v3/order-search

Retrieve and filter the list of sales. If you only have a sale ID, customer, or user, use the `search` parameter.

**Query Parameters**

| Parameter | Description |
| --- | --- |
| search | Search by sale ID, customer, or user |
| company_payment_type_ids | Payment type IDs (comma-separated) |
| start_date | Sale completed from date |
| end_date | Sale completed to date |
| limit | Records per page |
| page | Page number |
| seller_id | Seller ID |
| shop_ids | Shop IDs (comma-separated) |
| start_total_price | Minimum receipt amount |
| end_total_price | Maximum receipt amount |
| user_id | Cashier ID |
| cashbox_id | Cashbox ID list |
| shift_id | Shift ID list |

**Example request**

```bash
curl -X 'GET' \
  'https://api-admin.billz.ai/v3/order-search?company_payment_type_ids=c6e84d9b-0ef0-4d5a-886d-147c74a9b051&start_date=2024-12-01&end_date=2024-12-31&limit=10&page=1&shop_ids=6f244db4-75d6-4fac-9841-14867d45e36a' \
  -H 'Authorization: Bearer ...'
```

**Response Model**

The response contains a list of sales grouped by date.

| Field | Description |
| --- | --- |
| count | Total record count |
| orders_sorted_by_date_list[] | List of sale dates |
| orders_sorted_by_date_list[].date | Sale date |
| orders_sorted_by_date_list[].orders[] | List of sales for that date |
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
| orders[].order_detail.shift_id | Shift identifier |
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
| orders[].future_time | Future scheduled time (for postponed) |
| orders[].debt | Sale debt |
| orders[].customer_id | Customer identifier |
| orders[].finished_at | Actual completion date |
| orders[].sold_at | Sale date (editable) |
| orders[].display_sold_at | Display sale date |
| orders[].park_status | Postponed status |
| orders[].updated_at | Sale update date |

**Example response**

```json
{
  "count": 2,
  "orders_sorted_by_date_list": [
    {
      "date": "2024-12-31",
      "orders": [
        {
          "id": "5143d881-9ac2-4c83-b494-8b4b67fc50e4",
          "order_number": "2089635259",
          "order_detail": {
            "user": { "id": "90219ac7-88b7-43f6-bed9-5c6761aefa71", "name": "v z" },
            "cashbox_name": "Cashbox vadim-test-2",
            "shop": { "name": "Store vadim-test-2" },
            "total_price": 285000,
            "has_discount": false
          },
          "order_type": "SALE",
          "finished_at": "2024-12-30T21:39:26.089332Z",
          "sold_at": "2024-12-30T21:39:26Z",
          "display_sold_at": "2024-12-31 02:39:26"
        }
      ]
    }
  ]
}
```
