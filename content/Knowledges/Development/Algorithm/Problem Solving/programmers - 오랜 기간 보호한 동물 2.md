---
title: programmers - 오랜 기간 보호한 동물 2
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
- tail-call-optimization
created: 2023-10-02
---

***level2*** : limit을 사용하는 문제이다.

# 생각

가져온 table에 대해 제한을 걸어, 그 만큼의 행만 가져오게 하는 문제이다.

# Code

````sql
SELECT A.ANIMAL_ID, A.NAME
    FROM (ANIMAL_INS A RIGHT JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID)
        WHERE B.ANIMAL_ID is NOT NULL # 전처리 : 입양만 보낸 동물은 있을 수 없다.
    ORDER BY (B.DATETIME - A.DATETIME) DESC
    LIMIT 2;
````

# Reference

* [프로그래머스 - 오랜 기간 보호한 동물 2](https://programmers.co.kr/learn/courses/30/lessons/59411)
