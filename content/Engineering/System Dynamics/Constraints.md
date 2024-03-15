---
title: Constraints
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

기구학적인 joint 들은 각자가 가지는 특징 때문에, 기구학적으로 제약을 갖는다. 이 제약은 결국 시스템의 자유도를 구속하게 된다.

# Ground

2차원 공간에서 기본적으로 가지는 자유도는 3이다. 이때, 특정 포인트를 내가 지면으로 잡는다면,

$$
R_x;=;c_1\\
R_y;=;c_2\\
\\theta;=;c_3
$$

이렇게 3개의 제약이 걸리게 된다.

# Revolute joint

특정 포인트에 Revolute joint가 달리게 될 경우, 회전만 가능하고, 두 body 사이에 연결된 revolute joint는 하나만을 가리켜야 한다.

Global coordinate 에서 표현한다고 했을 때, 따라서 body 1에서 가리키는 revolute joint의 벡터와 body 2에서 가리키는 revolute joint의 벡터는 같아야 한다.

$$
\\overset{\rightarrow}{r_p}^i;=;\overset{\rightarrow}{r_p}^j
\\\overset{\rightarrow}{R}^i;+;A^i \overset{\rightarrow}{\overset{-}{u_p}}^i
;=;\overset{\rightarrow}{R}^j;+;A^j \overset{\rightarrow}{\overset{-}{u_p}}^j
$$

따라서 2개의 제약이 걸리게 된다.

# Prismatic joint

Prismatic joint는 한방향의 병진운동만 가능하게 하는 joint이다. 따라서 2개의 제약식이 만들어질 것임을 예상할 수 있다.

두 body 사이에 prismatic joint가 연결되어 있다면, global coordinate에서 봤을 때 정의된 두 body coordinate 의 초기 상대각도는 **constant** 로 유지된다.

또한 prismatic 의 경우, 두 바디 사이의 각이 항상 수직이다. 따라서 움직이는 방향 벡터와 수직으로 연결된 body의 벡터를 내적하면 항상 0이다. 따라서 2개의 제약이 걸리게 된다.

# Moblility Criteria

역학 시스템을 분석하기 위한 가장 기본적인 단계는, 계의 자유도를 구하는 것이다.

$$
n_b;=;Number;of;bodies\\
\\;\\
n_c;=;Number;of;constraint;eqns\\
;\\
n_d;=;Degree;of;freedom
$$

2D 에서 구하는 방법은 다음과 같다.

$$
n_d;=;n_b\times 3;-;n_c
$$

3D 에서 구하는 방법은 다음과 같다.

$$
n_d;=;n_b\times 6;-;n_c
$$

# Driving Constraint

시스템의 자유도가 0 인 경우 우리는 추가적인 제약식을 만들 필요가 없다. 하지만 자유도가 0이 아닌 정수인 경우. 우리는 추가적인 제약식이 있어야 연립방정식을 풀 수 있다. 이 때 주어지는 제약식을 **Driving Constraint** 라 한다.

# 예제

![](Pasted%20image%2020231004120635.png)

## DOF 구하기

### BODY

1. Ground
1. bar1
1. bar2

3 x 3 = 9

### Constraint

1. Ground : 3
1. Revoulte joint 1 : 2
1. Revolute joint 2 : 2

3 + 2 + 2 = 7

### Result

**System DOF** = 9 - 7 = 2

결과적으로 우리는 theta2, theta3 에 관해 자유롭다. 따라서 이 시스템의 기구학적 특성을 살펴보기 위해서는 이 두 요소에 대한 **Driving Constraint** 가 필요하다.

$$
\\overset{\cdot}{\theta^2};=;\omega^2\\
;\\
\\overset{\cdot}{\theta^3};=;\omega^3
$$

위 두가지 제약으로 부터,

$$
\\theta^2;=;\theta_o^2;+;\omega^2t\\
;\\
\\theta^3;=;\theta_o^3;+;\omega^3t
$$

O로 표현된 각은 초기 각이다.

## 제약식 나타내기

각 constraint condition 으로 부터 도출되는 식은, system body에서 결정되는 coordinate 변수의 종류 안에서 결정된다.

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

총 9개의 식이 나오고, 이 각각을 C_1, C_2.. 스칼라 함수라고 한다면, 총 9개의 스칼라 함수를 가지는 벡터함수 C는,

$$
\\overset{\rightarrow}{C}(\overset{\rightarrow}{q};,t);=;

\\begin{bmatrix}
\\begin{bmatrix}
C_1(\overset{\rightarrow}{q};,t)\\
C_2(\overset{\rightarrow}{q};,t)\\
C_3(\overset{\rightarrow}{q};,t)
\\end{bmatrix};;;Ground;;;\\
\\begin{bmatrix}
C_4(\overset{\rightarrow}{q};,t)\\
C_5(\overset{\rightarrow}{q};,t)\\
\\end{bmatrix};Revoulte;1\\
\\begin{bmatrix}
C_6(\overset{\rightarrow}{q};,t)\\
C_7(\overset{\rightarrow}{q};,t)\\
\\end{bmatrix};Revoulte;1\\
\\begin{bmatrix}
C_8(\overset{\rightarrow}{q};,t)\\
C_9(\overset{\rightarrow}{q};,t)\\
\\end{bmatrix}Driving;Cd\\
\\end{bmatrix}
;=;
\\overset{\rightarrow}{0}
$$

위와 같다. 그런데 각각의 스칼라 함수 안에 들어가는 함수는, 삼각함수로 표현되기 일쑤기 때문에 Non-linear 하다. 따라서 우리는 저 행렬식을 푸는데 있어 다른 방법을 생각해야 한다.

## To solve nonlinear function

1. Bisection method
1. Golden Section method
1. ***Newton-Raphson method***
1. secant method

우리는 여기서 Newton-Rahpson Method를 사용해 보겠다.
