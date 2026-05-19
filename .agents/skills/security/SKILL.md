---
name: security
description: Cybersecurity skill for secure code reviews, vulnerability scanning, OWASP Top 10 compliance, and security best practices. Use for reviewing authentication flows, API security, dependency audits, and secrets management.
license: MIT
compatibility: opencode
metadata:
  audience: security-engineers
  workflow: security-review
---

# Cybersecurity Skill

Perform secure code reviews, vulnerability scanning, and ensure compliance with security standards.

## When to Use

- Review code for security vulnerabilities (OWASP Top 10)
- Audit dependencies for known CVEs
- Check authentication and authorization flows
- Find exposed secrets or credentials
- Validate input sanitization and output encoding
- GDPR/HIPAA compliance checks

## Mandatory Workflow

1. **graphify_query_graph** → map all data flows and entry points
2. **context7** → fetch OWASP docs if needed (`ctx7 docs /owasp/owasp-top10 "..."`)
3. **github MCP** → check PR diff or commit history for secret exposure
4. Run audit tools (see below)
5. Return structured report — NEVER modify code yourself

---

## OWASP Top 10 Checklist

### A01 — Broken Access Control
- [ ] Every API route has auth middleware
- [ ] Users can't access other users' data (test with different JWT)
- [ ] Admin endpoints are restricted at middleware level, not just UI

### A02 — Cryptographic Failures
- [ ] Passwords hashed with bcrypt/argon2 (NOT md5/sha1)
- [ ] Sensitive data encrypted at rest and in transit (HTTPS)
- [ ] No secrets in source code, logs, or error messages

### A03 — Injection (SQL, NoSQL, Command)
- [ ] All DB queries use parameterized statements / ORM
- [ ] No `eval()` or `exec()` with user input
- [ ] Shell commands never built from user input

### A04 — Insecure Design
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after N failed attempts
- [ ] CSRF tokens on state-changing forms

### A05 — Security Misconfiguration
- [ ] No default credentials in production
- [ ] Error messages don't leak stack traces to users
- [ ] CORS is restrictive (not `*` in production)
- [ ] Security headers present (CSP, HSTS, X-Frame-Options)

### A06 — Vulnerable Components
```powershell
# Run dependency audit (Windows)
npm audit          # Node.js
python -m pip install pip-audit; python -m pip_audit   # Python

# Check for high/critical severity items
npm audit --audit-level=high
```

### A07 — Auth & Session Failures
- [ ] JWT secrets are strong and stored in env vars
- [ ] Tokens expire (short-lived access + refresh pattern)
- [ ] Session invalidated on logout
- [ ] No sensitive data in JWT payload

### A08 — Software & Data Integrity
- [ ] Dependencies pinned to exact versions (lock files committed)
- [ ] CI/CD pipeline doesn't allow untrusted packages

### A09 — Logging & Monitoring
- [ ] Auth failures logged with IP and timestamp
- [ ] Sensitive operations (delete, admin) logged
- [ ] Logs don't contain passwords, tokens, or PII

### A10 — SSRF
- [ ] User-supplied URLs are validated against allowlist
- [ ] Internal network calls from backend can't be triggered by user input

---

## Audit Commands (Windows/PowerShell)

```powershell
# Node.js — dependency audit
npm audit
npm audit --audit-level=high --json

# Python — dependency audit
python -m pip install pip-audit
python -m pip_audit

# Check for hardcoded secrets (git history)
# Use github MCP → search_code for patterns like "password=", "api_key="

# Check for exposed .env files in git history
git log --all --full-history -- "**/.env"
git log --all --full-history -- "**/secrets*"
```

---

## Secrets Detection

Look for these patterns in code:
```
password = "..."        # hardcoded credential
api_key = "sk-..."      # API key
SECRET_KEY = "..."      # Django/Flask secret
GITHUB_TOKEN = "ghp_"  # GitHub PAT
Bearer eyJ                # Hardcoded JWT
```

**Use github MCP** to search across the entire repo:
- Tool: `search_code` with query `"password="` or `"api_key"`

---

## Review Output Format

```markdown
## Security Review Report

### Summary
[PASS / FAIL / NEEDS ATTENTION]

### Critical Issues (fix before deploy)
- [CRITICAL] Description — Recommendation

### High Issues
- [HIGH] Description — Recommendation

### Medium Issues
- [MEDIUM] Description — Recommendation

### OWASP Compliance
- A01 Access Control: [Pass/Fail/NA]
- A02 Crypto: [Pass/Fail/NA]
- A03 Injection: [Pass/Fail/NA]
- A06 Deps: [Pass/Fail/NA] — run `npm audit` / `pip_audit`

### Positive Findings
- What was implemented correctly

### Action Items
- [ ] Specific change required
```

## Tools Available
- `graphify_query_graph` → map attack surface first
- `context7` → OWASP docs, framework security patterns
- `github MCP` → code search, PR review, secret scanning
- `npm audit` / `python -m pip_audit` → dependency CVE scan
