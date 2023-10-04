---
title: Single Shot Multibox Detector
thumbnail: ''
draft: false
tags:
- computer-vision
- object-detection
- convolution
- deep-learning
created: 2023-10-04
---

# 개요

![](computer-vision-single-shot1.png)
*detection paper saga*

이제는 오랜 시간이 지난 논문인 SSD를 **간단하게** 리뷰 해보려 한다. 매우 직관적인 구조를 가지고 있어 많은 구조가 이 SSD를 기반으로 만들어지고 있다. YOLO v1 이후에 나온 논문으로 1 stage detector의 성격을 가지나 아키텍쳐는 전혀 다른, 오히려 RCNN 계열과 비슷한 특징을 가진다. SSD 알고리즘을 한 문장으로 정리하면, feature map을 만드는 공간을 나누어 진행한다. 그리고 각 feature map에서 다른 비율과 스케일로 default box를 생성하고, 이 box를 기반으로 모델을 통과 시켜 좌표와 클래스를 계산한다. 마지막으로 이 값을 기반으로 최종 bounding box를 생성한다.

# Model

Image Detection은 이미지가 있을 때, 이미지 안에 들어있는 사물을 찾는 문제이다. 여기서 찾는다는 것은 사물들의 위치와 크기를 알아내고, 물체를 검출하는 것이다. 즉, image pixel이 들어갔을 때, 사물이 어떤 class인지 나타내는 class 점수와, 사물의 offset(x, y, w, h)를 output으로 뱉는 함수를 만들면 된다.

![](computer-vision-single-shot2.png)
*SSD Architecture*

SSD의 아키텍쳐는 위와 같다. 직관적으로 이해가 될 만큼 간단한 구조이다. 먼저 SSD는 Transfer learning을 위해 FC layer를 제외한 VGG-16아키텍쳐를 사용했다. 그 뒤의 추가적인 네트워크로는 **CONV**를 사용하여 **다양한 크기**로 feature를 추출하고 이 feature에서 각각 detection을 수행한다.

## Convolution Predictors

마지막 예측 단계에서 과감하게 FC later를 삭제하고 CONV만을 이용하여 예측을 진행한다.  그렇기 때문에 굉장히 빠른 속도를 보여준다.

## Multi-scale Feature Maps

다양한 크기의 물체에 대해 정답을 맞출 수 있다. feature map은 깊어질 수록 보다 추상적인 정보를 담는다. 다양한 feature에서 scale에 덜 민감하도록 예측하는 방식은 크기에 상관없이 물체의 특징을 잡아낼 수 있는 방법이다.

다시 생각해보자. 위의 아키텍쳐를 보게되면, depth가 깊은 feature map에서도 같은 크기의 cnn width와 height를 가진 것을 볼 수 있다. 더 깊은 네트워크일수록 더 넓은 부분을 커버한 결과를 가지고 예측을 수행하고 있다. 후의 결과에서도 알 수 있겠지만 실제로 앞단의 feature map에서는 보다 작은 물체에 대해서 detection 결과가 좋고, 뒷단에서는 큰 물체에 대한 결과가 좋음을 확인할 수 있다.

![](computer-vision-single-shot3.png)
*Result of Multi scale Feature maps*

이 결과를 보게되면 8x8에서는 작은 물체(고양이)를 탐지하고  4x4에서는 큰 물체(강아지)를 탐지하는 모습을 볼 수 있다. 이 결과는 굉장히 당연한데, 다음에 설명할 전체 과정 중에서 IoU를 기반으로 각각의 feature map을 통한 결과를 threshold를 거쳐 걸러내는 과정을 거친다. 8x8에서도 역시 탐지 default box를 통해 예측을 진행하지만 gt box에 비해 너무 작아서 IoU값이 작게 나오게 되어 걸러지게 된다. 따라서 큰 물체는 작은 feature map size를 가지는 공간에서 예측이 진행된다.

## Default Boxes and Aspect Ratios

![](computer-vision-single-shot4.png)
*The way of Prediction in SSD*

위의 아키텍쳐를 보게되면 각각의 feature map에서 추출하는 class의 개수가 표현되어 있다. 어떤 의미인지 알아보자. 

 > 
 > classifier : CONV: 3x3(6x(classes+4))

분류기로 CONV를 사용하고, 3x3의 필터를 사용할 것이고 (channel은 어차피 이전 네트워크의 channel과 같아야 하니 표현하지 않은 듯) default box를 기준으로(사전에 정의해둔 box들) 6개의 box를 뽑을 것이며, 그리고 class의 개수 만큼 예측하고, 각각의 bounding box의 예측값(x, y, w, h)를 포함한 개수만큼을 뽑을 거야. 라는 이야기다.

예를 들어 설명해보자. 만약 내가 사전에 모양을 잡아둔 default box가 6개라고 해보자. 그리고 물체의 class 종류는 21개이다. 그렇다면 convolution 필터의 개수는 6개의 box에 대해서 각각 21+4개의 값을 예측해야 하므로 150 x (21+4) = 150 개의 채널이 필요하다.

## Process

![](computer-vision-single-shot5.png)
*Total Process of SSD*

1. 300x300x3짜리 이미지를 VGG-16를 통과시켜 38x38x512의 feature map을 생성한다.
1. 다양한 크기의 feature map을 크기를 줄여가면서 생성한다.
1. 각각의 feature map에서 사전에 정의된 default box를 적용하여 y값을 예측한다.
   * 이 때, 각각의 default box와 gt box와의 최적 매칭을 진행하기 위한 metric으로 IoU(Jaccard overlap)을 사용한다. 
   * threshold를 도입하여 일정 이하의 매칭은 제거한다.
1. threshold를 통과한 모든 아웃풋을 한데 묶어 NMS을 진행하고 결과를 생성한다.

# Training

이렇게 예측한 bounding 박스에 대해 어떻게 훈련을 진행할까? 1 stage detector임에도 불구하고 목적 함수는 Faster RCNN과 거의 똑같다. 

$$
L(x, c, l, g) = {1 \over N} (L\_{conf}(x, c) + \alpha L\_{loc}(x, l, g))
$$

![](computer-vision-single-shot6.png)
*Lconf : classification loss*

![](computer-vision-single-shot7.png)
*Lloc : localization loss*

* N : 매칭된 default bounding box들의 개수
* Lconf : classification loss -> cross entorpy
* Lloc : localization loss -> smooth L1 loss

# Choosing Scales and Aspect Ratios for Default Boxes

![](computer-vision-single-shot8.png)
*scale, aspect ratio for default boxes*

Default box의 w, h는 위의 식을 기반으로 생성된다. 이 때 m은 detection을 하는데 사용하는 feature map의 개수이다. 혹은 detector의 개수. 현재는 6이다. 각각의 feature map에서의 scale 값이 나오게되고, 사전에 정의된 aspect ratio를 기반으로 Wk, Hk가 나오게 된다. aspect ratio가 1인 경우에는 $s^\prime_k = \sqrt {s_ks_k + 1}$이 추가된다. 이렇게 총 6개의 default box가 생성이 된다.

# Hard Negative Mining

detection은 근본적으로 갖고 있는 class inbalance 문제를 해결해야 한다. 배경이 탐지될 결과가 더 많기 때문에 훈련에 부정적인 영향을 미치는 (Negative) 배경 탐지 결과의 비율을 줄여줘야 한다. 

그래서 저자들은 back ground인데 그렇지 않다고 판단한 negative sample 을 정렬하고 negative sample과 positive sample의 비율이 3:1이 되도록 골라주는 작업을 거친다.

# Conclusions

* Single Shot object detector for multiple categories
* multiple convolutional map을 동해 다른 scale을 가지는 object를 다루었다.
* default box가 많을 수록 좋은 결과를 얻을 수 있다.
* 굉장히 단순한 모델이다.

# Reference

* [SSD Paper](https://arxiv.org/abs/1512.02325)
* [PR-132: SSD: Single Shot MultiBox Detector](https://www.youtube.com/watch?v=ej1ISEoAK5g)
* [\[논문\] SSD: Single Shot Multibox Detector 분석](https://taeu.github.io/paper/deeplearning-paper-ssd/)
* [SSD 리뷰](https://wansook0316.github.io/cv/projects/2021/03/19/Face-Detection-and-tracking-with-ssd-network-02-Paper-Research-1.html)
