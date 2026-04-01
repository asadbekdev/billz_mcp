# Customers

---

## Create Customer {#create-customer}

### POST /v1/client

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| chat_id | string | Customer's Telegram chat_id |
| date_of_birth | string | Date of birth. Format: `2022-05-14` |
| first_name | string | Customer's first name |
| last_name | string | Customer's last name |
| phone_number | string | Customer's phone number |
| gender | integer | Customer's gender: `0` = unspecified, `1` = male, `2` = female |

**Example request**

```bash
curl -X 'POST' \
  'https://api-admin.billz.ai/v1/client' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ..' \
  -d '{
  "chat_id": "some_chat_id",
  "date_of_birth": "2022-05-14",
  "first_name": "John",
  "gender": 1,
  "last_name": "Doe",
  "phone_number": "+998000000000"
}'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| id | string (uuid) | Identifier of the created customer |

**Example response**

```json
{
  "id": "00000000-0000-0000-0000-000000000000"
}
```

---

## Get List of Customers {#get-customers}

### GET /v1/client

Returns brief information for a list of customers.

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| chat_id | string | Customer's Telegram chat_id |
| limit | integer | Items per page. Default: 10 |
| page | integer | Page number. Default: 1 |
| search | string | Search string |
| phone_number | string | Customer's phone number |

**Example request**

```bash
curl -X 'GET' \
  'https://api-admin.billz.ai/v1/client' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ..'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| count | int | Total customers in the database |
| clients | array[object] | List of customers |
| clients[].balance | float | Customer balance |
| clients[].birth_date | string | Date of birth (format: `2022-05-14`) |
| clients[].first_name | string | First name |
| clients[].last_name | string | Last name |
| clients[].phone_numbers | []string | List of phone numbers |
| clients[].cards | []string | List of customer cards |
| clients[].chat_id | string | Telegram chat_id |
| clients[].id | string (uuid) | Customer identifier |
| clients[].created_at | string | Creation date |
| clients[].last_transaction_date | string | Last transaction date |

**Example response**

```json
{
  "clients": [
    {
      "balance": 0,
      "birth_date": "2022-05-14",
      "cards": ["some_card"],
      "chat_id": "some_chat_id",
      "created_at": "2022-05-14",
      "first_name": "John",
      "id": "00000000-0000-0000-0000-000000000000",
      "last_name": "Doe",
      "last_transaction_date": "2022-05-14",
      "phone_numbers": ["+998000000000"]
    }
  ],
  "count": 0
}
```

---

## Update Customer {#update-customer}

### PUT /v1/client/{id}

The customer identifier must be passed in the request path.

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| date_of_birth | string | Date of birth (format: `2022-05-14`) |
| first_name | string | First name |
| last_name | string | Last name |
| phone_number | array[string] | Phone numbers as an array |
| gender | integer | Gender: `0` = unspecified, `1` = male, `2` = female |

**Example request**

```bash
curl -X 'PUT' \
  'https://api-admin.billz.ai/v1/client/123' \
  -H 'Authorization: Bearer ..' \
  -H 'Content-Type: application/json' \
  -d '{
  "date_of_birth": "2022-05-14",
  "first_name": "John",
  "gender": 1,
  "last_name": "Doe",
  "phone_number": ["+998000000000"]
}'
```

**Example response**

```json
{
  "message": "Successfully updated"
}
```

---

## Customer Details {#customer-details}

### GET /v1/customer/{id}

Returns the full customer profile. The customer ID must be passed in the path.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/customer/622c8993-9f82-45ae-a69d-63103d8506d5' \
  -X 'GET' \
  -H 'Authorization: Bearer ..'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| id | string (uuid) | Unique customer identifier |
| external_id | string | External customer identifier |
| company_id | string | Company identifier |
| first_name | string | First name |
| last_name | string | Last name |
| middle_name | string | Middle name |
| language | string | Preferred language |
| date_of_birth | string | Date of birth |
| gender | string | Gender |
| phone_numbers | array | List of phone numbers |
| marital_status | string | Marital status |
| registered_shop | object | Registered shop info |
| last_purchase_date | string | Last purchase date |
| sms_notification | boolean | SMS notification enabled |
| phone_notification | boolean | Phone notification enabled |
| social_network_notification | boolean | Social network notification enabled |
| purchase_amount | number | Total purchase amount |
| debt_amount | number | Debt amount |
| email_notification | boolean | Email notification enabled |
| groups | array | Groups the customer belongs to |
| cards | array | Customer cards |
| created_at | string | Creation date |
| loyalty_program_id | string | Loyalty program identifier |
| loyalty_program_level_id | string | Loyalty program level identifier |
| chat_id | string | Telegram chat identifier |
| first_purchase_date | string | First purchase date |
| balance | number | Cashback balance |
| average_purchase_amount | number | Average purchase amount |
| visits_count | number | Visit count |

---

## Update Cashback {#update-cashback}

### PATCH /v1/customer/set-balance/{id}

Manually sets the cashback balance. **Use with caution.**

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| balance | integer | New cashback value |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/customer/set-balance/622c8993-9f82-45ae-a69d-63103d8506d5' \
  -X 'PATCH' \
  -H 'Authorization: Bearer ..' \
  --data-raw '{"balance":943000}'
```

**Example response**

```json
{
  "message": "00000000-0000-0000-0000-000000000000"
}
```

---

## Create Customer Card {#create-customer-card}

### POST /v1/client-card

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| customer_id | string (uuid) | Customer identifier |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/client-card' \
  -X 'POST' \
  -H 'Authorization: Bearer ..' \
  -d '{"customer_id":"00000000-0000-0000-0000-000000000000"}'
```

**Example response**

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "card_code": "some card code"
}
```

---

## Get Customers by chat_id {#get-by-chat-id}

### GET /v1/client-by-chat-id

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| page | integer | Page number. Default: 1 |
| limit | integer | Results per page. Default: 10 |
| chat_id | string | Telegram chat_id |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/client-by-chat-id?page=1&limit=10&chat_id=some_chat_id' \
  -X 'GET' \
  -H 'Authorization: Bearer ..'
```

---

## Get Debt Statistics {#debt-stats}

### GET /v1/debt-stats

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| customer_id | string | Customer ID |

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/debt-stats?customer_id=:customerId' \
  -H 'authorization: Bearer ...'
```

**Response fields**: `total_debt_amount`, `total_unpaid_amount`, `total_paid_amount`, `number_of_debtors`, `number_of_debts`, `number_of_overdue_debts`, etc.

---

## Get Debt List {#debt-list}

### GET /v1/debt

**Query Parameters**

| Name | Type | Description |
| --- | --- | --- |
| customer_id | string | Customer ID |
| page | integer | Page number. Default: 1 |
| limit | integer | Results per page. Default: 10 |

---

## Get Loyalty Program {#loyalty-program}

### GET /v1/loyalty-program

Returns the loyalty program configuration applicable to customers.

**Example request**

```bash
curl 'https://api-admin.billz.ai/v1/loyalty-program' \
  -H 'authorization: Bearer ...'
```

**Response includes**: program type (cashback/discount), cashback payment percent, bonus expiry period, notification settings, loyalty levels, and excluded products.
