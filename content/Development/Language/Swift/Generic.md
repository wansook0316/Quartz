---
title: Generic
thumbnail: ''
draft: false
tags:
- swift
- generic
- associated-type
- placeholder
- type-constraint
- where
created: 2023-09-30
---

Generic의 경우 코드 중복을 줄일 수 있는 좋은 기능이다. 잘 다뤄둔다면 중급(?) 이상의 개발자가 되는데 큰 도움을 줄 것이다. 그럼 시작해보자!

# placeholder

* `<>` 안에 들어간 것을 placeholder라 함
* function내부에서 parameter type이나 return type으로 사용가능
  ````swift
  func swap<T>(_ a: inout T, _ b: inout T) {
      let temp = a
      a = b
      b = a
  }
  
  struct Stack<Element> {
      var items = [Element]()
      mutating func push(_ item: Element) {
          self.items.append(item)
      }
      mutating func pop() -> Element {
          return self.items.removeLast()
      }
  }
  ````

# Type Constraint

````swift
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
  
}
````

# Associated Type

* protocol 정의 시 그 protocol이 사용할 임의의 type을 선언해 둘 수 있음
* `associatedtype`
  ````swift
  protocol Container {
      associatedtype Item // Item이라는 type이 있을 거야~
      mutating func append(_ item: Item)
      var count: Int { get }
      subscript(i: Int) -> Item { get }
  }
  
  struct Stack<Element>: Container {
      var items = [Element]()
      mutating func push(_ item: Element) {
          self.items.append(item)
      }
      mutating func pop() -> Element {
          return self.items.removeLast()
      }
  
      typealias Item = Element // associated type인 Item을 Element라 할거야: type inference로 생략가능
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

# `where`

* type parameter에 where절을 이용해서 제약 가능
  ````swift
  func allItemsMatch<C1: Container, C2: Container>(_ c1: C1, c2: C2) -> Bool where C1.item == C2.Item, C1.Item: Equatable {
    
  }
  ````
  
  * `C1.item == C2.Item`은 두 container의 item이 동일한 type이라는 제약
  * `C1.Item: Equatable` item이 비교 가능한 type이어야 한다는 제약

# Reference

* [33. Generic](33.%20Generic.md)
