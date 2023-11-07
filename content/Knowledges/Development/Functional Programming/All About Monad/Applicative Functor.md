---
title: Applicative Functor
thumbnail: ''
draft: false
tags:
- applicative-functor
- functor
- functional-programming
created: 2023-09-18
---

Monad와 Functor 사이에는 Applicative Functor라는 중간 단계가 있다.

# Applicative Functor

 > 
 > Monoidal Functor라는 것의 다른 이름

# Monoidal Functor

아무 **언어에서나** 정의될 수 있는 개념은 아니다. 다음의 조건이 선행되어야 한다.

1. Empty Type $()\_{0}$ 을 제공해야 한다.
   * `Void`
   * `()`
   * C에서 빈 구조체 등
1. `T, U` 타입에 대한 Pair를 만들 수 있는 튜플 타입 $(T, U)\_{2}$를 제공해야 한다.
1. 튜플 타입과 빈 타입은 다음의 함수를 제공해야 한다.
   * `empty`: $() \rightarrow ()\_{0}$
   * `unite`: $(T, U)*{2} \rightarrow (T, U)*{2}$
   * `e1`: $(T, U)\_{2} \rightarrow T$
   * `e2`: $(T, U)\_{2} \rightarrow U$

즉, 다음을 만족해야 한다.

 > 
 > `unite(e1(u), e2(u)) = u`

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
