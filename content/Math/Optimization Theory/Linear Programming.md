---
title: Linear Programming
thumbnail: ''
draft: false
tags:
- optimization
created: 2024-10-15
---

# 설명

* 최적화 기법 중 하나다.
* 대부분의 최적화 기법이 그렇듯, 특정 제약조건에서 목적함수를 최적화하는 문제이다.
* 그런데 이 목적함수의 모양이 선형이다.
* 주로 자원 배분, 생산 계획, 물류 최적화 등에서 활용된다.

# 기본 구성 요소

1. 목표 함수(Objective Function)
   * 최적화하고자 하는 함수로, 일반적으로 최대화(maximization) 또는 최소화(minimization) 문제로 정의됩니다.
   * 예:  $Z = 3x + 5y$  (최대화하려는 경우)
1. 제약 조건(Constraints)
   * 문제의 해결 과정에서 반드시 만족해야 하는 조건들입니다.
   * 제약 조건은 선형 방정식 또는 부등식의 형태로 주어집니다.
   * 예:  $2x + 3y \leq 6 ,  x \geq 0 ,  y \geq 0$
1. 변수(Variables)

* 최적화 문제에서 결정해야 할 값들입니다.
* 예: 변수  x 와  y 는 목표 함수 및 제약 조건에서 사용되는 값입니다.

# 문제 해결 방법

* 일반적인 선형 계획법 문제는 다음과 같은 형태를 가진다.
* 목표 함수
  * $\text{maximize} \ Z = c_1x_1 + c_2x_2 + \ldots + c_nx_n$
  * $\text{minimize} \ Z = c_1x_1 + c_2x_2 + \ldots + c_nx_n$
* 제약 조건
  * $a\_{11}x_1 + a\_{12}x_2 + \ldots + a\_{1n}x_n \leq b_1$
  * $a\_{21}x_1 + a\_{22}x_2 + \ldots + a\_{2n}x_n \leq b_2$
  * $\ldots$
  * $a\_{m1}x_1 + a\_{m2}x_2 + \ldots + a\_{mn}x_n \leq b_m$
* 변수는 항상 비음수 조건 ( x_i \geq 0 )을 만족해야 합니다.

# Reference

* [선형계획법](https://ko.wikipedia.org/wiki/%EC%84%A0%ED%98%95_%EA%B3%84%ED%9A%8D%EB%B2%95)
