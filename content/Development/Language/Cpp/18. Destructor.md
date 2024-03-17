---
title: Destructor
thumbnail: ''
draft: false
tags:
- cpp
- destructor
created: 2023-10-03
---

# Destructor

소멸자는 특별한 멤버함수이다. **객체가 생성되고, 소멸될 때 호출**된다.

소멸자의 목적은, 컴퓨팅 자원의 절약에 있다. 객체가 생성되고 계속 남아있다면 메모리 자원을 많이 소모하게 된다.

생성자와 마찬가지로, 굳이 적어주지 않는다면, 기본적으로 소멸자는 호출되며, 만약 내가 적어준다면 객체가 생성되고 소멸할 때마다 호출되어 내가 원하는 작업을 수행한다.

내가 소멸자를 명시적으로 적어준다면 기본적으로 호출된 소멸자는 작동하지 않고, 내가 적어준 녀석만 작동한다.

### Example

**생성자** : new, file open
**소멸자** : delete, file close

````cpp
class Point{
private:
    int x;
    int y;
    
    
    
public:
    Point(): x(0), y(0){}
    Point(int _x, int _y): x(_x), y(_y) {}
    
    ~Point(){
        cout << "소멸되었습니다." << endl;
    }
};

int main(){
    Point pt1(1,2);
    
    return 0;
}

````

````
Output
소멸되었습니다.
````
