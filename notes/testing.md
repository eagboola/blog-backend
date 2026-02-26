# Testing Notes

## Stack: Vitest + Supertest

- **vitest** — test runner with native ESM (es modules) + TypeScript support (no separate transpile step)
- **supertest** — makes HTTP requests against an Express app in-process (no running server needed)
- **mongodb-memory-server** — spins up a real MongoDB instance in memory; no Atlas connection during tests

### Why This Works

`app.ts` exports the Express instance without starting a server — `server.ts` handles that separately. Supertest binds directly to the exported `app`, so no port is bound during tests. The architecture is already test-ready.

---

## Installation

```bash
npm install --save-dev vitest supertest @types/supertest mongodb-memory-server
```

---

## Configuration

### `vitest.config.ts` (project root)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
  }
})
```

### `test/setup.ts` — runs before every test file

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll, beforeEach } from 'vitest'

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

beforeEach(async () => {
  // Wipe all collections between tests for isolation
  for (const key in mongoose.connection.collections) {
    await mongoose.connection.collections[key].deleteMany({})
  }
})
```

### `package.json` scripts

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

> [!important]
> A `tsconfig.json` is required — currently only `tsconfig.json.bak` exists. Rename or recreate it before running tests.

---

## Tests to Write

### `test/blogs.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.ts'

describe('GET /api/blogs', () => {
  it('returns 200 with empty array when no blogs exist', async () => {
    const res = await request(app).get('/api/blogs')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/blogs', () => {
  it('creates a blog and returns 201 with the created document', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({ title: 'Hello', content: 'World' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Hello')
    expect(res.body.author).toBe('anonymous') // default behavior
  })

  it('uses provided author instead of anonymous', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({ title: 'Hello', content: 'World', author: 'Ada' })
    expect(res.body.author).toBe('Ada')
  })

  // Once validation is added:
  // it('returns 400 when title is missing', ...)
})

describe('GET /api/blogs/:id', () => {
  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/blogs/000000000000000000000000')
    expect(res.status).toBe(404)
  })

  it('returns the blog when it exists', async () => {
    const created = await request(app)
      .post('/api/blogs')
      .send({ title: 'T', content: 'C' })
    const res = await request(app).get(`/api/blogs/${created.body._id}`)
    expect(res.status).toBe(200)
    expect(res.body._id).toBe(created.body._id)
  })
})

describe('PATCH /api/blogs/:id', () => {
  it('updates only specified fields', async () => {
    const created = await request(app)
      .post('/api/blogs')
      .send({ title: 'Original', content: 'C' })
    const res = await request(app)
      .patch(`/api/blogs/${created.body._id}`)
      .send({ title: 'Updated' })
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Updated')
    expect(res.body.content).toBe('C') // unchanged
  })

  it('returns 404 for non-existent id', async () => {
    const res = await request(app)
      .patch('/api/blogs/000000000000000000000000')
      .send({ title: 'X' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/blogs/:id', () => {
  it('returns 204 on successful deletion', async () => {
    const created = await request(app)
      .post('/api/blogs')
      .send({ title: 'T', content: 'C' })
    const res = await request(app).delete(`/api/blogs/${created.body._id}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/blogs/000000000000000000000000')
    expect(res.status).toBe(404)
  })
})

describe('Unknown routes', () => {
  it('returns 404 for unregistered endpoints', async () => {
    const res = await request(app).get('/api/nonexistent')
    expect(res.status).toBe(404)
  })
})
```

---


## As the Project Grows

### When `edits` builder is extracted to utils
Write a pure unit test for it — no supertest or DB needed. Much faster and easier to reason about in isolation.

### When input validation is added
Add tests for missing required fields (`title`, `content`), wrong types, and edge cases (empty strings, very long strings). These tests document your API contract explicitly.

### When authentication is added
- Test middleware in isolation with unit tests (mock `req`/`res`/`next`)
- Test protected routes with supertest by sending/omitting auth headers

### Longer-term

| Concern | Approach |
|---|---|
| Repeated test setup | Create a `createTestBlog(overrides?)` factory helper — a function that POSTs through supertest and returns the document |
| Test DB strategy | `mongodb-memory-server` scales well; never hit Atlas in tests (slow + fragile) |
| Coverage reporting | `vitest --coverage` (needs `@vitest/coverage-v8`); treat it as a compass, not a goal |
| Parallel test files | Vitest runs files in parallel by default; the `beforeEach` wipe ensures isolation |
