---
title: "2026-W35 周报｜论文修订与二维 CFD FNO 主实验推进"
description: "本周完成推力曲线论文关键方法修订，并将 CFD 神经算子实验推进到大规模二维多变量数据与 case-level 评估。"
pubDate: 2026-08-30
category: "周报"
tags: ["周报", "CFD", "FNO", "Transformer", "Meta Learning"]
draft: false
featured: false
---

## 本周概览

本周主要推进了两项工作：

1. 对固体发动机推力曲线预测论文进行系统修订，重点解决实验协议、Transformer 描述和基线公平性问题；
2. CFD 神经算子项目从小规模测试数据推进到 **10000 个 case 的二维可压缩 CFD Train 数据**，并完成多通道 FNO 的阶段性消融实验。

---

## 一、推力曲线预测论文修订

这周对论文中几个容易被审稿人质疑的问题进行了集中修改。

### 1. 修正目标域评估泄漏

原方案中目标域 B 的 query 样本既参与贝叶斯优化反馈，又用于最终结果报告，存在验证集与测试集角色混用的问题。

现在改成 **5 折外层评估**：

```text
3 个 support 样本 → 适应
1 个 validation 样本 → 贝叶斯优化
1 个 held-out test 样本 → 最终测试
```

最终 test 样本不参与归一化、训练、优化和模型选择，使目标域泛化评估更加独立。

### 2. 重新明确 Transformer 的作用

论文不再把模型描述成“对 800 个推力时间点做自注意力”。

实际实现是：

```text
8 个静态物理特征
        ↓
作为 8 个 feature tokens
        ↓
Transformer 建模特征之间的耦合
        ↓
一次性投影到 800 点完整推力曲线
```

同时将原来的 positional encoding 更准确地改为 **feature identity embedding**，并补全了 FFN、Residual 和 LayerNorm 等 Transformer block 描述。

### 3. 完善 Reptile 与对照实验

统一了 Reptile 外层更新语义，并新增 MLP 路径，用于后续进行：

- Transfer-MLP
- Reptile-MLP
- Transformer vs MLP
- 有/无 feature identity embedding

等公平对照。

目前代码和论文表述已经完成修订，但新的数值实验仍需要原始 A/B/C 数据后才能正式重跑。

---

## 二、CFD 神经算子主实验推进

本周 CFD 项目最大的进展，是确认并开始使用真正的多 case Train shard。

当前数据规模为：

```text
10000 cases
21 time steps
4 variables
128 × 128 grid
```

四个变量为：

```text
density
pressure
Vx
Vy
```

相比之前的单轨迹 OTVortex，这套数据可以真正进行 **case-level train / validation / test 划分**，避免把同一条轨迹的相邻时间帧同时放进训练集和测试集。

目前已经完成：

- 四通道 CFD 数据预处理；
- 4-channel → 4-channel FNO；
- per-channel normalization；
- case-level 数据划分；
- baseline 与 gradient constraint 消融；
- density / pressure / Vx / Vy 分通道误差统计；
- truth / prediction / absolute error 可视化；
- early stopping。

---

## 三、本周阶段性结果

目前重点复查到了 **1024-case** 设置。

| 方法 | Test Overall Relative L2 | Gradient Error |
|---|---:|---:|
| Baseline | 0.0429 | 126.21 |
| Gradient, λ=0.001 | 0.0441 | 87.03 |
| Gradient, λ=0.01 | 0.0456 | 51.76 |

结果比较清楚地体现出了一个 trade-off：

> **梯度约束可以明显改善空间梯度质量，但约束过强时不一定会进一步降低整体场误差。**

因此目前更倾向把 `λ_grad = 0.001` 作为较均衡的主推设置，而 `0.01` 作为强梯度约束对照。

另外，将 1024-case 实验延长到 6 epoch 后，三组实验都在第 5 轮 early stop，最佳 checkpoint 仍来自第 3 轮，说明单纯增加训练轮数并不能直接改善当前结果。

---

## 四、其他工作简要记录

本周还完成了以下整理：

- 更新二维 CFD 数据 inspection 与 preprocessing 文档；
- 完成 256 / 512 / 1024-case 不同规模的复查；
- 增加多通道 gradient loss 权重 sweep；
- 保留原有 Toy、Sod6 和 2D vorticity 三条实验路线；
- 对可压缩 PDE residual 暂不做强行实现，等待 `gamma / viscosity / boundary / energy` 等物理信息进一步确认。

---

## 五、下周计划

下周重点不会继续简单增加 epoch，而是优先做：

1. 给多通道 FNO 加入学习率调度；
2. 增加 multi-step rollout，观察误差随预测时间步的累积；
3. 继续比较 `λ_grad = 0.001` 与 `0.01` 的结构精度和整体误差；
4. 查清可压缩 CFD 所需物理参数，为 continuity / momentum residual 做准备；
5. 推力曲线论文在原始 A/B/C 数据补齐后，正式重跑 5 折 nested protocol、MLP baseline 和 feature-identity ablation。

---

## 本周总结

本周两个项目都从“代码能运行”继续向“实验设计是否可信”推进。

推力曲线论文的重点是修正评估协议并限制过度表述；CFD 项目的重点则是从单轨迹、小规模 smoke test 进入真正的 **多 case、128×128、多变量 Neural Operator 实验阶段**。

下一阶段需要重点回答的，不再只是模型是否能拟合数据，而是：

> **模型能否在未见 CFD case 上保持整体预测精度、空间结构质量以及后续可解释的物理一致性。**
