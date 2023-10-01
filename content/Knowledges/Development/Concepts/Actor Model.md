---
title: Actor Model
thumbnail: ''
draft: false
tags:
- actor
- thread-safety
- multi-thread
created: 2023-10-01
---

# Actor Model 개요

* 객체지향의 패턴에서 메소드 호출 방식이 비동기로 변경된 패턴
* Actor들은 모두 Thread 기반으로 동작하는 객체어야 한다.
* 또한 Actor는 메시지의 전송/수신에 대한 동기화 관리까지 포함한다.
* Actor 내부에서 동기화에 대한 처리를 보장한다.

# Actor model이 풀고자하는 문제

* OOP를 생각해보자.

* method call을 하고, 내부 개체의 상태를 변경하면서 동작한다고 생각한다.
  ![](TechTalks_21_ActorModel_0.png)

* 그런데 보통 OOP 환경에서 Thread에 대해 깊은 고민을 하지는 않는다.

* 만약 위 그림을 Thread 접근까지 포함한다면 아래와 같은 그림을 가질지도 모른다.

![](TechTalks_21_ActorModel_1.png)

* 위와 같은 상태는 공유 메모리에 동시에 접근하게 되는 문제를 야기한다.
* lock과 같은 처리를 통해 임계 영역을 처리해줘야 한다.

## Lock의 문제

1. Concurrency를 제한한다.
   * Thread를 일시 정지하고 복원해야 하는데, 이는 OS 차원에서 비싼 작업이다.
1. Block된 Thread에서 어떠한 의미있는 작업을 할 수 없다.
1. Deadlock을 유발할 수 있다.

## 기존의 방식의 문제

* 기존 환경에서 Concurrency를 사용하려면, 어떠한 방식으로든 작업을 위임해야 한다.
* 이를 Task-delegate concurrency라 한다.
* 이런 경우 넘어간 작업에 대한 Error를 작업을 넘겨준 Thread쪽에서 받을 방도가 없다.
* 아예 언어 차원에서 위임된 작업에 대해서도 Error까지 처리가능하도록 하는 것이 옳다.

![](TechTalks_21_ActorModel_2.png)

# Actor Model

위의 문제로부터 다음의 것을 목표로 만들어진 것이 Actor Model이다.

1. lock에 의존하지 않고 캡슐화를 통해 동기화 문제를 처리한다.
1. Cooperative Entities 모델을 사용한다.
   * 전체 App이 서로에게 Signal을 보내고 값을 변경하면서 동작하도록 함
1. 우리가 당연하게 생각하는 방식으로 처리되도록 한다.

## 기본 구조

![](TechTalks_21_ActorModel_3.png)

* MailBox: Queue
* Message
* Behavior: Massage에 따라 행동 결정 및 실행
  * 자신의 State 변경
  * Child Actor 생성 및 제거
  * 다른 Actor에게 메시지 전송
  * 등등
* State: Actor의 실행 상태(init, ready, closed) - 자신만 변경 가능

## Lock, Blocking 대신 message 전달 방식을 사용

* 특정 메소드를 호출하는 것이 아니고, 특정 액터에게 message를 전달한다.
* 이 메시지를 전달했다는 행위 자체가 Thread 실행을 말하는 것은 아니다.
* 각 Actor는 독립적으로 받은 메시지를 수행한다.

## Error 처리

![](TechTalks_21_ActorModel_4.png)

* Actor로 만들게 되면서, 어떤 Actor가 다른 Actor를 호출했는지에 대해 알 수 있다.
* 그러면서 Hierachy가 생기게 되는데, 그 덕에 하위 Actor의 실패 여부를 부모가 알아차릴 수 있다.

## 효용

1. lock이 필요없다. 각 actor는 독립적으로 queue를 가진다.
1. actor의 상태값은 해당 객체가 가진 queue로부터 넘어오는 동작으로만 처리된다. 동시성 문제가 해결된다.

# 정리

1. Message Queue를 개체 내부에 두어 동기적 메서드 호출이 아닌 비동기적으로 수행이 가능하도록 만든 것이 Actor
1. 내부적으로 동작 주체(Thread)를 가지기 때문에 lock이 필요없다.
1. Actor끼리는 서로 메시지를 보내는 방법으로만 영향을 미칠 수 있다. 직접 변경은 불가하다.

# 이해를 위한 그림 모음

![](TechTalks_21_ActorModel_5.png)
![](TechTalks_21_ActorModel_6.png)

* 사진의 경우 [Concurrency with Actor Model(행위자 모델)](https://syntaxsugar.tistory.com/entry/Actor%EC%95%A1%ED%84%B0)를 참고했습니다.

# Reference

* [Actor model](https://en.wikipedia.org/wiki/Actor_model)
* [What problems does the actor model solve?](https://getakka.net/articles/intro/what-are-actors.html)
* [Concurrency with Actor Model(행위자 모델)](https://syntaxsugar.tistory.com/entry/Actor%EC%95%A1%ED%84%B0)
