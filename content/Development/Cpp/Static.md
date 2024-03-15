---
title: Static
thumbnail: ''
draft: false
tags:
- cpp
- static
- class
created: 2023-10-03
---

# static Members

때때로는, 클래스의 객체들이 모두 공유하는 변수를 가지는 것이 용이하다. 전역변수와는 조금 다른 점이 있다

* **공통점** : 특정 함수나 클래스가 끝나고 나서 변수가 사라지지 않는다.
* **차이점** : 특정 클래스에 구속되어 있다.

이것을 구현하고 싶으면 **Static** 키워드를 붙여주면 된다.

특이한 점은, 이 변수를 사용하기 전에 초기화는, 클래스 내부에서 하지 않고, **전역변수처럼 main 함수 밖에서 한다.**

````cpp
#include <iostream>

using namespace std;

class Point{
private:
    int x;
    int y;
    // 선언!!
    static int numCreatedObjects;
    
public:
    // 초기화시 개수를 하나씩 늘려줌
    Point(): x(0), y(0){
        numCreatedObjects++;
    }
    Point(int _x, int _y): x(_x), y(_y) {
        numCreatedObjects++;
    }
    
    // public에서 이 숫자를 접근 할 수 있게 함수를 만들어줌.
    static int getNumCreatedObject(){ return numCreatedObjects; }
};

// 여기서 초기화를 해준다!
int Point::numCreatedObjects = 0;


int main(){
    Point pt1(1, 2);
    cout << pt1.getNumCreatedObject() << endl;
    
    Point pt2(3, 3);
    cout << pt1.getNumCreatedObject() << endl;
    cout << pt2.getNumCreatedObject() << endl;
    
    return 0;
}
````

````
1
2
2
````

pt1 과 pt2에 관련없이 생성된 객체의 개수만큼 반환되는 것을 알 수 있다.
