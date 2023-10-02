---
title: programmers - 주식가격
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- stack
- python
created: 2023-10-02
---

# 풀이

prices의 길이가 100,000이라 n^2으로 짜면 터질 것 같아 stack으로 구현했다. 그런데 이때, 특정 원소가 조사해야 하는 부분은 i+1부터 끝까지의 요소이다. 그 과정에서 중복이 발생하기 때문에 반대로 정렬한뒤 값을 구해주었다.

근데 문제는, n^2으로 풀어도 통과한다는 점이다..하.. 

# Code

````python
def solution(prices):
    # prices = [4, 3, 1, 4, 5, 2, 7, 2, 3, 4]
    # prices = [1, 2, 3, 2, 3, 1]
    reverse_prices = prices[::-1]
    stack, ans = [], []
    for i in range(len(reverse_prices)):
        now = reverse_prices[i]
        if not stack: 
            ans.append(0)
            stack.append(now)
            continue
        last = stack[-1]
        
        if now <= last:
            # 앞으로 가면서 찾아
            idx, count = len(stack)-1, 0
            while idx >= 0:
                if stack[idx] < now:
                    break
                count += 1
                idx -= 1
            if idx < 0:
                ans.append(count)
            else:
                ans.append(count+1)
            stack.append(now)
        else:
            ans.append(1)
            stack.append(now)
    return ans[::-1]
````

# 풀이 2

좀 단순하게 다시 생각해봤다. 결국 문제 생기는 것은 가격이 덜어졌을 때이다. 그 때 어떻게 처리를 해줄까? 가격이 떨어지는 이벤트가 발생했을 때, 지금 가격이전의 가격들을 보면서 그냥 그 거리가 얼마인지 체크해준다. 그러면 이전 가격들 중에 현재 가격으로 인해서 가격이 떨어졌다고 판단된 녀석들은 이미 답을 구했기 때문에 다시 볼 필요가 없다.

아.. 굉장히 쉬운 것이였군.. 이거 백준에서 풀어본 기억이 있다. 일단 index를 stack에 넣는 아이디어. 그리고 stack안의 원소를 증가하는 방향으로 만들어서 작업을 진행하는 아이디어가 있던 것이 기억난다.

# code 2

````python
def solution(prices):
    ans, stack = [0] * len(prices), []
    
    for now, price in enumerate(prices):
        if stack:
            while stack and price < prices[stack[-1]]: # 스택안에 원소가 있고, 현재가격이 이전 가격보다 떨어졌다면
                past = stack.pop()
                ans[past] = now-past
        stack.append(now)
    for i in stack: # 이제 스택은 비내림차순으로 정렬되어 있다. 그리고 그 안의 원소는 시간임. 지금까지 살아있는 원소는 끝까지 돌았는데도 남아있는 것들임
        ans[i] = len(prices)-(i+1) # 총 시간에서 해당 가격의 시간을 빼준다.
    return ans
````

# Reference

* [주식가격](https://school.programmers.co.kr/learn/courses/30/lessons/42584)
