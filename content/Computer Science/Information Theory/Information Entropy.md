---
title: Information Entropy
thumbnail: ''
draft: false
tags:
- infomation-theory
- entropy
created: 2024-10-04
---


 > 
 > 정보이론에서 확률 변수([Random Variable](../../Math/Probability%20Theory/Random%20Variable.md)) 의 불확실성을 정량화하는 척도

# Shannon Entropy

이산 확률 변수 $X$의 섀넌 엔트로피 $H(X)$는 다음과 같이 정의된다.

$$
H(X) = E(I(x)) = E(-\log p(X)) = \sum\_{x \in \mathcal X} p(x) \log p(x)
$$

* $I(x)$: 확률 변수 $X$의 [Self Information](Self%20Information.md)
* $E(I(x)): 확률 변수 $X$의 평균 정보량
* $p(x)$: 확률 변수 $X$의 확률 질량 함수
* $\mathcal X$: 확률변수 $X$가 취할 수 있는 값들의 집합

# 성질

1. $H(X) \geq 0$
1. $H(X) \leq \log |\mathcal X|$: $\mathcal X$에 대해 최대 엔트로피를 갖는 확률 분포는 균등 분포이다.
1. 임의의 확률분포 $p$에 대해 $H(p)$는 오목함수(Convex)이다.
1. 로그의 밑은 보통 2이며, 섀넌 엔트로피의 단위는 비트

# 개념

* [Self Information](Self%20Information.md)의 평균이다.
* 즉, 각 사건의 발생에서 얻을 수 있는 정보량의 평균을 의미한다.
* 사건의 발생 확률이 균등할수록(즉, 모든 사건이 발생할 가능성이 동일할 때), 엔트로피가 최대가 된다.
* 특정 사건의 발생 확률이 매우 높거나 낮다면, 엔트로피는 낮아진다. 이는 시스템이 더 예측 가능하다는 것을 의미한다.

![](binent.png)

* 위 그림은 이진 엔트로피의 예시이다.
* 즉, $P(X) = 0, P(X) = 1$ 인 확률 분포일 경우의 이진 엔트로피를 나타내고 있다.
* 위 경우 정보 엔트로피는 $H(X) = (p-1)log(1-p) - p log p$로 계산된다.
* 해당 그래프를 그려보면 위와 같은 볼록함수가 나온다.
* 결정론적인 분포일 수록 엔트로피가 0에 가깝다. (X축이 0이거나 1)
* 반대로 확률 분포가 고르게 분포할 수록 엔트로피가 최대가 된다. (X축이 0.5))

# 예시

## 동전 던지기

* 공정한 동전의 앞면과 뒷면이 나올 확률은 각각 0.5이다.
* 엔트로피를 계산해 보면:

$H(X) = - (0.5 \log_2 0.5 + 0.5 \log_2 0.5) = 1 \text{Bits}$

* 이 경우, 엔트로피는 최대값인 1 비트이다. 이는 결과를 예측하기 어려운 상태를 의미한다.

## 편향된 동전 던지기

* 만약 동전이 편향되어 앞면이 나올 확률이 0.9, 뒷면이 나올 확률이 0.1이라면:

$H(X) = - (0.9 \log_2 0.9 + 0.1 \log_2 0.1) \approx 0.47 \text{Bits}$

* 엔트로피가 1 비트보다 작아졌다. 이는 동전 던지기의 결과를 더 예측하기 쉬운 상태를 나타낸다.

## 주사위 던지기

* 공정한 6면체 주사위의 각 면이 나올 확률은  $\frac{1}{6}$ 이다.
* 이 경우 엔트로피는:

$H(X) = - \sum\_{i=1}^{6} \left(\frac{1}{6} \log_2 \frac{1}{6}\right) = \log_2 6 \approx 2.58 \text{Bits}$

* 이처럼 가능한 경우의 수가 많아지면 엔트로피도 증가하여, 더 예측하기 어려운 상태가 된다.

# Reference

* [정보 이론을 사용하여 Wordle 해결](https://www.youtube.com/watch?v=v68zYyaEmEA)
* [정보 엔트로피](https://ko.wikipedia.org/wiki/%EC%A0%95%EB%B3%B4_%EC%97%94%ED%8A%B8%EB%A1%9C%ED%94%BC)
