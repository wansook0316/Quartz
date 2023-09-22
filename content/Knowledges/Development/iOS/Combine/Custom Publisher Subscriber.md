---
title: Custom Publisher Subscriber
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Combine에 대해서 실제 사용하다 보니, 이게 도대체 어떤 방식으로 이루어지는 지 궁금했다. 실제 코드를 보지 않으면 명확해지지 않을 것 같아 정리한다.

# Objective

 > 
 > URLSession에서 요청을 받아 내가 원하는 응답을 보내주는 Publisher, 그에 해당하는 Subscriber, Subscription을 모두 따로 만들어 본다.

![](Combine_04_CustomPublisherSubscriber_0.png)

이전 글에서 배웠던 이 흐름을 기반으로, Custom Publisher, Subscriber를 만들어보면서 내부 동작을 이해해보는 것을 목표로 한다. 그 전에, 앞의 글과 조금 다른 부분이 있어 그림을 수정했다. WWDC에서 나온 이 그림은 얼핏 보면 Publisher에게 값을 요청하는 것처럼 보인다. 하지만 그것은 사실이 아니며, Publisher가 Subscription을 인자로 넘겨주는 시점부터, Subscription 인스턴스에서 Subscriber의 Method들을 호출해 준다. 그래서 Subscription 객체 그림을 하나 추가했다. 어떻게 Customdmfh Publisher, Subscriber를 만드는지 따라간다면 이해할 수 있을 것이다. 

그전에, 구현을 어떤 방식으로 할지에 대해 간단하게 알아보자.

![](Combine_04_CustomPublisherSubscriber_1.png)

1. Publisher는 URLSession의 extension에 위치해서 만든다.
1. Subscriber는 그냥 만들어서 관리한다.
1. Publisher 입장에서 subscriber가 인수로 들어왔을 때, Subscriber의 `receive(subscription:)`을 호출해주어야 하기 때문에, Subscription 객체는 Publisher 내부에서 정의하도록 한다.

그럼 시작해보자.

# Custom Subscriber

![](Combine_04_CustomPublisherSubscriber_2.png)

일단 Subscriber를 만들어보자. WWDC의 흐름도를 본다면, Subscriber에서는 Publisher에 자신을 보내는 method, input을 받는 method, 끝났을 때 호출되는 method 세개가 필요하다.

````swift
public protocol Subscriber : CustomCombineIdentifierConvertible {

  associatedtype Input
  associatedtype Failure : Error

  func receive(subscription: Subscription)
  func receive(_ input: Self.Input) -> Subscribers.Demand
  func receive(completion: Subscribers.Completion<Self.Failure>)
}
````

실제 Subscriber protocol을 보면 맞게 되어 있는 것을 확인할 수 있다.

````swift
class DecodableDataTaskSubscriber<Input: Decodable>: Subscriber {
    typealias Failure = Error // Error가 나지 않는다면 Never Type. completion타입에도 반영됨

    func receive(subscription: Subscription) { // 1. 처음 publisher에 의해 호출됨
        print("Received subscription")
        subscription.request(.unlimited) // Subscription으로 부터 받는 개수를 정할수도 있음: subscription.request(.max(3))
    }

    func receive(_ input: Input) -> Subscribers.Demand { // 2. subscription에 의해 호출됨
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) { // 3. 모든 값 방출이 끝나면 호출됨
        print("Received completion \(completion)")
    }
}

// 혹은 이런 방식도 가능하다.
class DecodableDataTaskSubscriber<Input: Decodable, Failure: Error>: Subscriber {

    func receive(subscription: Subscription) {
        print("Received subscription")
        subscription.request(.unlimited)
    }

    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
    }
}

class DecodableDataTaskSubscriber: Subscriber {
    typealias Input = Decodable
    typealias Failure = Error

    func receive(subscription: Subscription) {
        print("Received subscription")
        subscription.request(.unlimited)
    }

    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
    }
}
````

세가지 방법은 각각의 장단점을 가진다. Input, Output Type이 변할 수 있다면 명시적으로 적어주고, 그렇지 않은 경우 내부적으로 `typealias`를 사용해서 처리해주자.

# Custom Publisher

![](Combine_04_CustomPublisherSubscriber_3.png)

Publisher의 경우에는 Subscriber에게 Subscription을 던져주기만 하면 된다. 하나의 메서드만 필요할 것이다.

````swift
public protocol Publisher {

  associatedtype Output
  associatedtype Failure : Error

  func receive<S>(subscriber: S) where S : Subscriber, Self.Failure == S.Failure, Self.Output == S.Input
}
````

실제 프로토콜도 그렇게 되어 있는 것을 확인할 수 있다. 우리는 URLSession에서 사용할 Publisher이기 때문에 그 안에 만들어서 관리하는 것이 좋겠다.

````swift
extension URLSession {

    func decodedDataTaskPublisher<Output: Decodable>(for urlRequest: URLRequest) -> DecodedDataTaskPublisher<Output> {
        return DecodedDataTaskPublisher<Output>(urlRequest: urlRequest)
    }

    struct DecodedDataTaskPublisher<Output: Decodable>: Publisher {
        typealias Failure = Error
        
        let urlRequest: URLRequest

        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
        }
    }

}
````

외부에서 사용할 때는 `decodedDataTaskPublisher(for urlRequest:)`를 사용하면 되겠다. 그런데 아직 Subscription 객체에 대해 정의하지 않아 사실 저 메서드는 사용이 불가하다. 이 녀석을 만들러 가보자.

# Custom Subscription

![](Combine_04_CustomPublisherSubscriber_4.png)

실제로 Subscriber에게 요청을 받아 값을 돌려주는 녀석이다. 개수에 대한 요청을 받을 method만 작성해주면 된다.

````swift
public protocol Subscription : Cancellable, CustomCombineIdentifierConvertible {
  func request(_ demand: Subscribers.Demand)
}
````

여기서 부터 잘 봐야 한다. 이녀석의 타입을 보면 `Cancellable`을 채택하고 있다. 곧, 이녀석이 우리가 보통 `AnyCancellable`로 받는 녀석이라는 거다. 구독의 life cycle을 담당하는 친구가 이녀석이다. 일단 만들어보자.

````swift
extension URLSession.DecodedDataTaskPublisher {

    class DecodedDataTaskSubscription<Output: Decodable, S: Subscriber>: Subscription
    where S.Input == Output, S.Failure == Error {

        private let urlRequest: URLRequest
        private var subscriber: S?

        init(urlRequest: URLRequest, subscriber: S) { // 생성 시점에 실제 요청을 할 request 객체와 subscriber를 받는다.
            self.urlRequest = urlRequest
            self.subscriber = subscriber
        }

        func request(_ demand: Subscribers.Demand) { // Subscriber쪽에서 요청하면 여기서 subscriber에게 전달해준다.
            if demand > 0 {
                URLSession.shared.dataTask(with: urlRequest) { [weak self] data, response, error in
                    defer { self?.cancel() }

                    if let data = data {
                        do {
                            let result = try JSONDecoder().decode(Output.self, from: data)
                            self?.subscriber?.receive(result)
                            self?.subscriber?.receive(completion: .finished)
                        } catch {
                            self?.subscriber?.receive(completion: .failure(error))
                        }
                    } else if let error = error {
                        self?.subscriber?.receive(completion: .failure(error))
                    }
                }.resume()
            }
        }

        func cancel() {
            subscriber = nil
        }
    }
}
````

Subscription에서 subscriber로 메서드를 호출해준다. 내부적으로 subscriber를 subscription이 들고 있는 것을 확인할 수 있다.

# Attach Whole Thing

그럼 이제 한번 실행해보자.

````swift
struct SomeModel: Decodable {}

func makeTheRequest() {
    let request = URLRequest(url: URL(string: "https://www.donnywals.com")!)
    let publisher: URLSession.DecodedDataTaskPublisher<SomeModel> = URLSession.shared.decodedDataTaskPublisher(for: request)
    let subscriber = DecodableDataTaskSubscriber<SomeModel>()
    publisher.subscribe(subscriber)
}
````

예상하는 동작은 다음과 같다.

````
Received subscription
Received value ~
Received completion ~
````

하지만 실제로 실행시켜보면, subscription만 출력된다.

````
Received subscription
````

무엇이 문제일까?

# Problem

![](Combine_04_CustomPublisherSubscriber_5.png)

찬찬히 combine 호출 흐름을 따라가보면, subscriber에 있는 method가 호출되지 않았다는 것을 확인할 수 있다. 해당 객체가 할당 해제된 것 인지 확인해보자.

````swift
class DecodableDataTaskSubscriber<Input: Decodable>: Subscriber {
    typealias Failure = Error

    func receive(subscription: Subscription) {
        print("Received subscription")
        subscription.request(.unlimited)
    }

    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
    }

    deinit {
      Swift.print("deinit subscriber")
    }
}
````

````
Received subscription
deinit subscriber
````

1. subscription은 subscriber 인스턴스를 알고 있다. (subscriber count + 1)
1. publisher는 subscriber에게 subscription 객체를 넘겨준다.
1. `receive(subscription: Subscription)`에서 subscriber는 subscription에 요구개수만큼을 요청한다.
1. 하지만 함수 인자로 들어온 subscription 인스턴스의 생명주기는 `receive(subscription: Subscription)` 내부이다.
1. 스코프 종료후 subscription instance는 할당 해제된다.(메시지 보내기도 전에 할당해제됨) 내부에 있는 subscriber 객체 역시 할당해제 된다. (subscriber count 0)
1. subscriber의 reference count가 0이 되어, subscriber는 할당 해제된다.

이러한 흐름에서 우리가 알 수 있는 점은, **누군가는 subscription 인스턴스를 소유해야 한다는 것**이다.

## Subscription Instance 소유의 책임

그럼 이 subscription 인스턴스는 누가 가지고 있어야 할까? 내가 읽고 있는 저자의 경우, completion이 호출되는 시기에 subscription 객체를 해제해주는 방법을 사용했다.

````swift
class DecodableDataTaskSubscriber<Input: Decodable>: Subscriber, Cancellable {
    typealias Failure = Error
    
    var subscription: Subscription?
    
    func receive(subscription: Subscription) {
        print("Received subscription")
        self.subscription = subscription
        subscription.request(.unlimited)
    }
    
    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }
    
    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
        cancel()
    }
    
    func cancel() {
        subscription?.cancel()
        subscription = nil
    }
}
````

일단 이렇게 하면, instance가 살아있기 때문에, 구독이 모두 종료되면 subscription을 종료하여 깔끔하게 해결되기는 한다. 하지만 이렇게 되는 경우, 이 subscriber를 실제로 사용하는 객체가 구독의 생명주기를 관리할 수가 없게 된다. 어떻게 해야할까?

## 지금까지의 코드

````swift
//
//  CustomCombineViewController.swift
//  test
//
//  Created by Choiwansik on 2022/05/26.
//

import UIKit
import Combine

class DecodableDataTaskSubscriber<Input: Decodable>: Subscriber, Cancellable {
    typealias Failure = Error

    var subscription: Subscription?

    func receive(subscription: Subscription) {
        print("Received subscription")
        self.subscription = subscription
        subscription.request(.unlimited)
    }

    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
        cancel()
    }

    func cancel() {
        subscription?.cancel()
        subscription = nil
    }
}


extension URLSession {

    func decodedDataTaskPublisher<Output: Decodable>(for urlRequest: URLRequest) -> DecodedDataTaskPublisher<Output> {
        return DecodedDataTaskPublisher<Output>(urlRequest: urlRequest)
    }

    struct DecodedDataTaskPublisher<Output: Decodable>: Publisher {

        typealias Failure = Error

        let urlRequest: URLRequest

        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
        }
    }

}

extension URLSession.DecodedDataTaskPublisher {

    class DecodedDataTaskSubscription<Output: Decodable, S: Subscriber>: Subscription
    where S.Input == Output, S.Failure == Error {

        private let urlRequest: URLRequest
        private var subscriber: S?

        init(urlRequest: URLRequest, subscriber: S) {
            self.urlRequest = urlRequest
            self.subscriber = subscriber
        }

        func request(_ demand: Subscribers.Demand) {
            if demand > 0 {
                URLSession.shared.dataTask(with: urlRequest) { [weak self] data, response, error in
                    defer { self?.cancel() }

                    if let data = data {
                        do {
                            let result = try JSONDecoder().decode(Output.self, from: data)
                            self?.subscriber?.receive(result)
                            self?.subscriber?.receive(completion: .finished)
                        } catch {
                            self?.subscriber?.receive(completion: .failure(error))
                        }
                    } else if let error = error {
                        self?.subscriber?.receive(completion: .failure(error))
                    }
                }.resume()
            }
        }

        func cancel() {
            subscriber = nil
        }
    }
}

struct SomeModel: Decodable {}

class CustomCombineViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.setup()
    }

    func makeTheRequest() {
        let request = URLRequest(url: URL(string: "https://www.donnywals.com")!)
        let publisher: URLSession.DecodedDataTaskPublisher<SomeModel> = URLSession.shared.decodedDataTaskPublisher(for: request)
        let subscriber = DecodableDataTaskSubscriber<SomeModel>()
        publisher.subscribe(subscriber)
    }

    func setup() {
        self.view.backgroundColor = .white
        let button = UIButton(frame: CGRect(x: 20, y: 40, width: 100, height: 50))
        button.backgroundColor = .blue
        self.view.addSubview(button)

        button.titleLabel?.text = "request!!"
        button.addTarget(self, action: #selector(self.buttonTapped), for: .touchUpInside)
    }

    @objc func buttonTapped() {
        self.makeTheRequest()
    }

}

````

## sink에 대한 이해

구독의 life cycle을 관리하는 subscription 객체를 리턴하는 것이 맞다는 생각을 했다. 실제로 sink와 같이 apple에서 제공하는 메서드의 경우에 그렇게 구현되어 있어, 한번 시도해보았다.

````swift
extension URLSession {

    func decodedDataTaskPublisher<Output: Decodable>(for urlRequest: URLRequest) -> DecodedDataTaskPublisher<Output> {
        return DecodedDataTaskPublisher<Output>(urlRequest: urlRequest)
    }

    struct DecodedDataTaskPublisher<Output: Decodable>: Publisher {

        // sink 동작을 따라하여 만들어봄
        func ssink(receiveValue: (Self.Output) -> Void, receiveCompletion: (Combine.Subscribers.Completion<Self.Failure>) -> Void) -> Cancellable {
            let subscriber = DecodableDataTaskSubscriber<SomeModel>()
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
            return subscription
        }

        typealias Failure = Error

        let urlRequest: URLRequest

        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
        }
    }

}

class CustomCombineViewController: UIViewController {

    var cancellable: Cancellable? // 수정

    deinit {
        self.cancellable?.cancel()
    }

    func makeTheRequest() {
        let request = URLRequest(url: URL(string: "https://www.donnywals.com")!)
        let publisher: URLSession.DecodedDataTaskPublisher<SomeModel> = URLSession.shared.decodedDataTaskPublisher(for: request)
        self.cancellable = publisher.ssink(receiveValue: { value in
            print("Received value: \(value)")
        }, receiveCompletion: { completion in
            print("Received completion: \(completion)")
        })
    }
}

````

이를 통해 우리가 보통 사용하는 sink와 같은 api가 어떤 구조로 되어 있을 지 유추해 볼 수 있다.

1. receiveCompletion, receiveValue에 원하는 동작을 넣는다.
1. 해당 입력을 `receive(_ input: Input) -> Subscribers.Demand`, `receive(completion: Subscribers.Completion<Error>)` method 내부에 배치한다.
1. 2에서 만들어진 subscriber 인스턴스를 Publisher에 있는 `receive<S>(subscriber: S)` 안에 넣어 호출한다.
1. publisher는 Subscriber의 `receive(subscription: Subscription)`를 호출한다.
1. subscriber는 Subscription의 `request(_ demand: Subscribers.Demand)`를 호출한다.
1. Subscription은 Subscriber의 `receive(_ input: Input) -> Subscribers.Demand`를 요구 개수에 맞게 호출해준다. 
1. Subscription이 끝나면 subscriber의 `receive(completion: Subscribers.Completion<Error>)`를 호출한다.
1. 위의 작업을 세팅한다. (아직 실제로 실행되지 않음)
1. 이 작업의 생명주기를 관장하는 Subscription을 instance로 리턴한다.
1. 사용하는 쪽에서는 이 Subscription을 변수로 받는다.

변수로 받지 않았을 때의 상황을 생각해보자. 만약 받지 않는다면 Subscription의 reference count가 0이 된다. Subscription에서는 보통 `Cancellable`을 채택하게 되므로, reference count가 0이 되는 시점에 `cancel()` method가 호출되게 된다. 이 `cancel()` method에는 가지고 있는 subscriber instance를 할당해제하는 로직이 첨부되어 있다. 이말은 즉슨, 변수로 받지 않았을 경우 subscription이 오지 않는다는 말과 동시에, subscriber instance의 메모리 해제를 사용하는 쪽에서 관리할 필요가 없다는 말이다.

여기서 의문 사항이 있을 텐데, Cancellable로 굳이 리턴하는 이유가 무엇인지? AnyCancellable로 타입 erasing을 하는게 좋은 것 아닌지? 와 같은 의문이 들 수 있다. 실제로 적용해보니 AnyCancellable은 단순히 Cancellable의 Type erasing을 위한 것이 아닌 듯하다. 그런 메서드도 없었고, Anycancellable의 경우 class였다. 그래서 이러한 점에 대해 다시 공부를 해야 할 것 같아 일단은 글을 여기서 멈춘다.

잠깐 조사해본 결과로는 AnyCancellable인 경우에는 메모리에서 해제되는 시점에 자동으로 `cancel()`을 호출해준다고 한다. 지금은 cancellable이라 명시적으로 적어두었다.

# Whole Code

````swift
//
//  CustomCombineViewController.swift
//  test
//
//  Created by Choiwansik on 2022/05/26.
//

import UIKit
import Combine

class DecodableDataTaskSubscriber<Input: Decodable>: Subscriber {
    typealias Failure = Error

    var subscription: Subscription?

    func receive(subscription: Subscription) {
        print("Received subscription")
        self.subscription = subscription
        subscription.request(.unlimited)
    }

    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }

    func receive(completion: Subscribers.Completion<Error>) {
        print("Received completion \(completion)")
    }
}


extension URLSession {

    func decodedDataTaskPublisher<Output: Decodable>(for urlRequest: URLRequest) -> DecodedDataTaskPublisher<Output> {
        return DecodedDataTaskPublisher<Output>(urlRequest: urlRequest)
    }

    struct DecodedDataTaskPublisher<Output: Decodable>: Publisher {

        // sink 동작을 따라하여 만들어봄
        func ssink(receiveValue: (Self.Output) -> Void, receiveCompletion: (Combine.Subscribers.Completion<Self.Failure>) -> Void) -> Cancellable {
            let subscriber = DecodableDataTaskSubscriber<SomeModel>()
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
            return subscription
        }

        typealias Failure = Error

        let urlRequest: URLRequest

        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let subscription = DecodedDataTaskSubscription(urlRequest: self.urlRequest, subscriber: subscriber)
            subscriber.receive(subscription: subscription)
        }
    }

}

extension URLSession.DecodedDataTaskPublisher {

    class DecodedDataTaskSubscription<Output: Decodable, S: Subscriber>: Subscription
    where S.Input == Output, S.Failure == Error {

        private let urlRequest: URLRequest
        private var subscriber: S?

        init(urlRequest: URLRequest, subscriber: S) {
            self.urlRequest = urlRequest
            self.subscriber = subscriber
        }

        func request(_ demand: Subscribers.Demand) {
            if demand > 0 {
                URLSession.shared.dataTask(with: urlRequest) { [weak self] data, response, error in
                    defer { self?.cancel() }

                    if let data = data {
                        do {
                            let result = try JSONDecoder().decode(Output.self, from: data)
                            self?.subscriber?.receive(result)
                            self?.subscriber?.receive(completion: .finished)
                        } catch {
                            self?.subscriber?.receive(completion: .failure(error))
                        }
                    } else if let error = error {
                        self?.subscriber?.receive(completion: .failure(error))
                    }
                }.resume()
            }
        }

        func cancel() {
            subscriber = nil
        }
    }
}

struct SomeModel: Decodable {}

class CustomCombineViewController: UIViewController {

    var cancellable: Cancellable? // 수정

    override func viewDidLoad() {
        super.viewDidLoad()
        self.setup()
    }

    deinit {
        self.cancellable?.cancel()
    }

    func makeTheRequest() {
        let request = URLRequest(url: URL(string: "https://www.donnywals.com")!)
        let publisher: URLSession.DecodedDataTaskPublisher<SomeModel> = URLSession.shared.decodedDataTaskPublisher(for: request)
        self.cancellable = publisher.ssink(receiveValue: { value in
            print("Received value: \(value)")
        }, receiveCompletion: { completion in
            print("Received completion: \(completion)")
        })
    }

    func setup() {
        self.view.backgroundColor = .white
        let button = UIButton(frame: CGRect(x: 20, y: 40, width: 100, height: 50))
        button.backgroundColor = .blue
        self.view.addSubview(button)

        button.titleLabel?.text = "request!!"
        button.addTarget(self, action: #selector(self.buttonTapped), for: .touchUpInside)
    }

    @objc func buttonTapped() {
        self.makeTheRequest()
    }

}

````

# 정리

* Subscriber는 궁극적으로 Subscription에게 값을 받는다.
* Subscription은 life cycle을 관리한다.
* Subscription은 Subscriber를 들고 있을 수 밖에 없으며, 채택한 Protocol Subscription이 Cancellable을 이미 채택하고 있다.
* subscriber에서 subscription을 알고있다가 특정 시점에 해제해주든, 아니면 밖으로 빼든하여 구독의 life cycle을 해제해주어야 한다.
* sink는 sugar api로 이 구독권을 밖으로 빼주는 듯하다.

다음에는 AnyCancellable하고 Cancellable의 차이를 좀 봐야할 듯 하다. 끝!

# Reference

틀린 정보나 궁금한 점이 있다면 언제든 [Twitter](https://twitter.com/WansookDev)로 연락주세요! 감사합니다.

* [Introducing Combine](https://developer.apple.com/videos/play/wwdc2019/722)
* [Combine](https://developer.apple.com/documentation/combine)
* [Composing Reactive Animations](http://conal.net/fran/tutorial.htm)
* [conal/talk-2015-essence-and-origins-of-frp](https://github.com/conal/talk-2015-essence-and-origins-of-frp)
* [Publisher](https://developer.apple.com/documentation/combine/publisher)
* [Subscriber](https://developer.apple.com/documentation/combine/subscriber)
* [Subscription](https://developer.apple.com/documentation/combine/subscription)
* [Understanding Combine’s publishers and subscribers](https://www.donnywals.com/understanding-combines-publishers-and-subscribers/)
* [Understanding Combine’s publishers and subscribers](https://www.donnywals.com/understanding-combines-publishers-and-subscribers/)
