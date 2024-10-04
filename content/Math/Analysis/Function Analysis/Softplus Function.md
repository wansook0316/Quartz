---
title: Softplus Function
thumbnail: ''
draft: false
tags:
- functions
- softmax
- softplus
created: 2024-09-24
---

![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Softplus.svg/640px-Softplus.svg.png)

$$
\\zeta(x) = \ln(1 + e^x)
$$

* 치역이 (0, ∞)인 함수
* 정규 분포의 $\beta, \sigma$ 파라미터를 산출하는데 사용한다.

# Properties

$$
\\frac{d}{dx} \zeta(x) = \frac{e^x}{1 + e^x} = \frac{1}{1 + e^{-x}}=\sigma(x)
$$

# Reference

* [Softplus function](https://en.wikipedia.org/wiki/Softplus)
* [Sigmoid Function](Sigmoid%20Function.md)
