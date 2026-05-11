---
applyTo: '**'
description: 'Comprehensive secure coding standards based on OWASP Top 10 2025, with anti-patterns, detection patterns, and framework-specific fixes for modern web and backend frameworks.'
---

# Security Standards

Comprehensive security rules for web application development. Every anti-pattern includes a severity classification, detection method, OWASP 2025 reference, and corrective code examples.

**Severity levels:**
- **CRITICAL** — Exploitable vulnerability. Must be fixed before merge.
- **IMPORTANT** — Significant risk. Should be fixed in the same sprint.
- **SUGGESTION** — Defense-in-depth improvement. Plan for a future iteration.

---

## OWASP Top 10 — 2025 Quick Reference

| # | Category | Key Mitigation |
|---|----------|----------------|
| A01 | Broken Access Control | Auth middleware on every endpoint, RBAC, ownership checks |
| A02 | Security Misconfiguration | Security headers, no debug in prod, no default credentials |
| A03 | Software Supply Chain Failures | `npm audit`, lockfile integrity, SBOM, SLSA provenance |
| A04 | Cryptographic Failures | Argon2id/bcrypt for passwords, TLS everywhere, no secrets in code |
| A05 | Injection | Parameterized queries, input validation, no raw HTML with user input |
| A06 | Insecure Design | Threat modeling, secure design patterns, abuse case testing |
| A07 | Authentication Failures | Rate-limit login, secure session management, MFA |
| A08 | Software or Data Integrity Failures | SRI for CDN scripts, signed artifacts, no insecure deserialization |
| A09 | Security Logging and Alerting Failures | Log security events, no PII in logs, correlation IDs, active alerting |
| A10 | Mishandling of Exceptional Conditions | Handle all errors, no stack traces in prod, fail-secure |

---

## Frontend Anti-Patterns

### FE1: Unsanitized HTML Rendering — CRITICAL (A05)
Never use `innerHTML`, `v-html`, or `dangerouslySetInnerHTML` with user-controlled content.
Always use `textContent` for text and sanitize with DOMPurify before any raw HTML rendering.

### FE2: Dynamic Code Evaluation — CRITICAL (A05)
Never use `eval()`, `new Function()`, or `setTimeout(string)`. Use JSON.parse for data.

### FE3: Sensitive Data in localStorage — IMPORTANT (A07)
Never store tokens, session IDs, or PII in `localStorage`. Use httpOnly cookies.

### FE4: Client-Only Input Validation — IMPORTANT (A05)
ALWAYS validate on the server too. Frontend validation is UX only.

### FE5: Missing CSRF Protection — IMPORTANT (A01)
Use double-submit cookie or synchronizer token for POST/PUT/DELETE forms.

---

## Secrets Anti-Patterns

### S1: Hardcoded Secrets — CRITICAL (A04)
```js
// BAD
const API_KEY = 'sk_live_abc123';
// GOOD
const API_KEY = process.env.API_KEY;
```

### S2: .env Committed to Git — CRITICAL (A04)
Ensure `.env`, `.env.local`, `*.pem`, `*.key` are in `.gitignore`.

---

## Injection Anti-Patterns

### I1: XSS via innerHTML — CRITICAL (A05)
```js
// BAD
element.innerHTML = userInput;
// GOOD
element.textContent = userInput;
```

### I2: eval() with User Input — CRITICAL (A05)
Never concatenate user input into `eval()` or `new Function()`.

---

## Security Checklist

- [ ] No `innerHTML`/`dangerouslySetInnerHTML` with unvalidated user input
- [ ] No `eval()` or `new Function()` with dynamic strings
- [ ] No hardcoded secrets in source code
- [ ] `.env` files in `.gitignore`
- [ ] Content-Security-Policy header configured
- [ ] X-Content-Type-Options: nosniff header set
- [ ] X-Frame-Options: DENY header set
- [ ] Input validated and sanitized before use
- [ ] `npm audit` passing in CI
- [ ] Sensitive data NOT stored in localStorage
