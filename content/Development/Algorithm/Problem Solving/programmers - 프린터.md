---
title: programmers - 프린터
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- python
- implementation
created: 2023-10-02
---

# 풀이

그냥 막 풀었다. 컨디션이 좋지 않다.

# Code

````python
from collections import deque

def solution(priorities, location):
    p = [[index, value] for index, value in enumerate(priorities)]
    count = 0
    while p:
        loc, doc = p.pop(0)
        flag = False
        for i in range(len(p)):
            if p[i][1] > doc:
                p.append([loc, doc])
                flag = True
                break
        if flag: continue
        else:
            count += 1
            if loc == location:
                return count
        
        
````

# Reference

* [프린터](https://programmers.co.kr/learn/courses/30/lessons/42587)
