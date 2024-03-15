---
title: where Clause
thumbnail: ''
draft: false
tags:
- swift
- where
- generic
- associated-type
created: 2023-09-30
---

generic을 보면서 몇몇 곳에서 `where` 키워드를 사용하는 것을 보았다. 한번 정리해야 할 것 같아 공식 문서을 읽어본다.

# Generic Where Clauses

generic에도 `where` 조항을 넣어 받는 타입에 세부 제약을 추가할 수 있다.

````swift
func allItemsMatch<C1: Container, C2: Container>
    (_ someContainer: C1, _ anotherContainer: C2) -> Bool
    where C1.Item == C2.Item, C1.Item: Equatable {

        // Check that both containers contain the same number of items.
        if someContainer.count != anotherContainer.count {
            return false
        }

        // Check each pair of items to see if they're equivalent.
        for i in 0..<someContainer.count {
            if someContainer[i] != anotherContainer[i] {
                return false
            }
        }

        // All items match, so return true.
        return true
}

extension Array: Container {} // 이미 해당 메서드를 준수하고 있음

var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")

var arrayOfStrings = ["uno", "dos", "tres"]

if allItemsMatch(stackOfStrings, arrayOfStrings) {
    print("All items match.")
} else {
    print("Not all items match.")
}
// Prints "All items match."
````

일반 `where` 절은 `where` 키워드로 시작한 다음, associated type에 대한 제약 조건 또는 associated type 간의 동등 관계 등을 정의할 수 있다. `allItemsMatch` 함수는 두개의 Container 프로토콜을 준수하는 구현체를 받아 내용물이 모두 같은지 비교한다. 이 때, 두개의 Container의 associted type인 `Item` 타입이 서로 같은지, 그리고 `Eqatable` 프로토콜을 준수하는지에 대한 제약을 추가했다. 이런 기능은 compile time에 타입 체크를 할 수 있기 때문에 type safe하게 처리할 수 있는 방법이다.

# Extensions with a Generic Where Clause

`where`절은 extension에도 추가할 수 있다.

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

extension Stack where Element: Equatable {
    func isTop(_ item: Element) -> Bool {
        guard let topItem = items.last else {
            return false
        }
        return topItem == item
    }
}
````

위의 단순한 stack의 경우에는 element간의 동등 여부(`"=="`)를 확인할 수 없었다. 이는 Item이 `Equable` protocol을 준수하지 않았기 때문이다. 실행하면 compile error가 뜨게 될 것이다. 이런 경우, 부분적으로 extension에 Item type에 `where`를 통한 제약을 걸어 부분적으로 처리할 수 있다.

````swift
if stackOfStrings.isTop("tres") {
    print("Top element is tres.")
} else {
    print("Top element is something else.")
}
// Prints "Top element is tres."
````

만약 equtable을 준수하고 있지 않은 타입으로 만들면 어떨까?

````swift
struct NotEquatable { }
var notEquatableStack = Stack<NotEquatable>()
let notEquatableValue = NotEquatable()
notEquatableStack.push(notEquatableValue)
notEquatableStack.isTop(notEquatableValue)  // Error
````

당연하게도 compile error가 뜬다.

## Extension with a Protocol where clause

이렇게 extension에 `where`을 사용해서 추가적인 제약을 거는 것은 protocol에서도 가능하다.

````swift
extension Container where Item: Equatable {
    func startsWith(_ item: Item) -> Bool {
        return count >= 1 && self[0] == item
    }
}

extension Container where Item == Double {
    func average() -> Double {
        var sum = 0.0
        for index in 0..<count {
            sum += self[index]
        }
        return sum / Double(count)
    }
}

if [9, 9, 9].startsWith(42) {
    print("Starts with 42.")
} else {
    print("Starts with something else.")
}
// Prints "Starts with something else."

print([1260.0, 1200.0, 98.6, 37.0].average())
// Prints "648.9"

````

protocol은 extension에 기본 동작을 정의할 수 있는데, 이경우 where와 함께 사용하면 추가적인 제약을 걸면서 기본동작까지 처리할 수 있다. (`[9, 9, 9]` 가 처리가능 한 것은 위에서 `extension Array: Container {}`를 했기 때문이다.)

# Reference

* [Generics](https://docs.swift.org/swift-book/LanguageGuide/Generics.html)
