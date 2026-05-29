---
name: confirmation-mandatory
description: 论文/教材录入脚本的确认环节必须由用户手动交互，严禁用管道输入绕过
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f82a69b3-e5ad-49b0-b681-eadcf6f71160
---

## 规则
论文模板和教材模板的确认环节**必须**由用户在终端手动输入 y/n，严禁使用 `echo "y" | python script.py` 等管道方式绕过。

**Why:** 论文/教材数据写入 OneNote 涉及真实学术内容，用户需要在确认报告中审阅解析结果（标题、作者、关键词、章节、分区匹配等），在 API 调用前发现潜在错误。

**How to apply:** 
- 脚本中使用 `_confirm_interactive()` 函数（定义于 `scripts/add_paper.py`），该函数通过 `sys.stdin.isatty()` 检测交互式终端
- 收到管道输入时打印错误后 `sys.exit(1)`，不执行任何写入操作
- 运行此类脚本时，**必须**直接用 `python script.py` 而不用管道重定向，等待用户在终端确认
- Claude Code 环境下（Bash 工具无 TTY），先展示确认报告 → 用户口头确认 → 再加 `--yes` 参数执行
- 此规则适用于：`scripts/add_paper.py`、`scripts/batch_add_papers.py`
- 批量流程必须**逐篇确认**（非一次性展示全部），每篇论文独立展示报告并等待确认后再处理下一篇

## 架构（2026-05-29 重构）
- `write_single_paper()` 函数（`scripts/add_paper.py`）封装单篇论文的完整流程：展示报告 → 确认 → 创建分区/页面
- `scripts/add_paper.py` 支持 `--data <json文件>` 加载外部论文数据（JSON 含单个 PAPER_DATA 对象）
- `scripts/batch_add_paper.py` 支持 `--data <json文件>` 加载论文列表（JSON 含 `{"papers": [...]}` 数组），逐篇调用 `write_single_paper()`
- `scripts/batch_add_paper.py` 支持 `--dir <PDF目录>` 扫描 PDF 并生成模板 JSON（不写入 OneNote）
- 已删除 `scripts/_batch_3papers.py`（硬编码数据，被通用方案替代）

## 相关文件
- 实现：`scripts/add_paper.py` 中的 `_confirm_interactive()` 和 `write_single_paper()` 函数
- 受保护的脚本：`scripts/add_paper.py`、`scripts/batch_add_papers.py`
