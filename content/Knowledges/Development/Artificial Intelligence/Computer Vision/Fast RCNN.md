---
title: Fast RCNN
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

## 핵심 아이디어

 > 
 > Feature Extraction, classification, bounding box regression까지 한번에 학습할 수 있는 모델을 만들자!

Fast R-CNN은 이전 SSP Net이 가지는 한계점을 극복하는 시도에서 출발한다. SSP Net은 1) Multi stage model이고 2) FC layer 만 학습 시킬 수 있다는 한계점이 있었다.

![](Pasted%20image%2020231004171750.png)

## 알고리즘

1. pretrained model로 부터 feature map을 추출한다.
1. Selective Search를 통해 찾은 각각의 ROI에 대해 **\*ROI Pooling**을 진행한다. 그 결과로 고정된 크기의 feature vector를 얻는다.
1. feature vector는 FC layer를 통과하고 두개의 branch로 나뉜다.
1. 하나의 branch에서는 softmax를 통과하여 해당 ROI가 어떤 물체인지 clasification을 진행한다.
1. 다른 branch에서는 bounding box regression을 통해 selective search로 찾은 박스의 위치를 조정한다.

핵심 의의는 multi stage model에서 end-to-end로 model을 구성했다는 것에 있다. 결과적으로도 속도, 정확도, 학습 속도 모두를 향상시켰다는데 의의가 있다.

## ROI polling

Roi pooling의 아이디어는 앞서 보았던 SPP Net과 유사하다. SPP Net은, pretrained model으로 부터 도출되는 feature map으로 부터, 피라미드 filter를 거친 후 이를 vectorize 하여 고정된 개수의 vector를 얻을 수 있었다. 이 아이디어를 조금 변경하여 제시하는 것이 Roi pooling이다.

![](Pasted%20image%2020231004171756.png)

1. feature map에서 Selective search를 통해 Resion Proposal을 진행한다.
1. 이 proposal에 Roi pooling을 진행하여 고정된 형태의 작은 feature map을 만든다.

Roi pooling은, Resion Proposal을 고정된 형태의 output 모양으로 바꾼다. (H x W) 크기의 feature map을 output으로 원한다면, proposal을 이에 맞게 칸을 나눈 후, max pooling을 진행한다. 이렇게 되면 항상 같은 크기의 결과를 얻을 수 있다.

## Multi Task Loss

딥러닝을 공부하면서 가장 새롭고 즐거웠던 부분은 손실함수 부분이었다. object detection은 기본적으로 bounding box regression과 classication을 동시에 진행해야 하는 Task이다. 그래서 예전 접근은 multi stage로 이루어졌었다. 하지만 이 Fast R-CNN에서 처음으로 이 두가지 task를 하나로 엮는 방법이 고안된다.

우리는 이미지로 부터 feature map을 추출했고, 이 feature map에서 Roi를 제안 받아 Roi pooling을 통해 feature vector를 만들었다. 이제 이 벡터로 classification과 bounding box regression을 적용하여 각각의 loss를 얻어내고, 이를 back propagation하여 전체 모델을 학습시키면 된다. 이 두 Task 모두를 반영한 손실함수를 보자.

$$
L(p, u, t^u, v) = L\_{cls}(p, u) + \lambda\[u \ge 1\]L\_{loc}(t^u, v)
$$

각 변수 하나하나에 대해서 알아보자. 먼저, $p$ 는, Softmax를 통해 얻어낸 $K+1$ 개의 확률값이다.(이산 확률 분포) $K+1$인 이유는 K개의 object와 배경(아무 물체도 아님)을 추가한 것이다. $u$는 해당 Roi의 ground truth label 벡터이다.

$$
p = (p_0, ..., p_n,..., p_k)\\
u = (0, ..., 1, ..., 0)
$$

다음으로는 [bounding box regression](https://wansook0316.github.io/ds/dl/2020/09/02/PaperReview-01-RCNN.html)을 진행한다. 고정 처리된 feature map을 가지고 regression을 했을 때 결과는, 각각의 class (K + 1) 에 대해 각각 x, y, w, h를 조정하는 파라미터 $t^k$를 리턴한다. 말로 풀어보면 다음과 같다. feature map으로 부터 1번 클래스 일 때 (x, y, w, h)를 ($t_x$, $t_y$, $t_w$, $t_h$) 로 변화시켜. 2번 클래스 일때는 ...(중략). 이 중에서 우리가 하고 싶은 것은, 이 결과를 바탕으로 이를 수정하는 loss function을 만들고 싶은 것이므로 이 결과들 중 ground truth에 속하는 u번째 t만 가져와서 사용한다. $v$는 ground truth bounding box 조절 값에 해당한다.

$$
t^k = (t^k_x, t^k_y, t^k_w, t^k_h)\\
t^u = (t^u_x, t^u_y, t^u_w, t^u_h)\\
$$

그렇다면 이제 각각의 loss function에 대해서 알아보자. 먼저 classification loss 는 log loss를 사용한다. 못맞출 수록 패널티를 크게 준다.

$$
L\_{cls}(p, u) = -logp_u
$$

`location`을 담당하는 loss는 아래와 같다.

$$
L\_{loc}(t^u, v) = \sum\_{i \in {x, y, w, h}}smooth\_{L_1}(t^u_i - v_i)
$$

bounding box를 만들기 위한 예측 조절값에서 실제 조절값을 smooth L1을 통과시킨 것의 합을 사용한다.

$$
smooth\_{L_1}(x) =

\\begin{cases}
0.5x^2 & \mbox {if }\left| x \right| \< 1 \mbox{ is even} \\
\\left| x \right|-0.5 & otherwise
\\end{cases}
$$

저자들은 실험 과정에서 라벨 값과 지나치게 차이가 많이 나는 `outlier`가 많았고, 이런 `outlier`에 민감하게 반응하는 L2 loss를 그대로 사용할 경우 `gradient explode`현상이 발생하는 것을 확인했다고 한다. 이를 제어하기 위해 custom한 loss function을 사용했다.

## Backpropagation through RoI Pooling Layer

이제 네트워크를 학습하면 된다. 그런데 이전의 SSP Net을 보면, `feature map`을 뽑아낸 후, SSP를 거쳐 나온 vector들에 대해 FC layer를 구성하고, 이 단계만 학습시켰던 것을 기억할 거다.(fine tuning) 위 논문에서 저자들은, 이미지의 특징을 추출하는 가장 중요한 역할인 CNN이 학습될 수 없다는 것에 집중한다. 즉, 어느 단계까지 fine tuning을 진행할 것인지, 또 그 fine funing을 진행할 경우 학습이 진행이 되는지(역전파가 전달이 되는지)를 이론적으로 검증한다.

$$
{\partial L \over \partial x_i } = \sum_r \sum_j \[i = i^\*(r, j)\]{\partial L \over \partial y\_{rj} }
$$

$x_i$라고 하는 것은 CNN을 통해 추출된 `feature map`에서 하나의 `feature`를 의미하고 이는 실수이다. 전체 Loss에 대해서 이 피쳐 값의 편미분 값을 구하면 그 값이 곧 xi에 대한 loss 값이 되며 역전파 알고리즘을 수행할 수 있다. 이제 피쳐 맵에서 RoI를 찾고 `RoI Pooling`을 적용하기 위해서 `H x W` 크기의 grid로 나눈다. 이 그리드들을 `sub-window`라 부르며, 위 수식에서 `j`란 몇번째 `sub-window`인지를 나타내는 인덱스이다. $y\_{rj}$는 이 `Roi Pooling` 을 통과하여 최종적으로 얻어진 ouput의 값이며 이 역시 실수이다.

![](Pasted%20image%2020231004171805.png)

$x_i$ 가 최종 `prediction` 값에 영향을 주려면 $x_i$가 속하는 모든 `Roi`의 `sub-window` 에서 해당 $x_i$가 최댓값이 되야 한다. $i^\*(r, j)$란 `Roi`와 `sub-window index j`가 주어졌을 때, 최대 피쳐 값의 인덱스를 말한다.

즉 수식을 보면 $\[i = i^\*(r, j)\]$ 이렇게 표현되어 있는데, 최대 패쳐 인덱스가 내가 구하길 원하는 피쳐와 같을 때는 1을 return, 아니면 0 을 return 하라는 의미이다. 결과적으로 우리는 $\partial L \over \partial y\_{rj}$ 이 값을 가지고 있고, 발생하는 모든 이 값을 더해서 적용시켜주면 $x_i$에 대한 `gradient`를 구할 수 있다.

종합하면, 우리는 앞서 구한 multitask loss를 RoI Pooling layer를 통과하여 CNN 단까지 fine-tuning 할 수 있다. 저자드은 실험을 통해서 실제로 CNN단 까지 fine tuning 하는 것이 성능 향상에 도움이 되었다는 실험 결과를 보여준다.

![](Pasted%20image%2020231004171812.png)

위 실험 결과는 fine-tuning 하는 깊이를 조절해가며 성능 변화를 실험한 것이다. CNN의 단을 깊이 학습시킬 수록 성능이 향상되었으며, 이 때 테스트에 소요되는 시간 변화는 거의 없는 것을 확인할 수 있다. 즉, CNN 단을 Object Detection에 맞게끔 fine-tuning 하는 것이 성능 향상의 키 포인트였다.

## 의의

1. `end-to-end` 모델 제안
1. 학습 단계 간소화
1. 정확도, 성능 개선

## 한계

1. region proposal을 selective search를 사용
   * 이는 CPU 연산으로만 가능하기 때문에 병목이 발생
   * 이 부분이 inference를 수행하는데 있어 가장 많은 시간을 차지함

# Reference

* [갈아먹는 Object Detection \[3\] Fast R-CNN](https://yeomko.tistory.com/15?category=888201)
