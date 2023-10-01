---
title: Automatic Reference Counting
thumbnail: ''
draft: false
tags:
- ARC
- Automatic-Reference-Counting
- garbage-collection
- strong-reference
- weak-reference
- weak
- unowned
- reference-cycle
created: 2023-09-30
---

오래 기다렸다. ARC가 무엇일까? 자바의 Garbage Collector와는 무엇이 다를까? 장단점은 무엇일까? 어떤 원리로 동작하는 것일까? 발생하는 문제점은 무엇일까? 어떻게 해결할 수 있을까? 이러한 내 궁금증들을 담았다.

# 개요

* Reference Type의 메모리 관리/추적을 Reference Count라는 참조 카운트로 함
* Swift는 대부분 ARC가 메모리 관리해줌
* 하지만 특정 관계에서 compiler에게 추가 정보를 제공함

* ARC는 **Class instance**에 대해서만 적용됨 (reference type)

# 동작 방식

* Instance를 만들 때마다, ARC는 메모리 청크(덩어리?)를 할당한다. 이건 그 인스턴스에 대한 정보를 저장하기 위한 것이다.
* 이 메모리는 인스턴스의 타입에 대한 정보를 가지고 있다.
* 또한 그 인스턴스와 관련된 property도 함께 저장한다. 그냥 인스턴스가 생성되면 ARC가 메모리 공간을 할당한다는 이야기
* 추가적으로 인스턴스가 필요없게되는 ARC가 메모리를 할당 헤제한다.
* 결국 ARC는 메모리를 관리하는 녀석
* 근데 이제 문제가 뭐냐면, **이미 사용하고 있는 인스턴스에 대해 할당 해제**하는 경우이다.
* 이럴 경우, 이미 인스턴스가 해제되었는데, 접근하게되어 앱이 크래시난다.
* 이러한 문제를 방지하기 위해, 즉 아직 사용하고 있는 인스턴스에 대해 할당해제하지 않도록 하기 위해 ARC는 얼마나 많은 properties, constants, 변수들이 각각의 클래스 인스턴스에 참조하고 있는지 추적한다.
* 쉽게 말하면 특정 A라는 인스턴스에 대해 여기저기서 얼마나 이녀석을 참조하고 있는지 관찰하고 있다는 것
* 이렇게 해서, ARC는 인스턴스가 적어도 1개 이상의 참조를 받고 있을 경우 할당을 해제하지 않는다.
* 기본적으로 그래서 구현할 때, 참조를 하게 되면 `strong`한 참조를 하게 된다.
* 그냥 무조건적으로 참조하면 +1 하는거야.

## 코드로 알아보기

````swift
class Person {
    let name: String
    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }
    deinit {
        print("\(name) is being deinitialized")
    }
}
var reference1: Person?
var reference2: Person?
var reference3: Person?

````

이렇게 클래스가 있는데 아래에서 optional로 선언했다. 그렇기 때문에, 아직 인스턴스화 되지 않은 상태이다.

````swift
reference1 = Person(name: "John Appleseed")
// Prints "John Appleseed is being initialized"
````

인스턴스화를 하게 되면 생성자가 호출되면서 출력을 하게 된다. 이렇게 인스턴스화 하게된 이후에는 ARC는 해당 인스턴스의 참조를 추적하게 된다. 지금은 `reference1`이라는 변수가 참조하고 있기 때문에 reference count는 1이고, 1이기 때문에 할당해제 되지 않는다.

````swift
reference2 = reference1
reference3 = reference1
````

그러면 이렇게 두개의 추가 변수가 같은 인스턴스를 가리킨다면 어떨까? reference count가 3이된다.

````swift
reference1 = nil
reference2 = nil
````

이렇게 두개를 참조 해제하게 되면 reference count는 1이 되겠다.

````swift
reference3 = nil
// Prints "John Appleseed is being deinitialized"
````

이렇게 nil로 변경하게 되면, 최종적으로 reference count는 0이되고, 할당해제 된다.

# 강한 참조 순환

* 위에서 본 것은 결국 인스턴스에 대해 reference count가 어떤식으로 발생할 수 있는지를 알아봤다.
* 굉장히 합리적이고 잘 동작할 것 같지만, 특정 상황에서는 그렇지 않다.
* strong referece count가 0임에도 메모리에서 인스턴스가 할당해제되지 않는 상황이 발생할 수 있기 때문
* 이런 상황은 두개의 class instance가 서로를 강한 참조하는 경우에 발생한다.
* 이런 상황을 `strong reference cycle`이라 한다.
* `weak` 또는 `unowned` reference를 사용해서 이런 상황을 해결할 수 있다.

````swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment?
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    var tenant: Person?
    deinit { print("Apartment \(unit) is being deinitialized") }
}
````

* 보게 되면, Person의 프로퍼티인 apartment가 있고, 
* Apartment도 Person을 프로퍼티로 가지고 있다.

````swift
var john: Person?
var unit4A: Apartment?
john = Person(name: "John Appleseed")
unit4A = Apartment(unit: "4A")
````

![](123977224-c62f3a00-d9f9-11eb-98cd-5aa6bec69f0c.png)

* 그림으로 보면 이러한 상황이다. 변수들이 생성된 각각의 인스턴스를 강하게 참조하고 있다.
* 이제 여기서 각 클래스 인스턴스 프로퍼티가 서로의 인스턴스를 참조하도록 코드를 작성해보자.
* 이렇게 선언하게 되면, 일단 john instance의 reference count + 1
* unit4A instance도 reference count + 1 되게 된다.

````swift
john!.apartment = unit4A
unit4A!.tenant = john
````

![](123977626-1f976900-d9fa-11eb-8cf8-e39df1357903.png)

* 존재하는 것이 확실하니 강제 언래핑을 사용했다.
* 그러면 위와 같은 그림이 만들어진다.
* 각각의 인스턴스에 있는 property는 서로를 강하게 참조하고 있다. 
* 현재 Person instance의 참조 개수는 2개, Apartment instance의 참조 개수 역시 2이다.

````swift
john = nil
unit4A = nil
````

![](123978079-861c8700-d9fa-11eb-95e2-874bd6055c8c.png)

* 이 상태에서 john과 unit4A의 변수의 참조를 해제하면 어떻게 될까?
* 여전히 참조개수는 각각 1, 1으로 해당 인스턴스는 메모리에서 할당해제 되지 않는다.
* 이 문제는 굉장히 심각하다. 접근 자체도 불가능한 상황에, 의도한 바대로 동작하지 않았기 때문에 쓰레기 값이 계속해서 누적되는 결과를 초래한다.

# 강한 참조 해결 방법

스위프트는 두가지 방법을 제공한다. `weak`, `unowned`이 두가지이다.

## weak

* 인스턴스가 있을 때, 더 짧은 생애주기, 즉 더 빨리 없어질 것 같은 놈한테 weak을 단다.
* 위의 예라면, 아파트의 세입자는 더 자주바뀐다. 그렇기 때문에 세입자앞에 weak 다는 것이 좋다.
* **핵심은 참조하되 강한 참조를 하지 않는다는 것이다.**
* 그렇기 때문에 강한 참조 count가 0이 된 경우, ARC는 이를 할당 해제해버린다.
* 그러면 weak 키워드를 달고 참조를 하고 있던 녀석은 "응? 난 계속 있다고 생각하는 중임 ㅇㅇ" 이런식으로 얼을 타게 된다.
* 즉 쓰레기 주소를 가리키고 있을 것이다.
* 그렇기 때문에 ARC는 인스턴스가 해제되었을 때, weak 참조를 한 변수에 대해 `nil`을 줘버린다.
* **이러한 것은 런타임에서 벌어진다...!!!!**
* 그렇기 때문에 `weak`을 사용할 경우 무조건 <mark style='background-color: #fff5b1'> var </mark> 로 선언해야 한다.
* 그리고 할당이 해제될 때 `optional`이 되기 때문에 <mark style='background-color: #fff5b1'> 무조건 `optional`로 선언해야 한다. </mark>

````swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment?
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    weak var tenant: Person?
    deinit { print("Apartment \(unit) is being deinitialized") }
}

var john: Person?
var unit4A: Apartment?

john = Person(name: "John Appleseed")
unit4A = Apartment(unit: "4A")

john!.apartment = unit4A
unit4A!.tenant = john
````

![](123982721-3c35a000-d9fe-11eb-92ff-d9a7f419e3cd.png)

아까와 달리 Apartment에서 tenant가 weak으로 선언되어 있다. 그리고 나서 위와 같이 선언을 해준 상태이다. 이제 이상황에서 john의 참조를 끊어보자.

````swift
john = nil
// Prints "John Appleseed is being deinitialized"
````

tenant는 weak 참조이기 때문에 Person instance의 reference count는 0이 되어 할당이 해제 된다. ARC는 weak으로 참조하고 있던 tenant 변수의 값을 nil로 변경한다.
![](123983065-89197680-d9fe-11eb-8f34-153ec4502586.png)

이제 이 상황에서 unit4A도 할당을 해제해보자.

````swift
unit4A = nil
// Prints "Apartment 4A is being deinitialized"
````

![](123983255-b0704380-d9fe-11eb-9f7e-7b314ba0ace2.png)

원하는 결과를 얻었다! Apartment instance도 reference count가 1이었기 때문에, unit4A가 참조를 해제하는 순간 0이되어 할당이 해제되었다. 

## unowned

* `unowned`역시 강한 참조를 하지는 않는다.
* 그런데, 이건 다른 인스턴스가 같거나 거 긴 생애주기를 가질 때 사용한다.
* `weak` 참조와 다르게, 이녀석은 항상 값을 가지고 있기를 기대한다.
* <mark style='background-color: #fff5b1'> **즉, `unowned`로 선언하게 되면, ARC는 value를 nil로 변경하지 않는다.** </mark>
* 그래서 이 참조는 인스턴스가 항상 있다고 확신할 때 사용해야 한다.
* 만약에 `unowned` 로 선언된 값이 인스턴스가 해제된 이후 접근하게 되면 런타임 에러가 난다.

````swift
class Customer {
    let name: String
    var card: CreditCard?
    init(name: String){
        self.name = name
    }
    deinit { print("\(name) is being deinitialized") }
}

class CreditCard {
    let number: UInt64
    unowned let customer: Customer
    init(number: UInt64, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    deinit { print("Card #\(number) is being deinitialized") }
}
````

* Person class와 신용카드 클래스이다.
* 서로는 서로의 클래스 인스턴스를 프로터피로서 저장한다.
* 이러한 상황은 강한 참조 순환 문제를 야기할 수 있는 상태이다.
* 여기서 객체간의 관계를 잘 살펴보아야 한다.
* 이전에 아파트와 세입자의 경우 세입자가 없어도 아파트는 의미론적으로 존재할 수 있다.
* 하지만 지금 고객과 신용카드에서는 조금 다르다.
* 고객은 신용카드가 있어도 그만, 없어도 그만이지만
* 신용카드는 이 주인이 명확해야 사용가치를 갖는다.
* 이러한 점은 반영한 것은 다음과 같다.
  * 신용카드 초기화시 고객 무조건 있어야 함
  * 고객을 옵셔널 타입으로 선언하지 않음
  * 반대로 고객 클래스에서는 카드를 옵셔널로 선언함
  * 고객이 갑이므로 카드를 강한 참조를 하고 있음

자 이제, 실제로 돌아가는 건 그림을 보면서 이해하자.

````swift
var john: Customer?
john = Customer(name: "John Appleseed")
john!.card = CreditCard(number: 1234_5678_9012_3456, customer: john!)
````

* 자 이렇게 선언해보자.
* 일단 고객을 하나 만들었고, 그 고객이 사용한 신용카드 인스턴스를 만들어서 참조했다.
  ![](124083739-31741d00-da89-11eb-8d04-ca3f7ed31052.png)

그림으로 보면 이러한 상황이다. 이 상태에서 john의 참조를 해재해 보자.
![](124083754-35a03a80-da89-11eb-8e7a-1c137437861f.png)

그러면 이러한 상태가 될 텐데, unowned로 참조하고 있기 때문에, 고객 인스턴스는 할당 해제된다. 여기서, <mark style='background-color: #fff5b1'> 그러면 신용카드 인스턴스도 강한 참조가 없기 때문에 할당 해제된다. </mark> 

````swift
john = nil
// Prints "John Appleseed is being deinitialized"
// Prints "Card #1234567890123456 is being deinitialized"
````

## 정리

* weak: 해당 변수가 nil이 될 가능성이 있을 때
* unowned: 해당 변수가 nil이 될 가능성이 없을 때

# Garbage Collector, Reference Counting 비교

|구분|GC|RC|
|::----|::|::|
|참조 계산 시점|Run Time <br> 어플 실행 동안 주기적으로 참조를 추적하여 사용하지 않는 instance를 해제함|Compile Time<br>컴파일 시점에 언제 참조되고 해제되는지 결정되어 런타임 때 그대로 실행됨|
|장점|인스턴스가 해제될 확률이 높음 <br>(RC에 비해)|개발자가 참조 해제 시점을 파악할 수 있음<br>RunTime 시점에 추가 리소스가 발생하지 않음|
|단점|개발자가 참조 해제 시점을 파악할 수 없음 <br>RunTime 시점에 계속 추적하는 추가 리소스가 필요하여 성능저하 발생될 수 있음|순환 참조가 발생 시 영구적으로 메모리가 해제되지 않을 수 있음|

# Reference

* [Automatic Reference Counting](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html)
