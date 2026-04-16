# Modern Web Animations (Motion & View Transitions)

Diretrizes premium para criação de interfaces animadas em Next.js 15 e React 19.

## Tecnologias Alvo
- **Interações de Componente**: `motion` (antigo framer-motion)
- **Transições de Página**: Native View Transitions API (Next.js experimental)

## Diretrizes de Implementação

### 1. Motion (Componentes)
- Sempre use o pacote `motion/react` em vez de `framer-motion`.
- Todo componente com animação DEVE ser `'use client'`.
- Utilize `LazyMotion` no layout raiz para reduzir o bundle size.
- Prefira **Variants** para orquestrar animações complexas em vez de props inline.

### 2. View Transitions (Páginas)
- Ative `experimental.viewTransition` no `next.config.ts`.
- Use a prop `name` (CSS view-transition-name) para morphing de elementos entre páginas.
- Não use `AnimatePresence` para transições de página inteira no App Router; use a API nativa.

## Melhores Práticas
- **Performance**: Use animações de Transform e Opacity; evite animar Width/Height para prevenir reflows.
- **Acessibilidade**: Respeite a preferência `prefers-reduced-motion` usando hooks.
- **Layout**: Use `layoutId` para animar elementos que se movem fisicamente entre diferentes posições no DOM.
