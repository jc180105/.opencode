---
name: nextjs-15
description: "Expert guidelines for Next.js 15 development, focusing on App Router, React Server Components (RSC), Server Actions, and optimal caching strategies."
---

# Next.js 15 - Professional Guidelines

Advanced patterns for building cutting-edge web applications with Next.js 15.

## Core Principles

- **RSC First**: Use React Server Components by default for better performance and smaller client bundles.
- **Server Actions**: Prefer Server Actions for form submissions and data mutations.
- **PPR (Partial Prerendering)**: Optimize for fast initial loads while keeping dynamic data fetching.
- **Caching**: Understand and utilize the Next.js cache (Data Cache, Request Memoization, Full Route Cache, Router Cache).

## File Structure

- `app/`: Use specialized files like `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`.
- `components/`: Separate server components (`.tsx`) from client components (`.client.tsx` or `'use client'`).

## Best Practices

1.  **Direct Database Access**: Access Supabase/DB directly inside Server Components.
2.  **Streaming**: Use `<Suspense>` to stream slow data parts.
3.  **Metadata API**: Use the Metadata API for SEO optimization.
4.  **Middleware**: Keep middleware lightweight for authentication and internationalization.
