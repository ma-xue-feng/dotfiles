#!/usr/bin/env bash
# Claude Code dotfiles setup
# 在新电脑上运行这个脚本，一键恢复所有偏好配置

set -e

echo "=== 恢复 Claude Code 偏好配置 ==="

# 1. 用户级 CLAUDE.md
echo "[1/2] 安装 CLAUDE.md 到 ~/.claude/"
mkdir -p "$HOME/.claude"
cp "$(dirname "$0")/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
echo "  CLAUDE.md 已安装"

# 2. 记忆文件
echo "[2/2] 复制记忆文件到桌面备份"
mkdir -p "$HOME/Desktop/Claude-Config-Backup/memory"
cp "$(dirname "$0")/memory/"*.md "$HOME/Desktop/Claude-Config-Backup/memory/"
echo "  记忆文件已复制到桌面 Claude-Config-Backup 文件夹"

echo ""
echo "配置恢复完成。"
echo "如需在新的项目路径下使用记忆文件，请将 memory/ 目录下的文件"
echo "复制到项目的 .claude/projects/<项目路径>/memory/ 目录中。"
