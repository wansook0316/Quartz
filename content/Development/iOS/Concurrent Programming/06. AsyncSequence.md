---
title: AsyncSequence
thumbnail: ''
draft: false
tags:
- async
- concurrency
created: 2023-09-22
---

# What is AsyncSequence

용량이 좀 큰 csv 데이터를 받는다고 하자. 만약 해당 파일을 모두 받은 뒤에 데이터를 처리한다고 한다면, 오랜 시간 뒤에나 가능할 것이다. 여기서 `asyncSequence`를 사용하면 굉장히 반응성있는 결과를 낼 수 있다.

````swift
struct QuakesTool {
    static func main() async throws {
        let endpointURL = URL(string: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv")!

        // header line 스킵하고 라인 하나씩 순회
        // 돌면서 진도, 시간, 위경도 추출
        for try await event in endpointURL.lines.dropFirst() {
            let values = event.split(separator: ",")
            let time = values[0]
            let latitude = values[1]
            let longitude = values[2]
            let magnitude = values[4]
            print("magnitude: \(magnitude), time: \(time), latitude: \(latitude), longitude: \(longitude)")
        }
    }
}
````

`endpointURL.lines`는 `URL`에 있는 property이다. `AsyncLineSequence<URL.AsyncBytes>` 타입으로 되어 있으며, 비동기적으로 동작하다 line에 해당하는 byte가 모두 다운로드되면 위의 loop안의 코드가 동작한다.

## How it works

````swift
for quake in quakes {
    if quake.magnitude > 3 {
        displaySignificantEarthquake(queke)
    }
}
````

우리가 일반적으로 사용하는 for loop은 어떻게 컴파일러가 받아들일까? 

````swift
var iterator = quakes.makeIterator()
while let quake = iterator.next() {
    if quake.magnitude > 3 {
        displaySignificantEarthquake(queke)
    }
}
````

이렇게 iterator를 통해 다음 원소를 받아 처리한다. 다음 요소가 없을 때는 nil을 던쳐 while 루프를 종료할 수 있다. 이는 전형적인 [Iterator 패턴](https://ko.wikipedia.org/wiki/%EB%B0%98%EB%B3%B5%EC%9E%90_%ED%8C%A8%ED%84%B4)이다.

 > 
 > 이터레이터 패턴(iterator pattern): 컬렉션 구현 방법을 노출시키지 않으면서도 그 집합체 안에 들어있는 모든 항목에 접근할 수 있는 방법을 제공

그럼 `for await in` syntax는 무엇이 달라지는 것일까?

````swift
var iterator = quakes.makeAsyncIterator()
while let quake = await iterator.next() {
    if quake.magnitude > 3 {
        displaySignificantEarthquake(queke)
    }
}
````

````swift
do {
    for try await quake in quakeDownload {
        if quake.depth > 5 { continue }
        if quake.location == nil { break }

        ...
    }
} catch {

}
````

이렇게! 다음 next에 대해 대기하는 것으로만 변경되었다. `for await in` syntax는 기존 for loop에서 사용하던 `continue`, `break` 등을 동일하게 사용가능하다. 또한 Error handling도 가능하다.

## Encapsulation

[이전 글](https://velog.io/@wansook0316/AsyncAwait)에서 실제로 `async` 함수를 실행하기 위해서는 `Task`를 만들어야 한다고 했다. 마찬가지로 Async sequence도 `Task` 안에 정의하여 캡슐화하여 관리할 수 있다.

````swift
let iteration1 = Task {
    for await quake in quakes {
        if quake.magnitude > 3 {
            displaySignificantEarthquake(queke)
        }
    }
}

let iteration2 = Task {
    do {
        for try await quake in quakeDownload {
            if quake.depth > 5 { continue }
            if quake.location == nil { break }

            ...
        }
    } catch {

    }
}

iteration1.cancel()
iteration2.cancel()
````

# Usage and APIs

여기서는 간략하게 소개하고 넘어가도록 하겠다. 어떤 것들을 할 수 있는지만 알아보자.

* `FileHandle`을 통한 Bytes 읽기를 라인별로 비동기적으로 처리할 수 있다.
* `URL`으로부터 line을 비동기적으로 처리할 수 있다. (맨 위에서 본 예시: local, remote 상관 없음)
* Notification 사용..

해당 부분은 지금 와닿지 않아, 추후에 영상을 다시 보는 것으로 하겠다.

# Custom AsyncSequence

문서를 읽다보니, `AsyncSequence`가 Protocol이라 이를 채택하면 될 듯하여 해본다.

## Sequence

Array, Dictionary, Set 등은 모두 Sequence이다. 먼저, 이 `Sequence` Protocol로 custom하게 만드는 방법을 알아보자.

````swift
struct CustomSequence: Sequence { // Not working

}
````

단순하게 Sequence Protocol을 채택하는 방법으로는 이를 만들 수 없다. 이유는 `Sequence` Protocol이 필수적으로 가져야 하는 method가 있기 때문이다.

````swift
public protocol Sequence {

    /// A type representing the sequence's elements.
    associatedtype Element where Self.Element == Self.Iterator.Element

    /// A type that provides the sequence's iteration interface and
    /// encapsulates its iteration state.
    associatedtype Iterator : IteratorProtocol

    /// Returns an iterator over the elements of this sequence.
    func makeIterator() -> Self.Iterator ✅
}
````

Iterator를 만들기 위해서는 `IteratorProtocol` 을 준수하는 타입을 만들어야 한다.

````swift
struct CustomIterator: IteratorProtocol {
    typealias Element = Int

    private var current: Int = 0

    mutating func next() -> Int? {
        self.current += 1
        return self.current
    }
}

struct CustomSequence: Sequence {
    func makeIterator() -> some IteratorProtocol {
        return CustomIterator()
    }
}

let sequence = CustomSequence()
for i in sequence {
    print(i)
} // 무한히 숫자가 늘어나며 출력
````

이런식으로 만들 수 있다. 만약 중간에 그만두고 싶다면 `if` 문 안에서 `break`을 해주는 방향이 있겠다. 실제 구현이 이런식으로 되어 있기 때문에, 앞에서 우리가 `for in` loop를 사용했을 때 compiler가 `iterator`를 생성해주는 방식으로 돌아가는 것이다.

다만, 여기서 특정 타입에 `IteratorProtocol`을 동시에 채택할 경우 Iterator class를 따로 만들어주지 않아도 된다. 즉, 타입 자체가 Iterator로 동작한다.

````swift
struct CustomSequence: Sequence, IteratorProtocol {
    typealias Element = Int
    private var current: Int = 0

    func makeIterator() -> Element? {
        self.current += 1
        return current
    }
}
````

## AsyncSequence

기본적으로 `AsyncSequence`도 Protocol이기 때문에 같은 방식으로 처리하면 되겠다.

````swift
struct CustomSequence: AsyncSequence, AsyncIteratorProtocol {
    typealias Element = Int

    private var current: Int = 1

    mutating func next() ✅ async ✅ throws -> Int? {
        if self.current == 10 {
            return nil
        }
        self.current += 1
        return current
    }

    func makeAsyncIterator() -> CustomSequence { ✅
        return self
    }
}

Task {
    let sequence = CustomSequence()

    for try await number in sequence {
        print(number)
    }
}

// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
````

여기서 변경되는 것은 `Sequence`가 `AsyncSequence`로, `IteratorProtocol`이 `AsyncIteratorProtocol`로 변화했다는 점이다. 그리고 `makeAsyncIterator()` 라는 함수를 추가로 구현해주어야 한다. `Sequence`의 경우에는 없었지만, 이경우는 모두 구현해주어야 한다.

그리고, `next()` 함수에 `throws`, `async` 가 추가되었다. 내부 구현이 이렇기 때문에, `for (try) await in` 와 같은 방식으로 사용하는 것.

그런데, 아까 `for await in`으로만 사용하지 않았었나? `throws`가 붙게 되면 `for try await in` 으로 무조건적으로 사용해야 하는 것 아닌가? 그래서 이 `throws`를 제거할 수 있다. 그렇게 되면 앞에서 본 것처럼 `for await in`으로 사용이 가능하다!

일단 위의 코드를 돌리면 10까지말 결과가 나오고 종료된다. sequence에서 결과를 종료하고 싶다면 `nil`을 리턴하면 된다.

# Summary

* `AsyncSequence`는 step별로 받을 수 있는 값을 제공 + 비동기성 추가한 Protocol이다.
* 해당 protocol을 준수한 친구들은 위와 같은 형식으로 `for (try) await in` syntax를 사용할 수 있다.
* 비동기적으로 동작하기 때문에 `await`와 함께 사용한다.
* 또한 비동기적으로 값을 가져오기 때문에, 실패할 가능성도 있다. 그래서 `try` 키워드를 사용한다.
* 다음 조건(실패하거나, 모두 순회하거나)인 경우 loop는 끝난다.
* Custom Async Sequence도 만들 수 있다. 만드는 방법은 Custom Sequence를 만드는 방법과 상당히 유사하다.

# Reference

* [Meet AsyncSequence](https://developer.apple.com/videos/play/wwdc2021/10058/)
* [AsyncSequence](https://developer.apple.com/documentation/swift/asyncsequence)
* [Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
* [AsyncLineSequence](https://developer.apple.com/documentation/foundation/asynclinesequence)
* [lines](https://developer.apple.com/documentation/foundation/url/3767315-lines)
* [반복자 패턴](https://ko.wikipedia.org/wiki/%EB%B0%98%EB%B3%B5%EC%9E%90_%ED%8C%A8%ED%84%B4)
* [Swift ) Sequence](https://zeddios.tistory.com/1340)
