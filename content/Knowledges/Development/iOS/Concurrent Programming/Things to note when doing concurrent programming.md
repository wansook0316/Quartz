---
title: Things to note when doing concurrent programming
thumbnail: ''
draft: false
tags:
- NSLock
- concurrency
- Dispatch-Barrier
- deadlock
- semaphore
created: 2023-09-22
---

이제 우리는 동시성 프로그래밍을 할 수 있다! 필요한 내용들을 어느정도 배웠다고 할 수 있다. 하지만, 동시성 프로그래밍이 어려운 이유는 별도의 작업흐름으로 공유 데이터에 접근하면서 발생하기 때문이다. 이러한 부분에서 어떤 문제를 우리가 마주할 수 있는지, 그리고 어떻게 해결할 수 있는지 알아보는 시간을 가져보자.

해당 글은 사내 발표와 추가 정보를 기반으로 작성하였습니다.

# Race Condition

 > 
 > 두 개 이상의 스레드가 공유 데이터에 액세스할 수 있고, 동시에 변경하려고 할 때 발생

상호 배제를 사용하여 해결할 수 있다.

## NSLock

 > 
 > 전역 데이터에 대한 접근을 중재하거나, 임계영역을 보호하여 "원자적"으로 실행되도록 할 때 사용

임계 영역에 접근했을 때, 해당 코드를 다른 스레드가 접근하지 못하도록 하는 것. 락을 해제한 뒤에 공유 데이터에 접근이 가능하다.

````swift
class MyObject {
    private var value = 0
    private var lock = NSLock()

    func increase() {
        lock.lock()
        value = value + 1
        lock.unlock()
    }

    func decrease() {
        lock.lock()
        value = value - 1
        lock.unlock()
    }
}
````

## Dispatch Semaphore

 > 
 > 리소스에 동시에 접근하는 작업의 수를 조절

signal 메서드를 호출하면 count가 증가하고, wait 메서드를 호춣하면 감소한다.

````swift
let queue = DispatchQueue(label: "semaphore", attributes: .concurrent)
let semaphore = DispatchSemaphore(value: 3)

for index in 0..<100 {
    queue.async {
        semaphore.wait()
        print("task \(index)")
        sleep(1)
        semaphore.signal()
    }
}
````

Concurrent Queue에 작업을 100개 넣었다. 이런 경우, 시스템 환경에 따라 배정된 물리적 스레드의 개수만큼 최대 병렬적으로 작업이 실행되고 마치는 것이 일반적이다. 그런데 여기에 semaphore를 3으로 잡고, `wait`, `signal`로 임계 영역에 들어갈 때마다 count를 변경해주었다. 똑같이 물리적 스레드에 작업이 병렬적으로 들어가는 것은 맞으나, 해당 작업이 끝나자마자 실행이 될수는 없다. semaphore로 index에 접근후 출력하는 코드를 block시켰기 때문이다.

그 결과 3개의 작업이 각 물리 스레드로 병렬적으로 들어가고, 모두 실행이 된 뒤 다음 작업이 물리 스레드에 3개가 배치되고, 물리 스레드가 남아서 다음 작업이 배치되더라도 `semaphore.wait`에서 더 낮출 count가 없어서 대기하게 된다.

결과적으로 `1, 2, 3`, `4, 5, 6` 과 같이 3개의 값들이 한번에 1초마다 출력되는 것처럼 보일 것이다.

## Serial Dispatch Queue

 > 
 > 큐에 작업이 추가된 순서대로 한번에 하나의 작업만 실행

이전에 배웠던 SerialQueue로 이 문제를 해결할수도 있을 것이다.

````swift
class MyObject {
    private var value = 0
    private let internalQueue = DispatchQueue(label: "SerialQueue")

    func increase() {
        internalQueue.async {
            self.value = self.value + 1
        }
    }

    func decrease() {
        internalQueue.async {
            self.value = self.value - 1
        }
    }
}
````

이렇게 내부적으로 Serial Queue를 하나 두고, 여기에 작업을 던지는 방식으로 구현하면 문제 생길 요지가 없다.

````swift
class MyObject {
    private var internalState: Int
    private let internalQueue = DispatchQueue(label: "serial")

    var state: Int {
        get {
            return internalQueue.sync { internalState }
        }

        set (newState) {
            internalQueue.sync { internalState = newState }
        }
    }
}
````

만약 여기서 async로 작업을 던지고 제어권을 받길 원하지 않는다면, 즉 동기적으로 동작하고 싶다면 `.sync` 메서드를 사용하면 된다. 만약 위와 같은 상황에서 async를 사용하면 좋지 않다. 아예 Thread safe하게 코드를 짜는 것이 좋은 거다.

보통 Serial Dispatch Queue나 `.sync` 메서드를 사용한다.

## Dispatch Barrier

![](ConcurrentProgramming_04_ThingsToNoteWhenDoingConcurrentProgramming_0.jpg)

 > 
 > DispatchQueue에서 하나 이상의 작업 실행을 동기화

이전에 제출된 모든 작업이 실행을 마칠 때까지 Barrier Block 내부, 그리고 이후에 제출된 모든 작업의 실행을 지연한다. 이건 말이 너무 어렵고

````swift
class MyObject {
    private var internalState: Int
    private let internalQueue = DispatchQueue(label: "barrier", attributes: .concurrent)

    var state: int {
        get {
            return internalQueue.sync { internalState } // concurrent queue이더라도, 즉 물리적 스레드 어느곳에 들어가더라도 해당 결과를 받지 않으면 라인이 안넘어감
        }

        set (newState) { // 하지만 
            internalQueue.async(flags: .barrier, execute: { [unowned self] in
                self.internalState = newState
            })
        }
    }
}
````

생산자 소비자 패턴에 적절하다. queue를 concurrent하게 세팅하고, setter에서 새로운 값을 쓸 때, async로 변경했다. 그런데 그 안에 parameter로 `.barrier`를 적용해주었다. barrier task로 정의하여 사용하면, 순간적으로 해당 작업이 끝날 때까지 serial queue처럼 동작한다. 즉, concurrent로 queue가 지정되어 있지만, setting에 있어서는 serial로 동작한다는 것. 지금은 state에 set밖에 없지만 만약 다른 함수들은 concurrent하게 동작하는 것이 좋을 경우, barrier를 사용하여 setter의 동작을 thread safe하게 처리할 수 있다. custom queue에서만 사용가능하다고 한다.

좀 더 직관적인 이해를 돕는 코드를 하나 가져왔다.

````swift
let myQueue = DispatchQueue(label: "myQueue", attributes: .concurrent)

for i in 1...5 {
  myQueue.async {
      print("\(i)")
  }
}

myQueue.async(flags: .barrier) {
  print("barrier!!")
  sleep(5)
}

for i in 6...10 {
  myQueue.async {
      print("\(i)")
  }
}

/*
2
1
4
5
3
barrier!!
10
7
8
9
6
*/
````

갑자기 barrier 가 추가될 때, 동작을 멈추고 해당 코드를 실행한 뒤 다시 원상복귀돔을 알 수 있다.

# Deadlock

 > 
 > 두 개 이상의 작업이 서로 상대방의 작업이 끝나기 만을 기다리고 있는 상태

상호 배제를 통해 race condition은 막을 수 있을지 모르지만 부작용으로 교착 상태에 빠질 수 있다. 특정 작업을 하기 위해 x, y 접근해야 하는데, x, y를 서로다른 두개의 스레드에서 각각 lock을 걸어둔다면, 두 스레드 모두 작업이 불가한 상태가 발생한다.

## Serial Dispatch Queue + Sync

````swift
let queue = DispatchQueue(lable: "deadlock")

queue.sync {
    queue.sync {
        // Deadlock
    }
}
````

![](ConcurrentProgramming_04_ThingsToNoteWhenDoingConcurrentProgramming_1.jpg)

내부 작업이 끝나야 바깥 작업을 실행시킬 수 있고, 코드가 진행된다. 하지만 내부에 sync 메서드가 있어서 실행하려고 보니, 바깥 block이 진행되지 않아 내부 작업을 실행시킬 수 없다. 교착상태에 빠진다. serial queue를 사용했기 때문에 하나의 작업씩만 가능하기 때문에 문제가 발생한다.

````swift
let queue = DispatchQueue(lable: "deadlock")

queue.async {
    queue.sync {
        // Deadlock
    }
}
````

![](ConcurrentProgramming_04_ThingsToNoteWhenDoingConcurrentProgramming_2.jpg)

일단 제어권은 받아서 코드가 내려가려 한다. 그런데, 이제 실제로 작업이 들어간 Queue에서는 상황이 다르다. 내부 task를 진행해야 바깥 task가 진행할 수 있고, 반대로 내부 task가 수행되기 위해서는 바깥 task가 종료되어야 한다.

````swift
DispatchQueue.main.sync {
    // Deadlock
}
````

코드 라인은 main thread에서 읽는데, 안쪽이 실행되어야 바깥쪽이 실행되고, 바깥쪽은 안쪽이 다 실행되야 나갈 수 있기 때문에 동작하지 않는다.

## Operation Queue + Dependencies

````swift
let operationA = BlockOperation {
    print("operationA")
}

let operationB = BlockOperation { 
    print("operationB")
}

let queue = OperationQueue()
operationA.addDependency(operationB)
operationB.addDependency(operationA)
queue.addOperations([operationA, operationB], waitUntilFinished: true)
````

Operation을 서로 종속으로 만들어 두어, 서로 완료되기를 기다리는 상황이 발생한다.

# Dispatch Precondition

 > 
 > 실행에 필요한 Dispatch 조건을 확인할 수 있다.

이런 상황 자체를 막기 위해 사용할 수 있는 함수이다.

````swift
dispatchPrecondition(condition: .onQueue(DispatchQueue))
dispatchPrecondition(condition: .notOnQueue(DispatchQueue))
dispatchPrecondition(condition: .onQueueAsBarrier(DispatchQueue))
````

뒤의 파라미터에 조건에 맞지 않는 경우 프로그램 실행을 중지해버린다.

````swift
class DispatchPreconditionExample {
    func executeTaskOnMainQueue() {
        dispatchPrecondition(condition: .onQueue(.main))

        print("메인 큐에서 실행 안되고 있는데요?")
    }
}

let example = DispatchPreconditionExample()
let queue = DispatchQueue.global()

queue.async {
    example.executeTaskOnMainQueue() // Error
}
````

# 정리

* Race Condition 발생할 수 있다. 보통 Serial 방식으로 처리한다.
* Deadlock 발생할 수 있다. 상황을 알아두어야 한다.
* DispatchPrecondition으로 해당 작업이 어느 queue에서 일어나는지 알 수 있다.

# Reference

* [DispatchQueue sync vs sync barrier in concurrent queue](https://stackoverflow.com/questions/58236153/dispatchqueue-sync-vs-sync-barrier-in-concurrent-queue)
* [Grand Central Dispatch Tutorial for Swift 4: Part 1/2](https://www.raywenderlich.com/5370-grand-central-dispatch-tutorial-for-swift-4-part-1-2)
* [DispatchWorkItemFlags](https://developer.apple.com/documentation/dispatch/dispatchworkitemflags)
* [barrier](https://developer.apple.com/documentation/dispatch/dispatchworkitemflags/1780674-barrier)
