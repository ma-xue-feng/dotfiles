---
name: onenote-bridge-project
description: OneNote-Bridge v1.0 项目概览 — 通过 MS Graph API 管理 OneNote 笔记本的 Python 工具
metadata: 
  node_type: memory
  type: project
  originSessionId: a384df81-d9ec-46b8-ae99-7d15df5440af
---

## 项目位置
`F:\OneNote-Bridge v1.0`

## 认证状态
- Azure AD 设备码流程（bridge/auth.py），client_id: 429fca40-b1f7-47a7-8fdf-1468299bd9ba
- Token 已缓存于 `~/.onenote-bridge/token.json`，无需重复登录

**Why:** 项目依赖 MS Graph API 进行 OneNote 操作，认证状态决定脚本是否可直接运行。
**How to apply:** 操作 OneNote 前先确认 token 是否有效；过期时引导用户重新认证。

## 核心能力
- Microsoft Graph API 封装（bridge/graph_client.py）：笔记本/分区组/分区/页面的完整 CRUD
- HTML 渲染：formatters/to_onetml.py（OneNote 兼容 HTML）
- 模板系统：templates/ 目录 + bridge/registry.py

## 当前 OneNote 笔记本
| 笔记本 | ID |
|--------|-----|
| 工业机器人 | 0-28063929A23BBA9D!1173 |
| 深圳十沣学习笔记 | 0-28063929A23BBA9D!se5c06f877d5b47d7aea5ba7094fc4db2 |
| 阅读论文笔记 | 0-28063929A23BBA9D!1077 |
| 雪峰 的笔记本 | 0-28063929A23BBA9D!1071 |

## API 已知限制
- **子页（Subpage）不支持**：MS Graph 不支持创建/修改父子页面关系
- **分区组内分区无法删除/重命名**：PATCH/DELETE 对 sectionGroup 下分区无效
- **delete_notebook 对个人 Microsoft 账户不生效**：删除操作需手动在 OneNote 客户端完成
- **命名禁用字符**：`? * \ / : < > | &# " ' % ~`，`/` 需替换

## 当前工作进度
- 笔记本「技能知识库」结构已建立，含学术论文/工程软件/教材书籍三个分区组
- 学术论文处理流程（scripts/add_paper.py）已固化，新增确认报告机制（分区匹配评分 + y/n 确认）
- 教材书籍处理流程（scripts/add_textbook_v2.py）已固化
- 工程软件分区固定列出主要 CAE 软件
- 「工业机器人文献」全部 18 页已迁移至「工业机器人」笔记本
- 本地备份：`F:\OneNote-Bridge v1.0\output\backup_before_migration\`

### 学术论文分区状态（2026-05-30）

| 分区 | 论文 | 来源 |
|------|------|------|
| **工业机器人-优化设计** | RB50机器人结构设计与仿真分析 | 任正军，华中科技大学硕士，2014 |
| | 大尺度构件重载高精加工机器人本体设计与性能提升关键技术 | 丰飞等，《中国机械工程》2021 |
| | 高速重载码垛机器人动态特性分析及结构优化研究 | 马清伍，哈工大硕士，2015 |
| **工业机器人-模态分析** | 串联机器人模态仿真与实验 | 陈昊然等，《制造业自动化》2023 |
| **工业机器人-运动学控制** | 高速重载机械臂优化设计与轨迹规划及振动抑制方法研究 | 肖永强，哈工大博士，2012 |
| **多学科优化-代理模型技术** | 基于深度学习的岩石变形破坏智能识别 | 利铭，北方工业大学硕士，2023 |

共 6 篇论文，4 个分区。数据文件：`data/4papers.json`（含前 5 篇的 PAPER_DATA）、`data/paper_岩石变形破坏智能识别.json`（第 6 篇）。

## OneNote HTML 兼容性发现
- **不支持** `text-indent`、`line-height` CSS 属性，OneNote 会直接过滤掉
- **不支持** `data-absolute-enabled` + `position:absolute` div 的 `width` 控制，OneNote 创建页面时会强制覆盖为 720px
- **支持** `<table>` + `<td style="width:1400px;">` 方案控制页面内容宽度，td width 值会被保留
- **font-size 只能在 inline 元素上生效**：`<p style="font-size:16pt;">` 会被 OneNote 转为 `<p><span style="font-size:16pt;">`，同理 `<li>` 也是如此。不能依赖 body 或 block 元素继承 font-size
- **支持** `margin-top`/`margin-bottom` 精确控制段间距（pt 值被保留）
- **支持** `&emsp;` HTML 实体（缩进）、`padding`、`border`、`background`、`color`

## 论文模板最终状态（2026-05-29，已稳定）
- **页面宽度**：`<table style="width:1400px;"><tr><td style="width:1400px;">` 包裹全部内容，OneNote 保留 td 宽度值
- **body**：仅设 `font-family:'Times New Roman','微软雅黑',serif;`，font-size 被 OneNote 强制覆盖为 11pt，不能依赖 body 继承
- **所有内容元素显式 font-size**：`<p>`、`<li>` 均设 `font-size:16pt;`，OneNote 会自动将其移至内部 `<span>`
- **标题 h1/h2**：`font-size:20pt;margin-top:20pt;margin-bottom:10pt;`
- **摘要**：按 `<br/>` 分段，每段 `<p style="font-size:16pt;margin-top:5pt;margin-bottom:5pt;">&emsp;&emsp;{text}</p>`，2字符缩进
- **关键词**：`_build_tags` 使用 ①②③ 序号 + `\t\t\t\t` 分隔 + `；` 结尾，`<p style="font-size:16pt;">` 包裹
- **研究亮点**：`<li style="font-size:16pt;margin-top:10pt;margin-bottom:10pt;">{text}；</li>`，每项末尾中文分号
- **正文概要**：`<p style="font-size:16pt;margin-top:10pt;margin-bottom:10pt;"><b>{heading}</b> — {body}</p>`，`"".join()` 拼接无 `<br/>`
- **参考文献**：`<p style="font-size:12pt;">{r}</p>`，与正文 16pt 区分，`"".join()` 无空行
- OneNote 不支持 `line-height` 和 `text-indent`，通过 `margin`、`&emsp;`、`padding` 变通实现

## 关键脚本
| 脚本 | 用途 |
|------|------|
| scripts/build_skill_kb_v3.py | 构建技能知识库整体结构（幂等） |
| scripts/add_paper.py | 学术论文录入：支持 `--data <json>` 单篇模式，确认报告→匹配分区→生成页面 |
| scripts/batch_add_papers.py | 批量论文：`--data` 模式逐篇确认写入，`--dir` 模式扫描PDF生成模板JSON |
| scripts/add_textbook_isight.py | 教材录入：PDF提取→结构化数据→4页模板→OneNote（参考实现） |

### 分区匹配算法（已修复）
- **Bigram 权重**: 0.25（从 0.5 降低，减少短关键词误匹配）
- **匹配阈值**: 2.0（从 1.0 提高，避免"机器"等常见 bigram 误匹配）
- **`target_section` 字段**: PAPER_DATA 中设置此字段可绕过匹配算法，直接指定目标分区

## 技能文档
- [[onenote-paper-template-skill]] — 论文模板引擎技能，含 4 套 HTML 变体、bigram 分区匹配算法、PAPER_DATA schema

## 待办
- 职业知识库笔记本设计
- 批量格式统一工具
- 「工业机器人文献」笔记本需手动在 OneNote 中关闭

## 重要教训
- **严禁编造数据**：所有写入 OneNote 的数据必须来自真实来源（PDF 原文、用户提供等），无法获取时主动说明
- PDF 真实文献存放路径：`Chinese-language literature/`
