---
title: programmers - 우유와 요거트가 담긴 장바구니
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
created: 2023-10-02
---

***level4*** : table을 분리하는 방법을 사용해보자.

# 생각

문제가 잘 안풀리면, 제공해주는 table을 분리하고, 그 분리한 table로 부터 원하는 결과를 도출해보자. 즉 sub query를 사용해서 임의로 table을 만드는 것.

# Code

````sql
SELECT A.CART_ID FROM
    (SELECT CART_ID FROM CART_PRODUCTS WHERE NAME = "우유") A
    INNER JOIN # 둘다 있는것만 가져옴
    (SELECT CART_ID FROM CART_PRODUCTS WHERE NAME = "요거트") B
    ON A.CART_ID = B.CART_ID
````

# Reference

* [프로그래머스 - 우유와 요거트가 담긴 장바구니](https://programmers.co.kr/learn/courses/30/lessons/62284)
