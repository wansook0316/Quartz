---
title: Control Flow
thumbnail: ''
draft: false
tags:
- control-flow
- swift
created: 2023-09-30
---

프로그래밍 언어에서 자주 사용하는 것들인 제어문, 문자열, 함수에 대해서 적어보려한다. 다른 언어와 많은 점이 다르지는 않기 때문에 한 포스팅에서 모두 알아보려 한다. 다만 Switch, String(unicode, index 문제 때문)의 경우는 조금 다르니 추가로 알아보는 것을 추천드린다. 함수는 사실 closure의 일종인데, 이는 이 다음 글에서 알아보도록 하고, 이번에는 일반적으로 아는 함수의 개념으로 이해하고 글을 읽어보자.

# 반복

* for-in
  * Sequence를 iterate
  * Sequence Protocol을 만족하는 모든 객체에서 사용가능
    * Sequence 정의
      * for-in loop로 순회할 수 있는 타입
    * Sequence 종류
      * [Collections](https://developer.apple.com/documentation/swift/swift_standard_library/collections)
* while
  * 조건 문이 앞에 있기 때문에 최소 0회 실행
* repeat-while
  * do-while과 유사
  * 조건문 뒤에 있기 때문에 최소 1회 실행

# 분기

* if
  * if, else if, else
* switch
  * Pattern Matching
  * 복잡한 조건에 따른 분기 가능
  * break문 사용하지 않아도 각 case만 실행하고 종료됨
    * 만약 아래까지 동작하고 싶다면 `fallthrough` 키워드 활용
  * 모든 case문은 반드시 실행문이 한줄이상 있어야 함
  * 모든 경우에 대해 case문이 없다면 반드시 `default` 필요
  * Interval Matching
    ````swift
    switch count {
    case 0:
        result = "no"
    case 1..<5:
        result = "few"
    default:
        result = "many"
    }
    ````
  
  * Value Binding
    ````swift
    switch point {
    case (let x, 0):
        print("x축 위에 있음")
    case (0, let y):
        print("y축 위에 있음")
    case (let x, let y) where x == y:
        print("y = x 위에 있음")
    case (let x, let y) where x == -y:
        print("y = -x 위에 있음")
    case (let x, let y):
        print("좌표평면 위에 있음")
    }
    ````
    
    * where 절을 사용하면 추가 조건 확인이 가능함
