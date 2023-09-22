---
title: Combine Cheat Sheet
thumbnail: ''
draft: false
tags: null
created: 2023-09-22
---

Apple에서 공개한 API인 Combine. 이제 Rx에서 Combine으로 많이 넘어간다고 한다. 무엇을 하는 것인지, 왜 좋은지, 바로 써먹기 위한 팁은 무엇이 있는지 알아본다.

# 의의

* Rx의 사전적 의미
  * Reactive (Observer pattern)
  * Functional
* 값을 다루는 방식
  * 기존
    * 시간이 지남에 따라 변수 값이 변한다.
    * a = 3 -> a = 4
  * Rx
    * 값들의 sequence(stream)
    * 일종의 array를 다루는 사고방식
* 기본 흐름
  * Publisher
    * 값을 방출
  * Operator
    * Publisher들을 조합
  * Subscriber
    * 방출된 값을 받아서 사용

````swift
class ViewModel {
    let text: AnyPublisher<String, Error>
}

class ViewController: UIViewController {
    let label = UILabel()
    var viewModel = ViewModel()

    init() {
        self.viewModel.text
            .assign(to: \.text, on: label) // label, text에 assign하겠다
    }
}
````

# Publisher

## 방출하는 Event 종류

* Output Value
  * 특정 값
  * 특정 값을 포함하는 Event (Publisher가 될 수도 있음)
* Successful Complete
  * 특정 Publisher가 성공적으로 끝난 경우 방출하는 이벤트
  * --event--event--event--|->
    * \|에 해당하는 것
  * Complete이후에는 해당 Publisher는 값을 방출할 수 없음
* Complete with Error
  * Error를 발생하여 Publishing이 끝난 경우
  * --event--event--ERROR-->

## Publisher의 정의

````swift
let publisher: AnyPublisher<ValueType, ErrorType>
````

publisher는 type 2가지를 정의해야 한다. ValueType과 ErrorType이다.

### Value Type

* output value event
* 어떠한 타입이든 가능
  * Int, class, enum
  * array, tuple
  * publisher (즉 publisher의 publisher도 가능, 생각보다 많이 쓰임)
    ````swift
    typealias InnerPublisher = AnyPublisher<Int, InnerError>
    let outterPublisher = AnyPublisher<InnerPublisher, OutterError>
    ````

### Error Type

* complete with error event
* `Swift.Error`를 채택해야 함
* complete with Error event 방출시 반드시 정한 Error를 사용해야 한다.
* compiler가 보장한다. (틀리면 빌드 에러)
* Error를 사용하지 않는다면 `Never`도 가능

## Publisher 생성 방법

### Notifivation

````swift
let myNotification = Notification.name("MyNotification")
let publisher = NotificationCenter.default.publisher(for: myNotification, object: nil)
````

특정 코드에서 `NotificationCenter.default.post()` 호출 시마다, 변수로 선언한 publisher에서 notification이 방출된다.

### Array, Range

````swift
[1, 2, 3].publisher
["a", "b", "c"].publisher
(1...6).publisher
````

우리가 기존에 사용하는 자료구조 대부분이 publisher를 제공한다.

### Just

````swift
Just(3)
Just("abc")
````

Just를 사용하면 해당 값 하나만 방출하는 publisher가 만들어진다. publisher를 조합할 때, 중간중간에 많이 사용된다.

### Future

````swift
let publisher = Future<ValueType, ErrorType> { result in
    // write code
    // API 호출 등의 작업후 성공 여부에 따라..
    if success {
        result(.success(방출한 값))
    } else {
        result(.failure(error))
    }
}
````

### URLSession

````swift
URLSession.shared.dataTaskPublisher(for: url)
````

* url로 부터 data를 받아온 후 그 data를 방출하는 publisher
* 위 예시들과 같이 값을 만들어내는 기존 library들이 publisher를 제공한다.

### KVO

* KVO 만족하는 class들, 즉 NSObject를 상속받는 것들, UIKit에서 정의하는 대부분의 경우도 Publisher를 생성할 수 있다.
* 모든 property가 되는 것은 아니다.

````swift
let view = UIView()
let publisher = view.publisher(for: \.bounds)
````

# Subscriber

* sink
  * closure로 어떤 코드든 가능하다.
* assign
  * property에 값을 넣을 수 있다.
* custom subscriber 

## sink

````swift
publisher.sink(
    receiveCompletion: { param in // 이전에 배운 publisher의 completion이 넘어오는 경우
        switch param {
        case .finished:
            // error 없이 complete된 상황
        case .failure(let error):
            // error 방출된 상황
        }
    },
    receiveValue: { value in // 값이 넘어오는 경우
        // value 방출된 상황
    }
)
````

## assign

````swift
class MyClass {
    var value: Int
}

let myClass = MyClass()

publisher.assign(to: \.value, on: myClass)
````

# Cancellable

* Subscriber가 release(할당 해제 되는 경우)되면 publish는 자동으로 중단된다.
  * release되는 시점은 일반 변수의 release 시점과 동일하다.

````swift
func method() {
    let subscriber = publisher.sink(...)
    // 메소드 내에 있을 경우 subscriber는 계속 동작한다.
}
// 해당 함수의 동작이 끝난 경우 local variable는 release된다.
````

* 하지만 이런 것은 우리가 원하는 것이 아니다.
* method에서 return하더라도 subscriber가 계속 동작해야 한다.
* 계속해서 값을 받아와서 업데이트하길 원하기 때문
* 어떻게 할 수 있을까? 이런 경우 보통 class안에 member 변수로 가지고 있는다.

### 자동 중단을 막는 방법

````swift
class A {
    var mySubscriber: AnyCancellable?

    func method() {
        self.mySubscriber = publisher.sink(...)
        // 메소드를 벗어나도 release 되지 않음
    }
    
    func otherMethod() {
        self.mySubscriber?.cancel() // 특정 상황에서 동작을 멈추고 싶다면 cancel하고 대체함
    }
}
````

* 모든 subscriber는 cancellable하다.
* 하지만 이렇게 하면 사용하는 모든 Subscriber를 다 들고 있어야 한다.
* 특별히 특정 Subscriber를 cancel해야 하는 경우가 아니라면 변수로까지 들고 있을 필요는 없다.

### Subscriber들을 하나의 멤버변수에 모두 넣기

````swift
class A {
    var subscriptions = Set<AnyCancellable>()

    func method() {
        let subscriber = publisher.sink(...)
        subscriver.store(in: &subscriptions)
    }
    // class instance가 release되면 모두 release된다.
}
````

### 일반적인 코드의 모습

````swift
class A {
    var subscriptions = Set<AnyCancellable>()

    func someMethod() {
        self.viewModel.aPublisher
                        .operator()
                        .sink(...)
                        .store(in: &subscriptions)
    }
}
````

# Subject

* 수동으로 값을 방출시킬 수 있는 publisher

````swift
let subject = PassthroughSubject<Int, Error>

subject.sink(...) // Publisher와 마찬가지로 Subscriber 등록
subject.send(value) // 값 방출 기능 추가
````

## PassthroughSubject

* 방출만 하고, 값을 보관하지 않는다.
* 새로 Subscribe되는 순간 별다른 동작을 하지 않는다.
* 값을 방출한 후에는 저장하지 않고 버린다.
* 값을 저장할 필요가 없는 publisher를 사용할 때 사용한다.
* 혹은 저장하면 문제의 여지가 있는 경우 사용한다.

![](154199909-071037d9-9393-4211-8f7b-ba35642212e3.png)

## CurrentValueSubject

* 마지막으로 방출했던 값 1개를 보관한다.
* 새로 Subscribe될 때마다 보관했던 값을 방출한다.

![](154199947-4da258e2-57c9-441d-9c17-a6a3ab662866.png)

* 마지막으로 방출했던 값을 수동으로 얻을 수도 있다.
  ````swift
  let subject = CurrentValueSubject<Int, Error>(0)
  subject.send(값1)
  subject.send(값2)
  
  let val = subject.value // 저장된 값을 얻음
  ````
  
  * 변수처럼 사용할 수 있으면서 Publisher로 사용도 가능하다.
  * 현재 상태값을 저장하는 용도로 좋다.

## Subject의 단점

Combine은 애초에 변화하는 값들의 sequence를 다루는 방법으로 나온 프레임워크이다. 그렇기 때문에 값처럼 사용될 수 있는 Subject를 남용하면, Combine을 사용하지 않는 코드와 비슷한 형태가 될 수 있다. 그렇기 때문에 남용하지 않는 것이 좋다. 가장 나중에 고려하는 용도로 두면 좋을 것이다.

# Operator

수학의 operator는 숫차를 조합해서 새로운 숫자를 만드는 것이다. 연이어서 사용이 가능하다.(연산자 우선순위가 같은 경우)

Combine에서 Operator는 **Publisher를 조합하여 새로운 Publisher를 만든다**라고 이해하면 좋을 듯하다. 수학에서의 Operator와 마찬가지로 연이어서 사용이 가능하다.(chain)

````swift
publisher.oprator1().operator2(parameter: anotherPublisher)...
````

* failure가 발생하는 경우, 대부분의 operator는 failure를 그대로 아래로 전달한다.
* (물론 failure를 변형하는 operator도 있다.)

## map

````swift
let publisher = intPublisher.map { $0 * 2 }
let strPublisher = pub.map { String($0) }
````

* array에서의 map
  ````swift
  [10, 20].map { [$0 + 1, $0 + 2]} == [[11, 12], [21, 22]]
  ````

* publisher에서의 map
  ````swift
  let pub1 = [10, 20].publisher
  let pub2 = pub1.map{ [$0 + 1, $0 + 2].publisher }
  // pub1이 방출하는 값 -> array로 변형후 -> 해당 array를 방출하는 publisher로 변환
  ````
  
  * 결과
  * type: `Publisher<Publisher<Int, Error>, Error>`
  * action: `[11, 12].publisher` 방출 후, `[21, 22].publisher` 방출

## tryMap

* map과 같으나 내부에서 error throw 가능

````swift
publisher.tryMap {
    if {
        throw myError
    }
}

publisher.map {
    if {
        throw myError // 빌드 에러
    }
}
````

* map의 경우, **내부**에서 failure가 발생하지 않는다는 것을 보장한다. [참고](https://velog.io/@wansook0316/Functor%EC%99%80-Monad-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0)
* 만약 publisher에서, 즉 코드블락 바깥쪽에서 failure가 발생한다면, map, tryMap 모두 그대로 아래로 전달한다.

## flatMap

* [참고](https://velog.io/@wansook0316/%EA%B3%A0%EC%B0%A8%ED%95%A8%EC%88%98-%EC%82%AC%EC%9A%A9%EC%82%AC%EB%A1%80-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-map-flatMap-%EC%B0%A8%EC%9D%B4-%EC%9D%B4%ED%95%B4)
* array에서의 flatMap
  ````swift
  [[1, 2], [3, 4]].flatMap { $0 } == [1, 2, 3, 4]
  ````
  
  * 2차원 array가 있을 때, flatten됨
* publisher에서의 flatMap
  ````swift
  let pub1: AnyPublisher<AnyPublisher<Int, Error>, Error>
  let pub2: pub1.flatMap { $0 } // type: AnyPublisher<Int, Error>
  ````
  
  * publisher안에 publisher가 있는 형태
  * 즉, publisher를 방출하는 publisher
  * 이 경우, 내부 type을 방출하는 publisher로 됨

위의 map의 예시와 비교해보자. 만약 map에서의 예시로 든 코드에서 flatMap으로 변경하면 결과가 어떻게 될까?

* array에서의 map
  ````swift
  [10, 20].flatMap { [$0 + 1, $0 + 2]} == [11, 12, 21, 22]
  ````

* publisher에서의 map
  ````swift
  let pub1 = [10, 20].publisher
  let pub2 = pub1.flatMap{ [$0 + 1, $0 + 2].publisher }
  // pub1이 방출하는 값 -> array로 변형후 -> 해당 array를 방출하는 publisher로 변환
  ````
  
  * 결과
  * type: `Publisher<Int, Error>`
  * action: `[11, 12, 21, 22]` 방출

### 대표적 용도

* 값을 변환해야 하는데, 반드시 publisher로 나와야 할 때

````swift
.flatMap { 사용자의 행동으로 값을 방출하는 publisher }
.flatMap { API를 쏘고 응답을 받는 Publisher }
````

이런 경우 사용하면 result는 API응답 값들을 방출하는 Publisher가 된다.

### 동작 방식

![](154204617-5861ebeb-2b86-419e-9d14-0ff0854a7d97.png)

* 가장 윗라인은 publishers를 방출하는 publisher
* flatMap의 파라미터로 최대 publisher를 2개만 가지도록 했다.
* flatMap은 map + flatten이다.
* 그래서 일단 map의 적용부터 생각해보면, 각각의 publisher를 `$0.value`로 생성해준다.
  * `$0.value`는 값 자체를 내보내는 것이 아니고, publisher를 만들어주는 행위이다.
  * 즉, p1.value가 적용될 경우, p1의 1, 4를 방출하는 publisher를 만들어주고
  * p2.value가 적용될 경우, p2의 2, 5를 방출하는 publisher를 만들어준다.
  * 그래서 생성 시점을 보면, p1, p2, p3가 순차 적용되면서 publisher 생성 시점이 밀리는 것을 확인할 수 있다.
* 이 떄, max publisher를 2로 잡았기 때문에, publisher는 2개만 챙긴다.
* 마지막으로 flatten을 적용하여 하나의 publisher로 만들어준다.

## switchToLatest

````swift
let pub1: Publisher<Publisher<Int, Error>, Error>
let pub2 = pub1.switchToLastest()
````

* pub2의 type은 `Publisher<Int, Error>`이다.
  * `flatMap`과 동일하다.
* 하지만, Publisher가 방출될 때마다, 그 전에 방출되었던 Publisher는 무시된다.

![](154205691-00a47a07-c4ea-4743-a193-d463a791e351.png)

* flatMap을 적용하면, publisher들이 방출한 값들을 묶어서 하나의 Publisher로 만들어주었다.
* 그런데, 각각의 Publisher들이 방출하는 시점이 다르기 때문에, 각각의 Publisher에서의 방출한 값이 섞여서 최종 Publisher에서 방출된다.
* switchToLatest를 사용하게 되면, 이 시점에서 가장 최근에 Publish한 Publisher만 값을 반영한 Publisher를 만들어준다.

## 일부 제외 일부 방출

* 이렇게 방출하는 값을 일부 제외하고 일부는 방출하는 operator들이 있다.
  * filter, compactMap
  * first, first(where:), last, last(where:)
  * drop, prefix
* removeDuplicates
  ````swift
  [1, 2, 2, 3, 3, 2, 2, 4].publisher.removeDuplicates() == [1, 2, 3, 2, 4].publisher
  ````
  
  * 같은 값이 반복하여 방출되는 것을 막는 operator

## merge

* type이 같은 publisher들을 조합
* 각 publisher내에서 값이 방출되면, 그대로 뒤로 방출시킴
  ![](154206446-ec2c8cca-c1c9-4367-b9c8-44e88f5fcb42.png)

````swift
let result = pub1.merge(pub2, pub3)
````

## combineLastest

* 각 publisher 내에서 값이 방출되면, 다른 publisher의 마지막 값과 조합하여 tuple을 만들어 방출
* 이런 속성 때문에 Publisher들의 Type이 달라도 된다. 어차피 묶어서 tuple로 방출하기 때문
  ![](154206666-5e237678-128a-4d87-86e4-b14a3034b9d3.png)

## delay

* 지금까지는 방출된 시점을 기준으로 action이 취해졌다.
* delay같은 경우, 방출값을 기억하고 있다가, 일정 시간 이후 부터 방출을 시작한다.

## debounce

* 일정 시간 동안 방출이 없을 경우, 뒤로 방출
* 사용자가 글자를 입력하는 경우 유용

# Reference

* [Transforming Operators](https://www.raywenderlich.com/books/reactive-programming-with-kotlin/v2.0/chapters/7-transforming-operators)
