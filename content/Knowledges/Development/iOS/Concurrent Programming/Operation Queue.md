---
title: Operation Queue
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

동시성 프로그래밍을 위해 apple에서는 GCD라는 것을 제공한다는 사실을 이제 우리는 알고 있다. 그런데, 이외에 다른 방법이 하나 더있다. 바로 Operation Queue이다. 조금더 고수준의 API로 설계된 Operation Queue는 복잡한 작업들을 수행할 때 많이 사용하곤 한다. 그럼, 구체적으로 어떤 장점이 있는지 확인해보도록 하자.

해당 글은 사내 발표와 추가 정보를 기반으로 작성하였습니다.

# Operation Queue

 > 
 > GCD를 기반으로 구현된 Objective-c class로, 고수준의 DispatchQueue이다.

GCD와 마찬가지로 Thread 직접 생성 대신, 특정 작업을 정의하고 Queue에 제출하여 시스템이 이를 수행하도록 하는 방식으로 동작한다. Operation이라는 클래스를 통해 수행할 작업을 정의하고, OperationQueue에 제출하면, **Operation 객체의 우선 순위 및 준비 상태에 따라 대기중인 Operation을 실행**한다. 상당히 DispatchQueue와 유사함을 알 수 있다.

DispatchQueue와 다른 점은, **동시에 실행할 수 있는 Operation의 최대 갯수를 지정할 수 있다**는 점이다. 또한 아직 실행이 되지 않은 Operation을 매우 쉽게 취소할 수 있다. GCD의 경우, DispatchWorkItem에서 cancel 메서드를 활용했었다. 즉 해당 Item에서 접근했어야 했는데, Operation Queue의 경우 `queue.cancelAllOperations()` 라는 메서드로 한번에 가능하다.

Operation Queue 생성 방법은 GCD와 마찬가지로 2가지가 있다.

* Main Queue
  * `OperationQueue.main`
  * main thread 실행
* Concurrent Queue (Default)
  ````swift
  let queue = OperationQueue()
  queue.maxConvurrentoperationCount = OperationQueue.defaultMaxConcurrentOperationCount
  ````
  
  * `maxConvurrentoperationCount` 변수에 숫자를 넣으면 한번에 n개씩 빠져나가게 된다.
  * `maxConvurrentoperationCount`를 1로 설정하면 serial Queue의 동작을 하게된다.

Operation 추가의 겨웅 아래와 같은 API가 있다.

````swift
let queue = OperationQueue()
queue.addOperation(op: Operation)
queue.addOperation(block: () -> Void)
queue.addOperations(ops: [Operation], waitUntilFinished: Bool)
````

## KVO-Compliant Properties

OperationQueue 클래스는 여러 Property에 대해 Key-value Coding 및 Key-value Observing을 준수한다. KVO는 이후 알아보고, 일단 가능한 property를 보면

* operations: ~~Deprecated~~
  * 들어가 있는 Operation들
* operationCount: ~~Deprecated~~
  * Operations의 개수
* maxConcurrentOperationCount: readable, writeable
  * 동시에 실행할 수 있는 최대 작업수
* isSuspended: readable, writeable
  * Queue의 일시 중단 여부
* name: readable, writable
  * 해당 Queue의 이름

````swift
let queue = OperationQueue()

let observation = queue.observe(\.isSuspended, changeHandler: { operation, _ in
    print("isSuspended: \(operation.isSuspended)")
})

queue.isSuspended = true
````

OperationQueue의 issuspended Property를 관찰할 수 있다.

### Key-Value Coding (KVC)

 > 
 > 문자열 식별자를 사용하여 객체의 프로퍼티에 간접적으로 액세스하기 위한 메커니즘

objective runtime에 의존하기 때문에 `NSObject` 상속과, `@objc` annotation을 적어주어야 한다.

````swift
class KVC: NSObject {
    @objc var value: Int

    override init() {
        value = 999
        
        super.init()
    }
}

let kvc = KVC()
print(kvc.value(forKey: "value")) // Optional(999)

kvc.setValue(5, forKey: "value") // setting value for Optional(5)

// Swift 4 KeyPath
print(kvc[KeyPath: \KVC.value]) // 5

````

문자열로 처리하는 것이기 때문에, 알겠지만 런타임으로 처리한다. 그래서 상당히 유연하다. 반대로 말하면 오류가 날 가능성도 높다.

### Key-Value Observing (KVO)

 > 
 > 다른 객체의 특정 프로퍼티에 대한 변경 사항을 알림 받을 수 있는 메커니즘

KVC를 사용하여 objective-c runtime에서 간접적으로 특정 property에 접근하기 때문에, `NSObject` 상속과, `@objc`, `dynamic` annotation을 붙여서 런타임에 노출 시켜야 한다.

````swift
class KVO: NSObject {44
    @objc dynamic var value = 0
}

let kvo = KVO()

let observation = kvo.observe(\.value, changeHandler: { kvo, _ in
    print(kvo.value)
})

kvo.value = 99 // 값이 변경되었을 때, 출력됨
````

`observe` 메서드를 통해서 변경을 알림 받고 싶은 변수를 명시하고, 콜백으로 정의하여 사용하면 된다.

# Operation

 > 
 > 수행하려는 작업을 캡슐화하는 Objective-C 기반 추상 클래스

추상 클래스이기 때문에 직접 사용하지 말고 Subclass를 사용하거나, 시스템 정의 Subclass 중 하나를 사용해야 한다.

* BlockOperation
* Subclassing

OperationQueue와 함께 사용하거나, 단독으로 사용할 수 있다. 그리고 단독으로 사용하는 경우 sync(default), async로 실행되도록 작업 설계가 가능하다.

## KVO-Compliant Properties

Operation 클래스는 여러 Property에 대해 KVC 및 KVO를 준수한다.

* isCancelled: read-only
* isAsynchronous: read-only
* isExecuting: read-only
* isFinished: read-only
* isReady: read-only
* dependencies: read-only
* queuePriority: readable, writable
* completionBlock: readable, writable

````swift
let operation = BlockOperation(block: {
    print("task")
})

let observation1 = operation.observe(\.isExecuting, changeHandler: { operation, _ in
    print("isExecuting: \(operation.isExecuting)")
})

operation.start()
````

## Operation Life Cycle

* pending
* Ready
* Executing
* Finished
* Cancelled
  * Bool Property

````swift
let operation = BlockOperation(block: {
    print("task")
})

let observation = operation.observe(\.isCancelled, changeHandler: { operation, _ in 
    print("isCancelled: \(operation.isCancelled)")
})

operation.cancel() // isCancelled: true
operation.start()
````

cancel 이후에는 start하더라도 값이 실행되지 않는다.

## Block Operation

 > 
 > 하나 이상의 블록 객체에 대한 Wrapper 역할을 하는 Operation의 Subclass

````swift
let operation1 = BlockOperation {
    print("task1")
}

let operation2 = BlockOperation {
    print("task2")
}

let operation3 = BlockOperation {
    print("task3")
}

operation1.start()
operation2.start()
operation3.start()
````

Operation을 단독으로 쓰는 경우 기본적으로 sync로 돌아간다고 했다. 그러므로 순차적으로 1, 2, 3으로 결과가 나온다. 즉, 각각의 제어권을 내놓지 않는다.

````swift
let operation = BlockOperation { 
    for _ in 0..<100 {
        print("task 1")
    }
}

operation.addExecutionBlock {
    for _ in 0..<100 {
        print("task 2")
    }
}

operation.start()
````

`addExecutionBlock` 메서드를 통해 더 많은 블럭을 추가할 수 있다. 여기서 중요한 것은 추가된 각 block들은 **Concurrent하게 동작**한다. 즉, 해당 예제의 결과는 1, 2의 순서 보장이 안된다.

## Custom Operation

 > 
 > Operation 클래스의 하위 클래스를 만들어 실행 방법에 대한 커스텀 로직을 제공

### Non-Concurrent Operation

Operation을 상속하고, main method 하나만을 override하면 된다.

````swift
class NonConcurrentOperation: Operation {
    override func main() {
        super.main()
        // task를 위한 code 작성
    }
}

let operation = NonConcurrentOperation()
operation.start()
````

### Concurrent Operation

Operation을 먼저 비동기로 작동할 수 있게 만들어 주어야 한다.

* isAsynchronous
* isExecuting
* isFinished
* start()

위 4개의 프로퍼티 혹은 메서드를 override해야 한다. 위의 3개의 property의 경우 KVO를 지원하는데, 값이 변화할 때 이를 알려주는 notification을 만들어야 한다. 

````swift
class AsyncOperation: Operation {
    override var isAsynchronous: Bool { // 먼저 concurrent하게 하기 위해 비동기를 켜준다.
        return true
    }

    private var _isExecuting = false
    override var isExecuting: Bool {  // property override시 getter, setter 작성 필요
        get {
            return _isExecuting
        }

        set {
            willChangeValue(for: \.isExecuting)
            _isExecuting = newValue
            didChangeValue(for: \.isExecuting)
        }
    }

    private var _isFinished = false
    override var isFinished: Bool {  
        get {
            return _isFinished
        }

        set {
            willChangeValue(for: \.isFinished)
            _isFinished = newValue
            didChangeValue(for: \.isFinished)
        }
    }

    override func start() {
        if self.isCancelled {
            self.isFinished = true
            return
        }

        self.isExecuting = true
        self.main()
    }

    func completeOperation() {
        self.isExecuting = false
        self.isFinished = true
    }
}
````

property override시 getter, setter를 가지고 저장 프로퍼티의 값을 변경하고, 가져와야 한다. 그래서 저렇게 작성한 것. 이렇게 만들어두고 실제 사용은 어떻게 할까?

````swift
class SomeAsyncOperation:n AsyncOperation {
    override func main() {
        super.main()
        // 비동기 작업을 정의한다.
        AsyncTask {
            // some code
            self.completeOperation() // capture 조심
        }
    }
}

let operation = SomeAsyncOperation()
operation.start()
````

`start` 함수 안에 main 함수를 실행하도록 되어 있으니, 우리가 사용할 코드는 main 함수를 override하여 정의해주기만 하면 된다.

## Operation Dependency

 > 
 > 특정 순서로 Operation을 실행하는 방법

Operation A \<- Operation B

operation B가 operation A에 의존성을 가지고 있다고 설정해보자.

````swift
let operationA = ...
let operationB = ...

operationB.addDependency(operationA)
````

유의해야 하는 점은 종속(A) Operation이 성공적으로 완료되었는지, 혹은 실패되었는지 구분하지 않는다는 점이다. 즉, A의 작업이 성공인지 실패인지에 관계 없이 B가 실행된다. 또 취소한 경우도 완료로 표시된다.

만약에 종속 Operation이 취소되거나 혹은 실패한 경우 후속 Operation의 동작을 정하고 싶다면 별도로 처리가 필요하다.

RandomNumber를 만들고, 해당 값을 다음 Operation에 넘겨 Print하도록 하는 구조를 만들어보자. 

````swift
class RandomNumberOperation: Operation {
    var value: Int?

    override func main() {
        super.main()

        self.value = (0..<100).randomElement()
    }
}

class PrintOperation: Operation {
    var value: Int?

    override func main() {
        super.main()

        guard let value = self.vaule else {
            return
        }

        print(self.value)
    }
}

let randomNumberOperation = RandomNumberOperation()
let printOperation = PrintOperation()
````

RandomNumberOperation은 값을 만들고, PrintOperation은 값이 있는 경우 출력하도록 되어 있다. 어떻게 연결하고 값을 넘길 수 있을까?

### Completion Block 사용

````swift
randomNumberOperation.completionBlock = { [unowned randomNumberOperation, unowned printOperation] in
    printOperation.value = randomNumberOperation.value
}

printOperation.addDependency(randomNumberOperation)

let queue = OperationQueue()
queue.addOperations([randomNumberOperation, printOperation], waitUntilFinished: true)
````

1. Completion Block을 작성한다.
   * 이 경우 왜 unowned를 사용하였을까..?
1. 작성하여 종속 Operation의 property로 넣어둔다.
1. 의존성 관계를 작성한다.
1. 큐에 순서대로 작업을 넣는다.

### Adapter Operation 사용

````swift
let adapter = BlockOperation { [ unowned randomNumberOperation, unowned printOperation] in
    printOperation.value = randomNumberOperation.value
}

adapter.addDependency(randomNumberOperation)
printOperation.addDependency(dapter)

let queue = OperationQueue()
queue.addOperations([randomNumberoperation, adapter, printOperation], waitUntilFinished: true)
````

adapter pattern은 말그래도 두 객체를 연결할 때, 연결할 수 있는 객체를 만들어서 연결하는 방법이다. Operation을 하나 만들고, 이 사이에서 서로의 의존성을 연결한다.

````
randomNumberOperation <- adapter <- printOperation
````

이 방법 역시 순환참조를 항상 조심해야 한다.

## Operation Priority

 > 
 > Operation Queue 내에 현재 준비된 Operation의 실행 시작 순서를 정할 수 있다.

큐에 추가된 작업의 경우, 먼저 operation의 준비 상태에 따라 실행 순서가 결정된 다음 상대적 우선 순위에 따라 결정된다.

여기서 알아두어야 할 점은, **우선 순위가 종속성을 대체하지는 않는다**는 점이다. 우선순위 값을 사용해서 서로다른 Operation의 순서를 관리하면 안된다. 종속성이 없는 Operation에 대해서만 상대적 우선 순위 분류가 필요한 경우, 해당 값을 사용해야 한다.

````swift
public enum QueuePrioirity: Int {
    case veryLow = -8
    case low = -4
    case normal = 0
    case high = 4
    case veryhigh = 8
}

let operationA = BlockOperation {
    print("operatoinA")
}

let operationB = BlockOperation {
    print("operationB)
}

let operationC = BlockOperation {
    print("operationC)
}

operationA.queuePrioirity = .veryLow
operationB.queuePrioirity = .normal
operationC.queuePrioirity = .high

let queue = OperationQueue()
queue.maxConcurrentOperationCount = 1
queue.addOperations([operationA, operationB, operationC], waitUntilFinished: true)
````

C, B, A 순으로 Operation이 실행된다. Serial Queue이기 때문에 일관된 결과가 도출된다.

## Quality of Service

 > 
 > apple이 제공하는 작업의 명시적인 분류

이전의 GCD에서도 제공되었던 개념이다.

* User Interactive
* User Initiated
* Utility
* Background

````swift
let operation = BlockOperation {
    print("Long Running task")
}

operation.qualityOfService = .utility

let queue = OperationQueue()
queue.addOperation(operation)
````

이런식으로 operation의 property로 지정할 수 있다. 혹은

````swift
let operation = BlockOperation {
    print("Long Running Task")
}

let queue = OperationQueue()
queue.qualityOfService = .utility
queue.addOperation(operation)
````

이렇게 queue 자체에 지정할 수도 있다. 즉 operation 자체에 지정하면 OS에서 지정한 Queue로 들어가고, Queue에 설정하면 그러한 큐가 생성되어 동작하게 되는 것.

그런데 만약에, Queue에 지정된 QoS보다 우선순위가 높은 Operation이 들어가면 어떻게 될까?

|상황|결과|
|------|------|
|Queue에 할당된 Qo||
|||
|||

||||||
|--|--|--|--|--|
||||||
||||||
||||||

|Queue QoS 할당 여부 및 상대적 우위|Operation QoS 할당 여부 및 상대적 우위|결과|
|--------------------------------------------|------------------------------------------------|------|
|X|O|아무 영향 없음. <br> Operation에 지정된 QoS로 동작|
|O (Low QoS)|O (High QoS)|Queue의 QoS 승격 <br> Queue 내부 Operation QoS 역시 승격|
||||
|O (Low -> High로 변경)|- (할당 되었을 수도 안되었을 수도)|QoS가 낮은 Queue 내부 Operation은 모두 승격|
|O (High -> Low로 변경)|-|기존의 Queue 내부 Operation은 반영받지 않음 <br> 새로 추가되는 Operation에만 반영|

# GCD vs OperationQueue

 > 
 > 작업의 복잡도에 따라서 선택

* 단순한 block으로 처리하는 경우: DispatchQueue
* 작업의 종속성, 취소 빈번: Operation, OperationQueue

# 정리

* OperationQueue 역시 Serial, Concurrent가 있다.
* maxConcurrentOperationCount를 통해 변경할 수 있다.
* Operation은 Block Operation을 사용하거나 Operation을 Subclassing하여 사용이 가능하다.
* Operation Life Cycle이 있고, 취소, 실행중 등의 상태가 있다.
* KVO, KVC를 지원한다. (OperationQueue, Operation)
* Operation Dependency를 가져서, Operation간의 종속성을 설정할 수 있다.
* 우선순위 또한 설정가능하며, 다만 우선순위가 종속성을 대체하지는 않는다.
* DispatchQueue와 같이 QoS를 지원한다.

# Reference

* [OperationQueue](https://developer.apple.com/documentation/foundation/operationqueue)
