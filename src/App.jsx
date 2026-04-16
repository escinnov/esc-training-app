import { useState } from 'react'
import './App.css'

function LoginGate({ onAuth }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('authenticated', 'true')
        onAuth()
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div className="login-gate">
      <form className="login-form" onSubmit={handleSubmit} data-testid="login-gate-form">
        <div className="login-icon">🔒</div>
        <h2>Training Access</h2>
        <p>Enter the password to view this training material.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          data-testid="login-gate-password-input"
        />
        {error && <div className="login-error" data-testid="login-gate-error">{error}</div>}
        <button type="submit" disabled={loading || !password} data-testid="login-gate-submit-button">
          {loading ? 'Verifying...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

const slides = [
  {
    id: 'title',
    type: 'title',
    title: 'Building High-Quality Software with Kiro',
    subtitle: 'Steering Rules, Hooks & Skills — An AI-Augmented SDLC',
    badge: 'Training Module',
  },
  {
    id: 'agenda',
    type: 'agenda',
    title: 'What We Will Cover',
    items: [
      { icon: '🎯', text: 'Why codified standards matter' },
      { icon: '🧩', text: 'The Kiro Configuration Kit — hooks, steering, skills' },
      { icon: '🏛️', text: '5 Pillars of Well-Architected Software' },
      { icon: '🚨', text: 'OWASP Top 10:2025 & How the Kit Addresses Each Risk' },
      { icon: '⚡', text: 'Live walkthrough — how it works in practice' },
      { icon: '🗺️', text: 'Adoption path for your team' },
    ],
  },
  {
    id: 'problem',
    type: 'two-column',
    title: 'The Problem: Inconsistency at Scale',
    left: {
      heading: 'Without Standards',
      color: '#ef4444',
      items: [
        'Every developer writes code differently',
        'Timezone bugs surface in production',
        'Missing audit fields discovered during compliance audits',
        'No tests until QA finds bugs manually',
        'Security vulnerabilities in every handler',
        'Database deadlocks under load',
      ],
    },
    right: {
      heading: 'With Codified Standards',
      color: '#22c55e',
      items: [
        'Consistent patterns enforced automatically',
        'UTC storage + local display — every time',
        'Audit fields inherited from BaseEntity',
        'Tests generated on every file save',
        'Security tests auto-generated for handlers',
        'Concurrency rules prevent deadlocks by design',
      ],
    },
  },
  {
    id: 'kit-overview',
    type: 'three-cards',
    title: 'The Kiro Configuration Kit',
    cards: [
      {
        icon: '🪝',
        title: 'Hooks',
        color: '#3b82f6',
        desc: 'Automated actions triggered on file events',
        items: ['Unit test generation on save', 'Security tests for handlers', 'QA element IDs for frontend'],
      },
      {
        icon: '🧭',
        title: 'Steering Rules',
        color: '#8b5cf6',
        desc: 'Always-on, contextual, or opt-in coding standards',
        items: ['Entity standards (auto)', 'Timezone rules (auto)', 'Testing standards (auto)', 'Query safety (contextual)', 'QA element IDs (contextual)', 'Storage design (contextual)', 'API standards (manual)', 'Auth rules (manual)', 'Secrets management (manual)', 'Concurrency & locking (manual)', 'Report generation (manual)', 'Data upload (manual)', 'Offline sync (manual)', 'Logging (manual)'],
      },
      {
        icon: '🧠',
        title: 'Skills',
        color: '#f59e0b',
        desc: 'Interactive decision flows before recommending architecture',
        items: ['Compute selection (Lambda vs ECS)', 'Storage selection (DynamoDB vs RDS)', 'Tenant strategy (isolation models)', 'Offline security (encryption vs HMAC vs both)'],
      },
    ],
  },
  {
    id: 'hooks-deep',
    type: 'detail',
    title: 'Hooks — Automation on Every Save',
    sections: [
      {
        name: 'unit-test-on-edit (v2)',
        trigger: 'Source files in handlers/, services/, models/, repositories/, utils/, api/, core/, lib/ — excludes tests, migrations, config, __init__.py',
        action: 'Checks for existing tests, generates missing ones following the testing-standards steering file. Does NOT generate security tests — that is handled by the dedicated security hook.',
      },
      {
        name: 'security-test-on-handler (v2)',
        trigger: 'Handler file saved (**/handlers/**/*.py)',
        action: 'Generates security tests following the testing-standards and query-safety-rules steering files. Compact prompt — references steering instead of repeating rules inline.',
      },
      {
        name: 'qa-element-ids (v2)',
        trigger: 'Frontend file saved (.tsx, .jsx, .vue, .svelte, .html)',
        action: 'Scans for interactive elements missing data-testid, adds them following the qa-element-id-rules steering file. Compact prompt — 75% smaller than v1.',
      },
    ],
  },
  {
    id: 'steering-deep',
    type: 'steering-grid',
    title: 'Steering Rules — Standards That Never Sleep',
    rules: [
      { name: 'Entity Standards', mode: 'Auto', icon: '📋', desc: 'Audit fields, soft delete, input sanitization on every entity' },
      { name: 'Timezone Rules', mode: 'Auto', icon: '🕐', desc: 'Store UTC, send with offset, display local. Date-only fields need companion timezone' },
      { name: 'Testing Standards', mode: 'Auto', icon: '🧪', desc: 'AAA pattern, 90% coverage, security tests for handlers, regression tests for fixes' },
      { name: 'Query Safety', mode: 'FileMatch', icon: '🛡️', desc: 'Parameterized queries mandatory, keyword blocklists banned. Loads on handler/service/repo files' },
      { name: 'QA Element IDs', mode: 'FileMatch', icon: '🏷️', desc: 'data-testid with id_view_type_name convention. Loads on frontend files only' },
      { name: 'Storage Design', mode: 'FileMatch', icon: '💾', desc: 'Schema design, indexing, encryption, backups, table naming. Loads on model/migration files' },
      { name: 'API Standards', mode: 'Manual', icon: '🔌', desc: 'Response format, HTTP status codes, fail-closed error handling, rate limiting. Activate with #api-standards' },
      { name: 'Auth Rules', mode: 'Manual', icon: '🔑', desc: 'AWS Cognito User Pool, JWT/JWKS validation, RBAC, resource ownership. Activate with #auth-rules' },
      { name: 'Concurrency & Locking', mode: 'Manual', icon: '🔒', desc: 'Short transactions, lock ordering, optimistic concurrency. Activate with #concurrency-and-locking-rules' },
      { name: 'Report Generation', mode: 'Manual', icon: '📊', desc: 'Light vs heavy classification, read replicas, async generation. Activate with #report-generation-rules' },
      { name: 'Data Upload', mode: 'Manual', icon: '📤', desc: 'Light/heavy classification, staging tables, collision handling, off-peak scheduling' },
      { name: 'Offline Sync', mode: 'Manual', icon: '📡', desc: 'Delta sync, local storage schema, conflict resolution, sync API design' },
      { name: 'Logging', mode: 'Manual', icon: '📝', desc: 'Structured JSON logging, log levels, correlation IDs, PII redaction. Activate with #logging-rules' },
      { name: 'Secrets Management', mode: 'Manual', icon: '🗝️', desc: 'Parameter Store + load once at startup, admin reload endpoint. Activate with #secrets-management-rules' },
    ],
  },
  {
    id: 'skills-deep',
    type: 'skills-flow',
    title: 'Skills — Guided Decisions, Not Guesses',
    skills: [
      {
        name: 'Compute Selection',
        trigger: 'Mention Lambda, ECS, container, microservice...',
        questions: 7,
        outcome: 'Lambda vs Containers recommendation with cost estimates',
        example: '"Should I use Lambda for this background job?" → 7 questions → recommendation → creates compute-decision.md steering file',
      },
      {
        name: 'Storage Selection',
        trigger: 'Mention database, DynamoDB, RDS, PostgreSQL...',
        questions: 9,
        outcome: 'DynamoDB vs PostgreSQL vs MySQL + serverless vs serverful',
        example: '"Which database for this feature?" → 3-phase flow → recommendation → creates storage-decision.md steering file',
      },
      {
        name: 'Tenant Strategy',
        trigger: 'Mention multi-tenant, SaaS, tenant isolation...',
        questions: 5,
        outcome: 'Row-level → Schema-per-tenant → Stack-per-tenant recommendation',
        example: '"We need to support multiple organizations" → 5 questions → model → creates tenant-decision.md steering file',
      },
      {
        name: 'Offline Security Selection',
        trigger: 'Mention offline security, SQLCipher, HMAC, tamper detection...',
        questions: 8,
        outcome: 'Server validation only → HMAC signatures → SQLCipher → All combined',
        example: '"How should we protect offline data?" → 3-phase flow → recommendation → creates offline-data-security.md steering file',
      },
    ],
  },
  {
    id: 'persistent-decisions',
    type: 'two-column',
    title: 'Persistent Decisions — Skills That Remember',
    left: {
      heading: 'Before (Skills Forgot)',
      color: '#ef4444',
      items: [
        'Skill recommends PostgreSQL → next interaction forgets',
        'Developer asks about database again → re-runs the skill',
        'New team member doesn\'t know the decision was made',
        'Inconsistent choices across the codebase',
        'Wasted credits re-running skills for the same project',
      ],
    },
    right: {
      heading: 'Now (Skills Persist)',
      color: '#22c55e',
      items: [
        'Skill recommends PostgreSQL → creates storage-decision.md',
        'Steering file loads automatically on model/migration files',
        'New team member gets the decision enforced automatically',
        'Consistent choices — the decision is code-reviewed like any other file',
        'To change: delete the file and re-trigger the skill, or edit directly',
      ],
    },
  },
  {
    id: 'pillars-title',
    type: 'section-break',
    title: '5 Pillars of Well-Architected Software',
    subtitle: 'How the Kit maps to each pillar',
  },
  {
    id: 'pillars',
    type: 'pillars',
    title: 'Well-Architected Alignment',
    pillars: [
      {
        name: 'Operational Excellence',
        icon: '⚙️',
        color: '#3b82f6',
        desc: 'Ability to run and monitor systems to deliver business value and continually improve processes and procedures.',
        mappings: [
          { text: 'All storage resources must be defined as IaC — no manual console creation', source: 'storage-design-rules.md §7' },
          { text: 'Consistent table naming with app_, map_, txn_ prefixes and snake_case', source: 'storage-design-rules.md §7' },
          { text: 'Monitoring & alerting required for RDS, DynamoDB, and S3 metrics', source: 'storage-design-rules.md §7' },
          { text: 'Schema migrations must be version-controlled and backward-compatible', source: 'storage-design-rules.md §4' },
          { text: 'Every report generation logged with type, requester, duration, and row count', source: 'report-generation-rules.md §7' },
        ],
      },
      {
        name: 'Security',
        icon: '🔐',
        color: '#ef4444',
        desc: 'Ability to protect information, systems, and assets while delivering business value through risk assessments and mitigation strategies.',
        mappings: [
          { text: 'All data encrypted at rest (AES-256 for RDS, KMS for DynamoDB, SSE for S3)', source: 'storage-design-rules.md §3' },
          { text: 'All data in transit uses TLS 1.2+ with ssl_mode=require', source: 'storage-design-rules.md §3' },
          { text: 'All string inputs sanitized — strip HTML tags and dangerous characters', source: 'entity-standards.md' },
          { text: 'Security tests auto-generated for every handler: XSS, injection, auth boundaries', source: 'security-test-on-handler hook' },
          { text: 'Least-privilege DB roles — app roles get SELECT/INSERT/UPDATE only, never DROP', source: 'storage-design-rules.md §3' },
          { text: 'PII identified, tagged, and encrypted at column level per compliance', source: 'storage-design-rules.md §3' },
          { text: 'Uploaded files scanned for malware, macros never executed', source: 'data-upload-rules.md §11' },
        ],
      },
      {
        name: 'Reliability',
        icon: '🛡️',
        color: '#22c55e',
        desc: 'Ability of a system to recover from failures, dynamically acquire resources to meet demand, and mitigate disruptions.',
        mappings: [
          { text: 'Automated backups with 7+ day retention, Multi-AZ for production SQL', source: 'storage-design-rules.md §4' },
          { text: 'Connection pooling enforced (PgBouncer/RDS Proxy) — no unbounded connections', source: 'storage-design-rules.md §4' },
          { text: 'Migrations are backward-compatible — deprecate first, remove later', source: 'storage-design-rules.md §4' },
          { text: 'Soft delete on all entities — deleted_at timestamp, never hard delete', source: 'entity-standards.md' },
          { text: 'Conflict resolution strategies defined per entity for offline sync', source: 'offline-sync-rules.md §5' },
          { text: 'Retry logic with serialization failure handling for high isolation levels', source: 'concurrency-and-locking-rules.md §4' },
        ],
      },
      {
        name: 'Performance Efficiency',
        icon: '⚡',
        color: '#f59e0b',
        desc: 'Ability to use computing resources efficiently to meet system requirements and maintain that efficiency as demand changes.',
        mappings: [
          { text: 'Index-first design — every table designed from access patterns, not schema', source: 'storage-design-rules.md §2' },
          { text: 'All list queries paginated — keyset pagination preferred for large datasets', source: 'storage-design-rules.md §5' },
          { text: 'Heavy reports run on read replicas, never the primary database', source: 'report-generation-rules.md §3' },
          { text: 'Caching strategies defined per report type with TTL and invalidation rules', source: 'report-generation-rules.md §5' },
          { text: 'DynamoDB items kept under 4KB, hot partitions avoided by design', source: 'storage-design-rules.md §5' },
          { text: 'EXPLAIN ANALYZE required on all report queries before shipping', source: 'report-generation-rules.md §4' },
        ],
      },
      {
        name: 'Cost Optimization',
        icon: '💰',
        color: '#8b5cf6',
        desc: 'Ability to run systems to deliver business value at the lowest price point through understanding and controlling costs.',
        mappings: [
          { text: 'Compute right-sizing via 7-question decision flow with cost estimates', source: 'compute-selection skill' },
          { text: 'S3 Intelligent-Tiering and lifecycle rules for infrequent access data', source: 'storage-design-rules.md §6' },
          { text: 'TTL enforced on ephemeral data — DynamoDB, ElastiCache, S3 temp uploads', source: 'storage-design-rules.md §6' },
          { text: 'On-demand for dev/test, provisioned with auto-scaling for production', source: 'storage-design-rules.md §6' },
          { text: 'Heavy uploads scheduled for off-peak windows to avoid peak-hour costs', source: 'data-upload-rules.md §8' },
        ],
      },
    ],
  },
  {
    id: 'owasp-title',
    type: 'section-break',
    title: 'OWASP Top 10 : 2025',
    subtitle: 'The industry standard for web application security risks — and how the Kit addresses each one',
  },
  {
    id: 'owasp-1-5',
    type: 'owasp-risks',
    title: 'OWASP Top 10 — A01 through A05',
    risks: [
      {
        id: 'A01:2025',
        name: 'Broken Access Control',
        desc: 'Users acting outside their intended permissions — IDOR, privilege escalation, CORS misconfiguration, tenant data leakage.',
        kitSolutions: [
          { source: 'tenant-strategy skill', fix: 'Guided decision flow forces proper isolation model selection before any code is written — row-level, schema-per-tenant, or stack-per-tenant' },
          { source: 'auth-rules.md', fix: 'JWT validation, RBAC with centralized permissions, resource ownership scoping — every query scoped to authenticated user' },
          { source: 'entity-standards.md', fix: 'Mandatory created_by/modified_by fields ensure every record is tied to an authenticated user context from JWT claims' },
          { source: 'report-generation-rules.md §6', fix: 'Report queries must respect the same authorization rules as the API — never bypass tenant isolation for reporting' },
          { source: 'security-test-on-handler hook', fix: 'Auto-generates tests for 401 (unauthenticated) and 403 (unauthorized) responses on every handler save' },
        ],
      },
      {
        id: 'A02:2025',
        name: 'Security Misconfiguration',
        desc: 'Default credentials, exposed admin panels, verbose error messages, cloud resource misconfigurations, unnecessary features enabled.',
        kitSolutions: [
          { source: 'storage-design-rules.md §3', fix: 'Encryption at rest and in transit enforced. Least-privilege DB roles — app roles get SELECT/INSERT/UPDATE only, never DROP or GRANT' },
          { source: 'compute-selection skill', fix: '7-question decision flow prevents over-provisioned infrastructure with unnecessary attack surface' },
          { source: 'storage-design-rules.md §7', fix: 'All storage resources must be IaC — no manual console creation that leads to forgotten default configs' },
          { source: 'testing-standards.md', fix: 'Security tests verify that internal errors never expose stack traces or sensitive data to the client' },
        ],
      },
      {
        id: 'A03:2025',
        name: 'Injection',
        desc: 'SQL, NoSQL, OS command, LDAP, and XSS injection — untrusted data sent to an interpreter as part of a command or query.',
        kitSolutions: [
          { source: 'entity-standards.md', fix: 'All string inputs sanitized — strip HTML tags and dangerous characters (<, >, &, ", \') with length limits on every field' },
          { source: 'entity-standards.md — Query Safety', fix: 'Mandatory parameterized queries — never concatenate user input into SQL/NoSQL. SQL keywords in data (execute, grant, union) are harmless when parameterized' },
          { source: 'entity-standards.md — Query Safety', fix: 'Keyword blocklists explicitly banned — they reject legitimate data and provide false security. Parameterization is the correct defense' },
          { source: 'security-test-on-handler hook', fix: 'Auto-generates tests for XSS payloads, SQL injection, and verifies queries use parameterized statements — not string concatenation' },
          { source: 'data-upload-rules.md §3', fix: 'Row-level validation on file uploads applies the same sanitization rules as API input — no bypass through bulk import' },
          { source: 'data-upload-rules.md §11', fix: 'Uploaded Excel files parsed with read_only=True, data_only=True — macros and formulas never executed' },
        ],
      },
      {
        id: 'A04:2025',
        name: 'Insecure Design',
        desc: 'Architecture-level flaws — missing threat modeling, insecure design patterns, missing rate limiting, no defense in depth.',
        kitSolutions: [
          { source: 'All auto-steering rules', fix: 'Design standards are codified and enforced automatically — entity structure, timezone handling, concurrency patterns, storage design' },
          { source: 'storage-selection skill', fix: '9-question flow ensures the right database is chosen for the access pattern — prevents design-level mismatches' },
          { source: 'timezone-rules.md', fix: 'UTC storage + offset-aware contracts prevent design-level data integrity bugs that show wrong data to wrong users' },
          { source: 'qa-element-id-rules.md', fix: 'Testable UI by design — stable data-testid attributes ensure security regression tests can run reliably' },
        ],
      },
      {
        id: 'A05:2025',
        name: 'Cryptographic Failures',
        desc: 'Weak algorithms, hardcoded keys, unencrypted sensitive data at rest or in transit, missing certificate validation.',
        kitSolutions: [
          { source: 'storage-design-rules.md §3', fix: 'All data at rest encrypted (AES-256 for RDS, KMS for DynamoDB, SSE for S3). All data in transit uses TLS 1.2+' },
          { source: 'storage-design-rules.md §3', fix: 'Never store secrets, API keys, or passwords in plain text — use Secrets Manager or SSM Parameter Store' },
          { source: 'storage-design-rules.md §3', fix: 'PII identified, tagged, and encrypted at column level per compliance requirements (GDPR, HIPAA, PCI-DSS)' },
          { source: 'entity-standards.md', fix: 'Soft delete + automated backups ensure encrypted data is never irrecoverably lost' },
        ],
      },
    ],
  },
  {
    id: 'owasp-6-10',
    type: 'owasp-risks',
    title: 'OWASP Top 10 — A06 through A10',
    risks: [
      {
        id: 'A06:2025',
        name: 'Vulnerable & Outdated Components',
        desc: 'Using components with known vulnerabilities, unpatched dependencies, unsupported frameworks in production.',
        kitSolutions: [
          { source: 'storage-design-rules.md §4', fix: 'Schema migrations must be version-controlled and backward-compatible — forces awareness of dependency changes' },
          { source: 'testing-standards.md', fix: '90% coverage target with regression tests ensures that component updates don\'t introduce security regressions' },
          { source: 'data-upload-rules.md §11', fix: 'File parsing libraries specified explicitly (openpyxl read_only) — prevents use of unsafe or outdated parsers' },
        ],
      },
      {
        id: 'A07:2025',
        name: 'Identification & Authentication Failures',
        desc: 'Credential stuffing, weak session management, missing MFA, improper token handling.',
        kitSolutions: [
          { source: 'tenant-strategy skill', fix: 'Separate auth context per tenant enforced — separate user pools or JWT issuers. Shared auth with tenant-id-in-token only for low-compliance' },
          { source: 'security-test-on-handler hook', fix: 'Auto-generates tests for unauthenticated requests (401) and unauthorized access (403) on every handler' },
          { source: 'entity-standards.md', fix: 'created_by/modified_by always sourced from JWT/auth context — never from user input' },
        ],
      },
      {
        id: 'A08:2025',
        name: 'Software & Data Integrity Failures',
        desc: 'Insecure CI/CD, unverified artifact integrity, supply chain attacks, insecure deserialization.',
        kitSolutions: [
          { source: 'concurrency-and-locking-rules.md §5', fix: 'Optimistic concurrency with version columns prevents data integrity violations from concurrent writes' },
          { source: 'data-upload-rules.md §7', fix: 'Every upsert uses version column collision detection — never silently overwrite data without integrity checks' },
          { source: 'offline-sync-rules.md §5', fix: 'Conflict resolution strategies defined per entity — never silently discard either version in a conflict' },
        ],
      },
      {
        id: 'A09:2025',
        name: 'Security Logging & Monitoring Failures',
        desc: 'Insufficient logging, no alerting on attack patterns, audit trail gaps, inability to detect breaches.',
        kitSolutions: [
          { source: 'logging-rules.md', fix: 'Structured JSON logging with correlation IDs, log levels, PII redaction, and retention policies' },
          { source: 'entity-standards.md', fix: 'Mandatory audit fields (created_by, modified_by, deleted_at) on every entity — complete mutation trail' },
          { source: 'storage-design-rules.md §3', fix: 'Audit logging enabled on all storage — pgaudit for RDS, CloudTrail for DynamoDB, access logging for S3' },
          { source: 'report-generation-rules.md §7', fix: 'Every report generation logged with type, requester, parameters, row count, duration, and output size' },
          { source: 'concurrency-and-locking-rules.md §8', fix: 'Monitor and alert on lock waits, deadlocks, and idle-in-transaction sessions' },
        ],
      },
      {
        id: 'A10:2025',
        name: 'Exceptional Conditions',
        desc: 'Security failures when applications encounter unexpected states — error handlers that fail open, race conditions in security checks.',
        kitSolutions: [
          { source: 'api-standards.md §3', fix: 'Fail-closed exception handling — exception handlers MUST deny/reject, never allow/proceed. Bare except banned' },
          { source: 'concurrency-and-locking-rules.md §4', fix: 'Retry logic with serialization failure handling — higher isolation levels get explicit retry for SerializationError' },
          { source: 'concurrency-and-locking-rules.md §3', fix: 'FOR UPDATE NOWAIT for user-facing ops — fail fast with ConflictError instead of hanging or failing open' },
          { source: 'concurrency-and-locking-rules.md §1', fix: 'Explicit statement and transaction timeouts prevent runaway locks from cascading into security bypasses' },
          { source: 'data-upload-rules.md §5', fix: 'Each batch is its own transaction — partial failures are contained, not cascaded across the entire upload' },
        ],
      },
    ],
  },
  {
    id: 'how-it-works',
    type: 'flow',
    title: 'How It Works in Practice',
    steps: [
      { icon: '📥', label: 'Clone the Kit', desc: 'Copy .kiro/ directory into your project' },
      { icon: '🚀', label: 'Open in Kiro', desc: 'Auto-steering rules activate immediately' },
      { icon: '✍️', label: 'Write Code', desc: 'Kiro follows all active steering rules' },
      { icon: '💾', label: 'Save a File', desc: 'Hooks fire — tests generated, IDs added' },
      { icon: '💬', label: 'Ask About Architecture', desc: 'Skills activate — guided decision flows' },
      { icon: '✅', label: 'Ship with Confidence', desc: 'Standards enforced, tests passing, IDs in place' },
    ],
  },
  {
    id: 'adoption',
    type: 'adoption',
    title: 'Adoption Path',
    phases: [
      {
        phase: 'Phase 1: New Projects',
        icon: '🆕',
        items: ['Clone kit into project root', 'Everything works from first file save', 'Zero configuration needed'],
      },
      {
        phase: 'Phase 2: New Features',
        icon: '🧩',
        items: ['Kit is already in place', 'Just build — steering and hooks engage automatically', 'Activate manual steering when needed (#data-upload-rules)'],
      },
      {
        phase: 'Phase 3: Existing Projects',
        icon: '🔧',
        items: ['Copy .kiro/ into project', 'Audit incrementally: entities → timezones → tests → concurrency → storage', 'Every file you touch gets better (boy scout rule)'],
      },
    ],
  },
  {
    id: 'usage-guide',
    type: 'usage-guide',
    title: 'Using Kiro Efficiently',
    sections: [
      {
        icon: '🚫',
        title: 'Skip "Generate Steering Docs"',
        desc: 'The kit already has curated steering files. The button creates generic files that can conflict.',
        action: 'Use this safe prompt in chat instead:',
        prompt: 'Create product.md, tech-stack.md, and project-structure.md in .kiro/steering/ (inclusion: auto). Describe the project only — do NOT include coding standards, testing rules, or conventions. Those are in existing steering files.',
      },
      {
        icon: '💬',
        title: 'Chat Effectively',
        desc: 'Be specific. The kit handles standards automatically — just describe what you want built.',
        action: 'Reference files with # for context. Activate manual steering with #rule-name when needed.',
        prompt: '#concurrency-and-locking-rules — for concurrent DB code\n#report-generation-rules — for reports/exports\n#data-upload-rules — for file imports\n#offline-sync-rules — for offline features',
      },
      {
        icon: '💾',
        title: 'Save Files — Hooks Fire',
        desc: 'Every save triggers relevant hooks: unit tests for .py, security tests for handlers, data-testid for frontend.',
        action: 'For bulk refactors: disable hooks temporarily (set "enabled": false), refactor, re-enable, save.',
        prompt: null,
      },
      {
        icon: '📋',
        title: 'Use Specs for Big Features',
        desc: 'Click Spec button → describe feature → Kiro creates requirements, design, and tasks.',
        action: 'Use Specs for multi-file features. Use Chat for quick fixes and single-file changes.',
        prompt: null,
      },
      {
        icon: '💡',
        title: 'Credit Efficiency',
        desc: 'Use Autopilot for routine tasks, Supervised for critical code. Be specific to avoid round trips.',
        action: 'Only activate manual steering you need. Batch saves during refactors. Specs are cheaper than many chat messages.',
        prompt: null,
      },
    ],
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Key Takeaways',
    takeaways: [
      { icon: '🤖', text: 'Automation over discipline — hooks enforce what humans forget' },
      { icon: '📏', text: 'Standards as code — steering rules are version-controlled and reviewable' },
      { icon: '🧠', text: 'Guided decisions — skills prevent gut-feel architecture choices' },
      { icon: '🏛️', text: 'Well-Architected by default — 5 pillars covered' },
      { icon: '🛡️', text: 'OWASP Top 10 addressed — not by process, but by tooling' },
      { icon: '📈', text: 'Incremental adoption — works for new and existing projects' },
    ],
  },
  {
    id: 'end',
    type: 'title',
    title: 'Questions?',
    subtitle: 'Let\'s discuss how to adopt this in your team',
    badge: 'Thank You',
  },
]

function SlideTitle({ slide }) {
  return (
    <div className="slide slide-title" data-testid={`slide-title-${slide.id}`}>
      {slide.badge && <span className="badge" data-testid={`slide-title-badge-${slide.id}`}>{slide.badge}</span>}
      <h1>{slide.title}</h1>
      <p className="subtitle">{slide.subtitle}</p>
    </div>
  )
}

function SlideAgenda({ slide }) {
  return (
    <div className="slide slide-agenda" data-testid="slide-agenda">
      <h2>{slide.title}</h2>
      <ul className="agenda-list" data-testid="agenda-list">
        {slide.items.map((item, i) => (
          <li key={i} className="agenda-item" data-testid={`agenda-item-${item.text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <span className="agenda-icon">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SlideTwoColumn({ slide }) {
  return (
    <div className="slide slide-two-col" data-testid="slide-two-col">
      <h2>{slide.title}</h2>
      <div className="two-col">
        <div className="col" style={{ borderColor: slide.left.color }} data-testid="two-col-left">
          <h3 style={{ color: slide.left.color }}>{slide.left.heading}</h3>
          <ul>
            {slide.left.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="col" style={{ borderColor: slide.right.color }} data-testid="two-col-right">
          <h3 style={{ color: slide.right.color }}>{slide.right.heading}</h3>
          <ul>
            {slide.right.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SlideThreeCards({ slide }) {
  return (
    <div className="slide slide-three-cards" data-testid="slide-three-cards">
      <h2>{slide.title}</h2>
      <div className="cards-row">
        {slide.cards.map((card, i) => (
          <div key={i} className="card" style={{ borderTopColor: card.color }} data-testid={`three-cards-card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p className="card-desc">{card.desc}</p>
            <ul>
              {card.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideDetail({ slide }) {
  return (
    <div className="slide slide-detail" data-testid="slide-detail">
      <h2>{slide.title}</h2>
      <div className="detail-sections">
        {slide.sections.map((s, i) => (
          <div key={i} className="detail-card" data-testid={`detail-card-${s.name}`}>
            <div className="detail-name">{s.name}</div>
            <div className="detail-row">
              <span className="detail-label">Trigger:</span> {s.trigger}
            </div>
            <div className="detail-row">
              <span className="detail-label">Action:</span> {s.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideSteeringGrid({ slide }) {
  return (
    <div className="slide slide-steering-grid" data-testid="slide-steering-grid">
      <h2>{slide.title}</h2>
      <div className="steering-grid">
        {slide.rules.map((r, i) => (
          <div key={i} className="steering-card" data-testid={`steering-card-${r.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <div className="steering-header">
              <span className="steering-icon">{r.icon}</span>
              <span className="steering-name">{r.name}</span>
              <span className={`steering-mode ${r.mode.toLowerCase()}`}>{r.mode}</span>
            </div>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideSkillsFlow({ slide }) {
  return (
    <div className="slide slide-skills-flow" data-testid="slide-skills-flow">
      <h2>{slide.title}</h2>
      <div className="skills-list">
        {slide.skills.map((s, i) => (
          <div key={i} className="skill-card" data-testid={`skill-card-${s.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <h3>{s.name}</h3>
            <div className="skill-meta">
              <span className="skill-tag">Trigger: {s.trigger}</span>
              <span className="skill-tag">{s.questions} questions</span>
            </div>
            <p className="skill-outcome">{s.outcome}</p>
            <div className="skill-example">{s.example}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideSectionBreak({ slide }) {
  return (
    <div className="slide slide-section-break" data-testid={`slide-section-break-${slide.id}`}>
      <h1>{slide.title}</h1>
      <p className="subtitle">{slide.subtitle}</p>
    </div>
  )
}

function SlidePillars({ slide }) {
  const [expanded, setExpanded] = useState(null)

  const handleClick = (i, e) => {
    const next = expanded === i ? null : i
    setExpanded(next)
    if (next !== null) {
      setTimeout(() => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  return (
    <div className="slide slide-pillars" data-testid="slide-pillars">
      <h2>{slide.title}</h2>
      <p className="pillars-hint">Click a pillar to see how the Kit ensures compliance</p>
      <div className="pillar-list">
        {slide.pillars.map((p, i) => (
          <div
            key={i}
            className={`pillar-item ${expanded === i ? 'expanded' : ''}`}
            style={{ borderLeftColor: p.color }}
            onClick={(e) => handleClick(i, e)}
            data-testid={`pillar-item-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="pillar-item-header">
              <span className="pillar-icon">{p.icon}</span>
              <span className="pillar-name">{p.name}</span>
              <span className="pillar-solution-count">{p.mappings.length} compliance points</span>
              <span className="pillar-toggle">{expanded === i ? '▲' : '▼'}</span>
            </div>
            <p className="pillar-desc">{p.desc}</p>
            {expanded === i && (
              <div className="pillar-solutions">
                <div className="pillar-solutions-label">How the Kit ensures compliance:</div>
                {p.mappings.map((m, j) => (
                  <div key={j} className="pillar-solution">
                    <span className="pillar-solution-source">{m.source}</span>
                    <span className="pillar-solution-text">{m.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pillar-ref">Source: <a href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" target="_blank" rel="noopener noreferrer" data-testid="pillar-ref-link">AWS Well-Architected Framework</a></div>
    </div>
  )
}

function SlideOwaspRisks({ slide }) {
  const [expanded, setExpanded] = useState(null)

  const handleClick = (idx, e) => {
    const next = expanded === idx ? null : idx
    setExpanded(next)
    if (next !== null) {
      setTimeout(() => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  return (
    <div className="slide slide-owasp" data-testid={`slide-owasp-${slide.id}`}>
      <h2>{slide.title}</h2>
      <div className="owasp-list" data-testid={`owasp-list-${slide.id}`}>
        {slide.risks.map((risk, idx) => (
          <div
            key={risk.id}
            className={`owasp-item ${expanded === idx ? 'expanded' : ''}`}
            onClick={(e) => handleClick(idx, e)}
            data-testid={`owasp-item-${risk.id.toLowerCase().replace(/:/g, '')}`}
          >
            <div className="owasp-header">
              <span className="owasp-id">{risk.id}</span>
              <span className="owasp-name">{risk.name}</span>
              <span className="owasp-solution-count">{risk.kitSolutions.length} solutions</span>
              <span className="owasp-toggle">{expanded === idx ? '▲' : '▼'}</span>
            </div>
            <p className="owasp-desc">{risk.desc}</p>
            {expanded === idx && (
              <div className="owasp-solutions" data-testid={`owasp-solutions-${risk.id.toLowerCase().replace(/:/g, '')}`}>
                <div className="owasp-solutions-label">How the Kit prevents this:</div>
                {risk.kitSolutions.map((sol, j) => (
                  <div key={j} className="owasp-solution" data-testid={`owasp-solution-${risk.id.toLowerCase().replace(/:/g, '')}-${j}`}>
                    <span className="owasp-solution-source">{sol.source}</span>
                    <span className="owasp-solution-fix">{sol.fix}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="owasp-ref">Source: <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" data-testid="owasp-ref-link">OWASP Top 10:2025</a></div>
    </div>
  )
}

function SlideFlow({ slide }) {
  return (
    <div className="slide slide-flow" data-testid="slide-flow">
      <h2>{slide.title}</h2>
      <div className="flow-steps">
        {slide.steps.map((step, i) => (
          <div key={i} className="flow-step" data-testid={`flow-step-${step.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flow-icon">{step.icon}</div>
            <div className="flow-label">{step.label}</div>
            <div className="flow-desc">{step.desc}</div>
            {i < slide.steps.length - 1 && <div className="flow-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideAdoption({ slide }) {
  return (
    <div className="slide slide-adoption" data-testid="slide-adoption">
      <h2>{slide.title}</h2>
      <div className="adoption-phases">
        {slide.phases.map((p, i) => (
          <div key={i} className="adoption-card" data-testid={`adoption-card-${p.phase.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <div className="adoption-icon">{p.icon}</div>
            <h3>{p.phase}</h3>
            <ul>
              {p.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideUsageGuide({ slide }) {
  return (
    <div className="slide slide-usage-guide" data-testid="slide-usage-guide">
      <h2>{slide.title}</h2>
      <div className="usage-sections" data-testid="usage-guide-sections">
        {slide.sections.map((s, i) => (
          <div key={i} className="usage-card" data-testid={`usage-guide-card-${s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <div className="usage-card-header">
              <span className="usage-card-icon">{s.icon}</span>
              <div>
                <div className="usage-card-title">{s.title}</div>
                <div className="usage-card-desc">{s.desc}</div>
              </div>
            </div>
            <div className="usage-card-action">{s.action}</div>
            {s.prompt && <pre className="usage-card-prompt" data-testid={`usage-guide-prompt-${s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>{s.prompt}</pre>}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideSummary({ slide }) {
  return (
    <div className="slide slide-summary" data-testid="slide-summary">
      <h2>{slide.title}</h2>
      <div className="summary-grid">
        {slide.takeaways.map((t, i) => (
          <div key={i} className="summary-item" data-testid={`summary-item-${t.text.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`}>
            <span className="summary-icon">{t.icon}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderSlide(slide) {
  switch (slide.type) {
    case 'title': return <SlideTitle slide={slide} />
    case 'agenda': return <SlideAgenda slide={slide} />
    case 'two-column': return <SlideTwoColumn slide={slide} />
    case 'three-cards': return <SlideThreeCards slide={slide} />
    case 'detail': return <SlideDetail slide={slide} />
    case 'steering-grid': return <SlideSteeringGrid slide={slide} />
    case 'skills-flow': return <SlideSkillsFlow slide={slide} />
    case 'section-break': return <SlideSectionBreak slide={slide} />
    case 'pillars': return <SlidePillars slide={slide} />
    case 'sdlc-issues': return <SlideOwaspRisks slide={slide} />
    case 'owasp-risks': return <SlideOwaspRisks slide={slide} />
    case 'flow': return <SlideFlow slide={slide} />
    case 'adoption': return <SlideAdoption slide={slide} />
    case 'usage-guide': return <SlideUsageGuide slide={slide} />
    case 'summary': return <SlideSummary slide={slide} />
    default: return <div className="slide"><h2>{slide.title}</h2></div>
  }
}

function PillarsPrintView({ slide }) {
  return (
    <div className="slide slide-pillars" data-testid="pillars-print-view">
      <h2>{slide.title}</h2>
      <div className="pillar-list">
        {slide.pillars.map((p, i) => (
          <div key={i} className="pillar-item expanded" style={{ borderLeftColor: p.color }} data-testid={`pillar-print-item-${p.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="pillar-item-header">
              <span className="pillar-icon">{p.icon}</span>
              <span className="pillar-name">{p.name}</span>
            </div>
            <p className="pillar-desc">{p.desc}</p>
            <div className="pillar-solutions">
              <div className="pillar-solutions-label">How the Kit ensures compliance:</div>
              {p.mappings.map((m, j) => (
                <div key={j} className="pillar-solution">
                  <span className="pillar-solution-source">{m.source}</span>
                  <span className="pillar-solution-text">{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pillar-ref">Source: AWS Well-Architected Framework — <a href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" data-testid="pillar-print-ref-link">https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html</a></div>
    </div>
  )
}

function OwaspPrintView({ slide }) {
  return (
    <div className="slide slide-owasp" data-testid={`owasp-print-view-${slide.id}`}>
      <h2>{slide.title}</h2>
      <div className="owasp-list" data-testid={`owasp-print-list-${slide.id}`}>
        {slide.risks.map((risk) => (
          <div key={risk.id} className="owasp-item expanded" data-testid={`owasp-print-item-${risk.id.toLowerCase().replace(/:/g, '')}`}>
            <div className="owasp-header">
              <span className="owasp-id">{risk.id}</span>
              <span className="owasp-name">{risk.name}</span>
            </div>
            <p className="owasp-desc">{risk.desc}</p>
            <div className="owasp-solutions">
              <div className="owasp-solutions-label">How the Kit prevents this:</div>
              {risk.kitSolutions.map((sol, j) => (
                <div key={j} className="owasp-solution">
                  <span className="owasp-solution-source">{sol.source}</span>
                  <span className="owasp-solution-fix">{sol.fix}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="owasp-ref">Source: OWASP Top 10:2025 — <a href="https://owasp.org/www-project-top-ten/" data-testid="owasp-print-ref-link">https://owasp.org/www-project-top-ten/</a></div>
    </div>
  )
}

function renderSlidePrint(slide) {
  switch (slide.type) {
    case 'pillars': return <PillarsPrintView slide={slide} />
    case 'owasp-risks': return <OwaspPrintView slide={slide} />
    case 'sdlc-issues': return <OwaspPrintView slide={slide} />
    default: return renderSlide(slide)
  }
}

function App() {
  const [current, setCurrent] = useState(0)
  const [printMode, setPrintMode] = useState(false)

  const goNext = () => setCurrent((c) => Math.min(c + 1, slides.length - 1))
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0))

  const handleKeyDown = (e) => {
    if (printMode) return
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  }

  const handleExportPDF = () => {
    document.documentElement.classList.add('printing')
    setPrintMode(true)
    setTimeout(() => {
      window.print()
      setTimeout(() => {
        setPrintMode(false)
        document.documentElement.classList.remove('printing')
      }, 500)
    }, 100)
  }

  if (printMode) {
    return (
      <div className="print-view" data-testid="app-print-view">
        <div className="print-section-header">Training Slides</div>
        {slides.map((slide, i) => (
          <div key={i} className="print-slide" data-testid={`app-print-slide-${slide.id}`}>
            {renderSlidePrint(slide)}
          </div>
        ))}
        <div className="print-section-header">Activation Guide</div>
        <div className="print-slide print-guide">
          <ActivationGuide />
        </div>
      </div>
    )
  }

  return (
    <div className="presentation" tabIndex={0} onKeyDown={handleKeyDown} data-testid="app-presentation">
      <div className="slide-container" data-testid="app-slide-container">
        {renderSlide(slides[current])}
      </div>
      <div className="controls" data-testid="app-controls">
        <button onClick={goPrev} disabled={current === 0} data-testid="app-prev-button">← Previous</button>
        <span className="slide-counter" data-testid="app-slide-counter">{current + 1} / {slides.length}</span>
        <button onClick={goNext} disabled={current === slides.length - 1} data-testid="app-next-button">Next →</button>
        <button className="export-btn" onClick={handleExportPDF} data-testid="app-export-pdf-button">📄 Export PDF</button>
      </div>
      <div className="slide-nav" data-testid="app-slide-nav">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            data-testid={`app-slide-dot-${slides[i].id}`}
          />
        ))}
      </div>
    </div>
  )
}

const steeringGuide = [
  {
    name: 'Entity Standards',
    file: 'entity-standards.md',
    mode: 'Auto',
    icon: '📋',
    what: 'Enforces audit fields (id, created_date, modified_date, created_by, modified_by, deleted_at), soft delete, and input sanitization on every entity.',
    when: 'Always needed. Every data model must have audit fields and sanitization. This is foundational — never turn it off.',
    whenNot: 'No scenario where this should be deactivated.',
    activate: 'Active by default. No action needed.',
    deactivate: 'Not recommended. If you must: change front matter to inclusion: manual.',
  },
  {
    name: 'Timezone Rules',
    file: 'timezone-rules.md',
    mode: 'Auto',
    icon: '🕐',
    what: 'Enforces UTC storage, offset-aware API contracts, TIMESTAMPTZ columns, and companion timezone columns for date-only fields.',
    when: 'Always needed. Any application that stores or displays dates/times needs this. Timezone bugs are subtle and expensive.',
    whenNot: 'No scenario where this should be deactivated.',
    activate: 'Active by default. No action needed.',
    deactivate: 'Not recommended. If you must: change front matter to inclusion: manual.',
  },
  {
    name: 'Testing Standards',
    file: 'testing-standards.md',
    mode: 'Auto',
    icon: '🧪',
    what: 'Enforces AAA test pattern, 90% coverage target, required test file headers, security tests for handlers, regression tests for bug fixes.',
    when: 'Always needed. Every function must have tests. This ensures Kiro never generates code without accompanying tests.',
    whenNot: 'No scenario where this should be deactivated.',
    activate: 'Active by default. No action needed.',
    deactivate: 'Not recommended. If you must: change front matter to inclusion: manual.',
  },
  {
    name: 'Query Safety',
    file: 'query-safety-rules.md',
    mode: 'FileMatch',
    icon: '🛡️',
    what: 'Mandates parameterized queries, bans keyword blocklists, enforces allowlist validation for dynamic columns. Prevents SQL injection and false-positive data rejection.',
    when: 'When editing backend code that builds or executes database queries — handlers, services, repositories, API routes.',
    whenNot: 'When working on frontend components, CSS, documentation, or infrastructure code that doesn\'t touch databases.',
    activate: 'Loads automatically when you open/edit files matching: **/handlers/**, **/repositories/**, **/services/**, **/db/**, **/api/**',
    deactivate: 'No action needed — it only loads when relevant files are in context.',
  },
  {
    name: 'QA Element IDs',
    file: 'qa-element-id-rules.md',
    mode: 'FileMatch',
    icon: '🏷️',
    what: 'Ensures data-testid attributes on all interactive UI elements using id_view_type_name convention in snake_case.',
    when: 'When editing frontend component files — React, Vue, Svelte, or HTML.',
    whenNot: 'When working on backend Python code, database migrations, infrastructure, or documentation.',
    activate: 'Loads automatically when you open/edit files matching: **/*.tsx, **/*.jsx, **/*.vue, **/*.svelte, **/*.html',
    deactivate: 'No action needed — it only loads when relevant files are in context.',
  },
  {
    name: 'Storage Design',
    file: 'storage-design-rules.md',
    mode: 'FileMatch',
    icon: '💾',
    what: 'Enforces schema design, indexing strategy, encryption, backups, table naming (app_, map_, txn_), and Well-Architected alignment for all storage.',
    when: 'When creating or modifying data models, database schemas, migrations, or storage configurations.',
    whenNot: 'When working on frontend components, API handlers (without schema changes), or documentation.',
    activate: 'Loads automatically when you open/edit files matching: **/models/**, **/migrations/**, **/schema/**, **/db/**, **/repositories/**',
    deactivate: 'No action needed — it only loads when relevant files are in context.',
  },
  {
    name: 'Concurrency & Locking',
    file: 'concurrency-and-locking-rules.md',
    mode: 'Manual',
    icon: '🔒',
    what: 'Enforces short transactions, consistent lock ordering, row-level locks, optimistic concurrency with version columns, connection pooling, and DynamoDB conditional writes.',
    when: 'When writing code that performs concurrent database writes — order processing, inventory updates, queue consumers, batch operations, or any multi-user write scenario.',
    whenNot: 'When building read-only features, frontend components, simple CRUD without concurrency concerns, or documentation.',
    activate: 'Type #concurrency-and-locking-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Report Generation',
    file: 'report-generation-rules.md',
    mode: 'Manual',
    icon: '📊',
    what: 'Enforces light vs heavy report classification, read replicas for heavy reports, async generation, streaming exports, caching strategies, and query optimization.',
    when: 'When building reports, dashboards, data exports (CSV/Excel/PDF), or any read-heavy aggregation feature.',
    whenNot: 'When building CRUD features, authentication, file uploads, or any feature that doesn\'t involve data aggregation or export.',
    activate: 'Type #report-generation-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Data Upload',
    file: 'data-upload-rules.md',
    mode: 'Manual',
    icon: '📤',
    what: 'Enforces light/heavy upload classification, row validation, staging tables, duplicate/collision handling, off-peak scheduling, and file security.',
    when: 'When building features that accept user-uploaded files (Excel, CSV) for import into the system.',
    whenNot: 'When building features that don\'t involve file-based data import — API-only data entry, frontend components, reports.',
    activate: 'Type #data-upload-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Offline Sync',
    file: 'offline-sync-rules.md',
    mode: 'Manual',
    icon: '📡',
    what: 'Enforces delta sync protocol, local storage schema, conflict resolution strategies, sync API design, and network awareness.',
    when: 'When building client applications that must work without network connectivity and sync data when reconnected.',
    whenNot: 'When building server-only features, always-online web apps, or backend services that don\'t have offline requirements.',
    activate: 'Type #offline-sync-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'API Standards',
    file: 'api-standards.md',
    mode: 'Manual',
    icon: '🔌',
    what: 'Enforces response format (JSON envelope), HTTP status codes, fail-closed exception handling (OWASP A10), request validation, and rate limiting.',
    when: 'When building new API endpoints, error handling middleware, or standardizing response formats across the project.',
    whenNot: 'When working on frontend code, database models, or infrastructure that doesn\'t involve API design.',
    activate: 'Type #api-standards in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Auth Rules',
    file: 'auth-rules.md',
    mode: 'Manual',
    icon: '🔑',
    what: 'Enforces AWS Cognito User Pool as recommended auth provider, JWT/JWKS validation with caching, role-based access control (RBAC) via Cognito Groups, resource ownership scoping, password handling, and session management.',
    when: 'When implementing authentication, authorization, login/logout, or access control for the first time or making changes to auth logic.',
    whenNot: 'When the auth system is already built and you\'re working on features that don\'t touch auth. Entity-standards already handles created_by/modified_by from JWT context.',
    activate: 'Type #auth-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Secrets Management',
    file: 'secrets-management-rules.md',
    mode: 'Manual',
    icon: '🗝️',
    what: 'Enforces AWS Parameter Store as source of truth for secrets and config. Load once at startup using GetParametersByPath, read from memory at runtime. Supports pipeline injection (existing projects) and app-level loading (new projects). Admin reload endpoint for refresh without redeployment.',
    when: 'When setting up secrets management, adding new configuration parameters, or migrating from hardcoded secrets to Parameter Store.',
    whenNot: 'When secrets management is already configured and you\'re writing business logic that just reads from the config object.',
    activate: 'Type #secrets-management-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
  {
    name: 'Logging Rules',
    file: 'logging-rules.md',
    mode: 'Manual',
    icon: '📝',
    what: 'Enforces structured JSON logging, log levels, what to log vs never log (PII redaction), correlation IDs for request tracing, and log retention.',
    when: 'When setting up logging infrastructure, adding observability, or standardizing log output across the project.',
    whenNot: 'When the logging setup is already in place and you\'re writing business logic that doesn\'t need logging changes.',
    activate: 'Type #logging-rules in the Kiro chat to activate for the current session.',
    deactivate: 'It deactivates automatically when the session ends. No action needed.',
  },
]

const skillsGuide = [
  {
    name: 'Compute Selection',
    folder: 'compute-selection',
    icon: '⚙️',
    what: 'Guided 7-question decision flow for choosing between Lambda/serverless and containers/ECS/Fargate, with cost estimates.',
    when: 'When you need to decide on a compute platform for a new workload — API, background worker, scheduled job, event processor, or long-running service.',
    whenNot: 'When the compute platform is already decided and you\'re just implementing. Or when modifying existing infrastructure without changing the compute model.',
    activate: 'Mention any of these keywords in chat: Lambda, ECS, container, Docker, microservice, worker, background processing, scheduled task, batch job. The skill activates automatically.',
    deactivate: 'Skills only activate on keyword triggers — they don\'t consume credits when not triggered. No deactivation needed.',
  },
  {
    name: 'Storage Selection',
    folder: 'storage-selection',
    icon: '💾',
    what: 'Guided 9-question, 3-phase decision flow: data model (NoSQL vs SQL) → engine (PostgreSQL vs MySQL) → deployment (serverless vs serverful).',
    when: 'When choosing a database for a new feature or service. When evaluating whether to use DynamoDB, PostgreSQL, MySQL, or another storage option.',
    whenNot: 'When the database is already chosen and you\'re writing queries or models for it. Or when working on frontend code.',
    activate: 'Mention any of these keywords in chat: database, storage, DynamoDB, RDS, PostgreSQL, MySQL, which database, data layer. The skill activates automatically.',
    deactivate: 'Skills only activate on keyword triggers — they don\'t consume credits when not triggered. No deactivation needed.',
  },
  {
    name: 'Tenant Strategy',
    folder: 'tenant-strategy',
    icon: '🏢',
    what: 'Guided 5-question decision flow for choosing multi-tenancy isolation model: row-level → schema-per-tenant → database-per-tenant → stack-per-tenant.',
    when: 'When designing a SaaS application that serves multiple customers/organizations. When deciding how to isolate tenant data.',
    whenNot: 'When building a single-tenant application. When the tenancy model is already decided and you\'re implementing within it.',
    activate: 'Mention any of these keywords in chat: multi-tenant, tenancy, SaaS, tenant isolation, per-customer, white-label, multiple organizations. The skill activates automatically.',
    deactivate: 'Skills only activate on keyword triggers — they don\'t consume credits when not triggered. No deactivation needed.',
  },
  {
    name: 'Offline Security Selection',
    folder: 'offline-security-selection',
    icon: '🔐',
    what: 'Guided 8-question, 3-phase decision flow: data sensitivity → tamper risk → performance constraints. Recommends server validation only, HMAC signatures, SQLCipher encryption, or all combined.',
    when: 'When building offline-capable apps that store data locally. When deciding how to protect client-side data from tampering or exposure.',
    whenNot: 'When building server-only features with no offline component. When the offline security approach is already decided.',
    activate: 'Mention any of these keywords in chat: offline security, client-side encryption, tamper detection, SQLCipher, HMAC, offline integrity, field data security. The skill activates automatically.',
    deactivate: 'Skills only activate on keyword triggers — they don\'t consume credits when not triggered. No deactivation needed.',
  },
]

const hooksGuide = [
  {
    name: 'Unit Test on Edit (v2)',
    file: 'unit-test-on-edit.kiro.hook',
    icon: '🧪',
    trigger: 'Source files in handlers/, services/, models/, repositories/, utils/, api/, core/, lib/',
    what: 'Checks if unit tests exist for the saved file. If missing or incomplete, generates them following the testing-standards steering file. Excludes test files, migrations, config, and __init__.py to avoid unnecessary triggers.',
    when: 'Always useful during active development. Ensures no code ships without tests.',
    whenNot: 'If you\'re doing a bulk refactor touching many files and want to generate tests afterward in one pass. Temporarily disable by setting "enabled": false.',
    activate: 'Enabled by default. If previously disabled, set "enabled": true in the hook file.',
    deactivate: 'Set "enabled": false in .kiro/hooks/unit-test-on-edit.kiro.hook. Re-enable when done.',
  },
  {
    name: 'Security Test on Handler (v2)',
    file: 'security-test-on-handler.kiro.hook',
    icon: '🔐',
    trigger: 'Handler file saved (**/handlers/**/*.py)',
    what: 'Generates security tests following the testing-standards and query-safety-rules steering files. Compact prompt references steering instead of repeating rules inline.',
    when: 'Always useful when developing API handlers that process user input. First line of defense against OWASP A01 and A03.',
    whenNot: 'If you\'re editing handler files for non-functional changes (comments, formatting). Temporarily disable.',
    activate: 'Enabled by default. If previously disabled, set "enabled": true in the hook file.',
    deactivate: 'Set "enabled": false in .kiro/hooks/security-test-on-handler.kiro.hook. Re-enable when done.',
  },
  {
    name: 'QA Element IDs (v2)',
    file: 'qa-element-ids.kiro.hook',
    icon: '🏷️',
    trigger: 'Frontend file saved (.tsx, .jsx, .vue, .svelte, .html)',
    what: 'Scans for interactive elements missing data-testid and adds them following the qa-element-id-rules steering file. Compact prompt — 75% smaller than v1.',
    when: 'Always useful during frontend development. Ensures QA automation is never blocked by missing selectors.',
    whenNot: 'If you\'re doing a large frontend refactor and want to add testids in a single pass afterward. Temporarily disable.',
    activate: 'Enabled by default. If previously disabled, set "enabled": true in the hook file.',
    deactivate: 'Set "enabled": false in .kiro/hooks/qa-element-ids.kiro.hook. Re-enable when done.',
  },
]

const installSteps = [
  {
    step: 1,
    title: 'Download Kiro for macOS (Apple Silicon)',
    icon: '📥',
    content: 'Go to kiro.dev and download the macOS Apple Silicon (.dmg) installer.',
    details: [
      'Select the Apple Silicon / ARM64 version for M1, M2, M3, or M4 Macs',
      'Ensure your macOS has the latest security updates installed',
    ],
    link: 'https://kiro.dev/downloads/',
  },
  {
    step: 2,
    title: 'Install & Launch',
    icon: '🚀',
    content: 'Open the .dmg file and drag Kiro to your Applications folder. Then launch Kiro from Applications or Spotlight.',
    details: [
      'If macOS blocks the app: go to System Settings → Privacy & Security → click "Open Anyway"',
      'First launch may take a moment while macOS verifies the app',
    ],
  },
  {
    step: 3,
    title: 'Sign In with AWS IAM Identity Center',
    icon: '🔑',
    content: 'On first launch, select the AWS IAM Identity Center (enterprise SSO) sign-in option. Use your organization\'s SSO credentials.',
    details: [
      'Select "Sign in with AWS IAM Identity Center" from the login screen',
      'Enter your organization\'s SSO start URL when prompted',
      'Authenticate with your corporate credentials (SSO/SAML)',
      'Contact your AWS administrator if you don\'t have IAM Identity Center access',
    ],
  },
  {
    step: 4,
    title: 'Import VS Code Settings (Optional)',
    icon: '⚙️',
    content: 'Kiro offers to import your VS Code settings, extensions, and keybindings. Skip if you prefer a fresh start.',
    details: [
      'Themes, extensions, and settings transfer automatically',
      'Kiro is VS Code-compatible — most extensions work out of the box',
    ],
  },
  {
    step: 5,
    title: 'Request the Configuration Kit',
    icon: '📦',
    content: 'Message joseph.m on Google Chat to request the kit repository URL. Provide your GitHub account username so you can be granted access.',
    details: [
      'Send a message to joseph.m on GChat with your GitHub username',
      'Once granted access, clone the repo: git clone <provided-url>',
      'Copy the .kiro directory into your project root: cp -r <cloned-repo>/.kiro .kiro',
      'The .kiro directory contains hooks/, steering/, and skills/',
    ],
  },
  {
    step: 6,
    title: 'Open Your Project',
    icon: '📂',
    content: 'Open your project folder in Kiro. Auto-inclusion steering rules activate immediately. Hooks start firing on file saves.',
    details: [
      'Entity standards, timezone rules, and testing standards load automatically',
      'FileMatch rules load when you open matching files',
      'Manual rules are available via # reference in chat',
      'Skills activate when you mention relevant keywords',
    ],
  },
  {
    step: 7,
    title: 'Verify Setup',
    icon: '✅',
    content: 'Test that everything works by saving a Python file — the unit-test hook should trigger. Save a handler file — the security-test hook should trigger.',
    details: [
      'Check the Kiro agent panel for hook activity',
      'Try mentioning "database" in chat — the storage-selection skill should activate',
      'Type #concurrency-and-locking-rules to verify manual steering activation',
    ],
  },
]

function ActivationGuide() {
  const [openSteering, setOpenSteering] = useState(null)
  const [openSkill, setOpenSkill] = useState(null)
  const [openHook, setOpenHook] = useState(null)

  return (
    <div className="guide-page">
      <div className="guide-content">
        <h1 className="guide-title">Activation Guide</h1>
        <p className="guide-subtitle">How to install Kiro, set up the kit, and manage steering rules, skills, and hooks.</p>

        <section className="guide-section" data-testid="activation-guide-install-section">
          <h2>Installation & Setup</h2>
          <p className="guide-section-desc">Get Kiro running and the configuration kit loaded in 7 steps. Source: <a href="https://kiro.dev/docs/getting-started/installation" target="_blank" rel="noopener noreferrer" className="guide-link" data-testid="activation-guide-install-docs-link">kiro.dev/docs</a></p>
          <div className="install-steps">
            {installSteps.map((s) => (
              <div key={s.step} className="install-step" data-testid={`activation-guide-install-step-${s.step}`}>
                <div className="install-step-num">{s.step}</div>
                <div className="install-step-body">
                  <div className="install-step-title">{s.icon} {s.title}</div>
                  <p className="install-step-content">{s.content}</p>
                  <ul className="install-step-details">
                    {s.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                  {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="install-step-link" data-testid={`activation-guide-install-step-${s.step}-link`}>Download →</a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" data-testid="activation-guide-steering-section">
          <h2>Steering Rules</h2>
          <p className="guide-section-desc">Steering rules guide Kiro's code generation. They come in three tiers based on how they load into context.</p>
          <div className="guide-legend">
            <span className="steering-mode auto">Auto</span> Always active — loaded every interaction
            <span className="steering-mode filematch">FileMatch</span> Contextual — loaded only when editing matching files
            <span className="steering-mode manual">Manual</span> Opt-in — activated by typing # + rule name in chat
          </div>
          <div className="guide-list">
            {steeringGuide.map((item, i) => (
              <div key={i} className={`guide-item ${openSteering === i ? 'open' : ''}`} onClick={() => setOpenSteering(openSteering === i ? null : i)} data-testid={`activation-guide-steering-item-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                <div className="guide-item-header">
                  <span className="guide-item-icon">{item.icon}</span>
                  <span className="guide-item-name">{item.name}</span>
                  <span className={`steering-mode ${item.mode.toLowerCase()}`}>{item.mode}</span>
                  <span className="guide-item-toggle">{openSteering === i ? '▲' : '▼'}</span>
                </div>
                <p className="guide-item-what">{item.what}</p>
                {openSteering === i && (
                  <div className="guide-item-details">
                    <div className="guide-detail"><span className="guide-label">File:</span> .kiro/steering/{item.file}</div>
                    <div className="guide-detail guide-when"><span className="guide-label">When to use:</span> {item.when}</div>
                    <div className="guide-detail guide-when-not"><span className="guide-label">When NOT to use:</span> {item.whenNot}</div>
                    <div className="guide-detail guide-activate"><span className="guide-label">How to activate:</span> {item.activate}</div>
                    <div className="guide-detail guide-deactivate"><span className="guide-label">How to deactivate:</span> {item.deactivate}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" data-testid="activation-guide-skills-section">
          <h2>Skills</h2>
          <p className="guide-section-desc">Skills are interactive decision flows that activate on keyword triggers. They don't consume credits until triggered.</p>
          <div className="guide-list">
            {skillsGuide.map((item, i) => (
              <div key={i} className={`guide-item ${openSkill === i ? 'open' : ''}`} onClick={() => setOpenSkill(openSkill === i ? null : i)} data-testid={`activation-guide-skill-item-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                <div className="guide-item-header">
                  <span className="guide-item-icon">{item.icon}</span>
                  <span className="guide-item-name">{item.name}</span>
                  <span className="steering-mode auto">Keyword</span>
                  <span className="guide-item-toggle">{openSkill === i ? '▲' : '▼'}</span>
                </div>
                <p className="guide-item-what">{item.what}</p>
                {openSkill === i && (
                  <div className="guide-item-details">
                    <div className="guide-detail"><span className="guide-label">Folder:</span> .kiro/skills/{item.folder}/SKILL.md</div>
                    <div className="guide-detail guide-when"><span className="guide-label">When to use:</span> {item.when}</div>
                    <div className="guide-detail guide-when-not"><span className="guide-label">When NOT to use:</span> {item.whenNot}</div>
                    <div className="guide-detail guide-activate"><span className="guide-label">How to activate:</span> {item.activate}</div>
                    <div className="guide-detail guide-deactivate"><span className="guide-label">How to deactivate:</span> {item.deactivate}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" data-testid="activation-guide-hooks-section">
          <h2>Hooks</h2>
          <p className="guide-section-desc">Hooks fire automatically on file events. They trigger agent interactions that consume credits on every matching file save.</p>
          <div className="guide-list">
            {hooksGuide.map((item, i) => (
              <div key={i} className={`guide-item ${openHook === i ? 'open' : ''}`} onClick={() => setOpenHook(openHook === i ? null : i)} data-testid={`activation-guide-hook-item-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                <div className="guide-item-header">
                  <span className="guide-item-icon">{item.icon}</span>
                  <span className="guide-item-name">{item.name}</span>
                  <span className="steering-mode manual">On Save</span>
                  <span className="guide-item-toggle">{openHook === i ? '▲' : '▼'}</span>
                </div>
                <p className="guide-item-what">{item.what}</p>
                {openHook === i && (
                  <div className="guide-item-details">
                    <div className="guide-detail"><span className="guide-label">File:</span> .kiro/hooks/{item.file}</div>
                    <div className="guide-detail"><span className="guide-label">Trigger:</span> {item.trigger}</div>
                    <div className="guide-detail guide-when"><span className="guide-label">When to use:</span> {item.when}</div>
                    <div className="guide-detail guide-when-not"><span className="guide-label">When NOT to use:</span> {item.whenNot}</div>
                    <div className="guide-detail guide-activate"><span className="guide-label">How to activate:</span> {item.activate}</div>
                    <div className="guide-detail guide-deactivate"><span className="guide-label">How to deactivate:</span> {item.deactivate}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

const workshopParts = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '🎯',
    duration: null,
    content: [
      { type: 'intro', text: 'Build a Dev Diary app using Kiro with the configuration kit active. By the end you will have experienced every component of the kit in action.' },
      { type: 'meta', label: 'Estimated time', value: '90–120 minutes' },
      { type: 'meta', label: 'Sign in with', value: 'AWS Builder ID (free) — NOT the organization IAM Identity Center. Create one at profile.aws.amazon.com' },
      { type: 'meta', label: 'Python version', value: 'Use Python 3.11 or 3.12 — do NOT use 3.13+ (SQLAlchemy compatibility issues, see Troubleshooting)' },
      { type: 'heading', text: 'What You\'ll Build' },
      { type: 'list', items: ['Create diary entries with title, content, mood, and tags', 'List entries with keyset pagination', 'Edit and soft-delete entries', 'Export entries as CSV'] },
      { type: 'heading', text: 'Prerequisites' },
      { type: 'list', items: ['Kiro installed and signed in with AWS Builder ID', 'Configuration kit (.kiro directory) in place', 'Python 3.11 or 3.12 + Node.js 18+'] },
    ],
  },
  {
    id: 'techstack',
    title: 'Tech Stack',
    icon: '📦',
    duration: null,
    content: [
      { type: 'intro', text: 'Every framework in this workshop was chosen deliberately. Here\'s what each one does and why it was selected.' },
      {
        type: 'techitem',
        name: 'FastAPI',
        layer: 'API Layer',
        color: '#22c55e',
        why: 'Generates interactive API docs automatically (/docs), has built-in request validation via Pydantic, supports async natively, and is one of the fastest Python frameworks. The handler structure maps directly to the **/handlers/**/*.py pattern that triggers the security hook.',
        vs: 'Flask (simpler but no auto-docs, no async) or Django (heavier, better for full-stack apps than pure APIs)',
      },
      {
        type: 'techitem',
        name: 'SQLAlchemy',
        layer: 'ORM',
        color: '#3b82f6',
        why: 'Makes parameterized queries the default — you write filter(User.name == user_input) and SQLAlchemy handles parameterization. This is exactly what query-safety-rules.md enforces. Also abstracts the database engine so the same code works with SQLite (workshop) and PostgreSQL (production) by just changing the connection string.',
        vs: 'Raw SQL (injection-prone without discipline) or Django ORM (tied to Django)',
      },
      {
        type: 'techitem',
        name: 'Pydantic',
        layer: 'Validation',
        color: '#8b5cf6',
        why: 'Bundled with FastAPI. Powers the @field_validator that entity-standards.md uses for input sanitization — stripping < > & " \' from string fields. Also enforces Field(min_length, max_length) constraints automatically. Without it, you\'d write manual validation for every field.',
        vs: 'Manual validation (error-prone, verbose) or Marshmallow (older, less integrated with FastAPI)',
      },
      {
        type: 'techitem',
        name: 'Alembic',
        layer: 'Migrations',
        color: '#f59e0b',
        why: 'Manages schema changes as versioned migration files. When you add a version column for optimistic concurrency, Alembic creates migration 0002 that can be applied to any environment. Has rollback, history, and incremental changes — required for production. The workshop demonstrates the problem without it: create_all() runs on startup, then Alembic tries to create the same tables again and fails.',
        vs: 'Base.metadata.create_all() — fine for prototypes but no rollback, no history, no incremental changes to live databases',
        note: 'The Python 3.14 compatibility issue was a temporary ecosystem lag (SQLAlchemy 2.0.30–2.0.40), already resolved in 2.0.49+. Alembic itself is stable and widely used in production.',
      },
      {
        type: 'techitem',
        name: 'SQLite',
        layer: 'Database',
        color: '#06b6d4',
        why: 'File-based database that ships with Python\'s standard library — zero installation, zero configuration. The storage-selection skill correctly recommends it for a single-user local app. Not a toy — used in production by browsers, mobile apps, and embedded systems. SQLAlchemy abstraction means swapping to PostgreSQL later is just a connection string change.',
        vs: 'PostgreSQL (better for multi-user/production but requires a running server)',
      },
      {
        type: 'techitem',
        name: 'React',
        layer: 'Frontend UI',
        color: '#60a5fa',
        why: 'Most widely used frontend library. The qa-element-id-rules.md steering file has React/JSX examples, and the qa-element-ids hook targets .jsx/.tsx files. Component-based structure maps naturally to the data-testid naming convention ({component}-{element}-{descriptor}).',
        vs: 'Vue or Svelte (also supported by the kit\'s hooks) or plain HTML (no component model)',
      },
      {
        type: 'techitem',
        name: 'Vite',
        layer: 'Build / Dev Server',
        color: '#a78bfa',
        why: 'Significantly faster than Create React App (deprecated). Has native ES module support. Critically: built-in proxy configuration in vite.config.js proxies /entries to http://localhost:8000, so the frontend and backend can run on different ports without CORS issues during development.',
        vs: 'Create React App (deprecated, slow) or webpack (complex configuration)',
      },
      {
        type: 'techitem',
        name: 'Uvicorn',
        layer: 'ASGI Server',
        color: '#34d399',
        why: 'Standard ASGI server for FastAPI. FastAPI is async-capable (ASGI), and Uvicorn is its runtime. The --reload flag watches for file changes and restarts automatically during development. Not a framework you interact with directly — it\'s what serves the API.',
        vs: 'Gunicorn (WSGI, no async support) or Hypercorn (less common)',
      },
      {
        type: 'techitem',
        name: 'pytest',
        layer: 'Testing',
        color: '#fb923c',
        why: 'Standard Python testing framework. testing-standards.md uses pytest conventions (@pytest.mark.security, @pytest.mark.regression), and both hooks generate pytest-compatible test files. pytest-cov provides coverage reports that verify the 90% coverage target.',
        vs: 'unittest (built-in but verbose) or nose (deprecated)',
      },
    ],
  },
  {
    id: 'part1',
    title: 'Part 1: Project Setup',
    icon: '📁',
    duration: '10 min',
    content: [
      { type: 'step', num: '1.1', title: 'Create the project', code: 'mkdir dev-diary\ncd dev-diary\ngit init' },
      { type: 'step', num: '1.2', title: 'Copy the kit', text: 'Copy the .kiro directory from the kit repository into dev-diary/.' },
      { type: 'step', num: '1.3', title: 'Open in Kiro', text: 'Open the dev-diary folder in Kiro. Click the Ghost icon → verify entity-standards, timezone-rules, and testing-standards are listed as auto-loaded.' },
      { type: 'step', num: '1.4', title: 'Generate project context (safe prompt)', prompt: 'Create three steering files in .kiro/steering/:\n1. product.md — A Dev Diary app for developers to log daily entries with title, content, mood, and tags. Single-user for now.\n2. tech-stack.md — Python 3.11, FastAPI, SQLAlchemy, Alembic for migrations. React frontend with Vite.\n3. project-structure.md — backend/ for Python API, frontend/ for React app, tests/ for all tests.\n\nSet all to inclusion: auto. Do NOT include coding standards or conventions — those are in existing steering files.', promptExplain: 'We ask for three specific files instead of clicking "Generate Steering Docs" because the button creates generic files that can conflict with the kit\'s curated rules. By writing the prompt ourselves we control exactly what gets created. The "Do NOT include coding standards" instruction is critical — it prevents Kiro from duplicating entity-standards, timezone-rules, or testing-standards that are already in the kit. The inclusion: auto instruction tells Kiro to load these files in every interaction so it always knows what the project is and what tech it uses.' },
      { type: 'observe', text: 'Kiro creates only project-context files. The kit\'s coding standards remain untouched.' },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2: Database & Entity Design',
    icon: '🗄️',
    duration: '15 min',
    content: [
      { type: 'step', num: '2.1', title: 'Trigger the storage-selection skill', prompt: 'I need to choose a database for the Dev Diary app. It stores diary entries with title, content, mood, and tags per user.', promptExplain: 'This prompt is intentionally brief. We don\'t specify the database — we let the storage-selection skill ask the right questions and reason through the decision based on our project context. Mentioning "database" triggers the skill keyword. The skill reads product.md (single-user app) and reasons through data model, query patterns, and deployment needs. For a single-user local app it correctly recommends SQLite. For a multi-user hosted app it recommends PostgreSQL. The skill prevents gut-feel choices like "just use Postgres" when SQLite is actually the right fit.' },
      { type: 'observe', text: 'The storage-selection skill activates and reasons through the decision. Single-user app → SQLite. Multi-user/hosted → PostgreSQL. Both are valid — accept the recommendation.' },
      { type: 'step', num: '2.2', title: 'Create the DiaryEntry entity', prompt: 'Create a DiaryEntry entity with fields: title (string, max 200), content (text), mood (enum: great/good/okay/bad/terrible), tags (list of strings). Store it in a table called txn_diary_entries. Make sure to use all the steering files that are activated.', promptExplain: 'We specify the business fields only — title, content, mood, tags. We do NOT ask for id, created_date, modified_date, created_by, modified_by, or deleted_at because entity-standards.md adds those automatically. The "txn_" prefix is specified because storage-design-rules.md requires it for transactional data. The "Make sure to use all the steering files" instruction is a reminder to Kiro to apply all active rules — entity-standards, timezone-rules, and storage-design-rules — not just generate a plain model.' },
      { type: 'observe', text: 'entity-standards.md adds audit fields automatically. timezone-rules.md enforces TIMESTAMPTZ. storage-design-rules.md enforces txn_ prefix, UUID key, snake_case.' },
      { type: 'step', num: '2.3', title: 'Save the model file', text: 'Save backend/models/diary_entry.py — the unit-test-on-edit hook fires and generates unit tests.' },
      { type: 'step', num: '2.4', title: 'Create the migration', prompt: 'Create an Alembic migration for the DiaryEntry model. Include indexes for user_id and created_date for efficient queries.', promptExplain: 'We explicitly ask for indexes on user_id and created_date because these are the columns we will query most — list entries by user, paginate by date. storage-design-rules.md requires index-first design, but we still specify the columns so Kiro knows our access patterns. Without this instruction, Kiro might create the table without indexes, which would cause full table scans on every list query.' },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3: Make the Backend Runnable',
    icon: '⚙️',
    duration: '10 min',
    content: [
      { type: 'step', num: '3.1', title: 'Create wiring files', prompt: 'Create the files needed to run the FastAPI backend:\n- backend/main.py — FastAPI app with CORS middleware, dependency wiring, and router registration\n- backend/db.py — SQLAlchemy engine and get_db session dependency\n- backend/requirements.txt — pinned dependencies\n\nWire up the _get_db and _current_user_id placeholders from the handlers.', promptExplain: 'When Kiro generated the handlers in Part 4, it created placeholder dependencies (_get_db, _current_user_id) because it doesn\'t assume your auth or database setup. This prompt creates the actual implementations. We list the three files explicitly so Kiro creates all of them in one pass. The "Wire up the placeholders" instruction tells Kiro to connect the handlers to the real session and auth logic — without this, the API would fail on every request because the dependencies are unresolved.' },
      { type: 'step', num: '3.2', title: 'Set up virtual environment', code: 'cd backend\npython3 -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt' },
      { type: 'note', text: 'Run source backend/.venv/bin/activate every time you open a new terminal.' },
      { type: 'step', num: '3.3', title: 'Run migrations', code: 'alembic upgrade head' },
      { type: 'warning', text: 'If you see "table txn_diary_entries already exists": run alembic stamp 0001 then alembic upgrade head' },
      { type: 'step', num: '3.4', title: 'Start the backend', code: 'python -m uvicorn main:app --reload' },
      { type: 'note', text: 'API at http://localhost:8000 — Interactive docs at http://localhost:8000/docs' },
    ],
  },
  {
    id: 'part4',
    title: 'Part 4: API Handlers',
    icon: '🔌',
    duration: '20 min',
    content: [
      { type: 'step', num: '4.1', title: 'Create CRUD handlers', prompt: 'Create FastAPI handlers for DiaryEntry:\n- POST /entries — create a new entry\n- GET /entries — list entries for the current user (paginated, keyset pagination)\n- GET /entries/{id} — get a single entry\n- PUT /entries/{id} — update an entry\n- DELETE /entries/{id} — soft delete an entry\n\nPut them in backend/handlers/entries.py', promptExplain: 'We list all five endpoints explicitly so Kiro generates a complete CRUD surface in one pass. "Paginated, keyset pagination" is specified because storage-design-rules.md requires it — but we reinforce it in the prompt so Kiro doesn\'t default to OFFSET pagination. "Soft delete" is specified for the DELETE endpoint because entity-standards.md requires it, but being explicit prevents Kiro from generating a hard delete. The file path (backend/handlers/entries.py) is specified so the file lands in the handlers/ directory, which triggers the security-test-on-handler hook and loads query-safety-rules.md via fileMatch.' },
      { type: 'observe', text: 'Kiro reads files and steering rules first, then applies: entity-standards (audit fields, soft delete), query-safety-rules (ORM only, no string interpolation), timezone-rules (utc_now, UTC offset), storage-design-rules (keyset pagination, no OFFSET). Note: qa-element-id-rules is correctly skipped — frontend-only.' },
      { type: 'note', text: 'Kiro generates _get_db and _current_user_id placeholders — wire these to your real session and auth logic.' },
      { type: 'step', num: '4.2', title: 'Save the handler file', text: 'Save backend/handlers/entries.py — TWO hooks fire: unit-test-on-edit (unit tests) and security-test-on-handler (security tests with @pytest.mark.security).' },
      { type: 'step', num: '4.3', title: 'Test SQL keyword handling', prompt: 'Write a test that creates a diary entry with the title "Execute the deployment plan" and content containing "SELECT the best approach, DROP old habits, GRANT yourself permission to learn". Verify the entry is created successfully — SQL keywords in user data must be accepted.', promptExplain: 'This prompt tests a specific real-world scenario — a developer named their task "Execute the deployment plan" and the app rejected it because of a keyword blocklist. The prompt uses real SQL keywords (EXECUTE, SELECT, DROP, GRANT) in natural language context to prove they are harmless when queries are parameterized. The "must be accepted" instruction tells Kiro this is a positive test — the entry should be created successfully, not rejected. This directly validates query-safety-rules.md\'s core principle: parameterize queries, never blocklist keywords.' },
      { type: 'observe', text: 'Kiro places the test in test_entries_security.py inside the existing TestQuerySafety class. ~0.74 credits, ~21 seconds.' },
    ],
  },
  {
    id: 'part5',
    title: 'Part 5: Run the Tests',
    icon: '🧪',
    duration: '10 min',
    content: [
      { type: 'step', num: '5.1', title: 'Install test dependencies', code: 'pip install pytest pytest-asyncio httpx pytest-cov' },
      { type: 'step', num: '5.2', title: 'Run all tests', code: 'pytest tests/ -v' },
      { type: 'step', num: '5.3', title: 'Run security tests only', code: 'pytest tests/ -v -m security' },
      { type: 'step', num: '5.4', title: 'Run with coverage', code: 'pytest tests/ --cov=backend --cov-report=term-missing' },
      { type: 'observe', text: 'Check: all tests green, @pytest.mark.security tests visible, coverage ≥ 90%, SQL keyword test passes.' },
      { type: 'step', num: '5.5', title: 'Run regression tests', code: 'pytest tests/ -v -m regression' },
    ],
  },
  {
    id: 'part6',
    title: 'Part 6: CSV Export',
    icon: '📊',
    duration: '10 min',
    content: [
      { type: 'step', num: '6.1', title: 'Activate report-generation-rules and build export', prompt: '#report-generation-rules\n\nI need to add a CSV export feature for diary entries. Users can export their entries for a date range.', promptExplain: 'The #report-generation-rules prefix manually activates the steering file for this session. Without it, Kiro would build the export without the light/heavy classification framework — potentially generating an async job queue for a simple user-scoped export that doesn\'t need it. With the steering active, Kiro classifies this as a light report (< 10K rows, user-scoped, < 5 seconds) and implements it synchronously. The "date range" detail is important — it tells Kiro the export needs date filtering, which triggers the timezone-rules for converting date boundaries to UTC.' },
      { type: 'observe', text: 'Kiro classifies this as a light report — synchronous, query primary DB, paginate, set query timeout, return CSV directly. No async job queue needed. Datetimes follow timezone-rules (user\'s local timezone).' },
    ],
  },
  {
    id: 'part7',
    title: 'Part 7: Frontend',
    icon: '🖥️',
    duration: '15 min',
    content: [
      { type: 'step', num: '7.1', title: 'Scaffold the React frontend', prompt: 'Create a React frontend with Vite in the frontend/ directory. Include:\n- A diary entry list page with keyset pagination\n- A create/edit entry form with title, content, mood selector, and tags input\n- A delete button that soft-deletes (calls DELETE endpoint)\n- Display dates in the user\'s local timezone\n- Proxy /entries requests to http://localhost:8000 in vite.config.js', promptExplain: 'Each bullet in this prompt serves a specific purpose. "Keyset pagination" reinforces storage-design-rules. "Soft-deletes (calls DELETE endpoint)" ensures the frontend uses the soft delete endpoint, not a client-side removal. "Display dates in the user\'s local timezone" triggers timezone-rules — Kiro will add UTC-to-local conversion logic. "Proxy /entries requests" is the key instruction that eliminates CORS issues — without it, the frontend would fail to reach the backend during development because they run on different ports (5173 vs 8000). The frontend/ directory path ensures .jsx files land where the qa-element-ids hook and qa-element-id-rules.md fileMatch will trigger.' },
      { type: 'observe', text: 'timezone-rules.md converts UTC to local for display. qa-element-id-rules.md loads on .jsx/.tsx files and adds data-testid attributes.' },
      { type: 'step', num: '7.2', title: 'Start the frontend (separate terminal)', code: 'cd frontend\nnpm install\nnpm run dev' },
      { type: 'note', text: 'App at http://localhost:5173. Vite proxies /entries to http://localhost:8000 — no CORS issues.' },
      { type: 'step', num: '7.3', title: 'Verify data-testid attributes', text: 'Check generated components for: id_entry_list_page_button_create, id_entry_form_page_textbox_title, id_entry_form_page_textbox_content, id_entry_form_page_select_mood, id_entry_form_page_button_submit, id_entry_card_button_delete_{entry.id}' },
    ],
  },
  {
    id: 'part8',
    title: 'Part 8: Concurrency',
    icon: '🔒',
    duration: '10 min',
    content: [
      { type: 'step', num: '8.1', title: 'Add optimistic concurrency', prompt: '#concurrency-and-locking-rules\n\nAdd optimistic concurrency to the DiaryEntry update handler. Two browser tabs editing the same entry should not silently overwrite each other.', promptExplain: 'The #concurrency-and-locking-rules prefix activates the manual steering file. The "two browser tabs" scenario is a concrete, relatable description of the problem — it\'s more useful than saying "add a version column" because it tells Kiro the user-facing behavior we want. Kiro then decides the implementation: version column, version check on PUT, ConflictError on mismatch, and frontend sending the current version. "Silently overwrite" is the key phrase — it tells Kiro we want the conflict to be surfaced to the user, not swallowed.' },
      { type: 'observe', text: 'Kiro adds a version column (migration 0002), version check on every update, and the frontend sends the current version. Mismatched version → ConflictError.' },
      { type: 'step', num: '8.2', title: 'Run the new migration', code: 'cd backend\nsource .venv/bin/activate\nalembic upgrade head' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '🔧',
    duration: null,
    content: [
      { type: 'issue', title: 'zsh: command not found: uvicorn', fix: 'python -m uvicorn main:app --reload' },
      { type: 'issue', title: 'No module named uvicorn', fix: 'source backend/.venv/bin/activate\npip install -r requirements.txt\npython -m uvicorn main:app --reload' },
      { type: 'issue', title: "TypeError: Can't replace canonical symbol for '__firstlineno__' (Python 3.14)", fix: 'pip install -r requirements.txt --upgrade\n# requirements.txt is pinned to sqlalchemy==2.0.49\n# Recommended: use Python 3.11 or 3.12' },
      { type: 'issue', title: "TypeError: descriptor '__getitem__' requires a 'typing.Union' object (Python 3.14)", fix: '# In models/base.py — replace X | None with Optional[X]\nfrom typing import Optional\ndeleted_at: Mapped[Optional[datetime]] = ...' },
      { type: 'issue', title: "ModuleNotFoundError: No module named 'models' (Alembic)", fix: '# In migrations/env.py — add at the top:\nimport sys, os\nsys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))' },
      { type: 'issue', title: 'sqlalchemy.exc.OperationalError: table txn_diary_entries already exists', fix: 'alembic stamp 0001\nalembic upgrade head' },
    ],
  },
  {
    id: 'bonus',
    title: 'Bonus Challenges',
    icon: '🏆',
    duration: null,
    content: [
      { type: 'intro', text: 'Finished early? These challenges go deeper into the kit. Each one exercises a different manual steering rule or skill that wasn\'t covered in the main workshop. Write your answer first, then reveal the solution to compare.' },
      {
        type: 'challenge',
        id: 'c1',
        difficulty: '⭐',
        title: 'Challenge 1: CSV Import (Data Upload Rules)',
        question: 'You need to build a CSV import feature for diary entries (columns: title, content, mood, tags). Using the data-upload-rules steering, describe: (1) How should the upload be classified (light or heavy)? (2) What validation steps should be applied to each row? (3) How should errors be handled — fail on first error or collect all?',
        hint: 'Think about the data-upload-rules steering and how entity-standards sanitization applies to bulk imports.',
        solution: 'Classification: Light upload — single user, small file, synchronous processing in one transaction.\n\nValidation steps per row:\n• Validate file type by magic bytes (not file extension)\n• Validate CSV headers match expected columns\n• Apply entity-standards sanitization to every string field (strip < > & " \' characters)\n• Enforce Field(min_length, max_length) constraints\n• Parse dates per timezone-rules (UTC with Z suffix)\n• Validate mood is from allowed values\n\nError handling: Collect ALL errors (not fail on first). Return a complete error report showing which rows failed and why. Valid rows are imported in an atomic transaction — if the transaction fails, nothing is imported.',
        solutionExplain: 'The data-upload-rules steering enforces row-level validation with the same sanitization as API input. The key insight is that bulk imports must not bypass the security rules that apply to individual API requests. Collecting all errors (instead of failing on first) gives users a complete picture of what needs fixing.',
        prompt: '#data-upload-rules\n\nBuild a CSV import feature for diary entries. Users upload a CSV file with columns: title, content, mood, tags. The system should validate each row, reject invalid rows with error details, and import valid rows. Classify this as a light upload.',
      },
      {
        type: 'challenge',
        id: 'c2',
        difficulty: '⭐⭐',
        title: 'Challenge 2: Team Diary (Tenant Strategy)',
        question: 'You want to turn the Dev Diary into a team product where 10-50 organizations can use it, each seeing only their own data. Which tenant isolation model would the tenant-strategy skill recommend, and why? What are the alternatives and why are they less suitable?',
        hint: 'Consider the number of organizations, compliance requirements, and cost trade-offs between row-level, schema-per-tenant, and stack-per-tenant.',
        solution: 'Recommended model: Schema-per-tenant — each organization gets its own database schema within the same database instance.\n\nWhy schema-per-tenant:\n• 10-50 orgs is too many for stack-per-tenant (separate infrastructure per tenant = expensive)\n• Row-level isolation (shared tables with tenant_id column) is simpler but riskier — one missing WHERE clause leaks data across tenants\n• Schema-per-tenant provides strong isolation without the cost of separate databases\n• Schemas can be backed up and restored independently\n\nAlternatives:\n• Row-level: Cheapest but highest risk of data leakage. Suitable for <10 tenants with no compliance needs\n• Database-per-tenant: Stronger isolation but more expensive. Better for regulated industries\n• Stack-per-tenant: Complete isolation but 10-50x infrastructure cost. Only for strict compliance (HIPAA, FedRAMP)\n\nImplementation: API resolves tenant from JWT token → connects to correct schema. Report queries and cache keys must include tenant context.',
        solutionExplain: 'The tenant-strategy skill asks 5 questions covering customer count, isolation needs, compliance, and auth policies. For 10-50 orgs with no special compliance requirements, schema-per-tenant is the sweet spot — it balances isolation strength with operational cost.',
        prompt: 'I want to turn the Dev Diary into a team product where multiple organizations can use it. Each organization should only see their own data. We expect 10-50 organizations.',
      },
      {
        type: 'challenge',
        id: 'c3',
        difficulty: '⭐⭐',
        title: 'Challenge 3: Background Processing (Compute Selection)',
        question: 'You need a feature that sends a daily email summary of diary entries to each user. It runs once a day at 8 AM, processes all users, and takes about 2 minutes. Should you use Lambda or a container (ECS/Fargate)? Justify your answer with at least 3 reasons.',
        hint: 'Think about execution time, traffic pattern, scale-to-zero needs, and cost.',
        solution: 'Recommendation: Lambda with EventBridge Scheduler.\n\nReasons:\n1. Execution time (2 min) is well under Lambda\'s 15-minute limit\n2. Runs once daily — scale-to-zero means you pay nothing between executions\n3. Scheduled job pattern is a perfect fit for EventBridge + Lambda\n4. No special requirements (no WebSockets, no GPU, no persistent connections)\n5. No existing container infrastructure to leverage\n6. Memory requirements are light (processing text, not media)\n7. Cost estimate: ~$0.01/month for a daily 2-minute job vs $10+/month for an always-running container\n\nWhen containers would be better:\n• Execution > 15 minutes\n• WebSocket or long-lived connections needed\n• GPU processing required\n• Already running ECS cluster (marginal cost is lower)',
        solutionExplain: 'The compute-selection skill asks 7 questions covering workload type, execution time, memory, traffic pattern, scale-to-zero, special requirements, and existing infrastructure. This scenario hits every Lambda-favorable criterion.',
        prompt: 'I need to add a feature that sends a daily email summary of diary entries to each user. It runs once a day at 8 AM, processes all users, and takes about 2 minutes. Should I use Lambda or a container?',
      },
      {
        type: 'challenge',
        id: 'c4',
        difficulty: '⭐⭐⭐',
        title: 'Challenge 4: Offline Diary (Offline Sync)',
        question: 'Design the key components of an offline sync protocol for a mobile Dev Diary. Specifically: (1) What sync strategy should be used (full sync or delta)? (2) What metadata columns are needed in the local database? (3) What is the correct order of operations when reconnecting?',
        hint: 'Think about the offline-sync-rules steering — delta sync, pull-before-push, and version columns.',
        solution: '1. Sync strategy: Delta sync (not full sync)\n• Only sync records changed since last sync (using modified_date > last_synced_at)\n• Full sync wastes bandwidth and battery on mobile devices\n\n2. Local database metadata columns:\n• sync_status: pending | synced | conflict\n• last_synced_at: timestamp of last successful sync\n• local_version: incremented on each local edit\n• server_version: version from the server (for conflict detection)\n• is_local_only: boolean for records created offline\n\n3. Reconnection order (pull-before-push):\n① Pull: GET /sync/pull?since={last_synced_at} — fetch server changes first\n② Apply: Merge server changes into local DB, detect conflicts\n③ Resolve: Apply conflict resolution (last-write-wins for single-user entries)\n④ Push: POST /sync/push — send local changes to server in a batch\n⑤ Confirm: Update last_synced_at and sync_status on success\n⑥ Retry: Exponential backoff on failure (1s, 2s, 4s, 8s...)\n\nAll sync endpoints must be idempotent — retrying a failed push must not create duplicates.',
        solutionExplain: 'The offline-sync-rules steering enforces delta sync (not full), pull-before-push ordering, version columns for conflict detection, local SQLite storage with sync metadata, batch endpoints, and idempotent operations. Pull-before-push prevents the client from overwriting server changes it hasn\'t seen yet.',
        prompt: '#offline-sync-rules\n\nDesign an offline sync protocol for a mobile version of the Dev Diary. Users should be able to create and edit entries while offline, then sync when they reconnect. Use last-write-wins for conflict resolution since entries are single-user.',
      },
      {
        type: 'challenge',
        id: 'c5',
        difficulty: '⭐⭐⭐',
        title: 'Challenge 5: Heavy Report (Report Generation)',
        question: 'You need to build an analytics report showing: total entries per user across the organization, mood distribution over 12 months, most active days, and tag frequency (10,000+ entries, PDF output). How should this be classified (light or heavy)? Describe the architecture differences from a simple CSV export of a user\'s own entries.',
        hint: 'Think about report-generation-rules — light vs heavy classification, read replicas, async processing.',
        solution: 'Classification: Heavy report — multi-table aggregation, 10K+ rows, cross-user data, PDF output.\n\nArchitecture for heavy report:\n• Query source: Read replica (never the primary database)\n• Processing: Async — submit job to queue, return job ID immediately\n• Worker: Background worker processes the job, streams rows to avoid memory spikes\n• Storage: Generate PDF → upload to S3 → return pre-signed URL\n• Caching: Materialized views for frequently-run aggregations\n• Limits: Row limit, timeout, max PDF size\n• Monitoring: Log type, requester, duration, row count\n\nContrast with light CSV export (user\'s own entries):\n• Query source: Primary database (small dataset)\n• Processing: Synchronous — query and return in same request\n• No background worker needed\n• No S3 storage — stream CSV directly in response\n• No materialized views — simple query is fast enough\n• Pagination: Keyset pagination for the query\n\nThe key difference: light reports are user-scoped (<10K rows, <5s), heavy reports are org-scoped (unbounded rows, minutes to generate).',
        solutionExplain: 'The report-generation-rules steering classifies reports as light or heavy based on scope, row count, and execution time. The architecture is completely different for each — this is why the classification matters. Using a light architecture for a heavy report would block the API, consume primary DB resources, and potentially timeout.',
        prompt: '#report-generation-rules\n\nBuild an analytics dashboard that shows: total entries per user across the entire organization, mood distribution over the last 12 months, most active days of the week, and tag frequency. This will query across all users in the organization (potentially 10,000+ entries). Generate it as a downloadable PDF.',
      },
      {
        type: 'challenge',
        id: 'c6',
        difficulty: '⭐⭐⭐',
        title: 'Challenge 6: Authentication with Cognito',
        question: 'Describe how to implement AWS Cognito JWT validation according to auth-rules.md. Specifically: (1) How should JWKS keys be loaded? (2) What algorithm is used? (3) How should roles be extracted? (4) What happens when a token is invalid?',
        hint: 'Think about JWKS caching, RS256 vs HS256, Cognito Groups, and fail-closed error handling.',
        solution: '1. JWKS key loading:\n• Cache JWKS keys at application startup (one HTTP call to Cognito\'s /.well-known/jwks.json)\n• Store keys in memory — never fetch per request\n• If verification fails with "key not found" (Cognito rotated keys), re-fetch JWKS once and retry\n• If still fails after re-fetch, reject the token\n\n2. Algorithm: RS256 (asymmetric)\n• Cognito uses RSA public/private key pairs\n• Never HS256 (symmetric) — Cognito doesn\'t use shared secrets\n• Use python-jose library for validation\n\n3. Role extraction:\n• User ID: from the "sub" claim in the JWT\n• Roles: from the "cognito:groups" claim (array of group names)\n• Map Cognito Groups to app roles: admin, editor, viewer\n• Resource ownership: scope all queries to authenticated user\'s sub\n\n4. Invalid token handling (fail-closed):\n• Invalid/expired token → 401 Unauthorized (never 200 with error message)\n• Valid token but insufficient permissions → 403 Forbidden\n• Exception during validation → 401 (fail-closed, never fail-open)\n• Never expose the reason for rejection in detail (prevents token probing)',
        solutionExplain: 'auth-rules.md mandates JWKS caching at startup to avoid per-request latency and Cognito API costs. The fail-closed principle (OWASP A10) means any exception during auth must deny access, never allow it. This prevents edge cases where a malformed token could bypass validation.',
        prompt: '#auth-rules\n\nAdd AWS Cognito User Pool authentication to the Dev Diary API. Create a get_current_user dependency that validates Cognito JWTs using the JWKS endpoint. Cache the JWKS keys at startup. Use Cognito Groups for roles (admin, editor, viewer). Protect all endpoints — only authenticated users can access their own entries.',
      },
      {
        type: 'challenge',
        id: 'c7',
        difficulty: '⭐⭐⭐',
        title: 'Challenge 7: Secrets Management with Parameter Store',
        question: 'According to secrets-management-rules, describe: (1) How should parameters be organized in Parameter Store? (2) When should the app call the Parameter Store API? (3) How can config be refreshed without redeployment?',
        hint: 'Think about path hierarchy, the load-once pattern, and the admin reload endpoint.',
        solution: '1. Parameter organization:\n• Path hierarchy: /appname/environment/category/name\n• Example: /devdiary/prod/database/url, /devdiary/prod/cognito/user_pool_id\n• Use SecureString type for secrets (database URL, API keys)\n• Use String type for non-sensitive config (feature flags, pool sizes)\n\n2. When to call Parameter Store API:\n• Once at application startup using GetParametersByPath("/devdiary/prod/")\n• This fetches ALL parameters under the path in a single API call\n• Store in an in-memory config dict\n• Read from memory at runtime — zero AWS API calls per request\n• Cost: stays in free tier (1 call per deploy vs thousands per day)\n\n3. Refresh without redeployment:\n• Admin-only endpoint: POST /admin/reload-config\n• Protected by RBAC (only admin role can call it)\n• When called: re-fetches all parameters from Parameter Store\n• Updates the in-memory config dict\n• App continues serving with old values until reload completes — no downtime\n• This is Pattern B (app-level loading) from the steering rules',
        solutionExplain: 'The secrets-management-rules steering enforces the load-once pattern to minimize AWS API costs and latency. The admin reload endpoint provides a way to update config without redeployment — useful for rotating secrets or toggling feature flags in production.',
        prompt: '#secrets-management-rules\n\nMove all configuration (database URL, Cognito User Pool ID, Cognito App Client ID, API keys) to AWS Parameter Store using the path hierarchy /devdiary/prod/. Load all parameters once at startup using GetParametersByPath. Add an admin-only POST /admin/reload-config endpoint to refresh config without redeployment.',
      },
      {
        type: 'challenge',
        id: 'c8',
        difficulty: '⭐⭐⭐',
        title: 'Challenge 8: Create Your Own Steering Rule',
        question: 'Describe the structure of a custom steering file for API versioning rules. What front matter fields are needed? What sections should it include? What inclusion mode would you use and why?',
        hint: 'Look at how existing steering files are structured — front matter with inclusion mode, mandatory rules, code examples, and anti-patterns.',
        solution: 'Front matter:\n---\ninclusion: manual\n---\n\nWhy manual: API versioning is only relevant when designing or modifying API endpoints. Auto-inclusion would waste context on every interaction. Activated with #api-versioning-rules.\n\nSections to include:\n1. URL-based versioning: All endpoints prefixed with /v1/, /v2/, etc.\n2. Backward compatibility: New versions must support all previous version\'s fields. Deprecated fields return values but are marked in docs.\n3. Deprecation process: Announce deprecation in response headers (Deprecation: true, Sunset: date). Minimum 6-month sunset period.\n4. Response headers: Include API-Version header in all responses.\n5. Code examples: Show versioned route registration, version negotiation middleware.\n6. Anti-patterns:\n   • ❌ Query parameter versioning (?version=2)\n   • ❌ Header-based versioning (Accept: application/vnd.api.v2+json) — harder to test\n   • ❌ Breaking changes without version bump\n   • ❌ Removing fields from existing version',
        solutionExplain: 'This challenge tests understanding of the steering file format. The key decisions are: manual inclusion (not auto) because it\'s situational, URL-based versioning (most discoverable), and including anti-patterns to prevent common mistakes. After creating it, activate with #api-versioning-rules in chat.',
      },
      {
        type: 'challenge',
        id: 'c9a',
        difficulty: '⭐⭐',
        title: 'Challenge 9a: Spec Workflow — Phases & Order',
        question: 'When you ask Kiro to build a search feature using the Spec workflow, it goes through structured phases before writing any code. (1) What are the three phases of a spec, and in what order do they run? (2) What does each phase produce? (3) Why does Kiro plan before coding instead of jumping straight to implementation?',
        hint: 'Think about the Spec button workflow — it creates documents before any code is written. Check the 🤖 Agents tab for details.',
        solution: 'The three spec phases (in order):\n\n1. Requirements → produces requirements.md\n   • User stories, acceptance criteria, edge cases\n   • Defines WHAT the feature should do\n\n2. Design → produces design.md\n   • Technical approach, data models, API contracts\n   • Defines HOW the feature will be built\n\n3. Tasks → produces tasks.md\n   • Implementation steps, ordered by dependency\n   • Each task is a discrete unit of work for a sub-agent\n\nWhy plan before coding:\n• Catches design flaws before any code is written (cheaper to fix)\n• Creates a shared understanding that can be reviewed by the team\n• Enables structured delegation — each task has clear scope\n• Prevents the "spaghetti implementation" problem where code is written without a plan\n• The spec documents become living documentation for the feature',
        solutionExplain: 'The spec workflow mirrors how senior engineers work: understand requirements → design the solution → break into tasks → implement. Each phase is a sub-agent invocation that costs 1-2 credits. The total spec creation (all 3 phases) costs 3-5 credits.',
      },
      {
        type: 'challenge',
        id: 'c9b',
        difficulty: '⭐⭐',
        title: 'Challenge 9b: Sub-Agent Execution — How Tasks Run',
        question: 'After a spec is created with 8 tasks, you click "Run All Tasks". (1) Do the tasks run in parallel or sequentially? (2) What agent type executes each task? (3) If a handler file is generated during task 3, what happens automatically before task 4 starts?',
        hint: 'Think about the orchestrator → sub-agent delegation flow and what hooks are configured in the kit.',
        solution: '1. Tasks run sequentially (one at a time)\n   • The orchestrator queues all tasks and runs them in order\n   • Each task must complete before the next starts\n   • This ensures later tasks can build on earlier ones\n\n2. Each task is executed by the spec-task-execution sub-agent\n   • The orchestrator delegates to this specialized sub-agent\n   • The sub-agent writes code, runs tests, and returns results\n   • Each invocation costs 1+ credits\n\n3. When a handler file is generated during task 3:\n   • The unit-test-on-edit hook fires → generates unit tests\n   • The security-test-on-handler hook fires → generates security tests\n   • Both hooks fire BEFORE task 4 starts\n   • This means task 4 already has test coverage from task 3\'s code\n   • Each hook trigger costs 1 credit (so 2 extra credits for a handler file)',
        solutionExplain: 'Sequential execution is important because tasks often depend on each other (e.g., task 4 might import a module created in task 3). Hooks firing between tasks is a key benefit — it means every generated file gets tests automatically, even during spec execution.',
      },
      {
        type: 'challenge',
        id: 'c9c',
        difficulty: '⭐⭐',
        title: 'Challenge 9c: Credit Cost — Spec vs Chat',
        question: 'You need to build a search feature that touches 7 files (model, handler, service, 2 test files, frontend component, API route). Compare the credit cost of: (A) Using a spec workflow, and (B) Building it ad-hoc through individual chat messages. Which is cheaper and why? Show your math.',
        hint: 'A spec costs 3-5 credits to create + ~1 per task. A chat message costs 1 credit. But think about how many chat messages you\'d actually need for 7 files.',
        solution: 'Option A — Spec workflow:\n• Create spec (requirements + design + tasks): 3-5 credits\n• Execute ~7-8 tasks: 7-8 credits\n• Hook triggers on handler/frontend files: ~3-4 credits\n• Total: ~13-17 credits\n\nOption B — Ad-hoc chat:\n• "Create the search model": 1 credit\n• "Create the search service": 1 credit\n• "Create the search handler": 1 credit\n• "Add the API route": 1 credit\n• "Create the frontend component": 1 credit\n• Hook triggers: ~3-4 credits\n• Clarifying questions / fixing issues: 3-5 credits\n• "Wait, the service doesn\'t match the handler": 1-2 credits\n• "The tests are failing, fix them": 1-2 credits\n• Total: ~13-18 credits\n\nVerdict: Similar cost, but the spec is MORE RELIABLE because:\n• It plans before coding → fewer fix-it-later messages\n• Tasks have clear scope → less back-and-forth\n• Design document catches integration issues upfront\n• For features with 5+ files, specs break even or save credits\n• For features with 10+ files, specs are significantly cheaper',
        solutionExplain: 'The breakeven point is roughly 5 files. Below that, chat is simpler and equally cheap. Above that, the upfront planning cost of a spec pays for itself by reducing rework and clarification messages. The key insight: specs are cheaper not because individual tasks cost less, but because planning reduces wasted credits on fixes.',
      },
    ],
  },
]

const knowledgeQuestions = [
  {
    id: 1,
    question: 'You\'re creating a new data model for "Orders". What fields will Kiro add automatically without you asking?',
    type: 'multiple',
    options: [
      'id (UUID), created_date, modified_date, created_by, modified_by, deleted_at',
      'id (auto-increment), created_at, updated_at',
      'id (UUID), name, description, status',
      'Only id — everything else must be specified manually',
    ],
    correct: 0,
    explanation: 'entity-standards.md (auto) mandates all six audit fields on every entity. Kiro adds them automatically via BaseEntity inheritance.',
  },
  {
    id: 2,
    question: 'A user submits a form with the text "Please execute the DROP TABLE migration plan and GRANT access to the team". What should your application do?',
    type: 'multiple',
    options: [
      'Reject the input — it contains SQL keywords like EXECUTE, DROP, and GRANT',
      'Strip the SQL keywords and save the sanitized text',
      'Accept and save the text as-is — parameterized queries make SQL keywords in data harmless',
      'Log a security alert and block the user\'s account',
    ],
    correct: 2,
    explanation: 'query-safety-rules.md explicitly bans keyword blocklists. Parameterized queries separate data from commands, so SQL keywords in user data are completely harmless. Rejecting or stripping them breaks legitimate data.',
  },
  {
    id: 3,
    question: 'You save a file at backend/handlers/orders.py. How many hooks fire and what do they do?',
    type: 'multiple',
    options: [
      'One hook: unit-test-on-edit generates unit tests',
      'Two hooks: unit-test-on-edit generates unit tests, security-test-on-handler generates security tests',
      'Three hooks: unit tests, security tests, and QA element IDs',
      'No hooks fire — hooks only work on frontend files',
    ],
    correct: 1,
    explanation: 'The file matches both **/handlers/**/*.py (security hook) and the handler directory pattern in unit-test-on-edit. The qa-element-ids hook only fires on frontend files (.tsx, .jsx, .vue, .svelte, .html).',
  },
  {
    id: 4,
    question: 'You need to build a CSV export for a user\'s diary entries (< 1,000 rows). Which steering rule should you activate and how will Kiro classify this report?',
    type: 'multiple',
    options: [
      '#data-upload-rules — classified as a light upload',
      '#report-generation-rules — classified as a heavy report, needs async job queue',
      '#report-generation-rules — classified as a light report, synchronous, query primary DB directly',
      'No steering needed — the auto rules handle exports',
    ],
    correct: 2,
    explanation: 'report-generation-rules.md is manual — you activate it with #report-generation-rules. User-scoped data with < 10K rows and < 5 seconds execution is classified as light. Light reports query the primary DB directly, paginate, and return synchronously.',
  },
  {
    id: 5,
    question: 'Why does the kit use "inclusion: fileMatch" for qa-element-id-rules.md instead of "inclusion: auto"?',
    type: 'multiple',
    options: [
      'Because QA rules are experimental and not ready for production',
      'To save credits — the rules only load when editing frontend files (.tsx, .jsx, .vue, .svelte, .html), not when editing Python backend code',
      'Because the rules conflict with testing-standards.md',
      'FileMatch is required for all rules that contain code examples',
    ],
    correct: 1,
    explanation: 'Auto-inclusion loads the file into every interaction (~120 lines of context). FileMatch loads it only when editing matching files. Since QA element ID rules are irrelevant when editing Python backend code, fileMatch avoids wasting credits on unnecessary context.',
  },
  {
    id: 6,
    question: 'A developer stores a datetime as "2026-04-01T15:30:00" (no timezone info) in the database. What rules does this violate?',
    type: 'multiple',
    options: [
      'Only entity-standards.md — missing audit fields',
      'Only timezone-rules.md — must store in UTC with Z suffix',
      'Both timezone-rules.md (must store UTC with Z suffix) and storage-design-rules.md (must use TIMESTAMPTZ column type)',
      'No rules violated — timezone is optional',
    ],
    correct: 2,
    explanation: 'timezone-rules.md requires all datetimes stored in UTC with Z suffix. storage-design-rules.md requires TIMESTAMPTZ column type for SQL databases (never TIMESTAMP). Both are auto-inclusion rules that are always active.',
  },
  {
    id: 7,
    question: 'You\'re about to build an offline sync feature. What should you type in Kiro chat before starting?',
    type: 'multiple',
    options: [
      'Nothing — all steering rules are auto-loaded',
      '#offline-sync-rules — it\'s a manual steering file that needs explicit activation',
      '#storage-design-rules — offline sync is a storage concern',
      'Click "Generate Steering Docs" to create sync rules',
    ],
    correct: 1,
    explanation: 'offline-sync-rules.md has inclusion: manual. It only loads when you type #offline-sync-rules in chat. Its prerequisite note also suggests co-activating #concurrency-and-locking-rules for conflict handling on the server side.',
  },
  {
    id: 8,
    question: 'Why should you NOT click "Generate Steering Docs" when the configuration kit is already in place?',
    type: 'multiple',
    options: [
      'It costs too many credits',
      'It creates generic files (product.md, structure.md, tech.md) that can conflict with or dilute the kit\'s curated coding standards',
      'It deletes the existing .kiro directory',
      'It only works on new projects, not existing ones',
    ],
    correct: 1,
    explanation: 'The button creates Kiro\'s default auto-generated steering files which may include generic coding standards that overlap with the kit\'s curated rules (entity-standards, timezone-rules, etc.). Use the safe chat prompts instead to create only project-context files.',
  },
  {
    id: 9,
    question: 'What is the correct table naming prefix for a high-volume orders table according to storage-design-rules.md?',
    type: 'multiple',
    options: [
      'app_orders — all tables use the app_ prefix',
      'tbl_orders — standard SQL convention',
      'txn_orders — transactional data uses the txn_ prefix',
      'orders — no prefix needed',
    ],
    correct: 2,
    explanation: 'storage-design-rules.md defines three prefixes: app_ for master/reference data, map_ for junction tables, txn_ for transactional data. Orders are high-volume, append-heavy transactional data → txn_orders.',
  },
  {
    id: 10,
    question: 'Two users edit the same diary entry simultaneously. User A saves first. When User B tries to save, what should happen?',
    type: 'multiple',
    options: [
      'User B\'s changes silently overwrite User A\'s (last-write-wins)',
      'The system should return a ConflictError because the version column doesn\'t match — User B must refresh and retry',
      'The system should merge both changes automatically',
      'The system should lock the entry when User A starts editing, blocking User B',
    ],
    correct: 1,
    explanation: 'concurrency-and-locking-rules.md mandates optimistic concurrency with a version column for user-facing updates. The version is checked on every update — if it doesn\'t match (because User A already incremented it), a ConflictError is returned. This is preferred over pessimistic locking (FOR UPDATE) to reduce lock hold time.',
  },
  {
    id: 11,
    question: 'After the storage-selection skill recommends PostgreSQL for your project, what happens to ensure this decision is enforced in future interactions?',
    type: 'multiple',
    options: [
      'Nothing — you need to re-run the skill every time you discuss databases',
      'Kiro remembers it in memory until you close the IDE',
      'The skill creates a storage-decision.md steering file with fileMatch that loads automatically on model/migration files',
      'It\'s saved in your Kiro account settings',
    ],
    correct: 2,
    explanation: 'All skills now create a persistent steering file after making a recommendation. storage-selection creates storage-decision.md with fileMatch on models, migrations, schema, db, and repositories directories. This means the decision loads automatically whenever you edit data-related code — no need to re-run the skill.',
  },
  {
    id: 12,
    question: 'Your team builds a field data collection app that works offline. Users collect inspection data on tablets and sync when back in the office. A user could modify the local SQLite database to change inspection results. Which offline security approach should you use?',
    type: 'multiple',
    options: [
      'Approach 1: Server-side validation only — zero overhead, server catches invalid data',
      'Approach 2: SQLCipher encryption — prevents reading the database file',
      'Approach 3: HMAC signatures + server validation — detects any modification with ~1-2ms overhead per record on write, zero on reads',
      'Approach 4: All three combined — maximum protection',
    ],
    correct: 2,
    explanation: 'The concern is tamper detection (users modifying data to skip validations), not data confidentiality. HMAC signatures detect any modification to any field — even valid-looking changes like changing a quantity from 5 to 50. It has better performance than SQLCipher (~1-2ms per write vs 5-15% on all operations) and directly addresses the tampering risk. SQLCipher prevents reading but doesn\'t detect modification by someone who has app access.',
  },
  {
    id: 13,
    question: 'You previously chose Lambda for a workload, but requirements changed and you now need WebSocket support. How do you update the decision?',
    type: 'multiple',
    options: [
      'Edit the Lambda code to add WebSocket support',
      'Delete .kiro/steering/compute-decision.md and mention "container" or "ECS" in chat to re-trigger the compute-selection skill',
      'Ask Kiro to ignore the compute-decision.md steering file',
      'Create a new project — decisions can\'t be changed',
    ],
    correct: 1,
    explanation: 'Skill decisions are stored as steering files. To change a decision: delete the generated file (compute-decision.md) and re-trigger the skill by mentioning keywords. The skill runs the question flow fresh with the new requirements (WebSocket → containers) and creates a new steering file. You can also edit the file directly for small tweaks.',
  },
  {
    id: 14,
    question: 'What is the key difference between SQLCipher (Approach 2) and HMAC signatures (Approach 3) for offline data protection?',
    type: 'multiple',
    options: [
      'SQLCipher is faster than HMAC',
      'SQLCipher protects data confidentiality (can\'t read the file), HMAC protects data integrity (can\'t modify without detection)',
      'HMAC encrypts the database, SQLCipher signs individual records',
      'They do the same thing — just different implementations',
    ],
    correct: 1,
    explanation: 'SQLCipher encrypts the entire database file (confidentiality — prevents reading). HMAC computes a cryptographic signature per record (integrity — detects modification). They solve different problems. A user with app access has the SQLCipher key (the app needs it to function), so they can still modify data. HMAC catches that modification because the signature won\'t match without the server secret.',
  },
  {
    id: 15,
    question: 'The offline-security-selection skill asks 8 questions across 3 phases. What are the three phases?',
    type: 'multiple',
    options: [
      'Authentication → Authorization → Encryption',
      'Data sensitivity → Tamper risk → Performance constraints',
      'Client security → Server security → Network security',
      'Encryption → Signing → Validation',
    ],
    correct: 1,
    explanation: 'Phase 1 (data sensitivity) determines if encryption is needed — PII, regulations, or significant harm from exposure. Phase 2 (tamper risk) determines if HMAC signatures are needed — can users benefit from modifying data, what\'s the impact. Phase 3 (performance constraints) checks if the recommended approach is feasible on the target devices — heavy browsing on older devices may rule out SQLCipher.',
  },
  {
    id: 16,
    question: 'How should your application validate AWS Cognito JWTs according to auth-rules.md?',
    type: 'multiple',
    options: [
      'Call the Cognito API on every request to verify the token',
      'Cache the JWKS keys at startup, validate locally with RS256, re-fetch JWKS only if key rotation causes a verification failure',
      'Decode the JWT without verifying the signature — Cognito tokens are always trusted',
      'Store the Cognito secret key in the application and validate with HS256',
    ],
    correct: 1,
    explanation: 'auth-rules.md mandates caching JWKS at startup and validating locally — never calling Cognito per request. If verification fails with "key not found" (Cognito rotated keys), re-fetch JWKS once and retry. Cognito uses RS256 (asymmetric), not HS256 (symmetric). Never skip signature verification.',
  },
  {
    id: 17,
    question: 'Your app has 5 configuration parameters in AWS Parameter Store. How should they be loaded according to secrets-management-rules.md?',
    type: 'multiple',
    options: [
      'Call ssm.get_parameter() for each parameter on every API request',
      'Load all 5 at startup using GetParametersByPath in a single API call, store in a config dict, read from memory at runtime',
      'Hardcode them in a .env file and commit to git for convenience',
      'Use Parameter Store Advanced tier for better performance',
    ],
    correct: 1,
    explanation: 'secrets-management-rules.md enforces the load-once pattern: GetParametersByPath fetches all parameters under a path in one API call at startup. The app reads from the in-memory config dict at runtime — zero AWS API calls per request. This keeps costs in the free tier (1 call per deploy vs thousands per day).',
  },
  {
    id: 18,
    question: 'A secret in Parameter Store was updated but you don\'t want to redeploy the application. How do you refresh it?',
    type: 'multiple',
    options: [
      'You can\'t — Parameter Store values require redeployment to take effect',
      'Call POST /admin/reload-config (admin-only endpoint) to re-fetch all parameters from Parameter Store into the config dict',
      'The application automatically detects Parameter Store changes in real-time',
      'Delete the parameter and recreate it — the app will pick it up',
    ],
    correct: 1,
    explanation: 'secrets-management-rules.md includes an admin reload endpoint (POST /admin/reload-config) protected by RBAC. When called, it re-fetches all parameters from Parameter Store and updates the in-memory config. The app continues serving with old values until the reload completes — no downtime. This is Pattern B (app-level loading).',
  },
]

function KnowledgeCheck() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const name = sessionStorage.getItem('workshop-name') || ''
  const email = sessionStorage.getItem('workshop-email') || ''

  const handleSelect = (qId, optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: optIdx }))
  }

  const score = knowledgeQuestions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0)
  const total = knowledgeQuestions.length
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 70

  const handleSubmit = async () => {
    setSubmitted(true)
    try {
      const res = await fetch('/api/workshop/submit-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, score, total, pct, passed,
          answers,
          questions: knowledgeQuestions,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEmailSent(true)
      } else {
        setEmailError(data.message || 'Failed to send results')
      }
    } catch {
      setEmailError('Failed to send results email')
    }
  }

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    const now = new Date().toLocaleString()
    const rows = knowledgeQuestions.map(q => {
      const userAnswer = answers[q.id] !== undefined ? q.options[answers[q.id]] : 'Not answered'
      const correctAnswer = q.options[q.correct]
      const isCorrect = answers[q.id] === q.correct
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;vertical-align:top;width:40%">${q.question}</td>
          <td style="padding:8px;border:1px solid #ddd;color:${isCorrect ? '#16a34a' : '#dc2626'}">${userAnswer}</td>
          <td style="padding:8px;border:1px solid #ddd">${correctAnswer}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;font-size:1.2em">${isCorrect ? '✅' : '❌'}</td>
        </tr>`
    }).join('')

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Workshop Results - ${name}</title>
      <style>body{font-family:system-ui,sans-serif;padding:2rem;color:#1e293b}
      h1{font-size:1.5rem;margin-bottom:0.5rem}
      .meta{color:#64748b;font-size:0.9rem;margin-bottom:1.5rem}
      .score-box{padding:1.2rem;border-radius:8px;text-align:center;margin-bottom:1.5rem;font-size:1.1rem}
      .pass{background:#f0fdf4;border:2px solid #22c55e;color:#16a34a}
      .fail{background:#fef2f2;border:2px solid #ef4444;color:#dc2626}
      table{width:100%;border-collapse:collapse;font-size:0.85rem}
      th{background:#f1f5f9;padding:8px;border:1px solid #ddd;text-align:left}
      .explanation{margin-top:1.5rem;padding:1rem;background:#f8fafc;border-radius:6px}
      .explanation h3{font-size:1rem;margin-bottom:0.5rem}
      .exp-item{margin-bottom:0.8rem;font-size:0.82rem;line-height:1.5}
      .exp-q{font-weight:600;color:#1e293b}
      .exp-a{color:#64748b}
      </style></head><body>
      <h1>Kiro Configuration Kit — Workshop Knowledge Check</h1>
      <div class="meta">Participant: <strong>${name || 'Anonymous'}</strong> | Date: ${now}</div>
      <div class="score-box ${passed ? 'pass' : 'fail'}">
        Score: <strong>${score} / ${total}</strong> (${pct}%) — ${passed ? 'PASSED ✅' : 'NEEDS REVIEW ❌ (70% required)'}
      </div>
      <table>
        <thead><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Result</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="explanation">
        <h3>Answer Explanations</h3>
        ${knowledgeQuestions.map((q, i) => `<div class="exp-item"><div class="exp-q">${i + 1}. ${q.question}</div><div class="exp-a">${q.explanation}</div></div>`).join('')}
      </div>
      </body></html>`)
    printWindow.document.close()
    setTimeout(() => { printWindow.print() }, 300)
  }

  return (
    <div className="kc-container" data-testid="id_knowledge_check_container_root">
      <div className="kc-header" data-testid="id_knowledge_check_container_header">
        <h2>📝 Knowledge Check</h2>
        <p>Test your understanding of the Kiro Configuration Kit. 18 questions, 70% to pass.</p>
      </div>

      <div className="kc-participant-info" data-testid="id_knowledge_check_container_participant_info">
        <span>Participant: <strong>{name}</strong> ({email})</span>
      </div>

      <div className="kc-questions">
        {knowledgeQuestions.map((q, qi) => (
          <div key={q.id} className={`kc-question ${submitted ? (answers[q.id] === q.correct ? 'kc-correct' : 'kc-wrong') : ''}`} data-testid={`knowledge-check-question-${q.id}`}>
            <div className="kc-q-header">
              <span className="kc-q-num">{qi + 1}</span>
              <span className="kc-q-text">{q.question}</span>
            </div>
            <div className="kc-options">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  className={`kc-option ${answers[q.id] === oi ? 'selected' : ''} ${submitted && oi === q.correct ? 'correct-answer' : ''} ${submitted && answers[q.id] === oi && oi !== q.correct ? 'wrong-answer' : ''}`}
                  onClick={() => handleSelect(q.id, oi)}
                  data-testid={`knowledge-check-option-${q.id}-${oi}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {submitted && (
              <div className="kc-explanation">{q.explanation}</div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button className="kc-submit" onClick={handleSubmit} disabled={Object.keys(answers).length < total} data-testid="knowledge-check-submit-button">
          Submit ({Object.keys(answers).length}/{total} answered)
        </button>
      ) : (
        <div className="kc-results">
          <div className={`kc-score ${passed ? 'kc-pass' : 'kc-fail'}`} data-testid="id_knowledge_check_label_score">
            Score: {score}/{total} ({pct}%) — {passed ? 'PASSED ✅' : 'NEEDS REVIEW ❌'}
          </div>
          {emailSent && <div className="kc-email-sent">✅ Results sent to the workshop administrator.</div>}
          {emailError && <div className="kc-email-error">⚠️ {emailError} — use the PDF export below as backup.</div>}
          <button className="kc-export" onClick={handleExportPDF} data-testid="knowledge-check-export-button">📄 Export Results as PDF</button>
          <button className="kc-retry" onClick={() => { setAnswers({}); setSubmitted(false); setEmailSent(false); setEmailError('') }} data-testid="knowledge-check-retry-button">🔄 Retry</button>
        </div>
      )}
    </div>
  )
}

function ChallengeCard({ item, copiedIdx, copyToClipboard, globalIdx }) {
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="challenge-card" data-testid={`challenge-card-${item.id}`}>
      <div className="challenge-header">
        <span className="challenge-difficulty">{item.difficulty}</span>
        <span className="challenge-title">{item.title}</span>
      </div>
      <div className="challenge-question">{item.question}</div>
      {!revealed && (
        <>
          {item.hint && (
            <button className="challenge-hint-btn" onClick={() => setShowHint(!showHint)} data-testid={`challenge-hint-btn-${item.id}`}>
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
          )}
          {showHint && <div className="challenge-hint">{item.hint}</div>}
          <textarea
            className="challenge-textarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            data-testid={`challenge-textarea-${item.id}`}
          />
          <button
            className="challenge-submit-btn"
            onClick={() => setRevealed(true)}
            disabled={!answer.trim()}
            data-testid={`challenge-submit-btn-${item.id}`}
          >
            🔓 Submit & Reveal Solution
          </button>
        </>
      )}
      {revealed && (
        <div className="challenge-solution-area">
          {answer.trim() && (
            <div className="challenge-your-answer">
              <div className="challenge-your-answer-label">📝 Your Answer:</div>
              <div className="challenge-your-answer-text">{answer}</div>
            </div>
          )}
          <div className="challenge-solution">
            <div className="challenge-solution-label">✅ Solution:</div>
            <pre className="challenge-solution-text">{item.solution}</pre>
          </div>
          <div className="challenge-solution-explain">
            <span className="challenge-solution-explain-label">🧠 Why this is the answer:</span>
            <span>{item.solutionExplain}</span>
          </div>
          {item.prompt && (
            <div className="challenge-try-it">
              <div className="challenge-try-it-label">🚀 Try it in Kiro:</div>
              <div className="workshop-prompt-block">
                <div className="workshop-prompt-label">💬 Kiro Chat Prompt</div>
                <pre>{item.prompt}</pre>
                <button className="workshop-copy-btn" onClick={() => copyToClipboard(item.prompt, `challenge-${item.id}`)} data-testid={`challenge-copy-prompt-${item.id}`}>
                  {copiedIdx === `challenge-${item.id}` ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
          <button className="challenge-retry-btn" onClick={() => { setRevealed(false); setAnswer(''); setShowHint(false) }} data-testid={`challenge-retry-btn-${item.id}`}>
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  )
}

function WorkshopGuide() {
  const [activePart, setActivePart] = useState('overview')
  const [copiedIdx, setCopiedIdx] = useState(null)

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  const part = workshopParts.find(p => p.id === activePart)

  return (
    <div className="workshop-page" data-testid="id_workshop_guide_container_root">
      <div className="workshop-sidebar" data-testid="id_workshop_guide_container_sidebar">
        <div className="workshop-sidebar-title">🛠️ Workshop</div>
        {workshopParts.map(p => (
          <button
            key={p.id}
            className={`workshop-nav-item ${activePart === p.id ? 'active' : ''}`}
            onClick={() => setActivePart(p.id)}
            data-testid={`workshop-guide-nav-${p.id}-button`}
          >
            <span className="workshop-nav-icon">{p.icon}</span>
            <span className="workshop-nav-label">{p.title}</span>
            {p.duration && <span className="workshop-nav-duration">{p.duration}</span>}
          </button>
        ))}
        <button
          className={`workshop-nav-item ${activePart === 'knowledge-check' ? 'active' : ''}`}
          onClick={() => setActivePart('knowledge-check')}
          data-testid="workshop-guide-nav-knowledge-check-button"
        >
          <span className="workshop-nav-icon">📝</span>
          <span className="workshop-nav-label">Knowledge Check</span>
        </button>
      </div>
      <div className="workshop-content" data-testid="id_workshop_guide_container_content">
        {activePart === 'knowledge-check' ? (
          <KnowledgeCheck />
        ) : (
        <>
        <div className="workshop-part-header">
          <span className="workshop-part-icon">{part.icon}</span>
          <h2>{part.title}</h2>
          {part.duration && <span className="workshop-part-duration">{part.duration}</span>}
        </div>
        <div className="workshop-body">
          {part.content.map((item, i) => {
            if (item.type === 'intro') return <p key={i} className="workshop-intro">{item.text}</p>
            if (item.type === 'meta') return (
              <div key={i} className="workshop-meta">
                <span className="workshop-meta-label">{item.label}:</span>
                <span className="workshop-meta-value">{item.value}</span>
              </div>
            )
            if (item.type === 'heading') return <h3 key={i} className="workshop-heading">{item.text}</h3>
            if (item.type === 'list') return (
              <ul key={i} className="workshop-list">
                {item.items.map((li, j) => <li key={j}>{li}</li>)}
              </ul>
            )
            if (item.type === 'step') return (
              <div key={i} className="workshop-step">
                <div className="workshop-step-header">
                  <span className="workshop-step-num">Step {item.num}</span>
                  <span className="workshop-step-title">{item.title}</span>
                </div>
                {item.text && <p className="workshop-step-text">{item.text}</p>}
                {item.code && (
                  <div className="workshop-code-block">
                    <pre>{item.code}</pre>
                    <button className="workshop-copy-btn" onClick={() => copyToClipboard(item.code, `code-${i}`)} data-testid={`workshop-guide-copy-code-${i}-button`}>
                      {copiedIdx === `code-${i}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                )}
                {item.prompt && (
                  <div className="workshop-prompt-block">
                    <div className="workshop-prompt-label">💬 Kiro Chat Prompt</div>
                    <pre>{item.prompt}</pre>
                    <button className="workshop-copy-btn" onClick={() => copyToClipboard(item.prompt, `prompt-${i}`)} data-testid={`workshop-guide-copy-prompt-${i}-button`}>
                      {copiedIdx === `prompt-${i}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                )}
                {item.promptExplain && (
                  <div className="workshop-prompt-explain">
                    <span className="workshop-prompt-explain-label">🧠 Why this prompt:</span>
                    <span>{item.promptExplain}</span>
                  </div>
                )}
              </div>
            )
            if (item.type === 'observe') return (
              <div key={i} className="workshop-observe">
                <span className="workshop-observe-label">👁 What to observe:</span>
                <span>{item.text}</span>
              </div>
            )
            if (item.type === 'note') return (
              <div key={i} className="workshop-note">
                <span className="workshop-note-label">ℹ️</span>
                <span>{item.text}</span>
              </div>
            )
            if (item.type === 'warning') return (
              <div key={i} className="workshop-warning">
                <span className="workshop-warning-label">⚠️</span>
                <span>{item.text}</span>
              </div>
            )
            if (item.type === 'issue') return (
              <div key={i} className="workshop-issue">
                <div className="workshop-issue-title">{item.title}</div>
                <div className="workshop-code-block">
                  <pre>{item.fix}</pre>
                  <button className="workshop-copy-btn" onClick={() => copyToClipboard(item.fix, `fix-${i}`)} data-testid={`workshop-guide-copy-fix-${i}-button`}>
                    {copiedIdx === `fix-${i}` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )
            if (item.type === 'techitem') return (
              <div key={i} className="workshop-techitem">
                <div className="workshop-techitem-header">
                  <span className="workshop-techitem-dot" style={{ background: item.color }} />
                  <span className="workshop-techitem-name">{item.name}</span>
                  <span className="workshop-techitem-layer">{item.layer}</span>
                </div>
                <div className="workshop-techitem-why">
                  <span className="workshop-techitem-label">Why:</span> {item.why}
                </div>
                <div className="workshop-techitem-vs">
                  <span className="workshop-techitem-label">vs:</span> {item.vs}
                </div>
                {item.note && (
                  <div className="workshop-note" style={{ marginTop: '0.4rem' }}>
                    <span className="workshop-note-label">ℹ️</span>
                    <span>{item.note}</span>
                  </div>
                )}
              </div>
            )
            if (item.type === 'challenge') return (
              <ChallengeCard key={i} item={item} copiedIdx={copiedIdx} copyToClipboard={copyToClipboard} globalIdx={i} />
            )
            return null
          })}
        </div>
        </>
        )}
      </div>
    </div>
  )
}

const APP_VERSION = 'v0.1.4'

const changelogEntries = [
  {
    version: '0.1.4',
    date: 'April 16, 2026',
    title: 'Interactive Challenge 9 — Sub-Agent Delegation',
    sections: [
      {
        heading: 'Workshop: Challenge 9 Now Interactive',
        items: [
          'Challenge 9 split into 3 focused interactive sub-challenges (9a, 9b, 9c)',
          '9a: Spec workflow phases — tests understanding of requirements → design → tasks flow',
          '9b: Sub-agent execution — tests knowledge of sequential task delegation and hook triggers between tasks',
          '9c: Credit cost comparison — spec vs ad-hoc chat with math breakdown',
          'All 3 sub-challenges use the same answer-then-reveal format as challenges 1–8',
          'No more passive "observe" instructions — users must demonstrate understanding before seeing solutions',
        ],
      },
    ],
  },
  {
    version: '0.1.3',
    date: 'April 16, 2026',
    title: 'Interactive Bonus Challenges',
    sections: [
      {
        heading: 'Workshop: Interactive Challenge Cards',
        items: [
          'Bonus Challenges 1–8 converted from static instructions to interactive challenge cards',
          'Each challenge now presents a question the user must answer before seeing the solution',
          'Text area for users to type their answer — submit button disabled until they write something',
          'Show Hint button provides guidance without giving away the answer',
          'After submitting: side-by-side view of user\'s answer and the full solution with explanation',
          'Copyable Kiro chat prompt included with each solution for hands-on follow-up',
          'Try Again button resets the challenge for reattempting',
          'Challenge 9 (Sub-Agent Delegation) remains step-based as it\'s a hands-on Kiro exercise',
        ],
      },
      {
        heading: 'UI Additions',
        items: [
          'New ChallengeCard component with difficulty badge, hint toggle, answer area, and solution reveal',
          'Challenge cards styled with amber accent to distinguish from regular workshop steps',
          'Smooth fade-in animation when solution is revealed',
        ],
      },
    ],
  },
  {
    version: '0.1.2',
    date: 'April 15, 2026',
    title: 'Agents Guide & Workshop Challenge',
    sections: [
      {
        heading: 'New: Agents Guide Tab',
        items: [
          'Added 🤖 Agents tab with interactive guide to all three agent types (IDE, Sub-Agents, Autonomous)',
          'Credit costs table with per-action breakdown',
          '6 credit efficiency tips',
          'Sub-agent workflow visualization showing sequential task delegation',
          'What to review carefully section for security-critical code',
        ],
      },
      {
        heading: 'Workshop: Challenge 9 — Sub-Agent Delegation',
        items: [
          'New bonus challenge: create a search feature spec and watch sub-agents execute tasks',
          'Observe orchestrator → spec-task-execution delegation in real-time',
          'Compare credit cost of spec workflow vs ad-hoc chat for the same feature',
        ],
      },
      {
        heading: 'UI Changes',
        items: [
          'Moved Changelog tab to the end of the navigation bar',
          'Tab order: Training → Activation Guide → Workshop → Agents → Changelog',
        ],
      },
    ],
  },
  {
    version: '0.1.1',
    date: 'April 10, 2026',
    title: 'Auth & Secrets Management',
    sections: [
      {
        heading: 'Auth Rules — AWS Cognito User Pool',
        items: [
          'Added Section 1: Recommended AWS Cognito User Pool as auth provider',
          'Cognito JWKS caching pattern — fetch once at startup, refresh only on key rotation failure',
          'Cognito Groups for RBAC — map groups to application roles',
          'Full Python code example with python-jose for RS256 JWT validation',
          'Multi-tenant guidance: one User Pool per tenant',
          'Two new anti-patterns: no per-request Cognito API calls, no per-request JWKS fetches',
        ],
      },
      {
        heading: 'New: Secrets Management Rules',
        items: [
          'New manual steering file: secrets-management-rules.md',
          'AWS Parameter Store as source of truth — path-based hierarchy (/app/env/category/name)',
          'Load-once pattern: GetParametersByPath at startup, read from memory at runtime — zero per-request API calls',
          'Two supported patterns: pipeline injection (existing projects) and app-level loading (new projects)',
          'Admin reload endpoint for refresh without redeployment — POST /admin/reload-config (admin-only)',
          'Cost guidance: startup-only loading = free, 5-min TTL with batched fetch = free (under 10K calls/month)',
        ],
      },
      {
        heading: 'Kit Inventory Update',
        items: [
          'Total steering files: 14 (3 auto, 3 fileMatch, 8 manual)',
          'New file: secrets-management-rules.md (manual)',
          'Updated file: auth-rules.md — expanded from 7 to 9 anti-patterns, added Cognito section',
        ],
      },
    ],
  },
  {
    version: '0.1.0',
    date: 'April 10, 2026',
    title: 'Initial Release',
    sections: [
      {
        heading: 'Kit Components',
        items: [
          '3 hooks: unit-test-on-edit (v2), security-test-on-handler (v2), qa-element-ids (v2)',
          '4 skills: compute-selection, storage-selection, tenant-strategy, offline-security-selection',
          '13 steering rules: 3 auto, 3 fileMatch, 7 manual',
          'All skills now create persistent steering files after decisions',
        ],
      },
      {
        heading: 'Steering Rules Added',
        items: [
          'entity-standards.md (auto) — audit fields, soft delete, input sanitization',
          'timezone-rules.md (auto) — UTC storage, TIMESTAMPTZ, date-only field rules',
          'testing-standards.md (auto) — AAA pattern, 90% coverage, security tests, regression tests',
          'query-safety-rules.md (fileMatch) — parameterized queries, keyword blocklist ban',
          'qa-element-id-rules.md (fileMatch) — id_view_type_name convention in snake_case',
          'storage-design-rules.md (fileMatch) — schema design, indexing, encryption, 5 Well-Architected pillars',
          'api-standards.md (manual) — response format, HTTP status codes, fail-closed error handling, rate limiting',
          'auth-rules.md (manual) — JWT validation, RBAC, resource ownership, password handling',
          'concurrency-and-locking-rules.md (manual) — short transactions, lock ordering, optimistic concurrency',
          'report-generation-rules.md (manual) — light/heavy classification, read replicas, async generation',
          'data-upload-rules.md (manual) — light/heavy uploads, staging tables, collision handling',
          'offline-sync-rules.md (manual) — delta sync, conflict resolution, sync API design',
          'logging-rules.md (manual) — structured JSON logging, correlation IDs, PII redaction',
        ],
      },
      {
        heading: 'Credit Optimizations',
        items: [
          'Three-tier inclusion system: auto (~250 lines), fileMatch (contextual), manual (opt-in)',
          'Hooks scoped to specific directories — excludes tests, migrations, config, __init__.py',
          'Hook prompts reference steering files instead of repeating rules inline (~75% smaller)',
          'No duplicate hook triggers — unit-test and security-test hooks have separate responsibilities',
          'Anti-patterns restored to individual bullet points in manual files for scannability',
        ],
      },
      {
        heading: 'Skill Improvements',
        items: [
          'All 4 skills create persistent steering files after making a recommendation',
          'Generated steering files use fileMatch so decisions load automatically on relevant code',
          'Review note added: "Review the generated steering file with the team before committing"',
          'New skill: offline-security-selection (8 questions, 3 phases: data sensitivity → tamper risk → performance)',
          'offline-sync-rules.md defers to offline-security-selection skill for encryption/tamper decisions — no conflict',
        ],
      },
      {
        heading: 'QA Element ID Convention',
        items: [
          'Changed from {component}-{element}-{descriptor} kebab-case to id_{view}_{type}_{name} snake_case',
          'View naming uses full module descriptions (store_maintenance, not store_maint)',
          'Updated all examples, framework snippets, and anti-patterns',
        ],
      },
      {
        heading: 'Security Additions',
        items: [
          'query-safety-rules.md — parameterized queries mandatory, keyword blocklists explicitly banned',
          'api-standards.md — fail-closed exception handling (OWASP A10:2025), never expose stack traces',
          'auth-rules.md — JWT validation, RBAC, resource ownership scoping, no JWTs in localStorage',
          'security-test-on-handler hook — now also verifies parameterized query usage',
        ],
      },
      {
        heading: 'Training App',
        items: [
          'Interactive slide presentation with OWASP Top 10:2025 mapping and Well-Architected alignment',
          'Activation Guide with installation steps, steering/skills/hooks management',
          'Workshop module: Dev Diary app build with 9 parts, tech stack explanations, prompt explanations',
          'Knowledge check: 15 questions with scoring, PDF export, results emailed to admin',
          'PDF export includes all modules (training slides + activation guide)',
          'Password-protected site access, name+email registration for workshop',
        ],
      },
      {
        heading: 'Platform Equivalents',
        items: [
          'GitHub Copilot: .github/copilot-instructions.md',
          'Amazon Q Developer: .amazonq/rules/project-standards.md',
          'Gemini Code Assist: .gemini/styleguide.md + settings.json',
          'All three include prerequisite notes on manual sections',
        ],
      },
      {
        heading: 'Bug Fixes',
        items: [
          'Fixed duplicate numbering in storage-design-rules.md Section 1 (two items numbered "3")',
          'Removed Sustainability section from storage-design-rules.md (generic, covered by Cost Optimization)',
          'Fixed offline-sync-rules.md encryption instruction conflicting with offline-security-selection skill',
        ],
      },
    ],
  },
]

function ChangelogPage() {
  return (
    <div className="changelog-page" data-testid="id_changelog_page_container_root">
      <div className="changelog-content">
        <div className="changelog-header" data-testid="id_changelog_page_container_header">
          <h1>📋 Changelog</h1>
          <span className="changelog-version-badge" data-testid="id_changelog_page_label_version_badge">{APP_VERSION}</span>
        </div>
        <p className="changelog-subtitle">All changes to the Kiro Configuration Kit and training materials.</p>
        {changelogEntries.map((entry, i) => (
          <div key={i} className="changelog-entry" data-testid={`id_changelog_page_card_entry_${entry.version.replace(/\./g, '_')}`}>
            <div className="changelog-entry-header">
              <span className="changelog-entry-version">v{entry.version}</span>
              <span className="changelog-entry-date">{entry.date}</span>
              <span className="changelog-entry-title">{entry.title}</span>
            </div>
            {entry.sections.map((section, j) => (
              <div key={j} className="changelog-section" data-testid={`id_changelog_page_container_section_${section.heading.toLowerCase().replace(/\s+/g, '_')}`}>
                <h3>{section.heading}</h3>
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const agentTypes = [
  {
    name: 'IDE Agent',
    icon: '💬',
    where: 'Local (your machine)',
    parallel: 'Sequential',
    context: 'Session only',
    cost: '1 credit/interaction',
    desc: 'The main agent you interact with in chat. Responds to messages, executes hooks, reads steering files, activates skills, writes code.',
    bestFor: ['Quick fixes and single-file changes', 'Daily coding with hooks active', 'Activating skills for architecture decisions', 'Ad-hoc questions about the codebase'],
  },
  {
    name: 'Sub-Agents',
    icon: '🔄',
    where: 'Local (delegated by orchestrator)',
    parallel: 'Sequential (one at a time)',
    context: 'Shared session',
    cost: '1+ credit/invocation',
    desc: 'Specialized agents invoked by the orchestrator during spec workflows. Includes spec-task-execution, context-gatherer, and workflow agents.',
    bestFor: ['Spec-driven development (requirements → design → tasks)', 'Multi-file feature implementation', 'Exploring unfamiliar codebases (context-gatherer)', 'Structured, trackable task execution'],
  },
  {
    name: 'Autonomous Agent',
    icon: '🤖',
    where: 'Cloud (isolated sandbox)',
    parallel: 'Up to 10 concurrent tasks',
    context: 'Persistent across sessions',
    cost: 'Included in Pro/Pro+/Power (preview)',
    desc: 'Runs independently in the cloud. Maintains context, works across repos, learns from code reviews, opens PRs. Currently in preview.',
    bestFor: ['Bulk updates across multiple repositories', 'Tasks you want to delegate and review later', 'Applying consistent patterns learned from code reviews', 'Long-running tasks that would block your IDE'],
  },
]

const creditTable = [
  { action: 'Chat message', credits: '1' },
  { action: 'Hook trigger (file save)', credits: '1' },
  { action: 'Save handler file (2 hooks fire)', credits: '2' },
  { action: 'Skill question flow', credits: '1-3' },
  { action: 'Create a spec (req + design + tasks)', credits: '3-5' },
  { action: 'Execute spec with 10 tasks', credits: '10-15' },
  { action: 'Full workshop (Dev Diary)', credits: '19-25' },
  { action: 'Activate manual steering', credits: '0' },
]

const creditTips = [
  { tip: 'Disable hooks during bulk refactors', detail: '20 file saves = 20 credits. Disable, refactor, re-enable, save once.' },
  { tip: 'Use specs for multi-file features', detail: 'One spec (10-15 credits) is cheaper than 20 individual chat messages.' },
  { tip: 'Be specific in chat', detail: 'Vague prompts cause clarifying questions = more round trips = more credits.' },
  { tip: 'Use Autopilot for routine tasks', detail: 'Supervised mode uses credits for each approval cycle.' },
  { tip: 'Batch your questions', detail: 'Combine related questions into one message instead of 5 separate ones.' },
  { tip: 'Use context-gatherer for large codebases', detail: 'One sub-agent call to find files is cheaper than reading 10 files in chat.' },
]

function AgentsGuide() {
  const [expandedAgent, setExpandedAgent] = useState(null)

  return (
    <div className="guide-page">
      <div className="guide-content">
        <h1 className="guide-title">🤖 Kiro Agents Guide</h1>
        <p className="guide-subtitle">Understanding agent types, sub-agent delegation, credit costs, and efficiency tips.</p>

        <section className="guide-section" data-testid="id_agents_guide_container_agent_types">
          <h2>Agent Types</h2>
          <p className="guide-section-desc">Kiro has three layers of agent capability. Click each to see details.</p>
          <div className="guide-list">
            {agentTypes.map((agent, i) => (
              <div key={i} className={`guide-item ${expandedAgent === i ? 'open' : ''}`} onClick={() => setExpandedAgent(expandedAgent === i ? null : i)} data-testid={`id_agents_guide_accordion_${agent.name.toLowerCase().replace(/[\s-]+/g, '_')}`}>
                <div className="guide-item-header">
                  <span className="guide-item-icon">{agent.icon}</span>
                  <span className="guide-item-name">{agent.name}</span>
                  <span className="guide-item-toggle">{expandedAgent === i ? '▲' : '▼'}</span>
                </div>
                <p className="guide-item-what">{agent.desc}</p>
                {expandedAgent === i && (
                  <div className="guide-item-details">
                    <div className="guide-detail"><span className="guide-label">Runs:</span> {agent.where}</div>
                    <div className="guide-detail"><span className="guide-label">Parallelism:</span> {agent.parallel}</div>
                    <div className="guide-detail"><span className="guide-label">Context:</span> {agent.context}</div>
                    <div className="guide-detail"><span className="guide-label">Cost:</span> {agent.cost}</div>
                    <div className="guide-detail guide-when">
                      <span className="guide-label">Best for:</span>
                      <ul style={{margin:'0.3rem 0 0 1rem',padding:0}}>
                        {agent.bestFor.map((item, j) => <li key={j} style={{fontSize:'0.8rem',color:'#94a3b8',marginBottom:'0.2rem'}}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" data-testid="id_agents_guide_container_credit_costs">
          <h2>Credit Costs</h2>
          <div className="agents-table" data-testid="id_agents_guide_table_credit_costs">
            <div className="agents-table-header">
              <span>Action</span>
              <span>Credits</span>
            </div>
            {creditTable.map((row, i) => (
              <div key={i} className="agents-table-row" data-testid={`id_agents_guide_row_${row.action.toLowerCase().replace(/[\s()]+/g, '_').replace(/[^a-z0-9_]/g, '')}`}>
                <span>{row.action}</span>
                <span className="agents-credit-value">{row.credits}</span>
              </div>
            ))}
          </div>
          <div className="agents-pricing-note">
            Plans: Free (50 credits) · Pro $20/mo (1,000) · Pro+ $40/mo (2,000) · Power $200/mo (10,000) · Overage: $0.04/credit
          </div>
        </section>

        <section className="guide-section" data-testid="id_agents_guide_container_credit_efficiency_tips">
          <h2>Credit Efficiency Tips</h2>
          <div className="guide-list">
            {creditTips.map((tip, i) => (
              <div key={i} className="agents-tip">
                <span className="agents-tip-title">{tip.tip}</span>
                <span className="agents-tip-detail">{tip.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" data-testid="id_agents_guide_container_sub_agent_workflow">
          <h2>Sub-Agent Workflow (Spec Execution)</h2>
          <div className="agents-flow">
            <div className="agents-flow-step">
              <span className="agents-flow-label">Orchestrator</span>
              <span className="agents-flow-desc">Reads tasks.md, queues all tasks</span>
            </div>
            <div className="agents-flow-arrow">↓</div>
            <div className="agents-flow-step">
              <span className="agents-flow-label">Task 1 → spec-task-execution</span>
              <span className="agents-flow-desc">Sub-agent writes code, runs tests, returns result</span>
            </div>
            <div className="agents-flow-arrow">↓</div>
            <div className="agents-flow-step">
              <span className="agents-flow-label">Task 2 → spec-task-execution</span>
              <span className="agents-flow-desc">Next sub-agent invocation (sequential, not parallel)</span>
            </div>
            <div className="agents-flow-arrow">↓</div>
            <div className="agents-flow-step">
              <span className="agents-flow-label">... until all tasks complete</span>
              <span className="agents-flow-desc">Each task: 1+ credit. Total: ~10-15 for a 10-task spec</span>
            </div>
          </div>
        </section>

        <section className="guide-section" data-testid="id_agents_guide_container_review_carefully">
          <h2>What to Review Carefully</h2>
          <div className="guide-list">
            <div className="agents-review-item">Generated steering files from skills — validate before committing</div>
            <div className="agents-review-item">Security-critical code — hooks generate tests but don't guarantee coverage</div>
            <div className="agents-review-item">Database migrations — always review before running in production</div>
            <div className="agents-review-item">Code handling money, PII, or authentication</div>
          </div>
        </section>
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('authenticated') === 'true')
  const [page, setPage] = useState('presentation')
  const [workshopAuthed, setWorkshopAuthed] = useState(() => sessionStorage.getItem('workshop-authenticated') === 'true')
  const [workshopName, setWorkshopName] = useState(() => sessionStorage.getItem('workshop-name') || '')
  const [workshopEmail, setWorkshopEmail] = useState(() => sessionStorage.getItem('workshop-email') || '')
  const [workshopError, setWorkshopError] = useState('')
  const [workshopLoading, setWorkshopLoading] = useState(false)

  const handleWorkshopRegister = async (e) => {
    e.preventDefault()
    setWorkshopLoading(true)
    setWorkshopError('')
    try {
      const res = await fetch('/api/workshop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: workshopName, email: workshopEmail }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('workshop-authenticated', 'true')
        sessionStorage.setItem('workshop-name', workshopName)
        sessionStorage.setItem('workshop-email', workshopEmail)
        setWorkshopAuthed(true)
      } else {
        setWorkshopError(data.message || 'Registration failed')
      }
    } catch {
      setWorkshopError('Connection error')
    }
    setWorkshopLoading(false)
  }

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />
  }

  return (
    <>
      <nav className="top-nav" data-testid="authenticated-app-top-nav">
        <button className={page === 'presentation' ? 'nav-active' : ''} onClick={() => setPage('presentation')} data-testid="id_authenticated_app_button_training">📊 Training</button>
        <button className={page === 'guide' ? 'nav-active' : ''} onClick={() => setPage('guide')} data-testid="id_authenticated_app_button_activation_guide">📖 Activation Guide</button>
        <button className={page === 'workshop' ? 'nav-active' : ''} onClick={() => setPage('workshop')} data-testid="id_authenticated_app_button_workshop">🛠️ Workshop</button>
        <button className={page === 'agents' ? 'nav-active' : ''} onClick={() => setPage('agents')} data-testid="id_authenticated_app_button_agents">🤖 Agents</button>
        <button className={page === 'changelog' ? 'nav-active' : ''} onClick={() => setPage('changelog')} data-testid="id_authenticated_app_button_changelog">📋 Changelog</button>
        <span className="nav-version">{APP_VERSION}</span>
      </nav>
      {page === 'presentation' && <App />}
      {page === 'guide' && <ActivationGuide />}
      {page === 'changelog' && <ChangelogPage />}
      {page === 'agents' && <AgentsGuide />}
      {page === 'workshop' && (
        workshopAuthed
          ? <WorkshopGuide />
          : (
            <div className="login-gate">
              <form className="login-form" onSubmit={handleWorkshopRegister} data-testid="authenticated-app-register-form">
                <div className="login-icon">🛠️</div>
                <h2>Workshop Access</h2>
                <p>Enter your name and email to access the workshop. Your knowledge check results will be recorded.</p>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="Your full name"
                  autoFocus
                  data-testid="authenticated-app-name-input"
                />
                <input
                  type="email"
                  value={workshopEmail}
                  onChange={(e) => setWorkshopEmail(e.target.value)}
                  placeholder="Your email address"
                  data-testid="authenticated-app-email-input"
                />
                {workshopError && <div className="login-error" data-testid="authenticated-app-register-error">{workshopError}</div>}
                <button type="submit" disabled={workshopLoading || !workshopName || !workshopEmail} data-testid="authenticated-app-register-button">
                  {workshopLoading ? 'Registering...' : 'Enter Workshop'}
                </button>
              </form>
            </div>
          )
      )}
    </>
  )
}

export default AuthenticatedApp
