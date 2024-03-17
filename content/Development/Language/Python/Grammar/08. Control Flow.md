---
title: Control Flow
thumbnail: ''
draft: false
tags:
- python
- control-flow
created: 2023-10-04
---

C++과 약간의 차이를 기억해야 하는데, 가장 핵심적인 것은 **OR, AND** 를 그대로 갖다 쓴다는 것이다. C++에서는 각각 **`&&` , `||`** 로 사용했는데, 이것을 **AND, OR** 로 사용하면 된다.

## 문자열에서 특정 문자 갯수 세는 프로그램 개발하기

````python
def calcCharacterFromString(sentence, inputChar):
    numChs = sentence.count(inputChar)
    return numChs

sentence = 'Mary had a little lamb'
inputChar = input("Enter the Char : ")

calcCharacterFromString(sentence, inputChar)
````
