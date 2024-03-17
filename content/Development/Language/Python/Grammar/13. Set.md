---
title: Set
thumbnail: ''
draft: false
tags:
- python
- Set
created: 2023-10-04
---

# Set

`set`은 정렬되지 않은 수학의 `집합`과 동일한 개념의 데이터 타입으로서, 중복된 값을 가질 수 없다. 아래의 예제에서 exSet1은 set의 규칙에 제대로 부합하는 경우 이지만, exSet2는 중복된 아이템('p')이 섞여 있는 것을 볼 수 있다. 따라서 실제 아래의 코드를 실행해 보면, exSet2에는 Python이 알아서 중복된 값을 하나 제거한 것을 알 수 있다.

## Example 1

````python
exSet1 = { 1, 2, 3, 4, 5 }
print(exSet1)

exSet2 = { 'a', 'p', 'p', 'l', 'e' }
print(exSet2)
````

````
{1, 2, 3, 4, 5}
{'l', 'p', 'a', 'e'}
````

## Example 2

````python
# 빈 집합 만들기
aSet = set()
print("(a)", aSet)

# List를 input으로 넣었을 때
bSet = set([1,2,3,4,5])
print("(b)", bSet)

# 집합을 input으로 넣었을 때
cSet = set({1,3,5,7,9})
print("(c)", cSet)

# range 함수를 넣었을 때
dSet = set(range(5))
print("(d)", dSet)

# tuple을 넣었을 때
eSet = set((2,4,6,8,10))
print("(e)", eSet)
````

````
(a) set()
(b) {1, 2, 3, 4, 5}
(c) {1, 3, 5, 7, 9}
(d) {1, 2, 3, 4, 5}
(e) {2, 4, 6, 8, 10}
````

## 집합 연산

집합을 정의했다면 당연히 연산도 가능할 것이다.

|연산자|수학 기호|Python 문법|
|:-:------|:---:--------|:-------:----|
|합집합(union)|$A \cup B$|A.union(B) 혹은 A $|
|교집합(intersection)|$A \cap B$|A.intersection(B) 혹은 A & B|
|차집합(difference)|$A - B$|A.difference(B) 혹은 A - B|
|상위집합(superset)|$A \supseteq B$|A.issuperset(B) 혹은 A >= B|
|부분집합(subset)|$A \subseteq B$|A.issubset(B) 혹은 A \<= B|

````python
aSet = {1,2,3,4,5}
bSet = {1,2,4,8,16}

# 원소 추가
aSet.add(6)
print(aSet)

# 원소 제거
aSet.remove(6)
print(aSet)

# 합, 교, 차
print(aSet | bSet)
print(aSet & bSet)
print(aSet - bSet)

print(aSet.union(bSet))
print(aSet.intersection(bSet))
print(aSet.difference(bSet))

# 상위, 하위
print(aSet >= bSet)
print(aSet <= bSet)
print(aSet >= (aSet - bSet))
````

````
{1, 2, 3, 4, 5, 6}

{1, 2, 3, 4, 5}

{1, 2, 3, 4, 5, 8, 16}
{1, 2, 4}
{3, 5}

{1, 2, 3, 4, 5, 8, 16}
{1, 2, 4}
{3, 5}

False
False
True
````
