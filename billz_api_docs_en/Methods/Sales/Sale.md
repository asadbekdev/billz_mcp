# Sale

> ⚠️ **Experimental section.** Currently implemented via JSON-RPC. Include the header `Billz-Response-Channel: HTTP` to receive responses synchronously.

---

## Create New Sale {#create-sale}

### POST /v2/order

Creates a new sale in **draft** status for the specified shop (`shop_id`) and cashbox.

The list of available cashboxes can be found in [Auxiliary Methods](../Auxiliary/Auxiliary-Methods.md).

**Example request**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/order?Billz-Response-Channel=HTTP' \
  --header 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer ...'
```

**Example response**

The response includes the new sale UUID and the order number displayed in the BILLZ UI.

```json
{
  "session_id": "fd8d352a-6299-4489-8a6e-a5c037f3f65b",
  "status_code": 200,
  "id": "38c3920a-ffdd-4233-a823-8af3266f5f4f",
  "error": { "code": "", "message": "" },
  "data": {
    "id": "38c3920a-ffdd-4233-a823-8af3266f5f4f",
    "order_number": "5632631379",
    "order_type": "SALE"
  },
  "correlation_id": "3674f28e-7b96-4683-87c3-80892698f421",
  "topic": "v2.order_service.order.created"
}
```

---

## Add Product {#add-product}

### POST /v2/order-product/:order_id

Once the draft is created, add products to it. Supports one product at a time.

Pass `product_id` and quantity in `sold_measurement_value`. Set `use_wholesale_price: true` to use the wholesale price. Products can be tied to one or more sellers.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order-product/:order_id?Billz-Response-Channel=HTTP' \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "sold_measurement_value": 1,
    "product_id": "2ce40c63-4527-4898-a975-7c30c255fd50",
    "used_wholesale_price": false,
    "is_manual": false,
    "seller_ids": ["90219ac7-88b7-43f6-bed9-5c6761aefa71"],
    "response_type": "HTTP"
  }'
```

### Free-Price Sale

For shops with free-price enabled products, use the combination of `use_free_price` and `is_manual`:

```json
{
  "sold_measurement_value": 1,
  "product_id": "1b5e3f0d-ad00-44e5-981a-2c88af848ba3",
  "used_wholesale_price": false,
  "use_free_price": true,
  "free_price": 35000,
  "is_manual": true,
  "seller_ids": ["aade9196-0eb4-4511-80c1-085c746a30f3"],
  "response_type": "HTTP"
}
```

---

## Discounts {#discounts}

### POST /v2/order-manual-discount/:id

Apply a manual discount to all items in the cart, or to a specific product via `product_id`.

**Parameters**

| Field | Description | Note |
| --- | --- | --- |
| discount_unit | Discount type | `PERCENTAGE` or `CURRENCY` |
| discount_value | Discount value | |
| product_id | Product to apply discount to | Optional |

**Example — 20% discount:**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/order-manual-discount/:id?Billz-Response-Channel=HTTP' \
  --header 'Authorization: Bearer ….' \
  --data '{
    "discount_unit": "PERCENTAGE",
    "discount_value": 20,
    "product_id": "31a4c573-6a24-499e-9201-fab51d343d63"
  }'
```

**Example — Set new price (CURRENCY discount):**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/order-manual-discount/:id?Billz-Response-Channel=HTTP' \
  --header 'Authorization: Bearer ….' \
  --data '{
    "discount_unit": "CURRENCY",
    "discount_value": 10000,
    "product_id": "6403481a-b146-4a3f-a02c-b463fa3b2e88"
  }'
```

---

## Attach Customer {#attach-customer}

### PUT /v2/order-customer-new/:order_id

After creating the draft with products, attach a customer using `customer_id`.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order-customer-new/:order_id?Billz-Response-Channel=HTTP' \
  -X 'PUT' \
  -H 'Authorization: Bearer ..' \
  --data-raw '{
    "customer_id": "622c8993-9f82-45ae-a69d-63103d8506d5",
    "check_auth_code": false
  }'
```

---

## Complete Sale {#complete-sale}

### POST /v2/order-payment/:id

Complete a ready draft as a sale. Pass the payment type ID in `company_payment_type_id` and the amount in `paid_amount`.

The list of payment methods is available via `GET /v1/company-payment-type`.

**Parameters**

| Field | Description |
| --- | --- |
| payments | Array of payment types |
| payments[].company_payment_type_id | Payment type ID |
| payments[].paid_amount | Amount paid |
| comment | Optional sale comment |
| with_cashback | Cashback amount |
| without_cashback | Disable cashback flag |

**Example request**

```bash
curl --request POST \
  --url 'https://api-admin.billz.ai/v2/order-payment/:id?Billz-Response-Channel=HTTP' \
  --header 'Authorization: Bearer ...' \
  --header 'Content-Type: application/json' \
  --data '{
    "payments": [
      {
        "company_payment_type_id": "c6e84d9b-0ef0-4d5a-886d-147c74a9b051",
        "paid_amount": 10000,
        "returned_amount": 0
      },
      {
        "company_payment_type_id": "fe95ebe4-ae02-47d2-8d72-3c030a8a1035",
        "paid_amount": 100000,
        "returned_amount": 0
      }
    ],
    "comment": "test123",
    "with_cashback": 0,
    "without_cashback": false,
    "skip_ofd": false
  }'
```

**Response**

```json
{
  "order_type": "SALE",
  "should_print_cheque": true
}
```

---

## Postpone Sale {#postpone-sale}

### POST /v2/order/create_postpone

Save a ready draft as a postponed sale. The selected quantity is reserved and unavailable for other sales until the hold is manually or automatically cleared.

**Example request**

```bash
curl -X POST 'https://api-admin.billz.ai/v2/order/create_postpone?Billz-Response-Channel=HTTP' \
  --header 'Authorization: Bearer ….' \
  --data '{
    "order_id": "e9a593b4-b67d-478e-b851-66e7f6d7e22c",
    "comment": "",
    "time": "2024-07-16 06:47:30"
  }'
```

The response returns the full order object with `park_status: "active"`.

---

## Recalculate Receipt {#recalculate}

### POST /v1/recalculate-order-bill/:order_id

Call this after adding all gift cards to the cart, before payment.

```bash
curl --request POST \
  'https://api-admin.billz.ai/v1/recalculate-order-bill/c7d83308-e92d-46bb-a036-db46482b170f?Billz-Response-Channel=HTTP' \
  --header 'Authorization: Bearer ...'
```
