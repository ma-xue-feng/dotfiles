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
- 学术论文处理流程（scripts/add_paper.py）已固化
- 教材书籍处理流程（scripts/add_textbook_v2.py）已固化
- 工程软件分区固定列出主要 CAE 软件
- 「工业机器人文献」全部 18 页已迁移至「工业机器人」笔记本
- 本地备份：`F:\OneNote-Bridge v1.0\output\backup_before_migration\`

## 关键脚本
| 脚本 | 用途 |
|------|------|
| scripts/build_skill_kb_v3.py | 构建技能知识库整体结构（幂等） |
| scripts/add_paper.py | 学术论文录入：搜索→匹配分区→生成页面(v1/v3随机) |
| scripts/add_textbook_isight.py | 教材录入：PDF提取→结构化数据→4页模板→OneNote（参考实现） |

## 待办
- 职业知识库笔记本设计
- 批量格式统一工具
- 「工业机器人文献」笔记本需手动在 OneNote 中关闭

## 重要教训
- **严禁编造数据**：所有写入 OneNote 的数据必须来自真实来源（PDF 原文、用户提供等），无法获取时主动说明
- PDF 真实文献存放路径：`Chinese-language literature/`
