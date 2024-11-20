---
title: Jacobian Matrix
thumbnail: ''
draft: false
tags: null
created: 2024-11-11
---


 > 
 > 벡터 -> 벡터에 대한 함수의 편미분을 모아놓은 행렬

# 정의

$$
 \mathbf{f}(\mathbf{x}) = \begin{bmatrix} f_1(x_1, x_2, \dots, x_n) \\ f_2(x_1, x_2, \dots, x_n) \\ \vdots \\ f_m(x_1, x_2, \dots, x_n) \end{bmatrix}
$$

* $f: \mathbb{R}^n \rightarrow \mathbb{R}^m$인 함수 $f$에 대한 편미분을 모아놓은 행렬
* $J \in \mathbb{R}^{m \times n}$
* $J\_{ij} = \frac{\partial}{\partial x_j} f(x)\_i$

$$
\\mathbf{J} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \frac{\partial f_1}{\partial x_2} & \dots & \frac{\partial f_1}{\partial x_n} \\ \frac{\partial f_2}{\partial x_1} & \frac{\partial f_2}{\partial x_2} & \dots & \frac{\partial f_2}{\partial x_n} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial f_m}{\partial x_1} & \frac{\partial f_m}{\partial x_2} & \dots & \frac{\partial f_m}{\partial x_n} \end{bmatrix}
$$

# 사용처

* 다변수 함수의 선형 근사
* [08. Newton-Raphson Method](../../../Engineering/System%20Dynamics/08.%20Newton-Raphson%20Method.md)에서 시스템의 근을 찾는 과정 등에 활용
