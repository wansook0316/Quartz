---
title: Ethernet
thumbnail: ''
draft: false
tags:
- network
- ethernet
created: 2023-10-04
---

* 일반적으로 데이터 링크 계층에서 가장 많이 사용되는 규칙
* 랜에서 사용되는 규칙
* 허브와 같은 장비에 연결된 컴퓨터와 데이터를 주고받을 때 사용
* 허브는 근본적으로 전기 신호를 받을 포트 뿐만 아니라 다른 포트에도 전달함
* 이 부분이 상당히 문제임. 그래서 규칙을 추가함
* 데이터에 목적지 정보를 추가해서, 목적지 이외의 컴퓨터에는 데이터를 받아도 무시하도록 한다.
* 또한 동시에 보낼 경우 충돌이 발생할 수 있다.
* 이런 경우 데이터를 보내는 시점을 늦춰서 충돌을 방지할 수 있게 설계하였다.
* 이 떄 사용되는 방법을 CSMA/CD라 한다.
  * CS : 데이터를 보내려고 하는 컴퓨터가 케이블에 신호가 흐르고 있는지 아닌지를 확인하는 규칙
  * MA: 케이블에 데이터가 흐르고 있지 않다면 데이터를 보내도 좋다는 규칙
  * CD: 충돌이 발생하고 있는지를 확인하는 규칙
* 하지만 switch가 등장한 이후 잘 사용되지 않는다.

![](Pasted%20image%2020231004133136.png)

# 이더넷 헤더

* OPI : [Data Link Layer](Data%20Link%20Layer.md) 
* [TCP](TCP.md)/[IP](IP.md)\] : [Network Layer](Network%20Layer.md) 에서 붙이는 작업
* `목적지` [MAC Address](MAC%20Address.md) + `출발지` [MAC Address](MAC%20Address.md) + `유형` = 14바이트 (6 + 6 + 2)
* 유형은 전송되는 상위 계층 프로토콜의 종류
  * 즉, 그 위 계층인 [Network Layer](Network%20Layer.md)에서 사용하는 프로토콜을 말함
    * 이건 사실 그 다음 계층으로 가기 위한 정보라 생각하면 됨
