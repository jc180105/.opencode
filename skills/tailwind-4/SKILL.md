---
name: tailwind-4
description: "Guidelines for Tailwind CSS v4, focusing on the new CSS-first engine, simplified theme configuration, and optimized performance."
---

# Tailwind CSS v4 - Design Guidelines

Modern styling patterns using the high-performance Tailwind 4 engine.

## Core Principles

- **CSS-First Configuration**: Configure your theme using CSS variables in your entry CSS file (`@theme`).
- **No Configuration File**: Avoid `tailwind.config.js` unless doing complex custom plugin logic.
- **Native Cascading**: Leverage native CSS variables for theme overriding.
- **Zero-runtime**: Extremely fast compile times and small output.

## Syntax Patterns

- **Theme Variables**: Use `--color-primary`, `--font-sans`, etc., in CSS.
- **Directives**: Use `@import "tailwindcss";` in your main CSS.

## Best Practices

1.  **Semantic Naming**: Use semantic tokens like `primary`, `secondary`, `surface` for colors.
2.  **Container Queries**: Utilize built-in container query support (`@container`).
3.  **Modern Units**: Use `oklch` for colors to ensure better color reproduction and vibrancy.
4.  **Utilities**: Use standard Tailwind utilities (`p-4`, `flex`, `grid`) as usual.
