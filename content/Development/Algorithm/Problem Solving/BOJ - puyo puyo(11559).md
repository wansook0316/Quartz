---
title: BOJ - puyo puyo(11559)
thumbnail: ''
draft: false
tags:
- BOJ
- algorithm
- python
created: 2023-10-02
---

***골드5*** : 구현 문제이다.

# 풀이

구현에 쪼는 줄 알았는데 생각보다 할만해서 또 도전할 예정

# Code

````python
import sys
from pprint import pprint
from collections import deque

input = sys.stdin.readline
field = []
for _ in range(12):
    a = input().strip()
    field.append([b for b in a])


def BFS(s, y, x):
    d = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    visited = [[False for _ in range(6)] for _ in range(12)]
    memory = [[y, x]]
    visited[y][x] = True
    q = deque()
    q.append([y, x])

    while q:
        y, x = q.pop()
        for dy, dx in d:
            ny, nx = y + dy, x + dx
            if (
                0 <= ny < 12
                and 0 <= nx < 6
                and not visited[ny][nx]
                and field[ny][nx] == s
            ):
                visited[ny][nx] = True
                q.append([ny, nx])
                memory.append([ny, nx])
    return memory


def rebase():
    for i in range(11, -1, -1):
        for j in range(6):
            if field[i][j] == ".":
                continue
            move(i, j)


def move(y, x):
    cur = y + 1
    while True:
        if cur >= 12 or field[cur][x] != ".":
            break
        cur += 1
    if cur - 1 != y:
        field[cur - 1][x] = field[y][x]
        field[y][x] = "."


ans, flag = 0, True
while flag:
    flag = False

    for i in range(len(field)):
        for j in range(len(field[0])):
            if field[i][j] == ".":
                continue
            coordinates = BFS(field[i][j], i, j)
            if len(coordinates) < 4:
                continue

            for y, x in coordinates:
                field[y][x] = "."

            flag = True
    # pprint(field)
    rebase()
    # pprint(field)
    if flag:
        ans += 1

print(ans)
````

# Reference

* [백준(11559번) - puyo puyo](https://www.acmicpc.net/problem/11559)
