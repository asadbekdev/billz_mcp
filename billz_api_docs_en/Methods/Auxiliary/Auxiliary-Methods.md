# Auxiliary Methods

Supplementary methods for working with the BILLZ API.

---

## Organization

- [Company](#company)
- [Shops](#shops)
- [Users](#users)
- [Suppliers](#suppliers)

## Products

- [Categories](#categories)
- [Brands](#brands)
- [Product Characteristics](#product-characteristics)
- [Measurement Units](#measurement-units)
- [Product Types](#product-types)

## Sales

- [Cashboxes](#cashboxes)
- [Payment Types](#payment-types)
- [Currencies](#currencies)
- [Currency Rate History](#currency-rate-history)

## Reports

- [Transaction Types](#transaction-types)
- [Import Types](#import-types)
- [Payment Types for Reports](#payment-types-for-reports)
- [Report Detalization](#report-detalization)

---

### Company {#company}

Returns information about the current company (determined from the token).

```bash
curl -X GET 'https://api-admin.billz.ai/v1/company' \
  -H 'Authorization: Bearer ...'
```

---

### Shops {#shops}

Returns the list of shops for the company from the token.

```bash
curl -X GET 'https://api-admin.billz.ai/v1/shop?limit=100&only_allowed=true' \
  -H 'Authorization: Bearer ...'
```

---

### Users {#users}

Returns the list of users (cashiers, sellers) for the company from the token.

```bash
curl -X GET 'https://api-admin.billz.ai/v1/user?limit=1000' \
  -H 'Authorization: Bearer ...'
```

---

### Suppliers {#suppliers}

Returns the list of suppliers for filtering.

```bash
curl -X GET 'https://api-admin.billz.ai/v1/supplier?limit=1000' \
  -H 'Authorization: Bearer ...'
```

---

### Categories {#categories}

Returns the list of product categories.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/category?limit=10&page=1&search=&is_deleted=false' \
  -H 'Authorization: Bearer ...'
```

---

### Brands {#brands}

Returns the list of product brands.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/brand?page=1&search=&limit=10' \
  -H 'Authorization: Bearer ...'
```

---

### Product Characteristics {#product-characteristics}

Returns the list of product characteristics (for configuring display options).

```bash
curl -X GET 'https://api-admin.billz.ai/v2/product-characteristic?limit=1000' \
  -H 'Authorization: Bearer ...'
```

---

### Measurement Units {#measurement-units}

Returns the list of measurement units.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/measurement-unit' \
  -H 'Authorization: Bearer ...'
```

---

### Product Types {#product-types}

Returns available product types.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/product-type' \
  -H 'Authorization: Bearer ...'
```

**Example response**

```json
{
    "product_types": [
        {
            "id": "69e939aa-9b8f-46a9-b605-8b2675475b7b",
            "name": "Product",
            "description": "A product with stock"
        },
        {
            "id": "5a0e556a-15f8-47ac-ae07-46972f3c6ab4",
            "name": "Service",
            "description": "A product without stock"
        },
        {
            "id": "864c77c7-5407-45dc-8289-3162b71dc653",
            "name": "Bundle",
            "description": "A set of products sold as a single unit"
        }
    ]
}
```

---

### Cashboxes {#cashboxes}

Returns the list of cashboxes available in the shop.

```bash
curl 'https://api-admin.billz.ai/v1/cash-box?limit=100' \
  -H 'Authorization: Bearer ..'
```

---

### Payment Types {#payment-types}

Returns available payment types for the company. Default limit is 10; use the `limit` parameter to increase.

```bash
curl -X GET 'https://api-admin.billz.ai/v1/company-payment-type?limit=1000' \
  -H 'Authorization: Bearer ...'
```

---

### Currencies {#currencies}

Returns currencies configured for the company.

```bash
curl -X GET 'https://api-admin.billz.ai/v2/company-currencies' \
  -H 'Authorization: Bearer ...'
```

---

### Currency Rate History {#currency-rate-history}

Returns currency exchange rate history, filterable by date range.

**Query parameters:** `start_date`, `end_date`, `currency`, `page`, `limit`

```bash
curl 'https://api-admin.billz.ai/v2/company-currency-rates?limit=5&page=1&currency=&start_date=2020-01-01&end_date=2024-07-26' \
  -H 'Authorization: Bearer ..'
```

**Example response**

```json
{
    "rates": [
        {
            "id": "26319b1a-8ccf-4de1-baee-3a4f9bd4bf07",
            "source_currency": "USD",
            "target_currency": "",
            "rate": 11000,
            "valid_from": "2022-09-21 11:48:25",
            "valid_to": ""
        }
    ],
    "count": 1
}
```

---

### Transaction Types {#transaction-types}

Transaction types are passed as text in the query parameter: `SALE`, `EXCHANGE`, `RETURN`.

---

### Import Types {#import-types}

Import types are hardcoded client-side via the `import_type` parameter:

- `0` — Import
- `1` — Order
- `2` — Import + Order (omit parameter for both)

---

### Payment Types for Reports {#payment-types-for-reports}

Returns payment types for the Transactions report. Accepts `start_date`, `end_date`, and `shop_ids`.

```bash
curl -X GET \
  'https://api-admin.billz.ai/v1/transaction-report-payments?start_date=2022-05-08&shop_ids=...&end_date=2023-05-08' \
  -H 'Authorization: Bearer ...'
```

---

### Report Detalization {#report-detalization}

The `detalization` parameter controls time grouping in reports:

| Value | Description |
| --- | --- |
| `day` | Group by day |
| `week` | Group by week |
| `month` | Group by month |
| `year` | Group by year |
| *(omit)* | No grouping |
