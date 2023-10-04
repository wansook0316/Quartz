---
title: Tensorflow Installation
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# **Tensorflow란?**

구글에서 만든 데이터 플로우 그래프를 사용해서 수치적 계산을 위한 오픈소스 라이브러리.

# **Data Flow Graph란?**

**Edge** : Data / Data Array / Tensor

**Node** : Operator

이 그래프 속에서 Tensor들의 흐름으로 계산을 진행 -> Tensorflow

# **Tensorflow Hello World**

version 확인

````python
import tensorflow as tf
tf.__version__
````

````python
# Create a constant op
# 그래프에 하나의 노드를 추가함
hello = tf.constant("Hello, TensorFlow!")

# 세션을 만듦
sess = tf.Session()

# run the op and get result
print(sess.run(hello))
````

````python
b'Hello, TensorFlow!'
````

# **Computational Graph**

1. 필요한 노드를 만들기

````python
node1 = tf.constant(3.0, tf.float32)
node2 = tf.constant(4.0) # also tf.float32 implicitly
node3 = tf.add(node1, node2)
````

2. 각각을 출력해보자.

````python
print("node1:", node1, "node2:", node2)
print("node3: ", node3)
````

````
node1: Tensor("Const_1:0", shape=(), dtype=float32) node2: Tensor("Const_2:0", shape=(), dtype=float32)
node3:  Tensor("Add:0", shape=(), dtype=float32)
````

각각의 값은 텐서 객체로 선언이 되어 있으므로, 각자를 찍어보면 텐서라는 정보 밖에 안 찍히는게 당연하다.

3. 결과값을 나오게 하려면, 세션을 실행시켜야 한다!

````python
sess = tf.Session()
print("sess.run(node1, node2): ", sess.run([node1, node2]))
print("sess.run(node3): ", sess.run(node3))
````

constant 노드는 그냥 값이 찍히고,

operation node는 연산 수행후 결과값이 찍힌다.

# **텐서플로우의 동작과정**

![](Pasted%20image%2020231004135145.png)

1. 그래프를 그린다.
1. 각 노드를 실행 시킨다.
1. 변수를 업데이트 한다.

# **Placeholder 란?**

실제로 우리가 계산을 수행할 때,

위에서 사용한 constant 처럼 값이 고정되어서 사용되는 일 보다는 계속 해서 업데이트 되는 녀석을

가지고서 연산을 수행하는일이 많다.

기본적으로 학습하는 과정에서 가중치를 업데이트를 해줘야 하기 때문이다.

그렇다면, 전체적으로 모델을 학습하는 과정에서 생기는

연산과정, 즉 그래프는 동일하지만

안에 들어가는 **데이터** 가 변화할 때는 어떤 자료형(객체)를 사용하면 될까?

텐서플로우에서는 placeholder 라는 개념을 차용해서 사용한다.

````python
a = tf.placeholder(tf.float32)
b = tf.placeholder(tf.float32)
adder_node = a + b  # + provides a shortcut for tf.add(a, b)

print(sess.run(adder_node, feed_dict={a: 3, b: 4.5}))
print(sess.run(adder_node, feed_dict={a: [1,3], b: [2, 4]}))
````

a 노드와 b노드는 placeholder 노드로 선언되었다.

그리고 두 노드를 더하라는 노드를 `adder_node` 라 선언했다.

(이 때, tf.add(a, b)를 + 연산자를 오버로딩해서 사용할 수 있게 만들어 두었다.)

그리고 나서 우리가 `adder_node` 를 실행하면,

`adder_node` 는 자기가 어떤 노드를 받아 노드를 실행해야 하는 지 모른다.

그렇기 때문에 우리는 이 노드에 **밥(feed)** 를 주어야 하는데,

그것이 바로 ***feed_dict* 이다.**

````
7.5
[ 3.  7.]
````

Array 로 넣어줄 경우, 각각을 병렬로 계산해서 결과값을 내놓는 것을 알 수 있다.

# **What is Tensor**

![](Pasted%20image%2020231004135131.png)

텐서는 3차원 이상의 데이터가 모여있는 걸을 칭한다.

행렬같은 경우는 2차원의 데이터 형태라고 생각할 수 있다.

이 차원에 대한 개념을 우리는 **Rank** 라 한다.

실제 선형 대수에서 사용하는 차원의 개념과 거의 동일하다.

이 때, 행렬도 행과 열의 길이에 따라 모양이 변화한다.

같은 원리로 텐서도 그 모양이 정해질 수 있으며, 우리는 이것을 **Shape** 이라 한다.

그리고, 각 node에 값이 들어갈 때, 기본적으로 데이터가 가지는 자료형이 있을 것이다.

텐서플로우에서는, `int32`, `float32`... 같은 자료형이 존재한다.

이것을 **Type** 이라한다.

# Reference

* \[DeepLearningZeroToAll\](https://github.com/hunkim/DeepLearningZeroToAll\](https://github.com/hunkim/DeepLearningZeroToAll)
