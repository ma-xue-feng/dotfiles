---
name: manual-sync-preferences
description: 偏好文件同步改为手动触发——用户明确要求上传时才推送，明确要求下载时才拉取
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cde72299-47c0-4422-bb96-8fd0407e4b05
---

偏好文件同步不再自动执行，改为手动触发：
- **上传（push）**：仅当用户明确说"上传偏好"/"推送偏好"/"更新 GitHub 偏好"等时，才在仓库目录执行 git add -A && git commit && git push
- **下载（pull）**：仅当用户明确说"同步偏好"/"拉取偏好"/"下载偏好"等时，才在仓库目录执行 git pull

**Why:** 用户希望更精确地控制同步时机，避免每次会话自动拉取和每次写入自动推送。

**How to apply:**
- 偏好文件 GitHub 仓库: https://github.com/ma-xue-feng/dotfiles
- 本地路径: ~/.claude/preferences-repo/
- 新电脑恢复：`git clone https://github.com/ma-xue-feng/dotfiles.git ~/.claude/preferences-repo`
- 日常使用中除非用户明确要求，否则不主动执行 git pull/push

参见 [[official-info-first]]
