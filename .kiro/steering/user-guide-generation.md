---
inclusion: manual
---

# User Guide Generation Rules

> Activate with `#user-guide-generation` in Kiro chat when you're ready to generate the user guide. Deactivates automatically at end of session.

These rules apply when generating a user-facing guide for the application. The output is a single markdown file that explains how to use the product from the end user's perspective — not a developer guide.

---

## 1. Structure

The user guide MUST follow this structure in order:

1. **Title & Overview** — One paragraph explaining what the app does and who it's for.
2. **Getting Started** — Prerequisites, how to access the app, first-time setup (account creation, login).
3. **Core Features** — One section per major feature. Each section includes what it does, step-by-step instructions, and a screenshot placeholder (`![Description](screenshot-placeholder.png)`).
4. **Common Workflows** — End-to-end walkthroughs of the most common tasks (e.g., "Creating your first entry", "Exporting data").
5. **Settings & Configuration** — User-configurable options, preferences, account management.
6. **Troubleshooting** — Common issues with solutions, formatted as a table: Problem | Cause | Solution.
7. **FAQ** — 5-10 frequently asked questions with concise answers.
8. **Glossary** (optional) — Domain-specific terms the user might not know.

---

## 2. Writing Style

- Write for the end user, not the developer. No code snippets, no API references, no architecture details.
- Use second person ("you") and active voice ("Click the button" not "The button should be clicked").
- Keep sentences short — max 20 words per sentence where possible.
- Use numbered steps for sequential actions, bullet points for non-sequential lists.
- Every action the user takes MUST start with a verb: Click, Select, Enter, Navigate, Open, Save.
- Include what the user should expect after each action ("A confirmation message appears").
- Add `> **Tip:**` callouts for non-obvious shortcuts or best practices.
- Add `> **Warning:**` callouts for destructive or irreversible actions.

---

## 3. Content Rules

- Derive ALL content from the actual codebase — read the app's routes, components, models, and handlers to understand what the app does.
- NEVER invent features that don't exist in the code.
- NEVER include internal implementation details (database schema, API endpoints, environment variables).
- NEVER reference developer tools (Kiro, steering files, hooks, specs).
- If the app has roles (admin, editor, viewer), document what each role can and cannot do.
- If the app has keyboard shortcuts, list them in a dedicated table.

---

## 4. Output

- Output file: `USER-GUIDE.md` in the project root.
- Use standard markdown with headings (##, ###), tables, numbered lists, and blockquotes.
- Include a table of contents at the top with anchor links.
- Add screenshot placeholders where a visual would help — format: `![Alt text](screenshots/feature-name.png)`.
- Target length: 1,500-3,000 words depending on app complexity.

---

## 5. Process

1. Scan the codebase to identify all user-facing features (routes, pages, forms, actions).
2. Group features into logical sections.
3. Write the guide following the structure in Section 1.
4. Review for completeness — every user-facing feature must be documented.
5. Output the file.

---

## Anti-Patterns

- NEVER write a developer guide — this is for end users only
- NEVER include code, API calls, or terminal commands
- NEVER reference internal file paths, database tables, or environment variables
- NEVER assume technical knowledge — explain every step
- NEVER leave placeholder text like "TODO" or "TBD" — either write the content or omit the section
- NEVER generate a guide without reading the codebase first — the guide must reflect the actual app
