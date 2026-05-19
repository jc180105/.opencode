---
name: code-review
description: Code review skill for reviewing code changes, checking security, performance, and maintainability against team standards (Impeccable for frontend, OWASP for security)
license: MIT
compatibility: opencode
metadata:
  audience: code-reviewers
  workflow: review
---

# Code Review Skill

This skill helps you perform thorough code reviews focusing on security, performance, maintainability, and alignment with team standards.

## When to Use

Use this skill when you need to:
- Review pull requests and code changes
- Check code against team standards (Impeccable for frontend, OWASP for security)
- Validate code quality and best practices
- Identify security vulnerabilities
- Suggest performance improvements
- Ensure proper documentation and tests

## Instructions

### Review Process
1. **Understand the Context**
   - Read the PR description and linked issues
   - Understand the business logic being implemented
   - Check if tests are included

2. **Security Review** (use `context7` for OWASP docs)
   - Check for SQL injection vulnerabilities
   - Verify proper input validation
   - Ensure no hardcoded secrets or credentials
   - Validate authentication and authorization logic
   - Check for XSS and CSRF vulnerabilities

3. **Performance Review**
   - Identify N+1 query problems
   - Check for unnecessary computations in loops
   - Verify proper indexing for database queries
   - Look for memory leaks or resource misuse

4. **Maintainability Review**
   - Check code readability and naming conventions
   - Verify proper separation of concerns
   - Ensure functions are single-purpose
   - Check for code duplication
   - Validate error handling

5. **Frontend-Specific Review** (use Impeccable standards)
   - Check for anti-patterns (side-tab, overused-font, ai-color-palette)
   - Validate responsive design
   - Check accessibility (WCAG compliance)
   - Verify proper component structure
   - Ensure consistent design tokens usage

6. **Backend-Specific Review**
   - Validate API design (RESTful or GraphQL best practices)
   - Check proper error responses
   - Verify database query efficiency
   - Ensure proper logging

### Review Output Format
Provide a structured review report:
```
## Code Review Report

### Summary
[Overall assessment: Approve / Request Changes / Comment]

### Security Issues
- [Critical/High/Medium/Low] Description of issue
- Recommendation

### Performance Issues
- [Critical/High/Medium/Low] Description
- Recommendation

### Maintainability Issues
- Description
- Recommendation

### Standards Compliance
- Impeccable: [Pass/Fail] (for frontend)
- OWASP: [Pass/Fail] (for security)

### Positive Feedback
- What was done well

### Action Items
- [ ] Specific changes requested
```

## Tools Available
- `github` - Access PRs, diffs, and code
- `context7` - Fetch OWASP, framework best practices
- Impeccable design system (via Frontend Agent)
