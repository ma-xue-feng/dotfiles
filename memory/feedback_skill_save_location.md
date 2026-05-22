---
name: skill-save-location-consultation
description: 保存新 skill 时先给建议再询问用户最终决定
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 82c17a26-ead4-453d-9527-dfd5277a84db
---

保存新 skill 或类似配置时，先给出自己的建议并说明理由，再询问用户最终决定。不能不问就直接保存，也不能只问不给建议。

**Why:** 用户希望参与决策过程，不是被动接受。存放位置也影响团队协作（项目目录可 git 共享 vs 用户目录只有自己能用）。

**How to apply:** 识别到需要保存 skill/配置时，先判断推荐项目目录还是用户目录，给出理由，再请用户确认。每次都要问，不因为以前问过就跳过。
