---
name: install-supervision
description: Use when about to install or set up any software, tool, CLI, plugin, skill, package manager module, or runtime — before running any install command. Also use when the user reports installation-related confusion such as not knowing where something was installed, what a directory contains, or why a tool doesn't work after installation.
---

# Install Supervision

## Overview

Every installation follows a standardized three-phase process: pre-flight check, supervised installation, post-install verification. No install command may run before all three phases complete.

Violating the letter of the rules is violating the spirit of the rules.

## When to Use

This skill triggers before ANY install/setup action:
- Package managers: npm, pip, brew, winget, apt, cargo, gem, scoop, choco
- Claude Code plugins and skills (including `/plugin install`)
- Standalone CLIs, SDKs, runtimes, language toolchains
- Any command modifying PATH, environment variables, or global state

**When NOT to use:** Project dependencies in package.json/requirements.txt (managed by the project); updates to already-logged packages at the same path.

## Default Install Paths

These are the suggested defaults. Always present the default to the user AND ask for confirmation — the user always has final say.

| Install Type | Default Path | When to Ask |
|-------------|-------------|------------|
| Network-downloaded skill (marketplace, GitHub, URL) | `C:\Users\MaXueFeng\.claude\skills\<descriptive-name>\` | Before running install — "默认安装到 ~/.claude/skills/<name>/，还是你有其他路径？" |
| Project summary skill (project memory, project-specific summary) | `C:\Users\MaXueFeng\.claude\Project_Memory_Skills\<descriptive-name>\` | After summarizing the skill content — "默认保存到 ~/.claude/Project_Memory_Skills/<name>/，还是你有其他路径？" |
| Other tools/software/plugins | Propose a reasonable path under `~/.claude/<category>/<name>/` | Before running install |

**Key rule:** The default is a suggestion, not a decision. Never install without the user confirming the path.

## Core Workflow

### Phase 1: Pre-flight Check

Complete ALL of these before running any install command:

1. **Identify** — name, version, purpose, install method
2. **Determine category** — is this a network-downloaded skill, a project summary skill, or other tool? Check the table above for the right default path.
3. **Check file integrity and prerequisites — purpose: ensure this CAN be installed BEFORE running any command:**
   - Verify the downloaded/copied files are complete and not corrupted (check file sizes, key files present)
   - OS and architecture match
   - Required dependencies already installed (check, don't assume)
   - **If any prerequisite is missing: STOP and tell the user BEFORE installing.** Never install first and then report "it won't work because you need X"
   - No version conflicts with what's already on the system
4. **Present findings and path options to user** — include the category-appropriate default from the table above, but also offer the option to customize
5. **Wait for explicit confirmation** before proceeding

### Phase 2: Supervised Installation

1. **Naming — present two options and let user choose:**
   - Option A: **Source name** — the original name from the source (e.g., `brainstorming`, `pdfplumber`)
   - Option B: **Descriptive name** — a name that makes the content obvious at a glance (e.g., `superpowers-brainstorming`, `pdf-table-extractor`)
   - Always ask: "文件夹名用原始名称 `<source-name>` 还是用更具描述性的 `<descriptive-name>`？"
   - Never: `skills-main`, `temp`, `plugin-1`, UUIDs, auto-generated names
2. Capture output of each step
3. If any step fails: stop, report, ask — never blindly continue

### Phase 3: Post-install Verification

1. Verify installation succeeded (key files exist, `--version` works, etc.)
2. Create a log file at `C:\Users\MaXueFeng\.claude\Installation log recording\<name>_install_log.md` — one file per installed item, recording:

```markdown
# Install Log: <name>

- **What:** <name> <version>
- **When:** <ISO timestamp>
- **Where:** <full path>
- **Source:** <URL or marketplace name>
- **Method:** <npm/pip/plugin install/etc.>
- **Dependencies installed:** <list or "none">
- **Warnings/Notes:** <any issues encountered>
```

3. Report summary to user, including the path to the log file

## Red Flags — STOP and Go Back

- "This is just a small tool, no need for the full process"
- "I already know where it goes"
- "The package manager handles paths automatically"
- "I'll just use the default and tell the user after"
- "It installed successfully, I can skip the log"
- "I'll check if it works after installing" — if it needs a missing dependency, the user should know BEFORE, not after

**All of these mean: Go back to Phase 1. Get path confirmation. Create the log.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "This is a simple install, I don't need to ask about paths" | The user explicitly reported path chaos as a problem. Always ask. |
| "npm/pip manages its own paths" | Global packages go to system directories the user may not know about. Ask. |
| "The plugin always goes in the marketplace directory" | The user may want it elsewhere. Present the option. |
| "I can log it later" | You won't. Log now, during Phase 3, before reporting success. |
| "The install succeeded, that's what matters" | Without a log, the user won't know what was installed where. |
| "Dependencies are handled automatically" | Check anyway. The user reported dependency surprises as a real problem. |
| "The default path is what the user set, I'll just use it" | The default is a suggestion. Each install is different — confirm every time. |
| "This is a project skill, it obviously goes in Project_Memory_Skills" | The user may want it in the project repo or elsewhere. Always ask. |
| "The name doesn't matter, the user can rename later" | Folder names are the first thing the user sees when browsing. Get it right before creating. |
| "I'll install first, then check if dependencies are missing" | The user must know prerequisites BEFORE installation. Surprises after the fact waste time. |
