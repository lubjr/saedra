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

### `saedra init`

Link the current folder to a Saedra project. Creates a `.saedra` file so that all commands in this directory (and subdirectories) automatically use the linked project without prompting.

```bash
$ saedra init

? Select a project: > my-infra
                      saedra-test

Linked to project my-infra. Created .saedra
```

Once initialized, commands skip the project selector:

```bash
$ saedra doc push ./docs/architecture.md
Using project: my-infra (from .saedra)
Uploading architecture.md... ✓
```

The `.saedra` file can be committed (shared config) or added to `.gitignore` (personal config), depending on your preference.

#### `saedra init --with-hooks`

Links the project and also installs a git post-commit hook that automatically logs a change event after every commit.

```bash
$ saedra init --with-hooks

? Select a project: > my-infra
                      saedra-test

Linked to project my-infra. Created .saedra
  Created: .saedra-hooks/post-commit
  Installed: .git/hooks/post-commit
  Every commit will now log a change event automatically.
  Tip: commit .saedra-hooks/ so teammates can install with: cp .saedra-hooks/post-commit .git/hooks/post-commit
```

The hook runs `saedra memory change log --from-git --no-prompt` on every commit, pre-filling the summary from the commit message and the file list from `git diff`. No manual interaction required.

If `.git/hooks/post-commit` already exists, the hook is **not** overwritten. A message is shown with the manual copy command instead.

Teammates can activate the hook from the committed `.saedra-hooks/` directory:

```bash
cp .saedra-hooks/post-commit .git/hooks/post-commit
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

### `saedra doc read [document]`

Print the content of a document to the terminal. When called with a document name, fetches it directly without interactive prompts. Without arguments, shows interactive selectors for project and document.

```bash
# Direct access by name (non-interactive)
$ saedra doc read ANALYSIS.md
Using project: my-infra (from .saedra)

  ANALYSIS.md

# My Project
...

# Interactive mode
$ saedra doc read

? Select a project:  > my-infra
                       saedra-test
? Select a document: > README.md
                       architecture.md

  README.md

# My Project
...
```

The document name match is case-insensitive.

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

### `saedra doc push [file]`

Push a local `.md` file to a project in a single step. Uses the filename as the document name and automatically creates or updates the document depending on whether it already exists.

```bash
$ saedra doc push ./docs/architecture.md

? Select a project:  > my-infra
                       saedra-test

Document created successfully!
  Name: architecture.md
  ID:   a1b2c3d4-0000-4ae1-a810-db1c00284b7d
```

When called without arguments, lists the `.md` files found in the current directory for interactive selection:

```bash
$ saedra doc push

? Select a file to push: > architecture.md
                           README.md
? Select a project:      > my-infra
                           saedra-test

Document created successfully!
  Name: architecture.md
  ID:   a1b2c3d4-0000-4ae1-a810-db1c00284b7d
```

If the document already exists in the project, it asks for confirmation before updating:

```bash
$ saedra doc push ./docs/architecture.md

? Select a project: > my-infra
? Document "architecture.md" already exists in my-infra. Update it? (Y/n)

Document "architecture.md" updated successfully.
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

### `saedra memory state view`

Display the current architecture state of the linked project.

```bash
$ saedra memory state view
Using project: my-infra (from .saedra)

  Architecture State — my-infra
  Version: 2026-03-04

  Summary:
    Monorepo with three packages: cli, db-queries, project-service.

  Core Principles:
    - Single source of truth in Supabase
    - CLI is stateless except for ~/.saedra/config.json

  Critical Paths:
    - auth token → all API calls

  Constraints:
    - No direct DB access from CLI

  Active Decisions:
    - DEC-2026-03-04-document-type
```

If no state exists yet, it prompts to create one with `saedra memory state update`.

### `saedra memory state update`

Interactively fill in or overwrite the architecture state. Creates the record if none exists, or updates it in place.

```bash
$ saedra memory state update
Using project: my-infra (from .saedra)

  Architecture State — Update

? Summary (describe the current architecture): Monorepo with three packages...
  Core principles: (enter each item, empty line to finish)
  [1] Single source of truth in Supabase
  [2]
  Critical paths: (enter each item, empty line to finish)
  [1] auth token → all API calls
  [2]
  Constraints: (enter each item, empty line to finish)
  [1] No direct DB access from CLI
  [2]
  Active decision IDs (e.g. DEC-2026-03-04-auth): (enter each item, empty line to finish)
  [1] DEC-2026-03-04-document-type
  [2]
? Save this architecture state? (Y/n)

Architecture state updated successfully.
```

### `saedra memory decision add`

Record a new architectural decision. Generates an ID in the format `DEC-YYYY-MM-DD-slug` and stores it as a structured document of `type=decision`.

```bash
$ saedra memory decision add
Using project: my-infra (from .saedra)

  New Decision

? Title: Use document type field for memory
? Context (why was this decision needed?): Need to differentiate free docs from memory records.
? Decision (what was decided?): Add a type column to documents table.
? Risk level: low
  Impact: (enter each item, empty line to finish)
  [1] All document queries must filter by type
  [2]
  Affected modules/domains: (enter each item, empty line to finish)
  [1] db-queries
  [2] project-service
  [3]
  Constraints introduced: (enter each item, empty line to finish)
  [1]
? Supersedes (decision ID, leave empty if none):
? Save decision "DEC-2026-03-04-use-document-type-fie"? (Y/n)

Decision "DEC-2026-03-04-use-document-type-fie" saved successfully.
```

### `saedra memory decision list`

List all architectural decisions recorded for the project.

```bash
$ saedra memory decision list
Using project: my-infra (from .saedra)

  Decisions — my-infra

  DEC-2026-03-04-use-document-type-fie
    Title:    Use document type field for memory
    Status:   active  Risk: [LOW]
    Decision: Add a type column to documents table.
    Affects:  db-queries, project-service
```

### `saedra memory change log`

Log a change event interactively. Generates an ID in the format `CHG-YYYY-MM-DD-slug` and stores it as a structured document of `type=change`.

```bash
$ saedra memory change log
Using project: my-infra (from .saedra)

  New Change Event

? Summary: Add memory change commands to CLI
  Files changed: (enter each item, empty line to finish)
  [1] packages/cli/src/commands/memory.ts
  [2] packages/cli/src/index.ts
  [3]
? Architectural impact: Extends memory subcommand with change tracking
? Risk assessment: low — additive only
  Related decision IDs (e.g. DEC-2026-03-04-auth): (enter each item, empty line to finish)
  [1] DEC-2026-03-04-use-document-type-fie
  [2]
? Save change "CHG-2026-03-05-add-memory-change-comm"? (Y/n)

Change event "CHG-2026-03-05-add-memory-change-comm" saved successfully.
```

### `saedra memory change log --from-git`

Same as `change log` but pre-fills `summary` from the last git commit message and `files_changed` from `git diff --name-only HEAD~1 HEAD`. Prompts for confirmation before using the pre-filled values.

```bash
$ saedra memory change log --from-git
Using project: my-infra (from .saedra)

  New Change Event

? Summary: [pre-filled: Add memory change commands to CLI]
  Files changed (pre-filled from git):
    packages/cli/src/commands/memory.ts
    packages/cli/src/index.ts
? Use these files? (Y/n)
? Architectural impact: Extends memory subcommand with change tracking
? Risk assessment: low — additive only
  Related decision IDs ...: (enter each item, empty line to finish)
  [1]
? Save change "CHG-2026-03-05-add-memory-change-comm"? (Y/n)

Change event "CHG-2026-03-05-add-memory-change-comm" saved successfully.
```

Must be run inside a git repository with at least one commit.

#### `saedra memory change log --from-git --no-prompt`

Fully automatic mode. Uses the commit message as summary and `git diff` as file list, skips all interactive prompts, and saves the change event directly. This is the mode used by the git hook installed via `saedra init --with-hooks`.

```bash
$ saedra memory change log --from-git --no-prompt
Using project: my-infra (from .saedra)
Change event "CHG-2026-03-06-add-git-hook-support" saved.
```

### `saedra memory change list`

List all change events for the project in chronological order.

```bash
$ saedra memory change list
Using project: my-infra (from .saedra)

  Change Timeline — my-infra

  CHG-2026-03-05-add-memory-change-comm
    Summary: Add memory change commands to CLI
    Impact:  Extends memory subcommand with change tracking
    Risk:    low — additive only
    Files:   packages/cli/src/commands/memory.ts, packages/cli/src/index.ts
    Decisions: DEC-2026-03-04-use-document-type-fie
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
    ├── commands/
    │   ├── login.ts        # Login, config management (getConfig, clearConfig, SaedraConfig)
    │   ├── helpers.ts      # Shared interactive selectors (selectProject, selectDocument)
    │   ├── context.ts      # .saedra context file management (init, findSaedraContext)
    │   ├── projects.ts     # project create / list / delete
    │   ├── documents.ts    # doc create / list / read / edit / push / delete
    │   └── memory.ts       # memory state view/update, memory decision add/list, memory change log/list
    └── memory/
        └── schemas.ts      # ArchitectureState, Decision, ChangeEvent, DocumentType
```

## Where credentials are stored

```
~/.saedra/
└── config.json    # { email, userId, apiUrl }
```
