---
title: Restaurant Headcount Prediction
thumbnail: ''
draft: false
tags:
- trace
- data-analysis
- tensorflow
created: 2023-10-04
---


 > 
 > 서울시 관내 식당의 식수인원을 예측하여 사회적 이익을 가져오는 프로젝트를 진행했다.

* 2018.07~2019.03(8개월)
* 매일매일 발생하는 서울시청 사내 식당의 일별 식수 인원 예측 프로젝트
* Pandas, Numpy, Lightgbm, tensorflow, sklearn, matplotlib
* 메뉴별, 월별 식수인원의 차이를 알아보기 위한 ANOVA 분석
* 식수 인원의 시간적인 특성을 기반으로 시계열 분석 및 LSTM 모델 구현 및 평가
* 모수(3년, 741개 데이터)의 절대량 부족으로 원하는 정도의 예측 모델 구현은 성공하지 못함
* 접근 방법은 유의미하여 특허 출원까지 완료

# Project

![](restuarant-headcount-prediction001.jpg)
![](restuarant-headcount-prediction002.jpg)
![](restuarant-headcount-prediction003.jpg)
![](restuarant-headcount-prediction004.jpg)
![](restuarant-headcount-prediction005.jpg)
![](restuarant-headcount-prediction006.jpg)
![](restuarant-headcount-prediction007.jpg)
![](restuarant-headcount-prediction008.jpg)
![](restuarant-headcount-prediction009.jpg)
![](restuarant-headcount-prediction010.jpg)
![](restuarant-headcount-prediction011.jpg)
![](restuarant-headcount-prediction012.jpg)
![](restuarant-headcount-prediction013.jpg)
![](restuarant-headcount-prediction014.jpg)
![](restuarant-headcount-prediction015.jpg)
![](restuarant-headcount-prediction016.jpg)
![](restuarant-headcount-prediction017.jpg)
![](restuarant-headcount-prediction018.jpg)
![](restuarant-headcount-prediction019.jpg)
![](restuarant-headcount-prediction020.jpg)
![](restuarant-headcount-prediction021.jpg)
![](restuarant-headcount-prediction022.jpg)
![](restuarant-headcount-prediction023.jpg)
![](restuarant-headcount-prediction024.jpg)
![](restuarant-headcount-prediction025.jpg)
![](restuarant-headcount-prediction026.jpg)
![](restuarant-headcount-prediction027.jpg)
![](restuarant-headcount-prediction028.jpg)
![](restuarant-headcount-prediction029.jpg)
![](restuarant-headcount-prediction030.jpg)
![](restuarant-headcount-prediction031.jpg)
![](restuarant-headcount-prediction032.jpg)
![](restuarant-headcount-prediction033.jpg)
![](restuarant-headcount-prediction034.jpg)
![](restuarant-headcount-prediction035.jpg)
![](restuarant-headcount-prediction036.jpg)
![](restuarant-headcount-prediction037.jpg)
![](restuarant-headcount-prediction038.jpg)
![](restuarant-headcount-prediction039.jpg)
![](restuarant-headcount-prediction040.jpg)
![](restuarant-headcount-prediction041.jpg)
![](restuarant-headcount-prediction042.jpg)
![](restuarant-headcount-prediction043.jpg)
![](restuarant-headcount-prediction044.jpg)
![](restuarant-headcount-prediction045.jpg)
![](restuarant-headcount-prediction046.jpg)
![](restuarant-headcount-prediction047.jpg)
![](restuarant-headcount-prediction048.jpg)
![](restuarant-headcount-prediction049.jpg)
![](restuarant-headcount-prediction050.jpg)
![](restuarant-headcount-prediction051.jpg)
![](restuarant-headcount-prediction052.jpg)
![](restuarant-headcount-prediction053.jpg)
![](restuarant-headcount-prediction054.jpg)
![](restuarant-headcount-prediction055.jpg)
![](restuarant-headcount-prediction056.jpg)
![](restuarant-headcount-prediction057.jpg)
![](restuarant-headcount-prediction058.jpg)
![](restuarant-headcount-prediction059.jpg)
![](restuarant-headcount-prediction060.jpg)
![](restuarant-headcount-prediction061.jpg)
![](restuarant-headcount-prediction062.jpg)
![](restuarant-headcount-prediction063.jpg)
![](restuarant-headcount-prediction064.jpg)
![](restuarant-headcount-prediction065.jpg)
![](restuarant-headcount-prediction066.jpg)
![](restuarant-headcount-prediction067.jpg)
![](restuarant-headcount-prediction068.jpg)
![](restuarant-headcount-prediction069.jpg)
![](restuarant-headcount-prediction070.jpg)
![](restuarant-headcount-prediction071.jpg)
![](restuarant-headcount-prediction072.jpg)
![](restuarant-headcount-prediction073.jpg)
![](restuarant-headcount-prediction074.jpg)
![](restuarant-headcount-prediction075.jpg)
![](restuarant-headcount-prediction076.jpg)
![](restuarant-headcount-prediction077.jpg)
![](restuarant-headcount-prediction078.jpg)
![](restuarant-headcount-prediction079.jpg)
![](restuarant-headcount-prediction080.jpg)
![](restuarant-headcount-prediction081.jpg)
![](restuarant-headcount-prediction082.jpg)
![](restuarant-headcount-prediction083.jpg)
![](restuarant-headcount-prediction084.jpg)
![](restuarant-headcount-prediction085.jpg)
![](restuarant-headcount-prediction086.jpg)
![](restuarant-headcount-prediction087.jpg)
![](restuarant-headcount-prediction088.jpg)
![](restuarant-headcount-prediction089.jpg)
![](restuarant-headcount-prediction090.jpg)
![](restuarant-headcount-prediction091.jpg)
![](restuarant-headcount-prediction092.jpg)
![](restuarant-headcount-prediction093.jpg)
![](restuarant-headcount-prediction094.jpg)
![](restuarant-headcount-prediction095.jpg)
![](restuarant-headcount-prediction096.jpg)
![](restuarant-headcount-prediction097.jpg)
![](restuarant-headcount-prediction098.jpg)
![](restuarant-headcount-prediction099.jpg)
![](restuarant-headcount-prediction100.jpg)
![](restuarant-headcount-prediction101.jpg)
![](restuarant-headcount-prediction102.jpg)
![](restuarant-headcount-prediction103.jpg)
![](restuarant-headcount-prediction104.jpg)
![](restuarant-headcount-prediction105.jpg)
![](restuarant-headcount-prediction106.jpg)
![](restuarant-headcount-prediction107.jpg)
![](restuarant-headcount-prediction108.jpg)
![](restuarant-headcount-prediction109.jpg)

# Patent

![](Pasted%20image%2020231004094237.jpg)
