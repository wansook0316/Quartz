---
title: programmers - DATETIME에서 DATE로 형변환
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
created: 2023-10-02
---

***level2*** : SQL 사용

# 생각

간단하다. 예시를 보고 외우던가 나중에 찾아보자.

# Code

````sql
SELECT ANIMAL_ID, NAME, DATE_FORMAT(DATETIME, "%Y-%m-%d") AS "날짜"
    FROM ANIMAL_INS;
````

# Reference

* [프로그래머스 - DATETIME에서 DATE로 형 변환](https://programmers.co.kr/learn/courses/30/lessons/59414)
