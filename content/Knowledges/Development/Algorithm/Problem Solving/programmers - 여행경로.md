---
title: programmers - 여행경로
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- BFS
- python
created: 2023-10-02
---

# 풀이

BFS로 풀었는데, 배열이 reference로 전달되어 애먹었다.

# Code

````python
from collections import deque

def solution(tickets):
    answers = []
    q = deque()
    used = [False for _ in tickets ]
    answer = ["ICN"]
    q.append(["ICN", used, answer])
    
    while q:
        start, used, answer = q.pop()
        
        if all(used):
            answers.append(answer)
        
        for i, (s, e) in enumerate(tickets):
            if s == start and used[i] == False:
                _used = used[:]
                _answer = answer[:]
                _used[i] = True
                _answer.append(e)
                q.append([e, _used, _answer])
    # print(answers.sort())
    answers.sort()
    return answers[0]
````

# Reference

* [여행 경로](https://programmers.co.kr/learn/courses/30/lessons/43164)
