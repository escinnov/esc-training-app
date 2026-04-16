# Kiro Autonomous Agent — Setup & Usage Guide

The autonomous agent is a separate product from the IDE agent. It runs in the cloud, works independently on development tasks, and opens pull requests when done. You assign work, it executes asynchronously in isolated sandboxes, and you review the results.

> **Preview**: Currently rolling out to Kiro Pro, Pro+, and Power subscribers. No extra cost during preview. Features may change.

Source: [kiro.dev/docs/autonomous-agent](https://kiro.dev/docs/autonomous-agent/)

---

## Prerequisites

- A Kiro account on **Pro**, **Pro+**, or **Power** plan
- A GitHub account with **write permissions** on the repositories you want the agent to work on
- The Kiro Agent GitHub app installed on your organization or personal account

---

## Setup (One-Time)

### Step 1: Access the Autonomous Agent

Go to [app.kiro.dev/agent](https://app.kiro.dev/agent) and sign in with your Kiro account.

### Step 2: Connect GitHub

1. Go to **Settings** in the autonomous agent web app
2. Click **"Connect GitHub"** under Integrations
3. Authorize the **Kiro Agent GitHub app**
4. Select which repositories the agent can access (specific repos or all repos in your org)

The GitHub app only needs to be installed **once per organization**. After that, any team member who connects their GitHub account to Kiro will see repositories where both conditions are met:

1. The Kiro Agent GitHub app has been authorized for that repository
2. Their GitHub account has access to that repository

### Step 3: Verify Access

After connecting, you should see your repositories listed in the agent interface. If a repo is missing, check that:

- The Kiro Agent GitHub app is installed on that repo's organization
- Your GitHub account has write permissions on the repo

---

## Creating Tasks

There are three ways to assign work to the autonomous agent.

### Option A: From the Web App

1. Go to [app.kiro.dev/agent](https://app.kiro.dev/agent)
2. Optionally select one or more repositories before starting
3. Describe what you want the agent to do in the chat

If you skip repository selection, the agent will prompt you to choose when you ask it to work on something.

### Option B: From a GitHub Issue (Label)

Add the `kiro` label to any GitHub issue. The agent picks it up, starts working, and listens to all comments on the issue for additional context.

### Option C: From a GitHub Issue (Command)

Comment `/kiro` on any issue to assign it to the agent. The Kiro Agent GitHub app must be installed on the repository for this to work.

---

## How the Agent Works

When you assign a task, the agent follows this process:

1. **Environment setup** — Spins up an isolated sandbox, clones your repos, loads any Dockerfiles or MCP servers it finds
2. **Repository analysis** — Analyzes the codebase structure and relevant files
3. **Planning** — Proposes a plan with requirements and acceptance criteria
4. **Execution** — Assigns sub-agents to each step, verifying changes before moving forward
5. **Clarification** — Asks questions if uncertain (task moves to "Needs attention")
6. **Completion** — Opens pull requests with detailed descriptions of what changed and why

The agent reads `.kiro/steering/` files from your repository automatically, so your team's standards and conventions are followed without repeating them in every task.

---

## Task Lifecycle

| Status | Meaning |
|--------|---------|
| **Queued** | Waiting to start (you've hit the 10 concurrent task limit) |
| **In progress** | Agent is actively working — analyzing, coding, or testing |
| **Needs attention** | Agent has a question or needs input from you |
| **Completed** | Work is done, PRs are open — review and provide feedback |
| **Cancelled** | Task was cancelled and cannot be resumed |

---

## Working with Pull Requests

After completing a task, the agent opens PRs with:

- A detailed description of changes
- Implementation approach and trade-offs considered
- You and the agent listed as co-authors on every commit

### Addressing PR Feedback

Two commands for handling reviewer comments:

- `/kiro all` — Addresses all comments from all reviewers across the entire PR
- `/kiro fix` — Addresses all comments within a specific conversation thread

To prevent a comment from being addressed, delete it or reply with your own perspective before using a command.

### Teaching the Agent

Leave feedback on PRs like "remember to use our standard error handling" or "always follow our naming conventions." The agent learns from **your** feedback specifically and applies those patterns to future work across all repositories. Other reviewers' comments don't affect the agent's learnings.

---

## Multi-Repo Tasks

The agent can work across multiple repositories in a single task. When you assign work that spans repos, it coordinates changes and opens PRs in each one.

Example tasks:

- "Add a new API endpoint in the backend service and update the frontend client to call it"
- "Update the shared auth library and migrate both the web and mobile apps to use the new version"

> **Warning**: Only select repositories you trust, especially when mixing public and private repos. The agent learns from and follows instructions in repository code.

---

## Sandbox Configuration

Each task runs in an isolated sandbox that is torn down after completion.

| Configuration | What It Does |
|---------------|-------------|
| **Internet access** | Control which domains the agent can reach |
| **MCP servers** | Connect specialized tools via Model Context Protocol |
| **Environment variables** | Configure secrets and config for task execution (stored encrypted) |
| **Dockerfile** | Define the sandbox environment with a Dockerfile in your repo |

---

## Limits & Data Retention

- Up to **10 concurrent tasks** — additional tasks are queued automatically
- Weekly usage limits during preview (reset each week)
- **No extra cost** during the preview period
- Chats and task logs expire after **90 days**
- PRs, code changes, and GitHub conversations are **not deleted**

---

## Tips for Good Results

1. **Be specific about the outcome.** Instead of "improve the login flow," say "add password reset functionality to the login page with email verification."

2. **Describe the problem, not just the solution.** Context helps the agent make better implementation decisions.

3. **Define acceptance criteria.** List specific conditions that must be met for the task to be complete.

4. **Use steering files.** Put your team's standards in `.kiro/steering/` — the agent reads them automatically. No need to repeat conventions in every task.

5. **Provide context.** Link to related docs, examples, or existing code that should inform the implementation.

6. **Start simple.** For your first task, try something straightforward:
   - "Add error handling to the login function in auth.ts"
   - "Write unit tests for the UserService class"
   - "Update the README with installation instructions"

7. **Review and teach.** The more feedback you give on PRs, the better the agent gets at following your patterns.

---

## Permissions Reference

### Repository Permissions (Read & Write)

- Actions, Checks, Contents, Issues, Pull requests, Workflows

### Repository Permissions (Read-only)

- Metadata (mandatory), Administration, Commit statuses

### Organization Permissions (Read-only)

- Administration

### Revocation

- **Org owners**: Remove repository permissions from the Kiro Agent GitHub app (blocks all users immediately)
- **Individual users**: Disconnect GitHub account from Kiro (stops your agent only)

---

## Comparison: IDE Agent vs Autonomous Agent

| | IDE Agent | Autonomous Agent |
|---|-----------|-----------------|
| **Where it runs** | Local (your machine) | Cloud (isolated sandbox) |
| **How you interact** | Chat, hooks, specs | Web app, GitHub issues |
| **Parallelism** | Sequential | Up to 10 concurrent tasks |
| **Context** | Session only | Persistent, learns from reviews |
| **Multi-repo** | No | Yes |
| **Output** | Direct file changes | Pull requests |
| **Steering files** | Read from local `.kiro/` | Read from repo `.kiro/` |
| **Cost** | 1 credit/interaction | Included in plan (preview) |

---

## Quick Reference

| Action | How |
|--------|-----|
| Access the agent | [app.kiro.dev/agent](https://app.kiro.dev/agent) |
| Connect GitHub | Settings → Connect GitHub → Authorize → Select repos |
| Create a task (web) | Start a chat → Select repos → Describe the work |
| Create a task (GitHub) | Add `kiro` label or comment `/kiro` on an issue |
| Address PR feedback | Comment `/kiro all` (all comments) or `/kiro fix` (one thread) |
| Configure sandbox | Settings → Internet access, MCP, env vars, Dockerfile |
| Check task status | [app.kiro.dev/agent](https://app.kiro.dev/agent) → Task list |

Source: Content was rephrased for compliance with licensing restrictions. Official docs at [kiro.dev/docs/autonomous-agent](https://kiro.dev/docs/autonomous-agent/).
