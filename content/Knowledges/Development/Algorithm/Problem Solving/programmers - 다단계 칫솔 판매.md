---
title: programmers - 다단계 칫솔 판매
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

정말 미쳐버리겠다. 왜 구현을 못하지. 왜 while문으로 구현을 못하는 걸까. 푸는 방법 다 알아놓고. 미쳐버리겠다. 진짜

# Code

````python
import sys
sys.setrecursionlimit(1000000)

def cal(name, price, money, head):
    if name == '-' or price <= 0:
        return
    # 돈계산
    give = int(price*0.1)
    take = price - give
    
    # 돈 넣기
    money[name] += take
    
    # 다음 녀석 계산
    next_name = head[name]
    cal(next_name, give, money, head)
    
def solution(enroll, referral, seller, amount):
    # 이름 : 번돈 해시
    # 이름 : 윗대가리 해시
    
    money = dict([(e, 0) for e in enroll])
    head = dict([(e, r) for e, r in zip(enroll, referral)])
    
    for name, m in zip(seller, amount):
        price = 100 * m
        cal(name, price, money, head)
    
    return list(money.values())
````

그리고 여기서 price가 0보다 작을 경우 조건을 안 걸어주면 시간초과난다. 런타임 에러가 뜰 경우 재귀 호출의 문제가 있을 수 있고, 재귀를 해제하더라도 시간초과가 난다는 것은 depth가 너무들어갔다는 얘기. 그렇다면 이를 중간에 가지치기 할 수 있다.

# Code2

````python
    
def solution(enroll, referral, seller, amount):
    # 이름 : 번돈 해시
    # 이름 : 윗대가리 해시
    
    money = dict([(e, 0) for e in enroll])
    head = dict([(e, r) for e, r in zip(enroll, referral)])
    
    for name, m in zip(seller, amount):
        price = 100 * m
        
        while True:
            if name == "-" or price <= 0:
                break
            next_money = int(price * 0.1)
            money[name] += price - next_money
            
            name = head[name]
            price = next_money
        
        # cal(name, price, money, head)
    
    return list(money.values())

````

아니 이 간단할걸 왜 1시간동안 붙잡고 있냐고. 괜히 쫄아서 그래. 할 수 있는데 쫄아서. 쫄지마. 왠만한거 다 풀 수 있다.

# Reference

* [다단계 칫솔 판매](https://school.programmers.co.kr/learn/courses/30/lessons/77486)
