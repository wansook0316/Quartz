---
title: Empirical Distribution
thumbnail: ''
draft: false
tags:
- distribution
- statistics
created: 2024-09-23
---

$$
p(x) = \delta(x - \mu)
$$

* [Dirac Delta Function](../Analysis/Function%20Analysis/Dirac%20Delta%20Function.md)은 0을 제외한 모든 곳에서는 값이 0이나, 적분하면 1이 되는 함수이다.
* 이를 확률 밀도함수 $p(x)$로 사용하면, $x=\mu$일 때 확률이 1이 되는 함수가 된다.
* 경험분포는 이러한 디랙 델타 분포를 가지고 구성된다.

$$
\\hat{p}(x) = \frac{1}{N} \sum\_{i=1}^{N} \delta(x - x_i)
$$

* N개의 점에 각각 확률 질량 $\frac{1}{N}$을 할당하는 방법으로 경험분포를 구성할 수 있다.
