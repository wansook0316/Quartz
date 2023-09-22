---
title: Why monad part. 02
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

그래서 Monad를 왜 사용하는가?

# 왜 차원확장 flatLift는 중요할까?

* 다변수를 받아 모나드를 반환하는 함수도 합성할 수 있다.
* `f1: T1 -> M<U1>`,
* `f2: T2 -> M<U2>`,
* `g: (U1, U2) -> M<V>`
* 위 세 함수가 있다고 하자.
* 앞에서 했던 `lift2d`를 `g`에 사용해보자. (Monad는 Functor니까)

````swift
func lift2d<T, U, V>(_ transform: @escaping (T, U) -> V) -> (F<T>, F<U>) -> F<F<V>> {
    { ft, fu in
        lift { (t: T) -> V? in
            lift { (u: U) -> V in
                transform(t, u)
            }(fu)
        }(ft)
    }
}

lift2d(g) // (M<U1>, M<U2>) -> M<M<V>>
````

* 당연히 이렇게 나올 것이다.
* 이제 `f1`과 `f2`를 합성해보자.

````swift
let t1: T1 = someT1
let t2: T2 = someT2

lift2d(g)(f1(t1), f2(t2)) // M<M<V>>
````

* 이렇게 하면 f1 함수와 f2 함수를 g로 합성할 수 있게 된다.
* 그런데 이렇게 하면 `M<M<V>>`가 나온다.
* 모나드인 경우 이걸 `flat`할 수 있어, 보통 원하는 결과인 `M<V>`를 얻을 수 있다.

````swift
func flatLift2d<T1, T2, U>(_ transform: @escaping (T1, T2) -> U?) -> (T1?, T2?) -> U? {
    { mt1, mt2 in
        flatLift { t1 in
            flatLift { t2 in
                transform(t1, t2)
            }(mt2)
        }(mt1)
    }
}

flatLift2d(g)(f1(t1), f2(t2)) // M<V>
````

* 변수가 몇개이든 이런식으로 합성한 함수를 만들수 있다!

# 무엇을 의미하는가?

* 그렇다면 위처럼 연산할 수 있다는 것이 무엇이 좋은 걸까?
* `Functor`로는 다변수 함수를 합성했을 때의 결과가 타입이 중첩되어 나온다.
* 하지만 `Monad`로는 이를 `flat`할 수 있어 타입이 중첩되지 않는다.
* 이는 곧 **Monad 형태의 반환 함수로 변환함수를 다 만든다음에 프로그래밍할 수 있음을 뜻한다.**
* 즉, 변환의 결과에 "확장된 의미를 가진 타입(모나드)"로 변환하도록 만들고, 이것들 만으로 프로그래밍이 가능함을 시사한다.

# 언제 유용한가?

* 이렇게만 말하면 언제 유용한지 잘 모르겠다.
* **횡단 관심사**라는 것을 분리할 때 사용한다.

# 횡단 관심사

![](AllAboutMonad_05_WhyMonadPart02_0.png)

* 은행 관련 소프트웨어를 만든다고 생각해보자.
* 각기 세개의 기능은 다른 함수나 모듈로 분리되어 있을 것이다.
* 하지만 이 세기능을 수행하는데 있어, 같은 기능을 처리해야 하는 경우가 많다.

 > 
 > 횡단 관심사(Cross-cutting concern)는 소프트웨어 개발에서 여러 부분에서 공통적으로 발생하는 기능 또는 관심사를 나타냅니다. 이러한 관심사들은 애플리케이션의 여러 모듈이나 컴포넌트에 걸쳐서 반복적으로 발생하며, 비즈니스 로직이나 주요 기능과는 독립적으로 존재합니다. 주요 기능과 별개로 존재하는 이러한 공통적인 관심사들은 코드의 중복, 가독성 저하, 유지보수 어려움 등을 야기할 수 있습니다.

* 로깅, 캐싱, 보안, 트랜잭션 등이 횡단 관심사에 해당한다.
* 모나드가 이런 것 분리하는 용도로 제격이다.

# 횡단 관심사에 적용

* 방법은 간단하다.
* 횡단 관심사에 해당하는 모든 함수의 반환형을 모나드 타입으로 반환하는 함수로 바꾸면 된다.
* 그렇게 되면 이 다음 함수를 처리할 때 "무조건 `flatLift`를 호출"해야 한다.
* 끝이다.

````swift
func withdraw(_ money: Int?) -> Int? {
    guard let money = money else {
        self.error()
        return nil
    }
    return money
}

func deposit(_ money: Int?) -> Int? {
    guard let money = money else {
        self.error()
        return nil
    }
    return money
}

func error() -> String {
    return "error"
}

let money = Optional(1000)
withdraw(money) // Optional(1000)
````

* 이렇게 만들면 `money`가 값이 없을 때 처리를 함수 내에서 처리해야 한다.
* `withdraw`, `deposit`모두 같은 동작을 처리해야 한다면, 이를 함수로 만들고 일일히 호출해줘야 한다.

````swift
func withdraw(_ money: Int) -> Int? {
    return money
}

func deposit(_ money: Int) -> Int? {
    return money
}

let result = Optional(1000).flatMap(withdraw) // Optional(1000)

switch result {
    case .none:
        error()
    case .some(let money):
        // some action
}
````

* Monad를 사용하면 이런 공통의 에러처리를 함수밖으로 분리할 수 있게 된다.
* 이렇게 되면 다른 모듈에서 사용하는 동작에서 발생하는 에러도 분리해서 관리할 수 있게 된다.

# 모나드를 동작의 확장 도구로 바라본다면.

![](AllAboutMonad_05_WhyMonadPart02_1.png)

* 지금까지는 이러한 형태만 배웠다.
* 요약하면, 변환 함수로 들어오는 함수의 입력 인자의 타입이 Monad가 아닌, 실제 타입으로 들어오는 경우를 변환하는 것만 연습했다.

![](AllAboutMonad_05_WhyMonadPart02_2.png)

* 하지만 입력으로 들어오는 인자에도 Monad가 있더라도 결과함수로 바꿀 수 있다.
* 위의 모든 변환이 가능하다.
* 고차원 Lift를 할 때 했었던 건데, 당연히 된다.

````swift
func flatLifte1<T1, T2, U>(_ transform: @escaping (T1, T2) -> U) -> (T1?, T2) -> U? {
    { mt1, t2 in
        flatLift { t1 in
            transform(t1, t2)
        }(mt1)
    }
}
````

* t1의 값이 들어올 거야.
* 들어오면 변환해.
* 그리고 이함수를 flatLift해 -> `T1? -> U?`로 바뀜
* 그 함수에 대입.

````swift
func flatLifte2<T1, T2, U>(_ transform: @escaping (T1, T2) -> U) -> (T1, T2?) -> U? {
    { t1, mt2 in
        flatLift { t2 in
            transform(t1, t2)
        }(mt2)
    }
}

func flatLifte3<T1, T2, U>(_ transform: @escaping (T1?, T2) -> U) -> (T1?, T2?) -> U? {
    { mt1, mt2 in
        flatLift { t1 in
            flatLift { t2 in
                transform(t1, t2)
            }(mt2)
        }(mt1)
    }
}

func flatLifte4<T1, T2, U>(_ transform: @escaping (T1, T2?) -> U) -> (T1?, T2?) -> U? {
    { mt1, mt2 in
        flatLift { t1 in
            flatLift { t2 in
                transform(t1, t2)
            }(mt2)
        }(mt1)
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
````

* e3, e4, 2d는 구현이 완전히 같은 것을 볼 수 있다.
* 결과적으로 모나드 타입간의 함수로 변환할 수 없는 함수가 없다.

![](AllAboutMonad_05_WhyMonadPart02_3.png)

* 다만 주의할 점이 있다.
* 타입만으로보면 두 경로를 통한 결과가 같아보이나, 다를 수 있다는 점이다.
* 힘을 경로적분시 어떤 경로를 선택하냐에 관계없이 결과가 같다면 보존력(ex: 중력)이라 하고,
* 그렇지 않은 것을 비보존력이라 했었다.
* `flatLift` 연산의 경우 비보존력과 같은 특징을 갖는다 이해하면 되겠다.

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
