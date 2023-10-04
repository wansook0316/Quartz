---
title: Dilated Convolution
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

## 개요

앞서 알아본, FCN에서 발생하는 문제를 `Dilated Convolution`으로 해결하겠다는 논지이다.

## 핵심 아이디어

 > 
 > Dilated Convolution으로 parameter 수를 유지하면서 Pooling의 효과를 누리고, Resoultion이 줄어드는 것을 막는다.(~~일석삼조~~)

기존의 FCN에서는 pooling으로 인한 해상도 감소문제를 skip connection으로 해결하였다. 여기서, 근본적으로 pooling에 대해 해결하보려는 의지가 엿보인다. 우리가 Pooling을 하는 이유는 global feature를 multi-scale로 보기 위해서이다. 하지만 이런 관점은 classification의 관점에서 맞는 말이다.

segementation을 위해서는 결국 dense prediction을 얻어내야 하는데, 이는 `up-convolutions`와 `multi-scale inputs`를 통해 가능하다. `up-convolutions`는 [이전 글](https://wansook0316.github.io/ds/dl/2020/09/07/computer-vision-07-Learning-Deconvolutional-Network-for-Semantic-Segmentation.html)에서 찾아볼 수 있다. `multi sclae inputs`은 이름에서도 유추가 가능하듯이 하나의 이미지에 대해서 여러 scale에서 test를 하는 방법을 의미한다.

![](computer-vision-Dilated-Convolution1.png)
*multi scale inputs 예시*

`Dilated Convolution`은 애초에 pooling을 해야돼? 라는 질문에서 출발한다.

![](computer-vision-Dilated-Convolution2.gif)
*Dilated Convolution*

`Dilated Convolution`은 필터 내부에 `zero padding`을 추가해 강제로 `receptive field`를 늘리는 방법이다. 위 그림은 파란색이 인풋, 초록색이 아웃풋인데, 진한 파랑 부분에만 `weight`가 있고 나머지 부분은 0으로 채워진다. `receptive field`란 필터가 한 번의 보는 영영으로 볼 수 있는데, 결국 필터를 통해 어떤 사진의 전체적인 특징을 잡아내기 위해서는 `receptive field`는 높으면 높을 수록 좋다. 그렇다고 필터의 크기를 크게하면 연산의 양이 크게 늘어나고, 오버피팅의 우려가있다.

그래서 일반적인 CNN에서는 이를 `conv-pooling`의 결합으로 해결한다. `pooling`을 통해 dimension을 줄이고 다시 작은 크기의 filter로 conv를 하면, 전체적인 특징을 잡아낼 수 있다. 하지만 `pooling`을 수행하면 기존 정보의 손실이 일어난다. 이를 해결하기 위한것이 `Dilated Convolution`으로 `Pooling`을 수행하지 않고도 `receptive field`의 크기를 크게 가져갈 수 있기 때문에 spatial dimension의 손실이 적고, 대부분의 `weight`가 0이기 때문에 연산의 효율도 좋다.

## Structure

![](computer-vision-Dilated-Convolution3.png)
*Structure of using Dilated Convolution*

첫번째 그림은 classification을 위한 CNN VGG-16의 아키텍쳐이다. `conv-pooling`을 반복적으로 수행한 후, 마지막으로 `Fully Connected Layer`에 통과하여 최종 `classification` 결과를 얻는 과정을 보여주고있다. 그 아래의 그림은 `Dilated Convolution`을 통하여 이미지를 `segmentation`하는 예를 보여주고 있다. 이 아키텍쳐의 아웃풋의 사이즈는 28x28xN 이며, (N은 `segmentation` 원하는 클래스의 수) 이를 다시 `upsampling`하여 원래의 크기로 복원한다. (이부분에서 공간적 정보의 손실이 있다.)

이 아키텍쳐와 classification 아키텍쳐의 다른점은 우선 다이아몬드 모양으로 표시한 `dilated convolution`으 통해 공간적 정보의 손실을 최소화하였다. 그리고 `dilated convolution` 2번을 적용한 뒤 나온 28x28x4096 에 대하여 `1x1 convolution`으로 channel의 `dimension reduction`을 수행한다. 최종적으로 28x28xN이 나오고 이를 8x `upsampling`하여 최종적인 segmention 결과를 output으로 내놓는다. 이 때 1x1 convolution 은 공간적인 정보를 잃지 않기 위해 사용되며, `classification`의 `Fully Connected Layer(FC)`와 비슷한 역할을 한다. 하지만 `classification`에서는 공간적인 정보는 중요하지 않기 때문에 Flatten하여 사용하는 것이다. 이는 [앞선 글](https://wansook0316.github.io/ds/dl/2020/09/07/computer-vision-06-Fully-Convolutional-Networks.html)에서 자세하게 다뤄보았다.

## 결과

![](computer-vision-Dilated-Convolution4.png)*comparison of whether using dilated conv*

이 그림을 통해 `pooling-conv`후 `upsampling`을 하는 것과 `dilated convolution(astrous convolution)`을 하는 것의 차이를 볼 수 있다. 위 그림에서 볼 수 있듯 공간적 정보의 손실이 있는 것을 `upsampling` 하면 해상도가 떨어진다. 하지만 dilated convolution의 그림을 보면 `receptive field`를 크게 가져가면서 `convolution`을 하면 정보의 손실을 최대화하면서 해상도는 큰 `output`을 얻을 수 있다.

# Reference

* [Learning Deconvolution Network for Semantic Segmentation](https://modulabs-biomedical.github.io/Learning_Deconvolution_Network_for_Semantic_Segmentation)
