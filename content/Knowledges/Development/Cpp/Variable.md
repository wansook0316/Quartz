---
title: Variable
thumbnail: ''
draft: false
tags:
- cpp
- variable
- global
- local
created: 2023-10-03
---

## Local, Global Variables

### Local Variables

* 함수 안에서만 동작하고 함수가 끝나면 메모리에서 삭제된다.
* `main` 함수안에서 계속 살아있는 녀석이 아니다!
* **`main` 함수**도 **함수** 이기 때문에 `main` 함수 종료후 `main` 함수 안에서 선언된 변수는 사라진다.

### Global Variables

* 함수가 실행되기 전에 선언되는 변수
* 프로그램의 주가 되는 `main` 함수가 끝나기 전까지 항상 살아있는 변수이다.

### Example #1

````c++
#include <iostream>

using namespace std;
int x = 10;				// 전역변수

int makeDouble(int param){		// 4
    int x;				// 5 	makeDouble 함수 안의 지역변수
    cout << "02: " << x << '\n';	// 6
    
    x = param;				// 7
    cout << "03: " << x << '\n';	// 8
    return param * 2;			// 9
}					// 10

int main(){				// 1	
    cout << "01: " << x << '\n';	// 2
    
    x = makeDouble( x );		// 3 // 11
    cout << "04: " << x << '\n';	// 12
    return 0;				// 13
}
````

````c++
출력
// [Output]
// 01: 10
// 02: -1031346592 (Garbage)
// 03: 10
// 04: 20
````

함수안에 적어둔 숫자 순서대로 작동한다. 실행절차를 적어보자.

여기서 주의깊게 봐야하는 것은 값을 같다고 놨을 때, **복사** 한다는 점. 그리고 **전역 변수, 지역 변수** 가 어떻게 돌아가는지에 대한 **구조** 이다.

1. `main` 함수 안으로 들어간다.
1. 전역변수 `x` 를 출력한다.
   * `01: 10`
1. 전역 변수 `x`의 10을 `makeDouble` 함수로 복사한다.
1. 그 값을 `makeDouble` 함수의 `param` 으로 복사한다.
1. `makeDouble` 함수의 지역 변수 `x` 를 만든다. 값은 저장되지 않았다.
1. 이 값을 출력한다. 값을 할당하지 않았으므로 쓰레기값이 출력된다.
   * `02: -1031346592 (Garbage)`
1. `makeDouble` 함수의 `x` 에 넘어온 `param` 값을 복사한다.
1. 복사된 `x` 를 출력한다.
   * `03: 10`
1. `param * 2` 값을 반환한다. `param` 은 `makeDouble` 함수가 아직 끝나지 않았으므로 살아있다.
1. 함수가 종료되고, `makeDouble` 의 `x` , `param` 은 사라지고 `param * 2` 만 임시 저장소에 저장된다.
1. 반환된 `param * 2` 을 `main` 함수 `x` 에 넣는다. `param * 2` 은 사라진다.
1. `main` 함수의 `x` 를 출력한다.
   - `04: 20`
1. `main` 함수가 끝나고 0 을 반환한다.
1. 프로그램이 종료된다.

### Example #2

위의 예제를 이해했다면, 아래 코드의 결과값도 이해될 것이다.

````c++
#include <iostream>

void increment(int x){
    std::cout << "함수 증가전, x = " << x << '\n';
    x++;
    std::cout << "함수 증가후, x = " << x << '\n';
}

int main(){
    int x = 5;
    std::cout << "증가전, x = " << x << '\n';
    increment(x);
    std::cout << "증가후, x = " << x << '\n';
}
````

````c++
출력
// 증가전, x = 5
// 함수 증가전, x = 5
// 함수 증가후, x = 6
// 증가후, x = 5
````

`increment` 함수 통과후 사용되었던 지역변수는 모두 사라졌기에, `main` 함수에서의 `x` 는 그대로 5 이다.

만약 `main` 함수에서 `x` 값을 변화시키고 싶다면, `increment` 함수에서 반환값을 만들어 `x` 에 대입하는 방향으로 코드를 썼어야 했다.
