---
title: programmers - 전화번호 목록
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- python
- sort
- stack
created: 2023-10-02
---

# 풀이1

이게 보면, 전화번호 개수가 백만개라 단순히 비교로 풀면 n^2이라 박살난다. 그렇기 떄문에 다른 방법을 고민해야한다. 이 문제의 핵심은 결국 특정 단어가 접두어로 있는지에 대한 문제이다. 그렇기 때문에 startswith를 생각하는 것이 편하다. 자 그러면 시간을 어떻게 줄일까. 접두어가 존재하기 위해서는 일단 큰단어에서 작은 단어를 비교하는 것이 가능하다. 큰단어는 작은 단어의 접두어로 존재하는 것이 불가능하다. 그렇기 때문에 일단 길이를 기준으로 정렬하는 것이 좋아보인다. 그런데 그렇게 되면 문제가 생긴다. 여전히 비교하려면 n^2이다. 

따라서 정렬의 순서는, 앞의 자리수에 지배적으로 정렬이 돼되, 길이가 긴 경우 나중으로 가도록 해야 한다. 즉,

````
12 145 1589 23 235 26 2590
````

이런식으로 말이다. 이렇게 되면 일단 굉장히 편한게, 앞에 두개씩만 비교를 진행하면 왼쪽 요소의 접두어 존재 여부를 한번에 해결할 수 있다. 즉, 작은 길의의 문자열이 앞으로 오게 하면서, 그 부분적으로 길이 순서대로 정렬을 하고 싶은 것. 그런데 딱 이렇게 돌아가는것이 바로 문자열 정렬이다.

## Code

````python
def solution(phone_book):
    answer = True
    phone_book = sorted(phone_book)
    
    for a, b in zip(phone_book[:-1], phone_book[1:]):
        if b.startswith(a):
            answer = False
            break
    return answer
````

# 풀이2

이전에 풀었을 때는 정렬을 기반으로 풀었다. 그런데 일단 n2으로 풀면 안되더라. 그래서 일단 저번처럼 풀긴했는데, stack 풀이가 있었다. 

여기서 배워야 하는 점은, 발상을 반대로 하는 것이다. 그니까 나는 작은 번호를 큰 번호에서 찾으려고 했는데, 이런 발상을 할 경우 hash를 사용할 수가 없다. 해시는 특정 값이 있는지 없는지 탐색할 때 속도가 빠른 것이기 때문에 이런 장점을 이용할 수가 없기 때문이다.

그렇기 때문에 오히려 긴 문자열에서부터 접근하는 것이 좋다. 긴 문자열에서 접두어를 늘려가면서, 그 접두어가 있는지 확인하는 것. 이러면 사용가능하다.

문제의 접근 방법에 대해 더 많이 고민해야 한다.

## Code

````python
def solution(phone_book):
    hash_map = { num: 1 for num in phone_book }
    
    for phone_num in phone_book:
        word = ""
        for num in phone_num:
            word += num
            if word in hash_map and word != phone_num:
                return False
    return True



````

# Reference

* [전화번호 목록](https://school.programmers.co.kr/learn/courses/30/lessons/42577)
