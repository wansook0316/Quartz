---
title: Newton Euler Algorithm
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# Newton Euler Equations

![](Pasted%20image%2020231004120859.png)

Reference point(O^i) 가 강체 i 의 질량중심에 위치해 있다고 생각하자.

$$
m^ia_x^i;=;F_x^i\\
m^ia_y^i;=;F_y^i\\
J\theta^{\cdot \cdot};=;M^i
$$

M은 net Moment, J는 강체의 관성모멘트, F는 net force 이다. 따라서 2차원 공간에서 작용할 수 있는 3가지 자유도에 대한 힘과 모멘트는, 질량 중심에 작용하는 3가지 Term 으로 정리된다.

# D'Alembert's Principle

$$
\\sum_i(\overset{\rightarrow}{F_i}-m_i\overset{\rightarrow}{a_i})\cdot \delta \overset{\rightarrow}{r_i};=;0
$$

여기서 delta r 벡터는 **Virtual displacement** 라 한다.

## Virtual Displacement

* 이 항은 시스템의 무한히 작은 변화를 가정했을 때 변위를 의미한다.
* 즉, 시간이 constant 일 때, 계의 변위를 측정한 것이다.
* 우리는 이것을 가상 변위라 부르는데, 실제로 시간이 상수일 때, 변위는 없기 때문이다.

식을 정리하면, 다음과 같이 정리된다.

## D'Alembert's Equation

$$
{d \over dt}{\partial\large \mathcal{L} \over\partial \overset{\cdot}{q_j}};-;
{\partial\large \mathcal{L} \over\partial {q_j}};=;
Q_j^{nc}+Q_j^e
$$

$$
\\mathcal{L}(Lagrangian);=;T-V(kinetic;E;-;potential;E)\\
;\\
nc;=;non;conservative;forse\\
;\\
e;=;eternal;force\\
;\\
$$

여기서 q_j 는 다음과 같은 것들이 될 수 있다.

$$
\\overset{\rightarrow}{q};=;
\\begin{bmatrix}
\[R_x^1& R_y^1 & \theta^1\] & \[R_x^2& R_y^2 & \theta^2\] & \[R_x^3 & R_y^3 & \theta^3\]
\\end{bmatrix}^T
\\
;\\
;=;
\\begin{bmatrix}
q_1& q_2& q_3& q_4& q_5& q_6& q_7& q_8& q_9
\\end{bmatrix}^T
$$
