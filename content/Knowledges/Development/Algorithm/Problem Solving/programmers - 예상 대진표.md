---
title: programmers - 예상 대진표
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

아무 생각 없이 재귀로 풀었다.. 그냥 어느 위치에 있는지에 따라 값이 변하길래. 아마 최근에 정렬문제를 많이 푼 탓인가보다. 그래서 풀고나서 다른 분 코드를 보고 규칙을 나도 파악해 보기로 했다.

일단 사실 문제를 안읽었다. 문제를 읽어보니 이기면 id가 바뀌더라. 만약 3의 위치에 있는 사람이 이기게 되면 2의 id로 변하는 식. 그럼 위치에 따라 승리할 경우 그 다음라운드에서 순서가 결정된다. 예를 들어 3이면 2, 5면 3, 7이면 4인 식이다. 결국 1, 2 는 1로 , 3, 4는 2로 이런 식인데, 어떻게 하면 다음 라운드로 갈 수 있을까. 나눠주면 된다. 1을 더해서.

# Code

* 먼저 생각 없이 짠 코드

````python
import math
import sys
sys.setrecursionlimit(100000)
# 11000000
def go(l, r, a, b, total, game_round):
    m = (l+r)//2
    
    if l <= a <= m and m+1 <= b <= r: # 서로 다른 그룹이면
        return total-game_round
    elif l <= a <= m and l <= b <= m: # 왼쪽 그룹 이면
        return go(l, m, a, b, total, game_round+1)
    else:
        return go(m+1, r, a, b, total, game_round+1)
        

def solution(n,a,b):
    c = a if a < b else b
    d = a if a > b else b
    total_round = int(math.log2(n))
    return go(1, n, c, d, total_round, 0)
    


# 1112 1131

#A와 B의 위치만 알면 결정된다.
# log2(N) = 전체 라운드 수
# 반 잘라
    # a, b 다른 그룹? -> 전체 - 현재 depth(나눈선을 의미)
    # a, b 같은 그룹? -> go(해당 그룹)
````

* 규칙을 파악해 본 코드

````python
def solution(n,a,b):
    count = 0
    while a != b:
        a = (a+1) // 2
        b = (b+1) // 2
        count += 1
    return count
````

# Reference

* [예상 대진표](https://school.programmers.co.kr/learn/courses/30/lessons/12985)
