---
title: PVT Behavior of Gas Mixture
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# 가정

1. 실제 기체는 저압, 고온(임계온도) 상황에서 이상기체로 간주할 수 있다.
1. 두 기체가 서로 반응하지 않는 이상 기체 인 경우, 두 기체의 합도 역시 이상기체로 행동한다.

이 두가지 가정은 이상기체의 행동을 예측하는데 쓰인다.

# Two Law of Gas Mixture

1. Dalton's Law of Additive Pressures
   * 두 기체가 같은 부피를 가지고 있고, 더했을 때도 같은 부피라면, 혼합기체의 압력은 두 기체의 압력을 더한 것과 같다.
1. Amagat's Law of additive Volumes
   * 두 기체가 같은 압력를 가지고 있고, 더했을 때도 같은 압력이라면, 혼합기체의 부피은 두 기체의 부피을 더한 것과 같다.

사실 V = f(P, T), P = f(V, T) 로 이상기체의 경우 같은 식을 의미한다.

![](pvt-behavior1.png)
![](pvt-behavior2.png)

혼합 기체를 다루고 있기 때문에 우리는 그 둘을 구분하기 위해서 Mol의 개념을 가지고 오는 것이 편리하다. 사용의 편리를 위해 이상기체 방정식을 Mol에 대해 정리한 후 위의 혼합기체에서의 두 법칙을 적용해보면, (아래첨자 m은 total을 의미한다.) i번째 기체의 분압은, 분적과 같으며, 몰수 비와 같아진다.

![](pvt-behavior3.png)

이 특징을 이용하여 기존 Property를 몰수 비를 활용하여 나타낼 수 있다.

![](pvt-behavior4.png)
