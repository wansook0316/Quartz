---
title: Class
thumbnail: ''
draft: false
tags:
- class
- swift
- struct
- enumeration
- reference-type
created: 2023-09-30
---

Swift는 객체의 느낌으로 사용하는 3개의 개체가 있다. struct, class, enumeration이 그것이다. struct는 apple에서 권장하고, 실제로도 대체하는 것이 좋다고 생각되는 자료구조이고, enum의 경우 다른 언어보다 기능이 많이 추가되었다. property와 method 작성도 가능하다. 실제로 enum의 경우 값을 관리하는 목적으로 많이 사용했었다. 3개의 자료구조의 공통점과 차이점에 유의하며
읽다보면 금방 이해가 될 듯하다. 그럼 시작해보자.

![](122864155-10ac1900-d35f-11eb-9abe-d009aee4a2ca.png)

# Class

* 전통적인 OOP 관점에서의 클래스
* 단일 상속
* 인스턴스/타입 메서드
* 인스턴스/타입 프로퍼티
* **참조타입**
* Apple 프레임워크의 대부분의 큰 뼈대는 모두 클래스
* identity operator
  * reference type의 경우 같은 instance인지 확인할 방법이 필요함
  * `"==="`, `"!=="`
