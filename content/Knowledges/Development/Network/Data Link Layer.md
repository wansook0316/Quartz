---
title: Data Link Layer
thumbnail: ''
draft: false
tags:
- network
- data-link-layer
- ethernet
created: 2023-10-04
---

* 랜에서 데이터를 정상적으로 주고 받기 위해 필요한 계층

* 앞은 전달하기 위해 변환하는 과정이 주라 생각

* [MAC Address](MAC%20Address.md) 

* [Ethernet](Ethernet.md)
  = [Switch](Switch.md)

# 트레일러 FCS(Frame Check Sequence)

* 전송중 오류 발생 확인 용도

# 프레임

* [Ethernet](Ethernet.md) 헤더와 트레일러가 추가된 데이터

![](Pasted%20image%2020231004133149.png)
![](Pasted%20image%2020231004133155.png)

# [MAC Address](MAC%20Address.md)를 통한 프레임 전송 과정

* A에서 B로 데이터를 전송한다고 생각해보자. 일단 내부 네트워크다.
  1. [Ethernet](Ethernet.md) 헤더에 출발 MAC 주소, 목적 MAC 주소를 담는다.
  2. 헤더와 트레일러를 추가하는 캡슐화를 진행한다. 프레임으로 된 것
  3. 물리 계층에서 이 프레임 비트열을 전기신호로 변환(아날로그)하고 네트워크를 통해 전송
* 이 때, 해당 데이터를 모든 컴퓨터는 받게 된다.
* 하지만 [Ethernet](Ethernet.md) 헤더에 붙어있는 목적지 MAC 주소와 자신의 MAC 주소가 일치하지 않기 때문에 데이터를 파기한다.
* B는 역캡슐화를 하여 데이터를 수신한다.

![](Pasted%20image%2020231004133208.png)
