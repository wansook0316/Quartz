---
title: Reciprocating Engines
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

왕복엔진이라 함은, 가솔린 엔진과 디젤 엔진으로 나뉜다. 기본적으로 피스톤의 왕복운동을 기반으로 Shaft work을 생산하기 때문에 그렇다.

# 종류

1. Spark-ignition (Gasolin)
1. compression-ignition (Diesel)

# 기본적으로 알아야 하는 것

* MEP (Mean Effective Pressure)
  * 피스톤이 움직이는 최대 부피대비 일 생산량 (kPa)
  * 왕복엔진의 성능을 판단하는 척도가 된다.
  * $W\_{net} = MEP * (V\_{max} - V\_{min})$
* Compression Ratio
  * r = Vmax/Vmin
* Actual : 4 stroke, open system
* Ideal : 2 stroke, closed system
* ISENTROPIC RELATION

![](Reciprocating-Engines01.png)
![](Reciprocating-Engines02.png)
![](Reciprocating-Engines03.png)

## OTTO Cycle

 > 
 > Ideal Cycle for Spark - ignition Engine​

* Process : 등엔트로피 수축 -> 등적 Heat in -> 등엔트로피 팽창 -> 등적 Heat out
* Efficiency : r (압축비) 의 함수, 높을 수록 증가한다.
* Problem : 압축비가 높을 때 효율이 좋지만 자연발화의 가능성이 있다.

![](Reciprocating-Engines04.png)
![](Reciprocating-Engines05.png)
![](Reciprocating-Engines06.png)
![](Reciprocating-Engines07.png)

## Diesel Cycle

 > 
 > Ideal Cycle for Compression - ignition Engine
 > ​

* Difference : OTTO에는 혼합기체가 압축된다. Diesel은 공기만 압축된다.
  ​ _ 자연발화의 가능성을 제거
  ​ _ 높은 압축비에서 운행 가능
* Process : 등엔트로피 수축 -> 등압 Heat in -> 등엔트로피 팽창 -> 등적 Heat out
* Efficiency : r (압축비)와 rc(부피비) 의 함수
* Problem : 질소산화물 배출, r (압축비) 가 같을 경우 OTTO보다 효율이 낮다.

![](Reciprocating-Engines08.png)
![](Reciprocating-Engines09.png)
![](Reciprocating-Engines10.png)
