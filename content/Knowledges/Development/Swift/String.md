---
title: String
thumbnail: ''
draft: false
tags: null
created: 2023-09-30
---

# Extended String Delimiters

* `#`
* `#""Hello World""#` = Hello world
* 특수문자들을 그대로 표현 가능
* String literal 선언을 #로 감쌈
* escape seqence`\n`은 아래와 같이 사용
* `#"Line1\#nLine2#`
  * Line1
  * Line2

# Concatenating

* `+` 가능

# String Interpolation

* `"\(name) 는 \(food)을 먹습니다"`

# Unicode

* String은 내부적으로 Unicode scalar value를 사용함
* 21-bit number
  ````swift
  let precomposed: Character = "\u{D55C}" // 한
  let decomposed: Character = "\u{1112}\u{1161}\u{11AB}" // ㅎ,ㅏ,ㄴ = 한으로 표현됨
  ````

# Index

* String.Index로 다룰 수 있음
* 해당 함수들로 다뤄야 함. 상당히 귀찮음
