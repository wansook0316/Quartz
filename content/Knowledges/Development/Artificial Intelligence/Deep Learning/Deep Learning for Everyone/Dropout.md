---
title: Dropout
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Overfitting?

Train data set에서는 accuracy가 높게 나오지만,

Test data set에서 accuracy가 낮게 나오는 현상

![](_2019-07-21__1.37.37.png)

Layer수가 늘어날 수록 training err는 떨어진다.

그런데 test 데이터를 넣었을 경우 err가 올라간다.

# Solutions for overfitting

1. 훈련데이터를 더 구한다.
1. Feature를 줄인다(Machine Learning algorithm)
1. **Regularization(Weight)**

# Regularization

Weight가 너무 들쭉날쭉해지는, 즉 overfitting이 일어나는 것을 규제하는 것.

값이 상대적으로 고르게 분포하도록 w를 만드는 것이 overfitting을 방지하는 방법이다.

[Regularization (mathematics) - Wikipedia](https://en.wikipedia.org/wiki/Regularization_(mathematics))

* L1 Regularization
  
  ![](_2019-07-21__2.24.21.png)
  [reference](https://towardsdatascience.com/intuitions-on-l1-and-l2-regularisation-235f2db4c261)

* L2 Regularization
  
  ![](_2019-07-21__2.24.25.png)
  [reference](https://towardsdatascience.com/intuitions-on-l1-and-l2-regularisation-235f2db4c261)

## Dropout

완전 연결망으로부터 끊어버리자!

![](_2019-07-21__2.09.18.png)
![](_2019-07-21__2.10.32.png)

각각의 뉴런은 특정 부분을 담당하는 전문가라고 생각하면 되는데,

이걸 모두 학습시키는 것보다, 중간 중간 끊은 뒤 학습하는 것이 보다 좋은 결과를 얻을 수 있다.

**학습할 때만! dropout을 사용한다.**

테스트 시에는 모든 전문가를 불러와서 평가한다!

````python
dropout_rate = tf.placeholder("float")
_L1 = tf.nn.relu(tf.add(tf.matmul(X, W1), B1))
L1 = tf.nn.dropout(_L1, dropout_rate)
...
# Train 할 때,
sess.run(Train, feed_dict={X:batch_xs, Y: batch_ys, dropout_rate: 0.7})

# 평가할 때,
print "Accuracy", accuracy.eval({X:X_testset, Y:Y_testset, dropout_rate: 1})
````

평가 시에는 dropout = 1로 한다.

# Ensemble

독립적인 모델 n개의 결과물을 집합하여 최종 결과물을 제출한다!

![](_2019-07-21__2.19.55.png)
