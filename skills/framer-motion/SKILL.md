---
name: framer-motion
description: Provides guidelines and best practices for implementing animations using Framer Motion in React/Next.js projects. Use when the user wants to add animations, transitions, or interactive effects.
---
# Framer Motion Skill

This skill provides guidelines and best practices for implementing animations using **Framer Motion** in React/Next.js projects. When building UI with Framer Motion, prioritize performance, reusability, and clean code.

## 1. Core Principles
- **Animate Transforms, Not Layouts**: For performance, animate `scale`, `x`, `y`, `opacity`, and `rotate`. Avoid animating `width`, `height`, `top`, `left`, etc., as they trigger browser layout recalculations.
- **Subtle is Better**: Use smooth, professional animations (whisper-weight). Avoid overly bouncy or exaggerated spring physics unless explicitly requested. 
- **Accessibility (a11y)**: Always respect `prefers-reduced-motion`. Framer Motion handles this automatically if configured, or you can use `useReducedMotion()`.

## 2. Use Variants for Complex Animations
Instead of inline animate props, use `variants` to cleanly orchestrate animations across parent and child components (e.g., staggering children).

```tsx
// ✅ RIGHT: Using variants for cleaner code and orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  <motion.li variants={itemVariants} />
  <motion.li variants={itemVariants} />
</motion.ul>
```

## 3. Shared Element Transitions (layoutId)
Use `layoutId` to smoothly animate an element from one component to another (e.g., an active tab indicator or opening a modal).

```tsx
// ✅ RIGHT: Smooth active state indicator
{tabs.map(tab => (
  <div key={tab.id} onClick={() => setActive(tab.id)}>
    {tab.label}
    {active === tab.id && (
      <motion.div layoutId="active-indicator" className="absolute bottom-0 w-full h-1 bg-blue-500" />
    )}
  </div>
))}
```

## 4. AnimatePresence for Unmounting
Use `<AnimatePresence>` to animate components when they are removed from the React tree. The child component **must** have an `exit` prop.

```tsx
// ✅ RIGHT: Animating unmount
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

## 5. Layout Animations
When elements change size or position due to DOM updates (e.g., list reordering, expanding panels), simply add the `layout` prop to automatically interpolate their bounding boxes.

```tsx
<motion.div layout className="bg-white p-4 rounded-lg">
  <h1>{title}</h1>
  {expanded && <p>Details...</p>}
</motion.div>
```

## 6. Performance Hooks
- `useScroll`: For scroll-linked animations.
- `useTransform`: To map motion values (e.g., map scroll position to opacity).
- `useSpring`: To add physics-based smoothing to rapid value changes.

## 7. Interaction States
Use Framer Motion's built-in interaction props instead of manual state when possible:
- `whileHover={{ scale: 1.05 }}`
- `whileTap={{ scale: 0.95 }}`
- `whileFocus={{ outline: "2px solid blue" }}`
