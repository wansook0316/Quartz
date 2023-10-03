---
title: Interpolation
thumbnail: ''
draft: false
tags:
- math
- interpolation
- matlab
created: 2023-10-03
---

오늘은 보간법에 대해 공부해본다.

## Intution Concept

![](Pasted%20image%2020231003182244.png)

보간법은 사실 위와 같이 4개의 점을 서로서로 이어서(다양한 방법이 있겠죠?) 그 사이값을 추정하는 방법에 대한 것이다.

그런데 비슷한 걸 앞에서 하지 않았냐! 하고 궁금할 지도 모르겠다.

 > 
 > 저거 하느니 4개점을 다 잇는 함수를 하나 만드는게 낫지 않느냐!

그렇죠!  
그럴 수도 있지만 저 4점을 다 잇는 함수를 만드는 것이 저 점들의 관계를 설명해주는 지는 의문이죠? 

그래서 여러가지 방법을 통해서 사이값을 추정합니다.

두 점을 잇는 방법은 무한가지가 있겠지만 그중에서 우리가 사용하는 방법은,

![](Pasted%20image%2020231003182314.png)

4가지 정도로 구성되어 있다.

## Function

````matlab
결과값 = interp1(x,y,구하고자 하는 x값, '방법') (주의 : 1입니다. L아니고)
````

## Example

````matlab
x = 0:1:5;
y = [1 -0.6242 -1.4707 -3.2406 -0.7366 -6.3717];  
xi = 0:0.1:5; yi_lin = interp1(x,y,xi,'linear'); yi_spl = interp1(x,y,xi,'spline'); yi_pch = interp1(x,y,xi,'pchip'); y_func = 1.5.^xi.*cos(2*xi);  

subplot(1,3,1); 
plot(x,y,'o', xi, y_func, xi, yi_lin, '--'); 
subplot(1,3,2);
plot(x,y,'o', xi, y_func, xi, yi_spl, '--'); 
subplot(1,3,3);
plot(x,y,'o', xi, y_func, xi, yi_pch, '--');
````

3가지 방법의 차이를 알아봅시다!

![](Pasted%20image%2020231003182428.png)
