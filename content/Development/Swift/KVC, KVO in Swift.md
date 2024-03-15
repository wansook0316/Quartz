---
title: KVC, KVO in Swift
thumbnail: ''
draft: false
tags:
- KVC
- KVO
- key-value-coding
- key-value-observing
- swift
created: 2023-09-30
---

지난 글에서는 Objective-C에서 KVC/KVO가 어떻게 쓰였는지 알아보았다. 이번에는 Swift다.

# Key Value Coding

여기까지는 Objective C에서 사용하는 것들이었다. 이제는 실제 많이 사용하는 Swift에서 어떤지 보자. 사실 자주 마주할 일은 없다. 왜냐하면..

````swift
struct CreditCard {
    var address: String
}

struct Person {
    var creditCard: CreditCard
}

let creditCard = CreditCard(address: "용인시")
let wansik = Person(creditCard: creditCard)

let wansikAddress = wansik.creditCard.address
````

특정 주소가 필요하다면, 직접적으로 접근해서 값을 읽어오면 되기 때문이다. 그러면 어떻게 Swift에서 사용할 수 있을까?

````swift
let wansikAddress = wansik[keyPath: \.address.town]
wansik[keyPath: \.address.town] = "수원시"
````

[KeyPath](KeyPath.md)를 사용하여 가져올 수 있다! 그리고 값에 접근해서 수정도 가능하다. Objective C에서는 `setValue:` 로 가능했었는데, 이제는 직접 넣는 것도 가능하다.

그런데 Objective C에서 사용하던 [KeyPath](KeyPath.md)와 뭔가 모양이 다르다. 거기서는 정말 path의 의미를 가진 key의 역할(문자열과 .의 주합)을 하는 느낌이 강했다면, 여기서는 뭔가 규칙이 있어보인다. 다음 포스팅으로 넘기자.

# Key Value Observing

해당 개념은 Objective C와 동일하다. 즉 객체의 Property 변경사항을 다른 객체에 알리기 위한 패턴이다. Model과 View사이에 논리적으로 분리된 녀석들의 Sync를 맞추기 위해 사용한다. Objective C 런타임을 사용하기 때문에 NSObject를 상속한 class에서만 KVO를 사용할 수 있다.

## Observed Object Setup

````swift
struct CreditCard {
    var address: String
}

struct Person {
    var creditCard: CreditCard
}
````

자, 아까보았던 예제이다. 완식이라는 사람이 신불자라 도망을 다녀서 주소를 계속해서 바꾼다고 생각해보자.(~~억지다~~) 회사 입장에서는 이녀석의 address가 변경되는 시점에 알림을 받길 원할 것이다. 그래서 저 녀석을 KVO를 사용하여 Observing할 것이다. 그러기 위해서는 해줘야 하는 작업들이 있다.

````swift
class CreditCard: NSObject {
    @objc dynamic var address: String

    init(address: String) {
        self.address = address
    }
}
````

1. class로 변경
1. NSObject 상속: NSObject 상속 클래스에서만 KVO 사용가능
1. `@objc` 추가: Objective runtime 사용할 거야!
1. `dynamic` modifier 추가: Objective C의 dynamic dispatch를 사용할 거야!

`dynamic`에 대한 것은 추후 포스팅에서 처리하도록 하자. 이것도 할 얘기가 많은 주제인 듯하다. 

일단 여기까지 하면 저 class의 property를 observing할 수 있는 상태가 되었다.

## Observer definition

````swift
class CreditCard: NSObject {
    @objc dynamic var address: String

    init(address: String) {
        self.address = address
    }
}

class ViewController: UIViewController {

    private let town = ["용인시", "수원시", "광주시", "서울시", "하남시"]
    private let creditCard = CreditCard(address: "용인시")
    private var observers: [NSKeyValueObservation] = []

    override func viewDidLoad() {
        let observer = self.creditCard.observe(\.address, options: [.old, .new]) { (object, change) in
            print(object)
            print(change.oldValue, change.newValue)
        }
        self.observers.append(observer)
    }

    @IBAction func buttonTouched(_ sender: Any) {
        self.creditCard.address = "\(self.town[Int.random(in: (0..<5))])시"
    }

}
````

버튼을 누를 때마다 도망가도록 해보자. observer 객체는 받아서, VC가 deinit되는 시점에 메모리에서 날아가도록 하였다.

````
<test.CreditCard: 0x60000101e480>
Optional("용인시") Optional("광주시시")
<test.CreditCard: 0x60000101e480>
Optional("광주시시") Optional("서울시시")
<test.CreditCard: 0x60000101e480>
Optional("서울시시") Optional("하남시시")
<test.CreditCard: 0x60000101e480>
Optional("하남시시") Optional("하남시시")
<test.CreditCard: 0x60000101e480>
Optional("하남시시") Optional("하남시시")
<test.CreditCard: 0x60000101e480>
Optional("하남시시") Optional("광주시시")
<test.CreditCard: 0x60000101e480>
Optional("광주시시") Optional("서울시시")
````

object는 실제 관찰하고 있는 녀석을 보내주고, change에서는 이전 값, 새 값을 보내주는 것을 확인할 수 있다.

## Option

위의 예제에서 관찰하는 대상을 keyPath로 준 것외에 option이라는 값을 주었었다. 이게 무엇인지 알아보자. `NSKeyValueObservingOptions`인 구조체로 정의되어 있다. `.old`, `.new`는 보았으니 넘어가고, `.initial`, `.prior`만 알아보자.

### .initial

combine을 쓰다보면, 초기 연결된 시기에 값을 받아보고 싶은 경우가 있다. 이 경우가 딱 그거다. 처음에 변경하지 않은 시점에도 handler가 불리게 하고 싶다면 해당 옵션을 켜면 된다.

````swift
override func viewDidLoad() {
    let observer = self.creditCard.observe(\.address, options: [.old, .new, .initial]) { (object, change) in
        print(change.oldValue, change.newValue)
    }
    self.observers.append(observer)
}
````

````
nil Optional("용인시")
Optional("용인시") Optional("수원시")
Optional("수원시") Optional("하남시")
````

이런식으로 newValue에 값이 담겨서 처음에 오게 된다.

### .prior

바로 이전의 상태를 같이 준다! 이게 무슨 말이냐면 말그대로 이전에 출력된 친구까지 같이 줌을 말한다.

````swift
override func viewDidLoad() {
    let observer = self.creditCard.observe(\.address, options: [.old, .new, .prior]) { (object, change) in
        if change.isPrior {
            print("이전 상태의 값이에요!", change.oldValue, change.newValue)
        } else {
            print("이번에 변경된 상태값이에요!", change.oldValue, change.newValue)
        }
    }
    self.observers.append(observer)
}
````

````
이전 상태의 값이에요! Optional("용인시") nil
이번에 변경된 상태값이에요! Optional("용인시") Optional("하남시")
이전 상태의 값이에요! Optional("하남시") nil
이번에 변경된 상태값이에요! Optional("하남시") Optional("용인시")
이전 상태의 값이에요! Optional("용인시") nil
이번에 변경된 상태값이에요! Optional("용인시") Optional("하남시")
이전 상태의 값이에요! Optional("하남시") nil
이번에 변경된 상태값이에요! Optional("하남시") Optional("수원시")
````

출력을 보면 금방 이해할 수 있다.

# 장단점

일단 이 글을 읽다보면, 많이들 사용하는 `willSet`, `didSet`과 같은 propert observer와 비슷하다는 것을 눈치챌 수 있다. 하지만 다른 점이 존재하는데, KVO같은 경우 Object 외부에서 observer를 걸 수 있다는 점이다.

## 장점

먼저, Model, View와 같이 두 객체 이상의 동기화를 달성할 수 있다. 이건 앞에서도 이야기 한 내용이다.

객체의 구현을 변경하지 않고, 상태 변화에 대응이 가능하다. 즉, 라이브러리가 있는데, 여기에 내부적으로 Property observer를 달 수 없는 상황임에도 외부에서 KVO를 사용하면 처리가 가능하다. 하지만 해당 라이브러리에 있는 property가 Objective runtime 제공(`@objc`, `dynamic`)하지 않으면 안되는 것이 아닌지..

Observed Property의 old value, new value를 얻을 수 있다.

[KeyPath](KeyPath.md)를 사용하기 때문에 nested Property 관찰이 가능하다.

````swift
class CreditCard: NSObject {

    class Address: NSObject {
        @objc dynamic var location: String

        init(location: String) {
            self.location = location
        }
    }

    @objc dynamic var address: Address

    init(address: Address) {
        self.address = address
    }
}

class ViewController: UIViewController {

    private let town = ["용인시", "수원시", "광주시", "서울시", "하남시"]
    private let creditCard = CreditCard(address: CreditCard.Address(location: "용인시"))
    private var observers: [NSKeyValueObservation] = []

    override func viewDidLoad() {
        // Note!
        let observer = self.creditCard.observe(\.address.location, options: [.old, .new]) { (object, change) in
            print(change.oldValue, change.newValue)
        }
        self.observers.append(observer)
    }

    @IBAction func buttonTouched(_ sender: Any) {
        self.creditCard.address.location = "\(self.town[Int.random(in: (0..<5))])"
    }

}
````

````
Optional("용인시") Optional("용인시")
Optional("용인시") Optional("서울시")
Optional("서울시") Optional("광주시")
````

이와 같이 keyPath로 접근하여 사용이 가능하다는 뜻이다.

마지막으로 추가적으로 Observer를 해제하지 않아도 된다는 점이다. 이건 몰랐다. 자료를 찾아보니, [Foundation Release Notes for macOS 10.13 and iOS 11](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation/index.html)에 "Relaxed Key-Value Observing Unregistration Requirements"에 명시되어 있는 것을 확인했다. 좀 더 구체적으로 이해하고 싶다면 [When is KVO unregistration automatic?](https://fpotter.org/posts/when-is-kvo-unregistration-automatic)글을 참고하자.

### 단점

일단 Objective C 런타임에 의존하게 된다. `NSObject`도 상속해야 하고 `@objc`, `dynamic` modifier도 달아주어야 한다.

추가적으로 알게 되는 것이 있다면 여기에 적어두도록 하겠다.

# 마무리

이렇게 Swift에서 KVC, KVO를 사용하는 방법까지 익혀보았다. 다음에는 이전에 다루지 못한 것들에 대해 적어보겠다. 끝!

# Reference

* [About Key-Value Coding](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107-SW1)
* [Key-value coding](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/KeyValueCoding.html)
* https://jcsoohwancho.github.io/2019-11-28-Key-Value-Coding(KVC)/
* [Understanding KVC and KVO in Objective-C](http://hongchaozhang.github.io/blog/2015/08/13/Understanding-KVC-and-KVO/)
* [what's the difference between single key and keypath?](https://stackoverflow.com/questions/4269568/whats-the-difference-between-single-key-and-keypath)
* [](https://developer.apple.com/documentation/swift/cocoa_design_patterns/using_key-value_observing_in_swift)
* [What's New in Foundation](https://developer.apple.com/videos/play/wwdc2017/212/)
* [NSKeyValueObservingOptions](https://developer.apple.com/documentation/foundation/nskeyvalueobservingoptions/)
* [Delegate, NOTIFICATION,KVO pros and cons?](https://topic.alibabacloud.com/a/delegate-notificationkvo-pros-and-cons_8_8_31286426.html)
* [Foundation Release Notes for macOS 10.13 and iOS 11](https://developer.apple.com/library/archive/releasenotes/Foundation/RN-Foundation/index.html)
* [When is KVO unregistration automatic?](https://fpotter.org/posts/when-is-kvo-unregistration-automatic)
