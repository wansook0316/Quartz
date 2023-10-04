---
title: Optimal Bicycle Station Selection Contest
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---


 > 
 > 공공자전거의 최적 위치를 수요와 리밸런싱을 고려하여 제시하였다.

* Pandas, Maplotlib, Geopandas, Geojson, Seaborn, folium
* 반입/반출이 빈번하게 일어나는 공유 자전거의 최적 정류소 선정 과제
* 자전거 잠재 수요 발굴, 공공성 확보, Rebalancing 문제(정류소의 수요-공급 불균형 문제)로 분석 방향 설정
* 잠재수요 : EDA를 통해 상업지역, 주거지역에 정류장 배치가 되어 있음을 확인, 거치대 주변 200m 반경에 존재하는 주거용 건축물 수의 평균을 통해 상업지역, 주거지역 구분
* 공공성 확보 : 주변 사회 인프라 시설 분포를 기반으로 접근성 피쳐 생성, 미배치 지역 시각화
* 위의 피쳐를 기반으로 미배치 지역과 접근성이라는 두 개의 지표를 가지고 후보군을 선별
* Rebalancing : 최종 정류장 입지를 선정하기 위해 두가지 지표 선정
  * 절대 수요 : 반입량, 반출량의 절대적인 량 - 하나의 거치대에 방문하는 사용자의 총량
  * 상대 수요 : 반입량 , 반출량의 차이 - 하나의 거치대에서 유입/유출되는 자전거의 변화량
* Extra tree 모델을 사용하여 위의 두 지표 예측 - 일반화 성능을 보장하기 위해 선택, 낮은 loss 결과 확인
* 각각의 후보군의 절대 수요와 상대 수요를 기반으로 Rebalancing을 가장 잘 해소할 수 있는 정류장 선택
  * 각각의 후보군에 절대 수요와 상대 수요를 평균으로 갖는 가우시안 분포 커널로 사용
  * 특정 후보군의 Rebalancing 정도를 이 분포의 부피값으로 사용 (0~1)
  * 각각의 행정동에서 발생하는 최적 후보군을 완전탐색하고 모든 행정동의 후보군을 최종답안으로 제출
* 기존 배치 정류장의 Rebalancing Metric 0.3, 제안 후보군의 Rebalancing Metric 0.08로 73% 감소

# Project

![](Optimal-Bicycle-Station-Selection01%205.jpg)
![](Optimal-Bicycle-Station-Selection02%205.jpg)
![](Optimal-Bicycle-Station-Selection03%205.jpg)
![](Optimal-Bicycle-Station-Selection04%205.jpg)
![](Optimal-Bicycle-Station-Selection05%205.jpg)
![](Optimal-Bicycle-Station-Selection06%205.jpg)
![](Optimal-Bicycle-Station-Selection07%205.jpg)
![](Optimal-Bicycle-Station-Selection08%205.jpg)
![](Optimal-Bicycle-Station-Selection09%205.jpg)
![](Optimal-Bicycle-Station-Selection10%205.jpg)
![](Optimal-Bicycle-Station-Selection11%205.jpg)
![](Optimal-Bicycle-Station-Selection12%205.jpg)
![](Optimal-Bicycle-Station-Selection13%205.jpg)
![](Optimal-Bicycle-Station-Selection14%205.jpg)
![](Optimal-Bicycle-Station-Selection15%205.jpg)
![](Optimal-Bicycle-Station-Selection16%205.jpg)
![](Optimal-Bicycle-Station-Selection17%205.jpg)
![](Optimal-Bicycle-Station-Selection18%205.jpg)
![](Optimal-Bicycle-Station-Selection19%205.jpg)
![](Optimal-Bicycle-Station-Selection20%205.jpg)
![](Optimal-Bicycle-Station-Selection21%205.jpg)
![](Optimal-Bicycle-Station-Selection22%205.jpg)
![](Optimal-Bicycle-Station-Selection23%205.jpg)
![](Optimal-Bicycle-Station-Selection24%205.jpg)
![](Optimal-Bicycle-Station-Selection25%205.jpg)
![](Optimal-Bicycle-Station-Selection26%205.jpg)
![](Optimal-Bicycle-Station-Selection27%205.jpg)
![](Optimal-Bicycle-Station-Selection28%205.jpg)
![](Optimal-Bicycle-Station-Selection29%205.jpg)
![](Optimal-Bicycle-Station-Selection30%205.jpg)
![](Optimal-Bicycle-Station-Selection31%205.jpg)
![](Optimal-Bicycle-Station-Selection32%205.jpg)
![](Optimal-Bicycle-Station-Selection33%205.jpg)
![](Optimal-Bicycle-Station-Selection34%205.jpg)
![](Optimal-Bicycle-Station-Selection35%205.jpg)
![](Optimal-Bicycle-Station-Selection36%205.jpg)
![](Optimal-Bicycle-Station-Selection37%205.jpg)
![](Optimal-Bicycle-Station-Selection38%205.jpg)
![](Optimal-Bicycle-Station-Selection39%205.jpg)
![](Optimal-Bicycle-Station-Selection40%205.jpg)
![](Optimal-Bicycle-Station-Selection41%205.jpg)
![](Optimal-Bicycle-Station-Selection42%205.jpg)
![](Optimal-Bicycle-Station-Selection43%205.jpg)
![](Optimal-Bicycle-Station-Selection44%205.jpg)
![](Optimal-Bicycle-Station-Selection45%205.jpg)
![](Optimal-Bicycle-Station-Selection46%205.jpg)
![](Optimal-Bicycle-Station-Selection47%205.jpg)
![](Optimal-Bicycle-Station-Selection48%205.jpg)
![](Optimal-Bicycle-Station-Selection49%205.jpg)
![](Optimal-Bicycle-Station-Selection50%205.jpg)
![](Optimal-Bicycle-Station-Selection51%205.jpg)
![](Optimal-Bicycle-Station-Selection52%205.jpg)
![](Optimal-Bicycle-Station-Selection53%205.jpg)
![](Optimal-Bicycle-Station-Selection54%205.jpg)
![](Optimal-Bicycle-Station-Selection55%205.jpg)
![](Optimal-Bicycle-Station-Selection56%205.jpg)
![](Optimal-Bicycle-Station-Selection57%205.jpg)
![](Optimal-Bicycle-Station-Selection58%205.jpg)
![](Optimal-Bicycle-Station-Selection59%205.jpg)
![](Optimal-Bicycle-Station-Selection60%205.jpg)
![](Optimal-Bicycle-Station-Selection61%205.jpg)
![](Optimal-Bicycle-Station-Selection62%205.jpg)
![](Optimal-Bicycle-Station-Selection63%205.jpg)
![](Optimal-Bicycle-Station-Selection64%205.jpg)
![](Optimal-Bicycle-Station-Selection65%205.jpg)
![](Optimal-Bicycle-Station-Selection66%205.jpg)
![](Optimal-Bicycle-Station-Selection67%205.jpg)
![](Optimal-Bicycle-Station-Selection68%205.jpg)
![](Optimal-Bicycle-Station-Selection69%205.jpg)
![](Optimal-Bicycle-Station-Selection70%205.jpg)
![](Optimal-Bicycle-Station-Selection71%205.jpg)
![](Optimal-Bicycle-Station-Selection72%205.jpg)
![](Optimal-Bicycle-Station-Selection73%205.jpg)
![](Optimal-Bicycle-Station-Selection74%205.jpg)
![](Optimal-Bicycle-Station-Selection75%205.jpg)
![](Optimal-Bicycle-Station-Selection76%205.jpg)
![](Optimal-Bicycle-Station-Selection77%205.jpg)
![](Optimal-Bicycle-Station-Selection78%205.jpg)
![](Optimal-Bicycle-Station-Selection79%205.jpg)
![](Optimal-Bicycle-Station-Selection80%205.jpg)

# Result

![](Pasted%20image%2020231004093902.png)

# Reference

* [Goyang City Optimal Bicycle Station Suggestion](https://github.com/wansook0316/GoyangCityOptimalBicycleStationSuggestion)
