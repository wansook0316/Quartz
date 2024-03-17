---
title: Optional
thumbnail: ''
draft: false
tags:
- Optional
- swift
- nil-coalescing
- optional-chaining
created: 2023-09-30
---

Swift를 처음 공부하면서 가장 어려웠던게 이 Optional인 것 같다. 애초에 개발도 처음할 시기였으니, 이런 자료구조가 왜 필요한지 전혀 몰랐었던 시간이 있었다. 해당 이유는 [Either와 Result 이해와 실제 사용예 알아보기](https://velog.io/@wansook0316/Either와-Result-이해와실제-사용예-알아보기) 포스트를 참고해주길 바란다. 그럼, Optional의 정체와 궁금했던 점을 정리하는 포스팅을 시작해보도록 하겠다.

# Optional

````swift
enum Optional<T> {
  case none
  case some(<T>)
}

// 실제 문서에는 아래와 같이 적혀 있다. generic 타입 파라미터에 대해 명시적으로 적기 위해 이렇게 되어 있다.
enum Optional<Wrapped> {
  case none
  case some(<Wrapped>)
}
````

일단, 핵심은 Optional은 enum이라는 것이다. case 이름 뒤에 ()가 붙은 것은, 이 some이라는 특정 타입에 대해 추가적인 정보를 저장하는 방법이다. 이 경우는 모든 타입의 인스턴스가 들어간 것을 some이라는 타입의 추가정보로 설정했음을 말한다. 이걸 Associoated Values(연관값)이라 한다.

````swift
var hello: String?
var hello: String? = "hello"
var hello: String? = nil

var hello: Optional<String> = .none
var hello: Optional<String> = .some("hello")
var hello: Optional<String> = .none
````

이렇게 스위치문으로 할당되는 것이 전부이다!

# Optional Unwrapping

그렇다면, Optional을 언래핑할 때, 실제로 어떻게 동작하는 걸까? 먼저 강제 언래핑의 경우를 보자.

````swift
let hello: String? = "안녕!"
print(hello!)

switch hello {
  case .none // 에러발생 Crash
  case .some(let data):
    print(data)
}
````

아무래도 swift에서는 enum과 switch 문을 많이 사용하다보니, 이렇게 적어보았다. 결국 옵셔널을 언래핑한다는 것은 switch문을 통해 풀어주는 행위를 말한다. 이번에는 옵셔널 바인딩을 보자.

````swift
let hello: Optional<String> = "안녕!"
if let hello = hello {
  print(hello)
}

switch hello {
  case .some(let data):
    print(hello)
  case .none:
    // 아무일도 안함
}
````

none과 some의 위치가 변경되었다. 이번에는 암시적으로 풀어진 옵셔널을 보자.

````swift
var hello: String!
hello = "안녕!"
print(hello)

var hello: Optional<String> = .none //아무 초기인자가 없이 생성되었을 경우 초기값은 .none이다. ?Optional도 당연히 같은 enum이기 때문에 같다.

switch hello { // 다만 옵셔널 바인딩이나 강제 언래핑을 해주지 않아도 switch문을 실행한다.
  case .none // 에러발생 Crash
  case .some(let data):
    print(data)
}
````

암시적 옵셔널의 경우, 옵셔널 언래핑을 해주지 않은 상태에서도 연산이 가능하다 했다. 이 이유는 다른 것이 아니고, 암시적 옵셔널로 선언된 변수에 대해 실행할 때, 컴파일러가 알아서 해당 스위치문을 만들어주기 때문이다.

결국 enum을 기준으로 값을 나눠주는 것이 Optional의 본질이다.

# Nil-Coalescing Operator (Optional Defaulting)

문법 중에, 옵셔널인 경우 해당 변수를 사용할 때, 만약 `nil`인 경우 default값을 배정할 수 있는 방법이 있었다. `??` 연산자를 사용하는 방법이었는데, 이제 정체를 알았으니 이 구문이 어떻게 변경되는지 알아보자.

````swift
let x: String? = "비가 많이와"
let y = x ?? "장마 끝났대"

if let x = x {
  y = x
} else {
  y = "장마 끝났대"
}

switch x {
  case .none: y = "장마 끝났대"
  case .some(let data): y = data
}
````

이와 같이 동작하는 것이다. 정체를 아니 생각보다 역시 별게 없다.

# Optional chaining

자 이렇게 Optional의 본질을 알았다면, 여러개의 Optional 체이닝이 어떻게 일어나는지 알아보자.

````swift
let x: String? = "너무 더워"
let y = x?.foo()?.bar?.z

switch x {
  case .none: y = nil
  case .some(let data1):
    switch data1.foo() {
      case .none: y = nil
      case .some(let data2) {
        switch data2.bar {
          case .none: y = nil
          case .some(let data3): y = data3.z
        }
      }
    }
}
````

요러코럼 동작한다! 그래서 이전 글에서 공부했을 때, 앞부분에서 nil이 나오는 경우 해당 구문자체가 실행이 되지 않고 넘어갔던 것.

# Optional Binding에서 ,와 &&

너무 좋은 글이 있어 링크로 대체하겠다!

* [스위프트의 콤마와 &&의 차이: condition과 expression의 구분](https://soojin.ro/blog/swift-comma-vs-and-operator)

핵심은 &&은 두개의 boolean 표현을 받는 논리 연산자이고, `,`는 조건을 이어붙이는 용도로 사용한다는 것!
