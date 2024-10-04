---
title: Categorical Distribution
thumbnail: ''
draft: false
tags:
- statistics
- discrete-distribution
created: 2024-09-12
---


 > 
 > 서로 다른 상태가 K개인 하나의 이산 변수에 관한 확률 분포, K는 유한한 값.

$$
\\begin{align\*}
p(x=k) &= \pi_k \\
\\sum\_{k=1}^{K} \pi_k &= 1
\\end{align\*}
$$

* 여기서 $\pi_k$는 $k$번째 상태가 발생할 확률이다. 
* categorical distribution은 다음과 같이 표현할 수 있다.

$$
\\begin{align\*}
x &\sim \text{Cat}(\pi) \\
\\text{where } \pi &= (\pi_1, \pi_2, \cdots, \pi_K)
\\end{align\*}
$$

# 사용처

* 대상들의 범주에 관한 분포를 나타낼 때 사용한다. 
* 예를 들어, 주사위를 던질 때, 주사위의 각 면이 나올 확률을 나타낼 때 사용할 수 있다.
