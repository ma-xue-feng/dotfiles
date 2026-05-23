#!/usr/bin/env bash
# Claude Code 偏好同步 - 新电脑一次性引导
# 用法: git clone https://github.com/ma-xue-feng/dotfiles.git ~/.claude/preferences-repo && bash ~/.claude/preferences-repo/setup.sh
set -e

REPO_DIR="$HOME/.claude/preferences-repo"

# 1. 安装 CLAUDE.md 全局偏好
if [ -f "$HOME/.claude/CLAUDE.md" ]; then
  cp "$HOME/.claude/CLAUDE.md" "$HOME/.claude/CLAUDE.md.bak"
  echo "已备份现有 CLAUDE.md → CLAUDE.md.bak"
fi
cp "$REPO_DIR/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
echo "✓ CLAUDE.md 已安装"

# 2. 合并同步配置到 settings.json
node -e "
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(process.env.HOME, '.claude', 'settings.json');

let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (e) {
  console.log('  创建新的 settings.json');
}

settings.autoMemoryDirectory = '~/.claude/preferences-repo/memory/';

if (!settings.hooks) settings.hooks = {};

settings.hooks.SessionStart = [{
  hooks: [{
    type: 'command',
    command: 'cd ~/.claude/preferences-repo && git pull 2>/dev/null || true'
  }]
}];

settings.hooks.PostToolUse = settings.hooks.PostToolUse || [];
const existing = settings.hooks.PostToolUse.find(h => h.matcher === 'Write|Edit');
if (!existing) {
  settings.hooks.PostToolUse.push({
    matcher: 'Write|Edit',
    hooks: [{
      type: 'command',
      command: 'node -e \"const{readFileSync:r}=require(\\'fs\\');try{const d=r(0,\\'utf8\\'),j=JSON.parse(d),f=j.tool_response?.filePath||j.tool_input?.file_path;if(!f||!f.includes(\\'preferences-repo/memory/\\'))process.exit(1)}catch(e){process.exit(1)}\" 2>/dev/null && (cd ~/.claude/preferences-repo && git add -A && (git diff --cached --quiet || (git commit -m \"auto-sync: memory update\" && git push))) || true'
    }]
  });
}

fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
"
echo "✓ settings.json 同步配置已完成"

# 3. 自毁：引导完成后从仓库中移除自身
rm "$REPO_DIR/setup.sh"
set +e
cd "$REPO_DIR" && git add setup.sh && git commit -m "引导完成，移除 setup.sh" && git push 2>/dev/null
set -e

echo ""
echo "偏好同步已就绪，重启 Claude Code 即可。"
