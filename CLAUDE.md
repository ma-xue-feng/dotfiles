# Claude Code 个人偏好

## 语言
- 后续索引信息、回答信息全部使用中文

## 开发流程偏好
- 涉及代码开发时，在合适场景下主动推荐 gstack 的对应 skill（如 /office-hours、/review、/ship、/cso、/qa 等），但最终是否调用由用户自己决定

## 文件保存偏好
- 保存新 skill 或配置文件时，先给出建议并说明理由，再询问用户最终决定

## 偏好文件同步（手动触发）
- 偏好文件（记忆、CLAUDE.md等）通过 GitHub 仓库同步: https://github.com/ma-xue-feng/dotfiles

- **上传**：仅当用户明确要求"上传偏好"/"推送偏好"/"更新 GitHub 偏好"时，才在仓库目录执行 git add -A && git commit && git push
- **下载**：仅当用户明确要求"同步偏好"/"拉取偏好"/"下载偏好"时，才在仓库目录执行 git pull

## 识图能力

你的底层模型不具备原生识图能力。遇到图片时，**不要用 Read 工具**，改用 vision.js：

```
node ~/.claude/skills/vision/vision.js "<图片路径>" "用中文描述这张图片"
```

如果图片是 URL，加 --url 参数：

```
node ~/.claude/skills/vision/vision.js --url "<图片链接>" "用中文描述这张图片"
```

### 触发场景
- 用户分享图片路径（本地或网络 URL）
- 消息中出现 "Saved attachments:" 并列出图片
- 用户要求分析、描述、识别图片内容

### 配置信息
- 模型：qwen3.5-omni-plus-2026-03-15
- 服务：阿里云百炼 DashScope（按量付费）

