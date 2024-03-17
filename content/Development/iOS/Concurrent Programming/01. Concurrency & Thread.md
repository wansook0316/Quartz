---
title: Concurrency & Thread
thumbnail: ''
draft: false
tags:
- concurrency
- thread
- parallelism
created: 2023-09-22
---

동시성은 이제 프로그래밍에서 빼놓을 수 없는 요소가 되었다. 항상 동시성과 같이 나오는 병렬성은 무엇이 다를까? 그리고 어떻게 동시성 프로그래밍을 할 수 있을까? iOS 애플리케이션을 만들때는 어떤 경우에 사용할 수 있을까? 다양한 것들에 대해 알아보기 이전에, iOS에서의 Thread에 대해 알아보자. 

해당 글은 사내 발표와 추가 정보를 기반으로 작성하였습니다.

# [Concurrency](Development/Concepts/Concurrency.md)

 > 
 > 동시에 일어나는 여러가지 일

애플리케이션의 여러부분을 동시에 실행 가능하도록 한다. 하지만! 이는 논리적인 개념이다. 즉, 동시에 처리되는 것처럼 보이게 한다는 것. 그럼 정말 병렬로 일어나는 행위를 뭐라고 부를까? 이미 알고 있다. [Parallelism](Parallelism.md) 이라 한다. 멀티코어 환경에서는 정말 병렬로 실행될 수도 있을 것이다.

![](ConcurrentProgramming_01_ConcurrencyThread_0.jpg)

여기서 핵심은 면접관 수에 관계없이, **면접자들을 여러줄로 나누어서 면접장에 들여보냈다**는 것이다. 여기서 면접관은 실제 물리 스레드라고 생각할 수 있고, 줄을 세워서 처리하는 것은 동시성을 만족하도록 구성하는 방식이라 생각할 수 있다.

# Thread

* 코드에 대한 별도의 작업 흐름
* iOS 제공 Thread
  * Cocoa Thread
  * POSIX Thread

## Thread Class 사용하여 만들기

두가지 방법으로 사용할 수 있다.

````swift
let example = Thread { print("task is running on \(Thread.current)")}
example.start()
````

먼저, 이렇게 closure로 실행하고 싶은 구문 자체를 넘겨서 처리할 수 있다. 

````swift
class ThreadExample {
    init() {}

    func start() {
        Thread.detachNewThreadSelector(#selector(executeTask), toTarget: self, with: nil)
    }

    @objc
    private func executeTask() {
        print("Task is running on \(Thread.current))
    }
}

let example = ThreadExample()
example.start()
````

두번째로는 Class를 만들고, 스레드 만드는 코드 작성후, 동작하고 싶은 함수를 넘겨서 처리할 수 있다. 이렇게 만들어진 스레드의 리소스는 스레드가 종료되는 시점에 시스템에 의해 자동으로 회수된다.

## NSObject를 사용하여 Thread 만들기

````swift
class ThreadExample: NSObject {
    func start() {
        self.performSelector(inBackground: #selector(executeTask), with: nil)
        // 또는..
        self.performSelector(onMainThread: #selector(executeTask), with: self, waitUntilDone: true)
    }

    @objc
    private func executeTask() {
        print("Task is running on \(Thread.current)")
    }
}

let example = ThreadExample()
example.start()
````

`performSelector` 메서드를 사용하여 처리할 수도 있다. 지정한 메서드는 main thread 위에서 실행되게 된다.

# Thread로부터 멀어지자.

![](ConcurrentProgramming_01_ConcurrencyThread_1.jpg)

하지만 iOS에서는 이렇게 직접 스레드를 만들어서 프로그래밍하는 것을 권장하지 않는다. 

1. 응용 프로그램의 스레드 수는 현재 시스템 로드 및 하드웨어에 따라 동적으로 변경될 수 있다.
1. 애플리케이션에서 수행되는 작업량도, 변화하는 시스템 상태에 맞게 동적으로 확장가능해야 함

즉, 시스템 상태가 바뀜에 따라 어플리케이션이 동적으로 스레드의 숫자를 결정해야 한다는 말. 적절한 스레드 수를 안다고 하더라도, 많은 스레드를 생성하고 풀링(사용한 스레드 객체를 스레드 풀에 저장해두었다가 다시 꺼내쓰는 개념)해야 한다. 이런 부분의 관리가 필요하기 때문에 어렵다. 즉 스레드 관리 부담을 져야한다는 것이다.

하지만 이러한 부분에서 올바른 스레딩 솔루션을 구현하는 것이 매우 어렵다. 그래서 iOS는 스레드에 의존하는 대신, 동시성 문제를 해결하기 위해 비동기적인 접근 방식을 채택했다. 즉, 비동기적으로 프로그래머는 함수를 호출하고, 내부적으로 스레드 풀에서 스레드를 가져와서 작업한 후, 작업이 끝난 후에 Callback으로 호출자에게 결과를 던져주는 방식이다.

이를 통해, 스레드를 직접 관리하지 않고도 모든 작업을 비동기적으로 수행할 수 있는 기술을 제공한다. 

* **Grand Central Dispatch(GCD)**
* **Operation Queue**

# 정리

* concurrency와 parallelism은 다르다. 논리적, 물리적 구분이 있다.
* Thread를 만들어서 처리가 가능하다. 하지만 이렇게 하지 않는다.
* Thread 관리가 상당히 복잡하고 문제 소지가 많기 때문. 그래서 Apple이 제공하는 GCD, Operation Queue가 있다.

다음 글에서는 GCD에 대해서 알아보도록 하자.

# Reference

* [Thread](https://developer.apple.com/documentation/foundation/thread)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
