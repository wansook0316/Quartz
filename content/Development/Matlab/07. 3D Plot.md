---
title: 3D Plot
thumbnail: ''
draft: false
tags:
- matlab
- visualization
created: 2023-10-03
---

# Plot3

`x`, `y`, `z`값이 있을 때 이를 그려준다.

````
% Plot3 plot3(x,y,z, 'line specifiers', 'propertyName', property value) line specifiers; linewidth, linecolor etc property; markersize etc
````

# Example 1

````
t = 0:0.1:6*pi; 
x = sqrt(t).*sin(2*t); 
y = sqrt(t).*cos(2*t); 
z = 0.5*t; plot3(x,y,z, ‘k’, ‘linewidth’, 1) grid on 
xlabel(‘x’); 
ylabel(‘y’); 
zlabel(‘z’)
````

![](Pasted%20image%2020231003185225.png)

# Mesh, Surface plots, Contour3

직관적으로 생각해보자.

어떤 평면이 있다. 그런데 각 포인트마다 건물을 세울거야.  
그런데 plot3처럼 z값의 데이터가 주어진 것이 아니고  
`z = f(x, y)` 인 경우 일일히 `x`, `y`를 대입해서  
z값을 만드는 짓을 하기는 귀찮다.

그래서 meshgrid 라는 체를 만드는 함수를 만들어버리고,  
입력하면 행렬의 형태로 바로 만들어준다!

우리가 할일은 함수 f에 이 값을 연산만 시켜주면 된다.

````matlab
% Meshgrid [X, Y] = meshgrid(x,y) X, Y는 행렬값
````

이 행렬을 통해 나온 값을 행렬 Z로 받는다면,

````matlab
% Mesh mesh(X,Y,Z)
````

할 경우 이 격자화한 값에 대한 그래프가 그려진다.

일정한 z값에 따라 그래프를 자른 윤곽선만 나타내고 싶으면  
contour3 함수를 사용하면 된다.  
이름에서 알 수 있듯이 등고선을 그려준다.

````matlab
% Contour3 contour3(X,Y,Z)
````

# Example 2

다음을 Mesh grid로 만들어라.
![](Pasted%20image%2020231003185435.png)

````matlab
x = -1:0.1:3; 
y = 1:0.1:4; 
[𝕏,Y] = meshgrid(x,y)  

Z = X.*Y.^2 ./ (X.^2 + Y.^2)
````

````matlab
x =

    -1     0     1     2     3
    -1     0     1     2     3
    -1     0     1     2     3
    -1     0     1     2     3


y =

     1     1     1     1     1
     2     2     2     2     2
     3     3     3     3     3
     4     4     4     4     4


z =

   -0.5000         0    0.5000    0.4000    0.3000
   -0.8000         0    0.8000    1.0000    0.9231
   -0.9000         0    0.9000    1.3846    1.5000
   -0.9412         0    0.9412    1.6000    1.9200
````

## Mesh

\`mesh(X, Y, Z)\```

![](Pasted%20image%2020231003185733.png)

`meshc(X, Y, Z)`

![](Pasted%20image%2020231003185751.png)

## surface

`surf(X, Y, Z)`

![](Pasted%20image%2020231003185746.png)

## contour3

`contour3(X, Y, Z)`

![](Pasted%20image%2020231003185758.png)
