---
title: Header file
thumbnail: ''
draft: false
tags:
- cpp
- header
created: 2023-10-03
---

# Header File

## 왜 사용하는가?

C++ 코드를 작성하다가 보면, Class 내의 멤버변수, 멤버함수, 또 내가 만들어서 사용하는 사용자 정의 함수, main 함수 등 결국 어떤 프로그램을 동작하고 싶은 건지 전체적 구조를 알기 어렵다는 점이 있다.

따라서 우리는 class를 정의하는 것은 hpp 확장자에, 그리고 그 클래스에 해당되는 멤버함수들은 cpp 확장자에, 프로그램이 동작하는 main 에는 지저분한 것을 없애고 큰틀만 두는 것이다.

이 때, 내가 만들어 놓은 hpp 를 **\#include** 하고 사용하는 것이다.

여태껏 `<>` 안에 적었던 것은, 기본적으로 c++에서 제공하는 라이브러리 이며, 이제부터 내가 만들어 사용하는 녀석들은 `""` 안에 적어서 사용한다.

### main()

````c++
//
//  main.cpp
//  last_example
//
//  Created by 최완식 on 13/05/2019.
//  Copyright © 2019 최완식. All rights reserved.
//

#include <iostream>
#include <vector>
#include <string>
#include "CText.hpp"
#include "CFancyText.hpp"
#include "CFixedText.hpp"
using namespace std;

int main() {
    vector<Text*> v{ new Text("Plain"),
        new FancyText("Fancy1", "<", ">", "-"),
        new FixedText };
    
    Text* pText; 
    pText = new FancyText("Fancy2", "[", "]", "*");
    v.push_back(pText);
    pText = new Text("Plain2");
    v.push_back(pText);
    
    for (auto elem : v)
        elem->append("A");
    
    for (unsigned i = 0; i < v.size(); i++)
        cout << i << " : " << v.at(i)->get() << endl;
    
    
    return 0;
}

````

우리는, v라는 벡터안에 Text 객체, FanctText 객체, FixedText 객체를 넣을 것이다.

FancyText 클래스는 Text를 상속받아 추가적인 텍스트를 추가한다. FixedText 클래스는 Text를 상속받지만 일관된 출력을 한다. 마지막으로 모든 객체는 Text 클래스로 부터 append 라는 멤버함수를 상속받으니, for문을 돌면서 A라는 문자를 다 추가한다.

### CText.hpp

````c++
#pragma once
#include <string>
using namespace std;

// Text.h
class Text {
private:
    string text;
public:
    Text(string _t);
    virtual string get();
    virtual void append(string _extra);
};

````

pragma once는 한 번 #include 된 파일은 다시 열지 않도록 하는 명령어이다.

### CText.cpp

````c++
#include "CText.hpp"

// Text.cpp
Text::Text(string _t) : text(_t) {}
string Text::get() { return text; }
void Text::append(string _extra) { text += _extra; }

````

같은 이름을 가진 헤더파일을 cpp에서 include 하고 멤버함수를 작성한다.

### CFancyText.hpp

````c++
#pragma once
#include <string>
#include "CText.hpp"
using namespace std;

class FancyText : public Text {
private:
    
    string left_brac;
    string right_brac;
    string connector;
public:
   
    FancyText(string _t, string _lb, string _rb, string _con);
    string get() override;
    void append(string _extra) override;
};
````

### CFancyText.cpp

````c++
#include "CFancyText.hpp"

FancyText::FancyText(string _t, string _lb, string _rb, string _con) :
Text::Text(_t), left_brac(_lb), right_brac(_rb), connector(_con) {}


string FancyText::get() { return left_brac + Text::get() + right_brac; }


void FancyText::append(string _extra) {
    Text::append(connector + _extra);
}

````

### CFixedText.hpp

````c++
#include "CText.hpp"
using namespace std;

class FixedText : public Text {
public:
    FixedText();
    void append(string _extra) override;
};
````

### CFixedText.cpp

````c++
#include "CFixedText.hpp"


FixedText::FixedText() : Text::Text("FIXED") {}
void FixedText::append(string _extra) {
    //NOOP
}
````

### 다시 main()

````c++
#include <iostream>
#include <vector>
#include <string>
#include "CText.hpp"
#include "CFancyText.hpp"
#include "CFixedText.hpp"
using namespace std;

int main() {
    vector<Text*> v{ new Text("Plain"),
        new FancyText("Fancy1", "<", ">", "-"),
        new FixedText };
    
    Text* pText; 
    pText = new FancyText("Fancy2", "[", "]", "*");
    v.push_back(pText);
    pText = new Text("Plain2");
    v.push_back(pText);
    
    for (auto elem : v)
        elem->append("A");
    
    for (unsigned i = 0; i < v.size(); i++)
        cout << i << " : " << v.at(i)->get() << endl;
    
    
    return 0;
}

````

### Output

````
0 : PlainA
1 : <Fancy1-A>
2 : FIXED
3 : [Fancy2*A]
4 : Plain2A
Program ended with exit code: 0
````

# Binding 의 시각화

`vtable` 이란 멤버함수를 동적으로 할당하는 변수이다. 어떤 객체를 넣느냐에 따라 다른 멤버함수가 할당되는 것을 볼 수 있다.

![](Pasted%20image%2020231003220020.png)
