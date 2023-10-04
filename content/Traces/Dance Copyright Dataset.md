---
title: Dance Copyright Dataset
thumbnail: ''
draft: false
tags:
- trace
- tensorflow
created: 2023-10-04
---


 > 
 > Openpose를 사용하여 동작을 추출, 그것을 기반으로 동작을 예측하고 분류하는 모델을 제작했다.

* 2019.09~2019.12(3개월)
* Opencv, Numpy, Tensorflow, Openpose, Docker
* Keypoint 추출을 통해 동작 구조화, 춤 동작 분류 프로젝트
* Docker를 통해 Openpose 컨테이너를 구축 후 데이터 추출
* 추출된 데이터를 기반으로 여러 사람의 동작을 반영할 수 있는 데이터 증대 알고리즘 구축
* 군집화를 통해 동작에 대한 label 제작
* Inception 모듈 사용 모델, LSTM을 사용하여 80%의 정확도를 갖는 모델 구현

# Project

![](dance-coptyright-dataset01.jpg)
![](dance-coptyright-dataset02.jpg)
![](dance-coptyright-dataset03.jpg)
![](dance-coptyright-dataset04.jpg)
![](dance-coptyright-dataset05.jpg)
![](dance-coptyright-dataset06.jpg)
![](dance-coptyright-dataset07.jpg)
![](dance-coptyright-dataset08.jpg)
![](dance-coptyright-dataset09.jpg)
![](dance-coptyright-dataset10.jpg)
![](dance-coptyright-dataset11.jpg)
![](dance-coptyright-dataset12.jpg)
![](dance-coptyright-dataset13.jpg)
![](dance-coptyright-dataset14.jpg)
![](dance-coptyright-dataset15.jpg)

# Reference

* [Dance Archiving Through Openpose](https://github.com/wansook0316/DanceAchivingThroughOpenpose)
