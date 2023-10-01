---
title: associatedtype
thumbnail: ''
draft: false
tags:
- swift
- associated-type
- type-constraint
created: 2023-09-30
---

type alias를 공부하면서 마주쳤던 associated type에 대해 알아본다.

# Type Constraints

````swift
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
    // function body goes here
}

func findIndex<T: Equatable>(of valueToFind: T, in array:[T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
````

generic을 사용하는데 있어, 내부에서 사용하는 타입에 제약사항을 걸 수 있다. `findIndex`의 경우 T Type이 Equatable이어야만 사용가능하다.

# Associated Types

프로토콜을 정의할 때, 하나 이상의 관련 유형을 프로토콜 정의의 일부로 사용할 수 있다. [Type Alias](https://velog.io/@wansook0316/Type-Alias)에서도 사용했는데, 다음과 같이 사용할 수 있다.

````swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
````

`Container` 프로토콜을 준수하는 모든 타입은, 저장하는 값의 타입을 명시해야 하고, 이 값은 컨테이너에 추가될 수 있는 타입임을 보장해야한다. 뿐만 아니라 subscript를 통해 반환될 수 있는 타입이어야 함도 보장해야한다. 이를 위해서, `Container` 프로토콜은 구체적인 컨테이너의 타입을 알지 못하더라도, 컨테이너가 가질 요소들의 타입을 언급할 필요가 있다. 다시 말해, `Container` 프로토콜은 `append(_:)` 메소드를 통해 전달되는 값이 컨테이너의 요소와 같은 타입이어야 한다는 것과 컨테이너의 `subscript` 역시 컨테이너의 요소와 같은 타입이어야 한다는 것을 명시해야한다. 이를 위해서 **`Container` 프로토콜은 `associated type`인 `Item`을 활용하는 것**이다.

````swift
struct IntStack: Container {
    // original IntStack implementation
    var items = [Int]()
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
    // conformance to the Container protocol
    typealias Item = Int // 추상 타입 Item을 Int로 바꿔 사용하기 위한 구문
    mutating func append(_ item: Int) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Int {
        return items[i]
    }
}
````

`IntStack` 타입은 `Container` 프로토콜을 체택하고 세 가지 필수 요구사항을 준수하고 있고, `associatedtype`인 `Item` 사용하기 위해 `Int` 타입을 사용하고 있다. `typealias Item = Int` 는 프로토콜을 준수하기 위해서 추상 타입인 Item을 Int 로 바꿔 사용하기 위한 구문이다. **Swift의 타입 추론 덕분에 이 구문은 생략 가능하다.**

````swift
struct Stack<Element>: Container {
    // original Stack<Element> implementation
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
    // conformance to the Container protocol
    mutating func append(_ item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}
````

위와 같이 generic stack 타입을 통해서도 `Container` 프로토콜을 준수할 수 있다.

## Adding Constraints to an Associated Type

Associated Type에도 Type Constraint를 걸 수 있다. 

````swift
protocol Container {
    associatedtype Item: Equatable
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
````

## Using a Protocol in Its Associated Type’s Constraints

프로토콜은 자기 자신의 요구사항의 일부로 표현될 수 있다. 예를 들어, 다음은 `Container` 프로토콜에 `suffix(_:)` 메소드를 추가하여 기존의 프로토콜을 개선한 코드이다. `suffix(_:)`는 컨테이너의 끝에서부터 주어진 개수의 요소를 반환하여, `Suffix` 타입의 인스턴스에 저장하는 메소드이다.

````swift
protocol SuffixableContainer: Container {
    associatedtype Suffix: SuffixableContainer where Suffix.Item == Item
    func suffix(_ size: Int) -> Suffix
}
````

여기서 `Suffix`는 associated type이며, 두가지 제약 조건을 가진다.

1. `SuffixableContainer`를 준수해야 한다.
1. 그리고 해당 type의 `Item`은 `Container`의 `Item` 타입과 같아야 한다.

````swift
struct Stack<Element>: Container {
    // original Stack<Element> implementation
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
    // conformance to the Container protocol
    mutating func append(_ item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}

extension Stack: SuffixableContainer {
    func suffix(_ size: Int) -> Stack {
        var result = Stack()
        for index in (count-size)..<count {
            result.append(self[index])
        }
        return result
    }
    // Inferred that Suffix is Stack.
}
var stackOfInts = Stack<Int>()
stackOfInts.append(10)
stackOfInts.append(20)
stackOfInts.append(30)
let suffix = stackOfInts.suffix(2)
// suffix contains 20 and 30
````

이 코드에서 `Stack`의 `Suffix` `associated type`은 또한 `Stack` 이고, 따라서 `Stack`의 `suffix` 작업은 또 다른 Stack 을 반환한다.

# Reference

* [Generics](https://docs.swift.org/swift-book/LanguageGuide/Generics.html)
