---
title: CPU Architecture
thumbnail: ''
draft: false
tags:
- CPU
- architecture
- bit
created: 2023-10-01
---

코드가 어느 환경에 돌아가는지 아는 것은 중요하다. 어떤 cpu아키텍쳐가 있고, 차이점이 무엇인지에 대해서 알아보자. 해당 글은 계속해서 추가해 나갈 예정이다.

# Architecture의 종류

## 데이터 크기에 따른 분류

 > 
 > CPU가 한번에 처리할 수 있는 비트의 수

* 32비트
* 64비트

## 명령어 세트 아키텍쳐(ISA)기반 분류

* CISC (~Intel)
  * 모든 코드 언어 문장들에 대해 각각 기계 명령어가 대응
  * 호환성이 좋음
  * 전력소모가 크고 속도가 느림
* RISC (~ARM)
  * CISC 명령어 중 주로 쓰이는 것만 추려서 하드웨어로 구현
  * CPI(Cycle Per Instruction)을 최소화한 단순한 형태
  * 속도가 빠르고 가격이 저렴
  * 전력소모가 적어 효율적
  * 호환성 부족

# Reference

* [CPU는 어떻게 작동할까](https://youtu.be/Fg00LN30Ezg)
