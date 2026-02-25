## General

> Notes about decisions concerning structure, tradeoffs, etc.

## Structure

```
├── models/
├── test/
├── controllers/
├── utils/ 
├── config/ 
└── routes/ 
```

> `server.ts`: entry-point
- small entry-point file for coordinating Express application and DB connection
- application start

> `app.ts`: Express application setup

> `config/`: database connection setup
- `db.ts`: use mongoose to connect with DB
- handle (un-)successful connection
- import into `server.ts`

> `models/`: Mongo schema definitions

> `test/`
- REST connection tests

> `controllers/`: API definitions
- asynchronous functions for database connections
- all funciontality for writing to/reading from DB

> `utils/`:
- utility functions

> `routes/`
- exports a Router object with all end-points setup
- import into app.ts to mount routes

## Blog Structure

- id: int
- title: string
- created_at: string ?? (property name TBD) (examples: publication date)
- content: string

- author? (string, default to "anonymous")
