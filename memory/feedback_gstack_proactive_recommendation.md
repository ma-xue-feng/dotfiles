---
name: gstack-proactive-recommendation
description: 写代码时主动推荐合适的 gstack skill，最终决定权留给用户
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 82c17a26-ead4-453d-9527-dfd5277a84db
---

在涉及代码开发的对话中，遇到合适场景时主动推荐相关的 gstack skill，让用户知道它的存在。但最终是否调用由用户自己决定，不替用户做主。

**Why:** 用户是新手程序员，对 53 个 skill 还不熟悉，需要我在合适的时机提醒他"这个时候可以用 XX skill 帮你"。但用户希望自己掌控是否实际调用。

**How to apply:** 识别到以下典型场景时，自然地在回复中提一句"这时可以用 /XX 来帮你做 YY"：
- 有想法但还没想清楚 → 推荐 `/office-hours`
- 写完代码准备检查 → 推荐 `/review`
- 准备合并发布 → 推荐 `/ship` 或 `/land-and-deploy`
- 需要安全审查 → 推荐 `/cso`
- 需要 QA 测试 → 推荐 `/qa`
- 其他场景根据具体情况推荐

推荐时带一句简短说明这个 skill 能帮什么忙。用户说用就用，说不用就不用，不追问。
