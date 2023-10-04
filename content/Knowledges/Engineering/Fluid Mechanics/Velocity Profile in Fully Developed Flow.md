---
title: Velocity Profile in Fully Developed Flow
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

완전 발달 유동이란 위치 변화에 따라 유동의 모양이 변화하지 않는 유동을 의미한다. 즉 x에 대한 편미분 값이 0이라는 의미이다. 이 경우 속도의 모양이 어떻게 이루어져 있는지 유도해보도록 하자.

# 가정

1. 2D
1. incompressible
1. μ is constant
1. steady
1. No gravity

압력과 전단력에 의한 힘 이외에 외력이 없으므로 나비에 스톡스 방정식에서 시작한다. 가정에 따라 없어지는 항들을 체크한다.

![](Pasted%20image%2020231004121602.png)

우리는 완전발달 유동 상황에서 속도 함수를 구하기 위함이므로, 완전 발단 유동의 특징을 식에 추가해준다.

$$
A1 = A2
$$

![](Pasted%20image%2020231004121607.png)

신기하게도 이 가정을 연속 방정식에 넣게되면

![](Pasted%20image%2020231004121612.png)

이 만들어 진다.

![](Pasted%20image%2020231004121615.png)

다 정리하면 x축에 대해서 미분방정식이 하나,y축으로도 미분방정식이 하나가 나온다. 이 때 y축에 대한 미분방정식으로 부터 완전발달유동일 때, y축으로의 압력변화는 없다는 것을 알 수 있다. 이제 경우를 나눠서 속도 윤곽을 알아보자.

1. Couette Flow (with no pressure difference)
1. Couette Flow (with pressure difference)
1. Square area Pipe

![](Pasted%20image%2020231004121621.png)
![](Pasted%20image%2020231004121625.png)
![](Pasted%20image%2020231004121632.png)
![](Pasted%20image%2020231004121636.png)
![](Pasted%20image%2020231004121640.png)
