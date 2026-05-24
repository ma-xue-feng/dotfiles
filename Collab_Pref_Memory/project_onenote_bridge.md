---
name: onenote-bridge-project
description: OneNote-Bridge v1.0 项目概览 — 通过 MS Graph API 管理 OneNote 笔记本的 Python 工具
metadata: 
  node_type: memory
  type: project
  originSessionId: dce79f43-34fa-4a7e-91a5-dd517db329bf
---

## 项目位置
`/f/OneNote-Bridge v1.0/`

## 核心能力
- Microsoft Graph API 封装（bridge/graph_client.py）：笔记本/分区组/分区/页面的完整 CRUD
- 认证：Azure AD 设备码流程（bridge/auth.py），token 缓存于 `~/.onenote-bridge/token.json`
- HTML 渲染：formatters/to_onetml.py（OneNote 兼容 HTML）
- 模板系统：templates/ 目录 + bridge/registry.py

## API 已知限制
- **子页（Subpage）不支持**：MS Graph 不支持创建/修改父子页面关系
- **分区组内分区无法删除/重命名**：PATCH/DELETE 对 sectionGroup 下分区无效
- **命名禁用字符**：`? * \ / : < > | &# " ' % ~`，`/` 需替换

## 当前工作进度
- 笔记本「技能知识库」结构已建立，含学术论文/工程软件/教材书籍三个分区组
- 学术论文处理流程（scripts/add_paper.py）已固化
- 教材书籍处理流程（scripts/add_textbook_v2.py）已固化
- 工程软件分区固定列出主要 CAE 软件

## 关键脚本
| 脚本 | 用途 |
|------|------|
| scripts/build_skill_kb_v3.py | 构建技能知识库整体结构（幂等） |
| scripts/add_paper.py | 学术论文录入：搜索→匹配分区→生成页面(v1/v3随机) |
| scripts/add_textbook_isight.py | 教材录入：PDF提取→结构化数据→4页模板→OneNote（参考实现） |

## 待办
- 职业知识库笔记本设计
- 批量格式统一工具
- ~~文献搜索工具（lib.jingshi2015.com）集成~~ — 已放弃，京师图书馆为代理平台无法程序化检索

## 重要教训
- **PAPER_DATA 等示例数据严禁编造**：add_paper.py 中之前的摘要/关键词/参考文献为 AI 编造，用户发现后修正。今后所有写入 OneNote 的数据必须来自真实来源（PDF 原文、用户提供等），无法获取时主动说明。
- PDF 真实文献存放路径：`Chinese-language literature/`
