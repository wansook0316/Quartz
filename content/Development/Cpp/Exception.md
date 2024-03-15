---
title: Exception
thumbnail: ''
draft: false
tags:
- cpp
- exception
- error
- try-catch
created: 2023-10-03
---

# 예외 처리

예외 처리를 사용하므로써 알고리즘이 마주할 수 있는 예외 상황에 대해 코드를 분리할 수 있다. 이 결과 알고리즘에 보다 집중할 수 있다.

# 에러를 만들어 보자.

````c++
int main(){
    vector<int> v{1, 2, 3, 4}
    int num;
    cin >> num;
    
    cout << v.at(num) << endl;
    
    return 0;
}
````

````
Output
10
=> Error
````

vector size보다 큰 index를 넣을 경우 **프로그램이 멈춰버린다.**

이렇게 될 경우 만드는 사람 입장에서는 어느 부분 때문에 에러가 났는지 찾기 어렵다.

# Try/catch

그래서 우리는 예외를 처리하는 다음과 같은 구문을 활용한다.

````c++
int main(){
    vector<int> v{1, 2, 3, 4};
    int num;
    cin >> num;

    try{
        cout << v.at(num) << endl;

    }
    catch(exception& e){
        cout << e.what() << endl;
        cout << "인덱스 오류가 발생!" << endl;
    }
    
    cout << "[program is still running!]" << endl;

    return 0;
}

````

````
Output1
알고 싶은 인덱스를 입력해주세요 :3
4
[program is still running!]
Program ended with exit code: 0
````

````
Output2
알고 싶은 인덱스를 입력해주세요 :10
vector
인덱스 오류가 발생!
[program is still running!]
Program ended with exit code: 0
````

인덱스를 넘어가는 값을 입력했을 때, 이 오류를 **캐치**해서 예외를 처리해 주었다. 또한, 예외처리 구문을 통해서, ***프로그램이 제대로 마무리 되었다는 사실을 알 수 있다!*** 그렇기 때문에 예외를 통과했기 때문에 문제가 없음을 판단할 수 있다.

## 사용법

1. 예외를 throw 할 것 같은 곳에 `try` block으로 싼다.
1. 예외가 발생 했을 경우에만 발생할 코드를 `catch` block 으로 싼다.
1. `exception& e` 는 프로그램이 던지는 에러를 받아주는 객체이다.
1. `try/catch` 구문은 `if` 문 처럼 state가 한줄이더라도 꼭 `{}` 로 감싸줘야 한다.

# std::exception class

예외를 담당하는 기본 c++제공 클래스이다. 모든 예외 처리 클래스는 이 클래스를 상속받아서 작성된다.

따라서 다형성의 원리에 의해 어떤 에러를 던지더라도, 추상클래스인 **exception class** 로 받을 수 있다.

## Member functions

![](Pasted%20image%2020231003220509.png)

이중에서 `what()` 이라는 함수가 중요하게 사용되는데, 어떤 예외이냐에 따라 이 `what()` 함수가 다르게 구성된다. 즉, override 를 통해 재정의해서 사용한다!

여기서는 사실 다른구문을 쓰지만 그건 밑에서 알아보자.

## vector container 함수를 사용하는 이유

위의 예에서, vector의 index로 접근하는 부분을 바꿔보자.

````c++
int main(){
    vector<int> v{1, 2, 3, 4};
    int num;
    cin >> num;

    try{
        // 이 부분!
        cout << v[num] << endl;

    }
    catch(exception& e){
        cout << e.what() << endl;
        cout << "인덱스 오류가 발생!" << endl;
    }
    
    cout << "[program is still running!]" << endl;

    return 0;
}


````

````
Output
알고 싶은 인덱스를 입력해주세요 :3
4
[program is still running!]
Program ended with exit code: 0
````

````
알고 싶은 인덱스를 입력해주세요 :10
1
[program is still running!]
Program ended with exit code: 0
````

기존 에는 10을 넣었을 경우 에러를 출력했는데, 이번에는 에러가 뜨지 않는다 왜 그럴까?

이건 클래스 내부에서 에러를 발생하는 `exception` 객체를 `throw` 해주지 않아서 그렇다.

# 클래스에서 예외 처리 구문 만들기

## 예외 처리가 필요한 함수 만들기

위에서는 `try/catch` 구문을 사용해 vector container 에서 발생하는 예외처리를 어떻게 받아서 표현하는지 알아보았다.

그렇다면 내가 함수나 클래스를 만들 때, 어떤 부분에서 에러가 날지를 규명해주는 것이 필요하다.

여기서는, file을 읽어, 벡터로 넣어주는 함수를 만들어 보았다. 이때 만약 파일을 읽지 못할 경우 에러를 throw 하도록 만들었다.

## throw 구문

````c++
vector<int> load_vector(string filename){
    ifstream fin(filename);
    if(!fin){
        // 예외 처리 throw
        throw FileNotFoundException(filename);
    }

    int num, value;
    vector<int> result;

    fin >> num;
    for(int i = 0; i < num; i++){
        fin >> value;
        result.push_back(value);
    }

    return result;
}
````

### 구문해석

* 예외 처리 throw
* 특정 상황에 에러가 날 경우 우리는 에러를 던져줘야 한다.
* 이때 사용하는 것이 **throw** 구문이다.

## 예외 처리 클래스 만들기

그렇다면 `FileNotFoundException` 은 예외처리를 담당하는 클래스이므로,

위에서 말했듯, 예외 처리 클래스는 `std::exception` 클래스를 상속해서 만든다.

````c++
class FileNotFoundException : public exception {
    string message;
public:
    // 1.
    FileNotFoundException(string _m): message("File not Found : " + _m){}

    // 2.
    virtual const char* what() const throw() {
        // 3.
        return message.c_str();

    }
};

````

### 구문 해석

1. 생성자(constructor)
   * member variable 로 갖고 있는, message에 담아준다.
1. `what()` override 하기.
   * virtual
     * 이 `FileNotFoundException` 클래스를 상속받는 다른 클래스가 있을 수 있기 때문에 써주었다.
   * const
     * `what()` 함수의 return type은 `const char*` 이다.
     * 즉, 문자열을 리턴 값으로 갖는다는 것인데,
     * 이 리턴 값은 변할 수 없으므로 `const` 를 적어 명시적으로 써준다.
   * what()
     * override를 수행할 함수의 이름이다.
   * const
     * 외부 함수에서 만든 객체를 불러올 때, `callbyreference` 로 가져올 경우 값을 변화 시킬 수 있다.
     * 그래서 우리는 `void print(const 클래스이름& p)` 이런식으로 가져오는데, 이때 입력 파라미터의 값을 변화시키지 않으면서 reference 하겠다는 의도에서 const를 적게되면, 내가 만든 class 에서도 const를 적은 함수만 사용이 가능하다.
     * **즉, 외부에서 const 상태로 사용하는 함수를 의미한다.**
   * **throw()**
     * 위에서 설명한 이 부분이 다른데, exception 클래스를 상속받을 때, `what()` 함수를 `override` 할때는, `throw()` 를 사용한다.
1. string 인 `message` 를 `char` 로 만들어주자.

## main 에서 try/catch 구문

이제 함수도 만들고, 예외처리 클래스도 정의했으니, `try/catch` 구문을 사용해서 나타내보자.

````c++
int main(){

    try{
        vector<int> v = load_vector("values.dat");
    }
    
// 1.   catch(FileNotFoundException& e)
    catch(exception& e){
        // 2.
        cout << e.what() << endl;
    }

    return 0;
}
````

### 구문해석

1. 주석처리한 부분을 보면, 원래 `catch` 구문에서는 예외 처리 객체를 받아줘야 한다.
   * 즉, `catch(FileNotFoundException& e)` 이런식으로 써줘야 하는데, `catch(exception& e)` 이렇게만 써줬다.
   * 이 이유는 위에서 설명한 것과 같이 **다형성** 때문이다.
1. 에러가 발생했을 때, 이 에러가 어떤 에러인지 `what()` 메서드로 보여준다.

## 전체 코드

````c++
#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

class FileNotFoundException : public exception {
    string message;
public:
    FileNotFoundException(string _m): message("File not Found : " + _m){}

    const char * what() const throw() {
        return message.c_str();

    }
};


vector<int> load_vector(string filename){
    ifstream fin(filename);
    if(!fin){
        throw FileNotFoundException(filename);
    }

    int num, value;
    vector<int> result;

    fin >> num;
    for(int i = 0; i < num; i++){
        fin >> value;
        result.push_back(value);
    }

    return result;
}


int main(){

    try{
        vector<int> v = load_vector("values.dat");
    }
    catch(exception& e){
        cout << e.what() << endl;
    }

    return 0;
}

````

# try/catch 구문의 작동 방식

## Findint Nearest `catch` Statement

![](Pasted%20image%2020231003220923.png)

여러개의 함수에 `exception` 과 `try/catch` 구문을 걸어놓을 경우, 가장 근접한 `catch` 구문을 찾아가서 실행한다.

## 예제

````c++
#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

// double throw
void filter(vector<int>& v, int i){
    v.at(i)++;
}

void compute(vector<int>& a){
    for(int i = 0; i < 6; i++){
        try{
            filter(a, i);
        }
        catch(exception& ex){
            cout << "******1번 catch********" << endl;
            cout << "반복문이 중간에 멈췄습니다." << endl;
            cout << "when i =" << i << endl;
            cout << "**********************" << endl;
//            throw ex;
        }
    }
}

int main(){
    vector<int> list {10,20,30,40,50};
    try{
        compute(list);
    }
    catch(exception& e){
        cout << "******2번 catch******" << endl;
        cout << "에러가 발생했습니다." << endl;
        cout << e.what() << endl;
        cout << "**********************" << endl;
    }

    cout << "프로그램 종료" << endl;
}


````

````
Output
******1번 catch********
반복문이 중간에 멈췄습니다.
when i =5
**********************
프로그램 종료
Program ended with exit code: 0
````

### 구문 해석

1. main 함수
   * main 함수를 보게 되면, compute 함수를 호출하게 된다.
1. compute 함수
   * compute 함수는 filter 함수를 호출한다.
1. filter 함수
   * filter 함수를 수행하는 도중, i의 값이 size를 넘는 순간이 오고, exception 객체를 throw 한다.
1. 프로그램은 왔던 길을 되돌아가며 가장 근접한 catch 문을 찾는다.
   * 이 경우 compute 함수에 있기 때문에, 이 catch 문을 실행한다.
1. main 함수로 돌아올 때는 throw가 다 해소됐고, 돌아오는 throw가 없으므로 catch 함수는 실행되지 않는다.

# double throw(Re-thorwing)

그러면, main으로 돌아올 때도, 객체를 던져주면, 여러번의 catch 구문을 실행 시킬 수 있지 않을까?

## 예제

````c++
#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

// double throw
void filter(vector<int>& v, int i){
    v.at(i)++;
}

void compute(vector<int>& a){
    for(int i = 0; i < 6; i++){
        try{
            filter(a, i);
        }
        catch(exception& ex){
            cout << "******1번 catch********" << endl;
            cout << "반복문이 중간에 멈췄습니다." << endl;
            cout << "when i =" << i << endl;
            cout << "**********************" << endl;
            throw ex;
        }
    }
}

int main(){
    vector<int> list {10,20,30,40,50};
    try{
        compute(list);
    }
    catch(exception& e){
        cout << "******2번 catch******" << endl;
        cout << "에러가 발생했습니다." << endl;
        cout << e.what() << endl;
        cout << "**********************" << endl;
    }

    cout << "프로그램 종료" << endl;
}


````

````
Output
******1번 catch********
반복문이 중간에 멈췄습니다.
when i =5
**********************
******2번 catch******
에러가 발생했습니다.
std::exception
**********************
프로그램 종료
Program ended with exit code: 0
````
