# Add / Edit Product Custom Field

### PATCH /v2/product/{product_id}/patch-props

Allows adding or editing a custom field on a product. If the provided `custom_field_id` already exists, the value is updated. Otherwise, it is added.

**Request Parameters**

| Name | Type | Description |
| --- | --- | --- |
| custom_fields | []custom_field | List of custom product properties |

Each `custom_field` object:

```json
{
  "custom_field_id": "00000000-0000-0000-0000-000000000000",
  "custom_field_value": "some value"
}
```

**Example request**

```bash
curl -X 'PATCH' \
  'https://api-admin.billz.ai/v2/product/:product_id/patch-props' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -H 'Billz-Response-Channel: HTTP' \
  -d '{
    "custom_fields": [
      {
        "custom_field_id": "{field_id}",
        "custom_field_value": "{field_value}"
      }
    ]
  }'
```

**Response Parameters**

| Name | Type | Description |
| --- | --- | --- |
| session_id | string (uuid) | Client session identifier |
| status_code | number | HTTP status code |
| error | object | Error object |
| error.code | string | Error code. Empty string if no error |
| error.message | string | Error message. Empty string if no error |
| correlation_id | string (uuid) | Request identifier |
| topic | string | Handler topic name |

**Example response**

```json
{
  "session_id": "00000000-0000-0000-0000-000000000000",
  "status_code": 200,
  "error": {
    "code": "",
    "message": ""
  },
  "correlation_id": "00000000-0000-0000-0000-000000000000",
  "topic": "some topic name"
}
```
