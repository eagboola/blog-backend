# TypeScript Notes

## Import Path Extensions in ESM

With `"module": "nodenext"` in [tsconfig.json](../tsconfig.json) and `"type": "module"` in [package.json](../package.json), Node uses strict ESM resolution — explicit file extensions are required on relative imports. TypeScript gives you three ways to handle this.

---

### Option 1: `.ts` extension + `allowImportingTsExtensions` (recommended for this project)

```typescript
import BlogModel from "../models/Blog.ts"
```

Requires two tsconfig flags:

```json
"allowImportingTsExtensions": true,
"noEmit": true,
```

`noEmit` is required because if TypeScript emitted `.js` files, those files would contain `.ts` in the import path, which Node cannot resolve. With `noEmit: true`, TypeScript skips emitting entirely and assumes a tool like `tsx` or vitest handles execution directly.

This is the right choice when there is no separate compile step — vitest runs TypeScript natively, so `noEmit` has no effect on the test workflow.

---

### Option 2: `.js` extension (the official TypeScript + ESM recommendation for compiled projects)

```typescript
import BlogModel from "../models/Blog.js"  // .js even though the source file is .ts
```

This looks wrong but is intentional. TypeScript with `"module": "nodenext"` understands that `.js` in a source file refers to the compiled output — it looks up `Blog.ts` during type-checking, and the emitted `.js` file correctly references `Blog.js` at runtime. No extra tsconfig flag needed.

This is the right choice if you plan to compile to JS (e.g., `tsc` output to a `dist/` folder) and run that output directly with Node.

---

### Option 3: No extension (does not work with `nodenext`)

```typescript
import BlogModel from "../models/Blog"  // no extension
```

Worked in older CommonJS-based setups where Node's resolver auto-appended extensions. With `"module": "nodenext"`, Node's ESM resolution is strict and requires explicit extensions. TypeScript will error if you omit the extension.

---

### Summary

| Approach | When to use | Extra config needed |
|---|---|---|
| `.ts` extension | No build step (vitest, tsx, ts-node) | `allowImportingTsExtensions`, `noEmit` |
| `.js` extension | Compiling to JS with `tsc` | None |
| No extension | CJS / bundler-based setups | Varies |

---

## ESM vs CommonJS (CJS)

**ESM** (ECMAScript Modules) is the official JavaScript module system standardized in ES2015 (ES6):

```typescript
import express from 'express'
import app from './app.ts'
export default BlogModel
export { getAllBlogs, createBlog }
```

**CJS** (CommonJS) is the older Node.js module system:

```javascript
const express = require('express')
module.exports = BlogModel
```

Setting `"type": "module"` in `package.json` tells Node to treat all `.js`/`.ts` files as ESM. This is why imports use explicit `.ts` extensions — ESM requires them, unlike CJS which resolved them automatically.

Vitest was built with ESM as a first-class citizen. Older test runners like Jest had poor ESM support and required workarounds. This is one reason Vitest is the better fit for this project.
