---
title: DNS
thumbnail: ''
draft: false
tags:
- DNS
- Domain-Name-Server
- network
created: 2023-10-01
---


 > 
 > Domain Name Server 

 > 
 > 도메인이름을 치면 IP주소로 바꿔주는 서비스

* naver.com -> 192.168.03.2 OR 192.168.03.2:80
* 그러면 어떻게 DNS서버를 들렀다 오는걸까?
* 그러면 매번 입력할 때마다 DNS를 들렀다 오는걸까?
* 브라우저 캐시에 저장되어 있다.
* [ROOT DNS](https://ko.wikipedia.org/wiki/루트_네임_서버)
  * 전세계에 13개의 Root DNS 서버가 있다.
  * 가장 확실한 내용의 DNS 정보를 가지고 있는 서버
  * 나머지 DNS 서버는 이걸 복제해서 가지고 있음
  * 물어본다면, 가장 가까운 DNS 서버에 물어보게 됨
