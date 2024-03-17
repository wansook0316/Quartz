---
title: Properties of Gas-Vapor Mixtures
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Gas Vapor Mixture

우리는 가동유체를 보통 대기에 있는 기체로 사용한다. 그 기체는 건조한 공기 + 증기로 볼 수 있을 것이다.

## 가정

1. 건조 공기 비열을 1.005의 고정값을 갖는다고 가정
1. 증기 상온에서, 저압의 증기의 엔탈피는 온도만의 함수이다.
   즉, Tsat이 정해지면 그 때의 엔탈피를 상수로 보아도 문제가 없다.

![](Properties-of-Gas-Vapor1.png)
![](Properties-of-Gas-Vapor2.png)

# 절대 습도, 상대 습도

1. 절대 습도 증기의 질량 / 전체 질량 = 0.622 \* (증기압 / 전체 압력)
1. 포화 공기 공기와 습기의 혼합기체에서 이 기체가 머금을 수 있는 최대 증기를 가진 공기
1. m_g 혼합공기가 최대로 머금을 수 있는 증기의 질량
1. 상대 습도 증기의 질량 / m_g = 증기압 / 최대 증기압

## 절대 습도를 통한 혼합기체의 엔탈피 표현

$$
h = h_a + w\times h_v
$$

이 때 ma로 나누는 것에 주의한다.

# Dew point Temperature

 > 
 > 등압으로 온도가 떨어질 때, 혼합 공기가 액화하기 시작하는 온도.

![](Properties-of-Gas-Vapor3.png)

여기서,

![](Properties-of-Gas-Vapor4.png)

이므로,

![](Properties-of-Gas-Vapor5.png)

이다. 그리고 아래에 정리할 상대습도의 개념을 가지고,

![](Properties-of-Gas-Vapor6.png)
![](Properties-of-Gas-Vapor7.png)

다음과 같은 관계가 성립한다. 상대습도는 (0~1)의 값이므로 포화증기의 절대습도는 $\phi = 1$ 일 때 성립한다.

![](Properties-of-Gas-Vapor8.png)
