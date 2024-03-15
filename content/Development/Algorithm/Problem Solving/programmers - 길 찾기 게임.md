---
title: programmers - 길 찾기 게임
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- tree
- python
created: 2023-10-02
---

# 풀이

트리 구현을 한번도 안해보다가 처음으로 했다. 첫 시도에서는 바로 구현을 못하고 다른 코드를 참고 했다. 반복적으로 연습하면서 체득을 해야 겠다.

# Code

````python
def solution(n, times):
    
    def isOk(value):
        numOfPerson = 0
        i = 0
        while numOfPerson <= n and i < len(times):
            numOfPerson += (value//times[i])
            i += 1
    
        if numOfPerson >= n: return True
        else: return False
    
    times.sort()
    left, right = 1, times[-1]*n
    while left < right :
        
        mid = (left+right)//2
        if isOk(mid): 
            right = mid
        else: # 제안한 값이 넘치는 경우 10 > 6
            left = mid+1
    
    return right
````

# Reference

* [입국심사](https://programmers.co.kr/learn/courses/30/lessons/43238)
