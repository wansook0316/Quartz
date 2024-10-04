---
title: Solving an Equation with One variable
thumbnail: ''
draft: false
tags:
- intermediate-value-theorem
- math
- matlab
created: 2023-10-03
---

## Intuition Concept

컴퓨터가 생각하는 방식은 절레절레와 노가다 밖에 없어요.  
무슨말이냐면 Yes, No의 선택방식과, 계산을 계속하는 방법이 전부라는 의미죠.  
멍청하다고 생각할 수 있겠지만 이것을 잘 활용하면 강점이 됩니다.

다항식의 근을 구하는 방법은 roots라는 함수를 사용하면 끝났었죠. 

하지만 우리가 다루는 함수는 거기서 그치지 않기 때문에 다른 함수를 만들어야 합니다.

![](Pasted%20image%2020231003182635.png)

수학적으로 근이라는 것은 1개의 변수만 있는 함수 일때 x축과 만나는 점을 말합니다. 

위의 그림 같은 경우는 3축을 **통과**하는 점이 3개네요.  이런 경우 컴퓨터는 근을 찾을 수 있게 됩니다. 그렇다면 이 경우는 어떨까요?

![](Pasted%20image%2020231003182647.png)

접하는 경우도 분명 근이 맞지만 컴퓨터는 이 접하는 점을 근으로 판단하지 못합니다. 

알고리즘 자체가 함수값의 부호가 바뀌었을 때, 멈추도록 짜여 있기 때문이죠. 

따라서 지금 배울 이 함수는 접하는 경우에 사용하기 어렵습니다.

함수의 알고리즘은 [**중간값의 정리**](https://ko.wikipedia.org/wiki/%EC%A4%91%EA%B0%84%EA%B0%92_%EC%A0%95%EB%A6%AC)를 기반으로 하고 있습니다. 그렇기 때문에 값을 정해주어야 합니다. 

정해진 값으로 부터 가까운 근에 가까운 쪽에 있는 값으로 다가가며 최종적인 근을 결과물로 내놓습니다.

## Function

````matlab
근 = fzero(함수,초기값)
````

여기서 **함수**는, `f(x) = 0` 의 형태로 만든 뒤에 사용해야 합니다.

## Example

`(x+1)*exp(-x) = 0.3`의 근을 구해라.

````matlab
f(x) = (x+1)*exp(-x)-0.3
````

초기값을 정해야 하니 함수를 그려봅니다.

````matlab
f = @(x)(x+1)*exp(-x)-0.3 fplot(f,[-1 8])
````

![](Pasted%20image%2020231003183053.png)

2개의 근이 나올 것으로 보이고 근처값을 산정해서 넣습니다.

````matlab
f = @(x)(x+1)*exp(-x)-0.3
fplot(f,[-1 8]) 
a=fzero(f, -0.2 )
[b f_value]=fzero(f, 3, optimset('display', 'iter'))
````

````matlab
a =  -0.8749   부호 변경이 포함된 3의 구간을 검색합니다. 

부호 변경이 포함된 3의 구간을 검색합니다.
 Func-count    a          f(a)             b          f(b)        Procedure
    1               3     -0.100852             3     -0.100852   initial interval
    3         2.91515    -0.0878145       3.08485     -0.113172   search
    5            2.88    -0.0821971          3.12     -0.118072   search
    7         2.83029    -0.0740299       3.16971     -0.124806   search
    9            2.76     -0.062023          3.24     -0.133945   search
   11         2.66059     -0.044099       3.33941     -0.146134   search
   13            2.52    -0.0167822          3.48     -0.161983   search
   14         2.32118     0.0259999          3.48     -0.161983   search

구간 [2.32118, 3.48]에서 영점을 검색합니다.
 Func-count    x          f(x)             Procedure
   14         2.32118     0.0259999        initial
   15         2.48145   -0.00887552        interpolation
   16         2.44067  -0.000308135        interpolation
   17         2.43922   2.17727e-07        interpolation
   18         2.43922  -9.30881e-11        interpolation
   19         2.43922             0        interpolation

구간 [2.32118, 3.48]에서 영점이 발견됨

b =

    2.4392


f_value =

     0
````

옵션 optimset('display', 'iter')을 선택하면 진행되는 과정을 볼 수 있다.

# Reference

* [desmos.com/calculator](https://www.desmos.com/calculator)
* [중간값의 정리](https://ko.wikipedia.org/wiki/%EC%A4%91%EA%B0%84%EA%B0%92_%EC%A0%95%EB%A6%AC)
