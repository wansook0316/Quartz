---
title: Module
thumbnail: ''
draft: false
tags:
- python
- module
created: 2023-10-04
---

Python은 언어이기에 내장하는 기능들이 대부분의 프로그래머에게 필요한 필수적인 것들을 제공하고 있다. 따라서 특정 분야에서 필수적으로 필요로 하는 기능은, 분야에 제한적이기에 Python 언어에서 기본 내장하기가 어렵다. 이러한 이유로 수많은 프로그래머들은 본인이 풀고자 하는 문제에서 주요한 기능을 직접 만들고 서로 공유하는 접근을 하게 된다. 이렇게 모듈은 프로그래머들이 직접 유용한 함수 등을 작성하여, 다른 사람 혹은 본인의 프로그램 개발시 활용하고자 하는 일종의 별도 파일이다. 모듈의 타입을 쳐보면, module이라고 뜬다.

````python
import math

type(math)
>>> module
````

# 모듈안의 함수 호출하기

````python
math.factorial(3)
>>> 6
````

이렇게 어떤 모듈을 사용하는지, 쓰고 함수명을 같이 써준다. 모듈전체를 불러오지 않고, 모듈안의 해당 함수만을 불러오고 싶을 때는,

````python
from math import factorial

factorial(3)
>>> 6
````

이렇게 써주면 된다.

# 모듈을 불러오는 방법

같은 디렉토리에 이런 파일을 작성했다고 하자.

````python
#filename : SampleModule.py
def convert_to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5/9
````

다른 python 파일에 이 파일을 가져다가 쓰고 싶으면,

````python
import SampleModule

SampleModule.convert_to_celsius(212)
````

앞에 모듈이름을 쓰기 싫으면,

````python
from SampleModule import convert_to_celsius

convert_to_celsius(212)
````

혹은 모듈안에 있는 모든 함수를 모듈이름 없이 사용하고 싶으면,

````python
from SampleModule import *

convert_to_celsius(212)
````

너무 모듈이름이 길면, 줄여서 사용하자.

````python
import SampleModule as SM

SM.convert_to_celsius(212)
````
