---
title: Kullback-Leibler Divergence
thumbnail: ''
draft: false
tags:
- infomation-theory
created: 2024-10-21
---


 > 
 > 동일 확률 변수 $X$에 관한 개별적인 두 확률분포 $P$와 $Q$의 차이를 측정하는 방법

# Kullback-Leibler Divergence

$$
D\_{KL}(P||Q) = E(\log \frac{P(x)}{Q(x)}) = \sum P(x) \log \frac{P(x)}{Q(x)}
$$

# 성질

# 비대칭성에서 오는 특징

* KL Divergence는 두 분포의 차이를 측정하는 방법이라고 했다.
* 그렇기 때문에 어떠한 목적 함수로 사용될 수도 있다.
* 즉, 해당 함수를 기반으로, 해당 값이 최소가 되도록 특정 분포를 적합시키는 용도로 사용할 수도 있다.
* 하지만 위에서 말했듯, 해당 분포의 값이 비대칭성을 띄기 때문에 아래와 같은 문제가 생긴다.

![](IMG_0035-2.jpeg)

* $P(x)$는 두 가우스 분포를 혼합한 것이고, $Q(x)$는 하나의 가우스 분포이다.
* $argmin\_{q} D\_{KL}(P||Q)$와 $argmin\_{q} D\_{KL}(Q||P)$를 구해보자.
  * 해당 식은 $D\_{KL}(P||Q)$를 최소화하는 $Q$의 독립변수(argument)를 찾는 것이다.
* 보는 것처럼 어떤 방향의 KL Divergence를 최소화하느냐에 따라, 최적의 $Q$가 달라진다.
