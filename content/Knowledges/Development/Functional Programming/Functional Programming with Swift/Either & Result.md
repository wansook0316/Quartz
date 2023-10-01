---
title: Either & Result
thumbnail: ''
draft: false
tags:
- swift
- functional-programming
- EIther
- Optional
- Result
created: 2023-10-01
---

순수 함수형 프로그래밍언어 Haskell에는 Either라는 자료구조가 있다. 둘 중 하나의 타입을 가질 수 있는 경우 사용하는 자료구조라 한다. 이 Either 자료구조에 영감을 얻어 태어난 것이 Swift의 Result라 한다. 이번 글에서는 Either와 Result의 개념을 알아보고, 실제 사용할 때, 어떠한 식으로 변형하여 사용할 수 있는지 알아보자. 어떻게 보면 난해할 수 있으니 마음을 단단히 먹고 읽어보자.

# Maybe / Optional

* Value의 부재 가능성을 표현
* functor이자 Nomad
* map, flatmap 사용가능
  * value가 부재 상태로 변할 가능성이 없는 transform (nil 리턴 없음)의 경우 map 사용
  * value가 부재 상태로 변할 가능성이 있는 transform (nil 리턴)의 경우 flatMap 사용

# Either

* 어떤 Value가 두가지의 type을 가질 수 있는 경우 표현
* value가 A or B
* 통상 right/left로 표현

````swift
enum Either<L, R> {
    case left(L)
    case right(R)
}

var either: Either<String, Int> = .right(3)

switch either {
    case .left(let l):
      print(l)
    case .right(let r):
      print(r)
}
````

* 정리
  * 하나의 변수
  * String을 저장하거나 (left)
  * Int를 저장하거나 (right)
  * 하나의 변수에 다른 두가지 type을 정의하여 사용
* 사용 경우
  * function이 상황에 따라 다른 두가지 type의 return value를 가지는 경우
  * 대표적으로 정상적인 처리 결과이거나 Error
    * Optional로 사용하는 경우, 어떤 Error인지 명시할 방법이 없음
  * Swift의 Result가 사용예

# Result

* Either에서 정상/Error로 제한을 걸어 사용하는 자료ㅕ구조

````swift
enum Result<T> {
    case success(T)
    case failure(Error)
}
````

* Struct로 한다면?

````swift
struct Result<T> {
    var success: T?
    var failure: Error?
}
````

* 성공 혹은 실패여야 하나, property로 갖고 있기 때문에 둘다 값이 있거나, 없는 경우를 배제할 수 없음
* Functor로 개선하기
  ````swift
      enum Result<T> {
          case success(T)
          case faliure(Error)
          
          func map<U>(_ transform: (T) throws -> U) rethrows -> Result<U> {
              switch self {
              case .success(let t):
                  return Result<U>.success(try transform(t))
              case .faliure(let error):
                  return Result<U>.faliure(error)
              }
          }
      }
  ````
  
  * rethrows
    * 에러를 리턴할 수 있는 함수를 매개변수로 받은 함수(이 경우에서는 map)가 다시 해당 에러를 바깥으로 뱉고 싶을 때 사용
    * [참고](https://gwangyonglee.tistory.com/53)
  * map의 transform 함수는 return value가 Optional이 아닌 녀석이 와야하여 U로 리턴되는 것을 볼 수 있음
* Monad로 개선하기
  ````swift
  enum Result<T> {
      case success(T)
      case failure(Error)
      
      static func flatten<T>(_ result: Result<Result<T>>) -> Result<T> {
          switch result {
          case .success(let t): // 성공하면 T 타입(여기서 T타입은 Result<T>로 대응됨
              return t
          case .failure(let e): // 성공이 아닌 경우는 무조건 Error Type임!!
              return Result<T>.failure(e)
          }
      }
      
      func map<U>(_ transform: (T) throws -> U) rethrows -> Result<U> {
          switch self {
          case .success(let t):
              return Result<U>.success(try transform(t))
          case .failure(let error):
              return Result<U>.failure(error)
          }
      }
      
      func flatMap<U>(_ transform: (T) throws -> Result<U>) rethrows -> Result<U> {
          switch self {
          case .success:
              let transformed = try self.map(transform) // Result<Result<U>>: map은 transform이 완전 타입으로 리턴된다고 가정하고 Box를 한번 더 씌움
              return Result.flatten(transformed) // flatten 작업을 해줌
          case .faliure(let e):
              return Result<U>.failure(e)
          }
      }
  }
  ````
  
  * 헷갈리면 위의 코드를 실제로 쳐보면 알 수 있음
* Result의 활용
  ````swift
  struct Person {
      var name: String
      var age: Int
      
      init(name: String, age: Int) {
          self.name = name
          self.age = age
      }
      
      init?(dict: [String: Any]) {
          guard let age = dict["age"] as? Int,
              let name = dict["name"] as? String else {
                  return nil
              }
          self.init(name: name, age: age)
      }
  }
  
  enum MyError: Error {
      case parseError
      case initializeError
  }
  
  func convertor4(data: Result<Data>) -> Result<Person> {
      let result = data.flatMap { (data: Data) -> Result<[String: Any]> in
          guard let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String: Any] else {
              return Result.failure(MyError.parseError)
          }
          
          return Result.success(json)
      }
      .flatMap { (dict: [String: Any]) -> Result<Person> in
          guard let result = Person(dict: dict) else {
              return Result.failure(MyError.initializeError)
          }
          return Result.success(result)
      }
      
      return result
  }
  ````
  
  * 뭔가 좋게 만들고자 만들었는데, convertor 코드가 상당히 복잡하다.
  * Error를 처리하는데 있어 flatMap이 뭔가 부족하다.
* Custom transform function 추가하기
  * Error를 처리하는 map
  * Error Handling 추가
  ````swift
  enum Result<T> {
      // ...
      
      func errorMap<U>(_ transform: (T) throws -> U) -> Result<U> {
          do {
              return try self.map(transform)
          } catch let e {
              return Result<U>.failure(e)
          }
      }
  }
  
  func convertor5(data: Result<Data>) -> Result<Person> {
      let result = data.errorMap { try JSONSerialization.jsonObject(with: $0, options: []) }
          .errorMap{ try ($0 as? [String: Any]).unwrap(errorIfNil: MyError.castingError) }
          .errorMap{ Person(dict: dict) }
      return result
  }
  
  func convertor6(data: Result<Data>) -> Result<Person> {
      let result = data
                  .errorMap(jsonParser(data:))
                  .errorMap(checkType(any:))
                  .errorMap(Person.init(dict:))
  }
  ````
  
  * Error가 발생한 경우 Result의 failure로 넣어서 넘긴 것이 다임
  * 하지만, 실제 코드의 가독성과 간결성이 매우 향상됨
  * 각각의 동작 역시 순수함수로 분리했다면 6번 처럼 구성됨
* 효과
  * Error handling이 Result안으로 숨음
  * Error handling code가 제거되어 주 logic을 가리지 않음
  * detail한 error를 추가하기가 더 쉬워짐
  * Optional-flatMap 조합에서 확인이 불가능했던 정확한 Error위치와 내용이 남음
    * Error 타입을 만들어서 받을 수 있음!
