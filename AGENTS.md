# Agent Instructions for jni-ts-template

## Project Overview
Node.js TypeScript template with strict typing, ESLint, Mocha/Chai tests, Winston logging,
Docker support. Uses ESM modules exclusively and compiles to `dist/` with `tsc`.

## Tech Stack
- Runtime: **Node.js 26+**
- Language: **TypeScript 6+** (strict mode, es2025 target)
- Package Manager: **pnpm 11** (self-managed via the `packageManager` field; no Corepack)
- Module System: **ESM** (`"type": "module"`, `module`/`moduleResolution: NodeNext`)
- Testing: **Mocha + Chai** (expect assertions)
- Linting: **ESLint v9** (flat config, @typescript-eslint)
- Logging: **Winston**
- Containers: **Testcontainers** (integration tests)

> This template is the Node counterpart to `jni-bun-template`. The shared `src/` design is kept in
> sync between the two, but the runtime rules differ - see **Imports** below. Do not copy Bun-style
> conventions blindly.

---

## Setup

Install pnpm once if you don't have it (Corepack was removed from Node 25+):
https://pnpm.io/installation (e.g. `brew install pnpm` on macOS). pnpm 10+ then honors the
`packageManager` field in `package.json` automatically, so the pinned version is enforced without
any extra tooling.

## Commands

### Install
```bash
pnpm install
```

### Run
```bash
pnpm start            # LOG_SETUP=dev node --env-file=.env dist/src/App.js (build first)
```

### Lint
```bash
pnpm run lint
```

### Type Check
```bash
pnpm run typecheck    # tsc -b
```

### Build (clean + emit + lint)
```bash
pnpm run build
```

### Run Core Tests
```bash
pnpm test
```

### Run a Single Test File
Tests run against compiled output, so build first, then point Mocha at the emitted `.js`:
```bash
pnpm run build
TZ=UTC LOG_SETUP=prod pnpm exec mocha dist/test-core/optional.spec.js --exit
```

### Run Integration Tests
```bash
pnpm run test:integration
```

### Docker
```bash
docker compose up --build -d
```

### Build & Push Multi-Arch Docker Image
```bash
pnpm run docker:build-push
```

---

## File Structure
```
src/
  App.ts                      # Entry point
  shared/
    helpers.ts                # CLI/env reading utilities (Option-based)
    SharedFunctions.ts        # Async utils (sleep, retry, concurrency)
    logger/log.ts             # Winston logger (dev/prod modes)
    enums/enums.ts            # Enum conversion utility
    optional/optional.ts      # Option<T> monad (Rust-style)
    trycatch/trycatch.ts      # Result<T,E> pattern
    workers/worker.ts         # Worker thread example (node:worker_threads)

test-core/                    # Unit tests (*.spec.ts)
test-integration/             # Integration tests (testcontainers)
```

---

## Code Style

### Formatting
- **Tabs** for indentation (size 4) - see `.editorconfig`
- No trailing whitespace
- Final newline in files

### Imports
- **ALWAYS use the `.js` extension in relative imports.** This is required for NodeNext ESM emit
  and is the opposite of the Bun template. Do not remove these extensions.
- Prefer `node:` prefixes for built-ins (`node:fs`, `node:worker_threads`).
- Prefer named imports over default imports.
- Under `verbatimModuleSyntax`, mark type-only imports with the inline `type` modifier.
```typescript
// Correct (Node / NodeNext ESM)
import fs from "node:fs";
import { log } from "./logger/log.js";
import { none, optionalDefined, type Option } from "./optional/optional.js";

// Wrong - missing .js extension (will fail to resolve at runtime)
import { log } from "./logger/log";
```

### Naming Conventions
- `camelCase`: functions, variables, parameters
- `PascalCase`: classes, types, interfaces, enums
- `SCREAMING_SNAKE_CASE`: constants, enum values (when string-based)
- Prefix unused params with `_`: `unwrapOr(_defaultValue: T)`

### Types
- Explicit return types on all functions (ESLint enforced)
- No `any` - use `unknown` and narrow with type guards
- No non-null assertions (`!`) - use the Option pattern instead
- Keep enums as regular `enum`, never `const enum` (`isolatedModules` forbids it)

### Error Handling
Use the provided patterns instead of raw try/catch:

**Option<T> Pattern** (for nullable values):
```typescript
import { type Option, none, some, optionalDefined, optionalCatch, optionalResolve } from "./shared/optional/optional.js";

const value = optionalDefined(maybeNull);       // Wraps nullable into Option<T>
const result = optionalCatch(() => riskyOp());  // some(T) on success, none() on throw
const resolved = await optionalResolve(promise);// some(T) on resolve, none() on reject

value.unwrapOr(defaultValue);                   // Safe default when none
value.unwrapExpect("error message");            // Throws with message if none
```

**Result<T,E> Pattern** (for operations that may fail):
```typescript
import { tryCatch, tryCatchAsync } from "./shared/trycatch/trycatch.js";

const { result, error } = tryCatch(() => riskyOperation());
if (error != null) {
    log.error(`Operation failed: ${error}`);
    // handle error
}
// result is narrowed to T

const { result, error } = await tryCatchAsync(asyncOperation());
```

**Rules:**
- Never use `process.exit()` inside shared/library functions that can return `Option<T>` or
  `Result<T,E>` - let the caller decide how to handle failure.
- Use `log.error()` instead of `console.error()` for error messages.
- Use `log.trace()` instead of `console.trace()` for stack traces (both on `ExtendedLogger`).
- Never silently swallow errors - always log or propagate them.
- In `catch` blocks, type the catch variable as `unknown` and narrow before use.
- Prefer returning `none()` / `{ result: null, error }` over throwing when failure is recoverable.
- Reserve `throw` for truly unrecoverable states (programmer errors, invalid invariants).

### Async/Await
- Always use async/await, never raw Promises with `.then()`
- Always await promises (ESLint `no-floating-promises: error`)
- Use `sleepAsync()` from SharedFunctions for delays

### Boolean Expressions
Strict boolean checks enforced - no truthy/falsy:
```typescript
// Correct
if (value !== null && value !== undefined)
if (array.length > 0)
if (str !== "")

// Wrong - truthy/falsy not allowed
if (value)
if (array.length)
if (str)
```

---

## Testing

### Test File Naming
- `*.spec.ts` in `test-core/` or `test-integration/`

### Test Structure
```typescript
import { expect } from "chai";
import { myFunction } from "../src/path/to/module.js";

describe("module name", () => {
    it("does something specific", () => {
        const input = "test";
        const result = myFunction(input);
        expect(result).to.equal("expected");
    });
});
```
`describe` / `it` are ambient globals from `@types/mocha`. They are available only because
`tsconfig.json` lists `"mocha"` in `types` (TS 6 no longer auto-includes `@types/*`).

---

## Environment Variables
- `LOG_SETUP`: `dev` or `prod` (required for logger)
- `TEST_VAR`: example var read from the environment

Node loads `.env` via the **`--env-file` flag** - no `dotenv` package needed. The `start` script
uses `node --env-file=.env ...`. In containers, env is injected by the orchestrator (compose
`env_file:` / `-e`), so the flag is intentionally absent from the Docker entrypoint.

Create `.env` in the project root:
```ini
TEST_VAR = "Test value"
```

---

## ESLint Key Rules
| Rule | Level | Notes |
|------|-------|-------|
| `no-explicit-any` | error | Use `unknown` instead |
| `no-non-null-assertion` | error | Use Option pattern |
| `strict-boolean-expressions` | error | No truthy/falsy |
| `no-floating-promises` | error | Always await |
| `no-unnecessary-condition` | error | Drop provably-redundant checks |
| `explicit-function-return-type` | warn | Add return types |
| `prefer-readonly` | warn | Mark immutable fields |

---

## Quick Reference

```bash
pnpm install                                             # Install deps (pnpm self-honors the pin)
pnpm run lint                                            # Check style
pnpm run typecheck                                       # Type check (tsc -b)
pnpm test                                                # Build + lint + core tests
pnpm run test:integration                                # Integration tests
pnpm run build                                           # Emit to dist/
pnpm start                                               # Run app (uses --env-file=.env)
pnpm run docker:build-push                               # Build & push multi-arch image
```
