---
title: Vapor Power Cycle
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Vapor Power Cycle

열역학에서 가장 먼저 다루는 사이클은 카르노 사이클이다. 이 사이클 내에서 효율이 극대화 되기 때문에 가장 이상적인 사이클이기 때문이다. (가역과정일때) 하지만 이것을 현실화하기는 매우 어렵다.

## 가정

Turbine과 Compressor 안에는 2개 이상의 phase인 유체가 들어가는 것은 좋지 않다. 부식 발생, 효율적이지 못하기 때문이다.
Power Cycle의 주 사용이유는 많은 일을 생산하기 위함이다. 그러기 위해서는 Tmax가 높아야하는데, 카르노 사이클은 근본적으로 그러기 힘들다.

![](Vapor-Power-Cycle1.png)

# Rankin Cycle

 > 
 > Ideal cycle for capor power cycles

카르노 사이클의 단점을 보안한 이상적인 사이클

* Process
  * 등엔트로피 압축(Compressor) -> 등압 팽창(Boiler) -> 등엔트로피 수축(Turbine) -> 등압 수축(Condenser)
* Efficiency
  * 카르노 사이클 보다 낮은 효율 (내적 가역과정이라 하더라도 외적 비가역성이 생김)

![](Vapor-Power-Cycle2.png)
![](Vapor-Power-Cycle3.png)

# Ideal cycle vs Acutal cycle

 > 
 > Irreversiblility

1. 마찰로 인한 압력 강하
1. 열 손실로 인한 온도 저하

## The way of making cycle more Efficient

1. Condensor의 압력을 낮춘다.
   * Problem : Turbine에 습기가 많아져 부식이 생길 수 있다.
1. Tmax를 높힌다. 열을 더 추가한다.
   * Problem : 무한정 높힐 수 있는게 아니다. 터빈이 견딜 수 있는 온도까지만 높힐 수 있다.
1. 높은 압력에서 Heating한다.
   * Problem : Turbine에 습기가 많아져 부식이 생길 수 있다.
1. REHEATING
   * 터빈을 두개를 달고 온도를 높히는 장치를 하나 더 달아버린다.
   1. Open Feed Water Heating
      * 기존에 데우는 유체와 다시 데우려는 유체를 섞어서 운행.
   1. Closed Feed Water Heating
      * 기존에 데우는 유체와 다시 데우려는 유체가 서로 열교환만 한다.

![](Vapor-Power-Cycle4.png)
![](Vapor-Power-Cycle5.png)
![](Vapor-Power-Cycle6.png)
![](Vapor-Power-Cycle7.png)
![](Vapor-Power-Cycle8.png)
![](Vapor-Power-Cycle9.png)
