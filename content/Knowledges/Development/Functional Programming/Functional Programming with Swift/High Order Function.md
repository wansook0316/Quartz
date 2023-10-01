---
title: High Order Function
thumbnail: ''
draft: false
tags:
- functional-programming
- swift
- compactMap
- compactMapValues
- high-order-function
created: 2023-10-01
---

자주 사용하는 고차함수들에 대해서 이해해보자.map, flatMap과 같은 경우는 여러가지가 존재하는데, 각각의 활용 방법에 대해서 알아보자.

# Documentation 확인

* [Sequence](https://developer.apple.com/documentation/swift/sequence)
  * [forEach](https://developer.apple.com/documentation/swift/sequence/3018369-foreach)
  * [filter](https://developer.apple.com/documentation/swift/sequence/3018365-filter)
  * [reduce](https://developer.apple.com/documentation/swift/sequence/2907677-reduce)
  * [map](https://developer.apple.com/documentation/swift/sequence/3018373-map)
  * [flatMap](https://developer.apple.com/documentation/swift/sequence/2905332-flatmap)
  * [compactMap](https://developer.apple.com/documentation/swift/sequence/2950916-compactmap)
  * [compactMapValues](https://developer.apple.com/documentation/swift/dictionary/3081323-compactmapvalues)
* [Optional](https://developer.apple.com/documentation/swift/optional/)
  * [map](https://developer.apple.com/documentation/swift/optional/1539476-map)
  * [flatMap](https://developer.apple.com/documentation/swift/optional/1540500-flatmap)

# forEach

* [forEach](https://developer.apple.com/documentation/swift/sequence/3018369-foreach)
* for-in loop와 유사한 동작
* 
  ````swift
  for each in [1, 2, 3] {
      if each == 2 {
          break // for-in문의 경우 break 가능
      }
      print(each)
  }
  
  // forEach의 경우 break 불가능
  [1, 2, 3].forEach { (each: int) in
      print(each)
  }
  ````

* 어떻게에 집중되어 있는 for in문은, 특정 컬렉션의 값을 변경할 때 로직을 변경해주어야 함
* 하지만 forEach를 사용하면 동작을 교체하여 적용할 수 있다는 점에서 보다 간결함

# filter

* [filter](https://developer.apple.com/documentation/swift/sequence/3018365-filter)
* 특정 조건을 충족하는 element들을 filtering하기 위해 사용

# reduce

* [reduce](https://developer.apple.com/documentation/swift/sequence/2907677-reduce)
* Element들을 이용하여 최종 결과 하나를 만들기 위해 사용
* Summation에서 자주 사용

# map

* [map: Sequence](https://developer.apple.com/documentation/swift/sequence/3018373-map)
* [map: Optional](https://developer.apple.com/documentation/swift/optional/1539476-map)
* Element를 Transform을 이용하여 다른 Type의 Element로 변환
* **Optional도 Map Function을 가짐**
* **값이 존재할 때 실행**
  * 예시
  * Optional의 값이 있는 경우 map안의 함수를 실행
  * 
    ````Swift
      let tempName: String? = "wansik"
      let checker: (String) -> String? = { name in
          if name == "wansik" {
              return "nice"
          }
          return nil
      }
    
      let result = tempName.map(checker)
      print(result) // if "wansik": Optional(Optional("nice")), else: Optional(nil)
    ````
  
  * `tempName`이 Optional인 경우 map 구문이 실행되지 않고 결과가 nil이다.
  * 하지만 Optional이 아니고 wansik이 들어갔을 때, Optional Map의 경우 원래 context에 wrapping하여 결과를 반환하여 Optional이 중첩된다.
  * 만약 wansik이 아닌 다른 값이 들어갔을 때 역시 `Optional(nil)`로 반환된다.
  * 이러한 부분이 상당히 불편하다. 이런 불편함은 flatmap을 활용하여 해결이 가능하다.
* 용어
* Context
  * Collection, Optional과 같이 어떤 Value를 포함하는 자료형
* Value
  * Context안에 들어있는 실제 값
* Transform
  * 어떤 Value를 다른 Value로 사상하는 function
* [Functor (함자)](https://ko.wikipedia.org/wiki/함자_(수학))
  * Value를 가지는 Context가 Map function을 이용한 Transform을 지원하는 것

# flatMap

* [flatMap: Sequence](https://developer.apple.com/documentation/swift/sequence/2905332-flatmap)
* [flatMap: Optional](https://developer.apple.com/documentation/swift/optional/1540500-flatmap)
* flatMap
* Map + Flatten
* Transform의 결과가 Context와 동일한 Type의 Context라면, 결과는 Context가 중첩해서 존재하게 되는데, 이를 하나로 변환시킨 결과를 만듦
  * Transform의 결과가 Optional Int인 경우, Context 역시 Optional Int라면, 결과는 Optional이 중첩된 상태가 됨
  * 이 떄, Flatmap을 사용하면 flatten된 결과물로 만들어줌
    ````swift
    let result = value.map { (num: Int) -> Int? in
        if num % 3 == 0 {
            return nil
        }
        return 3
    }
    // Optional(Optional(3))
    
    let result = value.flatMap { (num: Int) -> Int? in
        if num % 3 == 0 {
            return nil
        }
        return 3
    }
    // Optional(3)
    ````

* 이중 Collection (이차원 배열)의 경우 1차원으로 변환해줌
  ````swift
  let numbers = [[1, 2, 3, [4, 5, 6], [7, 8, 9]]
  let result = numbers.flatMap { $0 }
  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  ````

* Dictionary의 경우 각 Element는 tuple로 받음
  * 결과는 `[Sequence.Element]`
* Optional인 경우, 그리고 동작의 실패일 경우 nil을 반환받고 싶을 때 사용
  * Map에서 예시를 다시 가져와서 이해해보도록 하겠다.
  ````swift
  let tempName: String? = "wan"
  let checker: (String) -> String? = { name in
      if name == "wansik" {
          return "nice"
      }
      return nil
  }
  
  let result = tempName.flatMap(checker)
  print(result) // if "wansik": Optional("nice"), else: nil
  ````
  
  * map과 차이점을 이해할 수 있다.
  * Optional Value인 경우 nil을 반환한다. (map과 동일하게 동작)
  * Optional Value가 아닌 경우, map과 비슷하게 동작하되, transform의 결과를 한번더 wrapping하지 않고 flaten하여 반환한다.
* 네트워크 처리에서 json을 받고, 이를 파싱하는 경우에 자주 사용한다.
  ````swift
  let json: [String: String]? = someFunction() // 네트워크 처리를 통해 받아온 json, Optional
  let model = json.flatMap(Model.init) // json의 값이 없어도 nil, Model 초기화에 실패해도 nil
  // Model init은 failable initializer라고 가정
  ````
  
  * 만약, map을 사용했다면 json의 값 여부는 확인하여 nil로 반환받을 수 있지만
  * Model 초기화 코드의 결과는 Optional로 wrapping되어 받기 때문에 불편
* 예외 처리를 깔끔하게 할 수 있음
  ````swift
  func defaultDescription(with str: String?) -> String {
  guard let string = str,
          let integer = Int(string),
          integer <= 100 else {
              return "invalid value"
          }
  return "number is \(integer)"
  }
  
  func functionalDescription(with str: String?) -> String {
      let result = str.flatMap({ Int($0) })
                      .flatMap({ $0 <= 100 ? $0 : nil})
                      .map({ "number is \($0)"})
      return result ?? "invalid value"
  }
  
  print(defaultDescription(with: "300"))
  print(functionalDescription(with: "300"))
  ````

* Monad
  * 이처럼 value를 가지는 Context가 flatMap function을 이용한 transform을 지원하는 자료구조를 말함
  * Optional, Collection

# compactMap

* [compactMap](https://developer.apple.com/documentation/swift/sequence/2950916-compactmap)
* Collection 안의 nil을 제거
  ````swift
  let numbers: [Int?] = [1, 2, 3, nil, 4, 5, 6, nil, 7, 8, 9]
  let result: [Int] = numbers.compactMap { $0 }
  
  print(result) // 1, 2, 3, 4, 5, 6, 7, 8, 9
  ````
  
  * 결과가 `[Int]`라는 것에 주의
* Swift 4.1에서 분리된 이유
  * 기존에는 array 안에 nil 역시 flatten 해줬음
  * 하지만 헷갈리게 사용하다보니 구분할 필요성을 느낌
  * flatMap
    * 2차원 1차원으로
    * 내부 함수 실패 여부를 wrapping하고 싶지 않을 때
  * compactMap
    * 1차원 Collection의 nil을 제외하고 싶을 때

# compactMapValue

* [compactMapValue](https://developer.apple.com/documentation/swift/dictionary/3081323-compactmapvalues)
* Swift 5에 들어감
* `[T: S?]` 상황의 dictionary에서 value가 nil인 element를 제거할 때 사용
* 결과물은 `[T: S]`
