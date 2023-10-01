---
title: What is RIBs
thumbnail: ''
draft: false
tags:
- architecture
- swift
- mobile
- RIBs
created: 2023-10-01
---


 > 
 > 많은 수의 엔지니어와 nested states를 관리하기 위한 mobile app Cross-platform Architecture

RIBs의 이름은 Router, Interactor, Builder의 약자이다. 공식 github에서는 다음의 것들을 장점으로 내세우고 있다.

* Android와 iOS의 아키텍쳐를 공유할 수 있다.
  * 비슷한 아키텍쳐를 가질 수 있어 business logic에 대해 cross review가 가능하다.
* Test가능하며, 격리되어 있다.
  * 개별적인 RIB은 각각의 책임을 가지고 있다. 거기다가 Child RIB 로직과도 분리되어 있다. 이러한 점에서 독립적으로 존재할 수 있다.
* 개발자의 생산성을 위한 도구이다.
  * RIBs에는 코드 생성, 정적 분석 및 runtime integrations에 대한 IDE 툴링이 함께 제공되며, 이 툴은 크고 작은 팀의 개발자 생산성을 향상시킨다.
* 확장가능한 아키텍쳐이다.
  * 많은 엔지니어와 함께 같은 코드베이스를 가지고 작업할 수 있음이 증명되었다.
* Open-Closed Principle
  * 개발자는 가능하면 기존 코드를 수정하지 않고 새로운 기능을 추가 할 수 있어야 한다. RIBs를 사용하면 몇 군데서 볼 수 있죠. 예를들어 부모 RIB을 거의 변경하지 않고 부모의 종속성이 필요한 복잡한 자식 RIB을 attach하거나 build할 수 있다.

사실 실제로 Tutorial을 진행해보는 것이 더 이해가 쉽다. 여기서는 튜토리얼을 진행하면서 잘 그려지지 않았던 구조를 그림으로 나타내어 호출 흐름을 이해하는데 도움을 주기 위한 목적으로 작성한다.
