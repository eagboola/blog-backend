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


## Importing TypeScript Modules

> Problem: trying to import a ts module us `.ts` extension.

`import BlogModel from "../models/Blog.ts"`
Raises an error: "An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled."

> Solution: use `.js` extensions with `"module": "nodenext"` config option.

`import BlogModel from "../models/Blog.js`
This is actually the recommended approach when transpiling to JavaScript.
TS will check for `Blog.ts` when type-checking and reference the correct `Blog.js` file after transpilation/at runtime.
( `"module": "nodenext"` should already be enabled in default `tsconfig.json` when generated with `tsc --init` )

Using the approach suggested by the error message, setting `"allowImportingTsExtension": true` in `tsconfig.json`, implies no transpilation will take place.