---
title: Monad in programming
thumbnail: ''
draft: false
tags:
- monad
- unit
- lift
- functional-programming
created: 2023-09-18
---

Monad는 어떻게 정의할 수 있을까?

# Monad

 > 
 > Monad: 다음의 연산들이 정의된 Functor
 > 
 > unit: `T -> M<T>` (`return` in Haskell)
 > 
 > flat: `M<M<T>> -> M<T>` (`join` in Haskell)

* Functor에 `unit`하고 `flat`추가한게 모나드다.
* 직관적으로만 이해하고, `unit`, `flat`이 어떤 조건을 만족해야 하는지는 가장 아래에서 알아보자.

# Monad 함수의 추가 조건

* `unit`, `flat` 함수가 가져야할 추가 조건에 대해 설명한다.

## Naturality for unit.

![](AllAboutMonad_03_MonadInProgramming_0.png)

* `T->U`로 가는 함수를 `f`라고 정의해보자.
* `lift`함수에 `f`를 인자로 넣어서 나오는 반환 값의 타입은 `M<T> -> M<U>`이다.
* 그렇다면 이 반환 함수에 `M<T>`를 인자로 넣어서 나오는 반환 값의 타입은 `M<U>`이다.

![](AllAboutMonad_03_MonadInProgramming_1.png)

* 자연성을 만족한다는 말은,  ([Natural Transformation](Natural%20Transformation.md))
* `f`를 적용한 후 `unit`함수를 적용한 것과
* `unit`함수를 통해 `M<T>`를 `M<U>`로 바꾸고, `f`를 적용한 것이 같다는 말이다.

## Naturality for flat

 > 
 > naturality for flat.

![](AllAboutMonad_03_MonadInProgramming_2.png)

* 마찬가지로 `T->U`로 가는 함수를 `f`라고 정의해보자.
* `lift`함수에 `f`를 인자로 넣어서 나오는 반환 값의 타입은 `M<T> -> M<U>`이다.
* 당연히 `M<T>`를 위 함수에 넣으면 반환값은 `M<U>`이다.
* `M<M<T>>`를 `M<M<U>>`로 바꾸려면 `lift(lift(f))`를 적용해야 한다.

![](AllAboutMonad_03_MonadInProgramming_3.png)

* 자연성을 만족한다는 말은,
* `lift(lift(f))`를 적용한 후 `flat`함수를 적용한 것과
* `flat` 함수를 적용하고 `lift(f)`를 적용한 것이 같다는 말이다.

## [Identity](Identity.md)

![](AllAboutMonad_03_MonadInProgramming_4.png)

* `M<T>`를 `M<M<T>>`로 바꾸는 방법은 두개가 있다.
* `unit`을 적용하거나, `lift(unit)`을 적용하거나.
  * 지금 생각해보니 `unit`이라는 함수의 이름이 이 때문인 듯 하다.
  * `lift`를 여러번 적용했을 때의 함수와 `unit`을 적용했을 때의 함수가 같다.
  * 타입이 한꺼풀 싸져있는 것으로 보이지만, Generic이기 때문에 어떤 타입도 들어갈 수 있기 때문에 구조적으로 같다.
* `unit`을 적용한다는 것은 `M<T>` 타입 자체에 함수 동작을 걸어버리는 것이고,
* `lift(unit)`을 적용한다는 것은 `T`타입에 `unit`함수를 적용한다는 가정을 한 상황에서 `lift`를 통해 한차원 높인 상태의 함수를 만들고 적용한다고 생각할 수 있겠다.

![](AllAboutMonad_03_MonadInProgramming_5.png)

* 이렇게 나온 `M<M<T>>`에 `flat`함수를 걸었을 때 결과는 `M<T>`로 나와야 한다는 것이 항등성([Identity](Identity.md))이다.
* 즉, 왼쪽과 오른쪽의 두식의 결과는 항등함수로 나와야 하며, 그 결과는 같아야 한다.

# Associativity

![](AllAboutMonad_03_MonadInProgramming_6.png)

* `M<M<M<T>>>`를 `M<M<T>>`로 바꾸는 방법은 두개가 있다.
* `flat`을 적용하거나, `lift(flat)`을 적용하거나.
* 이 순서를 바꿔서 연산하면 결과값은 다를 수 있다.

![](AllAboutMonad_03_MonadInProgramming_7.png)

* 하지만 그 결과를 다시한번 flat으로 내렸을 때 나오는 결과는 **반드시** 같아야 한다.

# 위 내용이 의미하는 바

## Semantics in Naturality

![](AllAboutMonad_03_MonadInProgramming_8.png)

* `T->U`로 보내는 함수들의 집합을 하나 생각해보자.
* `T`, `U`는 제네릭으로 표현되었으니, 하나하나 구체 타입을 넣어보면 원소들이 있는 공간이 떠오를 것이다.
* 마찬가지로 `M<T>->M<U>`로 보내는 함수들의 집합도 생각해보자.
* 아마 수도없이 많을 것이다.
* 그리고 이 사상관계의 로직도 수도없이 많을 것이다.
  * `Double->String`으로 가는 함수 원소의 개수도 엄청많은데, 사실 그 변형 함수 로직의 다양성까지 포함해야한다.
  * 그렇다면 이 집합은 무한집합일 것이다.

![](AllAboutMonad_03_MonadInProgramming_9.png)

* 이 모든 원소를 예를 들면서 설명할 수 없으니,
* `T->U`로 가는 함수 원소를 대표할 수 있게 위와 같이 그림을 그려보았다.
* 함수의 형태에 따라 원소 개수가 늘어난다 했으니 이 역시도 `f`와 같은 형태로 변수로 표현했다.
* 이렇게 왼쪽 집합이 정의 된다면, Monad는 일단 Functor니까 오른쪽 집합도 당연히 정의될 수 있다.
* 이 때 변환에 대응되는 것은 `lift(f)`이다.

![](AllAboutMonad_03_MonadInProgramming_10.png)

* 각 타입은 또 그 안에 들어갈 수 있는 값들을 대표하는 집합으로 생각할 수 있다.
* 가령 `Double` 자료형은 1.0, -3000과 같은 다양한 실수값을 반영할 수 있는 집합의 개념이다.
* 이렇게 타입에 해당하는 값을 "점"의 형태로 그림에 표현했다.
* 그리고 `f`라는 변환은 값들이 `U`의 공간에 특정 점에 매핑된다고 할 수 있다.
* 그럼 `M<T>->M<U>`에 대응되는 원소는 어떻게 그릴 수 있을까?
* 일단 원소가 있을 거라는 건 쉽게 예상할 수 있다.
* 그럼 모나드 인 경우 이 매핑관계 (`f`에 대응되는 녀석)은 무엇이 될 수 있을까?

### unit

![](AllAboutMonad_03_MonadInProgramming_11.png)

* 그 전에 먼저 Monad가 되기 위한 조건인 `unit`함수의 의미부터 알아보자.
* `unit` 함수는 함수를 원소로 갖는 두 집합 사이의 관계를 정의한다.
* 이 관계는 함수를 원소로 갖는 집합의 인자에 해당하는 타입을 모나드 타입의 원소로 연결해주는 역할을 한다.

### lift

![](AllAboutMonad_03_MonadInProgramming_12.png)

* 그렇다면 `lift`은 어떻게 도식할 수 있을까.
* `T`와 `U`사이에 `f`라는 논리적 관계가 정의되어 있다면, 
* `T`와 `U`를 `unit`한 값들 사이에서도 `lift(f)`로 표현되는 논리적 관계가 존재해야 한다.
  * 모나드가 되기 위해서는 그래야 한다.
* 이러한 관계가 말이 되기 위해서는 `unit`이라는 관계는 **값들 사이의 논리적 관계를 전부 보존하는 변환이어야 한다.**
* **즉, `T`타입을 모나드화 하는 `unit`연산의 수행 결과는, `T`의 의미를 전부 보존해야만 한다.**
* 그럴려면 값의 의미를 유지한 채 **타입만 바꾸는 변환이 아니면 불가능하다.**
* 예컨데 `Int`을 `Double`로 바꾸는 연산.
* **즉, `M<T>`는 `T` 또는 `T`와 논리적으로 동등한 개념을 지칭하는 타입이라는 것을 알 수 있다.**

### flat

![](AllAboutMonad_03_MonadInProgramming_13.png)

* `flat`은 `M<M<T>>`를 `M<T>`로 바꿔주는 연산이다.
* 이 때, 모든 논리적 관계를 보존할 필요는 없다.
  * 차원을 낮추는 행위이기 때문에 애초에 이상적으로는 불가능하다.

![](AllAboutMonad_03_MonadInProgramming_14.png)

* 하지만 `lift(lift(f))`로 표현되었던 연산의 "일부" 논리적 관계는 보존해야 한다.
  * 모나드의 정의에서 원하는게 그거다.
* 그러러면 `flat`이라는 함수는 **값의 의미를 적어도 일부는 보존한 채 `M<M<T>>`를 `M<T>`로 바꾸는 변환이 되어야 한다.**

## 의미론적 고찰의 결론

* 위에서 한 작업은 모나드의 정의를 토대로 도식화한 뒤, 그 의미를 찾아보는 과정이었다.
* 이 결과 얻어지는 의미론적 결론은 다음과 같다.

1. `M<T>`는 `T`의 의미를 확장한 의미를 가진 타입이어야 한다. (`unit`)
1. `M<M<T>>`는 어떤 의미에서는 `M<T>`와 같이 간주될 수 있어야 한다. (`flat`)

## 예시

### Optional

![](AllAboutMonad_03_MonadInProgramming_15.png)

* `T`의 의미를 확장한 `Optional`의 의미는 `T` 또는 `nil`이다. 즉, 포함한 채로 확장한 의미이다.
* `Optional<Optional<T>>`는 `Optional<T>`와 같이 간주될 수 있다.

### Array

* `T`의 의미를 확장한 `Array`의 의미는 `T`의 집합이다. 즉, 포함한 채로 확장한 의미이다.
* `Array<Array<T>>`는 `Array<T>`와 같이 간주될 수 있다.
  * **앞에서도 말했듯 완전한 정사영은 불가능하다.**
  * 차원 축소의 개념이기 때문.
  * 하지만 의미론적으로 논리적 관계는 보존할 수 있다.
  * 추가적으로 순서의 개념까지 논리적 관계를 보존하는 것이 더 정확하겠다.

# 실전적 결론

 > 
 > **모나드는 어떠한 개념에 대한 논리적 확장으로, 오직 한번만 의미있게 적용 가능한 것들을 통칭하는 개념이다.**

`M`이 Monad라면, 

1. `T`의 의미를 확장할 수 있는 방법이 정의되어 있어야 한다.
1. 같은 방법으로 재차 확장했을 경우, 다음의 의미가 있어야 한다.
   a. 의미 없거나
   b. 의미가 같거나
   c. 어떤 관점에서는 같다고 볼 수 있음

# 구현

![](AllAboutMonad_03_MonadInProgramming_16.png)

* 이상적으로는 상위 클래스 정의해서 하는 게 맞다.
* 하지만 프로그래밍 언어에 따라 이 구현은 달라진다.
* 보통 타입 내에 연산을 추가하여 (`flatMap`) 구현하는 경우가 많다.

## Optional

### unit

````swift
extension Optional {
    internal func unit(_ t: T) -> T? {
        .some(t)
    }
}
````

### flat

````swift
extension Optional {
    internal func flat<T>(_ oot: Optional<Optional<T>>) -> Optional<T> {
        switch oot {
        case .none:
            return .none
        case .some(let ot):
            return ot
        }
    }
}
````

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
* [Natural Transformation](Natural%20Transformation.md)
* [Identity](Identity.md)
