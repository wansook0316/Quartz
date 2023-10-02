---
title: programmers - 프로그래머스 보호소에서 중성화한 동물
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

## 검색

 > 
 > SELECT id,name FROM member WHERE name LIKE '김%'

* 김으로 시작하는 사람을 모두 조회

 > 
 > SELECT id,name FROM member WHERE name LIKE '%김'

* 김으로 끝나는 사람을 모두 조회

 > 
 > SELECT id,p_name FROM member WHERE p_name LIKE '%프린터%'

* '프린터' 가 들어가는 제품을 모두 조회

 > 
 > SELECT id,name FROM member WHERE name LIKE '김?'

* '김' + 외자인 사람을 모두 조회

# Code

````sql
SELECT A.ANIMAL_ID, A.ANIMAL_TYPE, A.NAME
    FROM ANIMAL_INS A INNER JOIN ANIMAL_OUTS B ON A.ANIMAL_ID = B.ANIMAL_ID
    WHERE A.SEX_UPON_INTAKE LIKE "Intact%"
        AND (B.SEX_UPON_OUTCOME LIKE "Spayed%" OR B.SEX_UPON_OUTCOME LIKE "Neutered%")
    ORDER BY A.ANIMAL_ID ASC;
````

# Reference

* [프로그래머스 - 보호소에서 중성화한 동물](https://programmers.co.kr/learn/courses/30/lessons/59045)
