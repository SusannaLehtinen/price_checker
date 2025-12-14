# Price Checker Backend (Architecture Prototype)

This project reuses the backend architecture from an earlier course project, but the domain and API are adapted to a Price Checker system.
Focus is on: architecture, clean structure, and a minimal working API demo.

## Purpose

The goal of this project is to demonstrate:
- Clear backend structure
- Well-defined API
- Separation of responsibilities between layers
- Ability to evolve the system in the future

The implementation intentionally keeps business logic simple and uses mocked data.

---

## Architecture Overview

The backend follows a layered REST architecture:

- **Routes** define HTTP endpoints
- **Controllers** handle request and response logic
- **Services** contain business logic
- **Persistence** is currently mocked and can be added later

This structure ensures maintainability and makes it easy to extend or modify the system without breaking existing functionality.

More details can be found in `ARCHITECTURE.md`.

---

## API Overview

The backend exposes a Price Comparison endpoint that allows clients to compare prices of a product across nearby stores.

### Main Endpoint

POST /prices/compare


- Accepts product barcode and user location
- Returns a list of store prices and a price label
- Uses mocked data in this prototype

Full API documentation is available in `API.md`.

---

## Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Steps
1. Install dependencies: 
  ```bash
   npm install

2. Start the server:
  node server.js

3. The server will run on
  http://localhost:3000

