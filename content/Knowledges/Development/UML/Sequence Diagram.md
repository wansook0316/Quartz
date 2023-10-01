---
title: Sequence Diagram
thumbnail: ''
draft: false
tags:
- UML
- sequence-diagram
- diagram
created: 2023-10-01
---

다음으로 또 많이 쓰이는 Sequence Diagram에 대해 알아보자. 

 > 
 > 해당 글의 사진 자료는 외부 블로그를 많이 참고했다.

# Sequence Diagram

 > 
 > 시스템이나 객체들이 메시지를 주고받으며 상호작용하는 과정을 표현하는 다이어그램

* 어떠한 시나리오로 흘러가는지 쉽게 표현 가능
* 각 동작에 참여하는 시스템이나 객체들의 수행 기간 확인
* 시스템의 **동적인** 구조를 보여주기에 적합

## 구성 요소

|Components|[UML](UML.md)|Description|
|----------|---|-----------|
|Actor (액터)|![](TechTalks_19_SequenceDiagram_0.png)|시스템으로부터 서비스를 요청하는 외부 요소로, 사람이나 외부 시스템을 뜻함|
|Object (객체)|![](TechTalks_19_SequenceDiagram_1.png)|메시지를 주고받는 주체|
|Lifelines (생명선)|![](TechTalks_19_SequenceDiagram_2.png)|- 객체가 메모리에 존재하는 기간으로, 객체 아래쪽에 점선을 그어 표현함 <br> - 객체 소멸(X)이 표시된 기간까지 존재함|
|Activations (실행 상자)|![](TechTalks_19_SequenceDiagram_3.png)|객체가 메시지를 주고받으며 구동되고 있음을 표현함|
|Message (메시지)|![](TechTalks_19_SequenceDiagram_4.png)|객체가 상호 작용을 위해 주고받는 메시지|
|Destruction (객체 소멸)|![](TechTalks_19_SequenceDiagram_5.png)|해당 객체가 더이상 메모리에 존재하지 않음을 표현|
|Frame (프레임)|![](TechTalks_19_SequenceDiagram_6.png)|다이어그램의 전체 또는 일부를 묶어 표현한 것|

## 메시지

|Type|[UML](UML.md)|Description|
|----|---|-----------|
|Sync Message|![](TechTalks_19_SequenceDiagram_7.png)|동기적으로 메시지 전송|
|Async Message|![](TechTalks_19_SequenceDiagram_8.png)|비동기적으로 메시지 전송|
|Sync Return Message|![](TechTalks_19_SequenceDiagram_9.png)|동기적으로 메시지 호출 반환|
|Async Return Message|![](TechTalks_19_SequenceDiagram_10.png)|비동기적으로 메시지 호출 반환|

## 추가 사항

![](TechTalks_19_SequenceDiagram_11.png)

* 자체적으로 호출하는 경우는 위와 같이 표현할 수 있다.

# 예시

![](TechTalks_19_SequenceDiagram_12.png)

# Reference

* [What is Sequence Diagram?](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/)
* [\[ETC.\] 시퀀스 다이어그램 작성법 & 예제 총정리](https://coding-factory.tistory.com/806)
