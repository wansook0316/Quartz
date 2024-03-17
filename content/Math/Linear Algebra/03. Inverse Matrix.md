---
title: Inverse Matrix
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- inverse-matrix
- determinant
created: 2023-10-03
---

# Inverse Matrix

## Definition

정사각행렬에서 정의된다.

$$
AA^{-1};=;A^{-1}A;=;I
$$

## Determinant 에 따른 구분, 그리고 의미

* Determinant 가 존재한다.
  
  * 역행렬이 존재한다.
    * 비특이행렬 (Non-Singular Matrix)
    * 이 행렬이 다른 벡터에 곱해졌을 때, 차원의 크기가 유지된다.
    * 방정식의 해가 하나로 정해진다.
* Determinant 가 존재하지 않는다.
  
  * 역행렬이 존재하지 않는다.
    * 특이행렬 (Singular Matrix)
    * 이 행렬이 다른 벡터에 곱해졌을 때, 차원의 크기가 축소된다.
    * 방정식의 해가 무수히 많다.

## 성질

$$
1.;(AC)^{-1};=;C^{-1}A^{-1}\\ ;\\  
$$
$$
2.;(AC\dots PQ)^{-1};=;Q^{-1}P^{-1}\dots B^{-1}A^{-1}\\ ;\\
$$
$$
3.;(A^{-1})^{-1};=;A\\ ;\\
$$
$$
4.;(A^{-1})^T;=;(A^{T})^{-1}
$$
