#!/usr/bin/env bash
# ============================================================
# 啊lei啊lei 作品集 — GitHub Pages 一键部署脚本
# 用法: bash deploy.sh
# ============================================================
set -e

echo "════════════════════════════════════════════"
echo "  啊lei啊lei · 2026 作品集 — 部署到 GitHub Pages"
echo "════════════════════════════════════════════"
echo ""

# 1. 收集 GitHub 用户名与仓库名
read -rp "请输入你的 GitHub 用户名: " GH_USER
read -rp "请输入仓库名 (默认 alei-portfolio，或用 用户名.github.io): " GH_REPO
GH_REPO="${GH_REPO:-alei-portfolio}"

if [ -z "$GH_USER" ]; then
  echo "✗ 用户名不能为空，已退出。"
  exit 1
fi

REMOTE="https://github.com/${GH_USER}/${GH_REPO}.git"

echo ""
echo "→ 仓库地址: $REMOTE"
echo ""

# 2. git 初始化与提交
if [ ! -d .git ]; then
  git init -q
fi

# 配置本地仓库的提交身份（若全局未设置）
if [ -z "$(git config user.name)" ]; then
  git config user.name "alei"
  git config user.email "alei@users.noreply.github.com"
fi

git add .
git commit -q -m "publish: 啊lei啊lei 2026 作品集" || echo "(无变更需要提交)"
git branch -M main

# 3. 远程与推送
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

echo "→ 正在推送到 GitHub（首次推送可能需要输入 GitHub 账号 / Token）..."
git push -u origin main

echo ""
echo "════════════════════════════════════════════"
echo "  ✓ 推送完成！"
echo "════════════════════════════════════════════"
echo ""
echo "下一步：开启 GitHub Pages"
echo "  1. 打开 https://github.com/${GH_USER}/${GH_REPO}/settings/pages"
echo "  2. Source → Deploy from a branch"
echo "  3. Branch → main / (root) → Save"
echo "  4. 等待 1-2 分钟，站点将上线于："
if [ "$GH_REPO" = "${GH_USER}.github.io" ]; then
  echo "     https://${GH_USER}.github.io/"
else
  echo "     https://${GH_USER}.github.io/${GH_REPO}/"
fi
echo ""
