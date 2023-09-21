---
title: Naming Conventions
thumbnail: ''
draft: false
tags:
- naming
- conventions
- swift
- ios
created: 2023-09-18
---

# Fundamentals

* 사용처에 대한 "명료함"이 최우선이다.
* "간결함"보다 "명료함"이 보다 중요하다.
* 모든 선언에 대해 문서를 작성해라.
  * ???
  * 클린코드와 대치된다.

# Promote Clear Usage

## 코드를 읽을 때 사람에게 모호함을 주지 않도록 필요한 모든 단어를 포함해라.

````swift
extension List {
  public mutating func remove(at position: Index) -> Element
}
employees.remove(at: x)

employees.remove(x) // unclear: are we removing x?

````

## 불필요한 단어는 생략한다.

* 중복되는 단어는 제거한다. 굳이 반복할 필요가 없다.

````swift
public mutating func removeElement(_ member: Element) -> Element?

allViews.removeElement(view)

public mutating func remove(_ member: Element) -> Element?

allViews.remove(view) // Clearer!
````

## 변수, 매개변수, 연관 타입은 "역할"에 맞춰 짓는다. 타입에 맞추지 않는다.

* 타입 자체의 의미가 변수이름에 들어가면 명확하지도 않고, 표현력도 좋지 않다.
* "역할"을 표현할 수 있는 이름이어야 좋다.

````swift
var string = "Hello" // String타입을 변수 이름으로 지정함

protocol ViewController {
  associatedtype ViewType : View // 역할이 아니고 타입에 맞춰서 지음
}

class ProductionLine {
  func restock(from widgetFactory: WidgetFactory) // 역할에 맞춰서 지음
}
````

````swift
var greeting = "Hello"
protocol ViewController {
  associatedtype ContentView : View
}
class ProductionLine {
  func restock(from supplier: WidgetFactory)
}
````

* 그런데 코딩을 하다보면, 특정 프로토콜 타입이름이 변수를 대변해야 하는 경우가 있다.
* 이런 경우 프로토콜에 `Protocol`이라는 접미사를 붙여서 문제를 피한다.

````swift
protocol Sequence {
  associatedtype Iterator : IteratorProtocol
}
protocol IteratorProtocol { ... }
````

## 파라미터의 역할을 명확히 하기 위해 약한 타입에 대한 정보를 보완해라.

* 매개변수 유형이 NSObject, Any, AnyObject, Int, String과 같은 기본 유형인 경우
* 사용하는 사람이 만든 의도를 완전히 파악하기 어려울 수 있다.

````swift
func add(_ observer: NSObject, for keyPath: String)

grid.add(self, for: graphics) // 읽을 때 그래서 이게 무슨 타입인지 파악하기 애매하다.
````

````swift
func addObserver(_ observer: NSObject, forKeyPath path: String)

grid.addObserver(self, forKeyPath: graphics) // clear
````

# Strive for Fluent Usage

## 영어 구문처럼 자연스럽게 읽히도록 만들어라.

````swift
x.insert(y, at: z)          “x, insert y at z”
x.subViews(havingColor: y)  “x's subviews having color y”
x.capitalizingNouns()       “x, capitalizing nouns”
````

## 팩토리 메서드의 이름은 `make`로 시작해라.

````swift
x.makeIterator()
````

## 생성자와 팩토리 메서드에 Label에 Base name을 사용하지 마라.

* Label: argument label
* Base name: "make"와 같은 단어

````swift
// GOOD
let foreground = Color(red: 32, green: 64, blue: 128)
let newPart = factory.makeWidget(gears: 42, spindles: 14)
let ref = Link(target: destination)
````

````swift
// BAD
let foreground = Color(havingRGBValuesRed: 32, green: 64, andBlue: 128)
let newPart = factory.makeWidget(havingGearCount: 42, andSpindleCount: 14)
let ref = Link(to: destination)
````

## Side Effect에 따라 메서드 이름을 구분해라.

* side-effect: 메서드가 반환하는 값 외에도, 메서드를 호출하는 쪽에서도 변화가 생기는 경우
* side-effect가 없는 경우라면 "명사"를 사용한다.
  * `x.distance(to: y)`, `i.successor()`
* 있는 경우라면 "동사"를 사용한다.
  * `x.sort()`, `x.append(y)`

## Mutating / Nonmutating 메서드을 한 쌍으로 구성해라.

* 특정 동작이 애초에 "동사"로 밖에 표현될 수 없다면,
* nonmutating function의 이름에 "ed", "ing"를 붙여서 nonmutating function의 이름을 만들어라.

|Mutating|Nonmutating|
|--------|-----------|
|x.sort()|z = x.sorted()|
|x.append(y)|z = x.appending(y)|

* 특정 동작이 애포에 "명사"로 밖에 표현될 수 없다면,
* mutating function의 이름에 "form"을 붙여서 mutating function의 이름을 만들어라.

|Mutating|Nonmutating|
|--------|-----------|
|x.formUnion(z)|z = x.unioned(z)|
|x.formSuccessor(y)|z = x.successor(&y)|

## Boolean은 이를 받는 쪽에서 "assert"문을 읽는 것 처럼 표현되어야 한다.

* `x.contains(y)`
* `x.isDisjoint(with: y)`
* `x.isSubset(of: y)`
* `x.isEmpty`

## "무엇인지"를 나타내는 프로토콜의 이름은 명사로 표현해라.

|프로토콜 이름|프로토콜 설명|
|-------------------|-------------------|
|`Collection`|컬렉션(collection)의 특성을 나타내는 프로토콜|
|`IteratorProtocol`|이터레이터(iterator)의 특성을 나타내는 프로토콜|
|`Sequence`|순서가 있는 시퀀스(sequence)의 특성을 나타내는 프로토콜|
|`OptionSet`|옵션 집합(option set)의 특성을 나타내는 프로토콜|

## 능력을 나타내는 프로토콜의 이름은 "able"로 끝나야 한다.

|프로토콜 이름|프로토콜 설명|
|-------------------|-------------------|
|`Comparable`|비교 가능한(comparable) 값의 특성을 나타내는 프로토콜|
|`Equatable`|동등비교(equatable) 가능한 값의 특성을 나타내는 프로토콜|
|`RawRepresentable`|raw value를 가지는(raw-representable) 타입의 특성을 나타내는 프로토콜|

## Type, Perperty, variables, constants는 명사로 읽혀야 한다.

# Use Terminology Well

## 모호한 용어를 피해라.

* 더 일반적인 단어로 의미를 전달할 수 있다면 모호한 용어는 피해라.
* 굳이 "피부"를 사용할 수 있는데 "표피"로 표현할 필요는 없다.
* 전문 용어는 필수적일 때만 사용해라. 중요한 정보를 놓칠 필요가 있다던가.

## 새로운 용어를 사용한다면, 그 의미에 딱 맞게 사용해라.

* 이미 있는 단어인데 다른 단어를 쓴다면 상사가 화낼 거다.
* 저연차 신입도 결국 보편적으로 사용하는 단어를 찾을 것이다.

## 약어 사용을 피해라.

* 특히 비표준 약어는 거의 전문 용어라 봐도 무방하다.
* 만약 약어를 사용하고 싶다면, 웹 검색을 통해 쉽게 찾을 수 있어야 할 정도로 보편적이어야 한다.

## 이전의 문화를 수용해라.

* 완전 초보자는 `Array`보다 `List`가 더 쉬울 수 있다.
* 하지만 배열은 컴퓨팅의 기본이기 때문에, 배열을 사용하는 것이 더 좋다.
* 익숙한 용어를 사용하면, 그 프로그래머가 정보를 익히는 시간도 줄기 때문에, 그에 대한 가치가 있다.
* 마찬가지로 `verticalPositionOnUnitCircleAtOriginOfEndOfRadiusWithAngle(x)`보다 `sin(x)`가 더 좋다.

# Conventions

## `O(1)`이 아닌 모든 computed property의 복잡도를 문서화해라.

* 보통 사용할 때 복잡도가 높지 않다고 생각하는 경향이 크기 때문이다.

## Free functions보다는 methods를 사용해라.

* Free functions: `print`와 같이 타입에 속하지 않은 함수
* 특별한 경우에만 사용하자.
  * `min(x, y, z)`: 명확한 self가 없는 경우
  * `print(x)`: Generic으로 제공되어야 할 떄
  * `sin(x)`: 특정 함수가 이미 잘 정립된 도메인의 일종일 때 (수학)

## Case Convention을 지키자.

* Type, Protocol: UpperCamelCase
* EveryThingElse: lowerCamelCase
* 약어의 경우에는 모두 Uppercase로 표현한다.
  * `URL`, `HTTP`, `JSON`, `XML`, `HTML`, `CSS`, `ID`, `API`, `iOS`, `macOS`

## 메서드는 기본 이름을 공유할 수 있다.

* 이건 사실 당연한 것.
* `value` 라는 의미는 각 타입에 따라 달라질 수 있으나 이름은 공유해서 사용할 수 있다.

# Reference

* [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/#naming)
