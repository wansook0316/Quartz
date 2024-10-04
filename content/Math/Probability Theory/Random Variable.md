---
title: Random Variable
thumbnail: ''
draft: false
tags:
- statistics
- random-variable
created: 2024-09-11
---

# 확률 변수

* 여러 값을 무작위하게 가지는 변수
* 확률 변수는 반드시 확률 분포와 결합되어야 한다.
* 확률 변수는 이산적일 수도, 연속적일 수도 있다.
* 이산적일 경우 반드시 정수인 것은 아니다.
* 연속적인 경우 실수값들과 연관된다.

# 스칼라 확률 변수 (Scalar Random Variable)

* 단일 실수 값을 가지는 경우
* 일반적으로 대문자로 표기
* 보통  X ,  Y  등의 문자로 나타내며, 이 확률 변수가 가질 수 있는 구체적인 값은 소문자로 표기
* 확률 변수:  X ,  Y ,  Z 
* 구체적인 값 (실현 값):  x ,  y ,  z 
* 확률 질량 함수(PMF) (이산 확률 변수):  $P(X = x)$
* 확률 밀도 함수(PDF) (연속 확률 변수):  $f_X(x)$

# 벡터 확률 변수 (Vector Random Variable)

* 여러 차원의 값을 가질 수 있음
* 여러 확률 변수를 한꺼번에 표현하는 데 사용 
* 벡터 확률 변수는 굵은 대문자나, 화살표 혹은 밑줄 등의 표기법을 사용
* 벡터의 각 성분은 개별적인 스칼라 확률 변수입니다.
* 벡터 확률 변수 표기법: $\mathbf{X}$ ,  $\vec{X}$ 
* 구체적인 벡터 값(실현 값):  $\mathbf{x}$ ,  $\vec{x}$ 
* 확률 질량 함수(PMF) 또는 확률 밀도 함수(PDF)\*\*:
  * $f\_{\mathbf{X}}(\mathbf{x}) = P(\mathbf{X} = \mathbf{x}) \quad \text{또는} \quad f\_{\vec{X}}(\vec{x})$
* 예시: 2차원 벡터 확률 변수  $\mathbf{X} = (X_1, X_2)$ 에서 각 성분이 서로 다른 확률 변수를 나타낼 때:
  * $\mathbf{X} = \begin{pmatrix} X_1 \\ X_2 \end{pmatrix}, \quad \mathbf{x} = \begin{pmatrix} x_1 \\ x_2 \end{pmatrix}$
