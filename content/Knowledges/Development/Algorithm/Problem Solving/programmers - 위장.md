---
title: programmers - 위장
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- hash
- python
created: 2023-10-02
---

# 풀이

쉬워서 패스. 해시사용 문제이다.

# Code

````python
def solution(clothes):
    cloth_dict = dict()
    for c in clothes:
        value, key = c
        if key not in cloth_dict:
            cloth_dict[key] = []
        cloth_dict[key].append(value)
    ans = 1
    for c in cloth_dict:
        ans *= (len(cloth_dict[c])+1)
    return ans-1
        
````
