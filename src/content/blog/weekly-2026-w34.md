---
title: "2026-W34 周报｜CFD 神经算子替代模型与物理约束实验"
description: "完成公开 CFD 数据整理、FNO 基线、物理约束损失与消融实验框架，并确定下一阶段二维可压缩 CFD 主实验方向。"
pubDate: 2026-08-23
category: "周报"
tags: ["CFD", "Neural Operator", "FNO", "Physics-informed", "Deep Learning"]
draft: false
featured: false
---

## 本周概览

本周主要围绕 **CFD 神经算子替代模型** 展开工作，论文方向暂定为：

> **Neural-operator surrogate modeling for external jet/plume CFD fields based on public validation data**

中文方向：

> **基于公开喷流验证数据的尾焰外流场神经算子替代模型研究**

当前整体思路已经明确：使用公开、非敏感的 CFD 流场数据训练神经算子替代模型，在普通数据驱动 FNO 的基础上进一步加入 **梯度约束** 和 **PDE 残差约束**，提高模型对流场空间结构和物理规律的保持能力。

---

## 一、本周跑通的三条实验路线

### 1. Toy 2D 标量流场

完成二维 Toy 数据生成，用于快速验证：

- 数据生成
- FNO 训练
- 模型预测
- 结果绘图
- 整体工程流程

主要作为后续修改模型和损失函数时的快速调试环境。

### 2. PDEBench Sod6 一维激波管

完成：

- HDF5 数据读取与预处理
- NPZ 数据转换
- 一维 FNO 训练
- 模型评估
- 与 persistence baseline 对比

该路线用于验证真实公开 CFD 数据从原始文件到神经算子训练的完整流程。

### 3. 2D Vorticity FNO

已经支持四种训练模式：

- Baseline
- Gradient Loss
- PDE Residual Loss
- Gradient + PDE 联合损失

---

## 二、物理约束 FNO 实现

本周将原来的纯数据驱动 FNO 扩展为带物理约束的训练框架。

### 梯度约束

```text
L_grad = MSE(dω_pred/dx, dω_target/dx)
       + MSE(dω_pred/dy, dω_target/dy)
```

目标是不仅让预测值接近真实值，也尽可能保持：

- 涡结构
- 局部变化趋势
- 空间梯度
- 流场结构特征

### PDE 残差约束

二维 vorticity 场采用：

```text
R = ω_t + uω_x + vω_y - ν∇²ω
L_pde = mean(R²)
```

单步预测中：

```text
ω_t = (ω_pred_next - ω_current) / dt
```

这样可以把模型预测结果与 vorticity PDE 建立直接联系。

---

## 三、速度场恢复模块

当前公开 vorticity 数据只包含 `ω`，没有直接提供 `u` 和 `v`。

为了计算 PDE residual，本周实现了基于 **vorticity-streamfunction** 的速度场恢复：

```text
ω = dv/dx - du/dy
u = dψ/dy
v = -dψ/dx
ω = -∇²ψ
```

在周期边界条件下，通过 FFT 在频域求解 streamfunction，再恢复速度场。

这一模块使得仅依赖 vorticity 数据，也能够构造 PDE 物理约束。

---

## 四、训练、评估与消融实验框架

训练 history 已经可以分别记录：

```text
train_total_loss
train_data_loss
train_grad_loss
train_pde_loss
val_total_loss
val_data_loss
val_grad_loss
val_pde_loss
val_relative_l2
```

模型评估指标扩展为：

- MSE
- Relative L2 Error
- Gradient Error
- PDE Residual
- 单样本推理时间

同时建立了统一消融实验脚本，可以自动运行：

```text
Baseline
Gradient
PDE
Gradient + PDE
```

并将结果统一汇总到：

```text
outputs/ablation_summary.csv
```

运行目录会保存配置、指标、训练历史、模型 checkpoint、预测结果以及 loss / prediction 图。

---

## 五、单元测试与公开数据整理

### 单元测试

本周增加了针对物理损失模块的测试，覆盖：

- 常数场梯度
- 周期 sine/cosine 导数
- 无散速度恢复
- PDE loss 反向传播
- 随机 batch 下损失值为有限标量

### 公开 CFD 数据

目前本地已经整理：

```text
FNO samples
PDEBench
NASA PAW6 nozzle
NASA THX5 supersonic jets
NASA TMR
Jet subsonic grids
```

项目继续保持研究边界：只使用公开、非敏感的外流场、喷流、尾焰和通用 CFD benchmark 数据。

---

## 六、当前存在的问题

目前最大的限制是二维 vorticity 数据的物理信息不够完整。

当前处理后的数据主要只有：

```text
fields[sample, step, height, width]
```

缺少：

```text
u / v
ν
dt
物理域尺寸
边界条件
```

因此现阶段 PDE residual 中的部分物理参数仍采用无量纲训练假设，例如：

```text
ν = 1e-3
dt = 1.0
Lx = 1.0
Ly = 1.0
boundary = periodic
```

后续正式论文实验应优先迁移到具有更完整物理变量和元数据的公开 CFD 数据集。

---

## 七、下周工作计划

### 1. 处理 PDEBench OTVortex

下一阶段重点数据暂定为 **PDEBench OTVortex**。

该二维可压缩 CFD 数据包含：

```text
density
pressure
Vx
Vy
```

计划完成：

```text
HDF5 数据结构检查
        ↓
多通道数据预处理
        ↓
FNO 多变量输入输出
        ↓
Baseline
        ↓
Gradient Loss
        ↓
PDE Loss
        ↓
消融实验
```

### 2. 正式运行消融实验

重点比较：

```text
Baseline
vs
Gradient
vs
PDE
vs
Gradient + PDE
```

主要关注：

- Relative L2
- Gradient Error
- PDE Residual
- Inference Time

### 3. 开始整理论文实验结构

逐步形成：

```text
公开 CFD 数据
       ↓
FNO Baseline
       ↓
物理约束 Neural Operator
       ↓
Gradient Constraint + PDE Residual Constraint
       ↓
消融实验
       ↓
CFD Surrogate Modeling
```

---

## 本周总结

本周工作的重点已经从单纯的 **“FNO 能否跑起来”**，推进到了：

> **如何让 Neural Operator 在预测 CFD 流场的同时保持空间结构与物理一致性。**

目前已经完成 Toy、PDEBench Sod6 和二维 vorticity 三条实验路线，并建立了 Baseline、梯度约束、PDE 约束以及联合约束四种实验模式。

整体代码框架、评价指标、消融实验和单元测试已经基本成型。

下一阶段最关键的任务，是把当前框架迁移到具有 `density / pressure / Vx / Vy` 等完整变量的二维可压缩 CFD 数据上，并开始产出可以直接用于论文的正式实验结果。
