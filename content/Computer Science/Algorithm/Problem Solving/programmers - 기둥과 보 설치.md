---
title: programmers - 기둥과 보 설치
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- python
- implementation
created: 2023-10-02
---

# 풀이

구현 문제라 풀만하긴 한데, 코드가 깔끔히 짠다그래도 아직 부족하다. 다시한번 꼭 짜보자. 리팩토링 연습이다.

# Code

````python
# 기둥
    # 바닥 위
    # 보의 한쪽 끝 부분 위
    # 다른 기둥
# 보
    # 한쪽 끝이 기둥 위
    # 양쪽 끝부분이 다른 보와 동시에 연결


# 규칙에 맞지 않다면 설치가 되지 않음

# 삭제
    # 삭제 후 모든 보와 기둥은 위의 규칙을 만족해야 함
    # 만족하기 않을 경우 undo
    
# 조건
    # 명령어 build frame은 1000개
    # n은 100
    # 가로는 4
        # [x, y, a, b]
        # x, y는 교차점의 좌표
        # a는 종류 0 : 기둥, 1: 보
        # b는 설치 삭제 0: 삭제, 1설치
from pprint import pprint

def isColumnOk(y, x):
    global col_frame, beam_frame
    if y == floor:
        return True
    elif beam_frame[y][x-1] or beam_frame[y][x]:
        return True
    elif col_frame[y-1][x]:
        return True
    else:
        return False

def isBeamOk(y, x):
    global col_frame, beam_frame
    if col_frame[y-1][x] or col_frame[y-1][x+1]:
        return True
    elif beam_frame[y][x-1] and beam_frame[y][x+1]:
        return True
    else:
        return False

def isAllOk():
    global col_frame, beam_frame
    for y in range(len(col_frame)):
        for x in range(len(col_frame)):
            if col_frame[y][x] is not None:
                if not isColumnOk(y, x):
                    return False
            if beam_frame[y][x] is not None:
                if not isBeamOk(y, x):
                    return False
    return True

def transform2Answer():
    global col_frame, beam_frame
    ret = []
    for y in range(len(col_frame)):
        for x in range(len(col_frame)):
            if col_frame[y][x] is not None:
                ret.append([x, y, column])
            if beam_frame[y][x] is not None:
                ret.append([x, y, beam])
    ret.sort(key=lambda x: (x[0], x[1], x[2]))
    return ret

column, beam = 0, 1
deleting, building = 0, 1
floor = 0
def solution(n, build_frame):
    global col_frame, beam_frame
    col_frame = [[None for _ in range(n+1)] for _ in range(n+1)]
    beam_frame = [[None for _ in range(n+1)] for _ in range(n+1)]
    
    for x, y, struct_type, build_type in build_frame:

        if build_type == building:
            if struct_type == column:
                if isColumnOk(y, x):
                    col_frame[y][x] = 1
            elif struct_type == beam:
                if isBeamOk(y, x):
                    beam_frame[y][x] = 1
        elif build_type == deleting:
            if struct_type == column:
                col_frame[y][x] = None
            elif struct_type == beam:
                beam_frame[y][x] = None
                
            if not isAllOk():
                if struct_type == column:
                    col_frame[y][x] = 1
                elif struct_type == beam:
                    beam_frame[y][x] = 1
    return transform2Answer()
````

# Reference

* [기둥과 보 설치](https://programmers.co.kr/learn/courses/30/lessons/60061#)
