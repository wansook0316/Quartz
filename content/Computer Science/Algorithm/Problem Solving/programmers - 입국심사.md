---
title: programmers - 입국심사
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

일단 input보고 항상 판단하는 것이 중요하다. 방향만 잘 잡으면 어느정도 풀 수 있다. 이제.

이분 탐색의 핵심은 결국 값을 제안하고, 그 값이 맞는지 틀린지를 검증하는 로직을 찾을 수 있냐는 것이다. 이 부분에서 고민을 좀 많이 했는데, 입출력 예가 너무 나를 혼란스럽게 했다.

그냥 숫자만 딱 보고 생각하면, 가장 작은 시간을 소요하는 심사관한테 모든 사람을 다 때려넣어본다. 그러면 제안한 시간에 대해 이사람이 처리할 수 있는 사람의 상한이 나오는데, 그걸 기준으로 생각한다.

예를 들어 100분동안 처리할거야! 라고 제안했는데, 7분 걸리는 심사관은 그 시간동안 처리할 수 있는 사람의 수가 14명인 것. 그러면 이 사람보다 시간이 많이 걸리는 사람의 경우 이것보다 적은 사람을 처리하게 된다.

이렇게 간단하게 생각하면 문제가 풀린당.

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
