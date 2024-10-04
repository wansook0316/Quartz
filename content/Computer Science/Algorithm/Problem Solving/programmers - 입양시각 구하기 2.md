---
title: programmers - 입양시각 구하기 2
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
- group-by
created: 2023-10-02
---

***level4*** : 변수를 사용하는 문제이다.

# 생각

이 문제는 group by를 사용할 수 없다는 것이 핵심이다. group by 는 있는 값을 DISTINCT하게 판단하여 집합을 구성해주는 쿼리이다. 그런데 이 문제는 0~23의 범위에서의 count를 구하기 때문에 사용할 수가 없다.

## 해결

이 문제를 해결하기 위해서는 임의로 0에서 23까지의 범위를 만들고, 그 숫자에 따르는 개수를 파악하여 넣는 것이 효율적으로 보인다. 이런 방법을 sub Query라 부른다. 변수 선언 방법은 `SET`으로 한다.

# Code

````sql
SET @hour = -1;
SELECT @hour := @hour + 1 AS "HOUR", (
        SELECT COUNT(ANIMAL_ID) FROM ANIMAL_OUTS
        WHERE @hour = HOUR(DATETIME)
    ) AS "COUNT"
    FROM ANIMAL_OUTS
    WHERE @hour < 23
````

# Reference

* [프로그래머스 - 입양 시각 구하기 2](https://programmers.co.kr/learn/courses/30/lessons/59413)
