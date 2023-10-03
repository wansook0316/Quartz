---
title: Rank
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- rank
- inverse-matrix
created: 2023-10-03
---

# Rank

행렬은 하나의 공간을 매핑한다고 했다. 방금은 3 x 3 의 행렬에 대해 봤기 때문에, 열벡터 공간과 행벡터 공간이 동일하게 3차원 공간을 매핑하고 있었다.

하지만 행렬이 꼭 정사각행렬이라는 법은 없다.

따라서 우리는 행벡터와 열벡터에 대한 선형 독립성을 판단할 지표가 필요한데, 이 때 등장하는 개념이 **Rank** 이다.

$$
{\underset{=}{A}};=; \begin{bmatrix} a\_{11} & a\_{12} & \cdots & a\_{1n}\\ a\_{21} & a\_{22} & \cdots &a\_{2n}\\ \vdots & & & \vdots\\ a\_{m1} & a\_{m2} & \cdots & a\_{mn} \end{bmatrix};=; \begin{bmatrix} \overset{\rightarrow}{a_1} & \overset{\rightarrow}{a_2} & \cdots & \overset{\rightarrow}{a_n}\\ \end{bmatrix};=; \begin{bmatrix} \overset{\rightarrow}{a_1}\\\overset{\rightarrow}{a_2}\\ \vdots \\\overset{\rightarrow}{a_m} \end{bmatrix}
$$

A 행렬이 다음과 같이 있을 때, 첫번째가 열벡터로 묶은 행렬, 두번째가 행벡터로 묶은 행렬이다.

A 행렬의 모든 벡터들이 선형 독립이라 가정 할때, 열벡터들의 개수가 **Column Rank(Nc)** , 행벡터들의 개수가 **Row Rank(Nr)** 이다.

만약 정사각 행렬이라면,

$$
N_c;=;N_r;=;N
$$

# Rank와 행렬식과의 관계

정사각 행렬에서 Full Rank 인 경우, 동치인 말이 여러개 존재한다.

* Full Rank
* det(A) != 0
* 역행렬이 존재한다.
* non-singular Matrix
* non-trivuial solution
