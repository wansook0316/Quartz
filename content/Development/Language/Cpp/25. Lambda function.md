---
title: Lambda function
thumbnail: ''
draft: false
tags:
- cpp
- lambda
- lambda-function
- closure
created: 2023-10-03
---

# Lambda function

함수 안에서 부를 수 있는 **Local function**! 사실 정체는 객체이지만, 우리는 함수의 개념으로 갖다 쓴다!

## Usage

````c++
[closure](입력 매개변수)->출력 type{내용}
````

Local function 이기 때문에 만들어졌다가 리턴 후 사라진다.

# Example

````c++
#include <iostream>
#include <vector>
#include <functional>

using namespace std;

int evaluate(int(*func)(int, int), int x, int y){

    return func(x, y);
}

int main(){
    // sum: [](int x, int y)->int{return x + y;}
    cout << evaluate([](int x, int y)->int{return x + y;}, 2, 3) << endl;

    // mult: [](int x, int y)->int{return x*y;}
    // mult: [](int x, int y){return x*y;} 굳이 안적어도돼 너무 명확해서
    cout << evaluate([](int x, int y){return x * y;}, 2, 3) << endl;

    // lambda 함수를 바로 생성해서 호출
    [](int x, int y){cout << x << ", " << y << endl;}(2,3);

    auto f  = [](int x, int y)->int{return x - y;};
    cout << f(3, 5) << endl;

}
````

`evaluate` 함수는 함수 포인터와, 인자 두개를 받아, 해당하는 함수를 리턴해주는 함수이다. `main` 함수 내에서 즉석으로 내가 원하는 함수를 만들고, `evaluate` 함수를 사용하고 싶다면 Lambda function 을 사용하면 된다!

# closure

우리가 기존에 함수를 만들 때, 람다 함수를 사용할 때 우리는 이걸 함수처럼 사용한다. 즉, 입력 파라미터를 제외하고는 함수의 구현부에서 다른 변수를 사용할 수 없었다.

하지만 람다함수의 경우, 입력 파라미터이외의 변수를 읽어올 수 있다.

람다 함수가 특정 함수의 **지역 함수** 처럼 사용되기 때문인데, 람다함수가 속해있는 함수의 변수를 가져와 사용할 수 있다.

이 점 때문에, 글의 도입부에서 람다함수의 정체는 객체라고 했던 것이다! 함수의 모양을 하고 있지만, 클래스 구성이 객체처럼 되어 있다.(뇌피셜)

사용예는 다음과 같다.

````c++
int evaluate(int(*func)(int, int), int x, int y){
    return func(x, y);
}

int main(){
    int a;
    cin >> a;
    // [](int x, int y){return x*y;}

    // [closure]: capturing variables
    // [] 안에 변수를 넣으면 이 람다 함수내에서 사용할 수 있다.
    // 원래는 인풋파라미터만 사용가능했는데 , 외부 변수를 가져올 수 있다는 것
    // [a] : 변수 a를 call by value 로 함수에 전달
    // [&a] : 변수 a를 call by reference로 함수에 전달
    // [=]: 모든 주위 변수를 call by value로 함수에 전달
    // [&]: 모든 주우 변수를 call by reference로 함수에 전달

    cout << evaluate([a](int x, int y){return a*x*y;}, 2, 3) << endl;

    return 0;
}

````

# Function Object

우리가 위에서 구현한 `evaluate` 함수에서, 함수 포인터로 첫번째 인자를 주었다.

그런데, 포인터를 사용해서 나타내는 것은 위험하므로, 우리는 이것을 표현할 수 있는 객체를 만들어 관리하는 것이 보다 안전하다.

이 것을 가능하게 하는 객체가 `function` 이다.

````c++
function<출력자료형<입력자료형1, 입력자료형2...>함수 이름
````

## Usage

````c++
int evaluate2(function<int(int, int)>func , int x, int y){
    return func(x, y);
}
````
