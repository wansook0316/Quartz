---
title: programmers - 없어진 기록 찾기
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

* 입양을 보낸 테이블(out)을 B, 입양이 온 테이블(in)을 A라 하자.
* 만약 입양을 보낸 행위가 발생하면, ANIMAL_ID은 두 테이블에 항상이 있어야 한다.
* 하지만 현재 B의 ANIMAL_ID만 존재하고 A는 공란이 발생한 상황이다.
* 따라서 ANIMAL_ID만 생각해보면 B가 더 큰 집합이다.
* 그렇다면 A를 B와 합쳐버리면, 우리가 얻을 수 있는 것은 보낸 것과 온 것을 하나의 Table로 조사할 수 있다.
* 그 중에서 B에는 ANIMAL_ID가 있지만 A에는 없다면 그 것이 문제가 발생한 행이다.
* 즉, 합쳤을 때, ANIMAL_ID가 B에는 존재하지만 A에는 존재하지 않는 B의 ANIMAL_ID가 답이다.

# Code

````sql
SELECT B.ANIMAL_ID, B.NAME
    FROM (ANIMAL_INS A RIGHT JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID)
    WHERE A.ANIMAL_ID IS NULL
    ORDER BY B.ANIMAL_ID
````

# Reference

* [프로그래머스 - 없어진 기록 찾기](https://programmers.co.kr/learn/courses/30/lessons/59042)
