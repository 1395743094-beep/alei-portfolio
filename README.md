# 啊lei啊lei · 2026 作品集网站

> 大健康 / 中医药 / 养生产品视觉设计师作品集 —— 赛博科技风格静态站点，部署于 GitHub Pages。

## 站点概览

| 项目 | 内容 |
|------|------|
| 作者 | 啊lei啊lei |
| 定位 | 大健康产品视觉设计师（包装 / 主图 / 详情页 / A+ / 3D 渲染） |
| 项目数 | 104 个项目 / 10 大分类 / 273 张精选视觉 |
| 风格 | 深色 + 冷青金属高光 · 赛博科技 |
| 技术栈 | 纯静态 HTML + CSS + Vanilla JS（无构建依赖） |

### 分类

足浴包 · 茶 · 港货 · 外贸 · 非遗 · 热敷&按摩仪器 · 膏&丸&贴&液 · 眼罩 · 精油 · 其他联合创作

### 页面

- `index.html` — 首页（Hero / 精选作品 / 分类索引 / 关于 / 联系）
- `category.html` — 作品分类浏览（支持按分类筛选，`?category=<id>`）
- `project.html` — 项目详情页（`?id=<projectId>`）
- `about.html` — 关于我
- `contact.html` — 联系合作

---

## 本地预览

```bash
cd alei-portfolio
python -m http.server 8099
# 浏览器打开 http://127.0.0.1:8099
```

---

## 部署到 GitHub Pages（推荐）

### 第 1 步：在 GitHub 创建仓库

1. 登录 [github.com](https://github.com)，点击右上角 **+** → **New repository**
2. Repository name 填：`alei-portfolio`（可自定义）
3. 选择 **Public**
4. **不要**勾选 "Add a README" / "Add .gitignore" / "License"（本仓库已包含）
5. 点击 **Create repository**

### 第 2 步：推送代码

在本目录下运行（替换 `你的用户名` 和仓库名）：

```bash
# 方式 A：使用随附部署脚本（交互式，推荐）
bash deploy.sh

# 方式 B：手动执行
git init
git add .
git commit -m "init: 啊lei啊lei 2026 作品集"
git branch -M main
git remote add origin https://github.com/你的用户名/alei-portfolio.git
git push -u origin main
```

> 若使用仓库 `<用户名>.github.io`，站点地址为 `https://用户名.github.io/`；
> 若使用普通仓库（如 `alei-portfolio`），站点地址为 `https://用户名.github.io/alei-portfolio/`。

### 第 3 步：开启 GitHub Pages

1. 进入仓库 → **Settings** → 左侧 **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `main` / 文件夹选 `/ (root)`
4. 点击 **Save**
5. 等待 1–2 分钟，页面顶部会出现站点地址

### 第 4 步（可选）：自定义子路径

若仓库名不是 `<用户名>.github.io`，所有资源引用已是相对路径，无需额外配置即可在子路径下正常运行。

---

## 目录结构

```
alei-portfolio/
├── index.html              # 首页
├── category.html           # 分类浏览
├── project.html            # 项目详情
├── about.html              # 关于
├── contact.html            # 联系
├── .gitignore
├── deploy.sh               # 一键部署脚本
├── assets/
│   ├── css/style.css       # 赛博科技设计系统
│   ├── js/
│   │   ├── app.js          # 共享数据加载与工具
│   │   └── projects.json   # 项目数据（104 项）
│   └── projects/           # 压缩后的作品图（.jpg）
│       └── <分类>/<项目ID>/<项目ID>-<序号>.jpg
└── build_data.py           # 数据构建脚本（不参与部署）
```

> **关于图片**：原始素材共 853MB，构建脚本仅挑选每个项目的代表性视觉并压缩为 Web 优化 JPEG（最大 1500px / 质量 82），最终部署体积约 32MB。`.gitignore` 已排除未压缩的原始文件。

---

## 更新作品

1. 在 `F:\作品集\2026作品集` 中增删项目
2. 运行 `python build_data.py` 重新生成 `assets/js/projects.json` 与压缩图片
3. 提交并推送：`git add . && git commit -m "update: 新增作品" && git push`

---

© 2026 啊lei啊lei. All rights reserved.
