---
title: Function
thumbnail: ''
draft: false
tags:
- swift
- argument-label
- parameter-name
- argument
- parameter
- inout
created: 2023-09-30
---

# 일급 함수

* parameter로 사용가능
* return 값으로 사용가능
* 익명함수

# argument label

* 호출하는 쪽에서 사용하는 이름

# parameter name

* function 안에서 사용하는 이름

# Variadic parameters

* 0개 이상의 특별한 타입을 나열해서 파라미터로 넘길 수 있음
* `...`을 넣어서 사용
* 이렇게 선언된 경우 함수안에서 해당 type의 Array로 사용할 수 있음
  ````swift
  ````

func sum(values: Int...) -> Int {
var result = 0

````
for value in values {
	result += value
}

return result
````

}

sum(10, 20, 30) // 60
\```

# inout parameters

* 일반적으로 함수에 전달된 파라미터의 변경은 함수안에서만 유효
* 하지만 function에서 바깥쪽 값을 바꿔야할 경우가 있음 (swap)
* inout으로 선언된 경우, 해당 변화가 호출된 쪽에 반영됨
