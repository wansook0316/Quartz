---
title: this Pointer
thumbnail: ''
draft: false
tags:
- cpp
- this
- pointer
- class
- reference-type
- allocation
created: 2023-10-03
---

# Pass by Reference

내가 클래스를 만들고, 그 클래스를 바탕으로 객체를 만들었다. 이때, 이 클래스에 연결되어 있는, 함수를 메서드라 했다.

그렇다면 이 만들어진 객체를 클래스 밖의 함수에서 input으로 받는다면 어떻게 해야할까?

보통 클래스를 함수의 input parameter로 받을 때, reference로 받는다. 그 이유는 클래스가 저장되어 있는 메모리공간의 절약을 위해서이다.

## const

외부 함수에서 내가 만든 객체를 부를 때, callbyreference로 값을 가져왔다면, 함수 내에서 값이 변경될 수 있다.

그렇기 때문에 함수를 만들 때, input 파라미터 앞에 **const** 를 달아준다.

````c++
void print(const Point& pt){
    // 함수내용
}
````

그런데, 이 함수내에서 함수의 메서드를 사용한다면, 클래스를 정의하는데 있어서 추가적인 작업이 필요한데, const로 이 객체가 사용된다면 const라는 표시가 있는 method만 사용할 수 있다.

````c++
// class 정의
class Point {
private:
    int x;
    int y;
    
public:
    Point(): x(0), y(0) {}
    Point(int _x, int _y): x(_x), y(_y) {}
   
    // 외부함수에 객체를 const로 넘겼을 때 사용할 수 있는 함수
    int getX() const {return this->x;}
    int getY() const {return this->y;} 
    
// 외부 함수 정의
void print(const Point& pt){
    cout << pt.getX() << ", " << pt.getY() << endl << endl;
}

````

# Pointer to Object

클래스의 객체를 가리킬 때도 역시 포인터 변수를 선언했던 것과 똑같다.

## \*

우리가 예전에 포인터에 대해서 배울때, 해당 주소의 있는 값으로 점프 하라고 했을 때, `*` 를 사용하기로 했었다.

클래스 변수에 대해 이 것을 취하게 되면 클래스 객체 자체를 말하게 되고, 그제서야 우리는 멤버변수에 접근 할 수 있다.

````c++
#include <iostream>

using namespace std;

class Point{
public:
    int x;
    int y;
};

int main(){
    Point pt1;
    Point* ppt1;
    
    pt1.x = 1;
    pt1.y = 2;
    
    ppt1 = &pt1;
    
    cout << (*ppt1).x << ", " << (*ppt1).y << endl;
    
    return 0;
    
}
````

````
1, 2
````

## ->

이번에는 포인터에서 멤버변수로 접근하는 다른 방법을 배워보자.

````c++
#include <iostream>

using namespace std;

class Point{
public:
    int x;
    int y;
};

int main(){
    Point pt1;
    Point* ppt1;
    
    pt1.x = 1;
    pt1.y = 2;
    
    ppt1 = &pt1;
    
	cout << ppt1->x << ", " << ppt1->y << endl;
    
    return 0;
    
}
````

````
1, 2
````

***포인터 변수(주소가 담긴) -> 변수*** 이런식으로 적어주게 되면, "해당 포인터 주소로 가서, 변수 x의 값을 읽어!" 라는 뜻이 된다.

## 동적할당 new, delete

동적할당도 역시 할 수 있다.

동적할당은, 한 함수내에서 함수가 종료되기 전에도 값을 메모리 공간에 넣었다가 삭제할 수 있어 효율성을 높일 수 있는 방법이었다.

````c++
#include <iostream>

using namespace std;

class Point{
public:
    int x;
    int y;
};

int main(){
    Point* pt1, pt2;
    
    pt1 = new Point;
    pt2 = new Point[5];
    
    pt1.x = 1;
    pt1.y = 2;
    
    cout << ppt1->x << ", " << ppt1->y << endl;
    
    delete pt1;
    delete pt2;
    
    return 0;
}
````

### 주의사항

동적할당을 해제하지 않으면, 함수가 종료된 이후에도 남아있으므로! stream 객체를 사용했을 때와 마찬가지로 꼭! **delete로 할당을 해제** 해주어야 한다!

## this Pointer

**자기 자신의 주소값을 가져온다.**

우리가 class를 만들다보면, 특정 메서드를 사용했을 때, 자기자신을 내뱉어야 하는 경우가 발생한다. 이 것을 위해서 우리는 매서드 안에서 **this** 라는 포인터를 가지고 사용한다.

````c++
#include <iostream>

using namespace std;

class Point{
public:
    int x;
    int y;
    
    // 메서드를 호출하면 자신의 멤버변수에 값을 할당한다.
    void setXY(int _x, int _y){
        this->x = _x;
        this->y = _y;
    }
    
    // const 는 다른 함수에서 썼을 때 const로 받는 경우에 사용가능한 함수
    // 
    int getX() const {return this->x;}
    int getY() const {return this->y;}
};


````
