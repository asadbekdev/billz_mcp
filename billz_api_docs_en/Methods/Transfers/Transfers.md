# Transfers

Methods for managing product transfers between shops.

---

## Process Methods

- [List Transfers](#list)
- [Create Transfer](#create)
- [Send Transfer](#send)
- [Update Transfer](#update)

## Product Methods

- [Add Product](#add-product)
- [Cancel Transfer](#cancel)
- [Accept Transfer](#accept)
- [Transfer Statuses](#statuses)

---

### List Transfers {#list}

**GET /v2/transfer**

**Filter parameters**

| Parameter | Description |
| --- | --- |
| limit | Max items per page |
| page | Page number |
| departure_shops | Sending shop IDs |
| arrival_shops | Receiving shop IDs |
| start_date | Transfer dispatch start date |
| end_date | Transfer dispatch end date |
| arrival_date_start | Transfer receipt start date |
| arrival_date_end | Transfer receipt end date |
| status_ids | Transfer status IDs |

**Example request**

```bash
curl -X GET \
  'https://api-admin.billz.ai/v2/transfer?start_date=2024-11-18%2000%3A00%3A00&departure_shops=6f244db4-75d6-4fac-9841-14867d45e36a&arrival_shops=70919136-9481-4c7e-8581-685d750d67a9&limit=10&page=1&status_ids=65af5e85-252c-43be-8364-8c593c87c9e8' \
  -H 'Authorization: Bearer ...'
```

---

### Create Transfer {#create}

**POST /v2/transfer**

**Body parameters**

| Parameter | Description |
| --- | --- |
| departure_shop_id | Sending shop ID |
| arrival_shop_id | Receiving shop ID |
| name | Transfer name |

Use the [Shops](../Auxiliary/Auxiliary-Methods.md#shops) method to get shop IDs.

**Example request**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/transfer' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...' \
  -d '{
    "arrival_shop_id": "92302dfb-fa33-4e6a-8d19-87214852b25d",
    "departure_shop_id": "fbfb9d6c-cbb2-43ab-8c90-e97d2eeb34d6",
    "name": "Transfer 2023.05.17 14:47"
  }'
```

---

### Add Product {#add-product}

**POST /v2/transfer/:transfer_id/add**

**Body parameters**

| Parameter | Description |
| --- | --- |
| departure_shop_id | Sending shop ID |
| arrival_shop_id | Receiving shop ID |
| product_id | Product ID |
| transfer_measurement_value | Quantity to transfer (overwrites previous value if called again) |
| is_scan | Whether added via scanner |

**Example request**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/transfer/:transfer_id/add' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...' \
  -d '{
    "arrival_shop_id": "92302dfb-fa33-4e6a-8d19-87214852b25d",
    "departure_shop_id": "fbfb9d6c-cbb2-43ab-8c90-e97d2eeb34d6",
    "product_id": "e5669ce0-3bb9-4330-b139-814843b6709f",
    "transfer_measurement_value": 1,
    "is_scan": false
  }'
```

---

### Send Transfer {#send}

**POST /v2/transfer/:transfer_id/send**

Dispatches the transfer from the sending shop.

```bash
curl -X POST 'https://api-admin.billz.ai/v2/transfer/:transfer_id/send' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...'
```

---

### Cancel Transfer {#cancel}

**DELETE /v2/transfer/:transfer_id**

```bash
curl -X DELETE 'https://api-admin.billz.ai/v2/transfer/:transfer_id' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...'
```

---

### Accept Transfer {#accept}

**PUT /v2/transfer/finish/:transfer_id**

Completes the transfer in the receiving shop.

**Body parameters**

| Parameter | Description |
| --- | --- |
| use_departure_price | Use sending shop's price (`true`/`false`) |

```bash
curl -X PUT 'https://api-admin.billz.ai/v2/transfer/finish/:transfer_id' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...' \
  -d '{ "use_departure_price": false }'
```

---

### Update Transfer {#update}

**PUT /v2/transfer/update/:transfer_id**

Use only to rename the transfer. Changing shops should only be done if you understand the consequences.

```bash
curl -X PUT 'https://api-admin.billz.ai/v2/transfer/update/:transfer_id' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  -H 'Authorization: Bearer ...' \
  -d '{
    "departure_shop_id": "70919136-9481-4c7e-8581-685d750d67a9",
    "arrival_shop_id": "6f244db4-75d6-4fac-9841-14867d45e36a",
    "name": "New Transfer Name"
  }'
```

---

### Transfer Statuses {#statuses}

| Status | ID |
| --- | --- |
| New | `65af5e85-252c-43be-8364-8c593c87c9e8` |
| Pending | `7cbb2295-559e-4b72-a3c1-11ac24dffc6b` |
| Completed | `31cd30a7-46ae-460c-9530-7c2df1356b62` |
| Cancelled | `f4c1e781-bc72-4700-83bc-03fa175d94fb` |
