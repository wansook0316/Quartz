---
title: MetaType
thumbnail: ''
draft: false
tags:
- swift
- metatype
- protocol
created: 2023-09-30
---

이전에 metatype에 대해 흘려들었었는데, 이번에 간단하게 정리해보려한다.

# metatype이란?

Swift에서 우리는 특정 instance의 Type에 접근할 수 있다.

````swift
struct SomeStruct {
    static let variable: String = "HI"
}

let someStruct = SomeStruct()
let someStructType = type(of: someStruct)
let someStructStaticVariable = someStructType.variable
print(someStructStaticVariable) // HI
````

그럼 여기서 `someStructType`은 어떤 Type일까? 이녀석은 `SomeStruct.Type`이라 되어있다. 바로 이녀석이 metatype이다.

이렇게 받은 metaType은, `ViewController.init()`을 하여 인스턴스를 생성하는 것처럼 사용이 가능하다. 이러한 점을 이용하면 인수로 metatype을 받아 해당 metatype의 instance를 만드는 것도 가능하다.

````swift
class Apple {
    required init() {}
}

func createApple<T: Apple>(appleType: T.Type) -> T {
    return appleType.init()
}

let apple = self.createApple(appleType: Apple.self)
print(apple) // test.apple
````

여기서 그런데 인수로 넣어줄 때 `Apple.self` 로 넣어주었다. 이녀석은 뭘까?

# metatype의 Value

````swift
let a: Int = 3
````

여기서 a의 Type은 Int이고, Value는 3이다. 그럼 class, struct, enum 자체에 접근한 녀석의 type과 value도 있지 않을까? 

||Type|Value|예시|
|--|----|-----|------|
|Instance|Int, String|3, "wansik"|`let a: Int = 3`|
|Class, Struct 자체|Int.Type, String.Type|Int.self, String.self|`let a: Int.Type = Int.self`|

이런 이유 때문에, `createApple<T: Apple>(appleType: T.Type) -> T`에서 `T.Type`은 class, struct, enum 자체의 metatype의 type을 말하고, 실제 값은 `Apple.self`로 class, struct, enum 자체의 value를 넣어준 것이다.

# Protocol metatype

그런데 protocol에서는 이 논리가 통하지 않는다.

````swift
protocol MyProtocol {}
let metatype: MyProtocol.Type = MyProtocol.self // compile Error
````

이는 `MyProtocol.Type`이 protocol 자체의 metatype의 type을 가리키지 않기 때문이다. 엥? 그럼 뭘 가리킬까? **이 프로토콜을 준수하고 있는 Type의 metatype을 가리킨다.** 즉, Protocol은 추상 인터페이스이기 때문에, 실제 이를 준수하는 녀석이 구현체인데, 이녀석의 metatype을 가리킨다는 것이다. Apple은 이를 `existential metatype`, 실존 메타타입이라고 부른다. 코드를 보자.

````swift
protocol MyProtocol {
    static func test()
}
struct MyType1: MyProtocol {
    static func test() {
        print("my type1")
    }
}

struct MyType2: MyProtocol {
    static func test() {
        print("my type2")
    }
}
 
let metatype1: MyProtocol.Type = MyType1.self
let metatype2: MyProtocol.Type = MyType2.self
metatype1.test() // my type1
metatype2.test() // my type2
````

즉, 이 경우 metatype1, 2 변수는 MyProtocol의 static property 또는 method에만 접근 가능해진다. 엄밀히 말하면 MyType struct의 구현체가 불린다. 그래서 실제 구현체의 값이 호출되는 것을 확인할 수 있다.

그럼 protocol 자체의 type은 어떻게 접근할 수 있을까?

````swift
let protocolType: MyProtocol.Protocol = MyProtocol.self
````

이렇게 하면 얻을 수는 있지만, 실제 기본 구현을 접근해서 사용할 수 없기 때문에 실질적으로 사용하기는 어려워보인다.

# Reference

* [What's .self, .Type and .Protocol? Understanding Swift Metatypes](https://swiftrocks.com/whats-type-and-self-swift-metatypes)
* [Type](https://docs.swift.org/swift-book/ReferenceManual/Types.html)
* [type(of:)](https://developer.apple.com/documentation/swift/type(of:))
