---
title: Condition Number (Sensitivity)
thumbnail: ''
draft: false
tags: null
created: 2024-10-25
---


 > 
 > 함수나 행렬이 입력 값의 작은 변화에 얼마나 민감하게 반응하는지를 측정하는 값

# [Matrix Norm](Matrix%20Norm.md)을 사용한 정의

$$
κ(A) = \left \| A \right\| \left\| A^{-1} \right\|
$$

# [Eigenvalue](Eigenvalue.md)를 사용한 정의

$$
κ(A) = \frac{\left| \lambda\_{\text{max}} \right|}{\left| \lambda\_{\text{min}} \right|}
$$

* 행렬 $A$가 대칭이고 양의 정부호일 때, 행렬의 Norm은 그 행렬의 가장 큰 고유값과 일치한다.
* 즉, $\|A\|$는 **가장 큰 고유값**을 나타내며, $\|A^{-1}\|$는 **역행렬의 가장 큰 고유값**, 즉 A의 가장 작은 고유값의 역수와 같다.

# 의미

* Condition Number가 **클수록 입력 값의 작은 변화에 민감하게 반응**한다.
* 해당 값이 크면 역행렬 계산 시, 입력의 오차에 민감하다.
* 이러한 민감도는 **행렬자체의 성질이다.** [Rounding Error](../../../Engineering/Numerical%20Analysis/Rounding%20Error.md)로 발생하는 결과와는 다르다.
