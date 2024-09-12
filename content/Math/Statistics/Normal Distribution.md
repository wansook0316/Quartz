---
title: Normal Distribution
thumbnail: ''
draft: false
tags:
- statistics
- normal-distribution
- gaussian-distribution
- machine-learning
- deep-learning
created: 2023-10-04
---

# 정규 분포

* 실제로 가장 많이 적용되는 분포는 이항 분포이다. 
* 하지만 이는 이산 확률 변수에 대해 정의되는 변수이다. 이번에는 연속 확률 분포들 중에서 대부분의 통계학 이론의 기본이 되는 정규분포에 대해서 공부한다.
* 정규분포는 종 모양의 확률밀도함수를 가지며, 이는 피에르 라플라스와 칼 가우스가 정리했다.

# 정의

$$
\\mathcal{N}(x; \mu, \sigma^2) = {1\over \sqrt{2\pi\sigma^2}} exp\biggl({-{1\over 2\sigma^2}(x-\mu)^2}\biggl)
$$

* $\mu$ : 평균
* $\sigma^2$ : 분산
* $\sigma$ : 표준편차
* 정규분포는 평균 $\mu$와 $\sigma$ 가 제어한다.
* 계산을 하려면 $\sigma$ 의 제곱의 역수를 계산해야 한다.
* 이는 매우 귀찮으니 $\beta = 1/\sigma^2$ 를 사용한다.

$$
\\mathcal{N}(x; \mu, \beta^{-1}) = {1\over \sqrt{2\pi\beta}} exp\biggl({-{1\over 2\beta}(x-\mu)^2}\biggl)
$$

# 다변량 정규 분포

* 정규분포는 $\mathbb{R}^n$ 으로 일반화 된다.
* 다변량 정규 분포는 여러 개의 확률 변수가 정규 분포를 따를 때 사용한다.
* 이 때, 각 변수의 결합 확률 분포를 정의한다.

$$
\\mathcal{N}(\mathbf{x}; \mathbf{\mu}, \Sigma) = {1\over (2\pi)^{n}det(\Sigma)} exp\biggl({-{1\over 2}(\mathbf{x}-\mathbf{\mu})^T\Sigma^{-1}(\mathbf{x}-\mathbf{\mu})}\biggl)
$$

* $\mathbf{x}$ : 확률 변수 벡터
* $\mathbf{\mu}$ : 평균 벡터
* $\Sigma$ : 공분산 행렬
* 단변수일 때와 마찬가지로 확률밀도함수를 여러번 평가해야 하는 경우, 공분산 행렬의 역행렬을 계산해야 한다.
* 이 때, 역행렬을 계산하는 것은 매우 비싼 연산이다. ($O(n^3)$)
* 이 부분을 정밀도 행렬 $\beta$ 로 대체하여 계산한다. 즉, 계산해두고 저장해둔 채로 평가한다.

$$
\\mathcal{N}(\mathbf{x}; \mathbf{\mu}, \beta^{-1}) = {1\over (2\pi)^{n}det(\beta^{-1})} exp\biggl({-{1\over 2}(\mathbf{x}-\mathbf{\mu})^T\beta(\mathbf{x}-\mathbf{\mu})}\biggl)
$$

# 정규분포의 성질

1. 모든 관측치의 68%는 $\pm \sigma$ 에 속한다.
1. 모든 관측치의 95%는 $\pm 2\sigma$ 에 속한다.
1. 모든 관측치의 99.7%는 $\pm 3\sigma$ 에 속한다.

이는 앞에서 배운 히스토그램이 종모양 일 때 적용되는 **경험 법칙**과 맥을 같이 한다.

실질적인 계산은 표준정규분포를 가지고 계산하게 된다.

$$
Z = {X-\mu \over \sigma}
$$

# 이항 분포의 정규분포근사

위의 경험 법칙에서 알 수 있듯, 이항 분포는 정규분포에 근사하는 성질이 있다.
