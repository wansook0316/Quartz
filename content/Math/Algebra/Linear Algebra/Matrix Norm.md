---
title: Matrix Norm
thumbnail: ''
draft: false
tags:
- norm
created: 2024-10-25
---


 > 
 > 행렬의 “크기”나 “길이”를 수치적으로 나타내는 척도

# 만족해야 하는 성질

* **비음수성 (Non-negativity)**
  * $\|A\| \geq 0$ 이고,  $\|A\| = 0$ 이면  $A = 0$
* **동차성 (Homogeneity)**
  * 스칼라  $\alpha$ 에 대해  $\|\alpha A\| = |\alpha| \|A\|$
* **삼각 부등식 (Triangle Inequality)**
  * $\|A + B\| \leq \|A\| + \|B\|$

# Induced Norm

 > 
 > 행렬이 벡터에 작용할 때 그 벡터의 크기가 얼마나 변화하는지 측정하는 노름

$$
\|A\| = \sup\_{\mathbf{x} \neq 0} \frac{\|A\mathbf{x}\|}{\|\mathbf{x}\|}
$$

## L1 Norm

 > 
 > 열의 절대값의 합 중 가장 큰 값

$$
\|A\|*1 = \max*{j} \sum\_{i=1}^{m} |a\_{ij}|
$$

## L2 Norm

 > 
 > 행렬의 **[Eigenvalue](Eigenvalue.md)** 중 가장 큰 값

* 스펙트럼 노름(Spectral Norm)이라고도 한다.

$$
\|A\|*2 = \sqrt{\lambda*{\text{max}}(A^TA)}
$$

## Infinity Norm

 > 
 > 행의 절대값의 합 중 가장 큰 값

$$
\|A\|*{\infty} = \max*{i} \sum\_{j=1}^{n} |a\_{ij}|
$$

# Frobenius Norm

 > 
 > 행렬의 각 원소의 제곱의 합의 제곱근

$$
\|A\|*F = \sqrt{\sum*{i=1}^{m} \sum\_{j=1}^{n} |a\_{ij}|^2}
$$

# Max Norm

 > 
 > 행렬의 원소 중 가장 큰 값

$$
\|A\|*{\max} = \max*{i,j} |a\_{ij}|
$$
