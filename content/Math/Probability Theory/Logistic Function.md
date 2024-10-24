---
title: Logistic Function
thumbnail: ''
draft: false
tags:
- sigmoid
created: 2024-10-24
---


 > 
 > [Bernoulli Distribution](Bernoulli%20Distribution.md)을 따르는 이진 분류 문제에 사용되는 함수

# Logistic Function

$$
f(x) = \frac L{1 + e^{(-k(x - x_0))}}
$$

* $L$: 함수의 최댓값
* $k$: 함수의 경사도 (로지스틱 성장률)
* $x_0$: 함수의 중심

# Standard Logistic Function (Sigmoid Function)

$$
logit^{-1}(x) = \sigma(x) = \frac{1}{1 + e^{-x}}
$$

* [Logit](Logit.md) 함수의 역함수

# 의미

* 어떠한 성장의 단계를 나타내는 함수
* 초기에는 기하급수적, 포화가 시작되면 선형적인 둔화, 성숙기에는 기하급수적으로 감소한다.
* 인공지능 분야에서는 [Bernoulli Distribution](Bernoulli%20Distribution.md)을 따르는 이진 분류 문제에 사용된다.

# Reference

* [Logistic Function - Wikipedia](https://en.wikipedia.org/wiki/Logistic_function)
