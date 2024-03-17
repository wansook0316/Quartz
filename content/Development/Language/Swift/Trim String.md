---
title: Trim String
thumbnail: ''
draft: false
tags:
- swift
- trim
- String
created: 2023-09-30
---

특정 문자열이나 공백을 제거하려면 어떻게 해야할까?

# 공백 싹다 지우기

````swift
let myString = "This \n is a st\tri\rng"
let trimmedString = myString.components(separatedBy: .whitespacesAndNewlines).joined()
````

# 양쪽 지우기

````swift
var string = " AAAAAAAA "
let trimedString = string.trimmingCharacters(in: [" "]) // 양끝단의 특정 문자도 지울 수 있음
let trimedString = string.trimmingCharacters(in: .whitespaces)
````

* `string.trimmingCharacters(in:)`의 경우 문자열은 파라미터로 받지 못한다.
