---
title: Tensor Manipulation
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# 1D Array & Slicing

````python
# https://www.tensorflow.org/api_guides/python/array_ops
import tensorflow as tf
import numpy as np
import pprint
tf.set_random_seed(777)  # for reproducibility

pp = pprint.PrettyPrinter(indent=4)
sess = tf.InteractiveSession()
````

````python
t = np.array([0., 1., 2., 3., 4., 5., 6.])
pp.pprint(t)
print(t.ndim) # rank = 1
print(t.shape) # shape = (7,)
print(t[0], t[1], t[-1]) # -1은 맨 끝을 의미
print(t[2:5], t[4:-1])
print(t[:2], t[3:])
````

````
array([0., 1., 2., 3., 4., 5., 6.])
1
(7,)
0.0 1.0 6.0
[2. 3. 4.] [4. 5.]
[0. 1.] [3. 4. 5. 6.]
````

# Shape

shape는 이 텐서의 모양이 어떤지를 의미한다.

````python
t = np.array([[1., 2., 3.], [4., 5., 6.], [7., 8., 9.], [10., 11., 12.]])
pp.pprint(t)
print(t.shape) # shape (4, 3)
````

shape를 판단할 때는 가장 안쪽의 값부터 세서 오른쪽 끝부터 채운다.

# Rank

````python
t = np.array([[1., 2., 3.], [4., 5., 6.], [7., 8., 9.], [10., 11., 12.]])
pp.pprint(t)
print(t.ndim) # rank 2
````

괄호의 개수라고 생각하자!

# Axis

````python
[
    [
        [
            [1,2,3,4], 
            [5,6,7,8],
            [9,10,11,12]
        ],
        [
            [13,14,15,16],
            [17,18,19,20], 
            [21,22,23,24]
        ]
    ]
]
````

rank의 개수만큼 축의 개수가 생긴다. 이 경우는 4이다.

제일 안쪽에 있는 괄호부터 **axis 3(-1이라고도 함)**

제일 바깥쪽에 있는 괄호는 **axis 0** 이다.

# Reduce mean

안의 요소는 int형으로 할 경우 float로 출력안된다!

따라서 1. 2. 이런식으로 써주자.

````python
tf.reduce_mean([1, 2], axis=0).eval() # 1
````

````python
x = [[1., 2.],
     [3., 4.]]

tf.reduce_mean(x).eval() # 2.5
````

````python
tf.reduce_mean(x, axis=0).eval() # [2. 3.]
tf.reduce_mean(x, axis=1).eval() # [1.5 3.5]
tf.reduce_mean(x, axis=-1).eval() # [1.5 3.5]
````

reduce sum, Argmax도 같은 원리로 동작한다!

# Reshape

````python
t = np.array([[[0, 1, 2], 
               [3, 4, 5]],
              
              [[6, 7, 8], 
               [9, 10, 11]]])
t.shape
````

````python
(2, 2, 3)
````

````python
# -1은 너마음대로 만들어! 라는 얘기!
tf.reshape(t, shape=[-1, 3]).eval()
````

````python
array([[ 0,  1,  2],
       [ 3,  4,  5],
       [ 6,  7,  8],
       [ 9, 10, 11]])
````

# Squeeze

````python
tf.squeeze([[0], [1], [2]]).eval()
# array([0, 1, 2], dtype=int32)
````

# Expand

````python
tf.expand_dims([0, 1, 2], 1).eval()
````

````
array([[0],
       [1],
       [2]], dtype=int32)
````

# One-hot

````python
tf.one_hot([[0], [1], [2], [0]], depth=3).eval()
````

````python
array([[[ 1.,  0.,  0.]],

       [[ 0.,  1.,  0.]],

       [[ 0.,  0.,  1.]],

       [[ 1.,  0.,  0.]]], dtype=float32)
````

자동적으로 rank가 하나가 추가되는 결과를 가져온다.

0 대신에 0을 나타내주는 one-hot array로 대체되었기 때문이다.

우리는 \[0\] 자체를 바꿔주고 싶은 것이기 때문에 reshape를 해준다.

````python
t = tf.one_hot([[0], [1], [2], [0]], depth=3)
tf.reshape(t, shape=[-1, 3]).eval()
````

````python
array([[ 1.,  0.,  0.],
       [ 0.,  1.,  0.],
       [ 0.,  0.,  1.],
       [ 1.,  0.,  0.]], dtype=float32)
````

# Casting

````python
tf.cast([1.8, 2.2, 3.3, 4.9], tf.int32).eval()
````

````python
array([1, 2, 3, 4], dtype=int32)
````

자료형을 변환해서 던져주는 역할!

만약 요소의 자료형과 같은 것을 넘겨주면 그대로(as-is)를 넘겨주는 것과 동일함

````python
tf.cast([True, False, 1 == 1, 0 == 1], tf.int32).eval()
````

````python
array([1, 0, 1, 0], dtype=int32)
````

위의 값들을 다 숫자로 바꿔버린 후 합한다.

accuracy 측정할 때 이 방법을 사용하면 아주 유용하다!

# Stack

````python
x = [1, 4]
y = [2, 5]
z = [3, 6]

# Pack along first dim.
tf.stack([x, y, z]).eval()
````

````python
array([[1, 4],
       [2, 5],
       [3, 6]], dtype=int32)
````

기본 설정은 axis = 0으로 되어 있다.

가장 바깥 괄호에 해당하도록 쌓아진다.

````python
tf.stack([x, y, z], axis=1).eval()
````

````python
array([[1, 2, 3],
       [4, 5, 6]], dtype=int32)
````

그 다음 괄호에서 같은 index에 있는 녀석끼리 묶인다.

0은 열 1은 행이라 생각하면 편하다.

# Ones and Zeros like

내가 가진 텐서의 shape와 동일하되, 1 또는 0으로 찬 행렬이 갖고 싶다! 

````python
x = [[0, 1, 2],
     [2, 1, 0]]

tf.ones_like(x).eval()

# array([[1, 1, 1],
#      [1, 1, 1]], dtype=int32)
````

````python
tf.zeros_like(x).eval()
# array([[0, 0, 0],
#       [0, 0, 0]], dtype=int32)
````

# Zip

````python
for x, y in zip([1, 2, 3], [4, 5, 6]):
    print(x, y)
````

````python
1 4
2 5
3 6
````

````python
for x, y, z in zip([1, 2, 3], [4, 5, 6], [7, 8, 9]):
    print(x, y, z)
````

````python
1 4 7
2 5 8
3 6 9
````
