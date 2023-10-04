---
title: ARP(Address Resolution Protocol)
thumbnail: null
draft: false
tags:
- network
- protocol
created: 2023-10-04
---

* 목적지 컴퓨터의 IP 주소를 이용하여 [MAC Address](MAC%20Address.md)를 찾기 위한 [Protocol](Knowledges/Development/Network/Protocol.md)!
* ARP 요청
  - [Ethernet](Ethernet.md) 프레임을 전송하려면, 목적지 컴퓨터의 [MAC Address](MAC%20Address.md)를 알아야 한다.
  - 이걸 위해 출발지 컴퓨터가 네트워크에 브로드 캐스트 하는 것을 ARP 요청이라 함
* 브로드 캐스트
  - 출발지 컴퓨터에 연결된 모든 컴퓨터에 요청을 보내는 방식
  - 요청에 대해 IP 주소를 가지고 있지 않은 컴퓨터는 응답하지 않고, 지정된 IP주소를 가지는 컴퓨터는 [MAC Address](MAC%20Address.md)를 응답으로 보낸다.
* 이렇게 응답을 받게되면 이더넷 프레임을 만들 수 있게 된다.
* 이후 출발지 컴퓨터는 [MAC Address](MAC%20Address.md)와 [IP](IP.md) 주소의 매칭 정보를 메모리에 보관한다.
  - 이를 ARP 테이블이라 한다.
* 하지만 IP 주소가 변경되면 해당  [MAC Address](MAC%20Address.md)도 함께 변경되어 제대로 통신이 불가하다.
* 그래서 ARP 테이블은 보존 기간을 ARP 캐시로 저장하고, 일정 기간이 끝나면 삭제하고 다시 요청한다.
* 정리
  - ARP: [Network Layer](Network%20Layer.md) 주소와 [Data Link Layer](Data%20Link%20Layer.md) 주소 사이의 변환을 담당하는 [Protocol](Knowledges/Development/Network/Protocol.md)이며 [IP](IP.md) 주소를 물리 주소인  [MAC Address](MAC%20Address.md)로 변환하는데 사용한다.
  - ARP 캐시: 가장 최근에 변환한 [IP](IP.md)와 하드웨어 주소( [MAC Address](MAC%20Address.md))를 매핑하려 보관하고 있는 램의 한 영역이다.
  - ARP 요청: [IP](IP.md) 주소를 대치할 수 있는 물리 주인  [MAC Address](MAC%20Address.md)를 찾아내기 위해 보내는 브로드캐스트 [Packet](Packet.md) 요청이다.
  - ARP 응답: ARP 요청에 대한 응답으로 요청한 [IP](IP.md) 주소에 대한 물리 주소인 MAC 주소가 실려 있는 유니캐스트 패킷 응답이다.
