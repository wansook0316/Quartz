---
title: programmers - 다리를 지나는 트럭
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- simulation
- python
created: 2023-10-02
---

# 풀이

시뮬레이션 문제이다. 시뮬레이션 문제는 순서를 명확하게 이해하고 이를 지켜주는 것이 매우 중요하다. 항상 집중해서 이부분은 확인할 것

# Code

````python
from collections import deque

def solution(bridge_length, weight, truck_weights):
    answer = 0
    t = 0
    bridge_in = 0
    truck = deque(truck_weights)
    bridge = deque()
    
    while truck or bridge: # 트럭이 남아 있으면
        t += 1
        # 다리에서 내리기
        if bridge: # 다리에 타있으면 먼저 내려
            a = bridge.popleft()
            bridge_in -= a[0]
            if t - a[1] < bridge_length: #들어온 시간이 아직 덜됐으면 다시 태우기
                bridge.appendleft(a)
                bridge_in += a[0]
            
        
        
        
        # 태우기
        if truck:
            tr = truck.popleft()
            if bridge_in+tr <= weight: # 이미 타있는 것과 지금꺼 추가해서 탈 수 있으면
                bridge.append((tr, t)) # 다리 탑승
                bridge_in += tr
            else: # 탈수 없으면
                truck.appendleft(tr) # 원상 복귀
        
        
    
    answer = t
    return answer
````

# Reference

* [다리를 지나는 트럭](https://school.programmers.co.kr/learn/courses/30/lessons/42583)
