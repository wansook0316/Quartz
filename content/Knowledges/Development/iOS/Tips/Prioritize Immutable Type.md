---
title: Prioritize Immutable Type
thumbnail: ''
draft: false
tags:
- immutable
- swift
- mutable
- let
- var
created: 2023-10-01
---

분기에 따라 값이 결정되는 코드를 짤 때, 변수를 무엇으로 선언하는 것이 좋을까? 작은 부분이나 좋은 지적이라 생각하여 정리해본다.

# 핵심 요약

 > 
 > 분기에 따라 값이 결정될 때 변수를 선언해야 한다면, `var`보다는 `let`을 우선적으로 검토해보자.

# let, var

* 코드를 짜다보면, 특정 분기에 따라 결과를 다르게 세팅해야할 때가 있다.
* 이런 경우 아무 생각없이 짠다면, 다음과 같이 짜기 쉽다.

````swift
internal func calculateResult() -> String {
    var result = ""
    switch type {
    case .a:
        result = "A 타입입니다."   
    case .b:
        result = "B 타입입니다."
    case .c:
        result = "C 타입입니다."
    }

    return result
}
````

* 해당 코드는 문제 없이 작동할 것이다.
* 하지만, `result` 변수의 선언 부에서 `var`로 했기 때문에, 약간의 표현력이 떨어지는 결과를 낳는다.

````swift
internal func calculateResult() -> String {
    let result: String
    switch type {
    case .a:
        result = "A 타입입니다."   
    case .b:
        result = "B 타입입니다."
    case .c:
        result = "C 타입입니다."
    }

    return result
}
````

* 다음과 같이 `let`으로 선언했다면, "아 해당 결과가 한번만 세팅되는 구나"와 같은 추가 정보를 제공할 수 있게 된다.
* 즉, 조금더 좋은 표현력을 갖는다.
