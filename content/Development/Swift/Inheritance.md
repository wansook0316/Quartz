---
title: Inheritance
thumbnail: ''
draft: false
tags:
- NSObject
- NSCoding
- swift
- inheritance
created: 2023-09-30
---

Swift에서의 상속은 다른 언어와 비슷하다.

# Inheritance

* Base Class
  * 다른 class로부터 상속받지 않은 class
* NSObject 상속 받을 필요 없음
  * Objective-C의 경우 run-time에 필요한 모든 동작들의 기본이 NSObject에 구현되어 있음
  * Objective-C로 구현된 framework와 맞물려 동작하는 경우 NSObject를 상속 받아야 할 경우도 있음
    * `NSCoding`

# Overriding property

* superclass의 getter, setter 변경 가능
* observer 추가 가능
* read-only -> read-write O
* read-write -> read-only 불가능
  ````swift
  class Car: Vehicle {
      var gear = 1
      override var description: String {
          return super.description +  "in gear"
      }
  }
  ````

# preventing overrides

* `final` 키워드를 통해 상속이 불가능하게 할 수 있음
* method, property, subscript, class
* Static Dispatch 때문에 컴파일 속도가 더 빨라질 수 있음
