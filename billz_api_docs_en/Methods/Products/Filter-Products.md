# Filter Products

### POST /v2/product-search-with-filters

Products in the catalog can be filtered by multiple parameters. Some values are passed as lists, others as single values.

**Filter Parameters**

| Parameter | Description | Data |
| --- | --- | --- |
| **shop_ids** | Stores | List of shop IDs |
| **category_ids** | Categories | List of category IDs |
| **skus** | SKUs | List of SKU IDs |
| **measurement_unit_ids** | Units of measurement | List of unit IDs |
| **brand_ids** | Brands | List of brand IDs |
| **supplier_ids** | Suppliers | List of supplier IDs |
| **product_field_filters** | Filter by attributes or custom properties | Array of product property objects |
| **supply_price_from…supply_price_to** | Supply price range | Two values defining the supply price range |
| **retail_price_from…retail_price_to** | Retail price range | Two values defining the retail price range |
| **whole_sale_price_from…whole_sale_price_to** | Wholesale price range | Two values defining the wholesale price range |
| **group_variations** | Group variations | Whether to group by variations (true/false) |

---

## Product Property Object

The same `product_field_filters` parameter is used for both attribute and custom property filtering. It accepts an array of:

| Parameter | Description |
| --- | --- |
| field_id | Property ID |
| field_type | Property type: `custom` or `attribute` |
| field_values | Array of attribute IDs or custom property values to filter by |

**Attribute example:**

```json
{
  "field_id": "491e1d8a-ad22-4180-bcc5-0c5699bdf4f9",
  "field_type": "attribute",
  "field_values": [
    "aee6d71d-32ed-4695-8f3b-5516dacf75fe"
  ]
}
```

**Custom property example:**

```json
{
  "field_id": "3b6db763-eeaf-41c3-af99-48472add4e2e",
  "field_type": "custom",
  "field_values": [
    "18"
  ]
}
```

---

## Example Request

```bash
curl 'https://api-admin.billz.ai/v2/product-search-with-filters' \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  --request POST \
  --data-raw '{
    "category_ids": ["15c1d3e9-f628-4094-8c69-7b0e67a6240d"],
    "status": "all",
    "skus": ["100-29", "10276F"],
    "order": [""],
    "group_variations": false,
    "product_field_filters": [
      {
        "field_id": "491e1d8a-ad22-4180-bcc5-0c5699bdf4f9",
        "field_type": "attribute",
        "field_values": ["aee6d71d-32ed-4695-8f3b-5516dacf75fe"]
      },
      {
        "field_id": "3b6db763-eeaf-41c3-af99-48472add4e2e",
        "field_type": "custom",
        "field_values": ["18"]
      }
    ],
    "field_search_key": "",
    "archived_list": false,
    "brand_ids": ["e158f882-d0e0-499d-b6f8-9029ac1886ca"],
    "measurement_unit_ids": ["c5336f71-d684-4e2e-b5bc-307138593543"],
    "is_free_price": null,
    "supply_price_from": 1,
    "supply_price_to": 10000000,
    "retail_price_from": 1,
    "retail_price_to": 10000000,
    "whole_sale_price_from": 1,
    "whole_sale_price_to": 10000000,
    "shop_ids": ["6f244db4-75d6-4fac-9841-14867d45e36a"],
    "supplier_ids": ["5f4c5af2-3320-4fa4-aed9-65a35e1dab8f"],
    "statistics": true,
    "limit": 10,
    "page": 1
  }'
```

---

## Grouping Variations

When `"group_variations": true` is passed, the main list contains the parent product instead of individual variations. The variations themselves are found in the `variations` field.

**Example request:**

```bash
curl --request POST \
  --url https://api-admin.billz.ai/v2/product-search-with-filters \
  --header 'content-type: application/json' \
  --data '{
    "status": "all",
    "order": [""],
    "group_variations": true,
    "product_field_filters": [],
    "field_search_key": "",
    "archived_list": false,
    "brand_ids": [],
    "supplier_ids": [],
    "measurement_unit_ids": [],
    "is_free_price": null,
    "statistics": true,
    "limit": 10,
    "page": 14
  }'
```

**Example response:**

```json
{
  "count": 134,
  "total": 0,
  "products": [
    {
      "id": "45ec2322-0c1f-4028-b888-f26467863f5d",
      "is_variative": true,
      "name": "multi-category item",
      "sku": "DWZ-15067",
      "brand_id": "edd59cab-edbc-4797-99a5-c853da9f6266",
      "brand_name": "Example Brand",
      "variations": [
        {
          "id": "2fd21551-ab78-461b-9ddf-d7f5b95c60ae",
          "name": "multi-category item / s / green",
          "base_name": "multi-category item",
          "barcode": "2000000000251",
          "sku": "DWZ-15067",
          "variation_id": "DWZ-15067"
        },
        {
          "id": "6ce0e570-9e57-4117-9992-7bdea0d92d84",
          "name": "multi-category item / m / red",
          "base_name": "multi-category item",
          "barcode": "2000000000268",
          "sku": "DWZ-15067",
          "variation_id": "DWZ-15067"
        }
      ],
      "base_name": "multi-category item",
      "variation_id": "DWZ-15067"
    }
  ]
}
```
