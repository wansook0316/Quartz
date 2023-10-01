---
title: Script
thumbnail: ''
draft: false
tags:
- bitcoin
- script
- smart-contract
- turing-completeness
- solidity
created: 2023-09-18
---

비트코인 스크립트는 무엇일까?

# Smart Contract

* 비트코인이 전송되는데 있어 어떠한 계약을 걸 수 있다. 그걸 스마트 컨트랙트이라고 한다.
* 그리고 그 계약을 서술하는 프로그래밍 언어가 스크립트이다.
* 스크립트는 스택 기반의 스크립트 언어이다.
* "의도적으로" 몇몇 기능을 배제하고 만들어졌다.
  * Loop
  * [Turing Completeness](Turing%20Completeness.md)

# 비트코인이 튜링 완전하지 않은 이유

* 왜 루프를 뺐을까?
* 런타임에 무한 루프가 돌아가 노드가 멈추는 것을 막기 위해서.
  * 만약 다른 노드로 스크립트를 전파할 때, 스크립트에 무한 루프가 돌아가는 코드를 넣는다면 네트워크 공격이 가능하다.
  * 이는 굉장한 보안 위협이다.
* 튜링 완전한 스마트 계약은 분석하기가 어렵기 때문에.
  * 이건 "돈"이 연관된 문제다.
  * 컨트랙트의 조건이 어렵다면, "의도치 않은 실행"이 발생할 가능성도 높아진다.
  * DAO에서 해당 문제가 발생했고, 이더리움 클래식의 하드포크가 발생했다.
* 이와 반대로 튜링 완전한 스마트 계약 언어를 사용하기도 한다. 이더리움이다.
  * Solidity라는 언어를 사용한다.
  * 이더리움은 이 문제에 대해 Gas라는 비용을 지불하도록 하여 해결한다.
  * 스마트 컨트랙트를 위해서는 Gas를 지불해야 하고, 스크립트 실행 동안 Gas가 소진되도록 한다.
  * Gas가 없다면 스크립트 실행이 중단된다.

# Reference

* [Programming Bitcoin by Jimmy Song(O'Reilly). Copyright 2019 Jimmy Song, 978-1-492-03149-9](https://product.kyobobook.co.kr/detail/S000001810191?LINK=NVB&NaPm=ct%3Dlco3jtn4%7Cci%3Dbf430ef307d43aa5d2aed075a40675b99aea5dd1%7Ctr%3Dboksl1%7Csn%3D5342564%7Chk%3D30b6603d08172940787f2adaf8fa881b7ca80517)
* [programmingbitcoin](https://github.com/jimmysong/programmingbitcoin)
* [Turing Completeness](https://velog.io/@wansook0316/Turing-Completeness)
