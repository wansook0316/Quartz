---
title: LU Decomposition
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- LU-decomposition
- decomposition
created: 2023-10-03
---

# LU Decomposition

LU 분해는 근본적으로 가우스 소거법의 방법을 차용한다. 가우스 소거법은 행의 조작을 통해, **Upper Triangle Matrix** 를 만드는 것이 핵심이다.

이 과정에서 우리는 행의 조작을 하는데, 윗삼각행렬을 만들기 위해 상수배와 더하기 빼기를 하는데,

이 과정을 행렬을 곱하는 것으로 대치하는 것이 전부이다. 먼저 가우스 소거법을 대치하는 행렬을 어떻게 만들지 부터 생각해보자.

## E 행렬

$$
A;=;\begin{bmatrix} 2 & 1 & 1\\ -1 & 2 & -1\\ 4 & -3 & 1 \end{bmatrix}
$$

$$
\\begin{bmatrix} 2 & 1 & 1\\ -1 & 2 & -1\\ 4 & -3 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} ;=; \begin{bmatrix} 6 \\ 0 \\ 2 \end{bmatrix}
$$

1행 \* (1/2) + 2행의 결과를 2행에 넣어야 한다. 이 때, A 행렬을 다음과 같이 바라보자.

$$
A;=;\begin{bmatrix} 2 & 1 & 1\\ -1 & 2 & -1\\ 4 & -3 & 1 \end{bmatrix} ;=; \begin{bmatrix} \overset{\rightarrow}{a_1} \\ \overset{\rightarrow}{a_2} \\ \overset{\rightarrow}{a_3} \end{bmatrix}
$$

각각의 벡터는 행을 의미한다. 우리는 1, 3행은 그대로,

2행을 위의 연산을 수행한 뒤 넣어줘야 하므로,

$$
\\begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \overset{\rightarrow}{a_1} \\ \overset{\rightarrow}{a_2} \\ \overset{\rightarrow}{a_3} \end{bmatrix}
$$

다음과 같다. 이 행렬을 다음과 같이 사용하겠다.

$$
E_1;=;\begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ 0 & 0 & 1 \end{bmatrix}
$$

그렇다면,

$$
\\begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 1 & 1\\ -1 & 2 & -1\\ 4 & -3 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} ;=; \begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 6 \\ 0 \\ 2 \end{bmatrix}
$$

$$
E_1A\overset{\rightarrow}{x};=;E_1\overset{\rightarrow}{b}
$$

이 수행된 결과에 대해 다음 단계를 이와 같이 나타내면,

$$
E_2;=;\begin{bmatrix} 1 & 0 & 0\\ 0 & 1 & 0\\ -2 & 0 & 1 \end{bmatrix};;;;;; E_3;=; \begin{bmatrix} 1 & 0 & 0\\ 0 & 1 & 0\\ 0 & 2 & 1 \end{bmatrix}
$$

따라서 가우스 소거법은 다음과 같이 나타낼 수 있다.

$$
E_3E_2E_1A\overset{\rightarrow}{x};=;E_3E_2E_1\overset{\rightarrow}{b}
$$

이 때,

$$
E;=; E_3E_2E_1;=; \begin{bmatrix} 1 & 0 & 0\\ 0 & 1 & 0\\ 0 & 2 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0\\ 0 & 1 & 0\\ -2 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ 0 & 0 & 1 \end{bmatrix} ;=; \begin{bmatrix} 1 & 0 & 0\\ {1\over 2} & 1 & 0\\ -1 & 2 & 1 \end{bmatrix}
$$

결론적으로,

$$
EA\overset{\rightarrow}{x};=;E_3E_2E_1A\overset{\rightarrow}{x};=;E_3E_2E_1\overset{\rightarrow}{b};=;E\overset{\rightarrow}{b}
$$

여기서 EA의 결과 행렬은 Upper Triangle Matrix 이다.

$$
EA;=;U\\
$$

## 이제 다시 LU 분해

자, 이렇게 가우스 소거법이 행렬로 분해가 될 수 있다는 사실 까지 알았다. 그렇다면 항등식으로 부터 A행렬을 L과 U로 분해해보자.

$$
A;=;A\\
$$

여기서, 양쪽에 위에서 배운 E1, E2, E3 행렬을 곱해보자.

$$
E_3E_2E_1A;=;U
$$

오른쪽 은 세 행렬이 곱해졌을 때 Upper triangle 행렬이 된 것을 의미한다.

이 식은 다음과 같이 요약되고,

$$
EA;=;U
$$

여기서 Lower triangle matrix의 inverse matrix는,

**Lower Triangle Matrix** 이다.

$$
E^{-1};=;\begin{bmatrix} 1 & 0 & 0\\ -{1\over 2} & 1 & 0\\ 2 & -2 & 1 \end{bmatrix};=;L
$$

따라서,

$$
EA;=;U\\ ;\\ A;=;E^{-1}U;=;LU
$$

다음과 같이 분해가 완료 되었다.

## LU 분해의 특별한 경우 (Cholesky's factorization)

1. A가 **대칭행렬** 이다.
1. 행렬식의 값이 **Positive** 이다.

이런 경우 LU 분해의 결과는,

$$
A;=;LL^T
$$

대부분의 다물체 동역학 시스템은 위의 두 가정을 만족한다.

## Numerical Solution Process

1. Factorization 을 진행한다.  
   $$
   A\overset{\rightarrow}{x};=;\overset{\rightarrow}{b}\\ ;\\ LU\overset{\rightarrow}{x};=;\overset{\rightarrow}{b}\\
   $$

1. 그리고, 식을 재정의한 뒤, iterative method를 사용한다.

$$
1.;;;;U\overset{\rightarrow}{x};=;\overset{\rightarrow}{y}\\ ;\\
$$
$$
2.;;;;L\overset{\rightarrow}{y};=;\overset{\rightarrow}{b}\\
$$

두번의 back-subsitution process를 걸치면 원하는 결과가 나온다.
