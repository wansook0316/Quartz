---
title: Collection
thumbnail: ''
draft: false
tags:
- swift
- collection
- Array
- Set
- Dictionary
created: 2023-09-30
---

* Value Type
  * 다른 변수에 대입하면 복사됨
  * argument로 넘겨도 복사됨
  * argument로 collection을 넘겨서 변화주면 원하는 결과를 얻을 수 없음
    * Objective-C의 경우 가능

# Array

* 동일한 Type의 값을 저장할 수 있는 Ordered List
* 동일한 값이 다른 위치에서 반복적으로 낭로 수 있음
* Foundation의 NSArray와 bridge
* 표현
  ````swift
  let array: Array<SomeType>()
  let array: [SomeType]
  
  let array = [Int]()
  let array = Array<Int>()
  ````

* 접근
  ````swift
  array[0] = "A"
  array[1..3] = ["a", "b", "c"]
  ````

# Set

* 동일한 type의 값을 저장할 수 있는 Collection
* 동일 값 존재 불가
* Foundation의 NSSet과 bridge
* 표현
  ````swift
  let someSet: Set<Int>()
  let genres: Set<String> = ["Rock", "Classic", "Hip hop"]
  ````
  
  * type 명시가 없다면 array로 유추됨
* Element
  * Element는 Hashable type이어야 함
  * 기본적인 type(String, int, Double, Bool)은 Hashable
  * Custom type을 Set에서 사용하려면 Hashable protocol 만족해야함
  * Hashable
    * `public func hash(into hasher: inout Hasher)`
    * 어떤 value에 hashValue를 제공해서 value의 동일성을 검충하는데 사용
    * value(struct)의 모든 값을 비교하는 것보다 빠름

# Dictionary

* key, value의 쌍을 저장하는 collection
* key, value는 각각 type이 지정되어야 함
* key는 dictionary안에서 unique하며, value의 identifier로 동작
* key는 hashable
* **순서 없이 저장한다.**
* 표현
  ````swift
  let a: Dictionary<KeyType, ValueType>
  let b: [KeyType: ValueType]
  
  a = Dictionary<Int: String>()
  b = [Int: String]()
  var airports: [String, String] = ["XYZ": "Toronto", "DUB": "Dublin"]
  var airports = ["XYZ": "Toronto", "DUB": "Dublin"]
  ````

* 메서드
  * updateValue
  * removeValue
