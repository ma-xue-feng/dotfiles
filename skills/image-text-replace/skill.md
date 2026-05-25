---
name: image-text-replace
description: 图片文字替换工具。在 PNG 图片的指定区域用背景色覆盖旧文字，渲染新文字，自动版本号递增保存。适用于软件截图、UI 界面等需要修改标题/标签文字的场景。
metadata:
  type: skill
  version: "1.0"
  author: maxf
---

# 图片文字替换 Skill

## 功能

替换 PNG 图片中指定区域的文字，保持字体大小、颜色与周围元素一致。

## 调用方式

```
node ~/.claude/preferences-repo/skills/image-text-replace/replace-text.js \
  --input "<原图路径>" \
  --old-text "<旧文字>" \
  --new-text "<新文字>" \
  [--font-family "<字体>" ] \
  [--font-size <字号>] \
  [--text-color "<颜色>"] \
  [--bg-color "<背景色>"] \
  [--erase-x <x>] [--erase-y <y>] [--erase-width <w>] [--erase-height <h>] \
  [--text-x <x>] [--text-y <y>] \
  [--text-anchor "middle"|"start"|"end"] \
  [--skip-verify]
```

## 参数说明

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `--input` | 是 | - | 原图路径（支持绝对/相对路径） |
| `--old-text` | 否 | - | 要替换的旧文字（仅用于记录，不影响处理） |
| `--new-text` | 是 | - | 新文字内容 |
| `--font-family` | 否 | `Microsoft YaHei, SimHei, sans-serif` | CSS font-family，支持中文字体 |
| `--font-size` | 否 | `15` | 字号（px） |
| `--text-color` | 否 | `white` | 文字颜色（CSS 颜色值） |
| `--bg-color` | 否 | `rgb(41,87,160)` | 覆盖区域的背景色 |
| `--erase-x` | 否 | `420` | 覆盖区域左上角 X 坐标 |
| `--erase-y` | 否 | `5` | 覆盖区域左上角 Y 坐标 |
| `--erase-width` | 否 | `830` | 覆盖区域宽度 |
| `--erase-height` | 否 | `23` | 覆盖区域高度 |
| `--text-x` | 否 | `830` | 新文字锚点 X 坐标 |
| `--text-y` | 否 | `22` | 新文字锚点 Y 坐标（基线） |
| `--text-anchor` | 否 | `middle` | 文字对齐方式：`start`/`middle`/`end` |
| `--skip-verify` | 否 | `false` | 跳过 vision.js 验证步骤 |

## 输出规则

- 输出文件命名：`{原文件名} -{主版本}.{次版本}.png`
- 首次生成：`原名字 -1.0.png`
- 同版本迭代：`原名字 -1.1.png`、`原名字 -1.2.png`...
- 大版本递增：`原名字 -2.0.png`、`原名字 -3.0.png`...
- 新文件与原始文件放在同一目录

## 工作流程

1. 读取原图，获取尺寸
2. 创建 SVG overlay（覆盖矩形 + 新文字）
3. 使用 sharp 合成输出
4. 用 vision.js 验证结果（除非 `--skip-verify`）

## 依赖

- Node.js
- sharp（全局安装）：`npm install -g sharp`
- NODE_PATH 需包含全局 node_modules 路径

## 示例

```bash
# 替换软件截图中的标题文字
node ~/.claude/preferences-repo/skills/image-text-replace/replace-text.js \
  --input "D:/截图/优化结果.png" \
  --old-text "两变量两约束的二次规划问题求解" \
  --new-text "18杆桁架优化问题求解"
```

## 适用场景

- 软件界面截图的标题/标签文字修改
- UI 原型图中的文字替换
- 批量图片文字更新（配合脚本循环调用）
