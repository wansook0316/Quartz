---
title: Tuple
thumbnail: ''
draft: false
tags:
- python
- tuple
created: 2023-10-04
---

튜플(tuple)은 몇 가지 점을 제외하곤 리스트와 거의 비슷하다. 리스트와 다른 점은 다음과 같다.

* 리스트는 `[]`으로 둘러싸지만 튜플은 `()`으로 둘러싼다.
* 리스트는 그 값의 생성, 삭제, 수정이 가능하지만 튜플은 그 값을 바꿀 수 없다.

`tuple`는 여러 부분 리스트와 매우 유사한데, 가장 큰 차이점은 `tuple`의 아이템은 **변경이 불가(immutable)하다**는 점이다.

````python

tempTuple = (1,2,3,4,5)

  

print(tempTuple)

type(tempTuple)

````

````

(1, 2, 3, 4, 5)

  

tuple

````

인덱싱과 슬라이싱은 리스트와 비슷하다. 다만 주의해야 하는 점이 있다.

# 요소가 하나 있는 튜플 만들기

튜플에 선언에 있어 ()를 사용하고 있기 때문에 (8)과 같이 선언을 할경우 파이썬은 괄호를 **연산자** 라 판단한다. 따라서 우리가 하나의 튜플 요소를 선언할 경우 (8,) 다음과 같이 명확히 알려주는 문법을 사용해야 한다.

````python
notTuple = (8)
print("[notTuple]", notTuple, type(notTuple))

minTuple = (8,)
print("[minTuple]", minTuple, type(minTuple))
````

````
[notTuple] 8 <class 'int'>
[minTuple] (8,) <class 'tuple'>
````

# 튜플 안에 리스트

튜플은 기본적으로 수정이 불가하다고 생각하지만, 만약 **튜플 안에 리스트** 가 있다면 리스트 내의 요소를 바꿀 수 있다.

````python
sampleList = (["Python", 'B'], ["C++", 'B'])

# 튜플 안 리스트의 요소를 바꾸고 있으므로 가능하다.
sampleList[0][1] = 'A'

# 튜플의 요소를 바꾸고 있으므로 불가능 하다.
sampleList[0] = ["Python", 'B'] # Erron in this statement

````
