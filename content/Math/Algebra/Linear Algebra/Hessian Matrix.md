---
title: Hessian Matrix
thumbnail: ''
draft: false
tags: null
created: 2024-11-11
---


 > 
 > $f: \mathbb{R}^n \rightarrow \mathbb{R}$인 함수 $f$에 대한 이차미분을 모아놓은 행렬

# 정의

* $f(x_1, x_2, \dots, x_n)$ (스칼라를 출력하는 함수에 대하여)

$$
\\mathbf{H}{(f)(\mathbf x)\_{i,j}= \frac{\partial^2}{\partial x_i \partial x_j}}{f(\mathbf x)}

$$

$$
\\mathbf{H} = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} & \dots & \frac{\partial^2 f}{\partial x_1 \partial x_n} \\ \frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} & \dots & \frac{\partial^2 f}{\partial x_2 \partial x_n} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial^2 f}{\partial x_n \partial x_1} & \frac{\partial^2 f}{\partial x_n \partial x_2} & \dots & \frac{\partial^2 f}{\partial x_n^2} \end{bmatrix}
$$

## 다른 표현

* 헤세 행렬은 기울기의 야코비 행렬이다.

* **기울기(Gradient)**: 각 변수에 대한 일차 편미분을 벡터로 모은 것
  
  * $\nabla f = \left( \frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \dots, \frac{\partial f}{\partial x_n} \right)$
* **기울기의 야코비 행렬**
  
  * 기울기 자체가 벡터이므로, 기울기를 각 변수에 대해 다시 편미분하면 결과적으로 **야코비 행렬을 얻을 수 있다**. 
  * 즉, 기울기의 각 성분을 한 번 더 미분하면 이차 미분 정보가 모인 헤세 행렬이 된다.
* **헤세 행렬의 정의**
  
  * 스칼라 함수  $f(x_1, x_2, \dots, x_n)$ 의 헤세 행렬은 각 변수에 대해 이차 편미분을 수행한 결과를 정리한 행렬이다. 
  * 기울기의 각 성분에 대해 한 번 더 편미분한 것이므로, 실제로는 **기울기 벡터에 대한 야코비 행렬**과 같다.

# 특징

* 헤세 행렬은 **대칭행렬**이다.
  * 이차 편미분이 연속인 모든 점에서는 미분 연산자가 "가환적"이다.
  * $\frac{\partial^2}{\partial x_i \partial x_j} f = \frac{\partial^2}{\partial x_j \partial x_i} f$
* 해세 행렬의 값이 실수값, 대칭행렬인 경우 해세 행렬을 실수 고윳값들의 집합과 고유벡터들로 이루어진 직교 기저로 분해할 수 있다.
  * $H = Q \Lambda Q^T$
  * 

# 활용

* 헤세 행렬은 다변수 함수의 **곡률**(즉, 변화율의 변화)을 나타내기 때문에 최적화 문제에서 중요함
* 함수의 최소값이나 최대값을 찾을 때 헤세 행렬의 양의 정부호 여부(즉, 모든 고유값이 양수인지)를 통해 함수가 볼록(convex)한지 비볼록(non-convex)한지 확인할 수 있음
* 양의 곡률인 경우 기울기로 예측한 것보다 느리게 비용함수가 감소한다.
* 음의 곡률이라면 기울기로 예측한 것보다 빠르게 비용함수가 감소한다.

![hessian-matrix-01.jpeg](hessian-matrix-01.jpeg)
