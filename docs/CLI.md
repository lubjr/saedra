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
        └── login.ts        # Login, config management (getConfig, clearConfig)
```

## Where credentials are stored

```
~/.saedra/
└── config.json    # { email, userId, apiUrl }
```
