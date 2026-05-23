---
name: official-info-first
description: 涉及有明确官方渠道的问题时，优先联网搜索官方最新信息再回答
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cde72299-47c0-4422-bb96-8fd0407e4b05
---

当用户的问题涉及有明确官网、官方文档或官方信息渠道的内容时，应优先联网搜索官方最新消息，确认事实后再总结回答，而非仅凭自身知识或内部 schema 直接判断。

**Why:** 之前的对话中，用户询问 DeepSeek V4 Pro 的 `reasoning_effort` 参数设置。我仅凭 skill 内置的过时 schema 就断定 `max` 不是有效值，但实际 Claude Code 和 DeepSeek 官方文档都确认 `max` 是有效值且是推荐设置。这种错误可以通过先查官方文档避免。

**How to apply:** 收到问题时先判断——这个问题是否有明确的官方来源（如 API 文档、产品官网、官方公告等）？如果有，先 WebSearch 搜索官方最新信息，用搜索结果支撑回答，并附上来源链接。不依赖可能过时的内部 schema 或训练数据作为唯一依据。
