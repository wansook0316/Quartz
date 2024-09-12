---
title: Expectation
thumbnail: ''
draft: false
tags:
- expectation
- statistics
created: 2024-09-12
---


 > 
 > 확률변수 $X$가 따르는 분포 $P(X)$에서 추출된 $x$ 로 구성된 함수 $f(x)$에 대한 평균 $\mathbb{E}$
 > $$
 > \\mathbb{E}*{X \sim P} \[f(x)\] = \sum_x P(x) f(x)
 > $$
 > $$
 > \\mathbb{E}*{X \sim P} \[f(x)\] = \int p(x) f(x) , dx
 > $$

만약 $\mathbb{E}*{X \sim P}$ 에서 확률분포 $P(X)$를 확실히 알 수 있다면 생략한다. ($\mathbb{E}*{X}$)
확률 변수까지 확실하다면 이 역시 생략한다. ($\mathbb{E}$)

# 선형적

* 기댓값은 선형적, 일차함수이다.
  $$
  \\mathbb{E} \[\\alpha f(x) + \beta g(x)\] = \alpha \mathbb{E} \[f(x)\] + \beta \mathbb{E} \[g(x)\]
  $$
