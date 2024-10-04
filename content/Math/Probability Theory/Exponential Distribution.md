---
title: Exponential Distribution
thumbnail: ''
draft: false
created: 2024-09-23
tags:
- statistics
- distribution
---


 > 
 > 한번의 사건이 발생하는데 까지 걸리는 시간에 대한 분포

[Poisson Distribution](Poisson%20Distribution.md) 에서는 단위 시간에 발생하는 횟수에 대해 궁금했다면, 이번에는 하나의 사건이 발생하는데 까지 걸리는 시간을 확률 변수로 잡는다. 이 때 발생하는 분포가 지수 분포이다. 지수 분포를 정의하기 위해서는 해당 사건이 발생하는 확률(p)가 필요하다.

$$
f(x; \lambda) = \begin{cases}
\\lambda e^{-\lambda x} & {where } ;x \ge 0 \\
0 & {where } ;x \< 0
\\end{cases}
$$
