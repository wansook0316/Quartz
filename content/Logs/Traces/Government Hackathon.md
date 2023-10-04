---
title: Government Hackathon
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---


 > 
 > Google NMT api와 kobert를 사용하여 감성 분석을 진행하고, 서비스에 탑재하였다.

* 2020.12(1개월)
* Open api, pytorch, Flask
* 자연어 처리 모델 기반 우울감 자가진단 서비스 "마인드디텍터" 웹 어플리케이션 제작 프로젝트
* SKT에서 개발한 Kobert를 기반으로 Naver 영화 감정 분석 데이터셋과 짧은 감정 분류를 위한 데이터셋(영문)을 통해 모델 미세 조정
* 영문 데이터의 경우 Google transform api를 통해 번역 후 학습에 사용
* 우울 지수를 계산하기 위해 공공 데이터 포털에서 자살률과 감정 예측 결과를 조합하여 사용
* 최종적으로 서비스를 위해 flask 서버를 띄우고 요청의 대한 결과로 결과 응답
* 정부혁신제안 끝장개발대회 메이커톤 최우수상

# Project

![](minddetector1%202.jpg)
![](minddetector2%202.jpg)
![](minddetector3%202.jpg)
![](minddetector4%202.jpg)
![](minddetector5%202.jpg)
![](minddetector6%202.jpg)
![](minddetector7%202.jpg)

# Result

![마인드디텍터-최우수상](https://user-images.githubusercontent.com/37871541/107838610-0d6db300-6dea-11eb-9a2b-47101ee9d1a9.jpg)

# Reference

* [마음을 읽는 AI 우울감 자가진단 서비스, 마인드디텍터](http://minddetector.me/)
* [server github](https://github.com/sarah5398/mind-detector)
* [emotion analysis github](https://github.com/wansook0316/emotion_analysis_)
