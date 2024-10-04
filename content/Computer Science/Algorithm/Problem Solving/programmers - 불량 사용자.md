---
title: programmers - 불량 사용자
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- permutation
- python
created: 2023-10-02
---

# 풀이

순열로 해결했다. n이 작아서 가능했다. 순열로 가능한 순서의 모든 banned를 나열하고, 각각에 대해 가능한지 확인하여 문제를 해결했다.

# Cod

````python
from itertools import permutations

def check(users, banned):
    for u, b in zip(users, banned):
        if len(u) != len(b):
            return False
        for i in range(len(u)):
            if b[i] == "*": continue
            if u[i] != b[i]:
                return False
    return True

def solution(user_id, banned_id):
    # banned_id 개수 만큼의 가능한 순열 모두 생성
    # banned_id 하나씩 돌면서 되는 것 체크
    # 모두 가능하면 answer + 1
    answer = []
    permutations_list = permutations(user_id, len(banned_id))
    
    for c in permutations_list:
        if check(c, banned_id):
            answer.append(c)
    ans = []
    for a in list(map(sorted, answer)):
        ans.append("".join(a))
    return len(set(ans))
````

# Reference

* [불량 사용자](https://school.programmers.co.kr/learn/courses/30/lessons/64064)
