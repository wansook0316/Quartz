---
title: programmers - 중성화 여부 판단하기
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
- case-when
created: 2023-10-02
---

***level2*** : case when을 사용하는 문제이다.

# 생각

쿼리로 가져온 table에 대해서 추출을 진행할 때, 사용할 수 있는 테크닉이다. 이건 예제로 보는 것이 정확하다.

# Code

````sql
SELECT ANIMAL_ID, NAME,
        CASE WHEN
            (SEX_UPON_INTAKE LIKE "Neutered%" OR SEX_UPON_INTAKE LIKE "Spayed%") THEN "O"
            ELSE "X"
        END AS "중성화"
    FROM ANIMAL_INS
    ORDER BY ANIMAL_ID;
````

# Reference

* [프로그래머스 - 중성화 여부 판단하기](https://programmers.co.kr/learn/courses/30/lessons/59409)
