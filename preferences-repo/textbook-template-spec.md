---
name: textbook-template-spec
description: 教材书籍录入的页面模板规范 — 4独立页、统一设计语言、多层级目录、结构化数据定义（2026-05-29同步自论文模板）
metadata: 
  node_type: memory
  type: project
  originSessionId: a384df81-d9ec-46b8-ae99-7d15df5440af
---

## 分区命名
- 格式：`书名 - 作者`
- 位置：技能知识库 → 教材书籍 分区组下
- 实现：`make_section_name(title, author)` in [[onenote-bridge-project]]

## 页面架构（4 个独立一级页）
每个教材分区下创建 4 个页面：

| 页面标题 | 内容 | 排版要点 |
|---------|------|---------|
| 目录 | 多层级章节列表 | 无页面h1标题，直接列出章/节；深色文字+边框分隔、粗体左边线、缩进层级、页码右对齐点线填充 |
| 内容概述 | 逐章概述 | 格式：`&emsp;&emsp;<b>第X章 标题</b> — 正文`，每章一条，`"".join()`拼接无空行 |
| 适用场景 | 基于技术内容推理的应用场景 | 数字序号(1. 2. 3.) + 左对齐加粗场景名 + `&emsp;&emsp;`首行缩进描述 |
| 关键技术名词 | 术语 + 解释片段 | 数字序号(1. 2. 3.) + 左对齐加粗术语 + `&emsp;&emsp;`首行缩进解释 |

## 全局格式规范（同步自论文模板）
- **页面宽度**：`<table style="width:1400px;"><tr><td style="width:1400px;">` 包裹全部内容
- **所有样式内联**：无 `<style>` 标签，无 CSS 类（OneNote 会过滤）
- **无 `line-height`**：OneNote 不支持，改用 `margin-top`/`margin-bottom` 控制段间距
- **显式 font-size**：所有文字元素必须显式设置（OneNote 不支持 body 继承 font-size）
- **字号单位**：全部使用 `pt`（非 `px`）
- **首行缩进**：`&emsp;` HTML 实体（OneNote 转为 U+2003 EM SPACE 保留）
- **无空行**：`"".join()` 拼接段落级元素
- **深色系**：所有文字颜色 >= `#555`（背景为浅色/白色）

## 字体/颜色规范

| 元素 | 字号 | 颜色 | 段间距 |
|------|------|------|--------|
| h1 页面标题 | 20pt | #3a5a8c | margin-top:20pt;margin-bottom:10pt + 底部边框 #d0dff4 |
| 正文 p | 16pt | 默认(黑) | margin-top:10pt;margin-bottom:10pt |
| 脚注声明 | 12pt | #666 | margin-top:20pt |
| 场景名/术语名 | 15pt-16pt | #1a3a5c | margin-bottom:4pt-6pt |
| 术语解释 | 14pt | #444 | — |

## 目录多层级规范（通用，不固定层级数）
数据结构：`catalog = [(title, level, page_or_none), ...]`

| level | 含义 | 样式 |
|-------|------|------|
| 0 | 篇/部分分隔 | #1a3a5c 17pt 粗体居中 + 上下边框线(#3a5a8c) |
| 1 | 章标题 | #2c5aa0 15pt 粗体 + 左边框 3px #3a5a8c |
| 2 | 节标题 | #444 13pt, margin-left 36px |
| 3+ | 小节 | #555, 字号/缩进递增外推（最深至10pt, #555） |

- 页码使用 `<table>` 标签实现：标题左对齐 + 点线填充 + 页码右对齐(#555)
- 目录页**无**页面标题 h1（直接从第一条目录开始）

## 内容概述数据结构（支持两种格式）
```python
# 章节式（推荐）
"summary": [
    {"heading": "第1章 标题", "body": "本章概述内容"},
    ...
]

# 简单段落式（向后兼容）
"summary": ["段落1", "段落2", ...]
```

## 适用场景/关键术语数据结构
```python
"scenarios": [("场景名", "描述文本"), ...]
"terms": [("术语名", "解释文本"), ...]
```

## 实现文件
- 模板引擎：`bridge/textbook_template.py` — 公开函数 `make_catalog`, `make_summary`, `make_scenarios`, `make_terms`, `make_section_name`, `make_all_pages`
- 参考脚本：`scripts/add_textbook_isight.py` — Isight教材完整数据示例
- 测试脚本：`scripts/add_textbook_robotics.py` — 机器人学导论教材（含PDF TOC自动提取）

## 已知局限
- `add_textbook_isight.py` / `add_textbook_robotics.py` 仅"不存在时创建"，修改内容后重跑需先手动删页
- 模板不支持图片/表格嵌入（当前无此需求）
- 无输入校验，book_data 缺少字段会直接 KeyError
- 扫描版PDF（Pdg2Pic/FreePic2Pdf）无法提取正文文字，仅能提取内嵌TOC

## 数据来源原则（CRITICAL）
- 所有内容必须来自真实来源（PDF/DOC原文提取、网络公开信息等）
- 无法获取真实数据时必须主动说明，严禁编造
- 内容概述：基于真实目录和正文逐章总结，标注需人工审核
- 适用场景：基于书本技术内容推理，标注非教材内原文
- 关键技术名词：提取自教材正文，标注来源
