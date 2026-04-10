# Speaker Notes — Building High-Quality Software with Kiro

## Slide 1: Title

- Welcome everyone. Today we're going to talk about how we can use Kiro's configuration system to enforce software quality automatically — not through process or discipline, but through tooling.
- This isn't about adding more rules to a wiki that nobody reads. It's about embedding standards directly into the development environment so they're impossible to skip.

## Slide 2: Agenda

- We'll start with why codified standards matter — the problem we're solving.
- Then walk through the three components of the kit: hooks, steering rules, and skills.
- Map everything to the 5 pillars of the Well-Architected Framework.
- Cover 10 real SDLC issues we've all seen and how the kit prevents each one.
- End with a practical adoption path — how to start using this tomorrow.

## Slide 3: The Problem — Inconsistency at Scale

- Left side: this is what happens without standards. Every developer has their own style. Timezone bugs are the classic — "it works on my machine" because the server is in the same timezone as the developer. Missing audit fields get discovered during a compliance audit, not during code review.
- Right side: with codified standards, these patterns are enforced automatically. The developer doesn't need to remember — the tool remembers for them.
- Key message: we're not blaming developers. We're acknowledging that humans forget, and tooling doesn't.

## Slide 4: The Kit Overview

- Three components, each serving a different purpose.
- Hooks are reactive — they fire when something happens (file save). Think of them as automated code reviewers.
- Steering rules are proactive — they're always active, guiding every interaction with Kiro. Think of them as a senior developer looking over your shoulder.
- Skills are interactive — they activate when you're making an architectural decision and walk you through a structured question flow. Think of them as a solutions architect on call.

## Slide 5: Hooks Deep Dive

- Walk through each hook — all updated to v2 for credit efficiency:
  - unit-test-on-edit v2: now scoped to 8 specific directories (handlers, services, models, repositories, utils, api, core, lib). No longer fires on test files, migrations, config, or __init__.py — roughly 50% fewer hook triggers. Prompt references the testing-standards steering file instead of repeating rules.
  - security-test-on-handler v2: prompt shortened to reference testing-standards and query-safety-rules steering files. Same coverage, ~60% smaller prompt.
  - qa-element-ids v2: prompt shortened from ~600 bytes to ~200 bytes by referencing the qa-element-id-rules steering file. 75% reduction.
- Key design principle: hooks reference steering files instead of duplicating rules. This means updating a rule in one place updates both the steering guidance and the hook behavior.
- Credit optimization note: the hooks are designed to avoid overlap. Unit test hook handles functional tests, security hook handles security tests. No double-billing on handler saves.

## Slide 6: Steering Rules Deep Dive

- 10 steering rules organized into three tiers for credit efficiency:
  - Auto (3 rules): entity-standards, timezone-rules, testing-standards. These are foundational — every interaction needs them. ~250 lines of context.
  - FileMatch (3 rules): query-safety-rules, qa-element-id-rules, storage-design-rules. These load only when you're editing relevant files — backend query code, frontend components, or data models. Zero cost when working on unrelated files.
  - Manual (4 rules): concurrency-and-locking, report-generation, data-upload, offline-sync. Activated by referencing with # in chat when the feature needs them.
- This tiered approach reduces average context from ~940 lines to ~250 lines per interaction — roughly 73% reduction in token usage.
- Point out that these are version-controlled markdown files. The team can review and evolve them through PRs, just like code.

## Slide 7: Skills Deep Dive

- Now 4 skills instead of 3 — the new one is Offline Security Selection.
- Walk through each:
  - Compute selection: 7 questions → Lambda vs containers with cost estimates
  - Storage selection: 3-phase, 9 questions → DynamoDB vs PostgreSQL vs MySQL + deployment mode
  - Tenant strategy: 5 questions → isolation model from row-level to stack-per-tenant
  - Offline security selection (NEW): 8 questions across 3 phases (data sensitivity → tamper risk → performance) → recommends server validation only, HMAC signatures, SQLCipher, or all combined
- Key new feature: ALL skills now create a persistent steering file after making a recommendation. The decision becomes a fileMatch steering rule that loads automatically on relevant code.
- This solves the "skill amnesia" problem — previously, a skill would recommend PostgreSQL but the next interaction wouldn't know that decision was made.
- To change a decision later: delete the generated steering file and re-trigger the skill, or edit the file directly.

## Slide 8: Persistent Decisions — Skills That Remember

- This is a new slide showing the before/after of persistent decisions.
- Left side (before): skills forgot their recommendations, developers re-ran skills, new team members didn't know decisions were made, inconsistent choices.
- Right side (now): skills create steering files, decisions load automatically, new team members get them enforced, decisions are version-controlled and code-reviewed.
- Key message: architectural decisions are now treated like code — versioned, reviewed, and enforced automatically.

## Slide 8: Section Break — 5 Pillars

- Transition: now let's map everything we've seen to the Well-Architected Framework. This isn't just about code quality — it's about building systems that are operationally excellent, secure, reliable, performant, and cost-optimized.

## Slide 9: Well-Architected Alignment

- This slide is now interactive — click each pillar card to expand it and see the full compliance points with source references.
- Walk through each pillar, clicking to expand:
  - Operational Excellence (5 points): IaC-only storage from storage-design-rules §7, consistent naming conventions, monitoring requirements, version-controlled migrations, report generation logging.
  - Security (7 points): This is the most covered pillar. Encryption at rest and in transit from storage-design-rules §3. Input sanitization from entity-standards. Auto-generated security tests from the handler hook. Least-privilege DB roles. PII tagging. Malware scanning on uploads from data-upload-rules §11.
  - Reliability (6 points): Automated backups and Multi-AZ from storage-design-rules §4. Connection pooling. Backward-compatible migrations. Soft delete from entity-standards. Conflict resolution from offline-sync-rules §5. Retry logic from concurrency-and-locking-rules §4.
  - Performance Efficiency (6 points): Index-first design from storage-design-rules §2. Pagination everywhere. Read replicas for heavy reports from report-generation-rules §3. Caching strategies. DynamoDB optimization. EXPLAIN ANALYZE required from report-generation-rules §4.
  - Cost Optimization (5 points): Compute right-sizing from the compute-selection skill. S3 tiering. TTL on ephemeral data. On-demand vs provisioned. Off-peak scheduling from data-upload-rules §8.
  - Sustainability (4 points): Serverless-first. Retention policies. Compression. Minimize duplication — all from storage-design-rules §8.
- Key message: every compliance point traces back to a specific section in a specific file. This isn't aspirational — it's enforced. The source references let anyone verify or customize the rules.
- Total: compliance points across 5 pillars, all enforced by the kit's steering rules, hooks, and skills. Sustainability was removed — its advice was too generic and already covered by Cost Optimization.

## Slide 10: Section Break — OWASP Top 10

- Transition: now let's ground everything in the industry standard. The OWASP Top 10:2025 is the most widely referenced framework for web application security risks. We'll walk through each one and show exactly which files in the kit address it.

## Slide 11: OWASP Top 10 — A01 through A05

- This slide is interactive — click each OWASP category to expand and see the kit's solutions.
- Walk through each:
  - A01 Broken Access Control (#1 since 2021): tenant-strategy skill forces proper isolation model. entity-standards ties every record to an authenticated user. security-test-on-handler generates 401/403 tests.
  - A02 Security Misconfiguration (jumped from #5 to #2): storage-design-rules enforce encryption, least-privilege roles, IaC-only provisioning. compute-selection skill prevents over-provisioned infrastructure with unnecessary attack surface.
  - A03 Injection: entity-standards sanitize all string inputs. security-test-on-handler generates XSS and injection tests. data-upload-rules ensure file imports get the same sanitization as API input.
  - A04 Insecure Design: this is where the kit shines — all auto-steering rules ARE the secure design patterns. timezone-rules, storage-selection skill, qa-element-id-rules all prevent design-level flaws.
  - A05 Cryptographic Failures: storage-design-rules enforce encryption at rest (AES-256, KMS, SSE) and in transit (TLS 1.2+). Secrets go to Secrets Manager, never plain text. PII gets column-level encryption.

## Slide 12: OWASP Top 10 — A06 through A10

- Continue clicking through:
  - A06 Vulnerable & Outdated Components: version-controlled migrations, 90% test coverage with regression tests, explicit library specifications in upload rules.
  - A07 Identification & Authentication Failures: tenant-strategy enforces separate auth contexts. security-test-on-handler generates auth boundary tests. entity-standards source user identity from JWT only.
  - A08 Software & Data Integrity Failures: optimistic concurrency with version columns. collision detection on every upsert. conflict resolution strategies for offline sync.
  - A09 Security Logging & Monitoring Failures: mandatory audit fields on every entity. audit logging on all storage. report generation logging. deadlock and lock-wait monitoring.
  - A10 Exceptional Conditions (new in 2025): retry logic for serialization failures. NOWAIT for fail-fast behavior. explicit timeouts on all transactions. batch isolation for upload processing.
- Key message: every OWASP category has concrete, traceable solutions in the kit. The source references let anyone verify the claim.

## Slide 13: How It Works in Practice

- Walk through the 6-step flow:
  1. Clone the kit — just copy the .kiro directory.
  2. Open in Kiro — auto-steering activates immediately.
  3. Write code — Kiro follows all active rules.
  4. Save a file — hooks fire automatically.
  5. Ask about architecture — skills activate on keywords.
  6. Ship with confidence — standards enforced, tests passing.
- Emphasize: zero configuration. No setup scripts, no CI pipeline changes, no team training on 50 rules. Just copy the directory and start coding.

## Slide 14: Adoption Path

- Three phases, matching the three scenarios in the guide:
  - Phase 1 (new projects): easiest. Clone and go.
  - Phase 2 (new features): kit is already there. Just build.
  - Phase 3 (existing projects): copy the kit in, then audit incrementally. Don't try to fix everything at once. Every file you touch gets better.
- Suggested priority for existing projects: entities → timezones → tests → concurrency → storage.
- The "boy scout rule" effect: hooks ensure every file you edit gets tests and standards applied, even if you don't explicitly audit it.

## Slide 15: Using Kiro Efficiently

- This is the practical "how to use it day-to-day" slide.
- Walk through the five cards:
  1. Skip "Generate Steering Docs" — the kit already has curated rules. Use the safe prompt shown on the slide to generate project-context files without conflicts.
  2. Chat effectively — be specific, reference files with #, activate manual steering only when needed.
  3. Save files — hooks fire automatically. Tip: disable during bulk refactors, re-enable after.
  4. Use Specs for big features — multi-file features get requirements, design, and tasks. Chat is for quick fixes.
  5. Credit efficiency — Autopilot for routine, Supervised for critical. Specific prompts = fewer round trips.
- Key message: the kit does the heavy lifting. Your job is to describe what you want built, and the standards are enforced automatically.
- Point people to the Activation Guide page (second tab) for the full reference on each rule.

## Slide 16: Key Takeaways

- Six takeaways to remember:
  1. Automation over discipline — hooks do what humans forget.
  2. Standards as code — steering rules are reviewable, versionable, evolvable.
  3. Guided decisions — skills prevent gut-feel architecture.
  4. Well-Architected by default — all 5 pillars covered.
  5. 10 SDLC issues prevented — by tooling, not process.
  6. Incremental adoption — works for new and existing projects.

## Slide 17: Questions

- Open the floor for questions.
- Common questions to prepare for:
  - "Can we customize the rules?" — Yes, they're markdown files. Edit them, PR them, evolve them.
  - "Does this work for TypeScript/Java/etc.?" — Steering rules are language-agnostic. Hooks can be adjusted for any file pattern.
  - "What if a rule doesn't apply to our project?" — Change inclusion from auto to manual, or remove it.
  - "How do we get the team to adopt this?" — Start with Phase 1 on a new project. Let the team experience it. Then bring it to existing projects.
  - "Does this replace code reviews?" — No. It handles the mechanical checks so code reviews can focus on logic, design, and business correctness.
