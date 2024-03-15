---
title: Why monad part. 01
thumbnail: ''
draft: false
tags:
- monad
- functional-programming
created: 2023-09-18
---

그래서 Monad를 왜 사용하는가?

# 왜 모나드가 유용한가?

## Improve High-Demensional lift

* Monad는 Functor의 불만족스러운 부분을 해소해준다.
* 앞에서 `lift2d`에 대해 배웠다.
* `lift2d: ((T, U) -> V) -> (F<T>, F<U>) -> F<F<V>>`
* 문제는 반환 타입에 제네릭이 여러개 걸린다는 것이다.
* 가끔은 유용하지만 일반적으로는 불편하다.
* `list`같은 것은 유용할 수 있지만, `optional`같은 것은 별 쓸데가 없다.
* 여기서 `flat`을 쓰면 다중 제네릭을 제네릭 하나로 줄일 수 있다.
* Functor와 Monad 사이에는 Applicative Functor라는 단계가 하나 더 존재하긴 한다. 나중에 알아보자.

## Enabld to compose Generic-returners

* 위의 이유보다 더 중요한 이유가 있다.
* **제네릭 타입을 반환하는 함수들의 합성을 가능케 한다는 것이다.**
* `T -> M<U>, U -> M<V>` 두개의 함수가 있다고 하자.
* 보통은 이 두 함수를 합성할 수 없다.
* 왜냐하면 `U`와 `M<U>`는 다른 타입이기 때문이다.
* 그런데 Monad는 이게 가능하다. Monad는 `T`의 의미를 유지한 상태로 확장하는 타입이니까.

````swift
// Optional

func f(_ t: T) -> Optional<U> {
    // ...
}

func g(_ u: U) -> Optional<V> {
    // ...
}

func gf(_ t: T) -> Optional<V> {
    let opu = f(t)
    switch opu {
        case .none:
            return .none
        case .some(let u):
            return g(u)
    }
}
````

* `gf`와 같이 구현할 수 있다.
* 이건 합성한 결과물은 아니고, 이런 식으로 나올 수 있음을 보여주기 위함이다.
* `swift`와 같은 언어에서는 이렇게 처리할 수 있겠다.

````swift
lift(g): Optional<U> -> Optional<Optional<V>>
flat o lift(g): Optional<U> -> Optional<V>
````

* `lift(g)`를 적용하면 결과값이 `Optional<Optional<V>>`가 나온다.
* 여기서 flat을 어떠한 방식으로 걸면 원하는 결과가 나온다.
* Monad는 `flat`을 가지고 있으니 이러한 식으로 확장한 연산을 정의할 수 있게 된다.
* **직접 정의할 필요도 없이 Monad의 특성을 가지고 합성하여 원하는 결과를 얻을 수 있다.**
* 이제 감 잡았겠지만 이걸 제공하는 것이 `flatMap`이다.

````swift
func f(_ t: T) -> Optional<U> {
    // ...
}

func g(_ u: U) -> Optional<V> {
    // ...
}

let result = Optional(3)
              .flatMap(f) // Optional<T> -> Optional<U>의 함수로 확장
              .flatMap(g) // Optional<U> -> Optional<V>의 함수로 확장
````

* `lift`의 변환함수로 `Optional`이 리턴되는 함수를 넣었으나, 결과는 flat해서 나왔다.
* 이 동작을 엮어서 제공하는 것이 `flatMap`이다.
* `flat o lift`, 두 함수를 합성한 것을 기본 제공하는 것이 `flatMap`이다.

````
f: T -> M<U>
g: U -> M<V>

lift(g): M<U> -> M<M<V>>
flat o (lift(g)): M<U> -> M<V> // 어떠한 방식으로 합성하면~
(flat o (lift(g))) o f: T -> M<V> // 어떠한 방식으로 합성하면~

결론: flatLift(f) = flat o (lift(f))
````

* 정확히 위 계산이 어떠한 결과를 가져다 줄 것이라 생각하지말고, 이런 식으로 합성이 가능하다는 것을 알아두자.
* o에 대응되는 어떠한 합성 연산을 내가 잘 구현하면, 위 처럼 `gf`함수를 직접 만들지 않고,
* 모나드의 특성을 사용해서 합성할 수 있다.

### flatLift

#### 전역함수로 구현

````swift
func flat<T>(_ value: Optional<Optional<T>>) -> Optional<T> {
    switch value {
        case .none:
            return .none
        case .some(let wrapped):
            return wrapped
    }
}

func lift<T, U>(_ transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
    return { (input: Optional<T>) -> Optional<U> in
        switch input {
            case .none:
                return .none
            case .some(let wrapped):
                return .some(transform(wrapped))
        }
    }
}

func flatLift<T, U>(_ transform: @escaping (T) -> Optional<U>) -> ((Optional<T>) -> Optional<U>) {
    return { (input: Optional<T>) -> Optional<U> in
        flat(
            lift(transform) // Optional<T> -> Optional<Optional<U>>
                (input) // Optional<Optional<U>>
        ) // Optional<U>
    }
}

// 다시 쓰면,

func flatLift<T, U>(_ transform: @escaping (T) -> Optional<U>) -> ((Optional<T>) -> Optional<U>) {
    { input in
        flat(lift(transform)(input))
    }
}
````

#### Extension으로 구현

````swift
internal enum Optional<T> {
    case none
    case some(T)
}

extension Optional {

    internal func flat<T>(_ oot: Optional<Optional<T>>) -> Optional<T> {
        switch oot {
        case .none:
            return .none
        case .some(let ot):
            return ot
        }
    }

    internal func lift<T, U>(_ transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
        { input in
            switch input {
            case .none:
                return .none
            case .some(let wrapped):
                return .some(transform(wrapped))
            }
        }
    }

    internal func flatLift<T, U>(_ transform: @escaping (T) -> Optional<U>) -> ((Optional<T>) -> Optional<U>) {
        { input in
            flat(lift(transform)(input))
        }
    }
}
````

## High-Demensional lift with FlatLift

* 그럼 `lift`처럼 `flatLift`은 다변수함수에 적용할 수 있는가?
* 당연히 된다.
* `flatLift`가 `lift`에서보다 다변수 함수에서 보다 더 유용하다.
* 이는 당연히 `flat`할 수 있기 때문이다.

````
flatLift2d: ((T, U) -> M<V>) -> ((M<T>, M<U>) -> M<V>)
````

* `lift`의 경우 차원 확장시, 변수 개수에 따라 반환 타입의 제네릭이 중첩되었지만,
* `flatLift`의 경우 차원 확장시, 변수 개수에 따라 반환 타입의 제네릭이 중첩되지 않는다.
* 이는 엄청나게 자주 사용되는데, 그 때문에 일부 언어에서는 이를 위한 축약 표기를 제공할 정도이다.
  * `do`(Haskell), `for`(Scala)

# flatLift2d

* 앞에서 차원 확장으로 고생을 다 했기 때문에 얘는 쉽다!

````swift
func lift<T, U>(_ transform: @escaping (T) -> U) -> (T?) -> U? {
    { input in
        switch input {
        case .none:
            return .none
        case .some(let wrapped):
            return .some(transform(wrapped))
        }
    }
}

func flat<T>(_ value: T??) -> T? {
    switch value {
    case .none:
        return .none
    case .some(let wrapped):
        return wrapped
    }
}

func flatLift<T, U>(_ transform: @escaping (T) -> U?) -> (T?) -> U? {
    { input in
        flat(lift(transform)(input))
    }
}

func flatLift2d<T1, T2, U>(_ transform: @escaping (T1, T2) -> U?) -> (T1?, T2?) -> U? {
    { mt1, mt2 in
        flat(lift { t1 in
            flat(lift { t2 in
                transform(t1, t2)
            }(mt2))
        }(mt1))
    }
}

func flatLift2d<T1, T2, U>(_ transform: @escaping (T1, T2) -> U?) -> (T1?, T2?) -> U? {
    { mt1, mt2 in
        flatLift { t1 in
            flatLift { t2 in
                transform(t1, t2)
            }(mt2)
        }(mt1)
    }
}

func flatLift3d<T1, T2, T3, U>(_ transform: @escaping (T1, T2, T3) -> U?) -> (T1?, T2?, T3?) -> U? {
    { mt1, mt2, mt3 in
        flatLift { t1 in
            flatLift { t2 in
                flatLift { t3 in
                    transform(t1, t2, t3)
                }(mt3)
            }(mt2)
        }(mt1)
    }
}
````

# flatLift에 값 넣어보기

## Optional

* 임의의 함수 f가 다음과 같이 정의되었다고 하자.
* `f: (T, U) -> Optional<V>`

````swift
let opt: Optional<T>
let opu: Optional<U>
lift2d(f)(opt, opu)
flatLift2d(f)(opt, opu)
````

![](AllAboutMonad_04_WhyMonadPart01_0.png)

* 자, `lift`를 만약에 걸었다면 위과 같은 결과가 나왔을 것이다.

![](AllAboutMonad_04_WhyMonadPart01_1.png)

* `flatLift`를 사용하면 이렇게 된다.
* 둘다 값이 있는 경우만 제대로 떨어지고, 그렇지 않으면 빈 옵셔널이 나온다.
* 나머지 경우를 하나의 타입으로 압축해서 결과를 얻을 수 있다는 장점이 있다.
* 3차원이면 아마 정육면체의 형태로 모양이 나오고, 한 셀을 제외한 나머지가 none으로 떨어질 것이다.

## List

* 임의의 함수 f가 다음과 같이 정의되었다고 하자.
* `f: (T, U) -> [V]`

````swift
let left = [t1, t2, t3]
let right = [u1, u2]
lift2d(f)(left, right)
flatLift2d(f)(left, right)
````

* `lift2d`를 걸면 이렇게 나온다.

````
[
  [f(t1, u1), f(t1, u2)],
  [f(t2, u1), f(t2, u2)],
  [f(t3, u1), f(t3, u2)]
]
````

* `flatLift2d`를 걸면 이렇게 나온다.

````
[
  f(t1, u1),
  f(t1, u2),
  f(t2, u1),
  f(t2, u2),
  f(t3, u1),
  f(t3, u2)
]
````

# 그래서 flatLift는?

 > 
 > flatLift: \`((T1, T2...) -> M<U>) -> ((M<T1>, M<T2>...) -> M<U>)로 변환해주는 함수

* `((T1, T2...) -> U)`로 변환함수가 들어오면?
  * 그것도 위의 형태로 만들 수 있다.
  * 리턴할 때 U에 `unit`함수 걸어주면 된다.

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
