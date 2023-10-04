---
title: Network Layer
thumbnail: ''
draft: false
tags:
- network
- network-layer
created: 2023-10-04
---

# 네트워크 계층

![](Pasted%20image%2020231004221032.png)

* 네트워크 연결 구조
  * [Data Link Layer](Data%20Link%20Layer.md)에서는 [Ethernet](Ethernet.md) 규칙을 기반으로 같은 네트워크 내에 있는 컴퓨터끼리 연결했다.
  * 다른 네트워크에 있는 목적지로 데이터를 전달하려면 다른 기술이 필요하다.
  * 한 컴퓨터에서 다른 컴퓨터로 데이터를 전송하기 위해 [Switch](Switch.md)가 필요했던 것 처럼,
  * 하나의 네트워크에서 다른 네트워크로 데이터를 전송하기 위해 [Router](Router.md)를 사용한다.
  * [Router](Router.md)는 데이터의 목적지가 정해지면, 해당 목적지까지 어떤 경로로 가는 것이 좋은지 알려주는 역할을 한다.
  * 이번의 목적지는 다른 네트워크이다. 특정 [MAC Address](MAC%20Address.md)가 아니다.
  * 그래서 다른 네트워크의 목적지를 알아야하는데, 그 주소를 [IP](IP.md) 주소라 한다.
