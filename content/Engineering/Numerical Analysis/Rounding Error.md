---
title: Rounding Error
thumbnail: ''
draft: false
tags:
- error
- round-off-error
created: 2024-10-24
---

* 디지털 컴퓨터에서 연속적인 대상을 다루는 수학을 처리할 경우 근본적인 문제가 있다.
* 무한에 가까운 정보를 정해진 비트 패턴으로 표현해야 한다는 것이다.
* 이는 거의 모든 실수의 경우 **근사 오차**가 발생한다는 것을 암시한다.
* 근사 방법을 반올림을 선택한 경우 이를 **반올림 오차**라고 한다.
* 보통의 경우 이러한 오차는 큰 문제를 발생시키지 않지만, **여러 연산을 거치는 경우 문제가 커진다.**
* 여러 연산을 거치게 되면, **오차가 누적**되어 **결과값이 크게 달라질 수 있기 때문이다.**
* [Underflow](Underflow.md) 또는 [Overflow](Overflow.md)가 발생할 수 있다.

# 예시

* [Softmax Function](../../Math/Probability%20Theory/Softmax%20Function.md)을 예로 들어보자.

$$
f(x_i) = \frac{e^{x_i}}{\sum\_{j=1}^{K} e^{x_j}}
$$

* $K$개의 $x$가 모두 같은 값 $c$라고 해보자.
* 그럴 경우 $x_i$가 될 확률은 모두 같아야 한다.
* 하지만 **수치적으로는 그렇게 되지 않을 수 있다.**
* $c$가 너무 작거나, 너무 큰 경우를 생각해보자.
* 매우 작을 경우 분모가 0에 가까워져 전체값이 발산해버릴 것이고,
* 매우 클 경우 전체값이 0에 수렴할 것이다.
* 이러한 문제를 해결하기 위해서는 **적절한 스케일링**이 필요하다.

# Reference

* [Condition Number](../../Math/Algebra/Linear%20Algebra/Condition%20Number.md)\]
