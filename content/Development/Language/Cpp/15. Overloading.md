---
title: Overloading
thumbnail: ''
draft: false
tags:
- cpp
- overloading
created: 2023-10-03
---

# Overloading

같은 함수이름, 혹은 연산자를 사용하면서, 하나 이상의 정의가 가능한 방법이다.

## Function Overloading

연산자 오버로딩과 방식이 동일하다. 밑에서 예를 든것을 보고 이해해보자.

## Operator Overloading

````c++
Point operator +(Point& pt){
        Point result(this->x + pt.x, this->y + pt.y);
        return result;
    }
````

````c++
pt1(1, 2);
pt2(3, 4);
pt1 + pt2;
// 여기서 pt1은 + 연산자를 호출했을 때, 기본적으로 들어가는 input parameter가 된다.
// 이녀석이 호출했다고 컴파일러는 처리한다.
// 따라서 이녀석이 호출했기 때문에 + 연산자에 안에서
// 호출한 녀석의 멤버변수를 가지고 쓰기 위해서는 this 포인터로 접근하면 된다.
````

````
4, 6
````

이 연산자는, Point 객체를 리턴하고 '+' operator 에 대해서, 오른쪽에 Point 변수를 reference로 받는다.

받은 Point 객체에 대해, result 라는 Point 객체를 만들고, 초기값에 pt1의 멤버변수 x와 나중에 나온 pt2의 x를 더한 값을 result의 멤버변수 x로 할당한다.

같은 원리로 result의 멤버변수 y도 할당한다. 그리고 Point 객체 result를 반환한다.

````c++
Point operator = (Point& pt){
        this->x = pt.x;
        this->y = pt.y;
        return (*this);
    }
// 연산자의 왼쪽에 있는 객체가 호출했다고 생각한다.
// 그때의 그 객체를 나타내는 게 여기서 this 포인터.
// 그래서 호출한 객체의 x에 받은 input의 x를 할당한다.
// 같은 방식으로 y도 수행한다.
````

````c++
pt1(1, 2);
pt2(3, 4);
pt3 = pt1 + pt2;
// 오른쪽에 계산된 값을 왼쪽에 할당한다.
````

### 외부에서 정의한 operator overloading

클래스 내부에서 모든 연산자 오버로딩을 하기 힘들 수 있다. 왜냐하면, 다른 객체를 클래스 내부에서 정의하게 되기 때문이다.

이렇게 될 경우 코드가 지저분해지고, 의존성이 생길 수 있다.

따라서 우리는 클래스 외부에서 함수를 정의하고 이것이 클래스와 연관 되어 있다고 알려주는 방식을 사용한다.

이것은 **friend** 에서 배워보기로 하고 일단은, 외부에서 정의하는 방법을 알아보자.

````c++
ostream& operator <<(ostream& cout, Point& pt){
    cout << pt.getX() << ", " << pt.getY();
    return cout;
}
````

기본적으로 operator는 왼쪽과 오른쪽 두개의 파라미터를 받는다. 

첫번째 파라미터는, 연산자 왼쪽에 놓인 객체, 두번째 파라미터는, 연산자 오른쪽에 놓인 객체를 말한다.

이 연산자 오버로딩을 말로 설명해보면, 이 연산자는 ostream의 객체를 reference 로 리턴한다. `<<` 연산자를 사용하며, 이 왼쪽에는 ostream 의 객체를 cout이란 이름으로 callbyreference한다.

오른쪽에는 Point 객체를 pt라는 이름으로 callbyreference 한다.

그렇게 했을 때, cout으로 각각을 출력하고, cout 객체를 리턴한다.

여기서, 우리가 cout 객체로 여러번 출력이 가능한 이유는, **cout 객체를 반환** 하기 때문이라는 것을 알 수 있다.

같은 원리로, int, double과 같은 모든 자료형에 대해 **연산자 오버로딩** 의 방식으로 위와 같이 선언되어 있다.

함수 오버로딩도 위와 같은 방식으로 구현되어 있다.

# 여기까지 구현한 전체 코드

````c++

#include <iostream>

using namespace std;

class Point{
private:
    int x;
    int y;
    
    
public:
    Point(): x(0), y(0){}
    Point(int _x, int _y): x(_x), y(_y) {}
    
    void setXY(int _x, int _y){
        this->x = _x;
        this->y = _y;
    }
    
    int getX() const { return this->x; }
    int getY() const { return this->y; }
    
    Point operator + (Point& pt){
        Point result(this->x + pt.x, this->y + pt.y);
        return result;
    }
    
    Point operator - (Point& pt){
        Point result(this->x - pt.x, this->y - pt.y);
        return result;
    }
    
    Point operator = (Point& pt){
        this->x = pt.x;
        this->y = pt.y;
        return (*this);
    }
    
    
};

void print(const Point& pt){
    cout << pt.getX() << ", " << pt.getY() << endl << endl;
    // 만약 x, y를 public 으로 선언했다면 다음도 같은 코드
    // cout << pt.x << ", " << pt.y << endl << endl;
    
}

ostream& operator << (ostream& cout, Point& pt){
    cout << pt.getX() << ", " << pt.getY();
    return cout;
}



int main(){
    
    // print 사용, const
    Point pt1(1, 2);
    print(pt1);
    
    
    
    // 동적할당, 해제, new, delete
    Point* pPt2 = new Point(10,20);
    print(*pPt2);
    
        // -> 사용
        cout << pPt2->getX() << ", " << pPt2->getY() << endl << endl;
    
    delete pPt2;
    
    
    // 연산자 오버로딩
    Point pt3(5, 6), pt4(7, 8);
    Point pt5 = pt3 + pt4;
    cout << pt3 << endl;
    cout << pt4 << endl;
    cout << pt5 << endl;
    
    
    return 0;
}

````
