---
title: Function Design Recipe
thumbnail: ''
draft: false
tags:
- python
- comments
created: 2023-10-04
---

# Function Design Recipe (FDR)

우리는 파이썬에서 제공하는 다양한 내장 함수들에 대한 설명을 보고싶을때, `help()` 함수를 통해 정보를 확인할 수 있었다. 마찬가지로 내가 정의한 함수를 `help()` 를 통해 설명을 볼 수 있게 하는 것이 좋은 개발자의 방향이다.

````python
def convert_to_celsius(fahrenheit):
    """ (int) -> int #1

    Return the celcius number from the given fahrenheit number. #2

    >>> Return the celsius(212) #3
    100 #4
    """ #5
    return (fahrenheit - 32) * 5/9
````

함수를 선언하고 `"""` 을 써준뒤 주석을 달아준다. 이 때,

1. 입력파라미터와 리턴값을 써준다.
1. 함수의 설명을 써준다.
1. 예제를 써준다.

이 세가지를 두루한다면 가장 완벽한 주석이 될 거다!
