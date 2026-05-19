# Clean Code & Anti-Overengineering Guidelines

As an AI agent, your natural tendency might be to write verbose, overly complex code to demonstrate "completeness." **DO NOT DO THIS.** Follow these strict minimalist guidelines:

## 1. YAGNI (You Aren't Gonna Need It)
- Do exactly what the task requires. **Nothing more.**
- Do NOT add "future-proofing" abstractions, generic interfaces, or extra classes unless explicitly requested.
- If a simple `if/else` works, do not create a Strategy Pattern.

## 2. Early Returns (Guard Clauses)
- Never use deeply nested `if` statements.
- Return early to handle errors or edge cases at the top of the function.
```javascript
// ❌ WRONG (Nested)
function processUser(user) {
  if (user) {
    if (user.isActive) {
      return doSomething();
    }
  }
  return null;
}

// ✅ RIGHT (Early Returns)
function processUser(user) {
  if (!user || !user.isActive) return null;
  return doSomething();
}
```

## 3. Keep Functions Small & Pure
- A function should do exactly ONE thing.
- If your function exceeds 30-40 lines, it is probably doing too much.
- Avoid side effects whenever possible. Pass data in, return data out.

## 4. No "Spaghetti" or Over-Abstraction
- **DRY (Don't Repeat Yourself)** is good, but **AHA (Avoid Hasty Abstractions)** is better.
- It is better to have a little bit of duplicated code than a complex, unreadable shared abstraction.
- Write flat code. Avoid deep inheritance trees.

## 5. Comments & Dead Code
- **DO NOT comment out dead code.** If code is no longer needed, DELETE IT. Git tracks history.
- **DO NOT over-comment.** Code should explain *what* and *how*. Comments should only explain *WHY* (business logic, weird hacks, external constraints).
- Name your variables and functions clearly so they don't need comments.

## 6. Framework-Specific Minimalism
- **React/Next.js:** Don't use `useMemo`/`useCallback` preemptively. Use them only if there's a proven performance issue.
- **Python:** Use list comprehensions and standard library functions instead of writing manual loops when applicable.
- **CSS:** Use existing design tokens. Don't write 20 lines of custom CSS if a utility class or existing component does the job.

> **CRITICAL RULE:** The best code is no code. The second best code is easily readable code. Write code for junior developers to read, not for compilers to parse.
