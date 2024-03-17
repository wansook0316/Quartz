---
title: Array & Vector
thumbnail: ''
draft: false
tags:
- cpp
- Array
- vector
- static-array
- dynamic-array
- matrix
created: 2023-10-03
---

## What is Array?

**직접적으로 값을 순차적으로 매핑한다.** C언어에서 오래된 기술이고, 객체가 아니다.

처음에 배열의 크기를 지정하고 선언하는 정적 배열(static Array)이 있고, 배열의 크기를 유동적으로 조절할 수 있는 동적 배열(Dynamic Array)이 있다.

배열도 함수 포인터와 마찬가지로, 특정 배열을 내가 선언하게 되면 배열의 이름으로 선언해준 변수는 **포인터** 이다.

## 정적배열 (Static Array)

### 메모리 공간에서 배열 원소의 배치

````c++
#include <iostream>

using namespace std;

int main(){
    int ary[3] = {1, 2, 3};
    
    cout << ary << endl;
    cout << endl;
    
    cout << ary[0] << endl;
    cout << ary + 0 << endl;
    cout << *(ary+0) << endl;
    cout << endl;
    
    cout << ary[1] << endl;
    cout << ary + 1 << endl;
    cout << *(ary+1) << endl;
    cout << endl;
    
    cout << ary[2] << endl;
    cout << ary + 2 << endl;
    cout << *(ary+2) << endl;
    
    return 0;
}
````

````
0x7ffeefbff4fc

1
0x7ffeefbff4fc
1

2
0x7ffeefbff500
2

3
0x7ffeefbff504
3
Program ended with exit code: 0
````

각각의 주소를 간단하게 나타내고, 이것을 표로 나타내보면,

![](Pasted%20image%2020231003214438.png)

### Array element 접근, 출력 방법

````c++
#include <iostream>

using namespace std;

int main(){
    int ary[] = {1,2,3,4,5};
    
    for(int i = 0; i < 5; i++){
        cout << a[i] << endl;
    }
    
    return 0;
}
````

이번에는 이 배열을 함수의 인자로 받아 출력해주는 `print` 함수를 만들어보자.

````c++
#include <iostream>

using namespace std;

void print(const int *ary, int length){		// 이 함수 내에서 ary는 변화하지 않음을 의미함.
    for(int i = 0; i < length; i++){
        cout << *(ary + i) << "\t";
    }
    cout << endl;
    
}



int main(){
    int ary[] = {1,2,3,4,5};
    print(ary, 5);
   
    return 0;
}
````

이번에는 이 배열을 함수의 인자로 받아 모든 요소의 합을 구해주는 `sum` 함수를 만들어보자.

````c++
#include <iostream>

using namespace std;

int sum(int* begin, int* end){	// 인자로 넘긴 값이 주소이기 때문에 포인터 변수로 받아준다. 
    int result = 0;
    for(int* i = begin; i < end; i++){		// 포인터 변수의 시작점부터 루프를 돌려야 하므로
        									// i도 포인터 변수로 잡아준다.
        result += *i;						
    }
    
    return result;
}

int main(){
    int ary[] = {1,2,3,4,5};
    
    int* begin, *end;	// int 자료형의 주소를 받는 포인터 변수 두개를 선언한다.
    begin = ary;		// 배열의 시작주소를 포인터 변수 begin에 받는다.
    end = ary + 5;		// 배열의 끝주소를 end에 받는다.
    
    cout << sum(begin, end) << endl;	// 두 주소를 넘겼을 때, 출력 값을 받아 화면에 띄운다.
    
    return 0;
}
````

while 문도 한번 사용해보자.

````c++
#include <iostream>

using namespace std;

int sum(int* begin, int* end){
    int* curr;
    curr = begin;
    int result = 0;
    
    while(curr != end){
        result += *(curr);
        curr++;
    }
    
    return result;
}

int main(){
    int ary[] = {1,2,3,4,5};
    
    int* begin, *end;    // int 자료형의 주소를 받는 포인터 변수 두개를 선언한다.
    begin = ary;        // 배열의 시작주소를 포인터 변수 begin에 받는다.
    end = ary + 5;        // 배열의 끝주소를 end에 받는다.
    
    cout << sum(begin, end) << endl;    // 두 주소를 넘겼을 때, 출력 값을 받아 화면에 띄운다.
    
    return 0;
}

````

지금까지 진행한 예제에서 `ary[]` 를 선언할 때, 크기가 정해진 녀석을 넣어주었다.

이런 것을 정적 배열이라하고, 배열의 크기를 조정할 수 없다.

````c++
#include <iostream>

using namespace std;

int main(){
    const int length = 5;
    int ary[length];
    
    return 0;
}
````

정적 배열은 이렇게 배열의 크기를 선언하는 변수 length를 만들때, 이 값은 constant로 만들어 주어야 한다.

만약 `int length = 5` 와 같이 선언해준다면, 값이 바뀔 수 있으므로 오류를 뱉는다.

## 동적배열 (Dynamic Array)

````c++
#include <iostream>

using namespace std;

int main(){
    int size;
    
    cout << "Size : ";
    cin >> size;
    int* dyary;
    dyary = new int [size];        // 동적 배열 생성
    
    // 입력 받기
    for(int i = 0; i < size; i++){
        cin >> dyary[i];
    }
    
    // 출력 하기
    int *curr = 0;
    int* begin, *end;
    begin = dyary;
    end = dyary + size;
    
    curr = begin;
    
    while(curr != end){
        cout << *(curr) << "\t";
        curr++;
        
    }
    cout << endl;
    
    // 배열 삭제하기
    delete[] dyary;
    
    return 0;
}
````

````
Output
Size : 3
1
2
3
1	2	3	
Program ended with exit code: 0
````

## Matrix 만들기

````c++
#include <iostream>

using namespace std;

int main(){

    double dMatrix[2][3] = {    {1,2,3},
        {4,5,6}
    };
// 또는 이렇게 선언해도 된다.
//    dMatrix[0][0] = 1; dMatrix[0][1] = 2; dMatrix[0][2] = 3;
//    dMatrix[1][0] = 4; dMatrix[1][1] = 5; dMatrix[1][2] = 6;

    for (int row = 0; row < 2; row++){
        for(int col = 0; col < 3; col++){
            cout << dMatrix[row][col] << "\t";
        }
        cout <<  endl;
    }



    return 0;
}

````

### 2차원 배열에서 포인터의 관계

````c++
p[i]  =  *(p+i);

p[j][i] = *(*(p+j) + i)
````

결국 1차원 메모리 공간에 나열되어 있는 요소들의 **주소값들의 관계를 정의해 놓은 것이다.**

## 문자열에서 문자 찾기

````c++
#include <iostream>

using namespace std;

bool find_char(const char *s, char c){
    
    while(*s != '\0'){
        if(*s == c)
            return true;
        s++;
    }
    
    return 0;
}


int main(){
    
    const char* ch = "phrase";
    
    for (char c = 'a'; c <= 'z'; c++){
        cout << "[" << c << "] is ";
    
    
        if(!find_char(ch, c))
            cout << "Not ";
        else
            cout << "    ";
        cout << "in " << ch << endl;
    }
    
    return 0;
}

````

1. main 에서 `"phrase"` 라는 문자열의 첫번째 주소를 char 형 포인터 변수 ch에 담는다.
1. 반복문 안에서 선언된 `char c` 는 a~z 의 문자값을 가지는데,
1. 만약 이 문자열이 `"phrase"` 안에 있다면 공백을, 없다면 `Not` 을 출력하도록 만들자.
1. 그럼 해당 문자열이 있는지 없는지를 판단해줄 함수를 밖에 만들건데,
1. 이때 입력 파라미터를 문자열의 시작 주소를 가지고 있는 `ch` 와 검사할 문자 `c` 를 넘겨주자.
1. `ch` 는 문자열 포인터 변수이므로 `char*` 로 선언해서 받아주고,
1. `c` 는 복사해서 받아오자.
1. 받아온 주소 `s` 의 값으로 점프한 `*s` 는 문자열의 제일 첫번째 값인 `p` 를 나타내고 있을 것이다.
1. 이제 우리는 이 값이 NULL(`'\0'`) 이 아니면 돌아가는데,
1. 만약에 추가로 입력받은 `c` 의 값과 같다면 TRUE를, 아니면 FALSE를 반환한다.
1. 이제 출력값에 따라 제어하면 된다.

추가로 문자열이 구성될 때 컴퓨터는 마지막 `'\0'` NULL 을 기준으로 구분한다.

## What is Vector Container?

* 메모리의 블락을 관리해주는 객체
* 자동으로 메모리를 할당해주는 배열
* 벡터에 들어가는 자료형은 모두 동일해야 한다.

![](Pasted%20image%2020231003214518.png)

### Vector 선언 방법

1. 헤더파일 추가
1. namespace 추가 // std:: 사용
1. 벡터 선언

````c++
#include <iostream>

using namespace std;

int main(){
    
    vector<int> vec_a;	// 이름만 선언함
    vector<int> vec_b(10);	// 최초 크기 10으로 선언함
    vector<int> vec_c(10, 8);	// 최초 크기 10, 초기화 8로 선언함
    vector<int> vec_d{10, 20, 30, 40}	// 4개 요소로 벡터를 만듦
    
    return 0;
    
}
````

![](Screen%20Shot%202023-10-03%20at%209.45.25%20PM.png)

### 벡터 인덱싱

배열과 동일하게 `0~size -1` 의 범위를 가진다.

## Vector primary Method

````c++
v.front();			// 맨 앞 값을 읽어온다.

v.back();			// 맨 뒤 값을 읽어온다.

v.push_back();		// 맨 뒤에 값을 집어 넣는다.

v.pop_back();		// 맨 뒤값을 읽어오고 지운다.

v.at(index_value);	// v[index_value]와 동일하다.
					// 하지만 메소드를 사용하는 것이 쓰면서 생기는 오류를 방지하는데 유용하다.

v.size();			// 벡터의 크기를 가져온다.
					// 함수의 반환값이 unsigned int 이므로 이 값을 쓰는데 있어서
					// unsigned int로 받아주어야 한다.




````

### Vector Example

````c++
#include <iostream>
#include <vector>

using namespace std;

void print(vector<int>& v){
    
    for(unsigned int i = 0; i < v.size(); i++){
        cout << v[i] << "\t";
        // 또는
        // cout << v.at(i) << "\t";
    }
    cout << endl;
}

int main() {
    
    vector<int> v{10, 20, 30};
    
    cout << "값 바꾸기" << endl;
    cout << v[0] << ", " << v[1] << endl;
    v[0] = 1000;
    cout << v[0] << ", " << v[1] << endl;
    
    cout << "push_back" << endl;
    v.push_back(2000);
    print(v);
    
    cout << "pop_back" << endl;
    v.pop_back();
    print(v);
    
    return 0;
}
````

````
Output
값 바꾸기
10, 20
1000, 20

push_back
1000	20	30	2000	

pop_back
1000	20	30	
Program ended with exit code: 0
````

### 값 넣기/ 출력하기 다른 방법

````c++
int main(){
    vector<double> v(3);
    
    for (double elem : v)
        cin >> elem;
    
    // v 벡터 값을 복사한후 하나씩 출력함
    for (double elem : v)
        cout << elem << '\t';
    cout << endl;
    
    // v 벡터 값을 reference 해서 출력함
    for (double& elem : v)
        cout << elem << '\t';
    cout << endl;
    
    return 0;
}
````

### 벡터를 사용한 소수 찾기

````c++
#include <iostream>
#include <vector>

using namespace std;

bool is_prime(int num){
    if (num < 2)
        return false;
    for(int i = 2; i < num; i++){
        if(num % i == 0)
            return false;
    }
    return true;
    
}

vector<int> primes(int low, int up){
    vector<int> vec;
    
    for(int i = low; i<= up; i++){
        if(is_prime(i)){
            vec.push_back(i);
        }
    }
    return vec;
}

int main(){
    int lower = 10, upper = 100;
    
    vector<int> v_prime = primes(lower, upper);
    for(int elem : v_prime)
        cout << elem << '\t';
    cout << endl;
    
    return 0;
}
````

````
Output
11	13	17	19	23	29	31	37	41	43	47	53	59	61	67	71	73	79	83	89	97	
Program ended with exit code: 0
````

## 벡터를 사용해 매트릭스 만들기

````c++
#include <iostream>
#include <vector>

using namespace std;

int main(){
    // vector<int>를 자료형으로 가지는 벡터를 선언
    // 가장 바깥 쪽에 있는 벡터는 크기 2, 그리고 안의 요소는 크기가 3인 vector<int>로 초기화한다.
    vector<vector<int>> v(2, vector<int>(3));
    
    // 입력
    for (vector<int>& row : v)
        for(int& elem : row)
            cin >> elem;
    
    // 출력
    for(vector<int>& row : v){
        for(int& elem : row){
            cout << elem << '\t';
        }
        cout << endl;
    }
    
    return 0;
}
````
