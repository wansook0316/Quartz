---
title: OSI 7 layer
thumbnail: ''
draft: false
tags:
- network
- OSI-7Layer
- physical-layer
- data-link-layer
- network-layer
- transport-layer
- session-layer
- presentation-layer
- application-layer
created: 2023-10-04
---

# 물리 계층 ([Physical Layer](Physical%20Layer.md) L1)

* 기계적, 전기적인 통신망 접면의 정의
* 데이터를 전기적인 신호로 변환해서 주고받는 기능만 할 뿐
* 대표 장비 : 통신 케이블, 리피터, 허브 등

# 데이터링크 계층 ([Data Link Layer](Data%20Link%20Layer.md) 2, L2)

* 데이타 링크의 제어 (프레임화, 데이터 투명성, 오류 제어 등)
* 맥 주소를 가지고 통신한다.
* 대표 장비 :브리지, 스위치 등

# 네트워크 계층 ([Network Layer](Network%20Layer.md) 3, L3)

* 경로 배정, 주소, 호 설정 및 해지 등
* 데이터를 목적지까지 가장 안전하고 빠르게 전달하는 기능(라우팅)
* 주소부여(IP), 경로설정(Route)

# 전송 계층 ([Transport Layer](Transport%20Layer.md) 4, L4)

* 종단 간의 신뢰성 있고 효율적인 메세지 전송(연결 관리,에러제어,데이타 분리,흐름제어 등)
* 오류검출 및 복구와 흐름제어, 중복검사 등을 수행
* [TCP](TCP.md) 프로토콜 / UDP 프로토콜

# 세션 계층 (Session Layer 5, L5)

* 응용 개체들간의 대화, 동기화 제어, 연결세션관리 등
* 데이터가 통신하기 위한 논리적인 연결
* 세션 설정, 유지, 종료, 전송 중단시 복구 등
* 동시 송수신 방식(duplex), 반이중 방식(half-duplex), 전이중 방식(Full Duplex)
* TCP/IP 세션을 만들고 없애는 책임

# 표현 계층 (Presentation Layer 6, L6)

* 전송 형식 협상, 데이타의 표현 방식 변환 등
* MIME 인코딩이나 암호화 등의 동작
* 데이터 종류 구분(해당 데이터가 TEXT인지, 그림인지, GIF인지 JPG인지의 구분)

# 응용 계층 (Application Layer 7, L7)

* 화일 전송, 접근 및 관리 및 문서, 메세지 교환 등
* 최종 목적지로서 [01. HTTP Basic](01.%20HTTP%20Basic.md), FTP, SMTP, POP3, IMAP, Telnet 등과 같은 프로토콜
* 일반적인 응용 서비스를 수행
