---
title: programmers - 광고 삽입
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

아.. 시도를 총 세번했다.

1. 해시맵으로 발생할 수 있는 모든 구간에서 시청하고 있는 사람을 저장
   * 아이디어는 좋았으나, 실제 계산할 때 n^2을 피할 수 없음. 실패
1. 투포인터 알고리즘 생각, 모든 초에 대해 시청하고 있는 시청자수 파악
   * 시도는 좋았으나, 특정 시간에 대한 시청자수를 구하는데 있어서 n^2 소요. 시간초과
1. 시작시점 +1, 끝나는 시점 -1로 표기하고, 순차적으로 진행하면서 시청자수를 늘리는 방법 시도

마지막 방법에서 성공했다. 다른 사람의 코드를 보니, 누적 시청자를 구해서 빼는 방법으로도 답을 구하더라.

# Code

````python
from itertools import chain
from functools import reduce
def time2sec(time):
    h, m ,s = map(int, time.split(":"))
    return 3600*h + 60*m + s

def sec2time(sec):
    h = str(sec//3600) if len(str(sec//3600)) % 2 == 0 else "0" + str(sec//3600)
    m = str((sec%3600)//60) if len(str((sec%3600)//60)) % 2 == 0 else "0" + str((sec%3600)//60)
    s = str((sec%3600)%60) if len(str((sec%3600)%60)) % 2 == 0 else "0" + str((sec%3600)%60)
    return f'{h}:{m}:{s}'

def solution(play_time, adv_time, logs):
    start_time_sec = 0
    play_time_sec = time2sec(play_time)
    adv_time_sec = time2sec(adv_time)
    logs = [list(map(time2sec, l.split("-"))) for l in logs]
    participants = [0 for _ in range(play_time_sec+1)]
    
    for s, e in logs:
        participants[s] += 1
        participants[e] += -1
    
    for i in range(1, len(participants)):
        participants[i] += participants[i-1]
    
    i, j = 0, adv_time_sec
    time = reduce(lambda x, y: x+y, participants[:adv_time_sec])
    max_time, start_time = 0, 0
    for start in range(play_time_sec-adv_time_sec):
        if time > max_time:
            max_time = time
            start_time = i
        time -= participants[i]
        time += participants[j]
        i += 1
        j += 1
    if time > max_time:
        max_time = time
        start_time = i
    return sec2time(start_time)
````

# Reference

* [광고 삽입](https://programmers.co.kr/learn/courses/30/lessons/72414#)
