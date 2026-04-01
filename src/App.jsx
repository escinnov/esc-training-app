import { useState, useEffect } from 'react'
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
        desc: 'Always-on or opt-in coding standards',
        items: ['Entity standards', 'Timezone rules', 'Concurrency & locking', 'Storage design', 'Testing standards', 'Report generation', 'Data upload rules', 'Offline sync rules', 'QA element IDs'],
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
        name: 'unit-test-on-edit',
        trigger: 'Any .py file saved',
        action: 'Checks for existing tests, generates missing ones with AAA pattern, 90% coverage target, required file headers',
      },
      {
        name: 'security-test-on-handler',
        trigger: 'Handler file saved (**/handlers/**/*.py)',
        action: 'Generates security tests: XSS, injection, auth boundaries, oversized input, data exposure',
      },
      {
        name: 'qa-element-ids',
        trigger: 'Frontend file saved (.tsx, .jsx, .vue, .svelte, .html)',
        action: 'Scans for interactive elements missing data-testid, adds them with consistent naming convention',
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
      { name: 'Concurrency & Locking', mode: 'Auto', icon: '🔒', desc: 'Short transactions, lock ordering, optimistic concurrency with version columns' },
      { name: 'Storage Design', mode: 'Auto', icon: '💾', desc: 'Schema design, indexing, encryption, backups, table naming (app_, map_, txn_)' },
      { name: 'Report Generation', mode: 'Auto', icon: '📊', desc: 'Light vs heavy classification, read replicas, async generation, caching' },
      { name: 'QA Element IDs', mode: 'Auto', icon: '🏷️', desc: 'data-testid on all interactive elements, kebab-case naming, dynamic IDs for loops' },
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
        {slides.map((slide, i) => (
          <div key={i} className="print-slide" data-testid={`app-print-slide-${slide.id}`}>
            {renderSlidePrint(slide)}
          </div>
        ))}
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

function AuthenticatedApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('authenticated') === 'true')

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />
  }

  return <App />
}

export default AuthenticatedApp
