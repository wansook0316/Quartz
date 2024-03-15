---
title: About Architecture
thumbnail: ''
draft: false
tags:
- boost-camp
- architecture
- ios
- MVVM
created: 2023-10-04
---


 > 
 > 사용자 입력에 대한 Test, 단방향 흐름, 역할과 책임을 고려한 MVVM 구조를 채택하였습니다.

![](Pasted%20image%2020231004195530.jpg)
![](Pasted%20image%2020231004195544.jpg)

## 기획 분석

* 화면 이동이 복잡하지 않다.
* 사용자 입력에 대해 처리할 부분이 있어, 입력 테스트가 필요하다.

## 목표

* 단방향 흐름의 구조를 갖는 아키텍쳐를 사용한다.
* 뷰에 대한 요소를 ViewModel을 가지고 테스트 가능하도록 한다.
* 뷰 요소를 바인딩을 통해 렌더링 한다.
* 인터페이스 분리 원칙을 도입하여, 추후 변경되는 로직 개발 후, 쉽게 갈아끼울 수 있는 구조를 만든다.

## MVVM의 장점

* 테스트 가능
* 단방향 흐름을 가지고 있다.
* 입력에 대해 Binding이 가능하다.
