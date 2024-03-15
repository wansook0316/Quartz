---
title: Class Diagram
thumbnail: ''
draft: false
tags:
- diagram
- class-diagram
- UML
created: 2023-10-01
---

UML에서 아직 그래도 많이 쓰이는 Class Diagram에 대해 정리해보자.

# Class Diagram

 > 
 > 시스템에 있는 클래스들을 보여주는 다이어그램

* 클래스의 상태, 동작, 접근 제어자
* 클래스 사이의 관계 (상속, 집합, 컴포지션 등)
* 시스템의 **정적인** 구조를 보여주기에 적합

## 관계

![](TechTalks_18_ClassDiagram_0.png)

* Generalization(일반화)
  * 가리키는 방향이 보다 일반화된 개념을 뜻한다.
  * 프로그래밍에서는 상속으로 구현된다.
* Realization(실체화)
  * 가리키는 방향이 구현되기 전 형태를 뜻한다.
* Dependency(의존)
  * 특정 개체가 다른 개체의 동작에 의존하는 경우를 말한다.
  * 생성, 지역 변수, 파라미터등 어떠한 방식으로 의존하는지 나타낼 수 있다.
* Association(연관)
  * 연관은 집합, 합성으로 나뉜다.
  * 아래 서술할 집합, 합성이 아닌 경우에 사용하면 좋을 듯 하다.
* Aggregation(집합)
  * 하위 존재하는 요소들이 상위 요소의 구성을 이루는 경우 사용한다.
  * 하위 개체들은 꼭 상위 객체를 위해 존재하는 것은 아니다.
  * 분무기를 Head와 Body 나눌 수 있다고 했을 때, Head, Body를 언제든 갈아끼울 수 있다면 집합이다.
* Composition(합성)
  * 하위로 존재하는 요소들이 상위 요소에서만 쓰인다.
  * 전체 개체가 사라지면 부분 개체도 사라진다.
  * 부분 개체의 라이프 사이클은 전체 개체의 라이프 사이클에 의존한다.
  * 분리해서 사용될 용도가 아님을 말한다.
  * **묶여있다, 같이 살고 같이 죽는다.**

## 예시

 > 
 > 간단한 예시

![](TechTalks_18_ClassDiagram_1.png)

 > 
 > 복잡한 예시

![](TechTalks_18_ClassDiagram_2.png)

# Reference

* [UML: 클래스 다이어그램과 소스코드 매핑](https://www.nextree.co.kr/p6753/)
* [UML Class Diagram Tutorial](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/)
