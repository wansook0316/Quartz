---
title: Thread
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

Thread에 대해서 알아본다.

# 쓰레드(Thread)

 > 
 > 쓰레드는 프로그램 \*\*내부의 흐름(맥)\*\*이다.

````c++
#include <iostream>
#include <string>
using namespace std;
int main(void)
{
  int n = 1;
  int m = 10;
  cout << n * m;
  while(n < m)
    n++;
  cout << "end" << endl;
}
````

이런 코드는 하나의 흐름을 가지고 있고 이것을 쓰레드라 부른다. 일반적으로 하나의 프로그램은 하나의 쓰레드를 갖는다.

## 다중 쓰레드(Mulitithreads)

![](Pasted%20image%2020231004163148.png)

하나의 프로그램에 쓰레드가 2개 이상 존재하는 것을 다중 쓰레드라고 한다. 이렇게 한 프로그램에 여러 개의 쓰레드 즉, 흐름이 있을 수 있는 이유는 쓰레드가 빠른 시간 간격으로 스위칭되기 때문이다. 이러한 동작으로 사용자는 여러 쓰레드가 동시에 실행되는 것처럼 보인다.

이 때, 동시에 수행되는 것 처럼 보이는 것을 concurrent, 실제 동시에 수행되는 것을 simultaneous라고 한다.

* concurrent
  * CPU가 하나인 환경에서 스위칭에 의해 동시에 수행
* simultaneous
  * 여러개의 CPU 환경에서 실제로 동시에 수행되는 경우

### 예시

다중 쓰레드를 사용하는 대표적인 예는 Web browser 이다. 화면을 출력하는 쓰레드와 데이터를 읽어오는 쓰레드가 기본적으로 따로 수행하고 있다. 그 외에도 Word processor, Media player 등 현재 대부분의 프로그램은 다중 쓰레드로 동작한다.

### 현대 운영체제의 Switching 단위

이전의 CPU 스케줄링에서 하나의 프로세스가 수행하다가 다른 프로세스로 넘어간다고 하였는데, 이는 예전의 방식이다. 현재 운영체제에서는 대부분 다중 쓰레드를 지원하기 때문에 하나의 프로세스 안에서 여러 쓰레드를 수행하다가 다른 프로세스로 넘어가서 그 프로세스의 쓰레드를 수행한다. 그러므로 현대 운영체제의 **context switching 단위는 프로세스가 아닌 쓰레드 단위**이다.

## Thread VS Precess

이 부분을 제대로 이해하기 위해 process를 보고오자.  
[가볍게 이해하는 컴퓨터 07: 운영 체제가 하는 일](http://127.0.0.1:4000/cs/structure/2020/03/27/컴퓨터구조-운영-체제가-하는-일.html)  
[운영체제 정리 05: 프로세스 관리](http://127.0.0.1:4000/cs/os/2020/04/01/운영체제-정리-05-운영체제-프로세스-관리.html)

프로세스는 다른 프로세스와 완전히 독립적이다. 해당 프로세스가 가지는 구조로는 Code, Data, Heap, Stack이 있다. 이 때 쓰레드는 자기가 속한 프로세스의 일부 메모리를 공유한다. 집이라면 각 개인 구성원이 거실을 공유하는 셈이다.

|공유|독립|
|::----|::----|
|Code|Stack|
|Data|PC(program counter)|
|Heap|SP(stack pointer)|
||Registers|

### Thread가 독립적 요소를 가져야 하는 이유

현대 운영체제는 결국 Context Switching의 최소단위를 thread로 잡고 있기 때문이다. 결국 CPU가 처리하는 것은 thread이고, 그렇기 때문에 현재 실행 흐름을 독립적으로 기록할 필요가 있다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
