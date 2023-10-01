---
title: Actor Part. 01
thumbnail: ''
draft: false
tags:
- actor
- data-race
- shared-resource
- thread-safety
- actor-reentrancy
- swift
- multi-thread
created: 2023-09-22
---

Task는 코드 블럭을 독립적으로 사용할 수 있다. 이러한 점을 사용하면 병렬적으로 특정 코드를 처리하게 할 수도 있다. 그런데, 두 개 이상의 Task에서 공유자원을 사용해야 한다면 어떻게 할까?

공유 자원에 접근하는 것은 동시성 문제를 일으키는 핵심적인 이유중 하나다. 궁금하다면 [Concurrency](Knowledges/Development/Clean%20Code/Concurrency.md)에서 그 이유들을 알아보자. Apple은 이러한 문제에 대해 Actor라는 타입을 만들어 문제를 원천봉쇄하고자 했다. 이는 [Actor Model](Actor%20Model.md)에서 나오는 개념이다. 한번 알아보자.

# Data races make concurrency hard

````swift
class Counter {
    var value = 0

    func increment() -> Int {
        value = value + 1
        return value
    }
}

let counter = Counter()
Task.detached { // detached를 사용하면 unstructured concurrency로 동작한다. 다음글에서 살펴보겠다.
    print(counter.increment())
}

Task.detached {
    print(counter.increment())
}
````

공유 변수에 두 Task가 접근하여, 시점에 따라 다른 결과를 가져올 수 있다는 문제가 있다. 두 Task 모두 1을 받거나, 둘다 2를 받거나, 1, 2를 받거나 하는 문제가 발생할 수 있다는 말이다.

이런 문제는 변경가능한 공유 자원을 사용하고 있기 때문이다. 데이터가 공유되지 않거나, 다중 스레드에서 해당 변수가 공유되지 않는다면 data race는 발생하지 않는다.

## Does Value Semantic Solve Data race?

 > 
 > Value semantic을 사용하여 공유 자체를 하지 않도록 한다.

* `let` 사용
* struct 사용

````swift
var array1 = [1, 2]
var array2 = array1 // copyOnWrite로 아직 복사 안됨

array1.append(3) // 이 시점에 변경됨
array2.append(4) 

print(array1) // 1, 2, 3
print(array2) // 1, 2, 4
// 복사 완료
````

value type을 사용하게 되면, 값을 복사해서 사용하기 때문에 안전하다. array, dictionary 등이 예가 될 수 있겠다.

````swift
struct Counter {
    var value = 0

    mutating func increment() -> Int {
        value = value + 1
        return value
    }
}

let counter = Counter()
Task.detached {
    print(counter.increment()) // ❎ Cannot use mutating member on immutable value 'counter' is let constant. 
}

Task.detached {
    print(counter.increment()) // ❎ Cannot use mutating member on immutable value 'counter' is let constant. 
}
````

하지만 이 방식을 `Counter`에 도입하면 사용이 불가능하다. 먼저 `let`을 사용하는 경우, immutable 변수의 member 변수를 변경할 수 없다는 에러가 뜬다.

````swift
struct Counter {
    var value = 0

    mutating func increment() -> Int {
        value = value + 1
        return value
    }
}

var counter = Counter()
Task.detached {
    print(counter.increment()) // ❎ Mutation of captured var 'counter' in concurrently-executing code
}

Task.detached {
    print(counter.increment()) // ❎ Mutation of captured var 'counter' in concurrently-executing code
}
````

그럼 `var`로 변경하면 문제가 해결될까? 당연히 아니다. 결국 내부에 있는 `value`라는 property의 값을 변경하고 있는 행위는 같기 때문에, concurrent하게 접근하고 있어 문제가 있을 수 있다는 에러를 뿜는다.

결국 Value semantic으로 공유 변수에 접근하는 것을 해결할 수 없었다. multi thread를 사용하기 때문에, 이러한 공유 변수에 접근해서 로직을 처리해야 하는 것은 필연적이다.

# Shared mutable state in concurrent programs

이렇게 되니 공유자원에 접근하는 방식에 대해 고찰할 필요가 있다.

* 변경가능한 공유 상태는 동기화를 필요로 한다.
* Lock, Serial dispatch queues, Atomics와 같은 low level 도구들이 있다.
  * 각각의 강점이 있으나, 모두 가지는 치명적인 단점이 있다.
  * 정확하고 옳게 사용하기 위해서는 짬이 있어야 한다.

# Actors

이런 상황에서 Actor가 나왔다. 

* 변경가능한 공유 상태에 대해 동기화를 제공한다.
* 프로그램으로 부터 독립된 상태를 가진다.
  * 값에 접근하기 위해서는 actor를 통해서만 가능하다.
  * Actor는 특정 상태에 대해 접근하는데 있어 상호배제를 보장한다.
* Compiler가 이러한 점에서 Error를 던져주어, 발생할 수 있는 data race에 대해 알려준다. 이걸 바탕으로 actor로 변경하면 된다.

````swift
actor Counter {
    var value = 0

    func increment() -> Int {
        value = value + 1
        return value
    }
}

let counter = Counter()
Task.detached {
    print(await counter.increment()) // 1, 2
}

Task.detached {
    print(await counter.increment()) // 2, 1
}
````

Actor는 다음의 특징을 갖는다.

* structs, enums, classes와 비슷한 기능을 가진다.
  * property, method, initailzier, subscript etc.
  * protocol 채택 가능
  * extension도 가능
* Reference type
  * 공유되어 사용될 것이기 때문
* 가장 큰 차별되는 특징은, **actor의 instance data를 프로그램의 나머지 부분과 격리한다는 것이다.** 
* **그리고 이로서 해당 데이터에 동기화된 접근을 보장한다.**

즉, 위의 `Counter` 코드에서 Actor로 변경된 이후, `increment`를 어디에서 호출하더라도, 해당 동작은 완료된 이후에 순차적으로 다음 task를 처리한다는 것이다. 

# Asynchronous interaction with actors

actor와 비동기적으로 상호작용한다는 것은, actor의 외부에서 method를 사용할 때를 말한다.

````swift
actor Counter {
    var value = 0

    func increment() -> Int {
        value = value + 1
        return value
    }
}

let counter = Counter()
Task.detached {
    print(await counter.increment()) // 1, 2
}

Task.detached {
    print(await counter.increment()) // 2, 1
}
````

actor에 접근했을 때, 이미 이전 동작이 진행중이라면, 동작을 요청한 Task는 처리를 suspend하고 다른 작업을 처리한다. actor에서 이전 작업이 완료되었다면 actor에 작업 처리 요청이 들어가고, 완료되면 Task가 resume된다. 이는 `await`키워드로 하여금 async 처리가 actor에서 진행된다는 것을 알 수 있다.

# Synchronous interaction with actors

그럼 동기적으로 처리된다는 것을 무엇을 말하는 걸까? actor내부에서 값을 변경시키는 함수를 호출했을 때를 말한다.

````swift
extension Counter {
    func resetSlowly(to newValue: Int) {
        value = 0
        for _ in 0..<newValue {
            increment()
        }
        assert(value == newValue)
    }
}
````

`resetSlowly` 함수는 내부 변수인 `value`를 `newValue`로 초기화하는 함수이다. `Counter` actor안에 정의되어 있으며, 이는 곧 직접적으로 `value`에 접근할 수 있다는 말이다. 이런 경우에는 동기적으로 처리가 가능하기 때문에 `await` 가 필요없다.

즉, actor안에 있는 함수는 동기적으로 호출된다는 것이다. 그리고 이렇게 실행되는 동기 코드는 방해받지 않고 실행된다.

# Actor Reentrancy Problem

위에서 actor 내부에서 호출하는 코드의 경우 sync하게 동작한다고 했으나, 실제로는 종종 async 코드와 상호작용하는 경우가 많다.

````swift
actor ImageDownloader {
    private var cache: [URL: Image] = [:]

    func image(from url: URL) async throws -> Image? {
        if let cached = cache[url] {
            return cached
        }

        let image = try await downloadImage(from: url)

        cache[url] = image
        return image
    }
}
````

일단 이 코드의 경우에는 actor안에서 호출하고 있기 때문에, data race 상태가 발생하지 않는다. 앞에서 말했듯 동기적으로 순차적이게 처리되기 때문이다. 그런데, 이 `image(from:)` 함수를 외부 task에서 호출하면 어떤일이 발생할까?

````swift
let downloader = ImageDownloader()
let url = URL("https://someUrl~")

Task.detached { // 1️⃣
    let image = await downloader.image(from: url)    
    // UI Updates...
}

Task.detached { // 2️⃣
    let image = await downloader.image(from: url)    
    // UI Updates...
}
````

1. 1️⃣의 Task가 먼저 actor에 접근하여 `image` 호출
1. `await` 키워드가 있기 때문에 해당 동작의 결과를 받기 위해 suspend됨
1. cache에 아직 없기 때문에 `downloadImage` 호출
1. 2️⃣의 Task가 실행되고, actor에 접근하여 `image` 호출
1. `await` 키워드가 있기 때문에 해당 동작의 결과를 받기 위해 suspend됨
1. 1️⃣의 결과가 아직 caching되지 않았기 때문에 `downloadImage` 호출
1. 1️⃣의 결과가 나와서 `image` 변수에 할당됨
1. 2️⃣의 결과가 나와서 `image` 변수에 할당됨
1. 1️⃣의 결과를 바탕으로 UI update를 시도함
1. 그런데 8에서의 결과로 변경되어, 원래 의도(7에서 받은 이미지)와는 다른 이미지(이미지의 모양은 같을 수 있지만 다운로드를 한번 더 수행한 녀석임)(8)가 화면에 나옴

여기서 문제는, actor 내부에 정의된 함수는 sync하게 동작하나, 그 함수 내부에 비동기 함수가 포함된 경우, sync하게 동작하지 않아 다른 결과가 도출될 수 있다는 것이다. 

사실 위의 예시와 같은 cache의 경우 같은 url이라면 두번 `downloadimage` 할 필요가 없다. 이러한 예는, 은행에 입금, 출금할 때도 발생할 수 있다. 돈을 입금하고, 출금하는 동작을 하는 함수가 있다고 할 때, 서로 다른 실행 주체에서 해당 함수를 호출했다면 위의 `image` 함수를 호출하는 것처럼 입출금의 순서, 혹은 필요없는 실행 등이 겹쳐 원하는 결과가 나오지 않을 수 있다.

이런 상황은 전형적인 Reentrancy Problem이다.

 > 
 > Reentrancy: 서브루틴이 동시에(병렬) 안전하게 실행 가능한 상태. 즉, 재진입이 가능한 루틴은 동시에 접근해도 언제나 같은 실행 결과를 보장한다.

## Example

````swift
actor BankAccount {
    private var balance = 1000

    func withdraw(_ amount: Int) async {
        print("🤓 출금할 금액입니다: \(amount)")

        guard canWithdraw(amount) else {
            print("🚫 출금에 충분한 잔액이 없습니다. 잔고: \(balance)")
            return
        }

        guard await authorizeTransaction() else { // 서버에서 transaction 확인 처리하는데 걸리는 시간 mocking
            return
        }

        print("✅ 거래 처리 완료: \(amount)원을 받아주세요.")

        balance -= amount

        print("💰 남은 계좌 잔고: \(balance)원")
    }

    private func canWithdraw(_ amount: Int) -> Bool {
        return amount <= balance
    }

    private func authorizeTransaction() async -> Bool {

        // Wait for 1 second
        try? await Task.sleep(nanoseconds: 1 * 1000000000)

        return true
    }
}

let account = BankAccount()

Task {
    await account.withdraw(800)
}

Task {
    await account.withdraw(500)
}
````

actor로 계좌를 만들었고, 내부에 잔고 property를 통해 출금을 하는 시나리오를 구성했다. 두개의 Task에서 가진 잔고보다 더 많은 금액을 출금하는 것을 시도했다. 의미적으로 원하는 결과는, 두 Task중 어떤 것이 먼저 실행되든, 둘 중 하나는 잔금이 부족해 돈을 인출할 수 없어야 한다.

````
🤓 출금할 금액입니다: 800
🤓 출금할 금액입니다: 500
✅ 거래 처리 완료: 800원을 받아주세요.
💰 남은 계좌 잔고: 200원
✅ 거래 처리 완료: 500원을 받아주세요.
💰 남은 계좌 잔고: -300원
````

실패다. 은행은 곧 파산할지도 모른다. 

# Designing Actor for Reentrancy

Apple의 영상을 보면, actor Reentrancy는 deadlock을 방지하여, 진행하도록은 할 수 있다고 한다. 하지만 `await`로 선언된 함수의 대기시간을 가정해야 한다. 즉, actor 내부의 mutable state에 대한 관리까지는 해주지 않는다. 그건 개발자의 책임이다.

해결하려면 어떻게 해야할까?

## Perform State Mutation in Synchronous Code

Apple 엔지니어들이 제안하는 첫번째 방법은, actor 내부 상태 변경을 sync code 안에서 하라는 것이다.

![](ConcurrentProgramming_09_Actor-1_0.png)

여기서 문제는 동기적으로 처리하고 있는 흐름에서 **먼저 출금 가능여부를 판단하기 때문에 발생한다.** 그렇기 때문에 처음에는 출금 가능이라 통과된 이후, 서버에 요청을 하는 동안 suspend되고, 그 사이에 두번째 Task의 출금 가능 로직을 수행한다. 당연히 아직 반영이 안되었으니 통과되버린다. 이 시점에서 사실 통과되면 안된다.

````swift
actor BankAccount {
    private var balance = 1000

    func withdraw(_ amount: Int) async {
        guard await authorizeTransaction() else { // 서버 요청을 먼저 수행한다.
            return
        }

        print("🤓 출금할 금액입니다: \(amount)")

        guard canWithdraw(amount) else {
            print("🚫 출금에 충분한 잔액이 없습니다. 잔고: \(balance)")
            return
        }

        print("✅ 거래 처리 완료: \(amount)원을 받아주세요.")

        balance -= amount

        print("💰 남은 계좌 잔고: \(balance)원")
    }
}
````

````
🤓 출금할 금액입니다: 800
✅ 거래 처리 완료: 800원을 받아주세요.
💰 남은 계좌 잔고: 200원
🤓 출금할 금액입니다: 500
🚫 출금에 충분한 잔액이 없습니다. 잔고: 200
````

이를 방지하기 위해서는 먼저 서버에 요청을 한 후(async 함수를 먼저 호출하고) **출금 가능 확인 로직과 실제 인출을 같은 동기 코드 안에서 묶어버리면 된다.** 그렇게 되면 두번의 Task는 actor 안에 있는 함수에 정의된 동작이기 때문에 synchronous하게 동작한다. (위의 Synchronous interaction with actors절에서 설명함)

## Check the Actor State After a Suspension Point

근데 사실 문제가 있다. 계좌에 잔액이 부족하면, 서버에 Transaction 확인할 필요가 있을까? 잔액이 부족하면 early return하여 불필요한 요청을 하지 않는 것이 더 좋은 것 아닌가? (재진입을 제거)

어떻게 하면 여러번의 인출 요청을 multi thread 환경에서 깔끔하게 처리하면서 Reentrancy 문제를 해결할 수 있을까? 이러한 문제에 대해 Apple 엔지니어들이 내놓는 답은, suspension point, 즉, `await`에 관련된 함수를 호출한 뒤에, 상태를 확인하라는 것이다. 쉽게 말하면 transation 요청 후에 다시 출금 가능여부를 판단하라는 것이다.

````swift
func withdraw(_ amount: Int) async {
    guard canWithdraw(amount) else { // 일단 early return을 위해 한번 걸러준다.
        print("🚫 출금에 충분한 잔액이 없습니다. 잔고: \(balance)")
        return
    }

    guard await authorizeTransaction() else { // 서버 요청을 먼저 수행한다.
        return
    }
    print("✅ Transaction이 승인되었습니다.")

    print("🤓 출금할 금액입니다: \(amount)")

    guard canWithdraw(amount) else {
        print("🚫 출금에 충분한 잔액이 없습니다. 잔고: \(balance) - after authorized")
        return
    }

    print("✅ 거래 처리 완료: \(amount)원을 받아주세요.")

    balance -= amount

    print("💰 남은 계좌 잔고: \(balance)원")
}
````

이렇게 하면 위 코드와 같이 Task가 거의 비슷한 시간대에 동작하는 경우에는 early stop이 먹히지 않겠지만, 적용할 수는 있다. 

# Thread Safety vs. Reentrancy

Actor가 Thread-safe 하다는 것은, actor가 가진 변화가능한 상태에 대해 상호 배제를 보장한다는 것이다. 즉, 특정 상태에 대해 동시에 접근하는 것을 막겠다는 것이다. 위의 account 코드를 보았을 때, 항상 `🤓 출금할 금액입니다: 800`이 먼저 출력되었다. 즉, 외부에서 여러 Task 내부에 actor의 method를 호출하더라도, 여러개 존재하는 Task에서 독자적인 실행 흐름을 가지고 메서드를 실행하는 것이 아닌, actor가 가지는 실행흐름에 종속된다는 것이다.

![](ConcurrentProgramming_09_Actor-1_1.png)
![](ConcurrentProgramming_09_Actor-1_2.png)

Reentrancy 문제가 보통 multi thread 상황에서 발생하지만 thread-safe와는 다른 문제이다. 여기서 골자는, actor라는 타입이 multi thread에서 발생하는 다양한 문제는 처리했지만, 여전히 재호출하거나, 여러 다른 task에서 실행했을 때 결과가 달라질 수 있다는 점을 말하고 있다는 것이다. 그리고 그 이유는, **suspension point(`await`)에서 actor의 상태값이 변경되지 않을 것이라고 가정했기 때문에 발생한다.** 분명 actor 내부에 정의된 함수는 sync하게 동작하지만, 내부에 비동기 함수를 넣고 실행하게 되면, 그 비동기함수의 동작은 다른 실행 흐름을 갖고 있고, 그동안 해당 비동기 함수를 호출한 실행 흐름은 suspend된다. 그런데 concurrent하게 작동하기 때문에 suspend된 동안 다른 작업을 수행하게 되고, 그 작업이 같은 actor의 함수를 호출하게 된다면, 이전 Task의 결과가 도출되기 전에 호출된 것이기 때문에 같은 결과가 나오지 않을 수 있다.

즉, Thread-safe와 Reentrancy는 다른 문제다.

# 마무리

Reentrancy에 대해서는 마법의 정답이 없다. 상황마다 다르고 처리해야 하는 방식도 다르다. 하지만 actor에 대해 알아보면서 생각해볼만한 부분은 분명히 있었다.

* actor 외부에서 호출하는 경우 await 키워드를 통해 결과 반환을 기다려야 한다.
* actor 내부에 정의된 함수는 sync하게 동작함을 보장한다.
* 하지만 actor 내부에 `await`와 같은 suspension을 걸고, 이를 외부에서 호출한다면 Reentrancy 문제에 빠질 수 있다.
* Reentrancy 문제는 서브루틴이 동시에(병렬) 안전하게 실행 가능한 상태를 말한다.
* actor는 dead lock이 발생하는 것은 막아줄 수 있다. 하지만 위와 같은 Reentrancy 문제는 개발자의 책임이다.

# Reference

* [Protect mutable state with Swift actors](https://developer.apple.com/videos/play/wwdc2021/10133)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
* [The Actor Reentrancy Problem in Swift](https://swiftsenpai.com/swift/actor-reentrancy-problem/)
* [Reentrancy (computing)](https://en.wikipedia.org/wiki/Reentrancy_(computing))
* [재진입성](https://ko.wikipedia.org/wiki/%EC%9E%AC%EC%A7%84%EC%9E%85%EC%84%B1)
