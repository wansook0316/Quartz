---
title: Actor Part. 02
thumbnail: ''
draft: false
tags:
- actor
- concurrency
created: 2023-09-22
---

# Actor isolation

Actor의 isolation은 actor type의 근본적인 동작이다. Swift language model에서 어떻게 Actor가 actor 바깥쪽에서 들어오는 비동기 interaction에 대해 고립을 보장하는지 에대해 알아보자. 여기서 고립은 앞에서 말한 여러 비동기 Task에서 actor의 함수를 호출하더라도 순차적으로 처리되는 것을 말한다.

## Protocol

다른 타입들과 마찬가지고 actor는 protocol을 채택할 수 있다.

````swift
actor LibraryAccount {
    let idNumber: int
    var booksOnLoan: [Book] = []
}

extension LibraryAccount: Equatable {
    static func ==(lhs: LibraryAccount, rhs: LibraryAccount) -> Bool {
        lhs.idNumber == rhs.idNumber
    }
}
````

Equatable protocol을 채택했고, static function을 구현했다. static function이기 때문에 내부에서는 actor에서 정의된 instance를 사용하지 않는다. 그 대신에 인수로 actor type을 받는다. 그리고 `idNumber`에 접근하지만, 별 문제는 없다. immutable state이기 때문이다.

````swift
actor LibraryAccount {
    let idNumber: int
    var booksOnLoan: [Book] = []
}

extension LibraryAccount: Hashable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(idNumber) // ❎ actor-isolated method 'hash(into:)' cannot satisfy synchronous requirement
    }
}
````

그렇다면 이번에는 Hashable protocol을 채택해보자. 그런데 이번에는 compiler가 에러를 뿜는다. 이게 뭘까? 

일단 위와 같은 방식으로 Hashable을 채택하면, 이는 분명 **바깥에서 호출이 가능해진다.** 근데, actor안에 정의된 함수는 암묵적으로 multi thread에서 호출될 수 있기 때문에, 이를 async하게 만들어주어야 actor를 isolation 할 수 있다. 그러면 actor는 내부에 정의된 함수에 대해 synchronous하게 동작하기 때문에 문제가 없다. 하지만 Protocol을 채택했기 때문에, async하게 만들 방도가 없다. 즉, isolation이 불가능해진다.

````swift
extension LibraryAccount: Hashable {
    nonisolated func hash(into hasher: inout Hasher) {
        hasher.combine(idNumber)
    }
}
````

이런 경우 non-isolation하게 만들면 된다. 사실 이 함수는 그런 처리를 할 필요가 없기 때문이다. isolation은 실제 multi thread에서 호출하여 문제가 발생하는 경우에 처리해주면 좋은 것이다. 이와 같이 사용할 일이 없는 경우는 고립시킬 필요가 없다.

"그러면, non-isolated function에서 mutable state를 변경하면 동시성 문제 발생하는 것 아님?!, 밖에서 막 사용해도 된다는 말이잖아!" 맞다. 그래서 이렇게 표시되면, actor안에 있는 mutable state를 가리키고 있으면 안된다. 위의 경우는 괜찮은데, immutable property에 접근하고 있기 때문이다.

````swift
extension LibraryAccount: Hashable {
    nonisolated func hash(into hasher: inout Hasher) {
        hasher.combine(booksOnLoan) // ❎ actor-isolated property 'booksOnLoan' cannot be referenced from outside the actor
    }
}
````

이렇게 공유되는 변수에 접근하면 에러를 뿜는다.

## Closures

````swift
extension LibraryAccount {
    func readSome(_ book: Book) -> Int { ... }

    func read() -> Int {
        booksOnLoad.reduce(0) { book in
            readSome(book)
        }
    }
}
````

먼저, Closure는 일종의 함수라 볼 수 있다. 정확하게 말하면 함수가 Closure의 일종이다. 다만, 특정 함수 내에서 정의될 수도 있고, 다른 함수로 넘겨 추후에 호출될 수도 있다는 차이점이 있다.

일단 함수와 마찬가지로 closure 역시, actor-isolated거나 non-isolated 될 수 있다. 위의 예시에서 `readSome` 함수 앞에 `await`가 없는 것은 어찌보면 당연하다. 왜냐하면, reduce라는 함수가 동기적으로 처리될 것이 분명하기 때문이다. 그리고 해당 클로저는 바깥으로 탈출(escape) 할수 없다. 즉, 이 자체로 actor-isolated 되어 있다.

````swift
extension LibraryAccount {
    func readSome(_ book: Book) -> Int { ... }

    func read() -> Int { ... }

    func readLater() {
        Task.detached {
            await self.read()
        }
    }
}
````

이건 어떨까? 이번에는 `Task.detached`를 사용했다. detached Task는 actor가 작업을 수행하는 동안 closure를 통해 concurrent하게 동작한다. 그렇기 때문에 이 closure는 actor에 있을 수 없으며, data race를 일으킬 것이다. 즉, 이 closure는 not-isolated 되어 있다. `read` method를 실행하길 원할 때, `await`로 표시된 것으로 알 수 있듯 무조건적으로 비동기적으로 수행된다.

# Actor Isolation and Data

지금까지는 code가 actor의 안에 있느냐, 밖에 있느냐를 기준으로 actor isolation에 대해서 알아보았다. Data와 함께 알아보자.

## Struct

````swift
actor LibraryAccount {
    let idNumber: Int
    var booksOnLoan: [Book] = []
    func selectRandomBook() -> Book? { ... } ✅
}

struct Book {
    var title: String
    var authors: [Author]
}

// Actor의 바깥쪽에 위치
func visit(_ account: LibraryAccount) async {
    guard var book = await account.selectRandomBook() else {
        return
    }
    book.title = "\(book.title)!!!"
}
````

이전 예에서 우리는 Book이 어떤 타입인지 사실 말하지 않았다. 이 상황에서 일단 Struct라고 생각해보자. 일단 굉장히 좋은 선택이다. 왜냐하면 `libraryAccount` Actor가 가지고 있는 instance의 모든 상태가 self-contained이기 때문이다.(자립적? 외부에 의존이 없다는 걸 말하고 싶은 듯) ✅ 표시한 함수는 random으로 책을 선택하는 메소드인데, 만약 해당 method를 사용한다면 항상 Book의 copy를 반환 받는다. 반환받은 instance에 대해 변경을 가하더라도 actor에 영향을 미치지 않는다.

## Class

````swift
actor LibraryAccount {
    let idNumber: Int
    var booksOnLoan: [Book] = []
    func selectRandomBook() -> Book? { ... } ✅
}

class Book {
    var title: String
    var authors: [Author]
}

// Actor의 바깥쪽에 위치
func visit(_ account: LibraryAccount) async {
    guard var book = await account.selectRandomBook() else { // 😅 계속해서 reference를 던져주게 된다.
        return
    }
    book.title = "\(book.title)!!!"
}
````

그런데 만약 Class라면 어떨까. `booksOnLoan` property는 이제 Book instance의 주소를 reference로 갖고 있다. 사실 이 자체는 문제가 없다. 그런데, `selectRandomBook` 함수를 호출하게 되면 어떻게 될까? reference를 actor에서 던져주기 때문에, 외부에서 actor의 mutable state를 갖게 된다. 이는 data race를 일으킬 수 있는 상황이다.

# Senable Types

위에서 보았듯이 struct의 경우에는 concurrent한 동작이 잘 맞지만, class의 경우에는 여전히 문제가 있다. Concurrent하게 동작하기 위해서는 `Sendable` 해야 한다.

* concurrently하게 공유하는 것에 대해 안전한 Type을 말한다.
  * 다른 actor 간에 값을 공유할 수 있다.
  * 값을 copy 한다면, 혹은 사용하는 측에서 서로 영향을 주지 않고 사본을 수정할 수 있다면, 해당 type은 `Sendable`이라 볼 수 있다.
* Value types
  * 사본을 복사하여 상호간에 영향을 주지 않음
* Actor types
  * mutable states에 synchronize한 방식으로 접근하기 때문
* Immutable classes
  * `Sesndable` 될 수 있지만 추가적인 작업이 필요함
  * 모든 데이터가 immutble data만 가지고 있다면 가능
* Internally-synchronized class
  * 내부적으로 sync하게 동작하도록 구현한 경우
  * lock
* `@Sendable` function types

## Checking Sendable

이러한 특징을 Swift Compiler는 Checking한다. 결국, 위에서 보았던 Class의 예시는 Compile Error가 난다.

````swift
actor LibraryAccount {
    let idNumber: Int
    var booksOnLoan: [Book] = []
    func selectRandomBook() -> Book? { ... } ✅
}

class Book {
    var title: String
    var authors: [Author]
}

// Actor의 바깥쪽에 위치
func visit(_ account: LibraryAccount) async {
    guard var book = await account.selectRandomBook() else { // ❎ call to actor-isolated method 'selectRandomBook' returns non-Sendable type 'Book?'
        return
    }
    book.title = "\(book.title)!!!"
}
````

## Adopting Sendable

그럼 어떻게 해서 Sendable Type으로 만들어줄 수 있을까? 일단 `Sendable`은 Protocol이다. 

````swift
struct Book: Sendable {
    var title: String
    var authors: [Author] // ❎ error: Sendable type ;Book; has non=Sendable stroed property 'authors' of type '[Author]'
}

class Author {
    ...
}
````

이를 준수하게 되면, swift compiler는 내가 작성한 type들이 `Sendable`한지 체크한다. title은 문제가 없지만, author가 어떤 타입인지에 의해 Book은 Sendable이 될수도 아닐 수 도 있다. 아래에 보니 class이다. 그리고 다른 작업들이 잘 되어 있지 않았다.(sync, immuable) 그 결과, compile error가 나게 된다.

````swift
struct Pari<T, U> {
    var first: T
    var second: U
}

extension Pair: Sendable where T: Sendable, U: Sendable {

}
````

generic의 경우에는 해당 Type의 Sendable 여부가, generic argument에 의해 정해진다. 이 떄, 내부에 들어오는 Type 자체에 constranint를 걸어, 들어오는 Type이 `Sendable` 하지 않을 때 Compile error를 나게 할 수도 있다.

## @Sendable functions

function 자체도 `Sendable` 할 수 있다. 이는 actors 들사이로 던져도 안전하다는 것을 말한다. 이는 중요한데, closure에서 Data race를 발생시키는 것을 사전 차단할 수 있기 때문이다.

예를 들어, `Sendable` closure의 경우, mutable local 변수를 capture할 수 없다. capture 후에 내부에서 변경한다면, data race가 발생할 것이기 때문이다. 이와 같이 compiler 단에서 문제를 발견하게 해준다. 특징은 다음와 같다.

* mutable capture가 불가하다.
* Capture 할 수 있는 녀석들은 `Sendable` 해야만 한다.
* Cannot be both sunchronous and actor-isolated

## @Sendable closure restrictions

````swift
static func detached(operation: @Sendable () async -> Success) -> Task<Success, Never>

struct Counter {
    var value = 0

    mutating func increment() -> Int {
        value = value + 1
        return value
    }
}

var counter = Counter()
Task.detached {
    print(counter.increment()) // Mutation of cpatured var 'counter' in concurrently-executing code
}

Task.detached {
    print(counter.increment()) // Mutation of cpatured var 'counter' in concurrently-executing code

````

우리가 앞에서 사용해봤던 `detached` task를 만들었던 녀석에 `Sendable` closure가 들어간다. 여기서 우리는 두개의 task에서 같은 method를 동시에 호출 했었다. mutable local 변수를 가지고 있다면 data race를 일으킬 상황이다. 

하지만 이 경우 에러가 나는데, `@Sendable` protocol을 준수하는 closure의 경우, mutable한 변수를 capture할 수 없다. 

````swift
static func detached(operation: @Sendable () async -> Success) -> Task<Success, Never>

extension LibraryAccount {
    func readSome(_ book: Book) -> Int { ... }

    func read() -> Int { ... }

    func readLater() {
        Task.detached {
            self.read() // ❎ call to actor-isolated method 'read' must be 'async'
        }
    }
}
````

이 예시를 보자. `readLater()`는 actor내에 정의된 함수이지만, 내부적으로는 `Task.detached`를 사용하여, actor 외부에서 동작할 수 있다. 결국, `Task.detached` 에서 사용하는 closure는 actor 외부에서 접근할 수 있으며, 그렇기 때문에 `async` 하게 동작해야 actor-isolated를 보장할 수 있다. 이런 부분을 compiler가 잡아주고 있다.

# Main actor

이제 actor와 관련된 하나의 요소가 남았다. 이녀석은 좀 특별한 녀석이다.

## Interacting with the main thread

main thread는 app에서 중요한 녀석이다. UI rendering이 일어나며, user의 interaction event도 처리된다. 그렇기 때분에 UI와 관련된 일은 main thread에서 처리한다.

````swift
func checkedOut(_ booksOnLoan: [Book]) {
    booksView.checkedOutBooks = booksOnLoan
}

DispatchQueue.main.async {
    checkedOut(booksOnLoan)
}
````

하지만, 모든 작업을 main thread에서 할 필요는 없다. 그래서 우리는 보통 다른 작업들을 하다가 `DispatchQueue.main.async`를 통해서 main thread에서 할 동작을 넘겨주곤 했었다. 근데 잘 생각해보면, 이건 actor가 돌아가는 메커니즘과 비슷하지 않을까? main thread는 sync하게 동작해야 하며, 한전하게 접근 가능해야 한다. 

## The Main Actor

이런 필요성에 의해 main actor가 나왔다.

````swift
@MainActor func checkedOut(_ booksOnLoan: [Book]) {
    booksView.checkedOutBooks = booksOnLoan
}

await checkedOut(booksOnLoan)
````

* main thread를 대표한다.
* 해당 함수로 들어오는 모든 task를 main dispatch queue에서 처리한다.
* main thread에서 실행해야 하는 코드는 여기저기 흩어져있었다. main actor를 사용하면 선언하는 것으로 해결 가능하다.

````swift
@MainActor class MyViewController: UIViewController {
    func onPress(...) { ... } // 암묵적으로 @MainActor임

    nonisolated func fetchLatestAndDisplay() async { ... }
}
````

type에 `@MainActor`를 선언할 수도 있다. 이렇게 하면, member들과 subclass 모두 main Actor로 동작한다. UI와 상호작용해야 만하거나, 대부분이 main에 돌아가야 한다면 유용하게 쓸 수 있을 것이다. 이 경우, 개별적으로 actor 격리를 사용하고 싶지 않은 경우 `nonsolated` 키워드를 통해 분리할 수 있다.

# 마무리

* Actor type을 사용해서 mutable state에 sync하게 접근하자.
* rerentrancy를 위한 설계가 필요하다.
* data race를 방지하기 위해 value 타입을 사용하자.
* 이를 방지하려면 `Sendable` protocol을 채택하여 checking을 수행하자.
* `@MainActor`를 사용해서 이전에 `DispatchQueue.main.async`로 수행했던 것을 바꿔보자.

# Reference

* [Protect mutable state with Swift actors](https://developer.apple.com/videos/play/wwdc2021/10133)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
* [The Actor Reentrancy Problem in Swift](https://swiftsenpai.com/swift/actor-reentrancy-problem/)
* [Reentrancy (computing)](https://en.wikipedia.org/wiki/Reentrancy_(computing))
* [재진입성](https://ko.wikipedia.org/wiki/%EC%9E%AC%EC%A7%84%EC%9E%85%EC%84%B1)
* [Sendable](https://developer.apple.com/documentation/swift/sendable)
