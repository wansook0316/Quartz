---
title: Gram Matrix
thumbnail: ''
draft: false
tags: null
created: 2023-10-04
---

# 개요

style transfer에서는 input의 style을 target의 style과 맞게 만들어주는 방법이 필요한데, 이에 대한 방법론의 핵심을 담당하는 Gram Matrix에 대해 알아본다.

# 수식

먼저, 논문에서 제안하고 있는 Gram Matrix의 형태는 다음과 같다.

$$G^l\_{cd} = \frac{\sum\_{ij} F^l\_{ijc}(x)F^l\_{ijd}(x)}{IJ}$$

우리는 쉬운 이해를 위해서 채널, 정규화 과정을 제거한 채로 살펴보자.

$$G^l\_{ij} = {\sum\_{k} F^l\_{ik}(x)F^l\_{jk}(x)}$$

* l : layer
* F : Filter
* i, j : Filter Index

수식으로 들어온다면 여기까지만 읽으면 된다.

# 의미

이미지 $\vec{x}$ 가 있다고 하자. 해당 벡터는 2차원 이미지가 있을 때, 이를 1차원으로 faltten 한 것이다. 이 이미지의 크기를 M=3이라 하자.

$$
\\vec{x}=\[x_0, x_1, x_2\]
$$

각 이미지가 통과하는 필터(M=2)가 2개 있다고 하자. 해당 필터는 $F$로 표기한다. 각각의 filter에 image를 통과시킨 결과를 $\vec{F}$라 하자.

$$
\\mathbf{F} =
\\begin{bmatrix}
F_1(x_0) & F_1(x_1) & F_1(x_2) \\
F_2(x_0) & F_2(x_1) & F_2(x_2)
\\end{bmatrix}
$$

$$
F\_{ik} = F_i(x_k)
$$

$F\_{ik}$는 $F_i$ 필터에 $x_k$ 픽셀을 넣었을 때의 activation(response)이다. 그렇다면 Gram Matrix의 의미가 무엇인지 알아보자. 일단

$$
\\begin{align}
G^l\_{ij}
&=
\\sum\_{\text{all term}}
\\begin{bmatrix}
F\_{00}F\_{00} + F\_{01}F\_{01} + F\_{11}F\_{11} & F\_{00}F\_{10} + F\_{01}F\_{11} + F\_{02}F\_{12} \\
F\_{10}F\_{00} + F\_{10}F\_{01} + F\_{12}F\_{02} & F\_{10}F\_{10} + F\_{11}F\_{11} + F\_{12}F\_{12}
\\end{bmatrix}
\\

&=
\\sum\_{\text{all term}} \sum_k
\\begin{bmatrix}
{F\_{0k}}^2 & F\_{0k}F\_{1k} \\
F\_{0k}F\_{1k} & {F\_{0k}}^2
\\end{bmatrix}
\\end{align}
$$

어디서 많이 본 모양이다. pixel별 filter activation의 Covariance이다! 결과적으로 발생하는 모든 항을 더하게되면 다음의 의미이다.

 > 
 > pixel의 filter activation들에 대한 covariance 모든 항의 합

이렇게 발생한 값을 가지고 input의 filter가 원하는 target filter의 gram matrix 값과 같도록 학습을 진행한다.

$$
E\_{l}= {1\over4{N_e}^2{M_e}^2}\sum\_{ij}(G\_{ij}^l - \hat{G\_{ij}^l})^2
$$

최종적으로는 밀도로 나누어서 사용해야 한다.

# Reference

* [Gram Matrix 설명](https://m.blog.naver.com/PostView.nhn?blogId=atelierjpro&logNo=221180412283&proxyReferer=https:%2F%2Fwww.google.com%2F)
