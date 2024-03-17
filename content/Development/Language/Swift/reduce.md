---
title: reduce
thumbnail: ''
draft: false
tags:
- swift
- reduce
- functional-programming
- inout
created: 2023-09-30
---

오늘은 작업 중 내가 모르는 코드를 발견해서 글을 써본다. reduce! `reduce(::)` 형태만 봐왔었는데 `reduce(into::)` 형태도 있더라! 알아보자.

# reduce(*:*:)

 > 
 > Returns the result of combining the elements of the sequence using the given closure.
 > 주어진 클로저를 사용하여 시퀀스의 요소를 조합한 결과를 반환합니다.

````swift
func reduce<Result>(_ initialResult: Result, _ nextPartialResult: (Result, Element) throws -> Result) rethrows -> Result
````

* intialResult
  * 초기값이다. 수열에서 첫째항이라고 생각하면 되겠다.
* nextPartialResult
  * 이전의 결과값, 그리고 Sequence에서 다음 값을 input으로 갖는 클로저를 작성하는 곳이다.

## 예제

````swift
let numbers = [1, 2, 3, 4]
let numberSum = numbers.reduce(0, { x, y in
    x + y
})
// numberSum == 10
````

* 처음에는 x에 0이 들어오고, y에 1이 들어온다.
* 다음에는 더한 결과인 x에 1이 들어오고 y에는 2가 들어온다.
* 이와 같은 방식으로 sequence의 끝까지 달린다.
* 당연하게도 시간복잡도는 `O(n)`이다.

# reduce(into:\_:)

 > 
 > This method is preferred over reduce(::) for efficiency when the result is a copy-on-write type, for example an Array or a Dictionary.
 > 결과가 copy-on-write인, 즉 Array, Dictionary와 같은 녀석, 친구들일 때 좋은 메서드!

````swift
func reduce<Result>(into initialResult: Result, _ updateAccumulatingResult: (inout Result, Element) throws -> ()) rethrows -> Result
````

* initialResult
  * 초기값
* updateAccumulatingResult
  * sequence의 원소를 가지고 값을 업데이트하는 클로저
  * **핵심은 `inout`!!!**

여기서 위의 `reduce(_:_:)`와 `reduce(into:_:)`의 차이점이 보인다. 후자의 경우 클로저 변수로 `inout` 키워드가 붙어있는 정보가 들어온다. 무슨 차이일까?

inout 키워드가 어렵다면, [해당 포스팅](https://velog.io/@wansook0316/Clousure-%EA%B9%8A%EA%B2%8C-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0Capture-list-escaping-autoclosure)을 읽고 오자. 간단하게 얘기하면, 일단 기본적으로 closure의 인자로 들어간 변수는 copy된다. 따라서 closure 내부에서 값을 변경하더라도, 해당 클로저 외부의 변수는 변함이 없다. (Immutable)

하지만 `inout` 키워드를 사용할 경우, 외부에서 넣어준 변수 주소 그대로 반영하기 때문에, 함수 내부에서 값을 조작했을 경우, 해당 결과가 그대로 남아있다. (Mutable)

그렇다면 어떤 경우를 생각하고 만든 것이냐! 바로 **초기값이 배열, 딕셔너리로 들어온 경우, 해당 배열자체에 값을 변경해주고 싶을 때 사용**한다. 말이 어렵다. 예로 알아보자!

## 예제

````swift
let letters = "abracadabra"
let letterCount = letters.reduce(into: [:]) { counts, letter in
    counts[letter, default: 0] += 1
}
// letterCount == ["a": 5, "b": 2, "r": 2, "c": 1, "d": 1]
````

이 예제는, 특정 문자열 안에서 개수를 파악하기 위한 코드이다. 초기값이 dictionary로 들어갔고, 해당 초기값 자체를 직접적으로 변경한 결과를 얻고 싶어한다. 만약 이 상황에서 `reduce(into:_:)` 를 사용하지 않았다면 어떨까? For 문을 돌든, ForEach로 돌든 결국 돌아서 처리하는 방법으로 했을 것이다.

# 정리

핵심은 `inout`이다! **초기값으로 넘기는 인자자체에 무언가 변형을 가할 수 있도록 하여 최종 결과를 얻고 싶다**면 `reduce(into:_:)` 를 사용하면 된다. 특히 그 초기값이 딕셔너리, 배열인 경우가 유용하겠다. 아무래도 특정 값인 경우는 클로저가 기본적으로 순수함수이기 때문에 사용할 일이 없으니까.

# Reference

* [reduce(*:*:)](https://developer.apple.com/documentation/swift/array/2298686-reduce)
* [reduce(into:\_:)](https://developer.apple.com/documentation/swift/array/3126956-reduce)
* [reduce(::) vs reduce(into::)](https://velog.io/@tksrl0379/reduce-vs-reduceinto)
