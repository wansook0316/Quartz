---
title: Extension
thumbnail: ''
draft: false
tags:
- swift
- extension
created: 2023-09-30
---

Extension과 Protocol은 Swift에서 자주 사용되는 기능이다. 값에 접근이 불가함에도 Extension으로 추가 기능을 구현할 수 있다.

# Extension

* class, struct, enum 확장 가능
* 원본 소스에 접근할 수 없어도 사용가능
* Objective-C의 category와 유사한 기능
* 접근제어 가능
* 가능한 것들
  * computed property 추가
  * method 추가
  * initializer 추가
    * designated intializer, deinitializer 추가 불가
    * 새로운 initializer, convenience initializer 추가 가능
    * 추가된 initializer에서 default initializer, memberwise initializer 호출 가능
  * subscript 추가
  * nested type 추가
  * 특정 protocol의 confirm
  * protocol 확장
