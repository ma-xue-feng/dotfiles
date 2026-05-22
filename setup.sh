#!/usr/bin/env bash
# Claude Code Skill 环境一键恢复
# 用法: git clone <dotfiles-repo> ~/dotfiles && cd ~/dotfiles && bash setup.sh
# 完成后自动删除 dotfiles 目录，不留多余文件。

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Claude Code Skill 环境一键恢复${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# ── 1. CLAUDE.md 偏好配置 ────────────────────────────
echo -e "${YELLOW}[1/3]${NC} 安装偏好配置 (CLAUDE.md)..."
mkdir -p "$HOME/.claude"
cp "$SCRIPT_DIR/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
echo -e "  ${GREEN}✓${NC} CLAUDE.md 已安装到 ~/.claude/"

# ── 2. superpowers 插件 ──────────────────────────────
echo ""
echo -e "${YELLOW}[2/3]${NC} 安装 superpowers 插件..."

if claude plugin install superpowers@claude-plugins-official 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} superpowers 已从官方市场安装"
else
    echo -e "  ${YELLOW}官方市场连接失败，尝试备用方式...${NC}"

    SUPER_DIR="$HOME/.claude/.temp-superpowers"
    rm -rf "$SUPER_DIR"
    git clone --depth 1 https://github.com/obra/superpowers.git "$SUPER_DIR" 2>/dev/null || {
        echo -e "  ${RED}✗ superpowers 下载失败，请检查网络后手动安装${NC}"
        echo -e "  ${RED}  手动安装命令: /plugin install superpowers@claude-plugins-official${NC}"
    }
    if [ -d "$SUPER_DIR" ]; then
        claude plugin marketplace add "$SUPER_DIR" 2>/dev/null
        claude plugin install superpowers@superpowers-dev 2>/dev/null && \
            echo -e "  ${GREEN}✓${NC} superpowers 已通过本地方式安装" || \
            echo -e "  ${RED}✗ superpowers 安装失败，请手动安装${NC}"
        rm -rf "$SUPER_DIR"
    fi
fi

# ── 3. gstack skills ──────────────────────────────────
echo ""
echo -e "${YELLOW}[3/3]${NC} 安装 gstack skills..."

GSTACK_DIR="$HOME/.claude/skills/gstack"

# 检查 bun
if ! command -v bun >/dev/null 2>&1; then
    echo "  安装 bun..."
    npm install -g bun 2>/dev/null || {
        echo -e "  ${RED}✗ bun 安装失败，请手动安装: npm install -g bun${NC}"
    }
fi

# 克隆 gstack
if [ -d "$GSTACK_DIR" ]; then
    echo "  gstack 目录已存在，更新中..."
    cd "$GSTACK_DIR" && git pull --depth 1 2>/dev/null || true
else
    mkdir -p "$(dirname "$GSTACK_DIR")"
    git clone --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR" 2>/dev/null || {
        echo -e "  ${RED}✗ gstack 下载失败，请检查网络后手动安装${NC}"
    }
fi

# 运行 setup（跳过 Chromium 下载）
if [ -f "$GSTACK_DIR/setup" ]; then
    cd "$GSTACK_DIR"

    # 临时绕过大体积 Chromium 下载
    sed -i.bak 's/^ensure_playwright_browser() {$/ensure_playwright_browser() {\n  return 0/' setup 2>/dev/null || true

    bash setup 2>/dev/null
    echo -e "  ${GREEN}✓${NC} gstack (53 skills) 已安装"

    # 恢复原始 setup 文件
    mv -f setup.bak setup 2>/dev/null || true
else
    echo -e "  ${RED}✗ gstack setup 脚本缺失${NC}"
fi

# ── 完成 ─────────────────────────────────────────────
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  全部完成！${NC}"
echo -e "${GREEN}  superpowers: 14 skills${NC}"
echo -e "${GREEN}  gstack:      53 skills${NC}"
echo -e "${GREEN}  偏好配置:    ~/.claude/CLAUDE.md${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "正在清理安装文件..."

# 自毁：删除整个 dotfiles 目录
cd "$HOME"
rm -rf "$SCRIPT_DIR"
echo "dotfiles 安装文件已清理。"
echo ""
