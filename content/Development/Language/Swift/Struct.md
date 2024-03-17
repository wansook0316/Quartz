---
title: Struct
thumbnail: ''
draft: false
tags:
- swift
- struct
- value-type
created: 2023-09-30
---

# Structure

* C언어 등의 구조체보다 다양한 기능
* 상속 불가능
* 인스턴스/타입 메서드
* 인스턴스/타입 프로퍼티
* **값타입**
* Swift의 대부분의 큰 뼈대는 모두 구조체

## Struct가 선호되는 이유

* mutability control에 유리
  * 상태로 인한 부작용 없음
  * let 선언으로 완전한 immutable 자료형 생성
    * class의 경우 let 인스턴스여도 member 변수 변경 가능
* 성능 유리
  * referencing 소요 시간 감소
  * compiler가 강력한 최적화 수행
* 함수형 프로그래밍에서 효과정
  * immutable 요소를 바탕으로 code 가독성 향상
  * concurrency programming시 안정적인 코드 작성 가능
    * 순수함수이기 때문에 같은 결과를 기대할 수 있음
