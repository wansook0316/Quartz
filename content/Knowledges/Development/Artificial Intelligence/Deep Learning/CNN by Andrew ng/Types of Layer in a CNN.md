---
title: Types of Layer in a CNN
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Types of Layer in a CNN

* Convolution
  
  여태껏 배운 합성곱을 사용하여 다음 레이어를 만드는 방식이다.

* Pooling

* Fully connected

## What is Pooling

**결과값을 압축한다!** 로 생각하면 이해가 빠르다.

이제부터 필터의 수도 많아질 것이고, 사실 input도 상당히 크기 때문에,

우리는 이 값들을 특정 방법으로 가중치들을 압축하는 것이 보다 효율적이다.

이 방법을 Pooling이라 한다.

## Max Pooling

![](Pasted%20image%2020231004141936.png)

* 이렇게 4 영역으로 나눠서 각 영역의 최대값만을 따오는 방식이다.
* 이 풀링의 hyperparameter는, s = 2, f = 2 이다.
* 이것의 의미는, 사실 output에서 특성을 추출하는데 있어서, 가장 큰 값 자체가 특성을 대변할 수 있다는 것을 시사한다.
* 그런데 이거는 그냥 직관적인 것이고, 사실 성능이 좋기 때문에 사용,,
* 우리도 왜 작동을 잘하는지 잘 몰라 ㅎㅎ..

자, 그런데 여기서 집중해야 하는 것은 이 풀링이 돌아갈때,

여기에는 어떠한 Parameter도 작용되지 않는다는 점이다.

즉, 우리가 원하는 가중치가 이 작업을 하는데 적용되지 않는다는 점!

![](Pasted%20image%2020231004141949.png)

한가지 더!

원래는 기존 이미지의 채널수와 한 필터가 가지는 채널수가 같아야 연산이 되며,

또, 필터의 개수에 따라 다음 layer의 채널 수가 정해지는데,

풀링은 채널에 각각 적용이 되어 기존 layer의 채널 수와 output layer의 채널 수는 같다.

## Average Pooling

![](Pasted%20image%2020231004141956.png)

평균으로 풀링하는 방식이다!

## Summary of Pooling

$$
Input;=;n\times n \times n_c\\ \ Output;=;({n+2p-f\over s} + 1)\times ({n+2p-f\over s} + 1) \times n_c\\
$$

* 입력의 채널 수와 출력의 채널 수가 같다.
* Parameter는 없다!!

$$
<Hyperparameters>\\ f = filter;size\\ s = stride\\ NO;Padding!\\ NO;Parameters!
$$

# Neural network Example

![](_2019-07-21__11.19.04.png)

* 일반적으로 Conv + Pool 을 묶어 Layer라고 말한다.

밑으로 내려감에 따라 파라미터의 수와, Layer의 모양, Size를 알아보자.

![](Pasted%20image%2020231004142010.png)

* 층이 깊어질 수록 크기는 작아진다.
* 그리고 Fully connected의 파라미터 수를 보면 어마어마하다.
* 반면 convolution 을 사용한 층은 파라미터수가 굉장히 작은 것을 알 수 있다.
* 그리고 풀링층은 파라미터가 없다.

이것을 입체적인 시각화를 해서 보자.

![](Pasted%20image%2020231004142018.png)

그리고 1차원적인 노드의 흐름으로도 보자.

![](Pasted%20image%2020231004142026.png)

출처 : [https://leonardoaraujosantos.gitbooks.io/artificial-inteligence/content/convolutional_neural_networks.html](https://leonardoaraujosantos.gitbooks.io/artificial-inteligence/content/convolutional_neural_networks.html)
