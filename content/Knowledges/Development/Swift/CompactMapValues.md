---
title: CompactMapValues
thumbnail: ''
draft: false
tags:
- swift
- Dictionary
- compactMap
- compactMapValues
created: 2023-09-30
---

dictionary에 value를 넣는데 nil인 경우는 빼고 싶다. 깔끔한 방법이 없을까?

# compactMapValues

````swift
func compactMapValues<T>(_ transform: (Value) throws -> T?) rethrows -> Dictionary<Key, T>
````

* 일단 이름이 직관적이다. 
* compactMap의 경우 특정 array에 대해 변환 결과중 nil을 제외한 것들을 반환해준다.
* 이를 value에 적용한다고 보면 될 것 같다.

# 예제

````swift
let data = ["a": "1", "b": "three", "c": "///4///"]

let m: [String: Int?] = data.mapValues { str in Int(str) }
// ["a": Optional(1), "b": nil, "c": nil]

let c: [String: Int] = data.compactMapValues { str in Int(str) }
// ["a": 1]
````

# Reference

* [compactMapValues](https://developer.apple.com/documentation/swift/dictionary/compactmapvalues(_:))
