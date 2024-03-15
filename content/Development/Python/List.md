---
title: List
thumbnail: ''
draft: false
tags:
- python
- list
created: 2023-10-04
---

지금까지, 정수, 실수 문자열을 다루는 법을 배웠다. 그런데 하나의 값 말고, 여러개를 다룰 필요가 있다면 어떡해야할까? 이런 용도를 위해 python은 리스트를 제공하고 있다. 그리고 특히 **서로 다른 타입의 값과 변수** 를 함께 다루면서 읽고/쓸 수 있다는 장점을 제공한다.

# List

# 수정

````python
>>> a[1:2] [2]
>>> a[1:2] = [’a’, ’b’, ’c’]
>>> a
[1, ’a’, ’b’, ’c’, 4]
````

````python
>>> a[1] = [’a’, ’b’, ’c’]
>>> a
[1, [’a’, ’b’, ’c’], 4]
````

2번 예제에서 리스트를 `a[1:2] = [‘a’, ‘b’, ‘c’]`로 수정하는 것과 `a[1] = [‘a’, ‘b’, ‘c’]`로 수정하는 것은 전혀 다른 결과값을 갖게 되므로 주의해야 한다. `a[1] = [‘a’, ‘b’, ‘c’]`는 리스트 a의 두 번째 요소를 `[‘a’, ‘b’,‘c’]`로 바꾼다는 말이고
`a[1:2]는 a[1]에서 a[2]` 사이의 리스트를 `[‘a’, ‘b’, ‘c’]`로 바꾼다는 말이다. 따라서 `a[1] = [‘a’, ‘b’, ‘c’]`로 수정하게 되면 위와는 달리 리스트 a가 `[1, [‘a’, ‘b’,‘c’], 4]`라는 값으로 변하게 된다.

# 삭제

### \[ \] 사용해 리스트 요소 삭제하기

````python
>>> a[1:3] = [ ]
>>> a
[1, ’c’, 4]
````

### del 함수 사용해 리스트 요소 삭제하기

````python
>>> a
[1, ’c’, 4]
>>> del a[1]
>>> a
[1, 4]
````

# 리스트 관련 함수

## append

````python
>>> a = [1, 2, 3]
>>> a.append(4)
>>> a
[1, 2, 3, 4]
````

## sort

````python
>>> a = [1, 4, 3, 2]
>>> a.sort()
>>> a
[1, 2, 3, 4]
````

````python
>>> a = [’a’, ’c’, ’b’]
>>> a.sort()
>>> a
[’a’, ’b’, ’c’]
````

## insert

````python
>>> a = [1, 2, 3]
>>> a.insert(0, 4)
[4, 1, 2, 3]
````

## remove

````python
>>> a = [1, 2, 3, 1, 2, 3]
>>> a.remove(3)
[1, 2, 1, 2, 3]
````

첫번째로 나오는 녀석을 삭제한다.

## pop

pop( )은 리스트의 맨 마지막 요소를 돌려 주고 그 요소는 삭제하는 함수이다.

````python
>>> a = [1,2,3] >>> a.pop()
3
>>> a
[1, 2]
````

# 리스트 아이템 이해하기

````python
course = [ "Python", "Javascript", "C++", "__reserved__" ]

course[3] = "Go"
````

이러면 리스트 요소를 바꿀 수 있다.

````python
course[1].upper()

>>> JAVASCRIPT
````

각 리스트 요소의 타입에 따른 메소드를 활용할 수 있다.

````python
newStr = course[1] + " language"

>>> Javascript language
````

1번 요소가 str 이기 때문에 더해서 새로운 string 을 만들 수 있다.

````python
print(len(course))
print(max(course))
print(min(course))
print(sorted(course))
print(sorted(course, reverse = True))
````

````python
>>> 4
>>> python
>>> C++
>>> ['C++', 'Go', 'Javascript', 'python']
>>> ['python', 'Javascript', 'Go', 'C++']
>>> ['python', 'Javascript', 'C++', 'Go', 'HTML', 'CSS3']
````

# in 연산자

````python
print("C" in course)
print(1 in [0,1,2,3])

>>> False
>>> True
````

리스트 안에 해당 요소가 있는지 검사하는 연산자 이다. 매우 유용하다!

# List Slicing

기존에 String 에서 Slicing 을 배웠는데, 비슷한 방식으로 작동한다.

````python
print(course[0:4:2])
print(course[1:4:2])

>>> ['Javascript', 'C++']
>>> ['Python', 'C++']
````

이 때 뒤에서 부터 거꾸로 불러올 수도 있는데, 이 부분을 기억해 두는 것이 중요하다.

````python
print(course[::-1])
print(course[4:0:-2])

>>> ['__reserved__', 'C++', 'Javascript', 'Python']
>>> ['__reserved__', 'Javascript']
````

시작점을 끝으로, 종료지점을 앞에 있는 인덱스로 선택하고, 맨뒤의 파라미터를 부호를 거꾸로 해서 주면 위와 같이 출력된다. 즉. 맨뒤의 파라미터는 등차수열의 공차라 생각하면 좋다.

# List copy, aliasing

파이썬은 C++ 처럼 선언을 할 때, 계속해서 메모리 공간에 값이 저장되는 형식이 아닌, 만약 같은 값을 선언한다면 해당 변수 안에는 값이 저장되어 있는 주소를 가리키는 방식으로 작동한다. 즉, 기본적으로 Shallow copy를 기반으로 작동한다. 따라서 내가 특정 변수를 다른 변수이름으로 가져온다면 C++의 참조변수와 같은 개념으로 작동한다.

````python
course = [ "Python", "Javascript", "C++", "__reserved__" ]

courseAliasing = course # Alising

print(courseAliasing)

>>> [ "Python", "Javascript", "C++", "__reserved__" ]
````

이 때 `courseAliasing` 변수는 `course` 변수가 작동하는 방식과 똑같이 각각의 요소를 가리키는 주소들이 묶여있는 녀석이 된다. 그런데 만약 메모리 공간에 `course` 안에 들어간 요소들을 메모리 공간에 똑같이 복사한 녀석이 갖고 싶다면 어떻게 해야할까? 딥카피를 하고 싶다면?

````python
courseCopy = course[:]

print(courseCopy)

>>> [ "Python", "Javascript", "C++", "__reserved__" ]
````

이렇게 써주면 된다. 즉, **슬라이싱을 하게 되면 DeepCopy 방식으로 작동** 한다. 위의 두 리스트 요소의 값을 바꿔보며 차이를 확인해보자.

````python
print("[Before]")
print("course: ", course)
print("courseAliasing: ",courseAliasing)
print("courseCopy: ", courseCopy)

courseAliasing[3] = "CSS3"
courseCopy[3] = "HTML5"

print("[After]")
print("course: ", course)
print("courseAliasing: ",courseAliasing)
print("courseCopy: ", courseCopy)
````

`courseAliasing` 리스트의 값을 바꾼후, 원래 `course` 리스트를 출력해 보고, `courseCopy` 리스트의 값을 바꾼후 출력해보자.

````
[Before]
course:  ['Python', 'Javascript', 'C++', '__reserved__']
courseAliasing:  ['Python', 'Javascript', 'C++', '__reserved__']
courseCopy:  ['Python', 'Javascript', 'C++', '__reserved__']
[After]
course:  ['Python', 'Javascript', 'C++', 'CSS3']
courseAliasing:  ['Python', 'Javascript', 'C++', 'CSS3']
courseCopy:  ['Python', 'Javascript', 'C++', 'HTML5']
````

`courseAliasing` 변수를 변화시키니 `course` 요소의 값도 변화했다. 그리고 `courseCopy` 값은 `course` 와 별개로 작동하는 것을 알 수 있다.

# 입력 파라미터로의 리스트

C++ 에서는 입력파라미터로 값을 넘기면, 이 값을 함수내에서 정의된 변수에 딥카피를 해서 가져온 다음 처리를 거친 후 리턴하고, 안의 지역변수들은 사라진다.

하지만 파이썬은 기본적으로 c++ 에서의 참조변수로 모든 것이 돌아가기 때문에, 내가 함수의 입력변수로 리스트를 전달한 후, 함수내에서 리스트 내부를 수정/변경할 경우 함수가 끝난 후에도 여전히 리스트는 **수정된 상태로** 유지된다.

````python
def removeTailItem(givenList):
    del givenList[-1]
    print("[in removeTailItem] ", givenList)
````

다음과 같이 리스트의 가장 끝값을 지우는 함수를 만들었다.

````python
course = [ "Python", "Javascript", "C++", "__reserved__" ]
print("[Before function call] ", course)

removeTailItem(course)

print("[After function call] ", course)
````

그리고 리스트를 만들고, 함수실행 이전과 이후의 `course` 리스트 변경이 되었는 지 확인해보자.

````
[Before function call]  ['Python', 'Javascript', 'C++', '__reserved__']
[in removeTailItem]  ['Python', 'Javascript', 'C++']
[After function call]  ['Python', 'Javascript', 'C++']
````

`course` 의 요소가 변경된 것을 알 수 있다.

# 중첩된 리스트

C++과 같이 리스트안에 요소로 리스트를 줄 수 있다. 접근하는 방법은 같으므로 생략하도록 하겠다.

# Method of List

역시 리스트로 클래스로 구성되어 있으며, 기본적으로 제공되는 method가 있다. 꼭 필요한 것만 정리 해보면,

1. `append()` : 리스트에 아이템을 마지막에 추가함
1. `extend()` : 리스트에 주어진 리스트의 아이템을 마지막에 추가함
1. `insert()` : 리스트의 주어진 위치에 주어진 아이템을 삽입하고, 삽입된 위치의 기존 아이템은 뒤에 위치하도록 함
1. `remove()` : 리스트내에서 주어진 아이템과 동일한 아이템을 모두 제거함
1. `count()` : 리스트에서 주어진 아이템과 동일한 아이템의 갯수를 카운트함
1. `sort()` : 리스트내의 아이템을 순서대로 정렬함
1. `reverse()` : 리스트내의 아이템을 역순으로 정렬함
1. `pop()` : 리스트의 마지막 아이템을 돌려주면서, 해당 아이템을 리스트에서 제거함

## pop 하기

````python
course = [ "Python", "Javascript", "C++", "__reserved__" ]
print(course)

print(course.pop())
print(course)

>>> ['Python', 'Javascript', 'C++', '__reserved__']
>>> __reserved__
>>> ['Python', 'Javascript', 'C++']
````

## 정렬하기

````python
course.sort()
print(course)

>>> ['C++', 'Javascript', 'Python']
````

## 거꾸로 정렬하기

````python
course.sort(reverse = TRUE)
print(course)

>>> ['Python', 'Javascript', 'C++']
````

## 뒤에 요소 추가하기

````python
course.append("Go")
course.append(["HTML5", "CSS3"])
print(course)

>>> ['C++', 'Javascript', 'Python']
>>> ['C++', 'Javascript', 'Python', 'Go', ['HTML5', 'CSS3']]
````

## 거꾸로 출력하기

````python
course.reverse()
print(course)

>>> [['HTML5', 'CSS3'], 'Go', 'Python', 'Javascript', 'C++']
````

## 해당 요소 개수 출력하기

````python
print(course.count("C++"))

>>> 1
````

## 리스트 풀어서 추가하기

````python
course.extend(["what", 3, "question"])
print(course)

>>> [['HTML5', 'CSS3'], 'Go', 'Python', 'Javascript', 'C++', 'what', 3, 'question']
````

## 요소 지우기

````python
del course[0]

print(course)

>>> ['Go', 'Python', 'Javascript', 'C++', 'what', 3, 'question']
````

## 해당 요소의 인덱스 값 가져오기

````python
index_C = course.index('C++')
print(index_C)

>>> 3
````

## 삽입하기

````python
course.insert(4, love)
print(course)

>>> ['Go', 'Python', 'Javascript', 'C++', 'love', 'what', 3, 'question']
````

4번 인덱스 위치에 삽입했다.
