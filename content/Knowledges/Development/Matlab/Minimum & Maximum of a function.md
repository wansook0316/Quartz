---
title: Minimum & Maximum of a function
thumbnail: ''
draft: false
tags:
- math
- matlab
- maximum
- minimum
- functions
created: 2023-10-03
---

## Intuition Concept

아까와 마찬가지로 컴퓨터의 반복계산과 Y,N를 사용해서 만든 알고리즘이에요.  
하지만 비교의 개념이 들어가다보니 아까는 하나의 값을 넣어주었지만  
이번에는 값을 범위화해서 넣어주어야 겠죠.

그리고 이번에는 최솟값을 구하는 함수 밖에 없어요.  
최대값은 함수를 대칭시켜서 구합니다.

## Function

````
[최대일때x 최댓값] = fminbnd(함수,x1, x2)
````

여기서 **함수**는, `f(x) = 0` 의 형태로 만든 뒤에 사용해야 합니다.  
`x1` 과 `x2` 는 `x1 < x2` 관계에 있어야 합니다.

## Example

`0 < x < 10` 의 범위내에서 `x^3 – 12*x^2 +40.25*x – 36.5`의  
최댓값, 최솟값을 구해라.

초기값을 정해야 하니 함수를 그려봅니다.

````matlab
f = @(x)x^3-12*x^2+40.25*x-36.5
fplot(f,[0 10]
````

![](Pasted%20image%2020231003183212.png)

`1 < a < 3` 에서 최댓값, `5 < b < 6` 에서 최솟값이 등장합니다.

````matlab
f = @(x)x^3-12*x^2+40.25*x-36.5 
fplot(f,[0 10])  

[a fv_min] = fminbnd(f, 3, 8)  

f_minus = @(x)(-1)*(x^3-12*x^2+40.25*x-36.5)
[b fv_max_minus] = fminbnd(f_minus, 1, 4)
````

최댓값은 함수를 x축 대칭한 후 최솟값을 찾은 후 함숫값에  
다시 `-1`을 곱해주면 최댓값이 됩니다.

````matlab
a =

    5.6073


fv_min =

  -11.8043

  b =

    2.3927


fv_max_minus =

   -4.8043
````

실제 최댓값은 `fv_max = -fv_max_minus = 4.8043` 이 될 것입니다.
