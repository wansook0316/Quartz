---
title: Vector Differentiation
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Scalar Function by Scalar

$$
f ;=;function ;of(q_1,q_2,\dots,q_n, t)\\
;\\
q_i;=;g_i(t),;;i=1,2,3 \dots, n
$$

이때 t에 대해 미분하면,

$$
{df\over dt};=;{\partial f\over \partial q_1}{dq_1\over dt}+{\partial f\over \partial q_2}{dq_2\over dt}+\dots+{\partial f\over \partial q_n}{dq_n\over dt}+{\partial f \over \partial t}
$$

이를 벡터 형식으로 나타내면,

$$
{df\over dt};=;\begin{bmatrix}
{\partial f\over \partial q_1} & {\partial f\over \partial q_2} & \dots & {\partial f\over \partial q_n}\\
\\end{bmatrix}
\\begin{bmatrix}
{dq_1\over dt}\\ {dq_2\over dt}\\ \vdots \\{dq_n\over dt}\\
\\end{bmatrix}
+{\partial f \over \partial t}\\
$$

여기서 벡터로 표현된 녀석을 다음과 같이 표현하자.

$$
\\begin{bmatrix}
{\partial f\over \partial q_1} & {\partial f\over \partial q_2} & \dots & {\partial f\over \partial q_n}\\
\\end{bmatrix}={\partial f \over \partial \overset{\rightarrow}{q}}=f\_{\overset{\rightarrow}{q}}
$$

$$
\\begin{bmatrix}
{dq_1\over dt}\\ {dq_2\over dt}\\ \vdots \\{dq_n\over dt}\\
\\end{bmatrix}={d \overset{\rightarrow}{q} \over dt}
$$

그렇다면 위의 식은 다음과 같이 정리된다.

$$
{df\over dt};=;f\_{\overset{\rightarrow}{q}}{d \overset{\rightarrow}{q} \over dt}+{df \over dt}
$$

# Vector Function by Scalar

벡터함수 f는 각각의 요소에 변수 (q1~qn, t) 를 갖는 스칼라 함수를 m개 갖는다고 하자.

$$
f_1;=;f_1(q_1,q_2,\dots,q_n,t)\\
f_2;=;f_1(q_1,q_2,\dots,q_n,t)\\
f_3;=;f_1(q_1,q_2,\dots,q_n,t)\\
\\vdots\\
f_m;=;f_n(q_1,q_2,\dots,q_n,t)\\
;\\
;\\
\\overset{\rightarrow}{f};=;\[f_1;f_2;f_3;\dots;f_m\]^T
$$

그렇다면 이 함수를 스칼라 변수 t로 미분하면,

각각의 요소는,

$$
{df_j\over dt};=;{\partial f_j \over \partial \overset{\rightarrow}{q}}{d \overset{\rightarrow}{q} \over dt}+{df \over dt}\\
;\\
;\\
j;=;1,2,\dots, m
$$

$$
{\partial f_j \over \partial \overset{\rightarrow}{q}}=
\\begin{bmatrix}
{\partial f_j\over \partial q_1} & {\partial f_j\over \partial q_2} & \dots & {\partial f_j\over \partial q_n}\\
\\end{bmatrix}
$$

그렇다면, 벡터 함수를 t로 미분한 최종 결과는,

$$
{d\overset{\rightarrow}{f} \over dt};=;\begin{bmatrix}
{df_1\over dt}\\ {df_2\over dt}\\ \vdots \\{df_n\over dt}\\
\\end{bmatrix};=
\\begin{bmatrix}
{\partial f_1\over \partial q_1} & \dots & {\partial f_1\over \partial q_n}
\\\vdots\ & &  \vdots\\
{\partial f_m\over \partial q_1}  & \dots & {\partial f_m\over \partial q_n}\\
\\end{bmatrix}
\\begin{bmatrix}
{dq_1\over dt}\\ \vdots \\{dq_n\over dt}\\
\\end{bmatrix}
+\begin{bmatrix}
{df_1 \over dt}\\  \vdots \\{df_m \over dt}\\
\\end{bmatrix}
\\
$$

$$
{d\overset{\rightarrow}{f} \over dt};=;{\partial\overset{\rightarrow}{f} \over \partial\overset{\rightarrow}{q}}{d\overset{\rightarrow}{q} \over dt}
+{\partial\overset{\rightarrow}{f} \over \partial t}
$$

여기서 행렬이 만들어진다는 것을 잊으면 안된다! 각각의 크기만 적어보면,

$$
{d\overset{\rightarrow}{f} \over dt};=;{\partial\overset{\rightarrow}{f} \over \partial\overset{\rightarrow}{q}}{d\overset{\rightarrow}{q} \over dt}
+{\partial\overset{\rightarrow}{f} \over \partial t}\\
(m\times 1)=(m\times n)(n\times 1)+(m\times1)
$$

## Scalar Function by Vector

스칼라 함수를 스칼라로 미분하는 가장 위의 예에서, 함수 f를 벡터 q로 미분하면, 다음과 같다.

$$
{d f \over d\overset{\rightarrow}{q}};=;\begin{bmatrix}
{d f\over d q_1} & {d f\over d q_2} & \dots & {d f\over d q_n}\\
\\end{bmatrix}
$$

## Vector Function by Scalar

벡터 함수를 스칼라로 미분하는 두번째 예에서, 벡터 함수 f를 q1으로 미분한다면,

$$
{d\overset{\rightarrow}{f} \over dq_1};=;\begin{bmatrix}
{d f_1\over d q_1} & {d f_1\over d q_1} & \dots & {d f_1\over d q_1}\\
\\end{bmatrix}
$$

### 정리

1. 스칼라 함수를 스칼라로 미분하면 스칼라함수다.
1. 스칼라 함수를 벡터 함수로 미분하면 1xn 벡터가 나온다.
1. 벡터 함수를 스칼라로 미분하면 1xm 벡터가 나온다.
1. 벡터 함수를 벡터로 미분하면 nxm 행렬이 나온다.

# Skew-Symmetric Matrix Representation

Skew-Symmetric Matrix는 벡터의 외적을 사용해서 다르게 표현이 가능한데, 간단한 예를 들어 생각해보자.

$$
\\overset{\rightarrow}{a} ;=;\[a_1;a_2;a_3\]^T\\
\\overset{\rightarrow}{b} ;=;\[b_1;b_2;b_3\]^T\\
$$

이 두 벡터를 내적하면,

$$
\\overset{\rightarrow}{a}\times\overset{\rightarrow}{b};=;
\\begin{bmatrix}
a_2b_3-a_3b_2\\
-(a_1b_3-a_3b_1)\\
a_1b_2-a_2b_1
\\end{bmatrix}
=\begin{bmatrix}
0 & -a_3 & a_2\\
a_3 & 0 & -a_1\\
-a_2 & a_1 & 0
\\end{bmatrix}
\\begin{bmatrix}
b_1\\
b_2\\
b_3
\\end{bmatrix};=;
{ { \underset{=} {\overset{\sim}{a} } } } \cdot \overset{\rightarrow}{b}
$$

외적 식을 b벡터를 활용해서 나타내면 다음과 같이 나타낼 수 있다. 이때 중간에 skew-symmetric matrix 가 나오고, a 벡터가 왼쪽에 놓인 외적을 수행했을 때 발생하는 행렬을 위와 같이 표현했다. 마찬가지로, b벡터에 대해 하면,

$$
\\overset{\rightarrow}{a}\times\overset{\rightarrow}{b};=;\begin{bmatrix}
0 & -b_3 & b_2\\
b_3 & 0 & -b_1\\
-b_2 & b_1 & 0
\\end{bmatrix}
\\begin{bmatrix}
a_1\\
a_2\\
a_3
\\end{bmatrix};=;
{ { \underset{=} {\overset{\sim}{b} } } } \cdot \overset{\rightarrow}{a}
$$

이와 같다.

## Property

a 의 단위벡터와 a 벡터를 외적하면, 0이다.

$$
\\hat{\overset{\rightarrow}{a}};\times ;\overset{\rightarrow}{a};=;
-\overset{\rightarrow}{a};\times ;\hat{\overset{\rightarrow}{a}};=;
\\overset{\rightarrow}{0}
$$

이 표현을 Skew-symmetric Matrix를 써서 표현하면,

$$
-\overset{\rightarrow}{a};\times ;\hat{\overset{\rightarrow}{a}};=;
-{ { \underset{=} {\overset{\rightarrow}{a} } } } \cdot \hat{\overset{\rightarrow}{a}};=;
{\overset{\rightarrow}{0}}
$$

Skew-Symmetric Matrix 의 특징을 사용하면,

$$
-{ { \underset{=} {\overset{\rightarrow}{a} } } };=;{  {\underset{= }{\overset{\rightarrow}{a} } } }^T
$$

$$
-{ { \underset{=} {\overset{\rightarrow}{a} } } } \cdot \hat{\overset{\rightarrow}{a}};=;{ { \underset{=} {\overset{\rightarrow}{a} } } }^T\cdot \hat{\overset{\rightarrow}{a}};=;{\overset{\rightarrow}{0}}
$$

## 역학에서 사용예

시스템 내에서 역학적 Joint 에서 위치 벡터와의 관계는 다음과 같이 빈번하게 묘사된다.

$$
\\overset{\rightarrow}{a}\times\overset{\rightarrow}{x};=;\overset{\rightarrow}{0}
$$

즉, a 벡터와 x 벡터가 수직임을 나타낸다. 수직인 벡터는 무수하게 많이 나온다는 점을 기억한 상태로 다음을 보자. Skew-symmetric Matrix를 사용해서 나타내면,

$$
{ { \underset{=} {\overset{\sim}{a} } } } \cdot \overset{\rightarrow}{x};=;\overset{\rightarrow}{0}\\
;\\
;\\
{ { \underset{=} {\overset{\sim}{a} } } };=;
\\begin{bmatrix}
0 & -a_3 & a_2\\
a_3 & 0 & -a_1\\
-a_2 & a_1 & 0
\\end{bmatrix}
$$

a 행렬에 대해 **Determinant를 구해보면, 0이다.** 즉, a 행렬은 특이 행렬이다. 즉, Rank가 matrix size보다 작다. 즉, x 벡터는 하나로 결정되지 못한다.
