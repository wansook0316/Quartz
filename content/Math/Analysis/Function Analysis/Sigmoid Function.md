---
title: Sigmoid Function
thumbnail: ''
draft: false
tags:
- functions
- sigmoid
created: 2024-09-24
---

$$
\\sigma(x) = \frac{1}{1 + e^{-x}}
$$

* [Bernoulli Distribution](../../Probability%20Theory/Bernoulli%20Distribution.md)의 파라미터 $\phi$를 추정할 때 쓰인다.
* 이는 아마 이 함수의 치역이 $(0, 1)$이기 때문이다.
* 크기가 큰 수를 넣으면 크기 변화가 거의 없다.
* 이는 입력이 변해도 함수 값이 거의 변화지 않는 특징이다.
* 이를 두고 함수가 \*\*포화(Saturation)\*\*되었다고 한다.

# Reference

* [Wikipedia - Sigmoid Function](https://en.wikipedia.org/wiki/Sigmoid_function)
* [Softplus Function](Softplus%20Function.md)
