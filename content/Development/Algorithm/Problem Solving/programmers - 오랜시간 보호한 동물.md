---
title: programmers - 오랜시간 보호한 동물
thumbnail: ''
draft: false
tags:
- programmers
- algorithm
- SQL
- join
created: 2023-10-02
---

***level3*** : join을 사용하는 문제이다.

# 생각

이 문제를 풀기 위해서는, join이라는 쿼리가 어떻게 돌아가는 지 알아야 한다. right join, left join등 다양한 join의 방법이 있지만, 일단 기본적으로 join을 하면 그냥 합쳐진다. 그것이 핵심이다.

## Join

두 table을 합친다고 하면 어떻게 합칠 수 있을까? A의 table의 column과 B table의 column은 서로 다른 것으로 보아야 한다. 아니 애초에 왜 합칠까? 이것은 당연히 두 table의 어떠한 관계가 있기 때문이다. 엮을 수 있기 때문이다. 그렇다면 당연히 합친다는 행위에는 **무엇을 기준으로 두 행을 합칠 것인가?** 라는 질문이 들어야 한다. 이 값을 key라 한다.

집합과 같은 개념으로 보면 오히려 조금 헷갈릴 수 있다. 차라리 join은 두 table을 말 그래도 합치는 것이고 column도 늘어난다. 다만 어떤 행을 서로 엮어줄 지에 대한 정보가 필요할 뿐.

그렇게 생각하면 이 문제는 상당히 쉽다.

## 풀이

* 보호소에 있는 테이블(in)을 A, 입양을 간 테이블(out)을 B라 하자.
* 현재 보호소에 있고 입양을 가진 않은 행을 골라야 한다.
* 그러기 위해서는 합치는 데 있어서 A를 기준으로 합쳐야 골라낼 수 있다.
* 그 다음 만들어지는 table에 있어서 B에는 없는 A행을 고른 후,
* 그 행에서 시간을 기준으로 오름차순으로 정렬한다.
* 그 중 3개를 뺀다.

# Code

````sql
SELECT A.NAME, A.DATETIME
    FROM (ANIMAL_INS A LEFT JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID)
    WHERE B.ANIMAL_ID is NULL
    ORDER BY A.DATETIME ASC  # 가장 초기에 있던 녀석이 가장 오래있었음
    LIMIT 3
````

# Reference

* [프로그래머스 - 오랜 기간 보호한 동물](https://programmers.co.kr/learn/courses/30/lessons/59044)
