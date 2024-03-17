---
title: Static binding
thumbnail: ''
draft: false
tags:
- cpp
- binding
- static-binding
- dynamic-binding
created: 2023-10-03
---

# Static Binding (정적 바인딩)

````c++
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Base{
public:
    void f(){cout << "Base::f()" << endl;}
    virtual void vf() {cout << "Base::vf()" << endl;}
};

class Derived:public Base{
public:
    void f(){ cout << "Derived::f()" << endl;}
    void vf() override { cout << "Derived::vf()" << endl;}
};


int main(){
    Base base;
    Derived derived;
    
    base.f();
    base.vf();
    derived.f();
    derived.vf();
    
    return 0;
}

````

````
Base::f()
Base::vf()
Derived::f()
Derived::vf()
Program ended with exit code: 0
````

우리가 여태껏 배웠던 상속에서 `override` , `virtual` 은 단지 상속을 받았다는 것을 명시하는 역할이라고 생각했다.

이렇게 우리가 알았던 상속을 단순하게 사용하는 방법을 **정적 바인딩** 이라 한다.

코드를 보면, 내가 생성한 객체에 대해 엮여있는 함수를 정해주는데 있어 내가 선언해준대로 되었다.

base 객체에 대해 base 클래스에서 정의된 멤버함수들만 사용가능하고, derived 객체에 대해서는 Derived 클래스에서 정의된 멤버함수들만 사용가능하다.
