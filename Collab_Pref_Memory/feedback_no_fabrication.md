---
name: no-data-fabrication
description: 禁止编造数据 — 无法获取真实数据时必须主动说明，不能猜测或伪造
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ec0bbb6e-6acc-4369-9520-72354c55ffcc
---

写入任何外部系统（OneNote、数据库等）的数据必须来自真实来源，不能编造。

**Why:** 曾将在 add_paper.py 的 PAPER_DATA 示例中编造了摘要、关键词、参考文献等内容写入 OneNote，用户发现与实际论文严重不符。这破坏了信任。

**How to apply:** 任何涉及写入外部数据时：
- 必须确认数据来源（PDF 原文、用户提供、API 返回等）
- 无法获取真实数据时，主动告知用户并询问，不能推测、填充、伪造
- 示例/模板数据必须标注为占位符（如 `"TODO: 请填入实际摘要"`），不能填入看起来像真的假数据
