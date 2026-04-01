# Drafts & Postponed Sales

---

## Remove Item from Draft / Postponed {#remove-item}

Because a postponed sale locks items, you must first convert the postponed sale into a draft (i.e., cancel the postpone) before removing a product.

To remove a product, pass `0` in the `measurement_value` field.

> ⚠️ **Method**: `PUT /v1/order-item/:id`

**JSON Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| product_id | string | UUID of the product to remove |
| measurement_value | number | New quantity. `0` to delete |
| customer_id | uuid | Customer UUID, if attached to the sale |
| use_wholesale_price | boolean | Wholesale price flag. Default: `false` |
| sellers[].seller_id | array | Array of seller UUIDs associated with the item |

**Example JSON**

```json
{
  "customer_id": "622c8993-9f82-45ae-a69d-63103d8506d5",
  "measurement_value": 0,
  "product_id": "31a4c573-6a24-499e-9201-fab51d343d63",
  "sellers": [
    { "seller_id": "90219ac7-88b7-43f6-bed9-5c6761aefa71" }
  ],
  "use_wholesale_price": false
}
```

**Example curl**

```bash
curl -X 'PUT' \
  'https://api-admin.billz.ai/v1/order-item/571caab5-20ad-4bfa-bdcc-5c1ae785d3e1' \
  --data-raw '{"customer_id":"622c8993-9f82-45ae-a69d-63103d8506d5","measurement_value":0,"product_id":"31a4c573-6a24-499e-9201-fab51d343d63","sellers":[{"seller_id":"90219ac7-88b7-43f6-bed9-5c6761aefa71"}],"use_wholesale_price":false}'
```

---

## Delete Draft {#delete-draft}

> ⚠️ **Method**: `DELETE /v2/order/:id`

```bash
curl 'https://api-admin.billz.ai/v2/order/eed7e505-df8d-43e9-a6d5-34e497bd8632' \
  -X 'DELETE' \
  -H 'Authorization: Bearer ..'
```

The response returns the ID of the accepted message, which can be ignored.

---

## Cancel Postponed Sale {#cancel-postponed}

Cancelling a postponed sale converts it into a draft. To fully delete it afterward, use the **Delete Draft** method.

After cancellation, the items are returned to active status and become available for sale.

> ⚠️ **Method**: `POST /v2/order/return-postpone`

**JSON Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| order_id | string | UUID of the postponed sale to cancel |

**Example JSON**

```json
{
  "order_id": "e4c86736-d680-4dd2-b88a-84901798076e"
}
```

**Example curl**

```bash
curl 'https://api-admin.billz.ai/v2/order/return-postpone' \
  -X 'POST' \
  -H 'Authorization: Bearer ..' \
  --data-raw '{"order_id":"e4c86736-d680-4dd2-b88a-84901798076e"}'
```

The response returns the ID of the accepted message, which can be ignored.
