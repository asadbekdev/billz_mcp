# Certificates & Gift Cards

---

## Search Gift Cards {#search-gift-cards}

### GET /v1/gift-card/search

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| code | string | Gift card barcode |
| status_list | string | Comma-separated statuses: `NEW`, `ACTIVE`, `USED`, `CLOSED`, `EXPIRED` |
| page | int | Page number |
| limit | int | Records per page |
| types | string | Card type: `CERTIFICATE`, `VOUCHER` |
| use_type | string | Use type: `SINGLE`, `MULTIPLE` |
| from_created_at | string | Created from date (dd.mm.yyyy) |
| to_created_at | string | Created to date (dd.mm.yyyy) |
| from_expire_at | string | Expires from date (dd.mm.yyyy) |
| to_expire_at | string | Expires to date (dd.mm.yyyy) |
| from_sold_at | string | Sold from date (dd.mm.yyyy) |
| to_sold_at | string | Sold to date (dd.mm.yyyy) |
| from_used_at | string | Used from date (dd.mm.yyyy) |
| to_used_at | string | Used to date (dd.mm.yyyy) |

**Example request**

```bash
curl --location 'https://api-admin.billz.ai/api/v1/gift-card/search?page=2&limit=10&types=CERTIFICATE&use_type=SINGLE&from_created_at=01.12.2024&to_created_at=31.12.2024' \
  --header 'Authorization: Bearer ...' \
  --header 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| sold_at | string | Sale date (UTC) |
| sale_order_number | string | 6-digit sale number |
| last_used_at | string | Last usage date (UTC) |
| last_use_order_number | string | Transaction number of last usage |
| left_amount | float | Remaining balance on card |
| with_nominal | bool | Whether the card has a face value; if not, value is set at point of sale |
| id | int | Internal card ID |
| gift_card_type | string | Card type: `CERTIFICATE` or `VOUCHER` |
| code | string | Card barcode |
| amount | float | Card face value |
| sale_order_id | uuid | Internal sale transaction ID |
| activated_at | string | Card activation date |
| expire_type | string | Expiry type: `ABSOLUTE` (fixed date) or `RELATIVE` (period after sale) |
| expire_period | string | For `ABSOLUTE`: date in dd.mm.yyyy; for `RELATIVE`: period like `90d`, `3m` |
| expired_at | string | Actual expiry date (UTC) |
| status | string | Card status: `NEW`, `ACTIVE`, `USED`, `CLOSED`, `EXPIRED` |
| created_at | string | Card creation date (UTC) |
| use_type | string | Use type: `SINGLE`, `MULTIPLE` |
| company_id | uuid | Company UUID |

**Example response**

```json
{
  "cards": [
    {
      "sold_at": "2023-12-13T09:42:39.552065Z",
      "sale_order_number": "892354",
      "left_amount": 0,
      "with_nominal": true,
      "id": 37927,
      "gift_card_type": "CERTIFICATE",
      "code": "2790296932455",
      "amount": 500000,
      "expire_type": "ABSOLUTE",
      "expire_period": "13.06.2024",
      "status": "CLOSED",
      "use_type": "SINGLE"
    }
  ],
  "total": 168
}
```

---

## Create Card {#create-card}

### POST /v1/gift-card/activate-list

> Add the header `Billz-Response-Channel: HTTP` to receive the response synchronously.

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| is_activated | bool | Create a pre-activated card (only for vouchers; must be `false` for certificates) |
| gift_cards | []gift_card | List of cards to create |
| gift_card.code | string | Card barcode |
| gift_card.amount | float | Card face value |
| gift_card.expire_period | string | Expiry date (dd.mm.yyyy) |
| card_type | string | Card type: `CERTIFICATE`, `VOUCHER` |
| expire_type | string | Expiry type: `ABSOLUTE` |
| use_type | string | Use type: `SINGLE`, `MULTIPLE` |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/gift-card/activate-list' \
  -H 'Authorization: Bearer ...' \
  -H 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01' \
  -H 'Content-Type: application/json' \
  -H 'Billz-Response-Channel: HTTP' \
  --data-raw '{"id":0,"is_activated":false,"gift_cards":[{"code":"1000000001","amount":10000,"expire_period":"31.12.2024"}],"card_type":"CERTIFICATE","expire_type":"ABSOLUTE","use_type":"SINGLE"}'
```

**Example response**

```json
{
  "session_id": "46d0e6e8-542c-4dde-9b11-e255fec487cb",
  "status_code": 200,
  "id": "13ccd580-ee15-41d5-9110-29b28215eed6",
  "error": { "code": "", "message": "" },
  "data": 4574,
  "topic": "v1.marketing_service.gift_card.activate_list.success"
}
```

---

## Add Certificate to Sale {#add-to-sale}

### PUT /v1/order-gift-card/:order_id

> Add the header `Billz-Response-Channel: HTTP`. The `order_id` is passed as a path parameter (UUID of the sale).

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| gift_card_id | int | Internal card ID (obtained via search) |

**Example request**

```bash
curl --request PUT 'https://api-admin.billz.ai/v1/order-gift-card/c7d83308-e92d-46bb-a036-db46482b170f' \
  --header 'Authorization: Bearer ...' \
  --header 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01' \
  --header 'Content-Type: application/json' \
  --header 'Billz-Response-Channel: HTTP' \
  --data '{"gift_card_id":4405215}'
```

---

## Remove Certificate from Sale {#remove-from-sale}

### POST /v1/order-gift-card-remove/:order_id

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| gift_card_id | int | Internal card ID (obtained via search) |

**Example request**

```bash
curl --request POST 'https://api-admin.billz.ai/api/v1/order-gift-card-remove/0d61a136-6d20-496f-bb20-579256248e92' \
  -H 'authorization: Bearer ...' \
  -H 'content-type: application/json' \
  -H 'platform-id: 7d4a4c38-dd84-4902-b744-0488b80a4c01' \
  --data-raw '{"gift_card_id":4405215}'
```

---

## Recalculate Cart Receipt

### POST /v1/recalculate-order-bill/:order_id

Call this after adding all gift cards to the cart, before payment.

```bash
curl --request POST 'https://api-admin.billz.ai/v1/recalculate-order-bill/c7d83308-e92d-46bb-a036-db46482b170f' \
  --header 'Authorization: Bearer ...'
```

---

## Pay with Certificate {#pay-with-certificate}

### POST /v2/order-payment/:order_id

Use the standard payment completion method, but set the payment type to "certificate" and include the `gift_card_id` parameter.

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| payments | []payment | Array of payment types |
| payment.company_payment_type_id | uuid | Internal payment type ID |
| payment.paid_amount | float | Payment amount |
| payment.gift_card_id | int | Gift card ID (for certificate payments) |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v2/order-payment/a0b53785-c840-4533-a22f-bfe162b8e302' \
  --header 'Authorization: Bearer ...' \
  --header 'Content-Type: application/json' \
  --data '{
    "payments": [
      {
        "company_payment_type_id": "429121de-a7ba-4a01-9e3d-d65999778816",
        "paid_amount": 125000
      },
      {
        "company_payment_type_id": "a89c2130-6083-4902-9493-100c31c3b559",
        "paid_amount": 10000,
        "gift_card_id": 4405184
      }
    ]
  }'
```
