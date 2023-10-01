---
title: Access Control
thumbnail: ''
draft: false
tags:
- swift
- module
- management
- ACL
- access-control-level
created: 2023-09-30
---

코드의 관리는 중요하다. 위계 질서를 가지고 구분하지 않으면 혼란을 초래한다. 접근 제어는 특히 SDK 작업을 하는 경우 인터페이스 역할을 하기 때문에 잘 알아두는 것이 좋다. 

# Module & Source file

* 접근 제어는 module과 source file 단위로 이뤄짐
  * Module
    * code 배포의 단위
      * App, Framework, Library
  * Source file
    * 하나의 source file
* 다른 module의 code를 참조하려 하면 import 해야함
* 같은 module안에서는 다른 source file을 import할 필요 없음

# Access Control Levels (ACL)

![](124086491-1060fb80-da8c-11eb-9294-433d65e95a72.png)

# 종류

## Open

* module 외부에서 접근 가능

* class에서만 사용

* 정의된 모듈 밖에서도 상속 가능
  
  ## Public
  
  * module 외부에서 접근 가능

## Internal

* 같은 module 안에서 접근 가능
* access modifier를 지정하지 않으면 default임

## fileprivate

* 같은 source file안에서 접근 가능

## private

* 기능 정의 내부 또는 동일 파일내 extension에서만 접근 가능

# 알아둘 점

* 별도 지정하지 않으면 default internal
* Framework의 경우, 외부 제공 interface를 open/public으로 만들어야 함
* Unit Test에서 `@testable attribute` 를 써주면 해당 framework의 internal에도 접근 가능

# 주의할 점

* 모든 entity와 그것이 사용하는 entity는 access level이 맞아야 함
  * public function은 parameter로 internal, private level 못 받음
  * public class의 super class가 internal이나 private일 수 없음
* 어차피 컴파일러가 에러내 줌!
