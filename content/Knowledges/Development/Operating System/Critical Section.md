---
title: Critical Section
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# 3. 임계구역(Critical section) 문제

위의 예에서 보았던 문제를 임계구역 문제라 한다. 임계구역은 여러 개의 쓰레드가 수행되는 시스템에서 각 쓰레드들이 **공유하는 데이터(변수, 테이블, 파일 등)를 변경하는 코드 영역**을 말한다. 이는 동기화에서 중요한 문제 중 하나이다. 은행계좌 문제에서의 임계구역은 다음과 같다.

````java
void deposit(int amount) {
  balance = balance + amount;
}
void withdraw(int amount) {
  balance = balance - amount;
}
````

## 3.1 해결 방법

임계구역을 해결하기 위해서는 3가지 조건이 만족해야한다.

* Mutual exclusion(상호배타)
  * **오직 한 쓰레드만이 진입 가능**하다. 한 쓰레드가 임계구역에서 수행 중인 상태에서는 다른 쓰레드는 절대 이 구역에 접근할 수 없다.
* Progress(진행)
  * 한 임계구역에 접근하는 쓰레드를 결정하는 것은 유한 시간 이내에 이루어져야한다.
  * **누가 먼저 들어갈 것인지 빠르게 결정**해라
* Bounded waiting(유한대기)
  * 임계구역으로 진입하기 위해 대기하는 모든 쓰레드는 유한 시간 이내에 해당 임계구역으로 진입할 수 있어야 한다.
  * **기다리는 모든 쓰레드가 진입가능하도록 만들어라.**

# 4. 프로세스/쓰레드 동기화의 목적

* 원하는 결과값을 도출하도록 임계구역 문제를 해결한다.
* 프로세스의 실행 순서를 원하는대로 제어한다.
* Busy wait 등과 같은 비효율성을 제거한다.

# Reference

* [KOCW 양희재 교수님 - 운영체제](http://www.kocw.net/home/search/kemView.do?kemId=978503)
* [양희재 교수님 블로그(시험 기출 문제)](https://m.blog.naver.com/PostList.nhn?blogId=hjyang0&categoryNo=13)
* [codemcd 님의 정리글](https://velog.io/@codemcd/)
* Operating System Concepts, 9th Edition - Abraham Silberschatz
