---
title: programmers - 단어변환
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- BFS
- DFS
created: 2023-10-02
---

# 풀이

일단 DFS로 풀었다. 근데 풀이를 보니 다 BFS로 풀었더라. 그래서 다음날 다시 도전할 거다.

# DFS Code

````python
def solution(phone_book):
    from collections import deque

def diff(word1, word2):
    ret = 0
    for a, b in zip(word1, word2):
        if a != b:
            ret += 1
    return ret
    
def DFS(begin, visited, words, target, count):
    # print(begin, visited, words, target, count)
    global answer
    if begin == target:
        answer = min(answer, count)
    
    for w in words:
        if visited[w] == False and diff(begin, w) == 1:
            visited[w] = True
            DFS(w, visited, words, target, count+1)
            visited[w] = False

def solution(begin, target, words):
    global answer
    answer = 1e6
    if target not in words:
        return 0
    
    visited = { w:False for w in words }
    visited[begin] = True
    DFS(begin, visited, words, target, 0)
    return answer
````

# BFS Code

````python
from collections import deque

def diff(word1, word2):
    count = 0
    for i in range(len(word1)):
        if word1[i] != word2[i]:
            count += 1
    return count

def solution(begin, target, words):
    if target not in words: return 0
    
    answer = 0
    q = deque()
    q.append([begin, 0, []])
    
    while q:
        word, count, path = q.pop()
        
        if word == target:
            answer = count
            break
        
        for w in words:
            if diff(w, word) == 1 and w not in path:
                q.append([w, count+1, path + [w]])
    
    return answer
````

# Reference

* [단어 변환](https://programmers.co.kr/learn/courses/30/lessons/42557)
