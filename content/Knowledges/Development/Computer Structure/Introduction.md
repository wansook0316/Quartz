---
title: Introduction
thumbnail: ''
draft: false
tags:
- computer-structure
- computer
- interface
- concurrency
- parallelism
- atomicity
- dependency
- synchronization
- deadlock
created: 2023-10-04
---

최호성님의 유튜브 강의를 보며 기본적인 컴퓨터 구조를 이해하고 정리하자.

[PC 조립 과정 보며 구조 이해하기](https://www.youtube.com/watch?v=p0ZXcw_5S8o&list=PLXvgR_grOs1BQCziQ_MpM877BdBxwbMzA&index=3)  
[컴퓨터 하드웨어 구성 요약](https://www.youtube.com/watch?v=BylAwbVlTxA&list=PLXvgR_grOs1BQCziQ_MpM877BdBxwbMzA&index=4)

## 다나와

[다나와](https://www.danawa.com)  
이곳에 가면 컴퓨터 용어에 대한 간단한 설명들을 쉽게 알 수 있다.

# 컴퓨터란?

\*\**CPU*\*\*가 가장 중요하다. 컴퓨터의 기본 정체성은 연산을 하는 기계이기 때문에, 이 연산을 담당하는 CPU가 컴퓨터를 거의 대표한다고 볼 수 있다. 요리에 비유한다면 좋은 칼, 좋은 도구 등이 될 수 있겠다.

하지만 재료가 없으면 요리를 할 수 없다. 따라서 우리는 CPU가 연산을 수행할 수 있도록 재료에 해당하는 \*\**메모리*\*\*를 주어야 한다. 그 과정에서 보조 기억 장치인 ***RAM, HDD, SDD*** 등이 필요하다.

# 하드웨어, 운영체제, 프로세스, 스레드

 > 
 > 컴퓨터가 '영토'라면 운영체제는 '정부조직'  
 > 스레드는 '개인'이고 프로세스는 '가족'

![](Pasted%20image%2020231004212532.png)
![](Pasted%20image%2020231004212542.png)

컴퓨터라는 하드웨어를 가지고 System software인 운영체제와, User software인 프로세스가 돌아가게 된다.
