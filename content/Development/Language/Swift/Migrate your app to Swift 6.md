---
title: Migrate your app to Swift 6
thumbnail: ''
draft: false
tags:
- swift
- migration
- concurrency
created: 2024-06-20
---

WWDC 24의 Swift 6 migration guide를 정리해본다.

# Queue 사용

![Screen Shot 2024-06-20 at 4.51.29 PM.png](Assets/Screen%20Shot%202024-06-20%20at%204.51.29%20PM.png)

# Swift Concurrency

* Swift Concurrency에서는, 동시성 문제를 발생시킬 수 있는 객체를 Actor로 변경하고,
* 그 사이에서는 thread safe한 Value 타입을 통해 통신함으로써 보다 간결한 구조를 가질 수 있었다.

![Screen Shot 2024-06-20 at 4.52.09 PM.png](Assets/Screen%20Shot%202024-06-20%20at%204.52.09%20PM.png)

# 문제

* 개념은 좋으나, 이걸 이전 코드로부터 변경하려면 좀 부담이 된다.
* Data race를 회피해야 한다는 것.
* Value type으로 통신해야 한다는 것도 알고, actor를 사용해야 한다는 것도 안다.
* 근데 **꼭 그렇게 할 필요는 없었다.**
* 즉, `@Sendable`하지 않은 객체를 사용해도 괜찮았다.
* 이렇게 Tight하게 잡혀있지 않는 상황이라면 다음의 문제가 발생할 소지가 있다.
  1. Crash로 인한 사용자 경험 저해
  2. 데이터 부패

# 방향

 > 
 > 데이터 격리를 강제하겠다. (Enforcement of data isolation)

* thread safe하지 못한 부분에 대해 컴파일러에서 이를 체크하고 수정하도록 만들겠다.
* 이제부터는 코드를 사용할 때, Multi thread 환경을 고려하며 어디서 어떻게 호출될 것인지도 염두에 두고 코드를 작성해라.
* 특정 타입이 어떻게 Multi thread 환경에서 동작해야 하는지를 제약하여 "Local reasoning(특정 소스코드에 접근하는 것만으로 동작을 유추할 수 있는 특성)"을 높이겠다.

# Global Variable

* 전역 변수는 data race가 발생하기 쉬운 조건이다.
* 이런 경우 `let`으로 선언하는 것으로 일단 해결이 가능하다.
  * (해당 객체가 `Sendable`이라면)

````swift
let logger = Logger()
````

* 그런데 만약 해당 값을 나중에 변경해야 하는 경우라면 어떨까?
* 즉, `var`로 선언하면서 문제를 해결하고 싶다면?
* 해당 객체를 [Global Actor](Global%20Actor.md)로 선언하면 된다.
  * `@MainActor` keyword는 [Global Actor](Global%20Actor.md)의 일종이다.
* 전역에서 Actor와 같이 동작하도록 변경하는 것이다.

````swift
@MainActor var logger = Logger()
````

* 때로는 이런 에러가 났을 때, Actor와 같은 키워드를 사용하고 싶지 않을 수 있다.
* 가령, 해당 변수의 data race 문제를 lock, semaphore, dispatch queue와 같은 로직으로 처리했을 수도 있다.
* 그래서 굳이 swift concurrency를 쓰지 않고 싶을 수도 있다.
* 이런 경우 [nonisolated(unsafe)](nonisolated%28unsafe%29.md) 키워드를 사용해서 처리하면 된다.

````swift
nonisolated(unsafe) var logger = Logger()
````

* [Lazy Initialization](Lazy%20Initialization.md)에 대한 문제는 없나?
* Swift는 [Lazy Initialization](Lazy%20Initialization.md)을 사용하는데, 초기에 두개 이상의 스레드에서 동시접근했을 때의 문제는 없을까?
* Swift는 전역 변수에 대해 mutual exclusive를 지원하기 때문에 괜찮다.

# Delegate

* 시스템에서 제공하는 Delegate를 생각해보자.
* iOS에는 다양한 delegate들이 있는데, 해당 문서에 가보면 delegate의 call back을 어느 스레드로 주는지에 대한 설명이 있는 경우가 있다.
* 코드만 추적해서 보아서는 해당 delegate가 **어느 스레드로 callback을 줄지 알 수 없다.**
* 이를 적용하려면 제대로된 코드를 만들기 위해 문서를 찾고, 다시 이를 반영하고를 반복하는 짓을 해야 한다.
* 잘못하면 **data race를 일으키기도 쉽다.**
* **시스템에서 call back 하는 스레드라도 바꿔버리면, 내 코드가 무너지기도 쉽다.**
* Swift에서는 이러한 **보장의 부족 현상을 명시적으로 바꿨다.**

## Example

* 만약 특정 delegate가 호출되어야 하는 thread가 Main이어야 한다고 가정하자.

````swift
@MainActor
public protocol AADelegate {
						
}
````

* Main 말고 내가 정한 다른 실행흐름에서만 호출되어야 한다고 가정하자. ([Global Actor](Global%20Actor.md))

````swift
@SomeActor
public protocol AADelegate {
							
}
````

* 그럼 아무것도 달지 않으면 어떻게 될까?

````swift
public protocol AADelegate {
							
}
````

* 기본적으로 하위에 있는 메서드는 모두 **nonisolated**하다고 처리한다.
* 즉, **어떤 스레드에서 동작해도 괜찮아~** 라고 처리해버린다.

## 겪을 수 있는 문제들

* 다음과 같은 상황이 있다고 하자.

````swift
public protocol CaffeineThresholdDelegate: AnyObject {
	func caffeineLevel(at level: Double)
}
````

````swift
@MainActor
class Recaffeinater: ObservableObject {
    @Published var recaffeinate: Bool = false
    var minimumCaffeine: Double = 0.0
}

extension Recaffeinater: CaffeineThresholdDelegate {
	// ERROR!
    public func caffeineLevel(at level: Double) {
        if level < minimumCaffeine {
            // TODO: alert user to drink more coffee!
        }
    }
}
````

* 위 상황이라면 에러가 난다.
* delegate에 thread에 대한 제약을 걸지 않았기 때문에 `nonisolated`하다고 처리했고,
* `Recaffeinater`의 경우에는 하위 모든 property와 method의 실행 thread를 main에서 하겠다 했으니, 충돌이 난 것.

## 해결 1

````swift
extension Recaffeinater: CaffeineThresholdDelegate {
    nonisolated public func caffeineLevel(at level: Double) {
        if level < minimumCaffeine { // ERROR!
            
        }
    }
}
````

* delegate의 요청사항에 맞춰, 해당 메서드는 main에서 격리되어 실행됨을 보장하지 않도록 바꿔버린다.
* 근데 이렇게 하면, 4번 라인에서 내가 해야하는 동작인 UI 처리를 할 수 없다.
* main thread에서 동작해야 하니까.
* 대표적으로 `minimunCaffeine`변수가 `@MainActor`라서 3번 라인에서 에러가 난다.

````swift
nonisolated public func caffeineLevel(at level: Double) {
    Task { @MainActor in
      if level < minimumCaffeine {
        // TODO: alert user to drink more coffee!
    	}
    }
}
````

* 그럼 이러한 모양이 되겠다.
* 사실 이런 경우보다는 `CaffeineThresholdDelegate`가 정말 non isolated 환경에서만 호출되어야 하는지를 체크하는 것이 더 옳을 것이다.

## 해결 2

* `CaffeineThresholdDelegate`를 `MainActor`에서 호출하도록 제한할 수 없다고 하자.
* SDK에서 제공하는 거라 내가 어떻게 손볼수가 없다고 치자.

````swift
nonisolated public func caffeineLevel(at level: Double) {
    MainActor.assumeIsolated {
        if level < minimumCaffeine {
            // TODO: alert user to drink more coffee!
        }
    }
}

````

* 그럼 이렇게도 해결할 수 있다.
* delegate에서 오는 스레드를 알 수 없다고?
* 그럼 main에서 오는 경우만 처리하자. / 혹은 main에서 올 것을 믿고 위처럼 처리하자.
* 혹시라도 다른 스레드에서 올 경우를 대비해 `assert`같은 걸로 대비하면 좋겠다.
* 이렇게 callback에 대한 믿음(?)의 영역으로 가는 코드에 대해 모두 위와 같이 처리할 수는 없으므로 아래와 같은 것을 제공한다.
  * 혹은 swift concurrency가 제공되지 않는 코드에 대한 호환성을 위한 키워드라고 생각할 수도 있겠다.

````swift
extension Recaffeinater: @preconcurrency CaffeineThresholdDelegate {
    public func caffeineLevel(at level: Double) {
        if level < minimumCaffeine {
            // TODO: alert user to drink more coffee!
        }
    }
}
````

* `@preconcurrency`는 기존 코드가 동시성 모델 규칙을 따르지 않아도 허용할 수 있게 만드는 키워드다.
* 즉, 프로그래머를 믿으라는 키워드.
* 추후에 `CaffeineThresholdDelegate`가 `MainActor`이어야 한다는 제약이 추가된다면, 컴파일러는 더이상 `@preconcurrency`가 필요없다는 경고를 날려준다.

\#Don't Panic

* 실제 프로젝트에서는 굉장히 많은 경고가 뜰거다.
* 쫄지마라 (?)
* `let`선언과 같이 쉬운 변경도 있을 것이고,
* 특정 클래스 자체에 `@MainActor`선언과 같이 간단한 변경으로 많은 경고를 지울수도 있을 것이다.
* 즉, 대다수의 쉬운 문제 + 어려운 약간의 문제가 있을 것이다. (과연?)

# Actor간의 통신

* 특정 C 객체의 배열을 A actor에서 B actor로 보낸다면 어떻게 해야할까?
* C 객체는 `Sendable`을 준수해야 한다.

## ACL에 따른 sendability inference

* A, B Actor가 특정 framework 내부에 있고, 
* 전달되는 C 타입이 `internal`로 선언되어 있다면,
* Swift는 struct에 대해 자동으로 `Sendable`을 추론해서 적용한다.
* **하지만 `public`타입에 대해서는 자동 적용하지 않는다.**
* `public`이란 의미는, 곧 해당 framework를 사용하는 client가 있다는 뜻이고,
* 그들에게 추론할 수 있는 정보를 제공해야 하기 때문이다.
* 만약 C 타입에 `Sendable`이라는 것을 명시적으로 채택하지 않는 상황에서 client가 C타입을 사용한다면,
* 해당 값이 변하는지 그렇지 않은지를 일일히 살펴봐야 한다.

````swift
// Client: Sendable인지에 대한 정보가 없음
public struct C {
	public let apple: String
}

````

* (이런 문제로 발생하는 에러도 있기 때문에 겁먹지 마라고 한 것)

## Objective C 타입이면 어떡하지?

* 그런데 이런 타입이 아닐 수도 있다.
* 만약에 Objective-C 타입을 바깥으로 전달해야 하는 상황이면 어쩌지?
* Reference Type인데 말이다.

### 의미적으로 안전하다면..

* 항상 copy를 내보내는 것이 보장된 타입일 수 있다.
* `NSCopying`에 의해 복사된 객체를 받는 다는 것이 보장된다면,
* `Sendable`이 아닐지라도 의미적으로 보호한 뒤, 사용할 수 있다.
* `nonisolated(unsafe)` 키워드를 붙여서 사용하면 된다.
  * 결국 이건 프로그래머의 역량에 맡기는 옵션이다.

````swift
// Client: Sendable인지에 대한 정보가 없음
public struct C {
	public let apple: String
	
	nonisolated(unsafe)
	public let melon: SomeObjectiveClass
}

````

# Wrap-up

1. 천천히 해라.
1. 간단한 것 부터 처리하자.
1. 리팩토링 해야할 것이다.
1. [Migrating to Swift 6](https://www.swift.org/migration/documentation/migrationguide/)를 참고해라.

# 예상되는 문제점

# Annotation 전파의 문제

![Screen Shot 2024-06-20 at 6.23.41 PM.png](Assets/Screen%20Shot%202024-06-20%20at%206.23.41%20PM.png)

* 특정 시스템 라이브러리를 사용하고 있다고 가정해보자.
* 이전에는 `my function`이 있는 `class`에서 그냥 사용했으면 됐다.

![Screen Shot 2024-06-20 at 6.20.38 PM.png](Assets/Screen%20Shot%202024-06-20%20at%206.20.38%20PM.png)
![Screen Shot 2024-06-20 at 6.20.41 PM.png](Assets/Screen%20Shot%202024-06-20%20at%206.20.41%20PM.png)
![Screen Shot 2024-06-20 at 6.20.45 PM.png](Assets/Screen%20Shot%202024-06-20%20at%206.20.45%20PM.png)

* 그런데 swift 버전이 올라가면서 특정 메서드 자체가 호출되어야 하는 스레드가 제약된다면,
* 이를 사용하는 함수들에서도 어떤 스레드에서 실행이 되어야 하는지 명시적으로 결정해주어야 하는 문제가 생긴다.

# Reference

* [Migrating to Swift 6](https://www.swift.org/migration/documentation/migrationguide/)
* [10. Actor Part. 02](../../iOS/Concurrent%20Programming/10.%20Actor%20Part.%2002.md)
