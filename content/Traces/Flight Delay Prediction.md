---
title: Flight Delay Prediction
thumbnail: ''
draft: false
tags:
- trace
- data-analysis
created: 2023-10-04
---


 > 
 > 항공기의 운행을 따라가는 Schedule이라는 변수를 사용하여 높은 정확도로 지연편을 검출할 수 있었다.

* 2019.07~2019.11(4개월)
* Pandas, Numpy, Lightgbm, sklearn
* 항공기 지연 예측 과제
* 100만건의 데이터 핸들링
* 클래스 불균형 문제를 해결하고자 의사결정나무 기반이자 부스팅 모델인 Lightgbm 모델 사용
* 지연에 가장 영향을 끼치는 문제는 비행기 노선에 있어서 연이어 발생하는 A/C 문제(항공기 연결 문제)라고 판단
* 주어진 데이터에서 비행기의 노선은 정해져있다는 가정을 도입하고, 이를 검증 후 스케쥴이라는 변수 생성
* 지연이 아니라 예측했으나 실제로 지연인 경우(FN)가 현장 도입시 치명적이기 때문에 이를 반영하도록 재현율에 초점을 맞춰 Threshold 조절
* "스케쥴" 변수를 통해 정확도 13% 개선, 최종적으로 76%에서 89%의 정확도를 갖는 모델 구축

# Project

![](Flight-Delay-Prediction01%201.jpg)
![](Flight-Delay-Prediction02%201.jpg)
![](Flight-Delay-Prediction03%201.jpg)
![](Flight-Delay-Prediction04%201.jpg)
![](Flight-Delay-Prediction05%201.jpg)
![](Flight-Delay-Prediction06%201.jpg)
![](Flight-Delay-Prediction07%201.jpg)
![](Flight-Delay-Prediction08%201.jpg)
![](Flight-Delay-Prediction09%201.jpg)
![](Flight-Delay-Prediction10%201.jpg)
![](Flight-Delay-Prediction11%201.jpg)
![](Flight-Delay-Prediction12%201.jpg)
![](Flight-Delay-Prediction13%201.jpg)
![](Flight-Delay-Prediction14%201.jpg)
![](Flight-Delay-Prediction15%201.jpg)
![](Flight-Delay-Prediction16%201.jpg)
![](Flight-Delay-Prediction17%201.jpg)
![](Flight-Delay-Prediction18%201.jpg)
![](Flight-Delay-Prediction19%201.jpg)
![](Flight-Delay-Prediction20%201.jpg)
![](Flight-Delay-Prediction21%201.jpg)
![](Flight-Delay-Prediction22%201.jpg)
![](Flight-Delay-Prediction23%201.jpg)
![](Flight-Delay-Prediction24%201.jpg)
![](Flight-Delay-Prediction25%201.jpg)
![](Flight-Delay-Prediction26%201.jpg)
![](Flight-Delay-Prediction27%201.jpg)
![](Flight-Delay-Prediction28%201.jpg)
![](Flight-Delay-Prediction29%201.jpg)
![](Flight-Delay-Prediction30%201.jpg)
![](Flight-Delay-Prediction31%201.jpg)
![](Flight-Delay-Prediction32%201.jpg)
![](Flight-Delay-Prediction33%201.jpg)
![](Flight-Delay-Prediction34%201.jpg)
![](Flight-Delay-Prediction35%201.jpg)
![](Flight-Delay-Prediction36%201.jpg)
![](Flight-Delay-Prediction37%201.jpg)
![](Flight-Delay-Prediction38%201.jpg)
![](Flight-Delay-Prediction39%201.jpg)
![](Flight-Delay-Prediction40%201.jpg)
![](Flight-Delay-Prediction41%201.jpg)
![](Flight-Delay-Prediction43%201.jpg)

# Result

![](Pasted%20image%2020231004093818.jpg)

# Reference

* [Bigcontest Flight Delay Prediction](https://github.com/wansook0316/BigcontestFlightDelayPrediction)
