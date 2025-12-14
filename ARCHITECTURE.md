# Architecture Overview: Price Checker Backend


## Purpose
This project is a backend architecture prototype/example for a Price Checker system.
The focus is on clean structure, separation of concerns, and extensibility rather than full feature completeness. Features are limited but the logic works.


## Architectural Style
The backend follows a layered REST architecture:

- Routes handle HTTP endpoints
- Controllers handle request/response logic
- Services contain business logic
- db is intentionally missing

This structure allows the system to be extended without breaking existing functionality.

---

## Separation of Concerns
Each layer has a single responsibility:

- Routes define API paths
- Controllers orchestrate use cases
- Services implement domain logic
- Infrastructure concerns (database) are isolated

This protects slowly changing parts of the system from frequently changing parts.


## Service Layer
Business logic is implemented in services (e.g. price comparison service).
Controllers never contain business logic directly.

This follows the Service Layer pattern and supports maintainability and testing.


## Database Strategy
The current implementation uses mocked in-memory data instead of a database.
This decision was intentional to focus on architecture since there was not much time left. For this phasce the the database is not added --> arcitecture was ranked higher than half-wokring DB

A relational database (e.g. MySQL) can be added later by replacing service implementations
without changing routes or controllers.

The database can be integrated later without changing routes or controllers



## Design Principles
The following principles are applied:

- KISS: Only necessary functionality is implemented
- YAGNI: Advanced features are left for future work
- DRY: Shared logic is not duplicated
- SOLID: Responsibilities are clearly separated

## Reuse of Existing Backend Structure
The project reuses the architecture of a previously developed backend (online coffee shop- project)!
Only the structure was reused; the domain and API were adapted to the Price Checker requirements.
