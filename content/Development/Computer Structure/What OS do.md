---
title: What OS do
thumbnail: ''
draft: false
tags:
- operatiing-system
- computer-structure
- process
- virtual-memory
- scheduling
created: 2023-10-04
---

운영 체제가 하는 일을 간단하게 알아보자.

최호성님의 유튜브 강의를 보며 기본적인 컴퓨터 구조를 이해하고 정리하자.

# 운영체제가 하는 일

 > 
 > 접근 제어 + 동기화 + 관리

전산 자원을 관리한다. 대표적인 전산 자원은 CPU, RAM 등이 있다. ~~스타판 프로게이머~~

## 프로그램'들' 관리하기

 > 
 > Process를 관리

한정된 자원으로 많은 프로그램들이 동작해야 한다. 어쩔 수 없이 나눠서 사용해야 한다.

아래 단어들의 의미를 모른다면, 용어를 알고 다시 읽자.
[Introduction](Development/Computer%20Structure/Introduction.md)

### Scheduling

 > 
 > 멀티 프로세스 운영체제에서 하나의 CPU가 복수의 프로세스를 실행하기 위해 CPU를 사용하는 순서를 정해주는 작업

![](Pasted%20image%2020231004213748.png)

이렇게 다양한 프로세스를 동시에 작업하게 되면, 스레드가 CPU를 사용하고 있을 떄, 사용하고 있다고 알려주는 \*\**[Synchronization](Synchronization.md)*\*\*가 매우 중요하다.

## Virtual Memory System

 > 
 > RAM과 HDD를 하나의 논리적 메모리로 추상화시킨 메모리 관리 방법

프로세스가 운영체제로 부터 메모리를 할당 받는 일은 시간이 많이 걸리는 일이다. 그렇기 때문에 최대한 RAM 공간에 할당 받은 채로 존재하는 것이 속도를 높일 수 있는 방법이다. 또한 여러개의 프로세스를 사용할 경우, RAM 공간을 초과하여 프로세스가 동작하지 않는다. 이런 부분들을 해결하기 위해 HDD 공간을 활용한 것이 가상 메모리 시스템이다.

### 단위

이 곳에서 모든 메모리는 **Page**라는 단위로 관리된다. HDD와 RAM을 왔다갔다 하는 단위이다. 이 중에는 Paged 될 수 있는 **페이징 풀** 영역과 절대로 Paged 되면 안되는 **비 페이징 풀** 영역이 있다. [Paging](Paging.md)

### Virtual Memory의 구성

집의 공간을 가족 구성원들이 나눠쓰듯이 프로세스의 가상 메모리 공간을 thread가 나눠서 사용한다. 이 나눠서 사용하는 공간을 **Stack**이라 한다. 이 thread에 할당된 메모리 공간이 stack을 사용하여 관리되기 때문에 Stack이라 불린다.

프로세스는 Heap과 실행 코드 영역을 갖는다.  
[Process Management](Process%20Management.md)

### 동작 방법

1. RAM이 꽉찼는 지 확인한다.
1. 꽉찼다면 현재 RAM 공간 중에 사용하지 않는 프로세스가 할당된 공간이 있다면 이것을 HDD 공간에 복사해둔다. **Page Out**(*Swap Out*)
1. RAM 공간이 비게 될 경우 복사해 둔 공간을 다시 RAM으로 복사한다. **Page in**(*Swap in*)

### 프로세스 별 가상 메모리의 크기

이러한 가상 메모리 시스템이 있기 때문에, 프로세스가 실행 되고 할당 받는 메모리 공간은 4GB로 할당한다. 이 크기는 현실적으로 RAM만 사용한다면 말이 안되는 소리지만, 가상 메모리를 사용하게 되면 문제없다.
