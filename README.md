# GitHub Research Blog

一个可直接部署到 GitHub Pages 的个人科研博客模板，视觉结构参考现代个人博客，但代码、样式与内容均为独立实现。

## 1. 最快上线方法

1. 在 GitHub 新建仓库。推荐仓库名：`你的用户名.github.io`。
2. 把本项目全部文件上传到仓库 `main` 分支。
3. GitHub 仓库进入 `Settings → Pages`。
4. `Build and deployment → Source` 选择 **GitHub Actions**。
5. 进入 `Actions`，等待 `Deploy Astro site to Pages` 成功。
6. 访问 `https://你的用户名.github.io/`。

如果仓库不是 `用户名.github.io`（例如 `my-blog`），本模板会在 GitHub Actions 中自动识别项目路径，网址通常为 `https://你的用户名.github.io/my-blog/`。

## 2. 修改个人信息

只需要先改：

`src/site.ts`

包括姓名、简介、邮箱、GitHub、Scholar 等。

## 3. 发布文章

在 `src/content/blog/` 新建 Markdown，例如 `my-paper.md`：

```md
---
title: "文章标题"
description: "一句话简介"
pubDate: 2026-08-19
category: "科研记录"
tags: ["深度学习", "火箭发动机"]
featured: false
---

## 第一节

正文写这里。
```

提交到 GitHub 后，网站自动更新。

## 4. 本地预览

```bash
npm install
npm run dev
```

浏览器访问终端显示的本地地址。

## 5. 评论（Giscus）

GitHub Pages 本身没有数据库。本模板预留评论区域，建议使用 Giscus：

1. 仓库设为 Public。
2. 在仓库 Settings 开启 Discussions。
3. 安装并配置 Giscus App。
4. 在 giscus.app 生成自己的 `<script>` 配置。
5. 将生成的 Giscus script 放入 `src/pages/blog/[...id].astro` 的评论区域，替换当前提示框。

Giscus 使用 GitHub Discussions 保存评论，不需要你维护数据库。

## 6. 目录说明

```text
src/
├─ content/blog/      # 文章 Markdown
├─ components/        # 公共组件
├─ layouts/           # 页面布局
├─ pages/             # 首页、文章、项目、标签、关于、搜索
└─ site.ts            # 个人资料配置
.github/workflows/    # GitHub Pages 自动部署
```

## 7. 常用命令

```bash
npm run dev
npm run build
npm run preview
```
