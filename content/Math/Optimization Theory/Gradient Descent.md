---
title: Gradient Descent
thumbnail: ''
draft: false
tags:
- critical-point
created: 2024-10-29
---

* 미분은 입력의 작은 변화에 비례해 출력이 얼마나 변하는지를 말해준다.
* 이런 성질은 미분 함수의 최소화에 유용하다.
* 도함수는 출력 y를 개선하려면 입력 x를 얼마나 변화해야 하는지에 대한 정보를 주기 때문이다.
* 이렇게 미분값의 부호화 반대인 방향으로 이동하여 $f(x)$의 값을 최소화하는 방법을 **Gradient Descent**라고 한다.

# Critical Point

* 미분값이 0인 지점을 말한다.
* Gradient Descent는 **Critical Point**에서만 작동한다.
* 이 지점에서는 기울기가 0이므로, 더 이상 이동할 수 없다.
* 정류점 (stationary point)라고도 한다.

## 종류

* **Local Minimum Point**: 주변 보다 가장 작은 값
* **Local Maximum Point**: 주변 보다 가장 큰 값
* **Saddle Point**: 모든 방향에서 기울기가 0이지만, Local Minimum이나 Local Maximum은 아닌 지점
* **Global Minimum Point**: 모든 점에서 가장 작은 값
  * 여러개가 존재할 수도 있다.

# Gradient

* 당연하겠지만, 우리가 다루는 함수는 $R^n \rightarrow R$이다.
* 즉, 입력이 벡터이고 출력이 스칼라인 함수를 다룬다.
  * 최소화라는 개념이 성립하려면 출력이 스칼라여야 한다.
* 이렇게 입력이 여러개일 경우 당연히 **편미분**으로 각 입력에 대한 미분값을 계산해야 한다.

$$
\\nabla f(x) = \left\[ \frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \cdots, \frac{\partial f}{\partial x_n} \right\]
$$

* 이렇게 구한 $\nabla f(x)$를 **Gradient** (구배) 라고 한다.
* 다차원 입력 함수에서의 Critical Point는 Gradient가 0인 지점이다.

# Directional Derivative

* 함수 $f$의 $u$ 방향 기울기를 $u$ 방향의 **방향 미분(Directional Derivative)** 이라 한다.
* 우리가 알고 싶은 건 $u$ 방향에 대한 기울기가 얼마이냐이다.
* 즉, $\alpha$ 만큼 $x$를 $u$ 방향으로 이동했을 때의 함수값 ($f(x+\alpha u)$) 과 $f(x)$의 차이를 구하는 것이다.

$$
\\frac{\partial}{\partial x_1} f(x+\alpha u) = \lim\_{\alpha \to 0} \frac{f(x + \alpha u) - f(x)}{\alpha} = u^T \nabla f(x)
$$

* 이는 $\nabla f(x)$와 $u$의 내적으로 표현할 수 있다.

# Gradient Descent

* 산 정상에 있다고 하자.
* 그런데 여기서 하산을 가장 빨리해야 한다.
* 그렇다면 위험하더라도 경사가 가장 급한 방향으로 내려가야 한다.
* 이걸 수학적으로 증명해보자.
* 특정 지점에서의 방향을 $u$라 하자.
* 그렇다면, 내가 이 지점에 있을 때, 어느 방향으로 가야 가장 빨리 내려갈 수 있을까?
  * 당연하지만 해당 지점의 기울기 (가장 급한 경사를 의미)에 반대방향으로 가면 될 것이다.
* 마찬가지로 특정 [Objective Function](Objective%20Function.md)이 있을 때, 가장 경사가 급한 방향 $u$를 찾아서 이동하는 것이 좋을 수 있다.

$$
\\min\limits\_{u, u^Tu = 1} u^T \nabla f(x) = \min\limits\_{u, u^Tu = 1} \left\| u \right\| \left\| \nabla f(x) \right\| \cos \theta
$$

* 위 식은, $f(x)$를 최소화하는 방향의 $u$를 찾는 과정이다.
* $\left\| u \right\| = 1$ (단위벡터), $\left\| \nabla f(x) \right\|$ 는 고정된 상수 (구배의 크기)이므로, 이를 최소화하는 방향은 $\cos \theta$를 최소화하는 방향이다.
* **즉, 해당 Gradient의 음의 기울기 방향으로 이동하면 최대 경사로 하강한다.**
* 이를 **Gradient Descent**라고 한다. 
  * Method of Steepest Descent라고도 한다.

$$
x\_{n+1} = x_n - \alpha \nabla f(x_n)
$$

* $\alpha$는 **Learning Rate**로, 얼마나 큰 보폭으로 이동할지를 결정한다.
* 이 값이 너무 작으면 수렴하는데 시간이 오래 걸리고, 너무 크면 발산할 수 있다.
* 해당 값을 정하는 방법은 다양한다.
