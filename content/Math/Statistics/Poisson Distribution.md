---
title: Poisson Distribution
thumbnail: ''
draft: false
tags:
- statistics
- distribution
created: 2024-09-23
---


 > 
 > 단위 시간 안에 사건이 몇 번 발생할 것인지에 대한 분포

버스정류장에 버스가 도착한다고 하자. 이 때, 단위 시간을 10분으로 설정했을 때, 10분안에 도착하는 버스의 수를 랜덤 변수로 정의했을 때 정의되는 분포이다. 포아송 분포를 정의하기 위해 필요한 인자는, 정해진 시간 안에 사건이 일어날 횟수에 대한 기댓값($\lambda$)가 필요하다.

$$
f(n; \lambda)=\frac{\lambda^n e^{-\lambda}}{n!},,!
$$
