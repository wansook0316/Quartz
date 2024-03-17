---
title: Neural Net for XOR
thumbnail: ''
draft: false
tags:
- deep-learning
- tensorflow
- XOR
- neural-network
created: 2023-10-04
---

# XOR 문제

두 개의 인풋에 대해 1개의 결과값이 나오는 문제이므로 텐서플로우로 구현해보자.

결과값이 0 또는 1이므로, logistic regression으로 만들 수 있다.

````python
# Lab 9 XOR
import tensorflow as tf
import numpy as np

tf.set_random_seed(777)  # for reproducibility

x_data = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=np.float32)
y_data = np.array([[0], [1], [1], [0]], dtype=np.float32)

X = tf.placeholder(tf.float32, [None, 2])
Y = tf.placeholder(tf.float32, [None, 1])

W = tf.Variable(tf.random_normal([2, 1]), name="weight")
b = tf.Variable(tf.random_normal([1]), name="bias")

# Hypothesis using sigmoid: tf.div(1., 1. + tf.exp(tf.matmul(X, W)))
hypothesis = tf.sigmoid(tf.matmul(X, W) + b)

# cost/loss function
cost = -tf.reduce_mean(Y * tf.log(hypothesis) + (1 - Y) * tf.log(1 - hypothesis))
train = tf.train.GradientDescentOptimizer(learning_rate=0.1).minimize(cost)

# Accuracy computation
# True if hypothesis>0.5 else False
predicted = tf.cast(hypothesis > 0.5, dtype=tf.float32)
accuracy = tf.reduce_mean(tf.cast(tf.equal(predicted, Y), dtype=tf.float32))

# Launch graph
with tf.Session() as sess:
    # Initialize TensorFlow variables
    sess.run(tf.global_variables_initializer())

    for step in range(10001):
        _, cost_val, w_val = sess.run(
                  [train, cost, W], feed_dict={X: x_data, Y: y_data}
        )
        if step % 100 == 0:
            print(step, cost_val, w_val)

    # Accuracy report
    h, c, a = sess.run(
              [hypothesis, predicted, accuracy], feed_dict={X: x_data, Y: y_data}
    )
    print("\nHypothesis: ", h, "\nCorrect: ", c, "\nAccuracy: ", a)

'''
Hypothesis:  [[ 0.5]
 [ 0.5]
 [ 0.5]
 [ 0.5]]
Correct:  [[ 0.]
 [ 0.]
 [ 0.]
 [ 0.]]
Accuracy:  0.5
'''
````

응? 그런데 왜 잘 안되지..?

정확도가 50%면 틀린 결과라는 것도 같은 말이다!

어떻게 해결할 수 있을까?

# Neural Net

이걸 해결하는 방법이 Layer를 쌓아버리는 것이다.

Layer란 위에서 sigmoid 함수를 통과한 출력값을 다시한번

훈련시키는 것이다.

````python
W1 = tf.Variable(tf.random_normal([2, 2]), name='weight1')
b1 = tf.Variable(tf.random_normal([2]), name='bias1')
layer1 = tf.sigmoid(tf.matmul(X, W1) + b1)

W2 = tf.Variable(tf.random_normal([2, 1]), name='weight2')
b2 = tf.Variable(tf.random_normal([1]), name='bias2')
hypothesis = tf.sigmoid(tf.matmul(layer1, W2) + b2)
````

이 때, 주의해야 하는 것은, layer1의 출력 차원을 내가 조절할 수 있고,

또한 이 값이 layer2에 들어가게 되므로, 이 숫자를 맞춰서 넣어줘야 한다. 즉,

````python
W1 = tf.Variable(tf.random_normal([feature의 수, output1의 차원]), name='weight1')
b1 = tf.Variable(tf.random_normal([output1의 차원]), name='bias1')
layer1 = tf.sigmoid(tf.matmul(X, W1) + b1)

W2 = tf.Variable(tf.random_normal([output1의 차원, output2의 차원]), name='weight2')
b2 = tf.Variable(tf.random_normal([output2의 차원]), name='bias2')
hypothesis = tf.sigmoid(tf.matmul(layer1, W2) + b2)
````

이런식으로 꼬리를 물고 들어가게 된다.

머릿속으로 구체화가 되어있어야 한다!

이부분만 바꿔주고 다시 돌리게 되면,

````python
'''
Hypothesis:
[[0.01338216]
 [0.98166394]
 [0.98809403]
 [0.01135799]] 
Predicted:
[[0.]
 [1.]
 [1.]
 [0.]] 
Accuracy:
1.0
'''
````

잘 예측하는 것을 알 수 있다.

# Wide NN for XOR

\[2, 2\] → \[2, 1\] 으로 부터, \[2, 10\] → \[10, 1\] 으로 바꿔서 진행해보자.

````python
'''
Hypothesis:  [[  7.80511764e-04]
 [  9.99238133e-01]
 [  9.98379230e-01]
 [  1.55659032e-03]]
Correct:  [[ 0.]
 [ 1.]
 [ 1.]
 [ 0.]]
Accuracy:  1.0
'''
````

더 잘 학습되었다!

# Deep NN for XOR

````python
W1 = tf.Variable(tf.random_normal([2, 10]), name='weight1')
b1 = tf.Variable(tf.random_normal([10]), name='bias1')
layer1 = tf.sigmoid(tf.matmul(X, W1) + b1)

W2 = tf.Variable(tf.random_normal([10, 10]), name='weight2')
b2 = tf.Variable(tf.random_normal([10]), name='bias2')
layer2 = tf.sigmoid(tf.matmul(layer1, W2) + b2)

W3 = tf.Variable(tf.random_normal([10, 10]), name='weight3')
b3 = tf.Variable(tf.random_normal([10]), name='bias3')
layer3 = tf.sigmoid(tf.matmul(layer2, W3) + b3)

W4 = tf.Variable(tf.random_normal([10, 1]), name='weight4')
b4 = tf.Variable(tf.random_normal([1]), name='bias4')
hypothesis = tf.sigmoid(tf.matmul(layer3, W4) + b4)
````

레이어가 많을 수록 모델이 더 잘 학습된다.
