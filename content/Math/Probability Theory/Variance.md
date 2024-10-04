---
title: Variance
thumbnail: ''
draft: false
tags:
- variance
- statistics
- standard-deviation
created: 2024-09-12
---


 > 
 > 확률변수 $X$가 따르는 분포 $P(X)$에서 추출된 $x$ 로 구성된 함수 $f(x)$에 대한 분산 $\text{Var}$

$$
\\text{Var}*{X \sim P} \[f(x)\] = \mathbb{E}*{X \sim P} \[(f(x) - \mathbb{E}\_{X \sim P} \[f(x)\])^2\]
$$

만약 $\text{Var}*{X \sim P}$ 에서 확률분포 $P(X)$를 확실히 알 수 있다면 생략한다. ($\text{Var}*{X}$)
확률 변수까지 확실하다면 이 역시 생략한다. ($\text{Var}$)

# 의미

* 확률변수 x의 함수($f(x)$) 가 해당 확률 분포에서 어느정도나 변하는지 나타내는 측도
* 기댓값과 함께 확률변수의 특성을 설명하는 중요한 통계량

# 표준편차

* 분산의 제곱근
* 분산이 제곱의 단위를 사용하기 때문에 제곱근을 취해 단위를 맞춰준다.
