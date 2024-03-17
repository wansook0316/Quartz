---
title: NotificationCenter
thumbnail: ''
draft: false
tags:
- swift
- notification
- pub-sub
- publish-subscribe
created: 2023-09-30
---

Notification Center는 꽤나 오래전 부터 iOS의 이벤트 전송 매커니즘으로 자리잡았다. 어떤 요소들이 있는지 확인해보자.

# Publisher/Subscriber Pattern

NotificationCenter에 대해 알아보기 이전에, 이 녀석이 어떠한 기반을 가지고 태어난 아이인지 알아볼 필요가 있다. 

![](Swift_26_NotificationCenter_0.png)

기본적으로 NotificationCenter는 Publisher/Subscriber Pattern을 따른다. Publisher/Subscriber Pattern은 비동기 메시징 패러다임으로, 발신자와 수신자로 구분되어 있다. 이 때, 발신자의 메시지는 특별한 수신자가 정해져있지 않아도 메시지를 보낼 수 있다. 즉, 보내는데 받는 녀석이 없어도 된다는 말이다. 대신 수신하는 쪽에서 등록하는 작업이 필요하다. 이 때, 수신자는 어떤 발신자로부터 메시지가 전달되는지에 대한 정보를 알 필요가 없다. 즉, 수신측의 정보를 전혀 몰라도 메시지를 받을 수 있다는 말이다.

쉬운 이해를 위해, 우리가 우편물을 받는 동작을 생각해보자. 누군가와의 편지를 나누는 상황이었다면, A로부터 연락이 올 것을 기대하게 되지만, 만약 국가로부터 날아오는 납세 우편(~~으으~~)이라면 언제 누군가에게 올 지 예상하지 못한 상황에서 받게 된다. 즉, 수신자의 정보를 굳이 모르더라도 내 우편함에 우편이 도착해있다. 하지만 이러한 우편을 받기 위해서 나의 주소를 데이터베이스에 등록할 필요는 있다. 마찬가지의 원리라고 생각하면 된다.

## Pros

**느슨한 결합**을 가진다는 것이 장점으로 작용할 수 있겠다. 위에서 말한 것 처럼, 결국 수신자의 입장에서는 어떤 객체가 나에게 메시지를 보낼지에 대한 정보를 몰라도 된다. 그렇기 때문에, 해당 메시지를 보내는데 있어서 다른 객체로 쉽게 대체가 가능하다. 각 객체 혹은 서버 (앞으로는 추상적 개념으로 토폴로지라 칭하겠다)는 독립적으로 존재할 수 있다. 만약 클라이언트-서버 패러다임이었다면, 서버 프로세스가 실행되지 않는 동안 메시지를 보낼 수 없으며, 클라이언트 역시 실행되지 않으면 수신이 불가능하다. 추가적으로 **시스템 확장성**을 가질 수 있다. 이 부분은 정확히 이해하지 못하여 추가 정보가 필요하다.

## Cons

하지만 이렇게 느슨한 결합(decoupling)을 가진다는 것이 큰 결점으로 작용할 수 있다. 메시지 수신 객체를 연결해주는 `PublisherCenter`는 결국 메시지 전달의 성공 여부를 알 수 없다. 만약 tight한 coupling을 지향하는 패턴이었다면 이를 보장할 수 있기 때문에 보다 완전성있는 통신이 가능하다. 이는 수신자 입장에서도 마찬가진데, 결국 메시지를 보냈는지 그렇지 않은지에 대한 판단을 할 수 없다.

또한 Subscriber와 Publisher의 개수가 많아짐에 따라, 교환되는 메시지의 수가 증가함에 따라 아키텍쳐가 불안해진다. 한번의 이벤트 발송에 딸려있는 handler를 모두 처리해야 하기 때문에, 수신자의 개수가 많아진다면, 이를 연속하여 처리해야 하기 때문에 순간적으로 시스템 부하가 걸릴 수 있다. 

개인적으로 사용해보았을 때 어려움은, 전역으로 관리된다는 점이었다. 해당 함수의 호출이 어디인지 파악하기 위해서는 이를 post하는 곳을 찾아야 하는데, decoupling이 심하다보니 디버깅, 유지보수에 있어 좋지 않다는 생각이 들었다.

추가적인 장단점은 해당 패턴에 대해 깊이 공부한 이후에 포스팅으로 만들어보도록 하겠다. 

# Notification Center

간단하게 디자인 패턴에 대해 알아보았으니, 실제 iOS에서 사용하는 방식을 알아보자.

![](Swift_26_NotificationCenter_1.png)

크게 달라진 것은 없다. 다만 용어들이 조금 달라졌다. PublisherCenter는 NotificationCenter로, Object는 구체적으로 Model, View에서 보내는 것으로, 그리고 Subscriber는 Observer로 명칭이 변경되었다. 기본적인 원리는 같으니, 실제로 어떻게 사용하는지에 대해 알아보자.

## Custom Notification

![](Swift_26_NotificationCenter_2.png)

````swift
class ViewController {
    // 1. Get NotificationCenter Instance  
    let notificationCenter = NotificationCenter.default
    
    override func viewDidLoad() {
        super.viewDidLoad()
      
        // 2. Custom Notification Name
        let notificationName = Notification.Name("NotificationName") 
        // 3. Add Observer - Register and Observe for changes
        notificationCenter.addObserver(self, // 2a. An object to register as an observer.
                                       selector: #selector(myMethod(_:)), // 2b. Method what will be called if Notification triggers
                                       name: notificationName, // 2c. Name of the Notification to know to Identify the message
                                       object: nil)
    }
    
    @objc func myMethod(_ notification: NSNotification) {
        // 4. The call
        // 4a. In case the message is passing some data it is in 'notification.userInfo'
    }

}

class Model {
    func postNotification() {
        let notificationName = Notification.Name("NotificationName")
        let message = ["message_key": "message_value"]
        Notification.default.post(name: notificationName, object: self, userInfo: message) // 발신자를 알리고 싶다면 object에 넣어주자
    }
}

````

가장 많이 사용하는 방식을 소개해보도록 하겠다. 순서는 다음과 같다.

1. Notification Instance를 만든다.
1. NotificationCenter에 등록할 NotificationName instance를 만든다. 
1. Observe하여 동작을 실행하고 싶은 객체에서 Observer를 추가한다.
   * `selector` 사용: objective-C runtime 사용, `@objc` 키워드 요구됨, 동기 방식
   * handler 사용: queue 지정을 통해 비동기 방식 적용 가능
1. 원하는 함수가 호출된다. 데이터가 전송되어야 하는 경우 userInfo로 전달한다.
1. (코드에는 없지만) 앱 타겟이 iOS 9.0, macOS 10.11 이전이라면 등록한 observer를 제거해주어야 한다. 이후의 경우 system이 제거해준다.
1. 정보를 보내는 쪽에서는 원하는 데이터를 만들어 `post` 메서드를 사용하여 보낸다.

````swift
@objc extension NSNotification {
    public static let myCustomNotificationName = Notification.Name.myCustomNotificationName
}
````

`extension Notification.Name { }`으로 추가하여 사용도 가능하다. 하지만 전역 스코프로 관리되니 부분적으로 관리하고 싶다면 해당 방법은 좋지 않을 수 있다. 해당 Name을 관리해야 하는 객체가 누가 되어야 하는지 생각하는 것이 좋다.

### NotificationCenter Sync

````swift
func addObserver(_ observer: Any, 
        selector aSelector: Selector, 
            name aName: NSNotification.Name?, 
          object anObject: Any?)
````

위 방식으로 observer를 등록하는 것에는 두가지 방법이 있다고 했다. 가장 많이 사용되는 방식은 동기 방식이다. 간편하게 사용이 가능하다.

### NotificationCenter Async

````swift
func addObserver(forName name: NSNotification.Name?, 
          object obj: Any?, 
           queue: OperationQueue?, 
           using block: @escaping (Notification) -> Void) -> NSObjectProtocol
````

Pub/Sub 패턴에서 많은 subscriber가 연결되어 있을 시 부하가 걸릴 수 있다는 문제가 있었다. 이러한 점에서 비동기적인 해결방법을 사용할 수 있는데, 위의 함수를 사용하면 된다. queue가 `nil`인 경우 동기적으로 작동된다. 해당 함수는 `selector`를 사용하는 동기 메서드와 다르게, return value를 가진다. 만약 중간에 observing을 그만하고 싶다면, 해당 return value를 변수로 가지고 있다가, `center.removeObserver(self.observer)`와 같은 형식으로 제거해주어야 한다. 만약 한번만 observing하고 그만 두고 싶다면 다음과 같은 방식을 추천한다고 한다.

````swift
let center = NSNotificationCenter.defaultCenter()
let mainQueue = NSOperationQueue.mainQueue()
var token: NSObjectProtocol?
token = center.addObserverForName("OneTimeNotification", object: nil, queue: mainQueue) { (note) in
    print("Received the notification!")
    center.removeObserver(token!)
}
````

## OS provided Notification

iOS에서도 이 NotificationCenter를 내부적으로 사용중이다. 다음과 같은 것들이 있다. 추가적으로 궁금하다면 [NSNotification.Name](https://developer.apple.com/documentation/foundation/nsnotification/name)를 참고하자.

````swift
static let elementFocusedNotification: NSNotification.Name
static let boldTextStatusDidChangeNotification: NSNotification.Name 
class let didBecomeActiveNotification: NSNotification.Name
class let didReceiveMemoryWarningNotification: NSNotification.Name 
class let textDidChangeNotification: NSNotification.Name
class let batteryLevelDidChangeNotification: NSNotification.Name 
class let keyboardWillShowNotification: NSNotification.Name
````

위에 보이는 `didBecomeActiveNotification`의 경우, `AppDelegate`에서의 `applicationDidBecomeActive(_:)` 혹은 `SceneDelegate`의 `sceneDidBecomeActive(_:)`와 동일하다. 기존에는 각각의 소스 파일 내부에서 이를 관리할 수 밖에 없었다면, 이제 이 `NotificationName`으로 Observing한다면, OS가 관리하는 이벤트가 발생하는 시점에, 내가 원하는 동작을 수행하도록 할 수 있을 것이다.

# Sum up

* NotificationCenter는 Pub/Sub pattern을 사용한 메시지 전송 객체이다.
* Custom으로 만들어서 사용할 수 있고, System에서 제공하는 녀석을 사용할 수도 있다.
* selector를 사용하는 경우 iOS 9.0 이전이라면 observer를 명시적으로 지워주어야 한다.
* 비동기적으로 메시지를 수신하는 method도 존재한다.

오늘은 간단하게 NotificationCenter에 대해 알아보았다. 만약 Combine 활용이 궁금하다면 [03. Notification To Combine](03.%20Notification%20To%20Combine.md)을 읽어보자. 끝!

# Reference

* [Publish–subscribe pattern](https://ko.wikipedia.org/wiki/%EB%B0%9C%ED%96%89-%EA%B5%AC%EB%8F%85_%EB%AA%A8%EB%8D%B8)
* [Design Patterns: PubSub Explained](https://abdulapopoola.com/2013/03/12/design-patterns-pub-sub-explained/)
* [NotificationCenter](https://developer.apple.com/documentation/foundation/notificationcenter)
* [Working With NotificationCenter in iOS](https://betterprogramming.pub/working-with-notificationcenter-in-ios-4724c00ce5d9)
* [addObserver(\_:selector:name:object:)](https://developer.apple.com/documentation/foundation/notificationcenter/1415360-addobserver)
* [addObserver(forName:object:queue:using:)](https://developer.apple.com/documentation/foundation/notificationcenter/1411723-addobserver)
* [NSNotification.Name](https://developer.apple.com/documentation/foundation/nsnotification/name)
