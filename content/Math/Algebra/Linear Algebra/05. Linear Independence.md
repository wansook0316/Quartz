---
title: Linear Independence
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- linear-independence
- determinant
created: 2023-10-03
---

# Linear Independence

하나의 행렬은 공간을 나타낸다고 볼 수 있다.

$$
\\begin{bmatrix} 1 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1 \end{bmatrix};=;\begin{bmatrix} \overset{\rightarrow}{i} & \overset{\rightarrow}{j} & \overset{\rightarrow}{k}\\ \end{bmatrix}
$$

다음과 같은 행렬이 있다면, column 벡터를 보면, i, j, k를 나타냄을 알 수 있다.

그런데 만약에 각각의 벡터가 서로의 상수배를 한 관계를 가지고 있다면, 이 공간은 행렬 사이즈에 해당하는 공간을 매핑하지 못한다.

이 경우 우리는 행렬이 **선형 종속** 이라 말한다.

반대로 공간을 매핑할 수 있다면 **선형 독립** 이라 말한다. 이것을 수식으로 판단해보면,

$$
\\begin{bmatrix} \overset{\rightarrow}{a_1} & \overset{\rightarrow}{a_2} & \cdots & \overset{\rightarrow}{a_n}\\ \end{bmatrix} \cdot \begin{bmatrix} e_1\\e_2\\ \vdots \\ e_n \end{bmatrix} ;=; \overset{\rightarrow}{0}
$$

$$
{\underset{=}{A}}\overset{\rightarrow}{e};=;\overset{\rightarrow}{0}
$$

위 식을 만족하는 e 벡터가 0 벡터인 경우 a .. 벡터들은 **선형 독립** 이라 한다. 선형 독립이 되기 위해서는 위의 행렬식에서, **Determinant 가 존재해야만 한다.**

즉, **비특이행렬** 이어야 하고, 위 식의 해인 e 벡터는 0 벡터로 **유일** 해야 한다.

$$
{\underset{=}{A}}\overset{\rightarrow}{e};=;\overset{\rightarrow}{0}\\ ;\\ {\underset{=}{A}}^{-1}{\underset{=}{A}}\overset{\rightarrow}{e};=;{\underset{=}{A}}^{-1}\overset{\rightarrow}{0}\\ ;\\ {I};\overset{\rightarrow}{e};=;\overset{\rightarrow}{0}\\ ;\\ \overset{\rightarrow}{e};=;\overset{\rightarrow}{0}\\
$$
