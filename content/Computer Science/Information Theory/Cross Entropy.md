---
title: Cross Entropy
thumbnail: ''
draft: false
tags:
- infomation-theory
created: 2024-10-21
---


 > 
 > 두 확률 분포 $P$와 $Q$의 차이를 측정하는 방법

$$
H(P, Q) = H(P) + D\_{KL}(P||Q) = E\[\\log {Q(x)}\] = \sum\_{x \in \mathcal X} P(x) \log {Q(x)}
$$

* [Information Entropy](Information%20Entropy.md)와 유사하지만, $P$의 정보량을 측정하는 것이 아닌, $Q$의 정보량을 측정한다.
* [Kullback-Leibler Divergence](Kullback-Leibler%20Divergence.md)와 비슷하게 두 확률분포의 차이를 측정한다.
* $H(P, Q) = H(P) + D\_{KL}(P||Q)$로 표현되므로, Cross Entropy를 최소화 하는 것은 $D\_{KL}(P||Q)$를 최소화 하는 것과 같다.

# 배우는 이유

* KL Divergence는 기본적으로 분수의 형태를 띄고 있어 계산에서 어려움이 있다.
  * p = 0일 때, log(0)은 무한대로 발산한다.
* 해당 함수가 미분이 쉽고 매끄러워 학습에 용이하다.
