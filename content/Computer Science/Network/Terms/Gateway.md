---
title: Gateway
thumbnail: ''
draft: false
tags:
- gateway
- network
created: 2023-10-04
---

* 다른 네트워크로 들어가는 입구 역할을 하는 네트워크 포인트
* 종류가 다른 네트워크 간의 통로 역할을 하는 장치
* [Protocol](Computer%20Science/Network/Terms/Protocol.md)을 적절히 변환해주기도 함
* 다른 언어를 사용하는 사람 사이의 통역가, 번역기라 생각
* 톨게이트와 유사
  * 한국에서 일본으로 넘어가는 톨게이트가 있다 해보자.
  * 일본으로 넘어갈 때, 좌측 통행을 하는 규칙을 알려주고 적용하는 상황과 비슷
  * 여기서 그 규칙이 프로토콜을 변환하는 행위라 생각하면 된다.
* 집에서 사용할 때 인터넷에 연결되는 과정을 보자
* 컴퓨터 -> 공유기 -> 인터넷 제공 회사 [Router](Router.md) -> [Network & Internet](Network%20&%20Internet.md) 망
* 여기서 공유기와 인터넷 제공회사 라우터는, 인터넷 망에 연결되기 전에, 네트워크로 들어가기전 입구 역할을 하고 있다.
* 이렇게 다양한 게이트 웨이를 거쳐야 연결이 될 수 있다.
* 그래서 (1~3layer에서) [Router](Router.md)가 이러한 역할을 많이 한다.
* 지나는 게이트 웨이의 수를 `hop count` 라 한다. 이경우는 2이다.
