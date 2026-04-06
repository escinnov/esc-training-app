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
      { icon: '🏛️', text: '6 Pillars of Well-Architected Software' },
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
        items: ['Entity standards (auto)', 'Timezone rules (auto)', 'Testing standards (auto)', 'Query safety (contextual)', 'QA element IDs (contextual)', 'Storage design (contextual)', 'Concurrency & locking (manual)', 'Report generation (manual)', 'Data upload rules (manual)', 'Offline sync rules (manual)'],
      },
      {
        icon: '🧠',
        title: 'Skills',
        color: '#f59e0b',
        desc: 'Interactive decision flows before recommending architecture',
        items: ['Compute selection (Lambda vs ECS)', 'Storage selection (DynamoDB vs RDS)', 'Tenant strategy (isolation models)'],
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
      { name: 'QA Element IDs', mode: 'FileMatch', icon: '🏷️', desc: 'data-testid on interactive elements, kebab-case naming. Loads on frontend files only' },
      { name: 'Storage Design', mode: 'FileMatch', icon: '💾', desc: 'Schema design, indexing, encryption, backups, table naming. Loads on model/migration files' },
      { name: 'Concurrency & Locking', mode: 'Manual', icon: '🔒', desc: 'Short transactions, lock ordering, optimistic concurrency. Activate with #concurrency-and-locking-rules' },
      { name: 'Report Generation', mode: 'Manual', icon: '📊', desc: 'Light vs heavy classification, read replicas, async generation. Activate with #report-generation-rules' },
      { name: 'Data Upload', mode: 'Manual', icon: '📤', desc: 'Light/heavy classification, staging tables, collision handling, off-peak scheduling' },
      { name: 'Offline Sync', mode: 'Manual', icon: '📡', desc: 'Delta sync, local storage schema, conflict resolution, sync API design' },
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
        example: '"Should I use Lambda for this background job?" → 7 questions → recommendation',
      },
      {
        name: 'Storage Selection',
        trigger: 'Mention database, DynamoDB, RDS, PostgreSQL...',
        questions: 9,
        outcome: 'DynamoDB vs PostgreSQL vs MySQL + serverless vs serverful',
        example: '"Which database for this feature?" → 3-phase flow → recommendation',
      },
      {
        name: 'Tenant Strategy',
        trigger: 'Mention multi-tenant, SaaS, tenant isolation...',
        questions: 5,
        outcome: 'Row-level → Schema-per-tenant → Stack-per-tenant recommendation',
        example: '"We need to support multiple organizations" → 5 questions → model',
      },
    ],
  },
  {
    id: 'pillars-title',
    type: 'section-break',
    title: '6 Pillars of Well-Architected Software',
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
      {
        name: 'Sustainability',
        icon: '🌱',
        color: '#10b981',
        desc: 'Ability to continually improve sustainability impacts by reducing energy consumption and increasing efficiency across all workload components.',
        mappings: [
          { text: 'Serverless/managed storage preferred — DynamoDB, Aurora Serverless, S3', source: 'storage-design-rules.md §8' },
          { text: 'Data retention policies aligned with business and compliance requirements', source: 'storage-design-rules.md §8' },
          { text: 'Large objects compressed before storing in S3 or document databases', source: 'storage-design-rules.md §8' },
          { text: 'References/foreign keys over data duplication unless read perf demands it', source: 'storage-design-rules.md §8' },
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
      { icon: '🏛️', text: 'Well-Architected by default — every pillar is covered' },
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
    what: 'Ensures data-testid attributes on all interactive UI elements with consistent kebab-case naming convention.',
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
    id: 'part1',
    title: 'Part 1: Project Setup',
    icon: '📁',
    duration: '10 min',
    content: [
      { type: 'step', num: '1.1', title: 'Create the project', code: 'mkdir dev-diary\ncd dev-diary\ngit init' },
      { type: 'step', num: '1.2', title: 'Copy the kit', text: 'Copy the .kiro directory from the kit repository into dev-diary/.' },
      { type: 'step', num: '1.3', title: 'Open in Kiro', text: 'Open the dev-diary folder in Kiro. Click the Ghost icon → verify entity-standards, timezone-rules, and testing-standards are listed as auto-loaded.' },
      { type: 'step', num: '1.4', title: 'Generate project context (safe prompt)', prompt: 'Create three steering files in .kiro/steering/:\n1. product.md — A Dev Diary app for developers to log daily entries with title, content, mood, and tags. Single-user for now.\n2. tech-stack.md — Python 3.11, FastAPI, SQLAlchemy, Alembic for migrations. React frontend with Vite.\n3. project-structure.md — backend/ for Python API, frontend/ for React app, tests/ for all tests.\n\nSet all to inclusion: auto. Do NOT include coding standards or conventions — those are in existing steering files.' },
      { type: 'observe', text: 'Kiro creates only project-context files. The kit\'s coding standards remain untouched.' },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2: Database & Entity Design',
    icon: '🗄️',
    duration: '15 min',
    content: [
      { type: 'step', num: '2.1', title: 'Trigger the storage-selection skill', prompt: 'I need to choose a database for the Dev Diary app. It stores diary entries with title, content, mood, and tags per user.' },
      { type: 'observe', text: 'The storage-selection skill activates and reasons through the decision. Single-user app → SQLite. Multi-user/hosted → PostgreSQL. Both are valid — accept the recommendation.' },
      { type: 'step', num: '2.2', title: 'Create the DiaryEntry entity', prompt: 'Create a DiaryEntry entity with fields: title (string, max 200), content (text), mood (enum: great/good/okay/bad/terrible), tags (list of strings). Store it in a table called txn_diary_entries. Make sure to use all the steering files that are activated.' },
      { type: 'observe', text: 'entity-standards.md adds audit fields automatically. timezone-rules.md enforces TIMESTAMPTZ. storage-design-rules.md enforces txn_ prefix, UUID key, snake_case.' },
      { type: 'step', num: '2.3', title: 'Save the model file', text: 'Save backend/models/diary_entry.py — the unit-test-on-edit hook fires and generates unit tests.' },
      { type: 'step', num: '2.4', title: 'Create the migration', prompt: 'Create an Alembic migration for the DiaryEntry model. Include indexes for user_id and created_date for efficient queries.' },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3: Make the Backend Runnable',
    icon: '⚙️',
    duration: '10 min',
    content: [
      { type: 'step', num: '3.1', title: 'Create wiring files', prompt: 'Create the files needed to run the FastAPI backend:\n- backend/main.py — FastAPI app with CORS middleware, dependency wiring, and router registration\n- backend/db.py — SQLAlchemy engine and get_db session dependency\n- backend/requirements.txt — pinned dependencies\n\nWire up the _get_db and _current_user_id placeholders from the handlers.' },
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
      { type: 'step', num: '4.1', title: 'Create CRUD handlers', prompt: 'Create FastAPI handlers for DiaryEntry:\n- POST /entries — create a new entry\n- GET /entries — list entries for the current user (paginated, keyset pagination)\n- GET /entries/{id} — get a single entry\n- PUT /entries/{id} — update an entry\n- DELETE /entries/{id} — soft delete an entry\n\nPut them in backend/handlers/entries.py' },
      { type: 'observe', text: 'Kiro reads files and steering rules first, then applies: entity-standards (audit fields, soft delete), query-safety-rules (ORM only, no string interpolation), timezone-rules (utc_now, UTC offset), storage-design-rules (keyset pagination, no OFFSET). Note: qa-element-id-rules is correctly skipped — frontend-only.' },
      { type: 'note', text: 'Kiro generates _get_db and _current_user_id placeholders — wire these to your real session and auth logic.' },
      { type: 'step', num: '4.2', title: 'Save the handler file', text: 'Save backend/handlers/entries.py — TWO hooks fire: unit-test-on-edit (unit tests) and security-test-on-handler (security tests with @pytest.mark.security).' },
      { type: 'step', num: '4.3', title: 'Test SQL keyword handling', prompt: 'Write a test that creates a diary entry with the title "Execute the deployment plan" and content containing "SELECT the best approach, DROP old habits, GRANT yourself permission to learn". Verify the entry is created successfully — SQL keywords in user data must be accepted.' },
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
      { type: 'step', num: '6.1', title: 'Activate report-generation-rules and build export', prompt: '#report-generation-rules\n\nI need to add a CSV export feature for diary entries. Users can export their entries for a date range.' },
      { type: 'observe', text: 'Kiro classifies this as a light report — synchronous, query primary DB, paginate, set query timeout, return CSV directly. No async job queue needed. Datetimes follow timezone-rules (user\'s local timezone).' },
    ],
  },
  {
    id: 'part7',
    title: 'Part 7: Frontend',
    icon: '🖥️',
    duration: '15 min',
    content: [
      { type: 'step', num: '7.1', title: 'Scaffold the React frontend', prompt: 'Create a React frontend with Vite in the frontend/ directory. Include:\n- A diary entry list page with keyset pagination\n- A create/edit entry form with title, content, mood selector, and tags input\n- A delete button that soft-deletes (calls DELETE endpoint)\n- Display dates in the user\'s local timezone\n- Proxy /entries requests to http://localhost:8000 in vite.config.js' },
      { type: 'observe', text: 'timezone-rules.md converts UTC to local for display. qa-element-id-rules.md loads on .jsx/.tsx files and adds data-testid attributes.' },
      { type: 'step', num: '7.2', title: 'Start the frontend (separate terminal)', code: 'cd frontend\nnpm install\nnpm run dev' },
      { type: 'note', text: 'App at http://localhost:5173. Vite proxies /entries to http://localhost:8000 — no CORS issues.' },
      { type: 'step', num: '7.3', title: 'Verify data-testid attributes', text: 'Check generated components for: entry-list-create-button, entry-form-title-input, entry-form-content-textarea, entry-form-mood-select, entry-form-submit-button, entry-card-delete-button-{entry.id}' },
    ],
  },
  {
    id: 'part8',
    title: 'Part 8: Concurrency',
    icon: '🔒',
    duration: '10 min',
    content: [
      { type: 'step', num: '8.1', title: 'Add optimistic concurrency', prompt: '#concurrency-and-locking-rules\n\nAdd optimistic concurrency to the DiaryEntry update handler. Two browser tabs editing the same entry should not silently overwrite each other.' },
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
]

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
    <div className="workshop-page">
      <div className="workshop-sidebar">
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
      </div>
      <div className="workshop-content">
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
            return null
          })}
        </div>
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('authenticated') === 'true')
  const [page, setPage] = useState('presentation')
  const [workshopAuthed, setWorkshopAuthed] = useState(() => sessionStorage.getItem('workshop-authenticated') === 'true')
  const [workshopPassword, setWorkshopPassword] = useState('')
  const [workshopError, setWorkshopError] = useState('')
  const [workshopLoading, setWorkshopLoading] = useState(false)

  const handleWorkshopAuth = async (e) => {
    e.preventDefault()
    setWorkshopLoading(true)
    setWorkshopError('')
    try {
      const res = await fetch('/api/auth-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: workshopPassword }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('workshop-authenticated', 'true')
        setWorkshopAuthed(true)
      } else {
        setWorkshopError('Invalid workshop password')
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
        <button className={page === 'presentation' ? 'nav-active' : ''} onClick={() => setPage('presentation')} data-testid="authenticated-app-nav-training-button">📊 Training</button>
        <button className={page === 'guide' ? 'nav-active' : ''} onClick={() => setPage('guide')} data-testid="authenticated-app-nav-guide-button">📖 Activation Guide</button>
        <button className={page === 'workshop' ? 'nav-active' : ''} onClick={() => setPage('workshop')} data-testid="authenticated-app-nav-workshop-button">🛠️ Workshop</button>
      </nav>
      {page === 'presentation' && <App />}
      {page === 'guide' && <ActivationGuide />}
      {page === 'workshop' && (
        workshopAuthed
          ? <WorkshopGuide />
          : (
            <div className="login-gate">
              <form className="login-form" onSubmit={handleWorkshopAuth} data-testid="workshop-gate-form">
                <div className="login-icon">🛠️</div>
                <h2>Workshop Access</h2>
                <p>Enter the workshop password to continue.</p>
                <input
                  type="password"
                  value={workshopPassword}
                  onChange={(e) => setWorkshopPassword(e.target.value)}
                  placeholder="Workshop password"
                  autoFocus
                  data-testid="workshop-gate-password-input"
                />
                {workshopError && <div className="login-error" data-testid="workshop-gate-error">{workshopError}</div>}
                <button type="submit" disabled={workshopLoading || !workshopPassword} data-testid="workshop-gate-submit-button">
                  {workshopLoading ? 'Verifying...' : 'Enter'}
                </button>
              </form>
            </div>
          )
      )}
    </>
  )
}

export default AuthenticatedApp
