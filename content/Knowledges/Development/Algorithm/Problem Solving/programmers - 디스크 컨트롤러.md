---
title: programmers - 디스크 컨트롤러
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

deque, heap을 통해서 구할 생각을 했다. 그런데 구현을 하는 점에 있어서 어떠한 요소가 필요하겠다고 생각하는 능력이 좀 떨어진다. 몇개의 변수를 사용하면 쉽게 구할 수 있다와 같은 판단을 하는 것이 모자라다. 

일단은 10개 테스트케이스는 맞는데 안맞길래, 내일 다시 도전한다. 일단은 다른 방법을 참고해서 해보았다.

# first Try

````python
import heapq
from collections import deque

def solution(jobs):

# 가장 먼저들어온 요청 처리
# 현재 시간이전에 들어온 요청들 중에서 작업 소요시간이 가장 짧은 녀석 부터 처리

# 정렬을 (요청 시각, 소요시간) 순으로 정렬
# deque에 넣기

# 작업의 종료 시간 = 0
# 0초부터 1000초까지 루프
    # 현재 시간에 대해 요청 들어온 것 heap에 추가
        # 큐에서 계속 뽑다가 다른 경우 다시 앞에 넣기
    
    # 작업 종료 시간이 요청 시간과 같다면
        # heap에 원소가 없다면 : 현재 시간까지 들어온 요청이 아직 없는 것임
        # heap에서 pop
            # 작업 종료 시간 = 해당 원소에 대해 작업 처리
            # 걸린 시간 더하기(대기 시간 포함)
    # 작업 종료 시간이 요청시간보다 크다면 : continue
    # 작접 종료 시간이 요청시간보다 작다면 : 할당
    
    totalTime = 0
    jobs = sorted(jobs, key=lambda x: (x[0], x[1]))
    q = deque(jobs)
    heap = []
    end_time = 0
    for time in range(1001):
        
        if end_time < time: end_time = time
        while q:
            req_time, duration = q.popleft()
            if req_time > time:
                q.appendleft([req_time, duration])
                break
            heapq.heappush(heap, (duration, req_time))

        if end_time == time:
            if not heap: continue
            duration, req_time = heapq.heappop(heap)
            if req_time > time:
                heapq.heappush(heap, (duration, req_time))
                break
            totalTime += ((end_time-req_time)+duration)
            end_time += duration # 작업 끝나는 시간 업데이트
        # print(time, end_time, totalTime)
        # print(q)
        # print(heap)
    return int(totalTime/len(jobs))

````

반만 맞은 풀이이다.

# second Try

````python
def solution(jobs):
    left, right = -1, 0
    total, i = 0, 0
    pq = []
    while i < len(jobs): # job의 개수만큼 반복
        # 작업 시작 시간 ~ 끝난 시간 사이에 발생하는 요청을 등록
        for j in jobs: # 특정 시간에 들어오는 요청들 모두 커버
            if left < j[0] <= right:
                heapq.heappush(pq, (j[1], j[0]))
        
        # 작업 큐에 들어온 작업을 처리
        if pq: # 작업 큐에 작업이 있다면
            current = heapq.heappop(pq)
            left = right
            right += current[0]
            total += (right-current[1])
            i += 1 # 작업을 하나 처리함
        else: # 작업큐에 작업이 없다면
            right += 1
    return int(total/len(jobs))
````

# Third Try

````python
from collections import deque
import heapq

def solution(jobs):
    jobs = sorted(jobs, key=lambda x: (x[0], x[1]))
    q = deque(jobs)
    heap = []
    i, time, total = 0, 0, 0
    while i < len(jobs):
        
        while q:
            job = q.popleft()
            if job[0] <= time:
                heapq.heappush(heap, (job[1], job[0]))
            else:
                q.appendleft([job[0], job[1]])
                break
        
        if heap:
            current = heapq.heappop(heap)
            time += current[0]
            total += (time-current[1])
            i += 1
        else:
            time += 1
    #     print(time, i, total)
    # print(i, time, total)
    return int(total/len(jobs))
````

생각보다 쉽게 풀렸다. 차분하게 풀어야 하는 듯

# Reference

* [디스크 컨트롤러](https://programmers.co.kr/learn/courses/30/lessons/42627#)
