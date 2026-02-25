# Saedra CLI

Command-line tool to interact with Saedra from your terminal.

## Installation

### For end users (production)

```bash
npm install -g @saedra/cli
```

After installing, the `saedra` command will be available globally.

### For developers (local)

```bash
# 1. Install dependencies from the monorepo root
pnpm install

# 2. Build the CLI
pnpm --filter @saedra/cli build

# 3. Link it globally so you can use "saedra" in your terminal
cd packages/cli && pnpm link --global
```

To unlink later:

```bash
pnpm unlink --global @saedra/cli
```

To run without linking globally:

```bash
node packages/cli/dist/index.js <command>
```

## Configuration

| Variable | Description | Default |
|---|---|---|
| `SAEDRA_API_URL` | API server URL | `https://saedra-api.onrender.com` |

In development, point the CLI to your local API:

```bash
export SAEDRA_API_URL=http://localhost:3002
```

Or inline per command:

```bash
SAEDRA_API_URL=http://localhost:3002 saedra login
```

## Commands

### `saedra login`

Log in to your Saedra account. Prompts for email and password, then authenticates against the API.

Credentials are saved to `~/.saedra/config.json`.

```bash
$ saedra login

  Saedra - Login

? Email: user@example.com
? Password: ********

Login successful! Welcome, user@example.com
```

### `saedra whoami`

Show the currently logged-in user.

```bash
$ saedra whoami
Logged in as: user@example.com
```

### `saedra status`

Check the API connection and login status.

```bash
$ saedra status

  Saedra - Status

  API:    online (0.1.0)
  Server: https://saedra-api.onrender.com
  User:   user@example.com
```

### `saedra logout`

Remove saved credentials and log out.

```bash
$ saedra logout
Logged out successfully.
```

### `saedra project create`

Create a new project linked to the logged-in account. Prompts for a project name.

```bash
$ saedra project create

? Project name: my-infra

Project created successfully!
  Name: my-infra
  ID:   798593a3-139e-4ae1-a810-db1c00284b7d
```

### `saedra project list`

List all projects belonging to the logged-in user.

```bash
$ saedra project list

  Your projects:

  - my-infra
      ID:      798593a3-139e-4ae1-a810-db1c00284b7d
      Created: 11/26/2025
  - saedra-test
      ID:      d1cab6d0-6918-49f5-bea2-4cb0c8e76a58
      Created: 12/2/2025
```

### `saedra project delete`

Delete a project. Shows an interactive list of your projects to select from.

```bash
$ saedra project delete

? Select a project: > my-infra
                      saedra-test

Project deleted successfully.
```

### `saedra doc create`

Create a new document inside a project. Shows an interactive project selector, then prompts for the document name and an optional local file path to use as content (leave empty to create a blank document).

```bash
$ saedra doc create

? Select a project: > my-infra
                      saedra-test
? Document name (e.g. README.md): architecture.md
? File path (leave empty for blank content): ./docs/architecture.md

Document created successfully!
  Name: architecture.md
  ID:   a1b2c3d4-0000-4ae1-a810-db1c00284b7d
```

### `saedra doc list`

List all documents belonging to a project. Shows an interactive project selector.

```bash
$ saedra doc list

? Select a project: > my-infra
                      saedra-test

  Documents in my-infra:

  - README.md
      ID:      a1b2c3d4-0000-4ae1-a810-db1c00284b7d
      Created: 2/10/2026
      Updated: 2/10/2026
  - architecture.md
      ID:      e5f6a7b8-0000-4ae1-a810-db1c00284b7d
      Created: 2/23/2026
      Updated: 2/23/2026
```

### `saedra doc read`

Print the content of a document to the terminal. Shows interactive selectors for project and document.

```bash
$ saedra doc read

? Select a project:  > my-infra
                       saedra-test
? Select a document: > README.md
                       architecture.md

  README.md

# My Project
...
```

### `saedra doc edit`

Replace the content of an existing document with the contents of a local file. Shows interactive selectors for project and document.

```bash
$ saedra doc edit

? Select a project:  > my-infra
                       saedra-test
? Select a document: > README.md
                       architecture.md
? File path with new content: ./docs/README.md

Document updated successfully.
```

### `saedra doc delete`

Delete a document. Shows interactive selectors for project and document.

```bash
$ saedra doc delete

? Select a project:  > my-infra
                       saedra-test
? Select a document: > README.md
                       architecture.md

Document deleted successfully.
```

### `saedra --version`

Show the CLI version.

### `saedra --help`

List all available commands.

## Development workflow

```bash
# 1. Start the local infrastructure and API
pnpm run dev:infra
pnpm run dev --filter @saedra/cli --filter ./apps/api

# 2. Point CLI to local API
export SAEDRA_API_URL=http://localhost:3002

# 3. Build the CLI (or use dev mode for watch)
pnpm --filter @saedra/cli build
# or
pnpm --filter @saedra/cli dev

# 4. Test commands
node packages/cli/dist/index.js status
node packages/cli/dist/index.js login
```

## File structure

```
packages/cli/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts            # Entry point - registers all commands
    └── commands/
        ├── login.ts        # Login, config management (getConfig, clearConfig, SaedraConfig)
        ├── helpers.ts      # Shared interactive selectors (selectProject, selectDocument)
        ├── projects.ts     # project create / list / delete
        └── documents.ts    # doc create / list / read / edit / delete
```

## Where credentials are stored

```
~/.saedra/
└── config.json    # { email, userId, apiUrl }
```
