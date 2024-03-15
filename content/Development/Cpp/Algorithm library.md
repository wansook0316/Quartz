---
title: Algorithm library
thumbnail: ''
draft: false
tags:
- cpp
- algorithm
- library
created: 2023-10-03
---

# for_each()

`algorithm` 라이브러리에는 다양한 함수가 있지만, 그중에서 `for_each()` 함수에 대해서 알아보자.

````c++
#include <algorithm>

vector<int> v{1, 2, 3, 4, 5, 6, 7};
````

다음과 같은 벡터가 선언되어 있을 때, 각 요소의 값을 실제로 1 증가시키기 위해서는 어떻게 해야할까?

각각의 요소를 reference 해서 불러온 뒤, 증가시켜주면 될 것이다.

````c++
for(auto& elem : v){
    elem++;
}
````

그런데, 만약 다른 자료형이라면, 이 것을 일일히 다 쳐줘야 한다. 그래서 for_each() 함수가 존재한다.

## 사용법

````c++
for_each(시작 주소값, 끝 주소값, 함수);
````

이때 특정 객체의 시작주소값, 끝주소값을 받아오는 것을 `begin()` `end()` 함수로 배웠다.

그리고, 이 객체에 대해 순간적으로 우리가 어떤 작업을 한다면, 굳이 함수를 정의해놓지 않고 람다함수로 집어넣을 수도 있을 것이다.

따라서 위에 구현한 코드는 다음과 같다.

````c++
for_each(begin(v), end(v), [](int& elem){elem++;});
````

출력해보는 함수도 비슷하게 짤 수 있을 것이다.

````c++
for_each(begin(v), end(v), [](int elem){cout << elem << "\t";});
````

# transform()

그런데 만약에 내가 어떤 작업을 한 뒤에, 다른 컨테이너에 넣어야 할 수 있다.

위에 있는 건 각 요소에 대해 reference 해서 값을 변화시켰다면, 바꾼 내용을 다른 객체에 반환해야 할 수도 있다.

우리는 이럴 때, `transform()` 함수를 사용한다.

## 사용법

````c++
transform(소스_시작주소, 소스_끝주소, 목적지_시작주소, 함수);
````

`for_each()` 와 비슷하게 사용하면 된다!

````c++
vector<int> v2(v.size());

transform(begin(v), end(v), begin(v2), [](int elem){return elem*elem;});
````

# copy()

특정 주소에서 주소까지 값을 복사해서 올 수 있다.

\[시작 주소, 끝주소)

끝 주소에 해당하는 값은 복사하지 않는다.

## 사용법

````c++
copy(소스_시작주소, 소스_끝주소, 목적지 시작주소);
````

````c++
vector<int> v3(3);
copy(begin(v)+1, begin(v)+4, begin(v3));
for_each(begin(v3), end(v3), [](int elem)->int{cout << elem << "\t";});
````

````
2 3 4
````
