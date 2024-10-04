---
title: programmers - 실패율
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

일단, 200,000이라서 n^2은 안된다. 그러면 한번에 가야하는데, 이 때, 잘 살펴보면, 해당 스테이지에서의 실패율은 stage잔존 수/stage 통과수로 정의된다. 통과수의 경우 4스테이지에 있는 경우 이전 1, 2, 3스테이지에 있을 때 모두 카운트가 되기 때문에 이부분을 잘 살펴야 한다.

즉, 현재 스테이지에 있는 수 / 현재 스테이지보다 큰 스테이지에 있는 사람수 가 실패율이다. 여기까지 도달했다면, 어떻게 하면 큰 스테이지 수를 쉽게 구하는지 생각해볼 수 있는데, 정렬을 하게 되면 포인터를 쭉 이동하면서 한번에 풀이가 가능하다.

맞다. 0인경우 처리잘해주어야 한다.

# Code

````python
def solution(N, stages):
    success = dict([[x, 0] for x in range(1,N+2)])
    tries = dict([[x, 0] for x in range(1,N+2)])
    
    stages.sort()
    i = 0
    stage_num = 1    
    while i < len(stages):
        if stages[i] == stage_num:
            success[stage_num] += 1
            i += 1
        else:
            tries[stage_num] = len(stages)-i
            stage_num += 1
    
    fail_ratio = []
    for num in range(1, N+1):
        if success[num]+tries[num] == 0:
            fail_ratio.append([num, 0])
        else:
            fail_ratio.append([num, success[num]/(success[num]+tries[num])])
    
    fail_ratio = sorted(fail_ratio, key=lambda x: (x[1], -x[0]), reverse=True)
    
    return [x[0] for x in fail_ratio]
````

# Reference

* [실패율](https://programmers.co.kr/learn/courses/30/lessons/42889)
