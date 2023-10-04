---
title: Deep Sort
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# 개요

SORT(Simple Online and Realtime Tracking)은 매우 알고리즘이 간단함에도 불구하고 효과적이고 실용적인 다중 대상 추적 알고리즘이다. IOU를 기반으로 추적된 물체에 대해 association(할당)을 진행하기 때문에 매우 빠르다. 하지만 Id Switching(원래의 타겟을 잡지 못하고 다른 id를 배정하는 문제)가 여전히 많이 발생한다는 문제가 있다. IoU를 기반으로 매칭할 경우 여럿 문제점이 여전히 존재한다.

1. 물체가 빠르게 움직였을 경우 IoU는 작게 판단될 수 있다.
1. Occulusion(가려짐)이 발생했을 때 Detector가 Box를 작게 탐지했다면 IoU가 작게 나와 결과가 무시될 수 있다.

Deep Sort(SORT with A Deep Association Metric)에서는 SORT에 비해 명백한 정보를 통합하여 SORT의 성능을 향상시킨다. 이 확장된 방법은 타겟이 장기간 가려졌을 경우에 대해 더 잘 대처할 수 있도록 설계되었다. Id Switching은 45% 감소한 결과를 보였다.

# SORT

DeepSort에 대해서 이해하기 위해서는 먼저 SORT 알고리즘에 대한 개략적인 내용을 이해해야 한다. 실용적으로 가장 많이 사용되는 알고리즘 중의 하나이다. 핵심은 칼만 필터와 헝가리안 알고리즘으로 나뉜다.

## Kalman Filter

칼만 필터는 보통 제어 분야에서 많이 사용되는 필터이다. 크게 예측을 담당하는 모션 모델과 실제 값을 가져오는 측정 모델, 그리고 이 두개의 결과를 종합하는 업데이트의 과정을 거친다. 하나하나 직관적으로 이해해보자.

### Motion Model

1차원 공간이 있다고 해보자. 저기 멀리 강아지가 공을 주으러 달려가고 있다. 이전에 이녀석이 뛰는 가다를 보니, 내 머리속으로 보았을 때 강아지의 위치는 1초 뒤에 약 1m정도 앞에 있을 거라고 예상했다. 하지만 내 판단 역시 오류가 있을 수 있기 때문에 오차 범위 5%이내에 있다고 생각할 수 있다. 이러한 오차는 곧 내가 생각하는 위치를 기반으로 한 확률 분포(보통 정규분포)로 가정할 수 있다. 지금 말한 부분이 칼만 필터의 **Motion Model** 이다. 즉 **예측**이다.

### Measurement Model

그런데 실제 측정해보니 얘가 좀 힘들어서 인지 0.8미터 밖에 가지 않았다고 내 레이더 측정기가 말한다. 그런데 모든 기계는 오차를 가질 수 밖에 없으므로 기계로 측정한 결과 역시 확률 분포로 표현한다. 이 부분이 측정 단계이다.

### Update

그렇다면 실제로 내 강아지는 어디에 위치할 확률이 가장 높을까? 지금 상황에서는 강아지가 있는 위치를 어느정도 측정했기 때문에 측정 값의 결과를 많이 반영하여 0.8m 위치에 보다 가중치가 담겨 있다고 말할 수 있을 것이다. 하지만 만약 레이더의 결과가 없다면 어떨까? 내 예측의 결과를 기반으로 강아지의 위치를 산정해야 할 것이다.

### Summary

결과적으로 칼만 필터는 내가 예상한 결과와 실제 측정된 결과물을 기반으로 실제 물체의 위치를 최적으로 판단하는데 사용된다. 자세한 내용은 검색을 통해서 이해하는 것으로 하고 지금은 흐름만 따라가자.

## Hungarian Algorithm

헝가리안 알고리즘은 이분 그래프에서 최적의 매칭을 찾는 알고리즘이다. 자세한 구현보다는 의미에 중점을 두겠다.

### Assignment Problem

나는 서비스 센터를 운영하는 센터의 센터장이다. 냉장고가 고장났다는 연락이 10건이 들어왔다. 현재 나는 12명의 기사님을 운용할 수 있다. 각각의 기사님은 다른 지역에 있고, 고치는 능력이 모두 상이하다. 어떻게 해야 최적으로 서비스를 제공할 수 있을까?

컴퓨터 공학과이거나 알고리즘을 공부해본 사람이라면, 이 문제는 할당 문제이고, 이분 그래프에서 최적 매칭을 찾는 문제임을 알 수 있을 것이다. 만약 서비스 기사님이 10명이라면, 완전 매칭을 찾는 문제가 되겠다. 이 문제를 풀기 위해서는 그래프의 간선을 정의하는 Cost Metric이 필요하다.

## SORT Algoritm

![](computer-vision-deep-sort1.jpg)
*SORT flowchart*

SORT 알고리즘은 이 두가지 방법을 기반으로 작동한다. 제대로 된 알고리즘의 흐름을 이해하기 전에 용어를 정리하고 가자.

* Track
  * 현재 Tracking되고 있는 Object의 정보를 관리한다.
* Detections
  * 현재 이미지에서 탐지한 물체의 Bounding Box와 물체의 class를 가진다.
* IoU(Intersection of Union)
  * Ground truth bounding box와 탐지된 Bounding box와의 비율을 의미한다.
  * 겹쳐진 넓이/전체 넓이
  * 교집합/합집합
* Unmatched Tracks
  * 현재 탐지된 결과와 Track이 할당되지 못한 경우를 의미한다.
  * 즉, Track이 남는다.
  * 일정 시간이 흐른 뒤에 해당 Track의 id는 삭제된다.
* Unmatched Detections
  * 현재 탐지된 결과 중 기존의 Track과 일치하는 것이 없다.
  * 즉, Detection이 남는다.
  * 때문에 새로운 트랙이 생성되어서 Following해야 한다.
* Matched Track
  * Matching이 제대로 이루어진 경우를 말한다.

### Process

1. Detection
   * 이미지를 input으로 받아 존재하는 물체에 대해 Bounding box 정보를 받는다.
1. Kalman Filter Predict
   * 칼만 필터를 통해, 기존의 Track 정보로 부터 다음 frame의 물체의 위치를 예측한다.
1. IoU Matching
   * Detections 결과와 Predictions의 결과를 기반으로 **할당 문제**를 해결한다.
   * 이 부분에서 헝가리안 알고리즘을 통해 할당을 진행한다.
   * Metric으로는 IoU를 사용한다.
1. Matching result
   1. Unmatched Tracks는 일정 시간 이후 삭제한다.
   1. Unmatched Detections는 새롭게 트랙을 생성하고 Tracks에 담는다.
   1. Matched Tracks
1. Kalman Filter Update
   * 현재 가진 Matched Tracks를 다음 frame을 위해 Bounding box를 예측한다.
1. Reculsive
   * 이 과정을 재귀적으로 진행한다.

### Limit

굉장히 간단하지만 SORT 알고리즘은 높은 성능을 보이는 알고리즘이다. 하지만 Occulusion에 약한 모습을 보이고, Id switching에 여전히 취약했다. IoU 역시 복잡한 상황에서 문제를 해결하기에는 부족했다.

# DeepSort

이러한 단점을 DeepSort 에서는 Apperance infomation을 통해서 이를 해결했다. ReID Domain에서 Feature extraction을 수행하고, Detection들과 Tracks를 Matching하는데 있어 Metric으로 사용했다.

## Process

![](computer-vision-deep-sort2.jpg)
*DeepSort flowchart*

1. Detection
   * 이미지를 input으로 받아 존재하는 물체에 대해 Bounding box 정보를 받는다.
1. Kalman Filter Predict
   * 칼만 필터를 통해, 기존의 Track 정보로 부터 다음 frame의 물체의 위치를 예측한다.
1. Track Check
   * 해당 Tracks 들이 충분한 근거를 가진 Track인지 확인한다.
   * 3번 이상 물체를 탐지하여 Track으로 인정받을 경우 "Confirm" 그렇지 않을 경우 "Tentative" 상태로 표현된다.
1. **Matching Cascade**
   * Confirmed인 tracks에 대해서 매칭을 진행한다.
   * 이전 보다 정확한 Track 정보를 추출할 수 있다.
   * 이 부분은 아래에서 상세히 다루도록 한다.
1. IoU Matching
   * Match되지 않은 Track, Detection들에 대해서 기존의 SORT에서 사용한 IoU 매칭을 진행한다.
   * 새롭게 발견된 Detection에 대해 적용 시켜주기 위함이다.
   * 또한 Matching하지 못한 Track들에 대해 보완하기 위한 목적도 있다.
1. Tracking Life Cycle
   * 매칭 결과를 기반으로 Track 객체의 생애주기를 정해주는 부분이다.
   1. Unmatched Tracks
      * 아예 오판한 경우는 삭제한다.
      * 기존에 Tracker로 잘 활동하는 녀석의 경우 일단 대기를 진행하다가 오랜 시간 살아남아있을 경우(age) Tracker의 목적을 다한 것으로 판단하고 삭제한다.
      * 그렇지 않은 경우 물체가 다시 등장할 가능성이 있으므로 Tracks에 다시 추가한다.
        * 업데이트가 된 이후 탐지되지 못한 시간을 나타내는 변수 `time_since_update`를 1늘린다.
   1. Unmatched Detections
   * 새롭게 탐지된 객체이므로 Track을 생성한다.
   * 하지만 오판된 객체일 수 있으므로 상태는 "Tentative"로 설정한다.
   3. Matched Tracks
   * 업데이트 된 이후 지속된 시간을 나타내는 변수 `time_since_update`를 초기화한다.
1. Kalman Filter Update
   * 현재 가진 Matched Tracks를 다음 frame을 위해 Bounding box를 예측한다.
   * 이 때, Track의 정당성을 주기 위해, Track이 등장한 횟수(hit)가 3회 이상 나왔을 경우 상태를 "Confirmed"로 변경한다.
1. Reculsive
   * 이 과정을 재귀적으로 진행한다.

이 부분에서 가장 핵심은 역시 **Matching Cascade**이다. 어떻게 진행하는지 알아보자.

## Matching Cascade

![](computer-vision-deep-sort3.jpg)
*Matching Cascade flowchart*

$$
c\_{i, j} = \lambda d^{(1)}(i, j) + (1-\lambda)d^{(2)}(i, j)
$$

Matching cascade에서 사용하는 헝가리안 알고리즘의 Metric은 위와 같다. $d^{(1)}$ 과 $d^{(2)}$의 가중 평균으로 구성되어 있다. 차근차근 알아보자.

### Distance 1

첫번째 $d^{(1)}$은 Motion에 관련된 (kalman filter가 예측하는 4가지 지표) 분포에 있어서 Metric으로 사용하고 있다. 

이 때 예측 값과 측정 값의 매칭정도를 파악하는데 있어서 마할라노비스 거리를 사용한다. 마할라노비스 거리는 두개의 분포 사이 분산을 고려한 거리를 말한다. 좀더 정확하게 말하면 평균과의 거리가 표준편차의 몇 배인지를 수치로 나타낸 값이다. 

분산이 크다는 것은 값이 불확실하다는 의미를 갖는다. 이럴 경우 평균과의 거리를 표준편차로  나눈다면 분산이 큰 경우가 분산이 작은 경우보다 작은 값이 나올 것이다. 마할라노비스 거리가 작은 값을 갖는다는 것은 매우 이상한 값이라는 의미를 갖는다.

![](computer-vision-deep-sort4.png)
![](computer-vision-deep-sort5.png)

혹은 첫번째 그림에서 정규화를 통한 거리를 측정한다고 이해해도 되겠다.

예측 단계에서 우리는 box의 중심 위치 $u, v$, aspect ratio $\gamma$ 높이 $h$를 업데이트 한다. 이 값은 분포로 나오게 되고, 서로 다른 분산을 고려하기 위해서 유클리드 거리보다는 마할라노비스 거리를 사용하는 것이 보다 매칭에 맞는 척도이다. 그 이유는 각각의 매칭의 정도를 비교하는데 이상한 매칭일 경우 큰 값을 뱉어주는 수식이기 때문이다.

### Distance 2

두번째 $d^{(2)}$는 물체가 가지는 모양을 판단하기 위한 것이다. Neural net을 통과한 이미지는 끝단으로 갈수록 물체의 추상적 정보를 담게된다. 이 점에서 착안하여, 이전에 탐색한 물체의 Feature를 가진 상태로 새롭게 탐지된 물체와의 유사도를 판단하는 것.

이 부분을 사용하게 되면, 예측된 track의 motion이 동일한 정도가 높을 경우, 이를 반영하는 지표로 사용될 수 있다. 또한 장기간 occulsion 이후 동일성을 회복시키는데도 유용하다.

### gated matrix

이 두가지 지표를 가중 평균하여 cost matrix를 사용하지만, 추가적으로 하나의 과정을 더 적용한다. 각각의 distance matrix에서 threshold를 넘는 값에 대해서는 cost를 1로 고정한다. 이 각각의 threshold는 실험으로 구했다.

하지만 실제로는 $\lambda$를 0으로 하여 ~~~그럼 힘들게 왜 읽었을까~~~ appearance distance만 사용해도 높은 성능이 나왔다고 한다. 하지만 distance2에 대해서 gate_matrix는 사용했다.

### What Cascade means

![](computer-vision-deep-sort6.png)

그런데 왜 Cascade일까? 5번 line을 보면, Age_max일 때까지 loop를 돌고, track 중에 해당 age와 일치하는 track부터 매칭을 시작한다. 먼저 age는 해당 track이 생성된 이후부터 몇개의 frame에서 나타났는지를 의미하는 변수이다. 즉, 생성된 지가 얼마 안되면 나이가 가장 어리다.

가장 최근에 생성된 track부터 먼저 할당하는 이유는 무엇일까? 가장 최근에 태어난 녀석은 비교적 불확실성이 작다. 그렇기 때문에 할당도 가장 쉽게 될 것이다. 하지만 이 녀석 때문에 오래전에 나온 track의 경우 가려짐을 당해 kalman 필터는 이녀석을 예상하는데 있어서 큰 불확실성을 가질 것이다. 즉 큰 분산을 갖는다.

위의 마할라노비스 거리를 기반으로 생각해 볼 때, 분산이 클 경우 거리가 더 가깝게 판단할 경우가 많다. 이렇게 되면 track이 더 많이 생성된다.(잘 모르겠습니다 ㅠ) 따라서 자주 보이는 객체에 대해 먼저 매칭을 진행하여 이러한 경우를 줄이는 방법을 사용한다.

## Class Diagram

![](computer-vision-deep-sort7.png)

이 클래스 다이어그램을 보고 코드 리딩을 하면, 보다 쉽게 구현을 이해할 수 있다.

# Reference

* [DeepSort Paper](https://arxiv.org/abs/1703.07402)
* [SORT Paper](https://arxiv.org/pdf/1602.00763.pdf)
* [DeepSort Implementation](https://github.com/nwojke/deep_sort/tree/280b8bdb255f223813ff4a8679f3e1321b08cdfc)
* [Mahalanobis distance intuitive explanation](https://darkpgmr.tistory.com/41)
* [DeepSort Explanation Video](https://www.youtube.com/watch?v=LbyqsoLJu5Q&t=786s)
* [Kalman Filter Explanation](https://www.youtube.com/watch?v=0GrF_IaFCPQ&t=2s)
* [Hungarian Algorithm Explanation](https://gazelle-and-cs.tistory.com/29)
