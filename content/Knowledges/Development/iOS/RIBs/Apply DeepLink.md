---
title: Apply DeepLink
thumbnail: ''
draft: false
tags:
- deep-link
- RIBs
created: 2023-10-01
---

Deep link를 적용하기 위해서는 AppDelegate에서 응답을 받아 처리해야 한다. 해당 내용은 그림으로 그리기가 너무 벅차 말로 간단하게 대체하려 한다.

* Reactive 방식을 통해 상위에서 하위로 stream을 전달하여 하위 RIB의 특정 화면을 그리는 방식을 사용한다.
* 이 때, 기존에 RIB의 Builder의 `build()` 함수의 반환 값이 Router였던 것에서 `ActionableItem`이라는 프로토콜을 채택하는 구현체도 같이 던져준다. 보통은 Interactor가 이 역할을 한다.
* `ActionableItem`은 하위 RIB이 생성된 시점에 하위 RIB의 Actionable Item을 Publisher로 전달하는 역할을 적는다.
* 이렇게 정의된 stream을 관리하는 녀석이 필요한데 이녀석을 `Workflow`라고 하고 맨처음 이 stream을 시작하고 관리하는 구현체가 들고 있다.

말이 좀 어려운데, 이건 RIB의 Tutorial 4를 해보는 것을 추천한다.
