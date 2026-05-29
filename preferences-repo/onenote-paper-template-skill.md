---
name: onenote-paper-template
description: "Use when adding academic papers to OneNote via the OneNote-Bridge project (F:\\OneNote-Bridge v1.0), understanding the paper HTML template variants, configuring the keyword-to-section matching algorithm, or troubleshooting paper page generation with MS Graph API"
metadata: 
  node_type: memory
  originSessionId: a662b7bb-6d2e-471a-9a56-ce2416def9f1
---

# OneNote 论文模板引擎

## Overview

将结构化论文数据（标题、摘要、关键词、正文概要、参考文献等）渲染为 OneNote 兼容 HTML，通过 MS Graph API 在「技能知识库 > 学术论文」分区组下自动创建页面，并基于关键词 bigram 相似度智能匹配目标分区。

## When to Use

- 向 OneNote「技能知识库」笔记本录入新学术论文
- 修改论文页面的视觉风格（4 套 HTML 变体）
- 调整关键词→分区的匹配阈值或逻辑
- 理解 PAPER_DATA 的完整字段 schema
- 排查论文页面在 OneNote 中渲染异常

**不适用于：** 教材书籍录入（用 [[onenote-textbook-template]]）、通用页面创建（用 tools/create_page.py）

## 核心架构

```
PAPER_DATA (dict/JSON) → write_single_paper() → _display_report() → _confirm_interactive()
→ match_section() → GraphClient.create_page() → OneNote 页面
```

**关键文件：**

| 文件 | 作用 | 是否实际使用 |
|------|------|-------------|
| `scripts/add_paper.py` | 主脚本，含 HTML 模板 + 匹配算法 + write_single_paper() | **是（核心）** |
| `scripts/batch_add_papers.py` | 通用批量录入，支持 --data 和 --dir 模式 | **是（批量场景）** |
| `templates/paper.yaml` | 通用模板字段定义（配合 OneTMLFormatter） | **否（未使用于论文流程）** |
| `formatters/to_onetml.py` | 通用 OneNote HTML 格式化器 | **否（add_paper.py 内嵌模板）** |

> add_paper.py 使用内嵌的 4 套 HTML 模板字符串，不依赖 paper.yaml 或 to_onetml.py。

### write_single_paper() 函数

封装单篇论文的完整处理流程，供单篇和批量脚本复用：

```python
def write_single_paper(paper_data, client, sg_paper_id, sections, section_names, force_yes=False):
    """处理单篇论文：展示报告 → 确认 → 创建分区/页面。
    sections 和 section_names 会被原地修改（创建新分区时追加）。
    Returns: (result_dict, cancelled)
    """
```

- `sections` / `section_names` 是可变列表，创建新分区时会原地追加，确保后续论文能看到最新分区
- 返回 `(result_dict, cancelled)` 元组，调用方据此判断成功/取消

## PAPER_DATA Schema

编辑 `scripts/add_paper.py` 底部第 318-367 行的 `PAPER_DATA` 字典：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | str | **是** | 论文标题，作为页面 H1 和 OneNote 页面标题 |
| `authors` | str | 否 | 作者，如 "张三，李四" |
| `journal` | str | 否 | 期刊信息，如 "《机械工程学报》2024年第08期" |
| `abstract` | str | **是** | 摘要正文，渲染在带背景色的区块中。**必须从 PDF 原文逐字复制，严禁总结概括** |
| `keywords` | list[str] | 否 | 关键词列表，**同时用于分区匹配** |
| `highlights` | list[str] | 否 | 研究亮点，渲染为 `<ul>` 列表 |
| `body_sections` | list[dict] | 否 | 正文概要，每项 `{heading, body}` |
| `references` | list[str] | 否 | 参考文献，每项渲染为 `<p>` |
| `citation` | str | 否 | 引用格式，如 "张三, 李四. xxx[J]. 机械工程学报, 2024." |
| `cite_stats` | str | 否 | 引用统计信息 |
| `domain` | str | 推荐 | 行业领域，分区匹配失败时用于自动命名（格式：`{domain}-{product}`） |
| `product` | str | 推荐 | 产品/方法描述，分区匹配失败时用于自动命名 |
| `fallback_section` | str | 否 | 手动指定分区名（当 domain/product 不适用时） |

缺失的可选字段会导致对应区域渲染为空，视觉上出现空标题段落。建议至少提供 `highlights`、`body_sections`、`references`、`citation`。

## 4 套 HTML 视觉变体

所有变体共享相同页面结构（标题→作者期刊→摘要→关键词→亮点→正文概要→参考文献→引用信息），仅在配色和边框风格上有差异：

| 变体 | 风格 | 配色特征 | 当前状态 |
|------|------|---------|---------|
| **V1** 极简灰白 | 左侧灰色竖线 + 浅灰背景 | `#bbb` / `#fafafa` | 已激活 |
| **V2** 暖调学术 | 金色系左边框 + 暖黄背景 | `#c4963a` / `#fdfaf3` | 未激活 |
| **V3** 专业蓝灰 | 蓝色底边线 + 浅蓝背景 | `#3a7bd5` / `#f5f8fc` | 已激活 |
| **V4** 高对比色块 | 深色标题栏 + 多色分区 | `#555`/`#6b8e23`/`#b8860b` | 未激活 |

**激活全部变体：** 修改 add_paper.py 第 194-197 行：

```python
TEMPLATES = {
    "v1": TEMPLATE_V1,
    "v2": TEMPLATE_V2,
    "v3": TEMPLATE_V3,
    "v4": TEMPLATE_V4,
}
```

变体在 `make_paper_html()` 中通过 `random.choice(list(TEMPLATES.keys()))` 随机选择，每次创建页面时随机。

## 分区匹配算法

`match_section(keywords, existing_sections)` 的工作方式：

1. 对每个关键词与每个已有分区名计算得分
2. **子串匹配**（一方包含另一方）：得分 +3
3. **Bigram 重合**（双字符滑动窗口）：每个公共 bigram 得分 +0.5
4. 取最高分，**阈值 ≥ 1.0** 才匹配，否则返回 None
5. 匹配失败时创建新分区，命名为 `"{domain}-{product}"`

**中文 bigram 示例：** 关键词 "故障诊断" 的 bigram 为 `{"故障", "障诊", "诊断"}`，每个汉字计为一个字符。

**二次检查：** 新建分区前会先检查同名分区是否已存在（防止上次运行时已创建但匹配得分不够的情况）。

## 硬编码常量

`main()` 函数中以下名称是硬编码的，需确保 OneNote 中存在对应实体：

| 行号 | 值 | 含义 |
|------|-----|------|
| 266 | `"技能知识库"` | 目标笔记本 displayName |
| 268 | `"学术论文"` | 目标分区组 displayName（位于技能知识库下） |

如果笔记本或分区组不匹配，`next()` 会抛出 `StopIteration`。

## 使用流程

### 1. 准备论文数据

从 PDF 原文提取所有字段，编辑 `add_paper.py` 底部的 `PAPER_DATA`。**严禁编造数据**，所有内容必须来自真实来源。**摘要必须从 PDF 逐字复制原文，禁止总结、概括、改写**——即使原文摘要较长也应完整保留。

### 2. 运行脚本

```bash
cd "F:\OneNote-Bridge v1.0"
python scripts/add_paper.py
```

### 3. 认证（首次或 token 过期时）

脚本弹出设备码认证提示，在浏览器中打开 `https://microsoft.com/devicelogin` 输入验证码。Token 缓存于 `~/.onenote-bridge/token.json`。

### 4. 确认报告（新增）

认证成功后，脚本会显示一份格式化的信息确认报告，包含以下四个部分：

- **目标位置**：笔记本和分区组名称
- **现有分区**：「学术论文」分区组下已有的所有分区（带编号）
- **解析文章信息**：标题、作者、期刊/来源、关键词、正文概要（章数+章节目录链）、参考文献（条数+类型分布）、引文格式
- **分区匹配结果**：每个已有分区的 bigram 相似度评分、匹配状态（✓/—），以及最终决策（使用已有分区 or 创建新分区）

参考输出示例：

```
══════════════════════════════════════════════════════════
  论文信息确认
══════════════════════════════════════════════════════════

【目标位置】
  笔记本：技能知识库
  分区组：学术论文

【「学术论文」分区组下现有分区】
  ① 机器人-六轴机器人

【解析文章信息】
  标题        RB50机器人结构设计与仿真分析
  作者        任正军
  期刊/来源    华中科技大学硕士学位论文（机械电子工程），2014年1月
  关键词      工业机器人、结构设计、动力学仿真、有限元分析、模态分析
  正文概要    5 章（1 绪论 → 2 RB50机器人结构设计 → ... → 5 总结与展望）
  参考文献    45 条（含期刊20篇，图书8篇，会议4篇，学位论文1篇，网络资源2篇）
  引文格式    任正军. RB50机器人结构设计与仿真分析[D]. 武汉: 华中科技大学, 2014.

【分区匹配结果】
  关键词与各分区 bigram 相似度：
    机器人-六轴机器人              评分  2.0    —
    其他分区                      评分  0.5    —

  → 未匹配到合适分区，将创建新分区：「机器人-RB50」

══════════════════════════════════════════════════════════

是否确认创建？(y/n):
```

输入 `y` 继续，输入 `n` 取消操作。此确认步骤让用户在真正调用 MS Graph API 之前核验所有解析数据。

### 5. 验证结果

脚本输出页面 ID 和 OneNote Web URL，在浏览器中打开 URL 确认渲染效果。

### 批量录入

使用 `scripts/batch_add_papers.py`，支持两种模式：

**--data 模式**（从 JSON 加载已结构化的论文数据）：
```bash
cd "F:\OneNote-Bridge v1.0"
python scripts/batch_add_papers.py --data data/papers.json
```
JSON 格式：`{"papers": [{...PAPER_DATA...}, ...]}` 或直接论文数组 `[{...}, ...]`。
流程：逐篇展示确认报告 → 逐篇确认 → 逐篇写入。每篇确认后方处理下一篇。

**--dir 模式**（扫描 PDF 目录，生成模板 JSON）：
```bash
python scripts/batch_add_papers.py --dir "F:\path\to\pdfs"
```
扫描目录下所有 .pdf 文件，提取前3页文本，生成 `_papers_template.json` 模板文件。
**不写入 OneNote**，需用户/Claude 完善 JSON 中论文字段后，再用 --data 模式执行写入。

**单篇录入**（从 JSON 加载单篇）：
```bash
python scripts/add_paper.py --data data/single_paper.json
```
JSON 包含单个 PAPER_DATA 对象（非数组）。也可直接编辑脚本底部 `PAPER_DATA` 变量后运行。

## Common Mistakes

| 问题 | 原因 | 修复 |
|------|------|------|
| 页面有空章节（空标题下无内容） | `highlights`/`body_sections`/`references` 未提供 | 从 PDF 补充对应字段，或确认论文确实无该内容 |
| `StopIteration` 异常 | 笔记本 "技能知识库" 或分区组 "学术论文" 不存在 | 先运行 `build_skill_kb_v3.py` 创建结构 |
| 分区匹配到不相关的分区 | Bigram 算法对短关键词区分度低 | 调整阈值（第 251 行 `1.0`），或手动指定 `fallback_section` |
| 尝试使用 paper.yaml 字段名 | paper.yaml 定义的是 `key_findings`/`source_url`/`tags`，与 PAPER_DATA schema 不同 | paper.yaml **不用于论文流程**，PAPER_DATA 字段名以 add_paper.py 为准 |
| 摘要内容被改写/缩略 | 摘要未从 PDF 原文逐字复制，而是人工概括 | **摘要必须与原文完全一致**，逐字从 PDF 复制，保留原文段落结构和用词 |
| 设置 text-indent/line-height 无效 | OneNote 不支持这两个 CSS 属性，会直接过滤 | 缩进用 `&emsp;&emsp;` HTML 实体，行距用 `<br>` 标签控制 |
| Token 过期但脚本无提示 | GraphClient 不区分 401 和其他错误 | 手动运行 `bridge/auth.py` 重新获取 token |
