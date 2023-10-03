---
title: Pointer
thumbnail: ''
draft: false
tags:
- BOJ
- algorithm
- two-pointer
- python
- pointer
- function-pointer
- functions
created: 2023-10-03
---

## What is pointer

포인터는 먼저 자료형으로 선언할 수 있다. 각각의 자료형에 대해 `*` 를 달게 되면 선언할 수 있으며.

이 의미를 말로 파악하는 것이 중요한데, `int* p` 와 같은 경우, ***특정 자료형이 int인 변수의 주소를 받을 수 있는 포인터 변수 p를 생성해라*** 로 생각 할 수 있다.

`char* c` 와 같은 경우, ***특정 자료형이 char인 변수의 주소를 받을 수 있는 포인터 변수 c를 생성해라*** 로 판단하면 된다.

그렇다면 어떤 식으로 메모리 공간에 할당이 될까?

````c++
#include <iostream>

using namespace std;

int main(){
    
    int x;
    x = 4;
    int* p;
    p = &x;
    
    cout << p << endl;
    
    cout << a << ", " << *p << endl;
    
    return 0;
}


````

![](Pasted%20image%2020231003214259.png)

이렇게 메모리 공간에 자리잡게 된다. 이때 p의 주소의 있는 값으로가서, 그 값을 출력하게 하는 방법은 포인터 변수 p에 `*` 를 달면 가능하다. 해당 주소로 **점프** 를 한다고 이해하면 직관적이다.

````
Output
0x04
4, 4
````

이것을 그림으로 좀더 직관적으로 이해해보자.

![](Screen%20Shot%202023-10-03%20at%209.43.12%20PM.png)

여기서 가장 핵심적으로 생각해야 하는 부분은, 포인터 변수를 선언한 뒤에 꼭 이 변수가 가리키는 주소를 할당해주어야 한다는 것이다.

## PassingByAddress

이제까지 함수호출에 관해 Callbyvalue, Callbyreference와 같은 것을 배웠다.

그런데 이제 포인터를 배우게 되면, 함수의 인자를 포인터 변수로 선언하고, 값을 넘길 때 ***주소*** 를 넘겨줄 수 있다.

함수를 호출하고 나면, 메모리 공간에 저장된 두 변수의 값을 변경하는 *Swap* 함수를 만들어보자.

````c++
#include <iostream>

using namespace std;

void swap(int* var1, int* var2){
    int temp = *var1	// var1의 주소로 점프한 값을 temp에 저장해라
    *var1 = *var2;		// var1의 주소로 점프한 값에 var2의 주소로 점프한 값을 할당해라
    *var2 = temp;		// var2의 주소로 점프한 값에 temp의 값을 넣어라.
}

int main(){
    
    int a = 4, b = 5;
    cout << a << "," << b << endl;
    swap(&a,&b);
    cout << a << ", " << b << endl;
    
    return 0;
}
````

````
Output
4, 5
5, 4
````

## Function Pointer

함수 포인터? 함수 역시 포인터로 구성되어 있다는 사실을 모른다면 당황스러울 수 있다.

우리가 함수를 호출한다는 것은, 컴파일 이후 특정 메모리 공간에 정의되어 있는 행위의 위치로 가서 읽어오라는 뜻이다.

그러기 위해서는 함수호출을 했을 때, 그 위치로 가야한다는 의미이고, 결국은 메모리의 주소를 알아야 한다는 결론을 얻을 수 있다.

따라서 우리가 함수의 이름을 설정하고 나면, 이 함수의 이름은 포인터이다.

**즉, 컴파일 이후 메모리 공간에 생성된 일련의 작업 행위가 적힌 곳의 시작 위치 주소를 가지고 있다.**

이 구조를 알고 있다면 우리는 특정 다른 함수를 짤때, 파라미터로 이 함수의 시작 주소를 넣어 더 고차원적인 프로그래밍을 가능하게 할 수 있다.

### 함수 포인터 사용법

````c++
함수가_반환하는_자료형 (*함수포인터로_사용할_변수_이름)(인풋파라미터의_자료형, 인풋파라미터의_자료형, ...)
````

## 예제

````c++
#include <iostream>

using namespace std;

int add(int a, int b){
    return x + y;
}

int multiply(int a, int b){
    return x*y;
}

int evaluate(int (*f)(int, int), int x, int y){
    return f(x, y);		// main 으로부터 함수의 시작주소를 포인터 변수 f로 받고,
    					// 그 함수의 인풋으로 x, y를 준 값을 반환해라.
}

int main(){
    cout << add(2, 3) << endl;
    cout << multiply(2, 3) <<  endl;
    cout << evaluate(&add, 2, 3) << endl;
    cout << evaluate(&multiply, 2, 3) << endl;
}
````

````
Output
5
6
5
6
````
