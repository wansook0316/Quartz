---
title: Function Call
thumbnail: ''
draft: false
tags:
- cpp
- functions
- parameter
- argument
created: 2023-10-03
---

## 함수의 기본 모양

수학에서의 함수와 같이, `input` , `output` 이 있고, `input` 이 들어갔을 때, 어떤 작업을 한 뒤, `output` 을 내보내는 방식으로 작동한다.

![](Pasted%20image%2020231003211354.png)

여기서는 `input` , `output` 에 아무 숫자나 넣어줘도 되지만, 컴퓨터는 이 숫자 자체도 명시적으로 써줘야 하기 때문에, 어떤 `input` 이 들어가는지, 예상되는 `output` 은 어떤 녀석인지 명시적으로 써줄 필요가 있다.

## Function in C++

````c++
int iSqrt(int p){		// #1
    return p * p;		// #2
}
````

1. `int p` : `input` 파라미터의 자료형은 integer 이어야 한다.
   * `int iSqrt` : `output` 의 자료형은 integer 이다.
1. 어떻게 작용하는지 적어주는 함수의 `body` 이다.

![](Pasted%20image%2020231003211409.png)

### Input, output paramater

수학에서의 함수와 다르게 `input` , `output` 파라미터가 없을 수 있다.

### `input` 파라미터가 없는 경우

````c++
#include <iostream>

int helloworld(void){
	cout << "hello world";
	return 0;
}

int main(){
	helloworld();
}
````

````
출력
// helloworld
````

### `output` 파라미터가 없는 경우

````c++
#include <iostream>

void helloworld(void){
	cout << "helloworld";
}

int main(){
	helloworld();
}
````

````
출력
// helloworld
````

`void` 자료형은 window 운영체제에서만 가능하다.

# Main 함수 안에서 사용

**선언(Declare)** , **정의(Define)** , **호출(Calling)** 의 세과정을 거친다.

## 선언(Declare)

````c++
int iSqrt(int);
````

`main` 함수로 들어가기 전에, 먼저 함수의 반환형과, 파라미터의 자료형이 써진 함수의 원형(prototype) 을 적어준다. 변수 이름은 써줄필요없다.

## 정의(Define)

````c++
int iSqrt(int p){
	return p * p;
}
````

`main` 함수 밑에 어떻게 작용하는지 함수의 내용을 적어준다. 이때는 `input` 파라미터로 변수의 이름까지 적어줘야 사용가능하다.

## 호출(Calling)

````c++
y = iSqrt( x );
````

`main` 함수에서 불러서 사용한다. 함수를 돌리고난 반환값이 y에 저장된다.

### 전체코드 예제

````c++
# include <iostream>

using namespace std;

int sum(int a, int b);					// Declare

int main(){
    int x, y;
    cout << "x 입력" << endl;
    cin >> x;
    
    cout << "y 입력" << endl;
    cin >> y;
    
    cout << sum(x, y) << endl;			// Calling
    
    return 0;
}

int sum(int a, int b){					// Define
    return a + b;
}
````

### Default Arguments

함수를 호출했을 때, 아무 인자도 넣지 않았다면, default로 파라미터를 넘길 수 있다. 선언할 때, 인자값까지 같이 전달하면 된다. 또한, input이 적게 들어왔을 경우, 앞 인자만 초기값으로 설정된다.

````c++
# include <iostream>

using namespace std;

int sum(int a, int b);					// Defalut Arguments

int main(){
    int x, y;
    cout << "x 입력" << endl;				// 8
    cin >> x;
    
    cout << "y 입력" << endl;				// 5
    cin >> y;
    
    cout << sum(x, y) << endl;			// 13
    cout << sum(x) << endl;				// 9
    cout << sum() << endl;				// 7
    
    return 0;
}

int sum(int a, int b){					
    return a + b;
}
````

## 함수의 동작과정

````c++
#include <iostream>
#include <cmath>		// cmath 라이브러리 포함

using namespace std;

int main(){
    double value;
    
    // 변수 할당
    value = 16;
    
    // 루트 계산
    double root = sqrt(value);
    
    // 다른 값 계산 후 할당
    root = sqrt(100);
}
````

*cmath 는 수학 함수들을 모아둔 표준 c++ 라이브러리 이다.*

우리가 주 목적을 두는 함수는 `main` 함수이다. 이때, 다른 함수를 불러올때, 어떤 방법으로 실행되는지 그림으로 살펴보자.

![](Pasted%20image%2020231003213222.png)

`main` 함수가 동작하다가, 중간에 `sqrt` 를 만나면

만들어둔 그 함수로 갔다가, 반환값을 다시 가져오고,

또 만나면 다시 갔다가 반환값을 가져오는 방식으로 동작한다.

### cmath Library

````c++
#include <iostream>
````

* 종류

![](Pasted%20image%2020231003213227.png)
