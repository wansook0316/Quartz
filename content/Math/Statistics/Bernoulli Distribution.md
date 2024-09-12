---
title: Bernoulli Distribution
thumbnail: ''
draft: false
tags:
- distribution
- discrete-distribution
created: 2024-09-12
---


 > 
 > 확률 변수의 값이 성공 혹은 실패로 나타나는 경우에 따른 분포

동전을 던졌을 때, 앞면이 나오는 사건에 대한 값을 확률 변수로 잡는 경우가 해당된다. 해당 사건이 나오는 확률을 정의해야 분포가 정의된다.

$$
P(X=x) = \phi^x (1-\phi)^{1-x}
$$
$$
P(x=1) = \phi \quad P(x=0) = 1-\phi \quad x \in {0, 1} \quad \phi \in \[0, 1\]
$$

$$
\\mathbb{E}\[X\] = \phi
$$
$$
\\text{Var}(X) = \phi(1-\phi)
$$
