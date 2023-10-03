---
title: Numerical Solution of Ordinary Differential Equations
thumbnail: ''
draft: false
tags:
- math
- numerical-analysis
- ordinary-differential-equations
created: 2023-10-03
---

# Intuition Concept

컴퓨터는 이산적인 값에서 작동하는 기계입니다. 

우리의 정신세계에서 이상적인 선은 존재할 수 있지만 현실에서는 가산적인 점의 집합이 결국 선이겠죠. 

연속적인 세계에서 정의된 해석적 미분방정식의 풀이 방법은 컴퓨터에서 적용할 수 없습니다. 

그래서 우리는 이산적인 세계에서 미분방정식의 해를 검출할 수 있는 다른 방법이 필요합니다.

ODE의 풀이는 생략하고 미분방정식의 꼴에서 부터 생각해보아요.

![](Pasted%20image%2020231003184719.png)

(c = 항력계수)  
떨어지는 물체가 있을 때, 종단속도에 관한 미분 방정식입니다.  
직관적으로 보면 LHS = 가속도(속도의 변화)는,  
RHS = 떨어지는 중력의 가속도 - 항력계수 \* 속도 로 이해할 수 있습니다.

이 때, LHS는 속도의 함수라고 볼 수 있겠네요.

![](Pasted%20image%2020231003184732.png)

![](Pasted%20image%2020231003184738.png)

여기서 Slope는 다음과 같습니다.

![](Pasted%20image%2020231003184745.png)

정리하면, 다음과 같습니다.

![](Pasted%20image%2020231003184756.png)

## Function

적분의 근사방법이 굉장히 많았듯이 ODE도 근본적으로 근사하는 방법이기에 다양한 방법이 있습니다.

![](Pasted%20image%2020231003184808.png)
![](Pasted%20image%2020231003184815.png)

ODE 근사함수가 기본적으로 업데이트 방식으로 값을 얻어내기 때문에 경계조건이 필요합니다. 

이 부분은 해석적으로 풀더라도 해의 유일성을 판단하기 위해 필요한 부분입니다.

````
Solve the ODE [t y] = solver_name(ODEfunc,구할t의범위,y0) (where y0 at t0)
````

## Example1

`1 < t < 3` 의 범위내에서 다음을 풀어라. (B.C `y = 4.2 at t = 1`)

![](Pasted%20image%2020231003184828.png)

위의 원리를 만족하는 함수를 만들어보자.

````matlab
function[t, y] = ode_self(n, initial, final, f, y0) 
	dt = (final-initial)/n; 
	t(1) = initial; 
	y(1) = y0;     
	for i = 1: n     
		t(i+1) = t(i) + dt;     
			y(i+1) = y(i) + dt * f(t(i),y(i));    
	end 
end
````

그리고 실행해보자.

````matlab
실행코드
dydt = @(t,y)(t^3 -2*y)/t 
[t,y] = ode_self(100, 1, 3, dydt, 4.2) 

plot(t,y)
````

![](Pasted%20image%2020231003185006.png)

ODE45로도 풀어보자.

````matlab
dydt = @(t,y)(t^3 -2*y)/t 
[t,y] = ode45(dydt, [1:0.01:3], 4.2) 

plot(t,y)
````

![](Pasted%20image%2020231003185020.png)

같게 그려지는 것을 알 수 있다.

## Example2

![](Pasted%20image%2020231003185027.png)
![](Pasted%20image%2020231003185046.png)

x와 v와의 관계를 원하므로 약간의 조작을 가했다.

````
K = 30 
m = 1500 
v0 = 90*1000/3600 
% 단위 변환 
dvdx = @(x,v)(-1)*(K/m)*(v^2)*(x+1)^3 
range_x = [0:0.001:3] 
[x, v] = ode45(dvdx,range_x,v0)  

plot(x,v) 
xlabel('x') 
ylabel('v')
````

![](Pasted%20image%2020231003185116.png)
