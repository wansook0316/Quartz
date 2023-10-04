---
title: Initialization
thumbnail: ''
draft: false
tags:
- deep-learning
- tensorflow
- neural-network
- initialization
created: 2023-10-04
---

# 초기값 주기

x, w = 0 일 경우 gradient가 0이 되서 학습이 안된다!

**모두 0이면 학습이 안된다!**

## Restricted Boatman Machine(RBM)

어떻게 Weight를 초기화 할 수 있을까?

그 해결방안 중 하나가 RBM이었는데, 아이디어는 간단하다.

뉴럴 네트워크가 만들어져 있다고 가정하자. 입력단은 3개, 출력은 4개. 우리가 이 뉴럴 네트워크를 학습할 때, 결국 크게 두개의 과정을 수행하게 되는데,

Forward Propagation, Backward Propagation 이다.

그래서 우리는 어떤 결과를 원하냐면, **입력 신호와 출력 신호가 같아지는 weight, bias를 구한다.**

이 때 weight, bias를 초기값으로 사용하겠다는 것이 RBM이다.

# RBM 과정

## Pre-training

![](_2019-07-21__1.23.14.png)
전체 네트워크를 초기화하는데 있어서,

2개의 Layer만 RBM을 적용한다. 순차적으로 2개씩 튜닝한 weight가 초기화한 weight이다.

# Xavier initialization

그렇게 안해도 돼!

너무 작거나, 너무 크게만 설정 안하면 될거야.

입력 개수 = fan_in, 출력 개수 = fan_out

````python
W = np.random.randn(fan_in, fan_out)/np.sqrt(fan_in)
````

# He initialization

````python
W = np.random.randn(fan_in, fan_out)/np.sqrt(fan_in/2)
````

이거 잘되던데..?
