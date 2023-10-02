---
title: programmers - 더 맵게
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- heap
- python
created: 2023-10-02
---

# 풀이

가장 최소인 녀석을 계속해서 뽑아야 하기 때문에 heap 구조를 사용했다. 이 때 python으로 코딩을 하려한다면 무조건적으로 heapq를 사용할 것. priorityQueue는 속도가 너무 느려서 효율성 통과를 하지 못한다.

# Code

````python
import heapq
def solution(scoville, K):
    # 가장 작은 원소를 가져온다
    #   그 녀석이 K보다 큰지 파악한다.
    # 아니면
    #   그 다음 원소를 가져온다
    #   섞는다.
    #   섞은 횟수 1추가한다.
    #   다시 넣는다.
    # 반복한다.
    q = scoville[:]
    heapq.heapify(q)
    count = 0
    while q[0] < K and len(q) > 1: # 제일 작은 원소가 K보다 작고 들어간 개수는 2이상이면 진행
        a = heapq.heappop(q)
        b = heapq.heappop(q)
        c = a + b * 2
        heapq.heappush(q, c)
        count += 1
    
    if q[0] >= K:
        return count
    else:
        return -1

````

# Reference

* [더 맵게](https://school.programmers.co.kr/learn/courses/30/lessons/42626)
