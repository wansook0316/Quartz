---
title: Various Monads
thumbnail: ''
draft: false
tags:
- monad
- functional-programming
created: 2023-09-18
---

Monad에는 어떤 종류가 있는가?

# Monad란

* 개념에 대한 의미론적 확장에 대응되는 제네릭 타입.
* `lift: (T->U) -> (M<T> -> M<U>)`
  * 임의의 일변수 함수를 모나드 타입 간의 함수로 확장해주는 함수
* `unit: T -> M<T>`
  * 임의의 타입을 의미를 보존한채 모나드 타입으로 확장해주는 함수
* `flat: M<M<T>> -> M<T>`
  * 모나드 타입을 의미를 보존한채 차원을 낮춰주는 함수

# 종류

* `Optional`
* `Array`
* `Future`
* `Reader`
* `Writer`
* `State`
* `IO`

`Optional`, `Array`는 생략한다. 

## Future

## Reader

## Writer

## State

## IO

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
