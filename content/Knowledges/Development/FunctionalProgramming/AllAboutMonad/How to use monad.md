---
title: How to use monad
thumbnail: ''
draft: false
tags: null
created: 2023-09-18
---

어떻게 Monad를 사용해야 하는가?

# 사용방법

1. Monad 함수를 직접적으로 사용한다.
   * `flatLift`, `flatLift2d`
1. 언어에서 제공하는 Monad 특화된 언어를 사용한다.
   * `do`(Haskell), `for`(Scala)

## 직접 사용

````swift
var sum = 0
for i in 1...10 {
    sum += i
}
````

* 일반적인 명령형 언어에서 for문을 도는 방법이다.
* 우리는 어떠한 동작이 반복되면, 이를 함수로 만들라고 배웠다.
* 이렇게 반복하면서 원하는 값을 갱신하는 것도 함수의 형태로 추출할 수 있지 않을까?

````swift
reapply: (Container<T>, U, (U, T) -> U) -> U
````

* 위의 동작을 분석하면 위와 같다.
* 컨테이너를 받고, 초기 상태값을 받는다.
* 그리고 이를 매핑하는 변환함수를 받은 뒤, 결과값을 리턴한다.

````swift
func reapply(_ container: [T], _ initial: U, _ transform: (T, U) -> U) -> U {
    var result = initial
    for element in container {
        result = transform(result, element)
    }
    return result
}

reapply([1, 2, 3, 4, 5], 0, {
    $0 + $1
})
````

* 이렇게 하면 변수, 반복문이 없는 상태로 같은일을 하는 코드를 작성할 수 있다.
* `repeat`(Lisp), `foldl`(Haskell), `reduce`(Swift) 등의 이름으로 불리는 함수이다.
* 고차 함수들은 다 이런 형태로 있다.
* 보통 실제 함수는 익명함수로 넘기는 경우가 많다.

````swift
let opt: T?
let opu: U?

optional.flatLift2d { (t: T, u: U) -> V? in
    // ...
} (opt, opu)
````

* `flatLift`도 이와 다르지 않다. 
* 이렇게 써놓으니, 스코프 안에는 `(T, U) -> V?`를 보내는 함수를 정의하여
* `(T?, U?) -> V?`로 바꿔주는 연산이 `flatLift2d`임을 어렵지 않게 생각할 수 있다.
  * 어댑터 역할.

````swift
let opt: [T] = [3, 7]
let opu: [U] = [2, 4, 8]

Array.flatLift2d { (t: T, u: U) -> [V] in
    List.unit { t*10 + u }
} (opt, opu) // [32, 34, 38, 72, 74, 78]
````

* 이런 동작을 보통 언어에서 `flatMap`과 같은 변종을 제공한다.

## Monad 특화된 언어의 경우

````haskell
do {
    t <- opt
    u <- opu
    f(t, u)
}
````

* Haskell의 경우 `do`를 사용한다.
* 모양이 흡사함을 알 수 있다.
* 이런 문법을 제공하는 것이 다이다.

````haskell
integra {
    y <- [0, 1]
    x <- [0, y]
    pow(x, y)
}
````

* 이렇게 다중 적분도 간단하게 표현가능하다.

````haskell
do {
    t <- opt
    unit(true)
}
````

* 그럼 이건 뭘까?
* 아래 변환 함수는 t에 대한 함수가 아니다.
* 하지만 opt가 빈 값이라면, 결과는 빈 값으로 나올 것이다.
* 값이 있다면 true가 담긴 Optional이 나올 것이다.
* 사용하지도 않는 값을 넣어, `true`가 있는 경우, 없는 경우로 바꿔서 처리하고 있다.
* 이런 것도 사용하는 경우도 있다고 한다.

# Reference

* [모나드의 모든 것](https://www.youtube.com/@antel588)
* [FunctionalProgramming](https://github.com/wansook0316/FunctionalProgramming)
