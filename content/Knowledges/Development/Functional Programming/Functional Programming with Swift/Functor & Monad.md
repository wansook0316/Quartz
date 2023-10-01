---
title: Functor & Monad
thumbnail: ''
draft: false
tags:
- swift
- functional-programming
- functor
- monad
created: 2023-10-01
---

함수형 프로그래밍을 공부하다보면 벽을 한번 마주한다. Functor와 Monad가 그것이다. 이걸 이해하기 위해서 위키피디아에서 집합론?, 범주론? 이런 걸 읽었던 적이 있는 것 같은데 여전히 잘 모르겠다. 이번에는 와닿는 방식으로 이해하는 것을 목표로 한다.

# Functor

* optional의 map
  * 값이 있으면 실행, 없으면 말아
* Collection의 map
  * 값을 하나씩 가지고와서 매핑해라
* Dictionary의 map
  * 각 딕셔너리의 key, value를 tuple로 들고와서 매핑해라
* function의 map
  * Composition 해라
* map을 이용한 transform을 지원하는, value를 가지는 context
* Context + value + transform(map) = Functor
  * context
    * 어떤 value가 처해있는 상태
    * Collection, Optional 등 다른 값을 가지는 Container
    * 포함하는 value가 generic으로 표현되어야 함
  * value
    * Context에 넣어지는 실제 내용
    * Context가 generic으로 표현되기 대문에, 어떤 type의 value도 사용이 가능하다.
  * Transform
    * 어떤 값 T를 U로 변환해주는 function
    * T와 U는 같은 Type이어도 괜찮음
    * 실패할 가능성이 없는 경우를 말함
      * 실패할 가능성이 있는 경우는 flatMap이 나음
* Context에 싸여있는 Value에 function을 적용하기 위해 사용
  * Optional
    * Box로 이해하기
    ````swift
    enum Optional<Wrapped> {
        case some(Wrapped)
        case none
    }
    ````
    
    * 이런 Optional(Context)에다가 연산을 수행하기 위해서는 guard, if와 같이 Optional Unwrapping을 해주어야 함
  * Map을 사용하면, Optional Unwrapping이 없이 같은 타입으로 변환이 가능함
    ````swift
    Optional(2).map { (v: Int) -> Int in
        return v + 3
    }
    ````
    
    * 5를 리턴했으나, map의 결과는 Optional(5)
  * 동작 이해하기
    * Value가 있는 경우
      * Optional(2) -> Context로 부터 Unwrapping -> 2 -> 함수 적용(+3) -> 5 -> Context에 Rewrapping -> Optional(5)
    * Value가 없는 경우
      * nil -> 값 없음 확인 -> 함수 적용하지 않음 -> 그대로 리턴(nil)
* Chaining
  * Optional Chaining
    * `let result = a?.b?.c?.d?.e`
  * Map Chaining
    * `let result = a.map { $0 }.map { $0 }.map { $0 }.map { $0 }`
    * 이게 가능한 이유는 Context가 안바뀌기 때문(Box)
    * 의미
      * Value가 없는 예외 상황에 대한 처리를 주 logic에서 제거하여 따로 처리 가능
      * Step을 명확하게 볼 수 있음
      * 평소에 Code를 작은 단위의 함수로 분리해야 적용 가능
      * 간결해지고 가독성이 높아짐
* Function에 map 함수를 사용할 수 있을까?
  * 즉, Function역시 Context인가?
  * Function에 map을 사용한다는 것은 Function을 composition 한다는 의미
    ````swift
    func map<A, B, C>(f: @escaping (B) -> C, g: @escaping: (A) -> B) -> (A) -> C {
        return { x in
            f(g(x))
        }
    }
    ````
    
    * A -> B 함수와 B -> C 함수를 합성해서 A -> C 함수를 만들어라
* Result Functor
  ````swift
  enum Result<T> {
      case value(T)
      case error(Error)
  
      func map<U>(_ transform: (T) -> U) -> Result<U> {
          switch self {
              case .value(let value):
                let transformed = transform(value)
                return Result<U>.value(transformed)
              case .error(let error):
                return Result<U>.error(error)  
          }
      }
  }
  ````
  
  * Optional은 값이 있거나 없거나
  * 하지만 실패하는 경우를 알아보기 위해서 Optional만을 사용하는 것은 정보를 많이 제공하지 못한다.
  * 그런데 case만 가지고 있는 자료구조인 경우, 실제 사용할 때, switch 문을 통해서 계속 판단해줘야 한다. 지저분 하다.
    * switch 문을 실제 로직에서 사용하고 싶지 않았음
  * 그래서 내부에 map 함수를 도입해서(리턴값을 보면 context가 유지되기 때문에 map이 맞다) 간결하게 해결하고자 함
  * 활용
    ````swift
    func f(string: String) -> Result<Int> {
        guard let integer=  Int(string) else {
            return Result<Int>.error(MyError.notANumber)
        }
        return Result<Int>.value(integer)
    }
    
    func transform10(value: Int) -> Int {
        return value * 10
    }
    
    let result = f(string: "1234").map(transform10(value:))
    ````

# Monad

* flatMap을 이용한 transform을 지원하는 value를 가지는 context
* Context + value + flatMap transform = Monad
  * map은 Context를 유지함
  * transform의 결과에 상관없이 박스안에 다시 넣음(Context)
  * 그래서 위에 설명시, 모두 변환이 가능한 경우에 사용하라 했던 것임
    * 사상이 같은 집합내에서 완전하게 이뤄지는 것을 바람
  * 만약 그렇지 않은 경우 (transform의 결과가 nil이라면)에는 transform의 결과인 nil을 다시 상자에 넣는(Context) 상황이 초래됨
    * 즉, transform의 output이 Optional인 상황을 말함
    * `Optional(nil)`, `Optional(Optional(3))`
  * 이런 경우는 보통 바라지 않는 상황일 것임
    * `nil`, `Optional(3)`을 원함
  * 이 경우, map의 연산을 하되, nil인 경우를 제외하는 flatten의 역할이 필요함
  * 이 두 역할을 수행하는 것이 flatMap임
* Monad 활용
  * 서버로 부터 받은 Data가 다음과 같다고 하자
    * `{ "age": 3, "name": "kim" }`
  * JSON Parser 후, Struct로 변환
    ````swift
    struct Person {
        var name: String
        var age: Int
    }
    ````
  
  * 기존 코드
    ````swift
    struct Person {
        var name: String
        var age: Int
    }
    
    func convertor(data: Data?) -> Person? {
        guard let unwrappedData = data,
            let json = try? JSONSerialization.jsonObject(with: unwrappedData, options: []),
            let dict = json as? [String: AnyObject],
            let name = dict["name"] as? String,
            let age = dict["age"] as? Int else { return nil }
        
        return Person(name: name, age: age)
    }
    ````
  
  * 변경된 코드
    ````swift
    struct Person {
        var name: String
        var age: Int
        
        init(name: String, age: Int) {
            self.name = name
            self.age = age
        }
        
        init?(dict: [String: AnyObject]) {
            guard let age = dict["age"] as? Int,
                let name = dict["name"] as? String else {
                    return nil
                }
            self.init(name: name, age: age)
        }
    }
    
    func parser(data: Data) -> [String: AnyObject]? {
        let json = try? JSONSerialization.jsonObject(with: data, options: [])
        return (json as? [String: AnyObject])
    }
    
    func convertor2(data: Data?) -> Person? {
        return data.flatMap({ parser(data: $0) })
                    .flatMap({ Person(dict: $0) })
    }
    
    func convertor3(data: Data?) -> Person? {
        return data.flatMap(parser(data:))
                    .flatMap(Person.init(dict:))
    }
    ````
    
    * 너무나 간결해졌다.
  * 결론
    * 작업 순서
      * 명확한 작업 단위의 function으로 분리한다.
      * Data의 Mapping을 map, flatMap의 Chaining으로 처리
      * 결과에 대한 판단은 최종적으로 transform된 내용을 본다.
    * 장점
      * 각 단위 function이 명확해지고 Test하기 용이해짐
      * 본연의 로직이 명확하게 드러남
      * 반복적으로 나온 예외처리 코드들이 사라짐
