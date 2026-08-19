---
title: "欢迎来到我的科研博客"
description: "这是网站的第一篇示例文章，用来展示 Markdown、目录、标签和文章排版。"
pubDate: 2026-08-19
category: "站点记录"
tags: ["博客", "GitHub Pages", "Astro"]
featured: true
---
## 为什么搭建这个网站

这里用来记录科研工作、技术实践以及项目进展。网站采用静态生成方式，因此非常适合部署在 GitHub Pages 上。

## 如何发布新文章

在 `src/content/blog/` 中复制一个 Markdown 文件，修改开头的信息与正文，然后提交到 GitHub。

```bash
git add .
git commit -m "add new post"
git push
```

GitHub Actions 会自动重新构建并发布网站。

## 下一步

你可以修改个人信息、加入论文列表、增加项目详情，并配置 Giscus 评论。
