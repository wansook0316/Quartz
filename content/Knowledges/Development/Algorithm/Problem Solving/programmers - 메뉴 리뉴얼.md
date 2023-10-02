---
title: programmers - 메뉴 리뉴얼
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- implementation
- combination
created: 2023-10-02
---

# 풀이

처음에는 각각의 order의 메뉴와 다음 메뉴와의 교집합을 사용해서 풀려고 했으나 문제는, 결국 몇번 시켰는지 알아내야 한다는 점에서 막혔다. 그래서 combination을 통해 모든 course 개수만큼의 조합을 구하고 이를 세어서 dictionary에 저장한 후 count를 기반으로 sorting하여 가장 많이 선택된 녀석을 정답 배열에 넣는 방법으로 진행했다.

# Code

````python
from itertools import combinations

def solution(orders, course):
    answer = []
    
    for c in course:
        temp = []
        counter = dict()
        for o in orders:
            temp.extend(list(combinations(sorted(o), c)))
        
        A = set(temp)
        for a in A:
            counter[a] = temp.count(a)
        
        counter = sorted(counter.items(), key=lambda x: x[1], reverse=True)
        answer.extend(["".join(list(x[0])) for x in counter if x[1] > 1 and x[1] == counter[0][1]])
    
    answer = sorted(answer)
    return answer
````

근데 누가 Counter라는 것을 알려주었다.

````python
import collections
import itertools

def solution(orders, course):
    result = []

    for course_size in course:
        order_combinations = []
        for order in orders:
            order_combinations += itertools.combinations(sorted(order), course_size)

        most_ordered = collections.Counter(order_combinations).most_common()
        result += [ k for k, v in most_ordered if v > 1 and v == most_ordered[0][1] ]

    return [ ''.join(v) for v in sorted(result) ]
````

다른 건 코드짜는 방식의 차이이지만 집합 쓰고 dictionary썼던 것을 collections의 Counter를 써서 할 수 있는 점은 새롭다. 외워두자.

# Reference

* [메뉴 리뉴얼](https://school.programmers.co.kr/learn/courses/30/lessons/72411)
