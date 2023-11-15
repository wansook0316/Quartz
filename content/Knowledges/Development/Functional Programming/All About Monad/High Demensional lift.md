---
title: High Demensional lift
thumbnail: ''
draft: false
tags:
- functor
- lift
- high-demensional-lift
- functional-programming
created: 2023-09-18
---

고차원 Lift에 대해 알아보자. (map)

# High Dimensional lift

* 앞에서 배운 `lift`은 기본적으로 1변수를 변환할 수 있는 함수이다.
* 인수가 여러개이면 어떻게 해야할까?
* 즉, `(T, U) -> V`로 정의되는 transform 함수를 `lift`으로 변환할 수 있을까?
* 앞으로 설명할 변수 이름에 대해 아래에 정리해두겠다.

````
ft = T를 감싸는 Functor, 여기서는 Optional
fu = U를 감싸는 Functor, 여기서는 Optional
f_u = u를 고정시킨 함수. T를 받아 V를 반환하는 함수
f_t = t를 고정시킨 함수. U를 받아 V를 반환하는 함수
````

# lift1

* 일단 개념이해를 위해 다음의 형태의 lift 함수부터 만들 수 있는지 확인해보자.

 > 
 > `(T, U) -> V`를 `(F<T>, U) -> F<V>`로 변환하는 lift1 함수를 만들어라.

* 쉽게 하기 위해 Functor에 해당하는 타입`F`을 Optional로 생각해보자.

````swift
internal func lift<T, U>(transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
    return { (input: Optional<T>) -> Optional<U> in
        switch input {
        case .none:
            return .none
        case .some(let wrapped):
            return .some(transform(wrapped))
        }
    }
}

func lift1<T, U, V>(transform: @escaping (T, U) -> V) -> (Optional<T>, U) -> Optional<V> {
    return { (ft: Optional<T>, u: U) in
        let f_u = { (t: T) -> V in
            transform(t, u)
        }
        return lift(transform: f_u)(ft)
    }
}
````

* `u`는 제대로 주어져 있으니, `Optional<T>`인 `ft`의 원래 알맹이를 받아 `V`를 반환하는 함수를 만들고,
* 이걸 `lift`함수에 넣어나온 결과인 `Optional<T> -> Optional<V>` 형태의 함수에 `ft`를 넣어주어 원하는 결과를 반환 받자.

# lift2

 > 
 > `(T, U) -> V`를 `(T, F<U>) -> F<V>`로 변환하는 lift2 함수를 만들어라.

* 쉽게 하기 위해 Functor에 해당하는 타입`F`을 Optional로 생각해보자.

````swift
internal func lift<T, U>(transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
    return { (input: Optional<T>) -> Optional<U> in
        switch input {
        case .none:
            return .none
        case .some(let wrapped):
            return .some(transform(wrapped))
        }
    }
}

func lift2<T, U, V>(transform: @escaping (T, U) -> V) -> (T, Optional<U>) -> Optional<V> {
    return { (t: T, fu: Optional<U>) in
        let f_t = { (u: U) -> V in
            return transform(t, u)
        }
        return lift(transform: f_t)(fu)
    }
}
````

* 마찬가지의 원리다.
* fu가 `Optional<U>`로 들어왔으니, `t`를 고정시키고 `fu`안에 있는 값인 `U`를 받아 `V`를 반환하는 변환 함수를 작성하자.
* 그리고 이 함수는 이제 `lift`에 넣을 준비가 되었으니 (Functor로 감싸져 있지 않음) 이걸 넣어 나오는 결과인
* `Optional<U> -> Optional<V>`형태의 함수에 `fu`를 넣어 `Optional<V>`형태의 값을 받는 "함수"를 반환받자.

# 2 dimentional lift

* 이제 두개를 합쳐서 다음을 풀어보자.

 > 
 > `(T, U) -> V`를 `(F<T>, F<U>) -> F<F<V>>`로 변환하는 lift2d 함수를 만들어라.

* 쉽게 하기 위해 Functor에 해당하는 타입`F`을 Optional로 생각해보자.
* 잘 생각해보면 위 문제는 `lift1`, `lift2`를 섞으면 된다. ㅋㅋ

````swift
((T, U) -> V)
      |
   lift1(적용)
      |
((F<T>, U) -> F<V>)
      |
   lift2(적용)
      |
((F<T>, F<U>) -> F<F<V>>)
````

````swift
func lift2d(T, U, V)(transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    let lift1Result = lift1(transform: transform) // 결과 타입: (Optional<T>, U) -> Optional<V>
    let lift2Result = lift2(transform: lift1Result) // 결과 타입: (Optional<T>, Optional<U>) -> Optional<V>
    return lift2Result
}

// 또는

func lift2d<T, U, V>(transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    lift2(transform: lift1(transform: transform))
}

````

# lift으로부터 바로 lift2d 만들기

* 이제 `((T, U) -> V) -> ((F<T>, F<U>) -> F<F<V>>)` 이 형태로 만들 수 있음은 알았다.
* 근데 지금은 lift1, lift2라는 함수를 사용해서 그걸 증명했을 뿐, lift을 바로 사용해서 되는 것을 확인하지는 않았다.
* 이걸 해봐야 나중에 Monad 이해가 쉽다.

 > 
 > `(T, U) -> V`를 `(F<T>, F<U>) -> F<F<V>>`로 변환하는 lift2d 함수를 만들어라. 단 lift1, lift2를 사용하지 않고 lift으로만 만들어라.

* 쉽게 하기 위해 Functor에 해당하는 타입`F`을 Optional로 생각해보자.

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

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    return { (ft: Optional<T>, fu: Optional<U>) in
        let g = { (t: T) -> Optional<V> in
            let f_t = { (u: U) -> V in
                return transform(t, u)
            }
            return lift(transform: f_t)(fu)
        }
        return lift(transform: g)(ft)
    }
}

// 또는

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    return { (ft: Optional<T>, fu: Optional<U>) in
        lift { (t: T) -> Optional<V> in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}

// 또는

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    { (ft: Optional<T>, fu: Optional<U>) in
        lift { (t: T) -> Optional<V> in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}

// 또는

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    { (ft, fu) in
        lift { (t: T) -> Optional<V> in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}

// 또는

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (Optional<T>, Optional<U>) -> Optional<Optional<V>> {
    { ft, fu in
        lift { (t: T) -> Optional<V> in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}

// 또는

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (T?, U?) -> V?? {
    { ft, fu in
        lift { (t: T) -> V? in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}
````

* 앞에서는 리턴 타입 함수의 첫번째 인자가 `Optional<T>`거나, 두번째 인자가 `Optional<U>`였기 때문에
* 둘중 하나는 Functor가 아닌 값으로 들어왔었다.
* 그랬기 때문에 값이 하나가 고정된 상황에서 Functor로 들어오는 인자를 없앤 형태의 새로운 `transform`함수를 만들어,
* 이를 `lift`에 넣어주었다. (그래야 `lift` 함수가 동작하니까.)
* 그런데 이번에는 둘다 Functor로 들어온다. 앞에서 사용한 트릭을 사용할 수 없다.
* 그래서 여기서는 다른 방법을 사용한다.
* **일단 어떠한 함수를 가정하고, 얘가 `T -> Optional<T>`로 나올거라고 가정하는 거다.**
* 그리고 그 함수내에서 다시 `U -> V`를 만들어 `lift`에 넣어주는 것이다.
* 그러면 의문이 생긴다.
* 어 아까는 `f_u`, `f_t` 함수의 리턴값이 `V`였는데 지금은 `Optional<V>`인데?
* 그러면 `lift`을 쓰면 `Optional<Optional<V>>`가 나오는데?
* 그래서 이 문제를 다시 잘보면 결과 함수의 리턴값이 `Optional<Optional<V>>`이다.
* 그럼 잘 따라 온것이 맞다.

# 3 Demensional lift

^da1b16

* 그럼 3차원도 가능하겠지?

 > 
 > `(T1, T2, T3) -> U`를 `(F<T1>, F<T2>, F<T3>) -> F<F<F<U>>>`로 변환하는 lift3d 함수를 만들어라.
 > 단 `lift`함수만 사용한다.

* 쉽게 하기 위해 Functor에 해당하는 타입`F`을 Optional로 생각해보자.

````swift
internal func lift<T, U>(transform: @escaping (T) -> U) -> (Optional<T>) -> Optional<U> {
    return { (input: Optional<T>) -> Optional<U> in
        switch input {
        case .none:
            return .none
        case .some(let wrapped):
            return .some(transform(wrapped))
        }
    }
}

func lift3d<T1, T2, T3, U>(_ transform: @escaping (T1, T2, T3) -> U) -> (T1?, T2?, T3?) -> U??? {
    { ft1, ft2, ft3 in
        lift { (t1: T1) in
            lift { (t2: T2) in
                lift { (t3: T3) in
                    transform(t1, t2, t3)
                }(ft3)
            }(ft2)
        }(ft1)
    }
}
````

* 몇차원이든 할 수 있다.

# 무슨 의미가 있는가?

 > 
 > 다변수 함수를 일변수 함수의 연속된 동작으로 처리할 수 있다.

* In general,
* for an operation on single-variable functions, O
* its dimensional-extension, O is given by

$$
O^3\_{tuv}\[f(t, u, v)\] \equiv O\_{t}\[O\_{u}\[O\_{v}\[f(t, u, v)\]*{fix\_tu}\]*{fix\_t}\]
$$

* 어렵게 적었지만 위의 연산을 수학적으로 적은 것 뿐이다.
* 그리고 우리 이런 문제 풀어본적 있다.

$$
\\int\_{0}^{1} \int\_{0}^{1} \int\_{0}^{1} x^{y^z} \ dxdydz
$$

* 이거 어떻게 풀었냐.
* x, y, z 다변수에 대한 적분이지만,
* 안에서부터 다른 변수가 **고정되어 있을 거라 가정하고 변수로 냄겨서 풀었다.**
* 이와 같은 원리로 다변수 함수에 대해 이걸 일변수 함수의 연속된 동작으로 처리해서 결과를 얻을 수 있다는 것이다.

````swift
func integrate(_ f: (Double) -> Double, _ lower: Double, _ upper: Double) -> Double {
    Array(stride(from: lower, through: upper, by: 0.1))
        .reduce(.zero) { $0 + f($1) }
}

func f_x(x: Double) -> Double {
    integrate({ (y: Double) in
        integrate({ (z: Double) in
            Double(pow(x, pow(y, z)))
        }, 0, 1)
    }, 0, 1)
}

integrate(f_x, 0, 1)
````

* `integrate`라는 1변수 함수에 대한 적분 방식을 정의하고,
* 이를 연속적으로 사용해서 다변수 함수에 대한 적분을 정의했다.
* 여기서 다변수 함수에 대해 커링까지 적용하면 `integrate` 함수를 더 깔끔하게 작성할 수 있을 것이다.

````swift
public func curry<A, B>(_ f: @escaping (A) -> B) -> (A) -> B {
    { a in f(a) }
}

public func curry<A, B, C>(_ f: @escaping (A, B) -> C) -> (A) -> (B) -> C {
    { a in { b in f(a, b) } }
}

public func curry<A, B, C, D>(_ f: @escaping (A, B, C) -> D) -> (A) -> (B) -> (C) -> D {
    { a in { b in { c in f(a, b, c) } } }
}

func f_x(x: Double) -> Double {
    curry(integrate)({ (y: Double) in
        curry(integrate)({ (z: Double) in
            Double(pow(x, pow(y, z)))
        })(0)(1)
    })(0)(1)
}
````

# 리스트에 적용

````swift
func lift<T, U>(_ transform: @escaping (T) -> U) -> ([T]) -> [U] {
    { ft in
        var result = [U]()
        ft.forEach { t in
            result.append(transform(t))
        }
        return result
    }
}

func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> ([T], [U]) -> [[V]] {
    { ft, fu in
        lift { t in
            lift { u in
                transform(t, u)
            }(fu)
        }(ft)
    }
}
````

# 왜 배웠나?

* 나중에 모나드 가면 차원 확장해서 위와 같은 처리를 해야할 때가 있다.(`flatlift`)
* 그때를 위한 연습 과정.
* 직접적으로 lift의 차원 확장은 큰 관계는 없다.

# 추가 정보

* `lift` 함수는 swift의 `map` 함수와 동일하다.

# 출력 결과

````swift
private func testOptionalLift2d() {
    let x = Optional(3)
    let y = Optional(4)

    let result = lift2d { x, y in
        x+y
    }(x, y)

    print(result) // Optional(Optional(7)
}

private func testArrayLift2d() {
    let x = [3, 4, 5, 6]
    let y = [10, 20, 30]

    let result = lift2d { x, y in
        x+y
    }(x, y)

    print(result) // [[13, 23, 33], [14, 24, 34], [15, 25, 35], [16, 26, 36]]
}

private func testResultLift2d() {
    let x: Result<Int, Error> = .success(10)
    let y: Result<Int, Error> = .success(3)

    let result = lift2d { x, y in
        x+y
    }(x, y)

    print(result) // success(Swift.Result<Swift.Int, Swift.Error>.success(13))
}

````

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
* [Lambda lifting](https://en.wikipedia.org/wiki/Lambda_lifting)
