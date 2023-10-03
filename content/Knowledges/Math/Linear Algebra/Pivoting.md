---
title: Pivoting
thumbnail: ''
draft: false
tags:
- linear
- linear-algebra
- math
- matrix
- pivoting
- round-off-error
- error
created: 2023-10-03
---

# Motivation of Pivoting

가우스 소거법과, 가우스-조르당 방법에서 대각행렬을 기준으로 수행한다는 것은 명백하다.

우리는 그래서 이 대각 행렬의 요소를 **Pivot** 이라 부른다. Pivoting 이란, 행렬이 있을때, 이 Pivot을 기준으로 행을 판단해서 두 행을 바꿔 계산하는 방법을 말한다.

그렇다면 이 Pivoting은 왜 필요한 것일까?

우리는 행렬을 계산하는데 있어 Computing Method를 사용하는데, 현실의 값을 근사해서 매핑하는 컴퓨터의 한계 때문에,

우리는 **Round Off Error** 를 필연적으로 가질 수 밖에 없다.
이 에러를 줄이기 위해 우리는 Pivoting을 한다.

예제를 살펴보자.

$$
\\begin{bmatrix} 0.003 & 59.14 \\ 5.291 & -6.130 \\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 59.17 \\ 46.78 \\ \end{bmatrix}
$$

이 식의 정확한 값은,

$$
Exact;Solution\\ ;\\ \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 10.00 \\ 1.0 \\ \end{bmatrix}
$$

가우스 소거법을 사용해서 위 식을 계산해보자. 우리는 대각 요소를 1로 만드는 것에 관심이 있기 때문에, 1행 1열의 값을, 2행 1열의 값과 같게 만든뒤 빼줘야 한다.

그러기 위해서

$$
{a\_{11} \over a\_{21}};=;{0.003 \over 5.291};=;1763.66\cdots
$$

이 값을 1행에 곱하고 2행을 더한 행을 2행과 바꿔주자. 결과 식은,

$$
\\begin{bmatrix} 0.003 & 59.14 \\ 0 & -104300\\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 59.17 \\ -104400 \\ \end{bmatrix}
$$

이 때 계산된 해는,

$$
Approximated;Solution\\ ;\\ \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} -10.00 \\ 1.001 \\ \end{bmatrix}
$$

다음과 같이 현저히 다른 해가 도출된다. 결국 우리는 대각 요소의 값과 밑의 행이 비율이 큰 것을 피하면 된다!

$$
m\_{jk};=;{a\_{jk}\over a\_{kk}}>>1
$$

j는 행의 번호를 말하고, k는 대각 요소의 행번호를 의미한다.

우리는 이 값이 1보다 클경우 Round Off 에러가 발생한다는 것을 알았으므로 이것을 막으면 된다.

# Remedy

1. Partial Pivoting
1. Scaled Pivoting

#### Partial Pivoting

가장 간단한 방법은, 저 값이 1보다 훨씬 클경우 아래 행과 위의 행을 바꾸는 것이다!

$$
\|a\_{pk}|;=;Loop(k \le i \le n);max ;|a\_{ik}|
$$

k는 현재 있는 행을 의미한다. n은 마지막 행을 의미한다.

그 사이에 있는 i 라는 값을 가지면서 각 행의 요소들을 조사하면서 가장 큰 값을 리턴한다. 이때, 행의 index를 저장하고, 만약 해당 행의 대각 요소의 값이 가장 크다면 **p = k** 가 될 것이다.

만약 그렇지 않다면 **p != k** 일 것이다. 이 경우 **p 행과 k 행을 Pivoting** 한다.

그렇게 되면 필연적으로 m\_jk 값은 1보다 작아지므로 Round Off Error 를 피할 수 있다.

### 적용

$$
\\begin{bmatrix} 5.291 & -6.130 \\ 0.003 & 59.14 \\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 46.78 \\ 59.17 \\ \end{bmatrix}
$$

$$
m\_{jk};=;m\_{21};=;{a\_{21}\over a\_{11}};=;{5.291 \over 0.003};=;0.000567
$$

$$
\\begin{bmatrix} 5.291 & -6.130 \\ 0 & 59.14 \\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 46.78 \\ 59.14 \\ \end{bmatrix}
$$

$$
Approximated;Solution\\ ;\\ \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 10.00 \\ 1 \\ \end{bmatrix}
$$

## Scaled Pivoting

만약 m 값이 1에서 크게 차이가 없다면 이 방법은 사실의미가 없다.

따라서 이 경우에는 각 행에 특정 같은 값을 곱한뒤, 답을 구하는 방법을 사용해야 한다.

가우스 소거법의 특성상, 밑의 값부터 올라오기 때문에, 특정 행의 계수들의 크기가 균등하다면 값의 변화가 크다.

따라서 우리는 행의 계수들의 비율이 큰 행을 아래로 피보팅 해야한다.

$$
\\begin{bmatrix} 30 & 591400 \\ 5.291 & -6.130 \\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 591700 \\ 46.78 \\ \end{bmatrix}
$$

$$
S_1;=;max\[\|30|, |591400|\] ; =;591400\\ S_2;=;max\[\|5.291|, |-6.130|\] ; =;6.130
$$

$$
{|a\_{11}| \over S_1};=; {30 \over 591400};=;0.5073\times10^{-4}\\ {|a\_{21}| \over S_2};=; {5.291 \over 6.130};=;0.8631
$$

따라서 1행과 2행을 피보팅한다.

$$
\\begin{bmatrix} 5.291 & -6.130 \\ 30 & 591400 \\ \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \end{bmatrix} ;=; \begin{bmatrix} 46.78 \\ 591700 \\ \end{bmatrix}
$$
