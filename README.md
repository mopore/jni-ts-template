```
    ███        ▄████████   ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█          ▄████████     ███        ▄████████ 
▀█████████▄   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███         ███    ███ ▀█████████▄   ███    ███ 
   ▀███▀▀██   ███    █▀  ███   ███   ███   ███    ███ ███         ███    ███    ▀███▀▀██   ███    █▀  
    ███   ▀  ▄███▄▄▄     ███   ███   ███   ███    ███ ███         ███    ███     ███   ▀  ▄███▄▄▄     
    ███     ▀▀███▀▀▀     ███   ███   ███ ▀█████████▀  ███       ▀███████████     ███     ▀▀███▀▀▀     
    ███       ███    █▄  ███   ███   ███   ███        ███         ███    ███     ███       ███    █▄  
    ███       ███    ███ ███   ███   ███   ███        ███▌    ▄   ███    ███     ███       ███    ███ 
   ▄████▀     ██████████  ▀█   ███   █▀   ▄████▀      █████▄▄██   ███    █▀     ▄████▀     ██████████ 
                                                      ▀                                               
```

Source for ASCII-fonts: https://www.coolgenerator.com/ascii-text-generator
(Font: Delta Corps Priest 1


# What is this?
This is template for TypeScript project in VS Code with linting.

# What's the motivation?
To have an easier start for my projects.

# Setup

## Prerequisites
You will need "node.js" and "pnpm" installed on your system to use this
template.
To install node.js I recommend using nvm (Node Version Manager).
See https://github.com/nvm-sh/nvm for installation instructions.

### NVM (Node Version Manager)
Description from `tldr nvm` output:

Install, uninstall or switch between Node.js versions.
Supports version numbers like "12.8" or "v16.13.1", and labels like "stable", "system", etc.
More information: <https://github.com/creationix/nvm>.

- Install a specific version of Node.js:
    `nvm install node_version`

- Use a specific version of Node.js in the current shell:
    `nvm use node_version`

- Set the default Node.js version:
    `nvm alias default node_version`

- List all available Node.js versions and highlight the default one:
    `nvm list`

### pnpm
pnpm is pinned to version 11 via the `packageManager` field in `package.json` and is
self-managed — no Corepack needed (Corepack was removed from Node.js 25+).

Install pnpm once:
```bash
brew install pnpm   # macOS
# or see https://pnpm.io/installation for other platforms
```

This template requires **Node.js 26+**.

## Usage of this project template
For local development start with `pnpm install` to install all dependencies.
For Visual Studio Code (VSC) there is a workspace configuration file included.
Available scripts:
- `pnpm run build` — compile (type-check + lint + emit to `dist/`).
- `pnpm run typecheck` — type-check only (`tsc -b`), no emit.
- `pnpm run lint` — lint only.
- `pnpm test` — build + core unit tests (no external dependencies).
- `pnpm run test:integration` — build + core tests + integration tests (requires Docker).
- `pnpm start` — run the app (loads `.env` via `--env-file`).
- `pnpm start "test argument"` — run the app with a CLI argument.

Launch configs of VS Code can be found in `.vscode/launch.json`.

## Docker Setup
To build a local image:
```bash
docker buildx build -t jni-ts-template .
```

To run with Docker Compose (uses `docker-compose.yaml` at the repo root):
```bash
docker compose up --build -d
```

CI/CD publishing is handled externally (Forgejo/Woodpecker).

### Optional: Add an alias to run the docker container as a CLI tool
```shell
alias yourcommand='docker container run --rm jni-ts-template'
```

## Setting env variables
Copy `env.example` to `.env` in the project root and fill in your values:
```bash
cp env.example .env
```

The `.env` file is loaded natively by Node.js via the `--env-file` flag — no `dotenv`
package is needed. The file is listed in `.gitignore` and will not be committed.

```
TEST_VAR="Test value"
```

For VSC debugging, ensure your launch configuration includes either
`"envFile": "${workspaceFolder}/.env"` or `"--env-file=.env"` in `runtimeArgs`.

# Update all packages to the latest version
Run `pnpm update --latest -i` to update all packages interactively.

The `-i` flag presents a checklist of available updates — toggle individual packages
with space, confirm with enter. This lets you review and select updates rather than
applying everything at once.

**Note on `minimumReleaseAge`:** `pnpm-workspace.yaml` is configured with a 7-day
supply-chain cooldown (`minimumReleaseAge: 10080`). Packages published less than 7 days
ago will be refused during install/lockfile-verification. If a bump is rejected, either
wait out the cooldown window or add the package name to `minimumReleaseAgeExclude` in
`pnpm-workspace.yaml` for a one-off bypass.

# Add a package to the project
`pnpm add -D <package>` to add a package to the project. The `-D` flag is for development dependencies.

# How to use
<< Insert your description here. >>

# Release History

## v3.0.0
- Upgraded to Node.js 26+ and TypeScript 6 (`es2025` target, ESM-only via `NodeNext`)
- pnpm 11, self-managed via the `packageManager` field (Corepack removed in Node 25+)
- ESLint 9 → 10; migrated to flat config using the unified `typescript-eslint` package
  with `strictTypeChecked` preset (removed `FlatCompat`, `@eslint/eslintrc`, and the
  split `@typescript-eslint/eslint-plugin` / `@typescript-eslint/parser` packages)
- Added `minimumReleaseAge` (7-day) supply-chain cooldown in `pnpm-workspace.yaml`
- testcontainers 11 → 12
- Native `--env-file` loading (removed `dotenv` dependency)
- Added `env.example` as a tracked template for `.env`
- Removed the neo4j testcontainers integration example (was introduced in v2.0.0)
- Removed the `docker:build-push` script (CI/CD publishing handled externally)

## v2.1.0
- Integrate Theo's trycatch

## v2.0.0 from 2025-02-22
- Update of Typescript settings
- Update of ES Linting including new config file
- Update of all libraries to current version
- Introduction of core unit tests and integration tests
- Example for integration tests w/ testcontainers and a neo4j DB
- Docker image build includes core unit tests and only depends on itself
- Update of shared types and functions
- Update of the README file

## v1.2.2 
- Better documentation and misusage.

## v1.2.1
- Fixing missing env variable in docker image.
- Add /logs to .gitignore.

## v1.2.0
- Merge in enums, sharedFunction, logger.
- Introduce winston.

## v1.1.1
- Updated to latest libraries.

## v1.1.0
- Even tougher linting rules.
- Multi stage docker build with Node 18 (for Rapsberry PI compatibility).


## v1.0.0
- TypeScript 5.3
- All packages updated to latest version.
- Tougher linting rules.

## v0.7.0
- Update packages (TS to 5.1)
- Update Docker image to use Node 20.
- Add optional package with test.
- Add tests for diverse useful use cases (e.g., using workers w/ multi cores).
- Remove obsolete greeter code.

## v0.6.0
- Add docker image creation (e.g. for an encapsulated CLI rool).
- Add helpers for reading the version, parsing .env file and user arguments.

## v0.5.1
- Remove not used workspace configuration.

## v0.5.0
- Upgrade all components to latest versions.
- Use 'NodeNext' for module resolution.
- Replace 'npm' with 'pnpm'.
- Replace 'jest' with 'mocha'.

## v0.4.1
- Template restrictions removed in linting.

## v0.4.0
- NCU guide added to readme.
- Upgraded to latest versions of TypeScript (4.5.2), Jest (27.4.3) and the rest.

## v0.3.0
- Upgrade of TypeScript to 4.3

## v0.2.0
- Support for dotenv

## v0.1.0
- Initial commit.
