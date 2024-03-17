---
title: Call by Value, Call by Reference
thumbnail: ''
draft: false
tags:
- cpp
- call-by-reference
- call-by-value
created: 2023-10-03
---

참조변수와 일반변수의 사용의 차이점을 알았다면, main 함수가 동작하는 도중 다른 함수를 호출할때, 그 함수의 인자 역시 두 종류가 있음을 알 수 있다.

마찬가지로 일반변수와, 참조변수를 사용할 수 있다.

두 변수의 값을 바꾸는 함수 *swap* 을 main 함수에서 호출하는 상황을 가정하고 비교해보자.

## Swap_callbyValue

````c++
#include <iostream>

using namespace std;

int swap(int a, int b){
    int temp = a;
    a = b;
    b = temp;
    
    return 0;
}

int main(){
    int x = 5, y = 10;
    cout << "x = " << x << ", y = " << y << endl;
    swap(x, y);
    cout << "x = " << x << ", y = " << y << endl;
    
    return 0;
}
````

````c++
출력
// x = 5, y = 10
// x = 5, y = 10
````

왜 같은 값이 출력될까? `main` 함수에서 `swap` 함수를 호출했을 때, `x` , `y` 값이 `swap` 함수에 들어가고, 이 값은 각각 `a` , `b` 에 **복사** 된다.

따라서 `swap` 함수 안에서는 **복사된 a, b** 안에 들어간 값이 서로 바뀌게 되고, `swap` 함수가 종료된 후에 이 값은 **사라진다.**

결국 내가 원한 결과인 `x` , `y` 는 바뀌지 않는게 당연하다. 이렇게 값이 복사되어 함수를 호출하는 것을 **callbyvalue** 라 한다.

## Swap_callbyReference

````c++
#include <iostream>

using namespace std;

int swap(int &a, int &b){
    int temp = a;
    a = b;
    b = temp;
    
    return 0;
}

int main(){
    int x = 5, y = 10;
    cout << "x = " << x << ", y = " << y << endl;
    swap(x, y);
    cout << "x = " << x << ", y = " << y << endl;
    
    return 0;
}
````

````c++
출력
// x = 5, y = 10
// x = 10, y = 5
````

이렇게 할 경우, `swap` 함수를 호출한 뒤에 안에 들어갈 때, `&a = x` , `&b = y` 이런식으로 들어가기 때문에

`a` 와 `b` 는 `x` , `y` 자체를 가리킨다. 따라서 내가 원하는 결과인 `x` , `y` 의 값이 바뀌게 된다.

이렇게 실제값을 가지고 함수를 호출하는 것을 **callbyreference** 라 한다.
