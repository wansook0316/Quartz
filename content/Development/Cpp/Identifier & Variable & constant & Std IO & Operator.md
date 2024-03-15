---
title: Identifier & Variable & constant & Std IO & Operator
thumbnail: ''
draft: false
tags:
- cpp
- identifier
- reserved-words
- keyword
created: 2023-10-03
---

## Identifier

### Reserved Words

![](Pasted%20image%2020231003213150.png)

### 사용가능 문자

* `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789`
* 예약어는 안된다.

## Variable Assignment

````
#include <iostream>

int main(){
    int x;		// 메모리에 integer 자료형을 넣을 공간만들고, 그 이름을 x라 하겠다.
}
````

## Variable, Constant

C와 같으므로 링크로 대체하겠다.
[Basic Types](Basic%20Types.md)

## Standard Input & Output

기본적으로 iostream 헤더파일을 가져와서 사용한다.
`iostream.h` 헤더 파일은, c++에 있는 입출력을 위한 헤더파일이다.
C언어의 `stdio.h` 와 같은 역할을 한다.

## 출력 (cout)

````c++
#include <iostream>

int main(){
    std::cout << “Please enter two intger values: “;
}
````

`namespace` 를 사용하면 다음과 같이 함수를 사용하는데 있어 `std::` 를 쓰지 않고 사용할 수 있다.

````c++
#include <iostream>

using namespace std;
int main(){
    cout << “Please enter two intger values: “;
}
````

## 입력 (cin)

````c++
#include <iostream>

int main(){
    std::cin >> value1 >> value2;
}
````

여러개를 한번에 입력받을 수 있다.

마찬가지로, `namespace` 를 사용하면 다음과 같이 함수를 사용하는데 있어 `std::` 를 쓰지 않고 사용할 수 있다.

````c++
#include <iostream>

using namespace std;
int main(){
    cin >> value1 >> value2;
}
````

## Operator

마찬가지로 C와 같으므로 링크로 대체하겠다.
[Operator](Operator.md)
