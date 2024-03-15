---
title: Frostiness Prediction Contest
thumbnail: null
draft: false
tags:
- data-analysis
- trace
created: 2023-10-04
---


 > 
 > 2 Stage model을 사용하여 효과적으로 결로를 예측하고과 서비스를 구축하였다.

* 2020.07~2020.08(2개월)
* Pandas, Sklearn, Numpy, Matplotlib, Django
* 현대 제철소 철강 보관소에 있는 철강의 24시간, 28시간 후의 결로 발생 확률 예측 과제
* 외부 기상 관측소의 데이터를 기반으로 공장 내부 온도을 예측하는 모델과 이를 기반으로 철강의 결로를 예측하는 2 Step 구조 고안
* 결로에 영향을 주는 계절적 요인(봄, 가을)과 시간적 요인(새벽)을 고려한 예측을 수행하기 위해 군집화를 통한 피쳐 생성
* 데이터 불균형, 일반화 성능, 해석 가능성 등을 고려하여 Extra Tree 모델 사용
* 피어슨 상관계수, 크레머 상관계수를 사용하여 변수 선택
* 평균 AUC 0.9831을 갖는 모델 구현
* 최종적으로 Django 서버에 모델 탑재후, inference 시연

# Project

![](Frostiness-Prediction-Contest01%203.jpg)
![](Frostiness-Prediction-Contest02%203.jpg)
![](Frostiness-Prediction-Contest03%203.jpg)
![](Frostiness-Prediction-Contest04%203.jpg)
![](Frostiness-Prediction-Contest05%203.jpg)
![](Frostiness-Prediction-Contest06%203.jpg)
![](Frostiness-Prediction-Contest07%203.jpg)
![](Frostiness-Prediction-Contest08%203.jpg)
![](Frostiness-Prediction-Contest09%203.jpg)
![](Frostiness-Prediction-Contest10%203.jpg)
![](Frostiness-Prediction-Contest11%203.jpg)
![](Frostiness-Prediction-Contest12%203.jpg)
![](Frostiness-Prediction-Contest13%203.jpg)
![](Frostiness-Prediction-Contest14%203.jpg)
![](Frostiness-Prediction-Contest15%203.jpg)
![](Frostiness-Prediction-Contest16%203.jpg)
![](Frostiness-Prediction-Contest17%203.jpg)
![](Frostiness-Prediction-Contest18%203.jpg)
![](Frostiness-Prediction-Contest19%203.jpg)
![](Frostiness-Prediction-Contest20%203.jpg)
![](Frostiness-Prediction-Contest21%202.jpg)
![](Frostiness-Prediction-Contest22%202.jpg)
![](Frostiness-Prediction-Contest23%202.jpg)
![](Frostiness-Prediction-Contest24%202.jpg)
![](Frostiness-Prediction-Contest25%202.jpg)
![](Frostiness-Prediction-Contest26%202.jpg)
![](Frostiness-Prediction-Contest27%202.jpg)
![](Frostiness-Prediction-Contest28%202.jpg)
![](Frostiness-Prediction-Contest29%202.jpg)
![](Frostiness-Prediction-Contest30%202.jpg)
![](Frostiness-Prediction-Contest31%202.jpg)
![](Frostiness-Prediction-Contest32%202.jpg)
![](Frostiness-Prediction-Contest33%202.jpg)
![](Frostiness-Prediction-Contest34%202.jpg)
![](Frostiness-Prediction-Contest35%202.jpg)
![](Frostiness-Prediction-Contest36%202.jpg)
![](Frostiness-Prediction-Contest37%202.jpg)
![](Frostiness-Prediction-Contest38%202.jpg)
![](Frostiness-Prediction-Contest39%202.jpg)
![](Frostiness-Prediction-Contest40%202.jpg)
![](Frostiness-Prediction-Contest41%202.jpg)
![](Frostiness-Prediction-Contest42%202.jpg)
![](Frostiness-Prediction-Contest43%202.jpg)
![](Frostiness-Prediction-Contest44%202.jpg)
![](Frostiness-Prediction-Contest45%202.jpg)
![](Frostiness-Prediction-Contest46%202.jpg)
![](Frostiness-Prediction-Contest47%202.jpg)
![](Frostiness-Prediction-Contest48%202.jpg)
![](Frostiness-Prediction-Contest49%202.jpg)
![](Frostiness-Prediction-Contest50%202.jpg)
![](Frostiness-Prediction-Contest51%202.jpg)
![](Frostiness-Prediction-Contest52%202.jpg)
![](Frostiness-Prediction-Contest53%202.jpg)
![](Frostiness-Prediction-Contest54%202.jpg)
![](Frostiness-Prediction-Contest55%202.jpg)
![](Frostiness-Prediction-Contest56%202.jpg)
![](Frostiness-Prediction-Contest57%202.jpg)
![](Frostiness-Prediction-Contest58%202.jpg)
![](Frostiness-Prediction-Contest59%202.jpg)
![](Frostiness-Prediction-Contest60%202.jpg)
![](Frostiness-Prediction-Contest61%202.jpg)
![](Frostiness-Prediction-Contest62%202.jpg)
![](Frostiness-Prediction-Contest63%202.jpg)
![](Frostiness-Prediction-Contest64%202.jpg)
![](Frostiness-Prediction-Contest65%202.jpg)
![](Frostiness-Prediction-Contest66%202.jpg)
![](Frostiness-Prediction-Contest67%202.jpg)
![](Frostiness-Prediction-Contest68%202.jpg)
![](Frostiness-Prediction-Contest69%202.jpg)
![](Frostiness-Prediction-Contest70%202.jpg)
![](Frostiness-Prediction-Contest71%202.jpg)
![](Frostiness-Prediction-Contest72%202.jpg)
![](Frostiness-Prediction-Contest73%202.jpg)
![](Frostiness-Prediction-Contest74%202.jpg)
![](Frostiness-Prediction-Contest75%202.jpg)
![](Frostiness-Prediction-Contest76%202.jpg)
![](Frostiness-Prediction-Contest77%202.jpg)
![](Frostiness-Prediction-Contest78%202.jpg)
![](Frostiness-Prediction-Contest79%202.jpg)
![](Frostiness-Prediction-Contest80%202.jpg)
![](Frostiness-Prediction-Contest81%202.jpg)
![](Frostiness-Prediction-Contest82%202.jpg)
![](Frostiness-Prediction-Contest83%202.jpg)
![](Frostiness-Prediction-Contest84%202.jpg)
![](Frostiness-Prediction-Contest85%202.jpg)
![](Frostiness-Prediction-Contest86%202.jpg)
![](Frostiness-Prediction-Contest87%202.jpg)
![](Frostiness-Prediction-Contest88%202.jpg)
![](Frostiness-Prediction-Contest89%202.jpg)
![](Frostiness-Prediction-Contest90%202.jpg)
![](Frostiness-Prediction-Contest91%202.jpg)
![](Frostiness-Prediction-Contest92%202.jpg)
![](Frostiness-Prediction-Contest93%202.jpg)
![](Frostiness-Prediction-Contest94%202.jpg)
![](Frostiness-Prediction-Contest95%202.jpg)
![](Frostiness-Prediction-Contest96%202.jpg)
![](Frostiness-Prediction-Contest97%202.jpg)
![](Frostiness-Prediction-Contest98%202.jpg)

# Result

![](Pasted%20image%2020231004093740.jpg)
