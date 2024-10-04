---
title: programmers - 후보키
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- combination
- implementation
created: 2023-10-02
---

# 풀이

그냥 막 풀었다. 컨디션이 좋지 않다. 이전에 풀었던게 더 깔끔하더라. 그리고 같은 부분에서 틀렸다. 멍청해.

# Code

````python
from itertools import combinations

def solution(relation):
    index_gen_list = [ i for i in range(len(relation[0]))]
    col_combi = []
    for size in range(1, len(relation[0])+1):
        combi = [x for x in list(combinations(index_gen_list, size))]
        for i in combi:
            col_combi.append(",".join(list(map(str, i))))
    
    answer_list = []
    for candidate in col_combi:
        A = set()
        for row in range(len(relation)):
            temp = ""
            for col in candidate.split(","):
                temp += (str(col) + "_" + relation[row][int(col)])
            A.add(temp)
        
        if len(A) == len(relation):
            flag = False
            for ans in answer_list:
                count = 0
                for a in ans:
                    if a in candidate:
                        count += 1
                if count == len(ans):
                    flag = True
                    break
            if flag == False:
                answer_list.append(candidate)
    return len(answer_list)
````

# Reference

* [후보키](https://programmers.co.kr/learn/courses/30/lessons/42890)
