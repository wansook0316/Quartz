---
title: Parameters Arguments
thumbnail: ''
draft: false
tags:
- parameter
- argument
- ios
- swift
created: 2023-09-18
---

# Parameters

## 문서에 제공할만한 매개변수 이름을 선택하자.

* 파라미터 이름을 숨겨 보이지 않는 경우에도 설명에 있어서는 중요하다.
* 

````swift
/// Return an `Array` containing the elements of `self`
/// that satisfy `predicate`.
func filter(_ predicate: (Element) -> Bool) -> [Generator.Element]

/// Replace the given `subRange` of elements with `newElements`.
mutating func replaceRange(_ subRange: Range, with newElements: [E]) // subrange
````

## 일반적인 사용을 위해서 Default Parameter를 사용해라.

* 일단 인자가 여러개면 지저분하다.
* 만약 일반적인 사용에 인자가 하나만 들어가고, 기본값이 들어간다면 Default Parameter를 사용해라.

````swift
// Bad
let order = lastName.compare(
  royalFamilyName, options: [], range: nil, locale: nil)
````

````swift
// Good
let order = lastName.compare(royalFamilyName)
````

## 기본 값이 있는 경우 매개변수 목록의 끝에 위치하는 것이 좋다.

* 즉, 필수 파라미터의 경우 앞에, 그렇지 않은 경우는 뒤쪽으로 두라는 말이다.
* 이해가 보다 쉽기 때문이다.

# Argument Labels

## 인수를 유용하게 구분할 수 없다면 "생략"해라.

````swift
min(number1, number2)
zip(sequence1, sequence2)
````

## 값은 같은데 타입만 변경할 용도로 사용할 생성자에서는 첫번째 Argument Label을 생략해라.

````swift
Int64(someUInt32)
Int(someString)
````

````swift
extension String {
  // Convert `x` into its textual representation in the given radix
  init(_ x: BigInt, radix: Int = 10)   // Note the initial underscore
}

extension UInt32 {
  init(_ value: Int16)           // 단순 변환, label이 없다.
  
  init(truncating source: UInt64) // 값을 자른다는 추가 동작이 들어간다. label이 있다.

  init(saturating valueToApproximate: UInt64) // 가장 가까운 정수로 떨어트리는 동작이 있다.
}
````

## 첫번째 인수가 전치사를 필요로 한다면 Argument Label에 사용해라.

````swift
x.removeBoxes(havingLength: 12)

removeBoxes(havingLength length: Int) // 이런식으로 되어 있을 것.
````

* 예외 상황이 있다.
* 두개 이상의 arguments가 동일한 추상화정도를 가지고 있다면, arguement label을 전치사 다음에 시작하도록 하자.
* 그렇게 되면 보다 명확하게 읽히게 된다.

````swift
// Bad
a.move(toX: b, y: c)
a.fade(fromRed: b, green: c, blue: d)
````

````swift
a.moveTo(x: b, y: c)
a.fadeFrom(red: b, green: c, blue: d)
````

## 첫번째 Arguments가 전치사를 필요로 하지 않는다면, label을 생략해라.

````swift
x.addSubview(y) // 굳이 subviews라는 label을 붙일 필요가 없다.
````

* 그런데 함수를 구성하고 보니까, 문법적으로 옳은 구를 만들고 있지 않다면 label을 붙여라.

````swift
// Bad
view.dismiss(false)   // Don't dismiss? Dismiss a Bool?
words.split(12)       // Split the number 12?
````

````swift
// Good
view.dismiss(animated: false)
let text = words.split(maxSplits: 12)
let studentsByName = students.sorted(isOrderedBefore: Student.namePrecedes)
````

## 다른 모든 인수에 label을 달아라.

* 지금까지는 첫번째에 대해서만 얘기했다.
* 두번째, 세번째 argument에는 모두 label을 달으라는 말이다.
* 이런 코드를 본적이 있는데, 진짜 어떤 함수인지 감이 안온다.

# Special Instructions

## 튜플 멤버에 이름을 달아라.

````swift
mutating func ensureUniqueStorage(minimumCapacity requestedCapacity: Int, allocate: (_ byteCount: Int) -> UnsafePointer<Void>) -> (reallocated: Bool, capacityChanged: Bool)
````

## Any, AnyObject와 같은 제약 없는 다형성 사용하는 타입들을 조심해라. 모호함이 증가될 수 있다.

````swift
struct Array {
  // 가장 뒤에 element를 추가한다.
  public mutating func append(_ newElement: Element)

  // 가장 뒤에 elements들을 순서대로 넣는다. 얘는 여러개다.
  public mutating func append(_ newElements: S)
    where S.Generator.Element == Element
}
````

* 이렇게만 보면 큰 문제가 없어보인다. 
* 보통 같은 원소가 들어올 것이라 예상하기 때문에.
* 그런데 Element가 Any, AnyObject와 같은 타입이라면 어떨까?

````swift
var values: [Any] = [1, "a"]
values.append([2, 3, 4]) // [1, "a", [2, 3, 4]] or [1, "a", 2, 3, 4]?
````

* 갑자기 이게 어떻게 들어가는지 모르겠다.
* 그렇기 때문에 추가정보를 제공하는 것이 좋다.

````swift
struct Array {

  public mutating func append(_ newElement: Element)

  public mutating func append(contentsOf newElements: S)
    where S.Generator.Element == Element
}
````

# 실전에 사용할 만한 TIP

````swift
// 이런식으로 Range를 함수이름에 붙이고, 파라미터 이름을 숨긴다.
// 추가적으로 받는 인자에 대해 전치사를 사용한다.
mutating func replaceRange(_ r: Range, with: [E]) 

a.moveTo(x: b, y: c)
a.fadeFrom(red: b, green: c, blue: d)

x.removeBoxes(havingLength: 12)
removeBoxes(havingLength length: Int) // 이런식으로 되어 있을 것.
````

# Reference

* [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/#naming)
