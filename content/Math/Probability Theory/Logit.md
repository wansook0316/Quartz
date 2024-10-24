---
title: Logit
thumbnail: ''
draft: false
tags: null
created: 2024-10-24
---


 > 
 > [Odds](Odds.md)에 로그를 취한 값

$$
Logit(p) = \log \left( \frac{p}{1-p} \right)
$$

# 의미

* 성공 확률 $p$와 실패 확률 $1-p$의 비율에 로그를 취한 값

# 왜 사용하는가

* 선형 회귀 모델을 이진 분류 문제에 적용할 때 사용한다.
* 선형 회귀 모델에 해당 값을 넣기 위해서는 값이 대칭적인 것이 좋다.
* [Odds](Odds.md)의 경우 굉장히 비대칭적인 함수이다. (치역이 \[0, ∞))
* 여기에 로그를 취하면 **대칭적인 함수가 된다.** (치역이 (-∞, ∞))
* **확률이 0 또는 1에 가까운 경우 다루기**도 쉬워진다. [Rounding Error](../../Engineering/Numerical%20Analysis/Rounding%20Error.md)문제를 줄일 수 있다.
* 선형적임은 곧, 어떤 인자들의 덧셈으로 이루어진다는 것을 의미한다.
* 로**곱셈을 덧셈으로 변환**하는 특징을 가지고 있기 때문에, 오즈의 변화가 더 **선형적으로 해석**된다.

# Reference

* [Logit](https://en.wikipedia.org/wiki/Logit)
