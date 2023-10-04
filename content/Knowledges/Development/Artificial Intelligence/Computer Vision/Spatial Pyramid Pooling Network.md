---
title: Spatial Pyramid Pooling Network
thumbnail: ''
draft: false
tags:
- computer-vision
- object-detection
- deep-learning
created: 2023-10-04
---

## 핵심 아이디어

 > 
 > 입력 이미지의 크기나 비율에 관계없이 CNN 학습은 불가한가?

Fast R-CNN으로 넘어가기전 상당히 많은 아이디어를 가져온 논문이다. 이전의 R-CNN을 보게되면, proposal roi가 CNN에 들어가기 전에 입력 이미지를 바꿔주어야 하는 한계가 존재했다. 여기서 저자들은 의문을 갖는다. 이 제한 요소를 없앤 상태로 CNN을 학습시키는 것이다.

![](Pasted%20image%2020231004171725.png)
*SPPNet의 핵심 아이디어*

사실 CNN의 입력이미지 크기는 고정될 필요가 없다. CNN의 핵심 아이디어는 filter를 가지고 연산을 수행하는 것이고, 이것의 연산 방식은 sliding window 방식으로 진행된다. 하지만, 이 입력 이미지의 크기가 고정이어야 하는 이유는, 마지막에 도출되는 fully connected layer의 크기가 고정적으로 나와야 하기 때문이다. 이 문제점으로 부터 SPPNet가 제안된다.

 > 
 > 입력 이미지 상관 없이 통과시키고, FC 전에 polling을 통해서 동일한 크기로 만들자!

굉장히 단순한 방법을 제안하였다. (...) 이런 방식을 사용할 경우, 원본 이미지의 특징을 고스란히 간직한 feature map을 얻을 수 있다. 추가적으로 비율도 조절하지 않기 때문에, 사물의 크기에 따른 변화도 감지가 가능하다.

위의 그림을 보면 Crop 후 conv에 넣는 것이 아니고, feature map을 만든 후, 이를 SSPNet에 넣어 모양을 맞춘 후에 output을 만드는 것을 볼 수 있다.

## 알고리즘

1. 전체 이미지를 pretrained model을 통과시켜 feature map을 추출한다.
1. 해당 feature map으로 부터 selective search를 통해 ROI를 뽑아낸다. 이 때 발생하는 ROI는 모두 크기와 비율이 다르다. 여기서 \*\**SSPNet*\*\*을 적용하여 고정된 크기의 feature vector를 추출한다.
1. FC layer를 통과시킨다.
1. 앞서 추출한 벡터로 각 이미지 클래스 별로 SVM을 학습시킨다.
1. 마찬가지로 해당 벡터로 bounding box regressor를 학습시킨다.

## Spatial Pyramid Pooling

![](Pasted%20image%2020231004171732.png)

그렇다면 어떤 방식으로 SPP가 돌아가는지 이해해야 한다. 먼저 CNN을 거친 feature map을 input으로 받는다. 그리고 이것을 미리 정해져 있는 영여긍로 나누어 준다. 위의 예시에서는 4x4, 2x2, 1x1 3개의 영역이 적용되어 있고, 이 각각을 하나의 피라미드라 부른다. 즉, 3개의 피라미드를 설정한 것.

이 피라미드는 4x4 짜리 고정된 CNN 필터 같은 것이 아니다. 어떠한 input이 들어오더라도 4x4 격자로 만든다는 표현이 더 맞는 표현이다. 예를 들어 입력이 64 x 64 x 256 크기의 피쳐 맵이 들어온다고 했을 때, 4x4의 피라미드의 bin의 크기는 16x16이 된다.

이제 이 각각의 bin에서 가장 큰 값만 추출하는 max pooling을 수행하고, 그 결과를 **쭉 이어 붙인다**. 입력 feature map의 채널 크기가 k, bin의 개수를 M이라 한다면, 해당 SSP의 output은 `k x M`의 크기를 가진 1차원의 벡터가 될 것이다.

## 한계

1. 여전히 multi stage model이다.
1. 여전히 SVM, selective search를 사용한다.
1. feature map을 만들어내는 network를 학습시키지 못한다.

# Reference

* [PR-012: Faster R-CNN : Towards Real-Time Object Detection with Region Proposal Networks](https://www.youtube.com/watch?v=kcPAGIgBGRs&list=PLWKf9beHi3Tg50UoyTe6rIm20sVQOH1br&index=12)
