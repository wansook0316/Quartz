---
title: Dynamic binding
thumbnail: ''
draft: false
tags:
- cpp
- dynamic-binding
- oop
- polymorphism
created: 2023-10-03
---

# Dynamic Binding (동적 바인딩)

그런데, 우리가 두 클래스가 상속관계에 있다는 것을 안다면, 이 멤버함수를 자동으로 묶어줄 수는 없을까?

이제 `override` , `virtual` 의 강력한 기능을 알 수 있다.

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
    Base* pBase;
    
    pBase = &base;
    pBase->f();
    pBase->vf();
    
    pBase = &derived;
    pBase->f();
    pBase->vf();
    
    return 0;
}
````

````
Base::f()
Base::vf()
Base::f()
Derived::vf()
Program ended with exit code: 0
````

Base 클래스의 주소를 담는 포인터 변수 `pBase` 를 선언하고, 이 주소에 `base` 객체의 주소를 담고서, 두 멤버함수를 호출하니 당연히 Base 클래스의 함수들이 호출되는 것을 알 수 있다.

그런데, `derived` 객체의 주소를 담으면 (부모 클래스에 자식 클래스를 넣을 수는 있다고 앞글에서 설명했다.)  멤버함수의 **Base의 f(), Derived 의 vf()** 가 호출되었음을 알 수 있다.

즉, 해당 객체의 멤버함수를 **기본적으로는 Base 에서 가져온다.**

**하지만 Virtual 선언이 되어 있다면, 어떤 객체인지 파악후 그 객체의 멤버함수를 가져온다**

이런 작업은, 프로그램이 실행되면서 묶일 수 밖에 없으므로, ***동적 바인딩*** 이라 불린다.

## 동적 바인딩의 의미

우리는 이 기술을 사용해서, 서로 다른 자료형들을 하나의 벡터안에 넣어서 관리할 수 있다.

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

    Base* pBase;
    vector<Base*> v{ new Base, new Derived, new Base};
    pBase = new Derived;
    v.push_back(pBase);
    pBase = new Base;
    v.push_back(pBase);
    
    for (auto elem: v)
        elem->vf();

    return 0;
}

````

````
Base::vf()
Derived::vf()
Base::vf()
Derived::vf()
Base::vf()
Program ended with exit code: 0
````

`Base` 클래스의 주소를 담는 자료형을 기반으로 벡터를 만들고, 그 안에, 내가 원하는 클래스를 담으면, `virtual` `override` 구조에 따라서 자동으로 멤버함수가 결정된다!

# Pure virtual function (순수 가상 함수)

`virtual` 을 선언할 때, 특별히 기본 Base 클래스에서는 기능을 정의하지 않고 파생 클래스에서 이 함수를 정의해서 사용할 때가 있는데 이때 선언하는 것이 **순수 가상함수** 이다.

````c++
virtual print() = 0;
````

순수 가상함수를 선언할 때는, base 클래스에서 이 함수의 작동이 없다는 것을 명시하기 위해서 뒤에 `=0` 을 추가로 달아준다.

이 표시가 있을 경우 우리는 파생 클래스로부터 이 함수를 필수적으로 정의해야한다.

또한 Base 클래스에서 위와 같이 선언했을 경우 **main 함수에서 우리는 저 함수를 사용할 수 없다.**

## abstract Class(추상 클래스)

내가 파생클래스들로 무언가를 만들어 사용하고 싶을 때, 그 윗단계에서 이 함수들에 대한 개략적인 것들을 적어둔 상위 집합의 클래스를 만들 수 있을 것이다.

이 때, 순수 가상함수들로 구성된 하나의 클래스를 **추상클래스** 라 부른다. 이렇게 관리할 경우 우리는 어떤 클래스들의 공통된 특징을 묶어서 관리할 수 있으므로 용이하다.
