---
title: programmers - N으로 표현
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- dynamic-programming
- python
created: 2023-10-02
---

# 풀이

실패했다. 뭔가 감은 오는데 기존의 dp처럼 풀려고 하니 문제가 안잡히는 기분. 일단 접근 방법은 맞으니, 엑셀처럼 나열하면서 규칙을 찾는 것이 좋다. 그리고 dp의 핵심은 기존의 연산이 나중에 연산을 할 때 할 필요가 없다는 것인데, 여기서 1+1+1과 같은 경우가 1+2에서 처리된다는 것을 배웠다.

# Code

````python
def solution(N, number):
    # 사용한 N의 개수를 기반으로 만들 수 있는 수를 넣어둠
    # 일단 사용할 수 있는 N의 개수는 8이하기 때문에 8개의 공간이 생길 예정
    
    # dp[i] = i번 N을 사용하여 만들 수 있는 수
    
    dp = [ set([int(str(N)*x)]) if x != 0 else 0 for x in range(9)]
    
    for i in range(2, 9):
        for j in range(1, i): # j, i-j
            
            for a in dp[j]:
                for b in dp[i-j]:
                    dp[i].add(a+b)
                    if a-b >= 0:
                        dp[i].add(a-b)
                    else:
                        dp[i].add(b-a)
                    dp[i].add(a*b)
                    
                    if b != 0 and a%b == 0:
                        dp[i].add(int(a/b))
                    if a != 0 and b%a == 0:
                        dp[i].add(int(b/a))
    answer = -1
    for i in range(1, len(dp)):
        if number in dp[i]:
            answer = i
            break
    return answer
````

# Reference

* [N으로 표현](https://programmers.co.kr/learn/courses/30/lessons/42895)
