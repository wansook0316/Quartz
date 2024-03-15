---
title: Dictionary
thumbnail: ''
draft: false
tags:
- python
- Dictionary
created: 2023-10-04
---

# Dictionary

사람은 누구든지 “이름” = “홍길동”, “생일” = “몇 월 몇 일” 등으로 구분 할 수 있다. 파이썬은 영리하게도 이러한 대응 관계를 나타낼 수 있는 자료형을 가지고 있다. 요즘 사용하는 대부분의 언어들도 이러한 대응 관계를 나타내는 자료형을 갖고 있는데, 이를 연관 배열(Associative array) 또는 해시(Hash)라고 한다.

파이썬에는 이 자료형을 딕셔너리라고 하는데, 기본적으로 Key, Value 라는 것을 한 쌍으로 갖는 자료형이다. 딕셔너리가 튜플이나 리스트와 가장 다른 점이라면, **순차적으로 해당 요소값을 구하지 않고 Key 를 통해 Value를 얻는다**는 점이다. 처음부터 다 뒤져보는 것이 아니고, Key가 있는 곳만 탐색한다는 것이다.

## Key list

````python
>>> a = {’name’: ’pey’, ’phone’: ’0119993323’, ’birth’: ’1118’}
>>> a.keys()
dict_keys([’name’, ’phone’, ’birth’])
````

## Items

````python
>>> a.items()
dict_items([(’name’, ’pey’), (’phone’, ’0119993323’), (’birth’, ’1118’)])
````

items 함수는 key와 value의 쌍을 튜플로 묶은 값을 dict items 객체로 돌려준다.

## Get

Key 로 Value 를 얻어보자.

````python
>>> a = {’name’:’pey’, ’phone’:’0119993323’, ’birth’: ’1118’}
>>> a.get(’name’)
’pey’
>>> a.get(’phone’)
’0119993323’
````

## 선언 방법 / Value 접근

````python
# 선언
author = {"python" : "person1", "c++" : "person2"}

# 접근
author["python"]

# 삭제
del author["python"]

# 추가
author["python"] = "person1"

for item in author:
    print(item, "is designed by ", author[item])
````

````
c++ is designed by  person2
python is designed by  person1
````

# 실습

## Example 1

(a) 다음과 같이 list 하나는 프로그래밍 언어를, 다른 list는 언어의 개발자 이름을 갖도록 선언합니다.

````python
language = ["python", "c++", "javascript", "go"]
author = ["Guido van Rossum", "Bjarne Stroustrup", "Brendan Eich", "Robert Griesemer"]
````

(b) 함수 matingPairs()를 만드는데, 입력 파라메타로 위의 두 리스트를 받아서, 결과롤 set 타입을 돌려줍니다.

(c) 함수 matingPairs()는 두 리스트에서 각각 하나의 값을 꺼내서 언어 이름별 저자의 tuple을 만든 후,

(d) 함수 matingPairs() 안의 내부 변수인 set 타입 데이터 타입에 (c)에서 만든 tuple을 아이템으로 추가해 줍니다.

(e) 모든 언어에 대한 저자 매핑과, 이를 set에 넣는 과정을 마치면, 함수 matingPairs()은 결과값으로 set를 돌려줍니다.

(f) 함수 matingPairs()의 결과값을 화면에 출력합니다.

````python
language = ["python", "c++", "javascript", "go"]
author = ["Guido van Rossum", "Bjarne Stroustrup", "Brendan Eich", "Robert Griesemer"]

def matingPairs(array1, array2):
    result_set = set()
    for i in range(len(array1)):
        temp_tuple = (array1[i], array2[i])
        result_set.add(temp_tuple)
    return result_set


matingPairs(language, author)
````

````
{('c++', 'Bjarne Stroustrup'),
 ('go', 'Robert Griesemer'),
 ('javascript', 'Brendan Eich'),
 ('python', 'Guido van Rossum')}
````

## Example 2

다음의 요구 사항에 맞는 프로그램을 개발하여 아래의 입력창을 통해서 실행합니다.

(a) `dictionary`의 `key`는 유일해야 하지만 `value`는 유일하지 않아도 됩니다.

(b) `count_values()` 라는 이름의 함수를 구현합니다.

(c) `count_values()` 함수는 하나의 dictionary를 입력 파라메타로 받아서, 이 dictionary가 포함한 서로 다른 value의 개수를 반환합니다.

(d) 예를 들어, `{'red': 1, 'green': 1, 'blue': 2}`가 입력 파라메타로 전달되면, 2를 반환합니다.

````python
def count_values(dic):
    set_dic = set()
    for item in dic:
        set_dic.add(dic[item])
    return len(set_dic)

dic = {'red' : 1, 'green' : 1, 'blue' : 2}

count_values(dic)
````

````
2
````
