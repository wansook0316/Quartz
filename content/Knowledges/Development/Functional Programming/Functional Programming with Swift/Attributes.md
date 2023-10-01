---
title: Attributes
thumbnail: ''
draft: false
tags:
- functional-programming
- swift
- first-class-function
- composition
- currying
created: 2023-10-01
---

함수형 프로그래밍에 대해서 공부해보면 꼭 나오는 용어들이 있다. 일급 시민, 함수 합성, 커링 등. 오늘은 이러한 단어들에 대해서 이해해보자.

# First Class Function

* function은..
  * argument로 받을 수 있음
  * return할 수 있음
  * 변수에 할당할 수 있음
  * anonymous function
  * nested function
  * non-local variable
    ````swift
    func outer() {
        var x = 1
        func inner() { // nested function
            x += 1 // non-local variable
            print(x)
        }
        return inner // function return 가능
    }
    ````
  
  * closure
  * equality
    * Extensional Equality
      * 두 function이 동일한 입력에 대해 동일한 출력을 가지는 경우
    * Intensional Equality
      * 두 Function이 동일한 logic을 가지는 경우
    * Reference Equality
      * Function 고유의 Identifier가 동일한 경우
    * **Swift는 function Equality를 지원하지 않음**

# Function Composition

* [function composition](https://en.wikipedia.org/wiki/Function_composition)
* 독립적인 function 여러개를 나누어서 사용할 수 있는 방법
* 즉, 합성함수를 말함
* 단순한 pure function을 잘 만들어두고, 조합/재활용하여 합성
* Function 단위의 재활용성이 높아짐
* Code읽기가 용이
* function 단위 테스트 용이
* 버그 감소

# Partial Application

* 부분 적용
* Multi-argument function에서 생략될 argument의 값을, 미리 정하여 더 적은 argument를 받는 function으로 변형하는 방법
  * default value는 값에 대해서 정해두는 것
  * 하지만 이걸 함수로 정해두는 것을 말함

````swift
import Foundation

func guguStringFormat(left: Int, right: Int, expressFormat: String) -> String {
    return String(format: expressFormat, left, right, (left * right))
}

func gugustringGenerator(left: Int, expressFormat: String) -> (Int) -> String {
    return { (right: Int) -> String in
        guguStringFormat(left: left, right: right, expressFormat: expressFormat)
    }
}

let generator3 = gugustringGenerator(left: 3, expressFormat: "%d x %d = %d")
let result3 = (1...9).map(generator3)

print(result3.joined(separator: "\n"))
````

* 상당히 사고의 전환이 필요함을 알 수 있다.

# Currying

* 여러개의 argument를 받는 function을 단일 argument를 받는 function chain으로 변형
* 실제로 만들어서 generic으로 사용하려면 참 머리아프다.
* currying opensource 있으니 사용해보자.
* 예시
  ````swift
  func f(a: Int, b: Int) -> Int {
      return a + b
  }
  
  func g(a: Int) -> (Int) -> Int {
      return { (b: Int) -> Int in
          return a + b
      }
  }
  
  print(f(a: 3, b: 4))
  print(g(a: 3)(4))
  ````

* 활용도
  * 두번째 argument 활용을 지연할 수 있다. 유연함을 제공
    ````swift
    func add(a: Int, b: Int) -> Int {
        return a + b
    }
    
    func curriedAdd(a: Int) -> (Int) -> Int {
        return { (b: Int) -> Int in
            return a + b
        }
    }
    
    let curriedAdd3 = curriedAdd(a: 3)
    let result = [2, 4, 7].map(curriedAdd3)
    print(result) // 5 7 10
    ````
  
  * Factory for functions
    * 일부 파라미터를 고정해서 특정 용도의 함수를 만들어낼 수 있다.
  * [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
    * template method pattern
      * 객체의 기본 골격을 만들어두고(abstract class)
      * 실제 사용하는 클래스가 상속받아 구체화 하여 사용하는 패턴
    * partial application을 이용해 이미 알려진 기능을 제공하고 나머지 parameter를 구현하도록 남겨둚
  * 묵시적인 값
    * 일부 parameter를 고정해서 default parameter처럼 동작하게 만듦
