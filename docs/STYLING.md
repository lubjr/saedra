# Styling Guide

This document explains how styling works in the Saedra project and common issues you might encounter.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Global Styles](#global-styles)
- [Known Issues](#known-issues)
- [Design System](#design-system)
- [Best Practices](#best-practices)

## Overview

Saedra uses a centralized styling system based on **Tailwind CSS v4** with a shared design system across all packages. The styling is managed through the `@repo/ui` package and uses CSS variables for theming.

## Technology Stack

- **Tailwind CSS v4** - Utility-first CSS framework
- **CSS Variables (Custom Properties)** - For theming with OKLch color space
- **shadcn/ui** - Pre-built accessible components
- **Lucide React** - Icon library

## Architecture

### Package Structure

```
packages/
├── ui/                      # Shared UI components and styles
│   ├── src/
│   │   ├── styles.css      # Global styles and Tailwind configuration
│   │   ├── button.tsx      # Component files
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── lucide.tsx      # Lucide icon exports
│   └── package.json
└── tailwind-config/         # Shared Tailwind/PostCSS config
    ├── postcss.config.js
    └── shared-styles.css

apps/
└── web/
    ├── app/
    │   └── layout.tsx       # Imports @repo/ui/styles.css
    └── postcss.config.js    # Extends @repo/tailwind-config
```

### Style Loading Order

1. `apps/web/app/layout.tsx` imports `@repo/ui/styles.css`
2. `styles.css` imports Tailwind directives and applies global styles
3. Component-level classes are applied
4. Inline styles (highest specificity)

## Global Styles

### Location

The main global styles file is located at:
```
packages/ui/src/styles.css
```

### Key Features

#### 1. Tailwind v4 Configuration

```css
@import "tailwindcss";
@source "../../../apps/**/*.{ts,tsx}";
@source "../../../components/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";
```

#### 2. Theme Variables (OKLch Color Space)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --border: oklch(0.922 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --border: oklch(0.269 0 0);  /* zinc-700 equivalent */
  /* ... more variables */
}
```

#### 3. Global Base Styles

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Known Issues

### Issue #1: Border Color Override

**Problem:** The global `@apply border-border` in `styles.css` (line 127) applies to ALL elements (`*`), which can override custom border colors in hover states.

**Example:**
```tsx
// This won't work as expected:
<div className="border-zinc-700 hover:border-teal-500">
  Content
</div>
```

The hover state gets overridden by the global `border-border` class.

**Solutions:**

**Option 1: JavaScript Event Handlers (Recommended)**
```tsx
<div
  className="border-2 border-zinc-700 transition-all duration-300"
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

**Option 2: !important with Tailwind**
```tsx
<div className="border-zinc-700 hover:!border-teal-500">
  Content
</div>
```

**Option 3: Inline Styles**
```tsx
<div style={{ borderColor: isHovered ? '#14b8a6' : '' }}>
  Content
</div>
```

### Issue #2: Cache Issues

**Problem:** Sometimes Tailwind classes don't update after changes.

**Solution:**
```bash
# Clear build cache
rm -rf .next node_modules/.cache

# Rebuild
pnpm run build
```

## Design System

### Color Palette

The project uses a **teal** and **zinc** color palette:

#### Primary Colors (Teal)
- `teal-400` (#5eead4) - Accent elements, ping animations
- `teal-500` (#14b8a6) - Main CTA buttons, primary actions
- `teal-600` (#0d9488) - Button hover states

#### Neutral Colors (Zinc)
- `zinc-900` (#18181b) - Main background (dark theme)
- `zinc-800` (#27272a) - Card backgrounds
- `zinc-700` (#3f3f46) - Borders, dividers
- `zinc-400` (#a1a1aa) - Secondary text
- `zinc-300` (#d4d4d8) - Tertiary text
- `white` (#ffffff) - Primary headings

### Component Patterns

#### Button (Primary CTA)
```tsx
<Button
  size="lg"
  variant="outline"
  className="min-w-[180px] bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
>
  Get Started Free
</Button>
```

#### Badge (Status Indicator)
```tsx
<Badge
  variant="outline"
  className="px-3 py-1.5 rounded-full bg-white/5 border-white/10 text-zinc-300 backdrop-blur-sm text-sm"
>
  Coming Soon
</Badge>
```

#### Card (Content Container)
```tsx
<Card className="bg-zinc-800 border-2 border-zinc-700 hover:border-teal-500 rounded-2xl shadow-sm hover:shadow-md transition-all">
  <CardContent className="p-8">
    {/* Content */}
  </CardContent>
</Card>
```

### Spacing System

The project follows a **4px-based spacing system**:

- `mb-2` = 8px
- `mb-4` = 16px
- `mb-6` = 24px
- `mb-8` = 32px
- `mb-12` = 48px
- `py-20` = 80px (section padding)

### Typography

#### Font
- **Family:** Inter (Google Fonts)
- **Applied via:** `.font-inter` class on `<body>`

#### Scale
```tsx
// Headings
<h1 style={{ fontSize: "clamp(2rem, 6vw, 6rem)" }}>  // Fluid responsive
<h2 className="text-4xl font-bold text-white">       // 36px

// Body
<p className="text-lg text-zinc-400">                // 18px
<p className="text-base text-zinc-300">              // 16px
<p className="text-sm text-zinc-400">                // 14px
```

### Effects

#### Glassmorphism
```tsx
className="bg-white/5 border-white/10 backdrop-blur-sm"
```

#### Gradient Background
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
```

#### Blur Circle
```tsx
<div className="absolute w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
```

#### Hover Effects
```tsx
// Shadow expansion
className="hover:shadow-md hover:shadow-teal-500/20"

// Gap increase (for arrows)
className="group-hover:gap-3 transition-all"

// Border highlight
onMouseEnter={(e) => e.currentTarget.style.borderColor = "#14b8a6"}
```

## Best Practices

### 1. Use Shared Components

Always prefer using components from `@repo/ui`:
```tsx
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
```

### 2. Consistent Spacing

Use the section layout pattern:
```tsx
<section
  id="section-id"
  className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
>
  {/* Content */}
</section>
```

### 3. Responsive Design

Always include responsive variants:
```tsx
className="text-base sm:text-lg"           // Text sizes
className="px-4 sm:px-6 lg:px-8"           // Padding
className="grid grid-cols-1 md:grid-cols-3" // Layouts
```

### 4. Transitions

Add smooth transitions for interactive elements:
```tsx
className="transition-all duration-300"     // All properties
className="transition-colors"               // Just colors
```

### 5. Color Opacity

Use Tailwind's opacity modifiers:
```tsx
className="bg-teal-500/10"    // 10% opacity
className="border-white/20"   // 20% opacity
className="shadow-teal-500/25" // 25% opacity
```

### 6. Icon Usage

Import icons from the centralized lucide.tsx file:
```tsx
// ✅ Good
import { BookOpenIcon, CodeIcon } from "@repo/ui/lucide";

// ❌ Bad
import { BookOpen } from "lucide-react";
```

Add new icons to `packages/ui/src/lucide.tsx`:
```tsx
export const NewIcon = Lucide.NewIconName;
```

### 7. Border Workaround

For custom border colors on hover, use JavaScript event handlers:
```tsx
<div
  className="border-2 border-zinc-700"
  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#14b8a6"}
  onMouseLeave={(e) => e.currentTarget.style.borderColor = ""}
>
```

### 8. Dark Theme

The project is dark-themed by default. The `<body>` has:
```tsx
<body className="bg-zinc-900 text-zinc-100">
```

### 9. Utility Function

Use the `cn()` utility for conditional classes:
```tsx
import { cn } from "@repo/ui/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

## Troubleshooting

### Styles not updating?
1. Clear cache: `rm -rf .next node_modules/.cache`
2. Restart dev server: `pnpm run dev`
3. Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Hover not working?
- Check for global CSS overrides in `packages/ui/src/styles.css`
- Use JavaScript event handlers as a workaround (see [Known Issues](#known-issues))

### Colors look different?
- Verify you're using the correct opacity modifiers
- Check if dark mode is active
- Ensure OKLch color space is supported (modern browsers)

## File References

- Global styles: `/packages/ui/src/styles.css`
- Tailwind config: `/packages/tailwind-config/`
- Main layout: `/apps/web/app/layout.tsx`
- Theme provider: `/apps/web/app/providers/ThemeProviderWrapper.tsx`
- Icons: `/packages/ui/src/lucide.tsx`
- Utility functions: `/packages/ui/src/lib/utils.ts`

---

**Last updated:** January 2026
