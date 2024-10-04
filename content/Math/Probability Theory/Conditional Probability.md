---
title: Conditional Probability
thumbnail: ''
draft: false
tags:
- conditional-probability
- statistics
- causal-modeling
created: 2024-09-11
---

# 조건부 확률

$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$

* 조건부 확률  $P(A \mid B)$ 는 사건  B 가 발생했을 때 사건  A 가 발생할 확률
* 여기서  $P(A \mid B)$ 는 **“B가 주어졌을 때 A의 확률”**
* $P(A \mid B)$  : 사건  B 가 발생했을 때 사건  A 가 발생할 확률
* $P(A \cap B)$  : 사건  A 와 사건  B 가 동시에 발생할 확률 (즉,  A 와  B 의 교집합의 확률)
* $P(B)$  : 사건  B 가 발생할 확률
  * 여기서,  P(B) 는  B 가 발생할 확률이 0이 아닌 경우에만 정의. 즉,  $P(B) > 0$

# 유의할 점

 > 
 > 인과관계와 헷갈려서는 안된다. 다음의 두개는 다른 작업이다.

1. 100명 중에 A를 한 사람중 B를 할 가능성
1. 100명 중에 A를 진행했을 때, B를 할 가능성

1의 경우 조건부 확률이다.
2의 경우 A와 B의 연관성, 즉, 특정 행동의 결과를 계산하는 일이다. 2와 같은 작업을 **개입 질의(intervention query)** 라 한다. 이는 \*\*인과관계 모형화(causal modeling)\*\*의 일부이다.

# 연쇄 법칙

* 다수의 확률 변수에 관한 임의의 결합확률분포를 각각 하나의 변수에 관한 조건부 분포들로 분해할 수 있다.
* $P(A, B, C) = P(A \mid B, C)P(B \mid C)P(C)$
