---
title: Adiabatic Saturation & Psychrometric Chart
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Adiabatic Saturation

다음과 같은 단열 Chamber를 보자.

![](Adiabatic-Saturation01.png)

왼쪽은 포화되지 않은 공기가 들어오고 Chamber를 통과한 후 포화공기가 되서 나간다. 그렇게 될만큼 긴 챔버라고 가정하자. Dew point Temperature와는 다르다. 제 3의 inlet에서 물이 들어와 있기 때문이다. 1에서 2로 가는동안 (T1 > T2) 물에서 증기를 발생시키고, 그 증기를 가져갈 것이다. 따라서 이 과정은 등압이 아니고 압력이 높아지는 과정이다.

![](Adiabatic-Saturation02.png)

우리가 가진 정보가 T1, T2, w2라 했을 때, 단열 Chamber에서 w1을 구하는 식을 만들어 보자.

![](Adiabatic-Saturation03.png)

첨자 a는 air를 의미한다고 약속하자. 첨자 f는 물를 의미한다고 약속하자.
inlet과 outlet에서 질량이 같다고 가정하고, inlet의 vapor와 물의 질량의 합이 outlet에서의 vapor의 질량이다. 윗 식을 아래식에 대입해서 정리하면,

![](Adiabatic-Saturation04.png)

1번식 ; 더해지는 증기의 양은 나중 습도에서 현재 습도를 뺀 뒤 질량을 곱해준다.

이 전체 시스템에 대해 에너지 보존 법칙을 쓰게 되면,

![](Adiabatic-Saturation05.png)

2번식에 1번식을 넣어 정리하면,

![](Adiabatic-Saturation06.png)

양변을 Ma로 나누면,

![](Adiabatic-Saturation07.png)

공기의 엔탈피는 다음의 식으로 구할 수 있으므로,

![](Adiabatic-Saturation08.png)
![](Adiabatic-Saturation09.png)
![](Adiabatic-Saturation10.png)

w2는 상대습도가 1인 곳의 절대 습도이므로, 관계식에 의해, 다음과 같다.

![](Adiabatic-Saturation11.png)

그런데 항상 w1을 구할 때 이런 단열 Chamber를 만들 수 없기 때문에 (실현도 불가능) 그래서 T2, T1을 구하는데 있어 좀더 실용적인 방법을 택해야 한다. 이 때, 다음과 같은 온도계를 사용한다.

![](Adiabatic-Saturation12.png)

Wet bulb란 아래쪽에 물에 흠뻑 적신 솜을 달아놓은 것을 의미한다. 이렇게 한 상태로 불어오는 바람에 대해 온도를 측정하면, 공기는 지나가면서 적신 솜에서 열을 빼앗아 갈것이다. 이 때의 온도를 측정하는 것을 Wet bulb Temperature라 하고, 솜을 달지 않은 상태에서 측정하는 것을 Dry bulb Temperature라 한다.

# Psychrometric Chart

사실 어떤 물질의 Property는 state postulate에 의해 두가지 이상만 알게 되면 결정된다. 하지만 혼합기체에서 그 값을 구하는게 너무 귀찮아서 만든 표이다.

![](Adiabatic-Saturation13.png)

하지만 굉장히 끔찍하게 생겼다.

![](Adiabatic-Saturation14.png)

보는 방법은 생각보다 간단한데, 그냥 2개의 property에 맞게 선을 그어서 만나는 부분의 값을 읽으면 된다. 제일 왼쪽 바깥에 그려져있는 상대습도가 100%인 곳은,

![](Adiabatic-Saturation15.png)

상대습도가 100%니까 그 점에서 Sat T, Tdp, Twb, Tdr 온도가 모두 같을 것이다.
