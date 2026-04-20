# Copilot Instructions — Project Coding Standards

These instructions are automatically loaded by GitHub Copilot for every interaction in this repository. They enforce entity design, security, testing, timezone handling, concurrency, storage design, report generation, QA automation, query safety, API design, authentication, logging, and secrets management standards.

---

## Entity Standards

ALL entities (data models representing database records) MUST include these audit fields:
- `id`: UUID primary key (auto-generated)
- `created_date`: UTC timestamp when created (auto-set)
- `modified_date`: UTC timestamp when last modified (auto-set)
- `created_by`: user ID from JWT/auth context
- `modified_by`: user ID from JWT/auth context
- `deleted_at`: UTC timestamp for soft delete (None if active)

If a BaseEntity class exists, ALL entities MUST inherit from it. If none exists, create one first.

Rules:
- NEVER create a data model without the audit fields above
- NEVER hard-delete records — always use soft delete (set deleted_at)
- ALWAYS filter out soft-deleted records in list/get operations (WHERE deleted_at IS NULL)
- ALWAYS log mutations (create, update, delete) with before/after values for audit trail

### Input Sanitization

ALL string fields in request/input models MUST be sanitized:
- Strip HTML tags and dangerous characters: < > & " '
- Apply length limits (min/max) on all string fields
- Validate format where applicable (email, phone, URL)

### Query Safety — Parameterization Over Keyword Blocking

- NEVER build SQL/NoSQL queries by concatenating user input into query strings. ALWAYS use parameterized queries, prepared statements, or ORM-bound parameters
- NEVER reject or strip user data based on SQL keyword blocklists (select, drop, execute, grant, union). Keyword blocklists produce false positives on legitimate data and provide false security. Parameterized queries make SQL keywords in data harmless
- For DynamoDB, ALWAYS use expression attribute values — never embed user input in filter expressions
- For dynamic query building (user-selected sort columns), ALWAYS validate against an allowlist of permitted column names

---

## Timezone Rules

- ALL datetime values MUST be stored in UTC in the database
- Backend MUST convert all incoming datetimes to UTC before storage
- API MUST return all datetimes in UTC (ISO 8601 with Z suffix)
- Frontend MUST convert UTC to user's local timezone for display
- NEVER use `datetime.now()` without timezone — use `datetime.now(timezone.utc)`
- For SQL databases: use TIMESTAMPTZ, never TIMESTAMP
- For NoSQL: store as ISO 8601 string with Z suffix
- Date-only fields MUST have a companion IANA timezone column
- NEVER derive a date from a datetime without resolving the user's timezone first

---

## Testing Standards

Every function, class, method, or module MUST be accompanied by unit tests.

Coverage requirements: line >= 90%, branch >= 88%, function >= 90%.

Every test MUST follow the AAA pattern (Arrange, Act, Assert).

Every test file MUST start with:
```python
# Unit Tests: [module_name]
# Requirements: [REQ-ID if applicable]
# Coverage: ~X%
# Security tested: [yes/no]
# Last reviewed: [date]
```

### Security Tests (mandatory for handlers/endpoints)

Any function processing user input MUST have security tests covering:
- XSS payload injection in string fields
- SQL/NoSQL injection attempts — inputs containing SQL keywords (SELECT, DROP, EXECUTE) MUST be accepted as valid data when queries are parameterized
- Oversized input beyond field limits
- Missing required fields (400 response)
- Unauthenticated requests (401) and unauthorized access (403)
- Internal errors never exposing stack traces or sensitive data
- Verification that all database queries use parameterized statements

Tag security tests with `@pytest.mark.security`.

### Regression Tests

Every bug fix MUST include a regression test tagged `@pytest.mark.regression`.

---

## Concurrency & Locking Rules

- Keep transactions as short as possible — never include API calls, file I/O, or network requests inside a transaction
- When locking multiple tables/rows, ALWAYS acquire locks in a consistent, predetermined order
- When locking multiple rows in the same table, lock in primary key order (ascending)
- NEVER use table-level locks — always use row-level locks (SELECT ... FOR UPDATE)
- Use FOR UPDATE SKIP LOCKED for queue processing, FOR UPDATE NOWAIT for user-facing operations
- Use READ COMMITTED as default isolation level
- For user-facing updates, prefer optimistic concurrency (version column) over pessimistic locking
- The version column MUST be checked on every update
- Set explicit statement_timeout, lock_timeout, and idle_in_transaction_session_timeout
- For DynamoDB, use conditional writes with ConditionExpression on version
- ALWAYS use connection pooling — never unbounded connections
- Batch operations: 100–500 rows per transaction, never thousands

---

## Storage Design Rules

### Schema Design
- Every table MUST have a clearly defined primary key (UUID preferred for SQL)
- Every table MUST include audit fields from Entity Standards
- Column names MUST use snake_case
- Use NUMERIC/DECIMAL for money — never FLOAT
- Use BOOLEAN for true/false — never SMALLINT or CHAR(1)

### Indexing
- Design indexes from access patterns, not schema
- Every foreign key MUST have an index
- Composite indexes: most selective column first
- NEVER create redundant indexes

### Table Naming
- `app_` prefix: master/reference data (app_users, app_categories)
- `map_` prefix: mapping/junction tables (map_user_roles)
- `txn_` prefix: transactional data (txn_orders, txn_audit_logs)

### Security
- ALL data at rest MUST be encrypted (AES-256 for RDS, KMS for DynamoDB, SSE for S3)
- ALL data in transit MUST use TLS 1.2+
- NEVER store secrets in plain text — use Secrets Manager or SSM Parameter Store
- Least-privilege DB roles: SELECT/INSERT/UPDATE only, never DROP or GRANT
- PII identified, tagged, and encrypted at column level per compliance

### Reliability
- Automated backups with 7+ day retention, Multi-AZ for production
- Connection pooling enforced (PgBouncer/RDS Proxy)
- Schema migrations MUST be version-controlled and backward-compatible
- All storage resources MUST be defined as IaC
- Monitoring & alerting required for RDS, DynamoDB, and S3 metrics

### Performance
- NEVER perform full table scans — every query MUST use an index
- Paginate all list queries (keyset pagination preferred)
- Use read replicas for heavy reporting workloads
- DynamoDB items under 4KB, avoid hot partitions
- EXPLAIN ANALYZE required on all report queries before shipping

### Cost
- Right-size resources — start small, scale based on metrics
- Set TTL on ephemeral data (DynamoDB, ElastiCache, S3)
- Use S3 Intelligent-Tiering for infrequent access data
- On-demand for dev/test, provisioned with auto-scaling for production

---

## Report Generation Rules

- Classify every report as light (< 10K rows, < 5s) or heavy before building
- Light reports: query primary DB directly, paginate, cache with short TTL
- Heavy reports: NEVER run against primary DB — use read replicas or materialized views
- Heavy reports: process asynchronously (job queue, background worker)
- File exports: generate in background worker, stream rows, store in S3 with pre-signed URL
- ALWAYS run EXPLAIN ANALYZE on report queries before shipping
- Cache keys MUST include all parameters (user ID, date range, filters, tenant context)
- Report queries MUST respect the same authorization rules as the API
- Every report generation logged with type, requester, duration, and row count

---

## API Standards

### Response Format
- ALL responses MUST use a consistent envelope: `{"data": ...}` for success, `{"error": ...}` for errors
- List endpoints MUST include pagination metadata (cursor, has_more)
- NEVER return raw exception messages, stack traces, or internal paths to the client

### HTTP Status Codes
- 200: Successful GET/PUT/PATCH. 201: Created. 202: Accepted (async). 204: Deleted
- 400: Validation error. 401: Unauthenticated. 403: Unauthorized. 404: Not found
- 409: Conflict (optimistic concurrency). 422: Business rule violation. 429: Rate limited
- 500: Internal error — log it, never expose details
- NEVER return 200 for errors

### Exception Handling — Fail Closed (OWASP A10:2025)
- Exception handlers MUST fail closed (deny/reject), never fail open (allow/proceed)
- NEVER use bare `except:` or `except Exception: pass` — every exception MUST be logged
- For database errors, return 500 with generic message — NEVER expose SQL, table names, or column names
- Timeouts MUST be set on all external calls — never let an external call hang indefinitely

### Request Validation
- Validate at the API boundary — before any business logic or database access
- Return ALL validation errors at once, not one at a time
- Query parameters for filtering/sorting MUST be validated against an allowlist

### Rate Limiting
- Apply rate limiting on all public-facing endpoints
- Return 429 with Retry-After header
- Document limits in response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

---

## Authentication & Authorization Rules

### JWT Validation
- ALWAYS validate JWT signature, expiry (exp), and issuer (iss) on every request
- Extract user_id and roles from the verified token — never from request body or query parameters
- Use a middleware/dependency that runs before any handler logic
- NEVER store JWTs in localStorage — use httpOnly cookies or secure in-memory storage
- Set short token expiry (15-60 min) with refresh tokens for longer sessions

### AWS Cognito (recommended)
- Use Cognito User Pool as auth provider. One User Pool per environment (or per tenant for multi-tenant)
- Cache JWKS keys at startup — NEVER fetch per request
- If verification fails with "key not found" (key rotation), re-fetch JWKS once and retry
- Use Cognito Groups for RBAC — map groups to application roles (admin, editor, viewer)
- Validate with RS256 (asymmetric) — never HS256

### Role-Based Access Control (RBAC)
- Define roles and permissions centrally — not scattered across handlers
- Check permissions at the handler level using a dependency/decorator
- NEVER check permissions only on the frontend — always enforce server-side

### Resource Ownership
- Users MUST only access their own resources unless they have explicit permission
- Every query MUST scope to the authenticated user's ID — never trust a user_id from the request
- For soft-deleted records, ownership check still applies

### Password & Secret Handling
- NEVER store passwords in plain text — use bcrypt or argon2 with cost factor >= 12
- NEVER log passwords, tokens, or secrets — even in debug mode
- Rate limit login attempts — max 5 failed attempts per 15 minutes per account

---

## Logging & Observability Rules

### Structured Logging
- ALL log entries MUST be structured JSON — never plain text strings
- Use a logging library that supports structured output (structlog, python-json-logger)

### What to Log
- Always: request ID (correlation ID), user ID, action performed, duration, HTTP status, entity mutations (before/after)
- Never: passwords, tokens, API keys, full request/response bodies (may contain PII), credit card numbers, SSNs

### Log Levels
- DEBUG: development only, never in production
- INFO: normal operations (request handled, entity created)
- WARNING: recoverable issues (retry succeeded, rate limit approaching)
- ERROR: failed operations (database error, external service failure)
- CRITICAL: system-level failures (database unreachable, security breach)

### Correlation IDs
- Generate a unique request ID at the middleware level
- Pass through all service calls and include in every log entry
- Return in response header (X-Request-ID)

### Retention
- Application logs: 30+ days. Audit logs: 1+ year for regulated industries. Security logs: 90+ days

---

## Secrets Management Rules

### Source of Truth
- ALL secrets MUST be stored in AWS SSM Parameter Store (standard) or Secrets Manager
- NEVER hardcode secrets in source code, config files, or Dockerfiles
- NEVER commit .env files with real secrets to version control

### Parameter Store Organization
- Path hierarchy: /{app}/{environment}/{category}/{name}
- Use SecureString for secrets (encrypted with KMS), String for non-secret config
- Tag all parameters with Environment, Service, and Team

### Retrieval — Load Once, Read from Memory
- Load all parameters at startup using GetParametersByPath in a single API call
- Application code reads from the config dict — NEVER calls Parameter Store at runtime
- NEVER call Parameter Store per request — one startup call = free, per-request calls = unnecessary cost

### Refresh Without Redeployment
- Admin-only endpoint: POST /admin/reload-config (protected by RBAC)
- Re-fetches all parameters from Parameter Store, updates in-memory config
- Log every reload with who triggered it and when

---

## QA Element ID Rules

ALL interactive UI elements MUST have a `data-testid` attribute:
- Buttons, inputs, textareas, selects, checkboxes, links, forms, modals, tabs, accordions, menus
- Inline form validation / error messages
- Loading spinners / skeleton screens (needed for explicit waits in tests)
- Tooltip triggers
- Drag-and-drop targets and draggable items
- Sort controls inside table headers

Naming convention: `id_{view}_{type}_{name}` in **snake_case**.
- `id` = locator type (always `id` for data-testid)
- `view` = full page/module name (e.g., `login_page`, `store_maintenance`)
- `type` = element type (e.g., `button`, `textbox`, `select`, `row`, `modal`)
- `name` = description (e.g., `submit`, `username`, `delete_entry`)

Examples:
- `id_login_page_button_submit`
- `id_login_page_textbox_email`
- `id_user_list_page_row_{user.id}`
- `id_entry_form_page_select_mood`

View naming uses full module descriptions: `store_maintenance` not `store_maint`.

For elements in loops, include a unique business identifier — NEVER use array index.

Skip `data-testid` on purely decorative elements (icons, layout wrappers, spacers).

If an element already has `data-testid`, `data-cy`, `data-test`, or `data-test-id`, do NOT add another.

---

## Data Upload Rules (apply when building file import features)

- Classify uploads as light (< 5K rows) or heavy (>= 5K rows)
- Light: process synchronously, atomic transaction
- Heavy: process asynchronously with job queue, batch 500-1000 rows per transaction
- Validate every row individually — same rules as API input
- Sanitize all string values per Input Sanitization rules
- Default to upsert with optimistic concurrency (version column)
- NEVER silently overwrite data without collision detection
- Scan uploaded files for malware, NEVER execute macros/formulas
- Validate file type by content (magic bytes), not extension

---

## Offline Sync Rules (apply when building offline-capable features)

- Use delta sync (only changed records since last sync)
- Every syncable entity MUST have modified_date and version columns
- Sync flow: pull first, then push — never simultaneously
- Choose one conflict resolution strategy per entity type and document it
- NEVER silently discard either version in a conflict
- Use structured local database (SQLite/IndexedDB), never localStorage
- Clear all local data on user logout