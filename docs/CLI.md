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

The hook runs two commands on every commit:
1. `saedra memory change log --from-git --no-prompt` — logs the change event automatically
2. `saedra memory compress` — updates `.saedra-context.json` with the latest snapshot

No manual interaction required.

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

### `saedra memory state update --ai`

Generates the architecture state automatically using AI. Fetches all active decisions and the last 10 change events, sends them to Claude, and proposes a compressed `ArchitectureState` for review before saving.

Requires AI to be configured first via `saedra ai setup`.

```bash
$ saedra memory state update --ai
Using project: my-infra (from .saedra)

  AI Architecture Compression

  Fetching project memory...
  Found 2 active decision(s) and 5 change event(s).
  Sending to AI for compression...

  Thinking...............................................

  Proposed Architecture State:

  Summary:
    Monorepo (Turborepo + pnpm) combining auth, project management, AI via AWS Bedrock...

  Core Principles:
    - TypeScript strict across all packages
    - ...

  Critical Paths:
    - apps/api → project-service → db-queries → db-connector → Supabase
    - ...

  Constraints:
    - Node.js >= 18 required
    - ...

  Active Decisions:
    - DEC-2026-03-09-use-supabase-as-primary-databa

? Save this as the new architecture state? (Y/n)

Architecture state updated successfully.
```

The AI reads the current state as context and evolves it — preserving what is still accurate and incorporating what changed.

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

### `saedra memory change analyze [id]`

Analyze the architectural impact of a change event using AI. By default, analyzes the most recent change event. Optionally accepts a change ID to analyze a specific event.

Loads the full project context (architecture state, active decisions, violation rules) alongside the change event and sends everything to the configured AI, streaming a structured impact analysis.

Requires AI to be configured first via `saedra ai setup`.

```bash
$ saedra memory change analyze
Using project: my-infra (from .saedra)

  AI Impact Analysis

  Analyzing: CHG-2026-03-06-add-git-hook-support
  Summary:   Add git hook support
  Files:     packages/cli/src/commands/context.ts, packages/cli/src/index.ts

  ──────────────────────────────────────────────────
  ## Impact Summary
  This change introduces automatic change event tracking via a post-commit git hook,
  extending the memory system's capture surface without modifying existing schemas or flows.
  It is a purely additive feature with no breaking changes.

  ## Affected Decisions
  - **DEC-2026-03-04-use-document-type-fie** — reinforced: change events continue to be
    stored as `type=change` documents, consistent with the document-type strategy.

  ## Rule Compliance
  No violation rules are touched by this change. The hook only calls an existing CLI
  command (`saedra memory change log --from-git --no-prompt`) — no new imports or
  structural patterns introduced.

  ## Risk Assessment
  **Low.** The change is additive and isolated to the CLI init flow. No shared packages
  or API routes are modified.

  ## Overlooked Concerns
  The recorded impact was empty. Worth noting: if `.git/hooks/post-commit` already exists
  on a teammate's machine, the hook is silently skipped — this should be documented.
  ──────────────────────────────────────────────────
```

To analyze a specific change event by ID:

```bash
$ saedra memory change analyze CHG-2026-03-04-add-type-column
Using project: my-infra (from .saedra)

  AI Impact Analysis

  Analyzing: CHG-2026-03-04-add-type-column
  ...
```

---

### `saedra memory rule add`

Add a new architectural violation rule. Generates an ID in the format `RULE-YYYY-MM-DD-slug` and stores it as a structured document of `type=rule`. Rules define constraints that must not be broken — they are the ground truth used by `saedra review`.

```bash
$ saedra memory rule add
Using project: my-infra (from .saedra)

  New Violation Rule

? Description (what must not happen?): Controllers cannot import db-connector directly
? Severity: > high
              medium
              low
? Related decision (ID, leave empty if none): DEC-2026-03-04-use-document-type-fie

? Save rule "RULE-2026-03-23-controllers-cannot-impor"? (Y/n)

Rule "RULE-2026-03-23-controllers-cannot-impor" saved successfully.
```

### `saedra memory rule list`

List all violation rules recorded for the project.

```bash
$ saedra memory rule list
Using project: my-infra (from .saedra)

  Violation Rules — my-infra

  RULE-2026-03-23-controllers-cannot-impor  [HIGH]
    Constraint: Controllers cannot import db-connector directly
    Decision:   DEC-2026-03-04-use-document-type-fie
```

### `saedra memory compress`

Snapshot the full architecture context to a local `.saedra-context.json` file. Fetches state, active decisions, the 10 most recent change events, and all violation rules from the server and writes them to disk.

Useful for offline access, CI pipelines, and fast context injection without requiring network access.

```bash
$ saedra memory compress
Using project: my-infra (from .saedra)

  Compressing architecture context — my-infra

  Fetching architecture state...    ✓
  Fetching active decisions...      ✓ (2)
  Fetching recent changes...        ✓ (5)
  Fetching violation rules...       ✓ (1)

  ✓  Snapshot saved to .saedra-context.json
     State:      1 architecture state
     Decisions:  2 active decisions
     Changes:    5 recent changes
     Rules:      1 violation rule
     Generated:  2026-04-21T14:32:00Z
```

The generated file includes a `generated_at` timestamp so you always know when the snapshot was taken:

```json
{
  "project": "my-infra",
  "project_id": "798593a3-...",
  "generated_at": "2026-04-13T00:00:00Z",
  "state": { ... },
  "decisions": [ ... ],
  "changes": [ ... ],
  "rules": [ ... ]
}
```

`.saedra-context.json` is added to `.gitignore` automatically — it is a local snapshot, not a committed artifact.

**Automatic update via git hook:** when installed with `saedra init --with-hooks`, the post-commit hook runs `saedra memory compress` after every commit, keeping the snapshot in sync with the latest change event automatically.

---

### `saedra context`

Print a compressed architecture context designed to be injected into AI prompts. Fetches the architecture state, active decisions, the 5 most recent change events, and all violation rules in parallel, then formats them as a single block.

```bash
$ saedra context
Using project: my-infra (from .saedra)

  [ARCHITECTURE CONTEXT — my-infra]

  Summary:
    Monorepo (Turborepo + pnpm) with auth, project management, and AI via AWS Bedrock.

  Core Principles:
    - TypeScript strict across all packages
    - Supabase as single source of truth
    - CLI stateless except ~/.saedra/config.json

  Critical Paths:
    - apps/api → project-service → db-queries → db-connector → Supabase

  Constraints:
    - Node.js >= 18
    - No direct DB access from CLI

  Active Decisions (2):
    - DEC-2026-03-04-use-document-type-fie
    - DEC-2026-03-09-use-supabase-as-primary-databa

  Recent Changes (3):
    - CHG-2026-03-06-add-git-hook-support — Add git hook support
    - CHG-2026-03-05-add-memory-change-comm — Add memory change commands to CLI
    - CHG-2026-03-04-add-type-column — Add type column to documents table

  Violation Rules (1):
    - RULE-2026-03-23-controllers-cannot-impor [HIGH] — Controllers cannot import db-connector directly
```

#### `saedra context --json`

Output the full context as JSON. Useful for piping into other tools or feeding into AI APIs programmatically.

```bash
$ saedra context --json
{
  "project": "my-infra",
  "state": { "summary": "...", "core_principles": [...], ... },
  "decisions": [...],
  "changes": [...],
  "rules": [...]
}
```

#### `saedra context --copy`

Copy the context output directly to the clipboard instead of printing it. Useful for pasting into AI chat interfaces without piping or selecting text.

```bash
$ saedra context --copy
Using project: my-infra (from .saedra)

  Context copied to clipboard. (my-infra)
```

On Linux requires `xclip`, `xsel`, or `wl-clipboard` to be installed.

#### `saedra context --offline`

Use the local `.saedra-context.json` snapshot instead of fetching from the server. Same fallback behavior as `saedra review --offline`.

```bash
$ saedra context --offline
```

---

### `saedra explain`

Print a human-readable architecture overview. Same data as `saedra context` but formatted for onboarding new developers or quickly understanding an unfamiliar repository.

```bash
$ saedra explain
Using project: my-infra (from .saedra)

  my-infra — Architecture Overview

  What is this project?
    Monorepo (Turborepo + pnpm) with auth, project management, and AI via AWS Bedrock.

  Communication Patterns:
    - apps/api → project-service → db-queries → db-connector → Supabase

  Core Principles:
    - TypeScript strict across all packages
    - Supabase as single source of truth

  Constraints:
    - Node.js >= 18
    - No direct DB access from CLI

  Key Decisions:
    - Use document type field for memory (DEC-2026-03-04-use-document-type-fie)
    - Use Supabase as primary database (DEC-2026-03-09-use-supabase-as-primary-databa)

  Recent Changes:
    - [2026-03-06] Add git hook support
    - [2026-03-05] Add memory change commands to CLI
    - [2026-03-04] Add type column to documents table
```

---

### `saedra timeline`

Show a chronological timeline of all architectural decisions and change events, grouped by month.

```bash
$ saedra timeline
Using project: my-infra (from .saedra)

  Architecture Timeline — my-infra

  2026-03
    [DEC] Use document type field for memory
    [CHG] Add type column to documents table
    [CHG] Add memory change commands to CLI
    [DEC] Use Supabase as primary database
    [CHG] Add git hook support

```

Entries are sorted chronologically within each month. `[DEC]` entries come from `saedra memory decision add` and `[CHG]` entries from `saedra memory change log`.

---

### `saedra ai setup`

Configure the AI provider and API key used by AI-powered commands (e.g. `saedra memory state update --ai`). The configuration is saved to `~/.saedra/ai.json` with restricted permissions (`0600`).

```bash
$ saedra ai setup

  AI Setup

? AI provider: > Claude (Anthropic)
                 OpenAI
? Anthropic API key (sk-ant-...): **********************

  AI configured: claude

  Config saved to: /home/user/.saedra/ai.json
```

If AI is already configured, prompts for confirmation before overwriting.

### `saedra ai status`

Show the currently configured AI provider and a masked version of the API key.

```bash
$ saedra ai status

  AI Configuration

  Provider: claude
  API Key:  sk-ant-a...3f2d
  Config:   /home/user/.saedra/ai.json
```

### `saedra ai remove`

Remove the AI configuration.

```bash
$ saedra ai remove

? Remove AI configuration (claude)? (y/N)

  AI configuration removed.
```

### `saedra ai feature [description]`

Generate architecture-aligned implementation guidance for a feature. Loads the full project context (architecture state, active decisions, recent changes) and sends it alongside your description to the configured AI, streaming the response directly to the terminal.

Requires AI to be configured first via `saedra ai setup`.

```bash
$ saedra ai feature "implement team creation endpoint"
Using project: my-infra (from .saedra)

  AI Feature — Context Injection

  Loading architecture state...   ✓
  Active decisions loaded:        2
  Recent changes loaded:          5
  Sending to AI...

  ──────────────────────────────────────────────────
  Suggestion for: implement team creation endpoint

  ## Analysis
  This feature fits naturally within the existing architecture...

  ## Implementation Plan
  1. Create teams table in Supabase (aligns with DEC-2026-03-09)
  2. Add queries in packages/db-queries/src/teams.ts
  ...

  ## Constraints Applied
  - No direct DB access — all queries go through db-queries
  - TypeScript strict required
  ──────────────────────────────────────────────────
```

When called without a description argument, prompts interactively:

```bash
$ saedra ai feature
? Describe the feature you want to implement: implement team creation endpoint
```

### `saedra review`

Validate the current diff against all violation rules and active architectural decisions. Loads changed files via `git diff HEAD`, fetches rules and decisions from the project, sends everything to the configured AI, and reports per-file results.

Requires AI to be configured first via `saedra ai setup`.

```bash
$ saedra review
Using project: my-infra (from .saedra)

  Architectural Review

  Analyzing 4 changed files...   ✓
  Loaded 1 violation rule and 2 active decisions.
  Sending to AI...

  ──────────────────────────────────────────────────

  ⚠  VIOLATION  packages/cli/src/commands/projects.ts
     Controller importing db-connector bypasses the query abstraction layer.
     Violates: RULE-2026-03-23-controllers-cannot-impor — Controllers cannot import db-connector directly
     Detail:   Import of @repo/db-connector found on line 3
     Decision: DEC-2026-03-04-use-document-type-fie

  ✓  OK  packages/db-queries/src/teams.ts
     New module follows the existing db-queries pattern.

  ✓  OK  apps/api/src/routes/teams.ts
     Route follows the existing controller structure.

  ✓  OK  packages/project-service/src/index.ts
     No architectural concerns.

  ──────────────────────────────────────────────────

  Result: 1 violation — review before opening PR
```

#### `saedra review --staged`

Analyze only files in the staging area (`git diff --staged`) instead of all changes since HEAD.

```bash
$ saedra review --staged
```

#### `saedra review --json`

Output results as JSON. Exits with code `1` if any violations are found — intended for CI pipelines.

```bash
$ saedra review --json
{
  "project": "my-infra",
  "total_violations": 1,
  "files": [
    {
      "file": "packages/cli/src/commands/projects.ts",
      "status": "violation",
      "violations": [
        {
          "rule_id": "RULE-2026-03-23-controllers-cannot-impor",
          "detail": "Import of @repo/db-connector found on line 3"
        }
      ],
      "note": "Controller importing db-connector bypasses the query abstraction layer."
    },
    {
      "file": "packages/db-queries/src/teams.ts",
      "status": "ok",
      "violations": [],
      "note": "New module follows the existing db-queries pattern."
    }
  ]
}
```

Use in GitHub Actions:

```yaml
- name: Saedra Architecture Review
  run: saedra review --json
  env:
    SAEDRA_API_URL: ${{ secrets.SAEDRA_API_URL }}
```

#### `saedra review --base <ref>`

Compare files changed between a git ref and HEAD instead of using the working tree. Useful in CI to review only the commits in a PR branch.

```bash
$ saedra review --base origin/main
```

#### `saedra review --offline`

Skip the server entirely and use the local `.saedra-context.json` snapshot. Exits with an error if no snapshot is found.

```bash
$ saedra review --offline
```

If the server is unreachable but a snapshot exists, `saedra review` falls back to the snapshot automatically and prints a warning to stderr. `--offline` forces this path without attempting the server at all.

#### CI workflow (offline)

The recommended pattern for CI environments without persistent server access:

```yaml
- name: Snapshot architecture context
  run: saedra memory compress
  env:
    SAEDRA_API_URL: ${{ secrets.SAEDRA_API_URL }}

- name: Architectural review (offline)
  run: saedra review --base origin/main --offline --json
```

`saedra memory compress` runs once (e.g. on a schedule or before the pipeline) and writes `.saedra-context.json` to the workspace. The review step then uses the snapshot without requiring server access during the review itself.

---

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
    │   ├── helpers.ts      # Shared utilities: requireAuth, parseError, handleFetchError, selectProject, selectDocument
    │   ├── prompts.ts      # AI prompt constants and builders: REVIEW/FEATURE/COMPRESS/ANALYZE system prompts + buildReviewPrompt, buildFeaturePrompt, buildCompressPrompt, buildAnalyzePrompt
    │   ├── context.ts      # .saedra context file management (init, findSaedraContext)
    │   ├── arch-context.ts # context / explain / memory compress (contextCommand, explainCommand, memoryCompressCommand, fetchState, fetchDecisions, fetchChanges, fetchRules)
    │   ├── projects.ts     # project create / list / delete
    │   ├── documents.ts    # doc create / list / read / edit / push / delete
    │   ├── memory.ts       # memory state view/update/update --ai, decision add/list, change log/list/analyze, rule add/list, timeline
    │   ├── ai.ts           # ai setup / status / remove (getAiConfig, AiConfig, AiProvider)
    │   ├── ai-client.ts    # shared AI abstraction (callAI, streamAI) — supports Claude and OpenAI
    │   └── feature.ts      # ai feature (aiFeatureCommand)
    └── memory/
        └── schemas.ts      # ArchitectureState, Decision, ChangeEvent, ViolationRule, DocumentType
```

## Where credentials are stored

```
~/.saedra/
├── config.json    # { email, userId, token, apiUrl }
└── ai.json        # { provider, apiKey } — permissions 0600
```
