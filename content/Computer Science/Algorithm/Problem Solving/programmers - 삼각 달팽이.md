---
title: programmers - 삼각 달팽이
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- implementation
- python
created: 2023-10-02
---

# 풀이

그냥 풀었다. 

# Code

````python
from pprint import pprint
def solution(n):
#     4 3 2 1
#     5 4 3 2 1
#     6 5 4 3 2 1
#     b r t l 
    graph = [[0 for col in range(n)] for row in range(n)]
    command = ["b", "r", "t"] * (n//3 + 1)
    way = {"b": [1, 0], "r": [0, 1], "t": [-1, -1]}
    step = [ i for i in range(n, 0, -1) ]
    i, j, value = -1, 0, 0
    
    for c, s in zip(command, step):
        dy, dx = way[c]
        for _ in range(s):
            i, j, value = i+dy, j+dx, value+1
            graph[i][j] = value
            
    # pprint(graph)
    answer = []
    for i in range(len(graph)):
        for j in range(len(graph[0])):
            if graph[i][j]:
                answer.append(graph[i][j])
    return answer
                
        
````

# Reference

* [삼각 달팽이](https://programmers.co.kr/learn/courses/30/lessons/68645)
