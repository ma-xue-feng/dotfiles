---
name: auto-sync-preferences
description: 偏好文件更新后自动同步到 GitHub，新会话自动从 GitHub 拉取最新偏好
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cde72299-47c0-4422-bb96-8fd0407e4b05
---

每次更新本地偏好文件（记忆文件、CLAUDE.md、settings.json 等）后，自动将变更提交并推送到 GitHub 仓库。每次开启新会话时，自动从 GitHub 拉取最新偏好文件。

**Why:** 用户需要在多台电脑间同步 Claude Code 偏好设置，避免重复配置。

**How to apply:**
- 偏好文件 GitHub 仓库: https://github.com/ma-xue-feng/dotfiles
- 本地路径: ~/.claude/preferences-repo/
- 写入偏好文件后：在仓库目录执行 git add -A && git commit && git push（通过 PostToolUse hook 自动触发）
- 会话开始：在仓库目录执行 git pull（通过 SessionStart hook 自动触发）
- 新电脑恢复：`git clone https://github.com/ma-xue-feng/dotfiles.git ~/.claude/preferences-repo`

参见 [[official-info-first]]
