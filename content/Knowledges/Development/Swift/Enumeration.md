---
title: Enumeration
thumbnail: ''
draft: false
tags:
- enumeration
- swift
- value-type
created: 2023-09-30
---

# Enumeration

* 연관된 Value들의 공통 Type을 정의할 경우 사용
* Type-Safe한 방법으로 사용 가능
* 특정 값으로 Raw Value 지정 필수 아님
* Raw Value 사용 가능 자료 구조
  * String
  * Chracter
  * Integer
  * Floating-point
* 사용 가능 기능
  * Computed Property
  * Instance method
  * Initializer
  * Extension
  * Protocol
* Raw Value의 묵시적 할당
  ````swift
  enum Planet: Int {
      case mercury = 1, venus, earth, mars, jupiter, saturn, uranus, neptune // 2, 3, 4, 5, 6, 7, 8
  }
  
  enum CompassPoint: String { // RawValue type String으로 지정시 
      case north, south, east, west // member 이름이 RawValue가 됨
  }
  ````

* Iterating
  * `CaseIterable` Protocol
* Associated Values
  * member에 연관된 값을 저장할 수 있음
  * 각각의 member에 따른 다른 형태의 값을 저장할 수 있음
    * tuple 지원으로 여러개 값도 가능
  * **Associated Value 사용시 enum에 Raw Value type 지정 불가**
    ````swift
    enum Barcode {
        case upc(Int, Int, Int, Int)
        case qrCode(String)
    }
    ````
  
  * Optional도 Enum임
