# Authentication

BILLZ 2.0 API uses JSON Web Tokens ([**JWT**](https://jwt.io/)) for authentication. The token is generated server-side and is valid for **15 days**.

### Obtaining a Token

To get a JWT token, send a `POST` request to `https://api-admin.billz.ai/v1/auth/login` with your secret key in the request body. The returned `access_token` must be included in every subsequent request as the `Authorization: Bearer your_access_token` header.

*The secret key can be created in the BILLZ UI.*

[How to create an integration key](./How-to-create-integration-key.md)

**Example request**

```bash
curl -X 'POST' \
  'https://api-admin.billz.ai/v1/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "secret_token": "YOUR_SECRET_KEY"
}'
```

**Example response**

```json
{
  "code": 200,
  "message": "ok",
  "error": null,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
```

If a request is made with an expired token, the API returns a `401` response:

```json
HTTP/2 401
{
  "code": 401,
  "message": "token error",
  "error": "Token is expired",
  "data": null
}
```

In this case, simply issue a new token.
