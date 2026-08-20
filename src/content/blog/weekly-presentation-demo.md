---
title: "HTML PPT 使用示例"
description: "一篇可直接照着修改的周报示例：包含图片、指标、表格、双栏和代码。"
pubDate: 2026-08-20
category: "周报"
tags: []
draft: false
featured: false
---

## 01 · 本周概览

这是一篇专门演示 **HTML PPT 周报怎么写** 的示例。

- 完成推力曲线数据清洗
- 完成 LSTM 基线模型训练
- 增加 CNN 对比实验
- 整理实验图表和论文结果

> 你以后只要复制这篇 Markdown，然后替换文字、图片和表格即可。

---

## 02 · 关键指标

<div class="metric-grid">
  <div class="metric-card"><span>R²</span><strong>0.972</strong><small>预测拟合度</small></div>
  <div class="metric-card"><span>RMSE</span><strong>0.031</strong><small>较上周 ↓ 12.4%</small></div>
  <div class="metric-card"><span>Peak Error</span><strong>2.8%</strong><small>峰值推力误差</small></div>
  <div class="metric-card"><span>Samples</span><strong>48</strong><small>本轮样本数量</small></div>
</div>

这类指标卡适合放在汇报前半段，让老师一眼看到结果。

---

## 03 · 推力曲线结果

![推力曲线预测示例](../../images/weekly-thrust-demo.svg)

**图片写法：**

```md
![推力曲线预测示例](../../images/weekly-thrust-demo.svg)
```

你自己的图片可以放进 `public/images/`，例如：

```text
public/images/week34-thrust.png
```

然后 Markdown 写：

```md
![第34周推力曲线](../../images/week34-thrust.png)
```

这种相对路径在 `localhost` 和 GitHub Pages 都能用。

---

## 04 · 实验结果表格

| 模型 | RMSE | MAE | R² | 训练时间 |
| --- | ---: | ---: | ---: | ---: |
| LSTM | 0.041 | 0.028 | 0.954 | 18 min |
| CNN | 0.038 | 0.025 | 0.961 | 11 min |
| Meta-Learning | **0.031** | **0.021** | **0.972** | 24 min |

表格直接用 Markdown 写即可，HTML PPT 会自动排版。

---

## 05 · 图 + 结论双栏

<div class="two-col">
  <div>
    <img src="../../images/weekly-thrust-demo.svg" alt="推力曲线示例" />
  </div>
  <div>
    <h3>阶段结论</h3>
    <ul>
      <li>峰值推力附近预测更加稳定</li>
      <li>Meta-Learning 在小样本条件下误差最低</li>
      <li>后段衰减区仍存在轻微偏差</li>
      <li>下一步重点增加跨工况测试</li>
    </ul>
  </div>
</div>

双栏适合“左边图、右边结论”的科研汇报页面。

---

## 06 · 当前问题

1. 样本规模仍然偏小，模型容易过拟合。
2. 不同发动机工况之间的数据分布存在差异。
3. 推力曲线尾段误差仍高于主燃烧阶段。

> 汇报时这一页不要写太多，建议只保留 3～4 个最重要的问题。

---

## 07 · 代码 / 方法记录

```python
model.fit(train_x, train_y)
pred = model.predict(test_x)
rmse = mean_squared_error(test_y, pred) ** 0.5
print(rmse)
```

如果是组会汇报，代码页只放核心逻辑，不要整段程序全部贴进去。

---

## 08 · 下周计划

- [ ] 增加 10 组新工况数据
- [ ] 完成 Meta-Learning 消融实验
- [ ] 对比 LSTM / CNN / Meta-Learning
- [ ] 整理论文实验章节
- [ ] 输出新的推力曲线对比图

**建议：** 一页只讲一个主题。每个 `---` 就是一张新的 HTML PPT。
