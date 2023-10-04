---
title: Heat Engine & Refrigerator Cycles
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Power Cycle(Engine) vs Refrigeration Cycle

 > 
 > 방향이 반대다!

1. Engine (시계 방향) : 일을 생산
   * 액체 압력 높힘 (Pump) -> 액체에서 기체로(고압) (Boiler) -> 기체 압력 낮춤 (Turbine) -> 기체에서 액체로 (Condenser)
1. Refrigeration Cycle (반시계 방향) : 열을 제거, 공급 (Refrigerator, Heat Pump)
   * 액체에서 기체로(저압) (Evaporator) -> 기체 압력 높힘 (Compressor) -> 기체에서 액체로(고압) (Condenser) -> 액체 압력 낮춤 (Turbine or Throttling Valve)

![](heat-engine01.png)

## Vapor-compression Refrigeneration Cycle

 > 
 > 반대 방향으로 진행되는 수정된 Rankine Cycle(Vapor Power Cycle)

기존의 Rankine Cycle을 반대로 운행시키면 된다. 그런데 여기서, 터빈을 사용하지 않고 Throttling Valve를 사용한다. Sat.liquid 상태에서 터빈을 돌리고 나면 Mixture상태가 된다. 즉 터빈이 운행하는 동안에 한가지 phase가 아니게 되어 효율이 감소한다. 일을 생산할 수는 있겠지만 전체적으로 보았을 때 이득이 아니다. 단가문제도 있다.

* Problem
  * 원래 Turbine을 사용할 때는 Internally reversible 이었지만, 밸브로 변경하는 바람에 내적으로 비가역인 과정이다.

![](heat-engine02.png)
![](heat-engine03.png)

근본적으로 Heat Pump와 Refrigerator는 목적이 다를 뿐 원리는 동일하기 때문에, 중간에 밸브를 끼워넣어 모드를 변경할 수 있다.

![](heat-engine04.png)

# Exergy Transfer

엑서지란 특정 계의 상태가 환경의 상태까지 갔을 때 할 수 있는 잠재일 양이다.

그 System이 Closed, Open 일 때 엑서지는 다음과 같이 나타낼 수 있다.

![](heat-engine05.png)
![](heat-engine06.png)

그렇다면 이 계의 엑서지의 변화를 만들어내는 요인은 무엇이 있을까. 내가 특정 계를 잡았을 때, 이 시스템에 작용할 수 있는 에너지의 형태는, 열, 일, 질량이동 이 세가지 이다. 그런데 System에 이 세가지 형태의 엑서지가 전달이 곧 시스템의 엑서지 변화로 변하지 않는다. 열에 의한 엑서지 이동은 엔트로피 Term과 관련이 있는데, 엔트로피 증가의 원리 (특정 System의 엔트로피 변화량은 Sin와 Sout 이외에 생성되는 엔트로피 항을 더해야 함)에 의해, 생성되는 엔트로피항에 대응되는 엑서지 파괴량을 빼주어야 한다.

![](heat-engine07.png)

# 2nd Law Efficiency

2법칙 효율은 쉽게 말해 System에서 할 수 있는 최대에너지 (엑서지 양) 대비 실제로 한 나온 에너지양이다.
이 설명은 엑서지 소비양 대비 엑서지 회복 양과도 같다.

## Compressor

1->2 과정, 압축기는 이상적으로 등엔트로피 과정이다. 이 때 1점과 2점을 비교하면, 질량변화(열전달 X, 환경에 해주는 일 말고 유용일 X) 밖에 없다. 즉, 1,2 점의 변화로 부터 얻어낼 수 있는 에너지 양은, 엔탈피만 변화했으므로 h2 - h1 이다. 실제로 이 과정에서 생기는 에너지 양은 엔트로피 생성으로 인한 항을 빼주어야 한다. 1,2지점에서 계의 엔트로피 변화는 없으므로, 2점에서 1점의 엔트로피를 빼준 것이 Sgen이 될 것이다.

## Condenser

2->3 과정, 콘덴서를 System으로 잡았을 때, 이 계의 엑서지 변화량은 X2 - X3로 나타낼 수 있다. 이 과정에서 들어온 에너지의 형태는 열이다. 환경의 온도와 계에 들어온 온도와의 관계만큼의 열이 들어오므로 카르노 사이클 효율을 곱하여 나타 낸다. 이 과정동안 변화하는 계의 엔트로피양은 Qh/Th 이다. 이 계의 엔트로피 양은, 2에서의 엔트로피에서 3에서의 엔트로피를 뺀것에 Sgen을 더해주면 된다. 따라서 Sgen은 아래와 같이 표현될 것이다.

## Expansion Valve

3->4 과정 계의 엑서지 변화는 X3-X4로 나타내어 질 것이다. 계의 속도변화와 위치차가 없고 valve는 h3 = h4이므로 엔트로피항만 살아남을 것이다. 그 과정 이후 실제로 회복된 에너지는 없다. 따라서 2법칙 효율은 0이다.

## Evaporator

4->1과정 엑서지 변화는 X4-X1로 나타낼 수 있다. 이 과정에서 실제로 회복된 에너지는 열의 형태이다. Sgen으로도 동일하게 엔트로피 증가의 법칙을 사용해서 구할 수 있다.

결과적으로 총합을 구해서 정리하게 되면 결국 사이클 전체에 대해 2법칙 효율은, 가역적 과정에서의 사이클 COP대비 실제 COP비율이다.

![](heat-engine08.png)
![](heat-engine09.png)
![](heat-engine10.png)
