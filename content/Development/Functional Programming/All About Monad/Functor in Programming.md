---
title: Functor in Programming
thumbnail: ''
draft: false
tags:
- functor
- type-constructor
- Result
- functional-programming
- Optional
- generic
created: 2023-09-18
---

Functor란 무엇인가?

# Functor

 > 
 > Functor: 임의의 타입 `T, U`가 주어졌을 때, 연산 lift이 정의되는 [Type Constructor](Type%20Constructor.md) `F` 
 > 
 > lift: `(T -> U) -> (F(<T>) -> F(<U>))`

* `T->U`인 함수가 있을 때, 각각의 원소를 [Type Constructor](Type%20Constructor.md) `F`로 감싸는 함수로 변환할 수 있으면 Functor
* 여기서 `(T->U)`로 가는 건 내부에 들어간 값을 **변형** 하는 것이다. 이제부터 이걸 `transform`이라 부르겠다.
* 대입해서 생각해보자.

## Optional

````swift
internal func lift<T, U>(_ transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
    return { (input: Optional<T>) -> Optional<U> in
        switch input {
        case .none:
            return .none
        case .some(let wrapped):
            return .some(transform(wrapped))
        }
    }
}
````

* `transform`을 인자로 받아 `Optional<T>`를 인자로 받아 `Optional<U>`를 반환하는 함수를 반환한다.
* 이게 명확히 정의되니 `Optional`은 Functor이다.

## Array

````swift
internal func lift<T, U>(_ transform: @escaping (T) -> U) -> ([T]) -> [U] {
    return { (input: [T]) -> [U] in
        var result: [U] = []
        for index in input.indices {
            result.append(transform(input[index]))
        }
        return result
    }
}
````

## Result

````swift
internal func lift<T, U>(_ transform: @escaping (T) -> U) -> (Result<T, Error>) -> Result<U, Error> {
    return { (input: Result<T, Error>) -> Result<U, Error> in
        switch input {
        case .failure(let error):
            return .failure(error)
        case .success(let value):
            return .success(transform(value))
        }
    }
}
````

## 보통의 표현 방법

* 보통은 저렇게 `<T, U>`를 직접 선언해두지 않고, 타입 내에서 결과 타입만 가지고 있을 수 있게 안에서 구현한다.
* 모든 Functor에 대응되는 자료구조가 다 저 구현체를 갖고 있지는 않으며, `Array`, `Set`과 같이 `Sequence`로 묶이는 경우에는 상위 타입의 프로토콜이나 클래스에서 구현해둔다.
* 이 부분은 언어마다 구현이 달라 개념적으로 이해하는 것이 좋을 듯.

````swift
internal enum Optional<Wrapped> {
    case none
    case some(Wrapped)
    
    func map<U>(_ transform: (Wrapped) throws -> U) rethrows -> U? {
        switch self {
        case .none:
            return .none
        case .some(let wrapped):
            return try .some(transform(wrapped))
        }
    }
}
````

* 보통 `lift`라 구현 안되어 있고 `map`으로 되어 있다.

## 어떻게 Functor를 구현할까?

* 이제 위에서 대표적인 Type Constructor들이 Functor임을 알았다.
* 즉, `Optional`, `Array`, `Result`는 Functor이다.
* 그렇다면 보통 우리는 이걸 어떻게 구현할까?
* `Functor`라는 프로토콜을 만들든, 클래스를 만들든 한 다음에 이걸 상속하게 해서 기본 동작을 제공할 것이다.

![AllAboutMonad_01_FunctorInProgramming_0](AllAboutMonad_01_FunctorInProgramming_0.png)

* 그런데 Swift에서 보았을 때는 완전히 이런 개념도로 구현된 것 같지는 않다.
* `Set`, `Array`같은 경우는 `Sequence` Protocol을 상속받아 처리되고,
* `Optional`의 경우에는 자체적으로 가지고 있다.
* 왜 이렇게 처리했는지는 추가적으로 알아봐야 할 듯.

## Functor lift 함수의 추가 조건

* 앞에서 어려울까봐 안적었다.
* lift 함수는 `T->U`로 가는 함수를 받아 `F(T)`를 받아 `F(U)`를 반환하는 함수를 반환한다.
* 이 lift 함수가 만족해야 하는 두가지 조건이 있다.

### 함수의 항등성

````
id_T = (T -> T)
id_F<T> = (F(T) -> F(T))

lift = (X -> Y) -> (F<X> -> F<Y>)

lift(id_T) = id_F<T>
````

* 항등함수를 id라 하자. (identity)
* `T->T`인 항등함수는 `id_T`라고 표현할 수 있다.
* `F(T)->F(T)`인 항등함수는 `id_F<T>`라고 표현할 수 있다.
* lift 이라는 함수는 `(X -> Y) -> (F<X> -> F<Y>)` 라고 표현할 수 있는데, 이 연산의 결과는 뭐가 나올지 모른다.
* 그런데 lift의 인자로 항등함수를 넣었다면, 결과 역시 항등함수가 나와야 한다는 것이다.
* 사실 형태만 봐서는 자명하게 그런 것 같으나, 수학적으로 엄밀하게 정의하기 위한 것에 가깝다.
* (그래서 가장 밑에 넣었다.)

### 함수의 합성 관계 보존

````
f = (T -> U)
g = (U -> V)

lift = (X -> Y) -> (F<X> -> F<Y>)

h = g∘f
lift(h) = lift(g∘f) = lift(g)∘lift(f)

즉, 
lift(g∘f) = lift(g)∘lift(f)
````

* 함수 `h`가 `g`와 `f`의 합성이라고 한다면,
* 이 `h`를 `lift`한 결과 역시 `g`와 `f`를 `lift`한 결과의 합성과 같다. (`lift(g)∘lift(f)`)

````swift
func f(_ x: Int) -> Int {
    return x + 1
}

func g(_ x: Int) -> Int {
    return x * 2
}

func h(_ x: Int) -> Int {
    return g(f(x))
}

let optional = Optional.some(10)
let result1 = lift({ h($0) })(optional) // Optional.some(22)
let result2 = lift({ g($0) })(lift({ f($0) })(optional)) // Optional.some(22)

let array = [3, 4, 5, 6]
    let result1 = lift({ h($0) })(array) // [8, 10, 12, 14]
    let result2 = lift({ g($0) })(lift({ f($0) })(array)) // [8, 10, 12, 14]

let result: Result<Int, Error> = .success(10)
let result1 = lift({ h($0) })(result) // success(22)
let result2 = lift({ g($0) })(lift({ f($0) })(result)) // success(22)

````

* 이것도 엄밀한 증명은 못하겠지만 경험적으로 참임을 어렵지 않게 알 수 있다.
* (그래서 가장 밑에 넣었다.)

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
