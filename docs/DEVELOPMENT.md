# Development Guide

This document covers common development workflows, commands, and troubleshooting steps for the Saedra project.

## Table of Contents

- [Available Commands](#available-commands)
- [Common Workflows](#common-workflows)
- [Cache Management](#cache-management)
- [Troubleshooting](#troubleshooting)
- [Development Tips](#development-tips)

## Available Commands

### Core Commands

```bash
# Development
pnpm run dev              # Start development server
pnpm run dev:fresh        # Clean cache + start dev server

# Building
pnpm run build            # Build all packages and apps
pnpm run build:fresh      # Clean cache + build

# Infrastructure
pnpm run dev:infra        # Start Docker infrastructure (databases, etc.)
pnpm run stop:infra       # Stop Docker infrastructure
pnpm run dev:apps         # Start only web and API apps
pnpm run dev:all          # Start infra + apps together

# Code Quality
pnpm run lint             # Run linters
pnpm run format           # Format code with Prettier
pnpm run check-types      # TypeScript type checking
```

### Cache Management Commands

```bash
# Clean build cache (recommended)
pnpm run clean

# Full clean including node_modules (nuclear option)
pnpm run clean:all
```

## Common Workflows

### 1. Starting Development

**Normal start:**
```bash
pnpm run dev
```

**Fresh start (recommended after pulling changes):**
```bash
pnpm run dev:fresh
```

**Full stack development:**
```bash
# Terminal 1: Infrastructure
pnpm run dev:infra

# Terminal 2: Applications (after infra is ready)
pnpm run dev:apps

# OR use the combined command
pnpm run dev:all
```

### 2. Making Style Changes

When working on CSS/styling:

1. Make your changes to the code
2. Save the file
3. **If changes don't appear:**
   ```bash
   # Stop the dev server (Ctrl+C)
   pnpm run dev:fresh
   ```

**Why?** Tailwind and Next.js cache can sometimes hold onto old styles. `dev:fresh` ensures you're seeing the latest changes.

### 3. Building for Production

**Standard build:**
```bash
pnpm run build
```

**Clean build (recommended before deployment):**
```bash
pnpm run build:fresh
```

### 4. After Pulling Changes

```bash
# If only code changed
pnpm run dev:fresh

# If package.json or dependencies changed
pnpm run clean:all
pnpm install
pnpm run dev
```

### 5. Fixing Type Errors

```bash
# Check for type errors
pnpm run check-types

# Fix formatting issues
pnpm run format

# Run linters
pnpm run lint
```

## Cache Management

### What Gets Cached?

The project uses multiple caching layers:

- **`.next/`** - Next.js build cache (per app)
- **`.turbo/`** - Turbo monorepo cache
- **`node_modules/.cache/`** - Various tool caches (Babel, etc.)
- **`packages/*/dist/`** - Compiled package outputs
- **`packages/*/.next/`** - Next.js cache in packages

### When to Clean Cache?

#### Clean Cache (`pnpm run clean`)

**Use when:**
- ✅ Styles not updating after changes
- ✅ Components not reflecting changes
- ✅ Build seems to use old code
- ✅ After switching branches with significant changes
- ✅ Before important builds/deploys

**What it does:**
```bash
# Removes:
# - .next directories
# - .turbo cache
# - node_modules/.cache
# - packages/*/dist
# - packages/*/.next
```

**Preserves:**
- `node_modules/` (dependencies stay installed)
- Source code
- Configuration files

#### Full Clean (`pnpm run clean:all`)

**Use when:**
- ✅ Dependency issues or weird errors
- ✅ After updating major dependencies
- ✅ When `clean` doesn't solve the problem
- ✅ Corrupted `node_modules`

**What it does:**
```bash
# Removes everything from 'clean' plus:
# - All node_modules directories (root and packages)
```

**After running, you must:**
```bash
pnpm install
```

### Cache Cleaning Comparison

| Command | Speed | Use Case | Requires Reinstall |
|---------|-------|----------|-------------------|
| `pnpm run clean` | Fast | Style/build issues | ❌ No |
| `pnpm run clean:all` | Slow | Dependency issues | ✅ Yes |

## Troubleshooting

### Issue: Styles Not Updating

**Symptoms:**
- CSS changes don't appear in browser
- Tailwind classes not applying
- Old styles persist after code changes

**Solution:**
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clean cache and restart
pnpm run dev:fresh

# 3. Hard refresh browser
# - Chrome/Edge: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
# - Firefox: Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
```

**If still not working:**
```bash
pnpm run clean:all
pnpm install
pnpm run dev
```

### Issue: Build Fails After Pulling Changes

**Solution:**
```bash
# 1. Clean everything
pnpm run clean:all

# 2. Reinstall dependencies
pnpm install

# 3. Try building again
pnpm run build
```

### Issue: TypeScript Errors After Updates

**Solution:**
```bash
# 1. Clean build artifacts
pnpm run clean

# 2. Check types
pnpm run check-types

# 3. Restart TypeScript server in your editor
# VSCode: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: "Module not found" Errors

**Possible causes:**
1. Dependency not installed
2. Cached module resolution

**Solution:**
```bash
# 1. Install dependencies
pnpm install

# 2. If persists, clean and reinstall
pnpm run clean:all
pnpm install
```

### Issue: Docker Infrastructure Won't Start

**Solution:**
```bash
# 1. Stop existing containers
pnpm run stop:infra

# 2. Check Docker status
sudo systemctl status docker

# 3. Restart infrastructure
pnpm run dev:infra

# 4. Check logs
sudo docker-compose -f docker/docker-compose.yml logs
```

### Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or kill all Node processes (use carefully!)
pkill -f "node"
pkill -f "pnpm"

# Restart dev server
pnpm run dev
```

### Issue: Hover Effects Not Working (Border Color)

**Known Issue:** Global CSS `@apply border-border` can override hover states.

**Solution:** Use JavaScript event handlers for custom border colors on hover:

```tsx
<div
  className="border-2 border-zinc-700 transition-all"
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#14b8a6";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "";
  }}
>
  Content
</div>
```

See [STYLING.md](./STYLING.md#issue-1-border-color-override) for detailed explanation.

## Development Tips

### 1. Use `dev:fresh` Frequently

When working on UI/styles, use `dev:fresh` instead of `dev`:
```bash
pnpm run dev:fresh
```

This ensures you always see the latest changes without cache issues.

### 2. Clean Before Important Actions

Before:
- Creating a pull request
- Deploying to production
- Reporting a bug

Run:
```bash
pnpm run build:fresh
```

This ensures the issue isn't cache-related.

### 3. Editor Setup

**VSCode Recommended Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features (built-in)

**VSCode Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 4. Turbo Caching

Turbo caches task outputs. If you need to force rebuild:

```bash
# Clear Turbo cache only
rm -rf .turbo

# Or use full clean
pnpm run clean
```

### 5. Monorepo Package Changes

When changing code in `packages/*`:

1. Save the file
2. Turbo will auto-rebuild
3. Apps using the package will auto-reload

**If changes don't reflect:**
```bash
pnpm run dev:fresh
```

### 6. Working with Environment Variables

```bash
# .env file is loaded automatically via dotenv-cli
# Located at project root

# Test if env vars are loaded
echo $YOUR_ENV_VAR

# Restart dev server after changing .env
pnpm run dev:fresh
```

### 7. Debugging Build Issues

**Enable verbose output:**
```bash
# See what Turbo is doing
turbo run build --verbose

# See Next.js build details
cd apps/web
pnpm run build --debug
```

### 8. Check What's Running

```bash
# See all Node/pnpm processes
ps aux | grep -E "pnpm|node" | grep -v grep

# Check specific port
lsof -i :3000

# See Docker containers
sudo docker ps
```

## Quick Reference

### When Styles Don't Update
```bash
pnpm run dev:fresh
# + Hard refresh browser (Ctrl+Shift+R)
```

### When Build Breaks After Pull
```bash
pnpm run clean:all && pnpm install && pnpm run build
```

### When Dependencies Are Weird
```bash
pnpm run clean:all
pnpm install
```

### Before Deployment
```bash
pnpm run build:fresh
```

### Nuclear Option (Fix Everything)
```bash
# Stop all processes
pkill -f "pnpm"
pkill -f "node"

# Full clean
pnpm run clean:all

# Reinstall
pnpm install

# Restart
pnpm run dev:fresh
```

## Related Documentation

- [STYLING.md](./STYLING.md) - Styling system and known issues
- [Project README](../README.md) - General project information

---

**Last updated:** January 2026
