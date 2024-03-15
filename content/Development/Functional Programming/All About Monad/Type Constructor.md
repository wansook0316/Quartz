---
title: Type Constructor
thumbnail: ''
draft: false
tags:
- type-constructor
- generic
created: 2023-11-14
---

# Type Constructor

* 새로운 데이터 타입을 만드는 틀.
* A라는 진짜 데이터가 있을 때, 이 값을 유지하면서 감쌀 수 있는 논리적 구조.
* 감싼다는 측면에서 바라보았을 때 이 정의에 부합하는 녀석들은 이런 것들이 있을 수 있겠다.
  * `Optional`
  * `Array`
  * `Dictionary`
  * `Set`
  * `Result`
  * `Either`
  * `Future`
  * `Promise`
* 그런데 그 "특정" 이라는 단어 자체가 임의의 값을 받을 수 있다는 것을 내포하고 있기 때문에 [Generic](Development/Object%20Oriented%20Programming/Generic.md)으로 표현하는 것이 더 적합하다.
  * `Optional<T>`
  * `Array<T>`
  * `Dictionary<T, U>`
  * `Set<T>`
  * `Result<T, E>`
  * `Either<T, U>`
  * `Future<T>`
  * `Promise<T>`
* 이 외에도 위의 예시처럼 `Stack<T>`이라는 타입을 [Generic](Development/Object%20Oriented%20Programming/Generic.md)으로 만들고 값을 감쌀 수 있다면 이는 Type Constructor이다.
