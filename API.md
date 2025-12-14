# Price Checker Backend – API
This document describes the public API of the Price Checker backend.
The API is designed to support different client applications such as mobile apps or web frontends.

## Price Comparison
### Compare prices of a product

**Endpoint** 
POST /prices/compare

**Description**
Returns a comparison of prices for the same product across nearby stores.
In this prototype, the response data is mocked to demonstrate the API structure.

### Request body (example)
```json
{
  "barcode": "123456789",
  "latitude": 60.1699,
  "longitude": 24.9384
}

###Response (example)
..json
{
  "label": "average",
  "stores": [
    { "name": "Store A", "price": 2.99 },
    { "name": "Store B", "price": 3.49 }
  ]
}
