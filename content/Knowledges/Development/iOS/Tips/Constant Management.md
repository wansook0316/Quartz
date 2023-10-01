---
title: Constant Managemen
thumbnail: ''
draft: false
tags:
- swift
- constant
- management
- class
- struct
- enumeration
created: 2023-10-01
---

static 변수 및 함수는 인스턴스를 생성하지 않고 접근하기 위해 사용한다. swift에서는 어디서 관리하는 것이 좋을까?

swift에서 사용하는 Method가 궁금하다면 [해당글](https://velog.io/@wansook0316/static-vs.-class)을 읽고 오자.

# 핵심 정리

 > 
 > Swift에서 static 함수 및 변수를 관리하고 싶다면 enumeration을 사용하자.

* 생성자가 없다.

# 동기

* 프로젝트를 하다보면, 상수나 전역에서 사용할 함수를 관리해야할 필요성이 생긴다.
* 이런 경우 `static` 변수나 함수를 통해 많이들 관리하는데, 어디다가 해야할지에 대한 의문이 든다.
* 즉, namespace를 어떤 것으로 해야할지에 대한 고민이다.
  * namespace: 이름 충돌 방지 및 코드 분리를 위한 개념
* 다양한 글을 읽고 정리해본다.

# 결론

* 정리를 위해 많은 글을 찾아보았으나, 더 많은 근거를 찾기 어려웠다.

||Class|Struct|Enum|
|--|-----|------|----|
|장점|||- 생성될 위험이 없다.|
|단점|- 생성될 위험이 있다.|- 생성될 위험이 있다.||

* Swift에서 enum은 **정적 변수, 정적 함수 선언**이 가능하기 때문에, 기타 대안들보다 명백히 좋다.
* Class, Struct와 같이 생성자를 막거나 하는 수고자체를 할 필요가 없다.
* 추가적으로 case문까지 활용이 가능하다.
* 물론 생성자를 만들 수 있으나, 만들지 않으면 그만이다.

# 추가적인 대안

````swift
extension CGFloat {
    static let gapSize = CGFloat(8)
}

let gapSize: CGFloat = .gapSize // 띠용
````

* Constant로 모든 것을 관리하기 싫다면 위와 같이 사용할 수도 있다.
* static으로 선언하더라도, 인스턴스에서 바로 접근하여 사용할 수 있다.
  * 이 부분은 어찌보면 자바와 비슷할지도..?
    * (자바는 static으로 class에 선언하더라도 인스턴스에서 접근할 수 있다.)

# Reference

* [Structure Constants in iOS With Enums](https://betterprogramming.pub/structure-constants-in-ios-with-enums-5ca2135dcab0)
* [Why You Should Use a Constants File in Swift](https://medium.com/swlh/why-you-should-use-a-constants-file-in-swift-ff8c40af1b39)
* [Constants: Struct static lets or enums?](https://medium.com/@mikesand/constants-struct-static-lets-or-enums-b8ca9a8b7326)
* [Organizing Your Swift Global Constants for Beginners](https://betterprogramming.pub/organizing-your-swift-global-constants-for-beginners-251579485046)
