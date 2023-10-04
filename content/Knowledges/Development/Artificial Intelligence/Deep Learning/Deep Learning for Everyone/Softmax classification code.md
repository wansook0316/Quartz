---
title: Softmax classification code
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Softmax classification

````python
# Lab 6 Softmax Classifier
import tensorflow as tf
tf.set_random_seed(777)  # for reproducibility

x_data = [[1, 2, 1, 1],
          [2, 1, 3, 2],
          [3, 1, 3, 4],
          [4, 1, 5, 5],
          [1, 7, 5, 5],
          [1, 2, 5, 6],
          [1, 6, 6, 6],
          [1, 7, 7, 7]]
# One-hot Encoding 이라 한다.
y_data = [[0, 0, 1],
          [0, 0, 1],
          [0, 0, 1],
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
          [1, 0, 0],
          [1, 0, 0]]

X = tf.placeholder("float", [None, 4])
Y = tf.placeholder("float", [None, 3])
nb_classes = 3

W = tf.Variable(tf.random_normal([4, nb_classes]), name='weight')
b = tf.Variable(tf.random_normal([nb_classes]), name='bias')

# tf.nn.softmax computes softmax activations
# softmax = exp(logits) / reduce_sum(exp(logits), dim)
hypothesis = tf.nn.softmax(tf.matmul(X, W) + b)

# Cross entropy cost/loss
cost = tf.reduce_mean(-tf.reduce_sum(Y * tf.log(hypothesis), axis=1))

optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.1).minimize(cost)

# Launch graph
with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())

    for step in range(2001):
            _, cost_val = sess.run([optimizer, cost], feed_dict={X: x_data, Y: y_data})

            if step % 200 == 0:
                print(step, cost_val)

    print('--------------')
    # Testing & One-hot encoding
    a = sess.run(hypothesis, feed_dict={X: [[1, 11, 7, 9]]})
		# 최댓값의 argument를 리턴해줌
    print(a, sess.run(tf.argmax(a, 1)))

    print('--------------')
    b = sess.run(hypothesis, feed_dict={X: [[1, 3, 4, 3]]})
    print(b, sess.run(tf.argmax(b, 1)))

    print('--------------')
    c = sess.run(hypothesis, feed_dict={X: [[1, 1, 0, 1]]})
    print(c, sess.run(tf.argmax(c, 1)))

    print('--------------')
    all = sess.run(hypothesis, feed_dict={X: [[1, 11, 7, 9], [1, 3, 4, 3], [1, 1, 0, 1]]})
    print(all, sess.run(tf.argmax(all, 1)))

'''
0 6.926112
200 0.6005015
400 0.47295815
600 0.37342924
800 0.28018373
1000 0.23280522
1200 0.21065344
1400 0.19229904
1600 0.17682323
1800 0.16359556
2000 0.15216158
-------------
[[1.3890490e-03 9.9860185e-01 9.0613084e-06]] [1]
-------------
[[0.9311919  0.06290216 0.00590591]] [0]
-------------
[[1.2732815e-08 3.3411323e-04 9.9966586e-01]] [2]
-------------
[[1.3890490e-03 9.9860185e-01 9.0613084e-06]
 [9.3119192e-01 6.2902197e-02 5.9059085e-03]
 [1.2732815e-08 3.3411323e-04 9.9966586e-01]] [1 0 2]
'''
````

# Fancy Ver. Softmax Classification

위의 코드에서 cost를 정의하는데 있어 식이 복잡하니,

기본적으로 제공해주는 함수를 사용해 보자!

````python
# From
logits = tf.matul(X, W) + b
hypothesis = tf.nn.softmax(logits)
cost = tf.reduce_mean(-tf.reduce_sum(Y*tf.log(hypothesis), axis=1))
````

````python
# To
cost_i = tf.nn.softmax_cross_entropy_with_logits(logits=logits, labels = Y_one_hot)
cost = tf.reduce_mean(cost_i)
````

label은 one-hot 코딩으로 되어 있는 Y 를 넣어야 한다는 의미에서 Y_one_hot으로 정했다.

이렇게 해주면, cost_i 는 각 행에 대한 cost값들을 다 갖고 있다.

마지막으로 이 행에 관한 값들을 평균내주면 그게 cost이다.

# 동물 특징에 따른 종 분류하기

데이터가 주어졌을 때, Y가 클래스임에도 One-hot 코딩이 안되어 있다면,

이것부터 만져주는 것이 맞다.

````python
Y = tf.placeholder(tf.int32, [None, 1]) # shape = [?, 1]
````

````python
# 내 Y 데이터, class 갯수를 줄테니 만들어줘 
# 여기서 조심해야 하는것, 내가 one_hot을 실행하고난 뒤 결과 랭크는 한차원 큰 값을 돌려준다.
# 즉, 여기서 내가 Y는 rank = 2이다.
# one_hot을 돌리고 난 뒤 rank는 3을 리턴한다는 얘기
Y_one_hot = tf.one_hot(Y, nb_classes) # shape = [?, 1, 7] 

# Example
# Y = [[0], [2]] -> shape = (?(2), 1)
# Y_one_hot = [[[1 0 0], [0 0 1]]] -> shape = (?(2), 1, 3)
````

````python
# 그런데, 우리는 shape -> (?, 7) 이런 식으로 나오기를 바란다.
# 그럴때 사용하는 것이 reshape 함수이다.
# 입력 넣고, 내가 원하는 shape의 형태를 써주면 된다.
# 이 때, -1은 '알아서' 라는 뜻이다.
Y_one_hot = tf.reshape(Y_one_hot, [-1, nb_classes])

# Y_one_hot = [[1 0 0], [0 0 1]] -> shape = (?(2), 7)
````

## 실행 코드

````python
# Lab 6 Softmax Classifier
import tensorflow as tf
import numpy as np
tf.set_random_seed(777)  # for reproducibility

# Predicting animal type based on various features
xy = np.loadtxt('data-04-zoo.csv', delimiter=',', dtype=np.float32)
x_data = xy[:, 0:-1]
y_data = xy[:, [-1]]

print(x_data.shape, y_data.shape)

'''
(101, 16) (101, 1)
'''

nb_classes = 7  # 0 ~ 6

X = tf.placeholder(tf.float32, [None, 16])
Y = tf.placeholder(tf.int32, [None, 1])  # 0 ~ 6

Y_one_hot = tf.one_hot(Y, nb_classes)  # one hot
print("one_hot:", Y_one_hot)
Y_one_hot = tf.reshape(Y_one_hot, [-1, nb_classes])
print("reshape one_hot:", Y_one_hot)

'''
one_hot: Tensor("one_hot:0", shape=(?, 1, 7), dtype=float32)
reshape one_hot: Tensor("Reshape:0", shape=(?, 7), dtype=float32)
'''

W = tf.Variable(tf.random_normal([16, nb_classes]), name='weight')
b = tf.Variable(tf.random_normal([nb_classes]), name='bias')

# tf.nn.softmax computes softmax activations
# softmax = exp(logits) / reduce_sum(exp(logits), dim)
logits = tf.matmul(X, W) + b
hypothesis = tf.nn.softmax(logits)

# Cross entropy cost/loss
# tf.stop_gradient() 함수는 gradient 노드가 수행될 때, 이 값은 연산에 영향을 주지 않음을
# 알려주는 함수이다.
cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits_v2(logits=logits,
                                                                 labels=tf.stop_gradient([Y_one_hot])))
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.1).minimize(cost)

# 열벡터로 주어진 hypothesis의 max를 갖는 index를 반환한다.
prediction = tf.argmax(hypothesis, 1)
# one-hot coding으로 된 Y 값중 argmax를 반환하면, 해당 정답의 index를 반환할 것이다.
# 그리고 그 값과 내가 예상한 index가 같으면 1을 갖고 있는다.
correct_prediction = tf.equal(prediction, tf.argmax(Y_one_hot, 1))
# cast 함수는, 원래 같으면 correct_prediction은 노드이지만, 
# 이 함수를 쓰면 텐서를 반환해준다.
# 뒤의 파라미터는 던질때, 이 텐서의 자료형을 써준다.
# 참고로 모든 값은 텐서로 움직인다. 즉 벡터나 행렬이나 텐서이다.
# 따라서 cast한 뒤의 반환값도 행렬이다. 
# reduce_mean 함수는 이 행렬의 평균을 구해주는데, 파라미터에 따라 행, 열, 전체로 구할 수 있다.
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

# Launch graph
with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())

    for step in range(2001):
        _, cost_val, acc_val = sess.run([optimizer, cost, accuracy], feed_dict={X: x_data, Y: y_data})
                                        
        if step % 100 == 0:
            print("Step: {:5}\tCost: {:.3f}\tAcc: {:.2%}".format(step, cost_val, acc_val))

    # Let's see if we can predict
    pred = sess.run(prediction, feed_dict={X: x_data})
    # y_data: (N,1) = flatten => (N, ) matches pred.shape
		# [[1], [2]] -> [1, 2] 이런식으로!
    for p, y in zip(pred, y_data.flatten()):
        print("[{}] Prediction: {} True Y: {}".format(p == int(y), p, int(y)))

'''
Step:     0 Loss: 5.106 Acc: 37.62%
Step:   100 Loss: 0.800 Acc: 79.21%
Step:   200 Loss: 0.486 Acc: 88.12%
...
Step:  1800	Loss: 0.060	Acc: 100.00%
Step:  1900	Loss: 0.057	Acc: 100.00%
Step:  2000	Loss: 0.054	Acc: 100.00%
[True] Prediction: 0 True Y: 0
[True] Prediction: 0 True Y: 0
[True] Prediction: 3 True Y: 3
...
[True] Prediction: 0 True Y: 0
[True] Prediction: 6 True Y: 6
[True] Prediction: 1 True Y: 1
'''
````
