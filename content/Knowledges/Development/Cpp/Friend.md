---
title: Friend
thumbnail: ''
draft: false
tags:
- cpp
- friend
- keyword
created: 2023-10-03
---

# friend

두개의 클래스가 있을 때, 서로 만들어진 모든 멤버변수, 멤버함수를 공유하기 위해서 우리는 friend 라는 키워드를 사용할 수 있다.

a 객체가 b 객체를 친구로 선언한다면 b객체는 a객체의 모든 변수와 함수값을 갖다가 사용할 수 있다.

**private** 까지 사용 가능하다!!!!

````
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
    
    // SpyPoint에 Point 클래스의 모든 정보를 넘겨준다.
    friend class SpyPoint;
};

class SpyPoint{
public:
    void print_all_point_info(Point& pt){
        cout << "SpyPoint에 의해 출력됩니다." << endl;
        cout << "x : " << pt.x << endl;
        cout << "y : " << pt.y << endl;
    }
};


int main(){
    Point pt1(1, 2), pt2(3, 4);
    
    SpyPoint spyPt;
    spyPt.print_all_point_info(pt1);
    spyPt.print_all_point_info(pt2);

    return 0;
}
````

````
Output
SpyPoint에 의해 출력됩니다.
x : 1
y : 2
SpyPoint에 의해 출력됩니다.
x : 3
y : 4
Program ended with exit code: 0
````
