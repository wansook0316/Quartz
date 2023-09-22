---
title: Grand Central Dispatch
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

이전 글에서 동시성에 대해서 알아보았다. 하지만 iOS에서는 Thread를 직접 생성해서 작업하지 않는다. 그러면 어떻게 동시성 프로그래밍을 가능하게 할까? 그 답인 GCD에 대해서 알아보자. 시작해보자.

해당 글은 사내 발표와 추가 정보를 기반으로 작성하였습니다.

# Grand Central Dispatch(CGD)

 > 
 > Apple이 개발한 기술로, 멀티 코어 프로세스 환경에서의 애플리케이션 지원을 최적화하기 위해서 개발되었다.

* low level C based API
* 스레드 관리의 책임을 시스템으로 이동
* 시스템이 필요한 시스템을 만들고, 해당 스레드에서 실행되도록 작업을 예약하는 방식으로 사용된다.

여기서 시스템이 관리하는 Queue가 있는데, 이걸 **Dispatch Queue**라 한다. 이 Queue에 하고 싶은 작업을 정의해서 여기에 추가하기만 하면 된다.

# Dispatch Queue

* 큐에 작업을 제출하는 구조
  * FIFO 구조, 추가된 순서대로 작업이 시작됨
* 작업은 함수 또는 Block(clousure in swift)로 표현한다.
* Dispatch Queue에 제출된 작업은 시스템에서 관리하는 스레드 풀에서 실행된다.
* 작업을 **순차적으로 또는 동시에 실행이 가능**하다
  * 이 부분은 위의 면접관 예시에서, 줄 자체를 한개로만 세울 것인지, 여러줄로 세울 것인지에 대응되는 부분이다.
  * Serial
    * 작업을 순차적으로 처리하고 싶은 경우
  * Concurrent Dispatch Queue
    * 동시에 실행하고 싶은 경우
* 작업을 동기적으로 혹은 비동기적으로 스케쥴링할 수 있다.
  * 동기적으로 스케쥴링 한 경우, 해당 작업이 실행을 마칠 때가지 코드대기
  * 비동기적으로 스케쥴링 한 경우, 해당 작업이 실행 중에도 코드 실행 

## Serial Dispatch Queue

* 큐에 작업이 추가된 순서로 한 번에 하나의 작업만 실행
* 이전 작업이 완료될 때까지 새 작업을 시작하지 않고 대기
* 만약 두 개 이상의 Serial Queue가 있다면, 최대 2개의 작업을 동시에 실행할 수도 있음
  * 물리적 의미
  * 하드웨어 코어수에 따라 병렬 수행 제한이 있을 수 있음

생성 방법으로는 2개가 있다. 바로 main queue를 사용하거나, custom queue를 사용하거나.

* Main Queue
  * `DispatchQueue.main`
* Custom Queue
  * `DispatchQueue(label: "customSerial")`

여기서 해당 Queue를 동기적으로, 비동기적으로 수행하도록 옵션을 걸 수 있다.

### Serial Sync Dispatch Queue

````swift
let queue = DispatchQueue(label: "SerialSyncQueue")

queue.sync {
    print("task 1")
}
queue.sync {
    print("task 2")
}
queue.sync {
    print("task 3")
}
print("Done!")

/*
Result
task 1
task 2
task 3
Done
*/
````

* queue에 들어간 작업을 우선적으로 처리하면서 동작을 끝나길 기다리기 때문에 호출 순서가 단방향이다.

### Serial Async Dispatch Queue

````swift
let queue = DispatchQueue.main

queue.async {
    print("task 1")
}
queue.async {
    print("task 2")
}
queue.async {
    print("task 3")
}
print("Done???")

/*
Done??
Result
task 1
task 2
task 3
*/
````

* 해당 코드가 실행되는 main thread에 작업을 비동기적으로 추가하여, 현재 코드를 읽는 작업 뒤에 스케쥴링이 되도록 만들었다.
  * Out \<- 코드 읽기 task - task 1 - task 2 - task 3 \<- In
* 만약 custom serial queue로 한다면 병렬적으로 작업이 실행되기 때문에 상황에 따라 결과가 다르다.
* async로 설정한 경우, 해당 블락을 실행하지 않고 제어권을 넘겨주게 된다.
* 그래서 라인을 모두 읽고 해당 블락을 순차적으로 실행시켜 위와 같은 결과가 나온다.

`async` 외에도 `asyncAfter` 메서드도 있다. 

* Dispatch Time
  ````swift
  DispatchQueue.main.asyncAfter(deadline: .now() + 2.0, execute: {
      print("Executes after 2 seconds")
  })
  ````
  
  * 나노초 정밀도로 시스템 Clock에 상대적인 시점
* Dispatch Wall Time
  ````swift
  DispatchQueue.main.asyncAfter(wallDeadline: .now() + 2.0, execute: {
      print("Executes after 2 seconds")
  })
  ````
  
  * 마이크로초 정밀도로 Wall Clock에 절대적인 시점
  * 5분 타이머 걸고, system 시간을 5분뒤로 설정해버리면 바로 타이머 작동

## Concurrent Dispatch Queue

* 하나 이상의 작업을 동시에 실행 (작업이 물리적 스레드로 순차적으로 나가는 시간은 있음)
* 하지만 시작은 큐에 추가된 순서로 시작
* 작업이 완료되지 않았더라도 Dequeue한다. 물리적 코어가 남아있을 경우, 앞 작업을 1번 코어에, 그 뒤 작업은 2번 코어에 넘기면 되기 때문이다.
* 특정 시점에서 실행되는 물리적 작업 수는 가변적이고 시스템 환경에 따라 다름

생성 방법은 역시 2개가 있다.

* Global Queue
  * `DispatchQueue.global()`
* Custom Queue
  * `DispatchQueue(label: "CustomConcurrentQueue", attributes: .concurrent)`

### Concurrent Sync Dispatch Queue

````swift
let queue = DispatchQueue.global()

queue.sync {
    print("task 1")
}
queue.sync {
    print("task 2")
}
queue.sync {
    print("task 3")
}
print("Done!")

/*
Result
task 1
task 2
task 3
Done
*/
````

concurrent queue로 작업들이 들어가게 되고, concurrent queue에 sync로 작업이 들어갔기 때문에 각각의 task가 서로 다른 물리적 코어에도 작동하더라도(우연히 같은 코어일수도 있음) 각 결과를 받은 후에 동작한다.

### Concurrent Async Dispatch Queue

````swift
let queue = DispatchQueue.global()

queue.async {
    print("task 1")
}
queue.async {
    print("task 2")
}
queue.async {
    print("task 3")
}
print("Done???")

/*
Result
task 2
task 1
task 3
Done???
*/
````

현재 결과는 이렇지만, 각 task가 queue에 들어간 후, 시스템 환경과 현재 코어 활성도에 따라 동작하는 순서가 달라진다. 즉 결과를 보장받을 수 없다.

## 사용 패턴

* Serial Queue(async) + Main Queue
  ````swift
  let queue = DispatchQueue(label: "serial.queue")
  
  queue.async {
      // Do Some Long-Running Task
  
      DispatchQueue.main.async {
          // Update UI
      }
  }
  ````

* Concurrent Queue(async) + Main Queue
  ````swift
  DispathQueue.global().async {
      // Do Some Long-Running Task
  
      DispatchQueue.main.async {
          // Update UI
      }
  }
  ````

## Quality of Service (QoS)

 > 
 > Apple에서 제공하는 작업의 명시적인 분류

이 분류는 작업 스케쥴링 시, 작업의 타입에 따라 우선순위를 다르게 하기 위함이다. 아래는 우선 순위에 따른 분류이다. 우선순위가 높을 수록 더 많은 리소스로 더 빠르게 수행한다. 지정은 Queue를 만들 때, 파라미터로 입력 가능하다.

* User Interactive
  * 사용자와 상호작용이 필요할 때 사용
  * animations
* User Initiated
  * 사용자가 무언가 작업을 하여 즉각적인 결과가 필요할 때 사용
* Utility
  * 데이터 다운로드와 같이 작업 완료에 오랜시간이 걸리는 경우
  * 대부분의 작업에서 사용
* Background
  * 동기화 및 백업과 같이 사용자가 볼 수 없는 작업을 할 때 사용
  * 아이폰은 저전력 모드로 설정한 경우, 작업 실행이 되지 않을 수도 있다.

QoS를 지정하지 않으면 default로 지정되는데, default는 User Initiated와 Utility 사이에 존재하는 중요도를 가진다.

## Dispatch Work Item

 > 
 > DispatchQueue 또는 DispatchGroup 안에서 수행할 작업을 캡슐화 함

item내에서 실행가능하고, dispatchQueue로 넘겨서 실행이 가능하다.

````swift
let item = DispatchWorkItem(block: {
    print("task?")
})

item.perform() // 현재 스레드에서 작업을 동기적으로 수행
````

item내에서 perform으로 수행하는 경우, 동기적으로 수행하기 때문에 작업 결과를 기다려야 한다.

````swift
let item = DispatchWorkItem(qos: .utility, block: {
    print("task")
})

DispatchQueue.global().async(execute: item)
````

혹은 이렇게 Queue안에 item 자체를 넣어서 실행도 가능하다. 이경우는 Queue를 지정하기 때문에 결과를 기다리지 않아도 된다.

### wait

````swift
let item = DispatchWorkItem(block: {
    for _ in 0..<100 {
        print("task")
    }
})

DispatchQueue.global().async(execute: item)

item.wait()
// 작업 끝날 때까지 기다림
print("Done!")
````

작업을 global queue로 넘기고 제어권을 넘겨받은 상태에서도 넘긴 작업 (다른 스레드에서 작업중)을 기다릴 수 있다. `wait` 메서드를 사용하면 된다.

### notify

````swift
let item = DispatchWorkItem(block: {
    for _ in 0..<100 {
        print("task")
    }
})

DispatchQueue.global().async(execute: item)

item.notify(queue: .main, execute: {
    print("Done!")
})

print("task is running...")
````

`notify`메서드를 사용하면, 다른 스레드에서 동작하고 있는 작업이 끝난 경우, 설정해둔 작업을 실행할 수 있다.

### cancel

````swift
let item = DispatchWorkItem(block: {
    for _ in 0..<100 {
        print("task")
    }
})

item.cancel()
print(item.isCancelled) // true

DispatchQueue.global().async(execute: item) // 동작하지 않음
````

**아직 작업이 수행되지 않은 경우** `cancel` 메서드를 사용하여 작업을 취소할 수 있다. 취소된 경우 스케쥴링 되어도 동작하지 않는다.

## Dispatch Group

 > 
 > 하나 이상의 작업 실행이 완료될 때까지 스레드를 차단하는 방법

한 화면을 구성하기 위해 여러 API 호출, Model로 파싱해야 하는 경우, 하나의 작업 그룹으로 묶는 것이 좋다. 이런 경우 사용하면 좋다. 여러 작업은 그룹에 연결하고, 비동기 실행을 위해서 예약하는 방식으로 사용할 수 있다. 모든 작업이 끝난 후, Completion Handler를 통해 완료 동작을 실행할 수 있다.

### Enter/Leave

````swift
let group = DispatchGroup()
group.enter()
group.leave()
````

여러 작업이 있을 때, 시작하는 시점에서 enter, 작업이 끝났을 때 leave를 해주게 되면, enter 아래의 코드 블럭을 하나로 묶을 수 있다. 한 쌍으로 움직인다. enter할 경우 들어간 task count +1하고 leave할 때 -1 한다.

### Wait (Synchronous)

````swift
let group = DispatchGroup()

group.enter()
DispatchQueue.global().async {
    for _ in 0..<100 {
        // some code
    }
    print("task 1 is done")
    group.leave()
}

group.enter()
DispatchQueue.global().async {
    for _ in 0..<100 {
        // some code
    }
    print("task 2 is done")
    group.leave()
}

group.wait()
print("all tasks are done")
````

dispatchGroup에 wait를 적어주게 되면, enter로 들어간 task들의 작업이 모두 끝난 시점에 다음 라인으로 넘어간다.

### Notify (Asynchronous)

````swift
let group = DispatchGroup()

group.enter()
DispatchQueue.global().async {
    for _ in 0..<100 {
        // some code
    }
    print("task 1 is done")
    group.leave()
}

group.enter()
DispatchQueue.global().async {
    for _ in 0..<100 {
        // some code
    }
    print("task 2 is done")
    group.leave()
}

group.notify(queue: .main, execute: {
    print("All tasks are done.")
})
print("passed the notify code line.)
````

notify를 사용하게 되면, enter로 들어간 task들의 결과가 다 작동할 때 코드 블락이 실행되나, wait처럼 동기적으로 대기하지 않는다. 비동기로 코드 블락이 실행된다.

### Without Enter/leave

````swift
let group = DispatchGroup()

DispatchQueue.global().async(group: group, execute: {
    for _ in 0..<100 {
        // some code
    }
    print("task 1 is done")
})

DispatchQueue.global().async(group: group, execute: {
    for _ in 0..<100 {
        // some code
    }
    print("task 2 is done")
})

group.notify(queue: .main, execute: {
    print("All tasks are done.")
})
print("passed the notify code line.)
````

파라미터에 group 자체를 넘김으로써 같은 효과를 낼 수 있다. 보다 코드가 깔끔하다.

## Dispatch Source

 > 
 > 시스템 이벤트를 비동기적으로 처리하기 위한 C기반 메커니즘

* 모니터링 할 이벤트와 해당 이벤트를 처리하는 데 사용할 DispatchQueue 및 코드를 지정한다.
* 이벤트 도착 시 지정한 큐에서 이벤트 핸들러를 실행한다.

무슨 말일까..? 읽어서는 알 수가 없다.

* Timer Dispatch Sources
  * 주기적인 알림을 생성
* Signal Dispatch Sources
  * UNIX Signal이 도착하면 알림
* Memory pressure sources
  * 메모리 사용 상태가 변경될 때 알림
* Descriptor sources
  * 파일 및 소켓 기반 작업 알림
* Process dispatch sources
  * 프로세스 관련 이벤트 알림
* Mach port dispatch sources
  * Mach 관련 이벤트 알림
* custom dispatch sources
  * 직접 설정 후 트리거

### 예시

````swift
let source = DispatchSource.makeTimerSource(queue: .main) 

source.setEventHandler {
    print("main queue에서 1초 뒤에 실행됨")
}

source.schedule(deadline: .now(), repeating: 1.0)
source.activate()
````

1. Source를 만든다. 이 때 Queue를 지정해준다.
1. 그리고 어떤 작업을 실행할 것인지 핸들러를 설정해준다.
1. 스케쥴링 조건을 선택한다.
1. 실행한다.

# 정리

* DispatchQueue
  * Serial, Concurrent Queue가 존재한다.
  * 각각을 동기, 비동기적으로 작동하게 할 수 있다.
* DispatchWorkItem
  * dispatchQueue안에서 작동할 작업을 캡슐화 할 수 있다.
* DispatchGroup
  * 여러 작업들을 묶어서 관리할 수 있다. Block시켜서 동작시킬 수 있다.
* DispatchSource
  * 시스템 이벤트를 비동기적으로 처리하기 위한 메커니즘이다.

다음 글에서는 Operation Queue에 대해서 알아보도록 하자.

# Reference

* [Grand Central Dispatch](https://developer.apple.com/documentation/DISPATCH)
