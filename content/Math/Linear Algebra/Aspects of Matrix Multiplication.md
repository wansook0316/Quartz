---
title: Aspects of Matrix Multiplication
thumbnail: ''
draft: false
tags: null
created: 2023-10-03
---

# 원소의 측면

R이 결과 행렬이라고 한다면,

$$
\\begin{bmatrix} 1 & 2\\ 4 & 3 \end{bmatrix} \begin{bmatrix} 1 & 1\\ 0 & 3 \end{bmatrix};=; \begin{bmatrix} 1\times1+2\times0 & 1\times1+2\times3\\ 4\times1+3\times0 & 4\times1+3\times3 \end{bmatrix};=; \begin{bmatrix} 1 & 7\\ 4 & 13 \end{bmatrix}
$$

$$
R;=;\[r\_{ij}\];=;\sum\_{k=1}^2a\_{ik}b\_{kj}
$$

# 행의 측면

행의 측면에서 행렬의 곱을 바라본다면, 내가 변환된 행렬이 오른쪽에 있다고 가정했을 때 판단하면 유용하다.

A가 내가 관심을 두는 행렬이고,E가 변환을 하는 행렬이라 생각하자.

$$
R;=;EA;=; \begin{bmatrix} 1 & 2\\ \end{bmatrix} \begin{bmatrix} 1 & 1\\ 0 & 3 \end{bmatrix};=; \begin{bmatrix} 1 & 2\\ \end{bmatrix} \begin{bmatrix} \overset{\rightarrow}{x_1}\\ \overset{\rightarrow}{x_2} \end{bmatrix};=; 1\times\overset{\rightarrow}{x_1}+2\times\overset{\rightarrow}{x_2} ;=;\[1;;;7\]
$$

따라서 내가 원하는 행렬이 오른쪽에 있다면 그 행렬을 **행벡터의 모임** 으로 생각하고

왼쪽의 변환 행렬은 행방향 순서대로 상수배를 해주고 더한다는 개념으로 이해한다. **결과는 행벡터이다.**

따라서,
$$
\\begin{bmatrix} 1 & 2\\ 4 & 3 \end{bmatrix} \begin{bmatrix} 1 & 1\\ 0 & 3 \end{bmatrix};=; \begin{bmatrix} 1 & 2\\ 4 & 3 \end{bmatrix} \begin{bmatrix} \overset{\rightarrow}{x_1}\\ \overset{\rightarrow}{x_2} \end{bmatrix};=; \begin{bmatrix} 1\times\overset{\rightarrow}{x_1}+2\times\overset{\rightarrow}{x_2}\\ 4\times\overset{\rightarrow}{x_1}+3\times\overset{\rightarrow}{x_2} \end{bmatrix};=; \begin{bmatrix} 1 & 7\\ 4 & 13 \end{bmatrix}
$$

# 열의 측면

이번에는 내가 관심이 있는 행렬이 왼쪽에 있다고 생각하자. 그렇다면,

$$
R;=;AE;=; \begin{bmatrix} 1 & 2\\ 4 & 3 \end{bmatrix} \begin{bmatrix} 1\\ 3 \end{bmatrix};=; \begin{bmatrix} \overset{\rightarrow}{x_1} & \overset{\rightarrow}{x_2}\\ \end{bmatrix} \begin{bmatrix} 1\\ 3 \end{bmatrix};=; \overset{\rightarrow}{x_1}\times1+\overset{\rightarrow}{x_2}\times3 ;=; \begin{bmatrix} 7\\ 13 \end{bmatrix}
$$

따라서,

$$
\\begin{bmatrix} 1 & 2\\ 4 & 3 \end{bmatrix} \begin{bmatrix} 1 & 1\\ 0 & 3 \end{bmatrix};=; \begin{bmatrix} \overset{\rightarrow}{x_1} & \overset{\rightarrow}{x_2}\\ \end{bmatrix} \begin{bmatrix} 1 & 1\\ 0 & 3 \end{bmatrix};=; \begin{bmatrix} \overset{\rightarrow}{x_1}\times1+\overset{\rightarrow}{x_2}\times0 & \overset{\rightarrow}{x_1}\times1+\overset{\rightarrow}{x_2}\times3 \end{bmatrix};=; \begin{bmatrix} 1 & 7\\ 4 & 13 \end{bmatrix}
$$

# 정리

1. 기본 요소로 보았을 때 계산은,
1. 식으로 나타냈을 때 굉장히 심플하다!
1. 내가 원하는 행렬이 **오른쪽에 있을 때는 행으로 본다!**
1. 내가 원하는 행렬이 **왼쪽에 있을 때는 열로 본다!**
