# 偏好文件同步检查清单

## 仓库: https://github.com/ma-xue-feng/dotfiles

## 文件结构
```
preferences-repo/
├── CLAUDE.md                          # 全局用户指令
├── MEMORY.md                          # 统一记忆索引（8 条）
├── .gitignore                         # 排除敏感文件
├── Collab_Pref_Memory/                # 通用协作偏好（5 条）
│   ├── feedback_skill_save_location.md
│   ├── feedback_gstack_proactive_recommendation.md
│   ├── feedback_official_info_first.md
│   ├── feedback_manual_sync_preferences.md
│   └── feedback_no_fabrication.md
├── Project_Memory/
│   └── OneNote_Proj/                  # OneNote 项目记忆（3 条）
│       ├── feedback_onenote_formatting.md
│       ├── project_onenote_bridge.md
│       └── project_textbook_template.md
└── skills/
    └── vision/                        # 识图能力（无 API 密钥）
        ├── .gitignore
        ├── package.json
        └── vision.js
```

## 同步检查项

### 上传前（本地 → GitHub）
- [ ] `.claude/settings.json` 不在仓库中（已被 .gitignore 排除）
- [ ] `.claude/CLAUDE.md` 内容已同步到 `preferences-repo/CLAUDE.md`
- [ ] 主动记忆（`projects/.../memory/`）与 `preferences-repo/` 文件一致
- [ ] 新增记忆文件后 MEMORY.md 索引已更新
- [ ] vision 技能中无硬编码 API 密钥（.env 已排除）
- [ ] `git status` 确认无意外文件

### 下载后（GitHub → 本地）
- [ ] `preferences-repo/CLAUDE.md` → 覆盖 `.claude/CLAUDE.md`
- [ ] `preferences-repo/MEMORY.md` → 覆盖 `projects/.../memory/MEMORY.md`
- [ ] `preferences-repo/Collab_Pref_Memory/` → 逐文件复制到 `projects/.../memory/`
- [ ] `preferences-repo/Project_Memory/OneNote_Proj/` → 逐文件复制到 `projects/.../memory/`
- [ ] vision.js / package.json 按需同步到 `.claude/skills/vision/`

## 新增记忆文件步骤
1. 在对应目录（Collab_Pref_Memory 或 OneNote_Proj）创建 .md 文件
2. 同步到 `.claude/projects/C--Users-maxf/memory/`
3. 更新 `preferences-repo/MEMORY.md` 索引（一行一条）
4. 按上传流程推送到 GitHub
