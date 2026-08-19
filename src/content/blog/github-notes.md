---
title: "使用 GitHub 管理科研代码与网站"
description: "把代码、论文实验记录与个人网站统一放入可版本追踪的工作流。"
pubDate: 2026-08-15
category: "技术笔记"
tags: ["GitHub", "科研工具"]
featured: true
---
## 为什么使用 Git

版本控制可以清楚记录每次修改，并能在出现问题时回退。

## 网站部署

本模板已经包含 GitHub Actions。每次向 `main` 分支推送代码后，工作流会自动构建 Astro 并部署到 GitHub Pages。
