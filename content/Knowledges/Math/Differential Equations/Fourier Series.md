---
title: Fourier Series
thumbnail: ''
draft: false
tags:
- math
- diffrential-equations
- fourier-series
created: 2023-10-03
---

푸리에 급수(Fourier series)는 주기적인 함수를 다양한 주파수의 사인(sin)과 코사인(cos) 함수의 합으로 표현하는 수학적인 표현 방법이다.

주로 **주기성을 가진 신호나 함수를 주파수 영역으로 분해하여 분석할 때 사용**된다.

열 방정식을 풀기 위해 [조제프 푸리에](https://ko.wikipedia.org/wiki/%EC%A1%B0%EC%A0%9C%ED%94%84_%ED%91%B8%EB%A6%AC%EC%97%90)가 도입하였다.

$f(x)$를 주기 $2L$을 가지는 주기적인 함수라고 가정하면,

$$
f(x) = a_0 + \sum\_{n=1}^{\infty} \left\[ a_n \cos \left( \frac{n \pi x}{L} \right) + b_n \sin \left( \frac{n \pi x}{L} \right) \right\]
$$
$$
a_0 = \frac{1}{2L} \int\_{-L}^{L} f(x) dx
$$
$$
a_n = \frac{1}{L} \int\_{-L}^{L} f(x) \cos \left( \frac{n \pi x}{L} \right) dx
$$

$$
b_n = \frac{1}{L} \int\_{-L}^{L} f(x) \sin \left( \frac{n \pi x}{L} \right) dx
$$

* $a_0$는 상수항(coefficient)이다.
* $a_n$과 $b_n$은 각각 사인(sin) 및 코사인(cos) 항의 계수(coefficient)이다.

즉, 푸리에 급수는 **원래 함수를 주파수 도메인으로 변환하는데 사용되며, 다양한 주파수의 사인 및 코사인 함수를 합하여 주기적인 함수를 근사화**다. 이렇게 변환하면 주파수 영역에서 함수의 주요 구성 요소와 주기성을 분석할 수 있으며, 신호 처리 및 주기적인 현상을 이해하는 데 유용하다.
