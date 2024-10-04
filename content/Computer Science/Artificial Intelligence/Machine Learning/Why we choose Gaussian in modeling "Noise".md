---
title: Why we choose Gaussian in modeling "Noise"
thumbnail: ''
draft: false
tags:
- machine-learning
- deep-learning
- normal-distribution
- gaussian-distribution
created: 2024-09-12
---


 > 
 > 왜 기계학습 및 여러 시스템에서 노이즈를 모델링할 때 정규분포를 선택하는가?

* 그게 제일 합리적이라서.
* 첫째로 모형화하고자 하는 분포중에는 [Normal Distribution](../../../Math/Probability%20Theory/Normal%20Distribution.md)에 가까운 것들이 많다.
  * [Central Limit Theorem](../../../Math/Probability%20Theory/Central%20Limit%20Theorem.md) 에 의하면, 다수의 독립 확률 변수들의 합은 근사적으로 정규분포를 따른다.
  * 어떠한 시스템이 복잡해지면, 그 시스템의 출력은 다수의 요인에 의해 결정된다.
  * 이러한 시스템에는 노이즈가 발생할 수 밖에 없는데, 이 노이즈를 정규분포로 가정하는 것이 합리적이다.
* 둘째로 주어진 분포가 실수에 관한 불확실성을 얼마나 "Encoding"할 수 있는지를 따져볼 때, 동일 분산에 대한 분포중 가장 많은 양의 불확실성을 Encoding 할 수 있다.
  * 어떠한 노이즈를 모델링 하기 위해서는, 많은 불확실성을 담는 분포를 선택하는 것이 좋을 것이다.
  * 말 그대로 \*\*"노이즈"\*\*이니까 어떻게 튈지를 모른다.
  * 그럼에도 모델링을 통해 시스템을 만들어야 한다.
  * 이런 경우 특정 분포가 가장 많은 정보, 즉 불확실성을 담을 수 있어야 한다.
  * 혹은 가장 사전 지식이 적은 상태의 분포가 필요하다고도 말할 수 있겠다.
  * 그것이 [Normal Distribution](../../../Math/Probability%20Theory/Normal%20Distribution.md)이다.
