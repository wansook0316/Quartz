---
title: Introducing Combine
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Combine이 무엇일까? Apple이 설명하는 것을 들어보자.

# What is Combine

 > 
 > 이벤트 처리 연산자를 결헙하여 비동기 이벤트를 처리하는 방법

일단 비동기 이벤트가 무엇이 있는지부터 알아보자. 이를 설명하기 위해서 WWDC에서는 Create Account 페이지를 만드는 것을 예시로 하여 설명을 이어간다.

![](Combine_01_IntroducingCombine_0.png)

요구사항은 위와 같다. username 유효성 판단, password matching 판단, 그리고 이것들이 맞을 경우, 버튼이 활성화되는 것, 이 세가지 이다.

![](Combine_01_IntroducingCombine_1.png)

이걸 가능케하기 위해서는 먼저, interaction 여부를 전달해주어야 한다. 이 부분에서 Target/Action 디자인 패턴이 사용된다. 유저가 TextField에 입력한 이후, 즉, 변경될 때마다 서버 통신을 통해 검증을 한다면 network resource 낭비일 것이다. 그렇기 때문에 특정 시간 간격을 두고 네트워크 통신을 해야 한다. 이 부분에서는 Timer가 사용된다. 네트워크 Progress update를 위해서는 KVO를 통해 처리할 생각이다.

![](Combine_01_IntroducingCombine_2.png)

사용자가 TextField에 값을 입력하면, URLSession을 통해 네트워크 요청을 보내고, 총 3개의 TextField에 입력값이 모두 담겨졌다면, 이 모든 값의 유효성 검사를 한 결과를 기반으로 Merge가 필요하다. 모두 유효성 검사를 통과했다면, 하단의 Create Account Button의 Enable 여부를 변경해주어야 한다.

결과적으로 Cocoa API에서는 다음과 같은 비동기 API들을 만나게 된다.

* [Target/Action](https://velog.io/@wansook0316/Target-Action)
* [Timer](https://velog.io/@wansook0316/Timer)
* [KVO](https://velog.io/@wansook0316/KVCKVO-in-Swift)
* [URLSession](https://velog.io/@wansook0316/URLSession)
* [NotificationCenter](https://velog.io/@wansook0316/Notification-Center)

이렇게 다양한 요소들이 있는데, 이 녀석들은 각각 사용하는 방법도 다르다. 그래서 이것들을 엮어서 쓰려니 문제가 생기는 경우가 많았다. 이러한 문제점에 착안하여 Apple은 이 녀석들의 공통점을 추출하게 되는데 그것이 Combine이다.

# Combine

 > 
 > A unified, declarative API for processing values over time.

시간에 흐름에 따라 처리하는 "선언적" API이다. 특징은 다음과 같다.

* Generic: Generic하게 작성 후, 이곳 저곳에서 활용이 가능하다.
* Type Safe: compile time에 Error를 잡을 수 있다.
* Composition first: functional programming의 함수 조합 개념을 차용하여 여러 operator를 연결하여 원하는 결과를 얻는 것에 집중했다.
* Request driven: 요청시에 처리된다. 필요할 때만 처리되니 Resource를 아낄 수 있다.

# Publishers

어떻게 Value와 Error가 생산될 것인지에 대해 정의한다. 값타입, 즉 `struct`로 선언되어 있으며, Subscriber들의 등록을 받는 녀석이다.

* Publish Values and Error
* Value Type: **struct**

````swift
protocol Publisher {
    associatedtype Output
    associatedtype Failure: Error

    func subscribe<S: Subscriber>(_ subscriber: S)
        where S.Input == Output, S.Failure == Failure
}
````

두개의 연관값이 있는데, `Output`, `Failure`이다. 성공시에 값을 주는 녀석이 `Output`이고 실패할 시 주는 Error가 `Failure`이다. 만약 Error를 줄 수 없을 경우 `Never`를 사용하면 된다.

Publisher는 딱 하나의 함수를 가지고 있는데, `subscrive()`이다. 해당 함수를 사용하기 위해서는 제약이 필요한데, publisher의 구독을 받는 subscriber의 input과 Failure type이 같아야 한다. 이 부분은 사실 당연하다.

````swift
// Notification Center
extension NotificationCenter {
    struct Publisher: Combine.Publisher {
        typealias Output = Notification
        typealias Failure = Never
        init(center: NotificationCenter, name: Notification.Name, object: Any? = nil)
    }
}
````

Notification Center에는 기본적으로 위와 같은 extension이 추가되어 있다. 실제로 struct type이며, output type은 `Notification`, Failure type은 `Never`이다.

# Subscribers

Subscriber는 Publisher와 대척점에 있는 녀석이다. Publisher가 만들어내는 값을 받고, Publisher가 만약 유한하다면, (즉, 값 몇개를 내보내고 사용가치가 사라지는 녀석들을 말함) 끝났을 때 하는 행동을 정의할 수 있는 녀석이다. Reference Type이다. 즉 Class라는 말이다.

* Reference Type: **Class**
* Receive Values and Completion: 값을 받고, 끝났을 때 동작 정의

````swift
protocol Subscriber {
    associatedtype Input
    associatedtype Failure: Error

    func receive(subscription: Subscription)
    func receive(_ input: Input) -> Subscribers.Demand
    func receive(completion: Subscribers.Completion<Failure>)
}
````

연관값 2개, `Input`, `Failure`가 있는 것을 확인할 수 있다. 아까 말했듯 Publisher와 Type이 같아야 등록이 가능하다. Error Type이 없는 경우에는 마찬가지로 `Never`를 사용할 수 있다.

추가적으로 3개의 함수를 가지고 있다. 먼저, Subscription을 받을 수 있는데, Subscription은 어떻게 Subscriber가 Publihser로 발생된 data를 Subscriber로 줄 수 있는지에 대한 것이다. (~~?~~)

두번째로는 Input을 받을 수 있으며, 마지막으로는 finite한 Publihser에 연결된 경우 completion을 받는데, Finished거나 Failure일 때의 동작을 정할 수 있다.

````swift
extension Subscribers {
    class Assign<Root, Input>: Subscriber, Cancellable {
        typealias Failure = Never
        init(object: Root, keyPath: ReferenceWritableKeyPath<Root, Input>)
    }
}
````

이 Subscriber protocol을 채택하여 구현되어 있는 녀석들은 Combine안의 `Subscrivers`라는 enum에 정의되어 있다. WWDC에서는 그 예인 `Assign`을 들고 왔다. Root라는 Type은 Keypath에 정의되어 있는 타입이다. [KeyPath](https://velog.io/@wansook0316/KeyPath)를 참고하자.

이제 이녀석을 보면, Input Type으로 값을 받아서 object로 선언되어 있는 Root Object에 그 값을 keypath를 통해 찾아 적용하는 역할을 하고 있다. 단순히 값을 쓰는 행위를 하고 있고, Swift는 이에 해당되는 Error를 가지고 있지 않기 때문에 `Failure`는 `Never` 타입이다.

# The Pattern

그렇다면 이녀석들을 실제로는 어떻게 활용할 수 있을까? 한번의 출간과 구독이 이루어지는 과정을 한번 알아보자.

![](Combine_01_IntroducingCombine_3.png)

먼저 Subscriber는 Publisher에 Attach된다. 그래서 생성된 Subscriber를 인자로 넣어서 Publisher에게 주는 것을 알 수 있다. 이 요청을 받게되면 Publisher는 Subscription이라는 객체 instance를 인자로 담아서 주게된다.(즉, 1에서 받는 Subscriber instance의 `receive(subscription:)` 함수를 호출하는 것) 이 Subscription 객체는 Subscirber가 Publisher로부터 원하는 값을 요구하거나, 구독을 취소하는데 사용한다.

세팅이 완료되면 Subscriber는 Publisher에게 원하는 개수(무제한도 있음)만큼의 request를 하게 된다. 그 순간 부터 Publisher는 요청한 개수만큼의 값, 혹은 그보다 적은 개수를 보낸다. 만약에 Publisher가 finite하다면, 최종적으로 subscriber의 `receive(completion:)` 함수를 호출하고 통신이 종료된다.

# Comeback to Wizard

````swift
// Using Publisher and Subscriber
class Wizard {
    var grade: Int
}

let merlin = Wizard(grade: 5) // 내가 추적하고 싶은 Object를 만들기
let graduationPublisher = NotificationCenter.Publisher(center: .default, // Notification Center의 Predefined Publisher를 활용해서 알림 받기
                                                       name: .graduated, 
                                                       object: merlin)


let gradeSubscriber = Subscribers.Assign(object: merlin, keyPath: \.grade) // 변경된 값을 받아서 merlin객체의 .grade property에 반영한다.

graduationPublisher.subscribe(gradeSubscriber) // NOT WORKING!
````

Wizard에 관련된 앱을 만들고 있었던 것을 떠올려보자. Wizard는 학년을 가지고 있고, 학년이 높아짐에 따라 값을 변경해 줄것이다. Notification Center가 새로운 값을 userInfo에 넣어줄 것이고, 이를 반영해주는 코드를 짜보려고 한다.

일단은, 내가 추적하고 싶은 Object를 만들어 주고, Notification Center의 Predefined Publisher를 활용해서 변경된 알림을 받아보자. object는 merlin으로 지정하여, 해당 notification을 전송하는 객체를 명시해주자. 

Subscriber는 결과적으로 값을 받아서 반영해주어야 하니, `Assign` Subscriber를 만들어 주고, 반영하고 싶은 객체와 keypath를 인자로 넣어주자. 

이렇게 한뒤 subscribe를 하면 작동하지 않는다. 이는 당연하다. 앞에서 Publisher의 Output, Failure Type과 Subscriber의 Input, Failure Type이 맞아야 한다고 했었기 때문이다. 앞에서 Notification Center의 predefined Publisher의 Output Type을 봤었는데, `Notification`이었다. 방금 만든 Subscriber의 경우 Input Type이 `Int`이다. KeyPath가 `<Root(Wizard), Int>`로 되어있기 때문이다. (앞에서 `Assign<Root, Input>` 이었는데, KeyPath의 두번째 Type과 같았다) 결국 Type이 맞지 않아 Compile시 에러가 난다.

# Operators

이런 상황이라면 우리는 Publisher와 Subscriber 사이에 무언가 변경시켜줄 것이 필요하다는 것을 알게 된다. 그게 Operator이다.

![](Combine_01_IntroducingCombine_4.png)

Operator의 특징은 다음과 같다.

* Publisher를 채택: 하위로 값을 다시 보내야 하기 때문
* 값의 변화를 위한 행위를 기술
* Upstream으로 Publisher를 Subscribe
* Downstream으로 Subscriber에게 결과를 전달
* Value Type: **struct**

````swift
extension Publishers {
    struct Map<Upstream: Publisher, Output>: Publisher {
    typealias Failure = Upstream.Failure

    let upstream: Upstream
    let transform: (Upstream.Output) -> Output
    } 
}
````

실제로 Operator를 보면, `Publishers` 아래에 정의되어 있다. `Publishers`는 `Subscribers`와 마찬가지로 Apple에서 기본 제공하는 녀석들을 만들어 둔 Enumeration Type이다. Upstream으로 Publisher Type을 받고, Output Type을 갖는데. 이 때의 제약은 아무것도 없다. Publisher를 return해도 무방하다는 말이다. 단, 여기서 Failure는 upstream의 Failure type과 동일한 Type을 가져야 한다.

````swift
// Using Publisher and Subscriber
class Wizard {
    var grade: Int
}

let merlin = Wizard(grade: 5)
let graduationPublisher = NotificationCenter.Publisher(center: .default, 
                                                       name: .graduated, 
                                                       object: merlin)

let converter = Publishers.Map(upstream: graduationPublisher) { note in
return note.userInfo?["NewGrade"] as? Int ?? 0
}

let gradeSubscriber = Subscribers.Assign(object: merlin, keyPath: \.grade)

converter.subscribe(gradeSubscriber) // WORKING!
````

이제 위의 안됐던 녀석을 손보면 이렇게 된다. Publisher를 받아서, 값을 변형해 준 뒤, 원하는 Output을 내뱉는다. subscriber는 `graduationPublisher`가 아닌 `converter`의 Publisher에 연결해주어야 원하는 값을 받아 업데이트할 수 있다.

# Operator Construction

하지만 저렇게 쓰라 그러면 아무도 안쓸 것 같다. 그래서 Apple에는 기본적으로 Publisher에 Operator들을 만들어 두었다.

````swift
extension Publisher {
    func map<T>(_ transform: @escaping (Output) -> T) -> Publishers.Map<Self, T> {
        return Publishers.Map(upstream: self, transform: transform)
    }
}
````

Publisher 에 extension으로 `map`이라는 함수를 만들어두어, Output을 어떻게 변경할 지에 대해서만 작성하면, `Publisher.Map` Operator를 만들어 return 해준다.

![](Combine_01_IntroducingCombine_5.png)

또한 Subscriber도 간단한 경우에는 기본적으로 Publisher 타입에 extension으로 구현되어 있다.

````swift
let cancellable =
    NotificationCenter.default.publisher(for: .graduated, object: merlin)
        .map { note in
            return note.userInfo?["NewGrade"] as? Int ?? 0
        }
        .assign(to: \.grade, on: merlin)
````

그래서 결과적으로 우리가 많이 사용하는 이런 모양이 나오게 되는 것이다. 이제 명확히 알았다!

![](Combine_01_IntroducingCombine_6.png)

Operator는 굉장히 다양하다. 이걸 일일히 처음부터 공부하기 보다는, 왠만한 건 정의되어 있다고 가정하고 생각날 때마다 찾아서 익히는 것이 가장 빠른 방법일 듯 하다.

# Future & Publisher

![](Combine_01_IntroducingCombine_7.png)

Apple은 Sync하게 사용했던 Int와 Array를 놓고 Future와 Publisher를 비교했다. 동기적으로 Int값을 얻기 위해서는 Int, 여러값을 원했다면 Array를 사용했다. 그런데 만약, 비동기적으로. 즉 후에 값이 완료된 시기에 값을 받고 싶은 경우에는 단일 값의 경우 future, 여러 값의 경우 Publisher를 사용하라 한다.

Future의 경우, request 시점에 한번의 비동기 처리를 한 결과를 가져오기 때문에, 그리고 Publsher의 경우 N번의 값을 시간에 걸쳐 받을 수 있기 때문에 이러한 비유를 한 것이 아닌가 한다.

# 마무리

![](Combine_01_IntroducingCombine_8.png)

1. Subscriber는 Publisher에게 구독하겠다고 요청한다.
1. Publisher는 Subscription을 준다. (구독권!)
1. 구독권은 구독의 Life cycle을 관리한다. (우리가 `AnyCancellable`로 받는 녀석이 이녀석. `cancel()`이라는 메서드로 구독 취소 가능)

간단하게 Combine이 어떤 원리로 작동되는지에 대해 알아보았다. Future, 실전 사용법 같이 쓸 글이 많은데, 일단 오늘은 여기서 끝!

# Reference

* [Introducing Combine](https://developer.apple.com/videos/play/wwdc2019/722)
* [Combine](https://developer.apple.com/documentation/combine)
* [Composing Reactive Animations](http://conal.net/fran/tutorial.htm)
* [conal/talk-2015-essence-and-origins-of-frp](https://github.com/conal/talk-2015-essence-and-origins-of-frp)
* [Publisher](https://developer.apple.com/documentation/combine/publisher)
* [Subscriber](https://developer.apple.com/documentation/combine/subscriber)
* [Subscription](https://developer.apple.com/documentation/combine/subscription)
* [Understanding Combine’s publishers and subscribers](https://www.donnywals.com/understanding-combines-publishers-and-subscribers/)
