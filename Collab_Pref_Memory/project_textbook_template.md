---
name: textbook-template-spec
description: 教材书籍录入的页面模板规范 — 4独立页、统一设计语言、多层级目录、结构化数据定义
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ee9a40e-bf2c-4dc7-be53-8f60a5eacbd1
---

## 分区命名
- 格式：`书名 - 作者`
- 位置：技能知识库 → 教材书籍 分区组下
- 实现：`make_section_name(title, author)` in [[textbook_template.py]]

## 页面架构（4 个独立一级页）
每个教材分区下创建 4 个页面，标题仅板块名：

| 页面标题 | 内容 | 排版要点 |
|---------|------|---------|
| 目录 | 多层级章节列表 | 深色文字+边框分隔、粗体左边线、缩进层级、页码右对齐点线填充 |
| 内容概述 | 基于真实内容的总结段落 | 居中窄栏(600px)，段落式 |
| 适用场景 | 基于技术内容推理的应用场景 | 圆形序号 + 场景名(h2) + 描述 |
| 关键技术名词 | 术语 + 解释片段 | 浅蓝(#9ab5d4)左边线 + 序号 + 术语 + 释义 |

## 目录多层级规范（通用，不固定层级数）
数据结构：`catalog = [(title, level, page_or_none), ...]`

| level | 含义 | 样式 |
|-------|------|------|
| 0 | 篇/部分分隔 | 深色(#1a3a5c) 17px 粗体居中 + 上下边框线(#3a5a8c) |
| 1 | 章标题 | 深蓝(#2c5aa0) 15px 粗体 + 左边框 3px #3a5a8c |
| 2 | 节标题 | #444 13px, margin-left 36px |
| 3+ | 小节 | #555 或 #999, 字号/缩进递增外推 |

- 所有颜色均为深色系，确保 OneNote 白色背景下可见
- 页码使用 `<table>` 标签实现：标题左对齐 + 点线填充 + 页码右对齐
- 超过 level 3 的层级自动外推（字号递减至 10px，缩进递增 22px/级）

## 统一设计规范
- 主色: #3a5a8c（深蓝灰）
- 辅色: #9ab5d4（浅蓝）
- 正文色: #333
- 字体: Microsoft YaHei, sans-serif
- 行高: line-height: 1.9
- h1: text-align: center, color: #3a5a8c, font-size: 20px, border-bottom: 1px solid #d0dff4
- h2: color: #3a5a8c, font-size: 16px
- 圆形序号徽标: 28px #3a5a8c
- 内容区: max-width: 600px, margin: 0 auto
- 每页底部: 数据来源声明（font-size: 12px, color: #aaa）

## 实现文件
- 模板引擎：`bridge/textbook_template.py` — 6 个公开函数，纯数据→HTML 转换
- 参考脚本：`scripts/add_textbook_isight.py` — 完整 BOOK_DATA + OneNote 写入逻辑

## 已知局限
- `add_textbook_isight.py` 仅"不存在时创建"，修改内容后重跑不会更新已有页面，需手动删页
- 模板不支持图片/表格嵌入（当前无此需求）
- 无输入校验，book_data 缺少字段会直接 KeyError

## 数据来源原则（CRITICAL）
- 所有内容必须来自真实来源（PDF/DOC原文提取、用户提供等）
- 无法获取真实数据时必须主动说明，严禁编造
- 内容概述：基于真实目录和正文总结，标注需人工审核
- 适用场景：基于书本技术内容推理，标注非教材内原文
- 关键技术名词：提取自教材正文，标注来源
