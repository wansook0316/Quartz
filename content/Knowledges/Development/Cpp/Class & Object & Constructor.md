---
title: Class & Object & Constructor
thumbnail: ''
draft: false
tags:
- cpp
- class
- constructor
- object
- oop
- instance
- ACL
created: 2023-10-03
---

## What is Class?

우리는 클래스라는 개념을 왜 도입했을까? C++에서 함수가 태어나게 된 이유도 분리해서 관리하기 위함이었다.

그런데 함수로 계속해서 나눠서 하는데 한계가 찾아온 것! 함수에 들어가는 입출 파라미터가 특정 데이터 타입에 연관되어 필요하다는 사실을 알아냈다.

실제로 우리가 어떤 물건을 생각해 보면, 해당 물건(객체)는 물건의 용도에 따라 할 수 있는 행동(method)가 정해져 있다.

따라서 우리는 어떤 객체인지를 밝히고, 그 객체가 할 수 있는 함수를 정의해 놓는 것이 보다 실제적인 접근이다.

이 때 **클래스** 의 개념은 신이 무언가를 만들때 어떻게 만들지 생각해놓은 **설계도** 라 생각하면 된다.

![](Pasted%20image%2020231003214626.png)

## Class 생성 방법

### Member data

실제 세상에 비유하면 물체를 만드는 행위에 해당한다!

해당 클래스를 선언할 때, 기본으로 어떤 값을 가지고서 동작을 할 것인지 정의한다.

### Member function

물체에 대한 행동을 정의하는 부분이다. 함수를 선언하듯 적어주면 된다.

### Private, public

클래스를 만드는 행위는 특정 물체에 대해 설계도를 만드는 것과 동일하므로, 사용자 지향적이어야 한다.

예를 들어 리모컨을 설계한다고 했을 때 사용자는 입력 신호와 출력 결과물만 알면되지, 그 중간에 작용하는 다른 변수에 대해 제어할 필요가 없다.

따라서 클래스를 만드는 설계자 입장에서 클래스 내에서만 작동하는 `private` 구간과 클래스 밖에서 접근가능한 `public` 구간으로 나눠관리할 필요가 있다.

### Constructor

우리가 물건을 떠올리면, 다른 물건들이 세상에는 존재하지만 공통점을 가진다.

예를 들어 리모컨이라 한다면, 보통 10개 정도의 숫자버튼과, 전원버튼 정도가 기본적으로 달려있는 모습을 떠올릴 것이다.

이와 마찬가지로, 사용자가 특정 객체를 사용할 때, **기본적으로 가져야 하는 값**이 존재한다. 그래서 우리는 이걸 설정할 수 있게, 혹은 기본값을 가질 수 있게 만들어 주어야 한다.

이것을 **생성자** 라 한다.

`Public` 밑에 선언을 하고 사용하는데, 이 때 일반적인 함수의 모양과 다르게 `Output` 이 없다. 또한, 사용하는 문법이 조금 다르다! 기억해둘 필요가 있다.

## Example

### Example 1

````c++
#include <iostream>

using namespace std;

class Point {
    
// 클래스를 구성하고 있는 변수를 Member variable 이라 한다.
    
private:    // x, y 변수는 내부에서만 사용되고, 함수로 이 변수를 제어하는 방향으로 코딩하는 것이 좋음.      
    int x;  // 클래스 내부에서만 사용가능
    int y;	

// 클래스를 구성하고 있는 함수를 Member Function(Method) 이라 한다.
public:     // 클래스 외부에서도 사용가능
    		
    void setXY(int _x, int _y) {
        x = _x;
        y = _y;
    }							// pt1.x = 1 과 같이 직접적으로 접근하기보다는 함수로 변경시킨다.
    							// 이렇게 함수를 실행해서 값을 할당해준다.
    
    int getX() {return x;}		// 값을 가져올 때도 이렇게 함수를 만들어서 가져온다.
    int getY() {return y;}
    							
    							// 출력하는 함수도 새로 만들어준다.
    void print(){
        cout << "(" << x << ", " << y << ")" << endl;
    }

};

int main(){

    Point pt1, pt2;				// Point라는 클래스로 부터 객체 2개를 만든다.
//    pt1.x = 1;				// x, y를 public 에서 선언했다면 실행가능한 코드이다.
//    pt1.y = 2;

    pt1.setXY(1, 2);			// 생성된 객체 pt1의 값을 할당한다.
    
    cout <<  pt1.getX() << endl;		// pt1의 x값을 가져와서 출력한다.
    
//    cout << pt1.x << ", " << pt1.y <<endl;		// public 으로 선언했다면 가능한 코드
    pt1.print();						// pt1 값을 출력해라
    pt2.print();

    int temp = pt1.getX();				// 값을 할당하는 방법
    cout << temp << endl;

    return 0;
}
````

### Example 2

````c++
#include <iostream>
#include <string>

using namespace std;

class Account {
private:
    string name;
    string id;
    double balance;
public:
    // constructor
    // 생성자의 이름은 class의 이름과 같다.
    // output이 없다.
    // 초기화를 담당하는 함수 (생성자)
    
    // 아무 것도 입력이 안되었을 때 초기값
    Account():
    	name("초기값이름"), id(0000), balance(0){
    }
    
    // 사용자가 하고 싶은 초기값을 설정하고 싶을 때,
    Account(string _name, string _id, double _bal):
        name(_name), id(_id), balance(_bal){
            
            // 초기화가 진행될 때 동작되는 함수가 들어가는 공간
            // 마이너스 통장하는 게 아니므로 잔고가 음수면 오류를 발생시킨다.
            if (balance < 0){
                cout << "Error, negatice balance" << endl;
                balance = 0;
            }
        }
    
    // Method
    
    // 예금할 때,
    void deposit(int _amt){
        balance += _amt;
    }
    
    // 출금할 때, 잔고보다 출금금액이 많으면 false를 반환
    bool withdraw(int _amt){
        if( balance - _amt < 0)
            return false;
        // 출금이 가능하면 잔고에서 값을 빼고 true 반환
        else{
            balance -= _amt;
            return true;
        }
    }
    
    void print(){
        cout << setw(10) << name << setw(10) << id <<  setw(10) << balance << endl;
    }
    
};


int main(){
    
    Account ac1("최완식", "0316", 5000);
    ac1.print();
    
    ac1.deposit(2000);
    ac1.print();
    
//    ac1.withdraw(3000);
//    ac1.print();
    
    
    if(!ac1.withdraw(10000))
        cout << "잔액 부족" << endl;
    ac1.print();
    
    
    ac1.withdraw(5000);
    ac1.print();
    
    return 0;
}
````

### Example 3

사용자의 계좌정보를 기억하고, 이름별, 아이디별, 잔고별 정렬을 해서 출력해주는 프로그램을 만들어보자. 먼저 설명이 적힌 코드부터 보고 가자.

````c++
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Account{
public:
    std::string name;
    int id;
    double balance;
};

void add_account(std::vector<Account>& accts){
    std::string name;
    int number;
    double amount;
    
    cout << "Enter name, account number, and account balance: ";
    cin >> name >> number >> amount;
    Account acct;
    
    acct.name = name;
    acct.id = number;
    acct.balance = amount;
    accts.push_back(acct);
}


void print_accounts(const std::vector<Account>& accts){
    int n = (unsigned int)accts.size();
    
    for (int i = 0; i < n; i++)
        cout << accts[i].name << ", " << accts[i].id << ", " << accts[i].balance << endl;
}


void swap(Account& er1, Account& er2){
    Account temp = er1;
    er1 = er2;
    er2 = temp;
}

bool less_than_by_name(const Account& e1, const Account& e2){
    return e1.name < e2.name;
}


bool less_than_by_id(const Account& e1, const Account& e2){
    return e1.id < e2.id;
}


bool less_than_by_balance(const Account& e1, const Account& e2){
    return e1.balance < e2.balance;
}


void sort(std::vector<Account>& db, bool (*comp)(const Account&, const Account&)){
    // 참조변수 db로 vector를 가져오고,
    // comp라고 부를 특정 함수의 시작주소를 bool 포인터 변수에 담는다.
    // 그리고 그 시작주소에 있는 함수는
    // Account 자료형을 가지는 변수를 참조해서 가져온 녀석 두개를 입력 파라미터로 받는다.
    
    // db의 총 사이즈를 담아 둔다. 벡터이므로 unsigned int로 받아주어야 한다.
    int size = (unsigned int)db.size();
    
    // 10 크기인 배열이라면, 0~8까지 i는 움직인다.
    for(int i = 0; i < size - 1; i++){
        // 그리고 해당 인덱스가 가장 작은 값이라 가정한다.
        int smallest = i;
        // i의 다음 번째부터 끝까지 하나씩 비교한다.
        for (int j = i + 1; j < size; j++)
            if(comp(db[j], db[smallest]))
                // 비교는 사용자가 어떤 파라미터를 기준으로 비교함에 따라서 달라져야 한다.
                // 여기서 함수포인터를 입력 파라미터로 받은 것이 효과를 발휘한다.
                // 특정 함수에 대해서 가장 작을 것이라고 생각했던 smallest 인덱스의 값과
                // 현재 j인덱스의 값을 비교한다.
                // comp의 후보가 될 수 있는 함수들 
                // (less_than_by_name, less_than_by_id, less_than_by_balance)
                // 의 리턴 값은 모두 boolian 이다.
                // 그리고 두번째 파라미터 값이 클 때, True 이다.
                // 따라서 이 if 문이 실행되기 위해서는 내가 작다고 가정한 smallest 인덱스가
                // j 인덱스 보다 클 때 실행되며, 우리는 smallest 인덱스가 j가 되어야 함을 알 수 있다.
                smallest = j;
        	// 나머지 경우는 smallest 인덱스가 여전히 가장 작은 값을 가지므로 내비두면 된다.
        
        // 만약에 위의 조건문이 실행되었다면
        // smallest가 이전의 인덱스와 달라졌을 것이다.
        // 이때 우리는 실제 i 인텍스에서와 smallest 인덱스의 값을 바꿔줘야 한다.
        if (smallest != i)
            swap(db[i], db[smallest]);
    }
}


int main(){
    // 자료형이 Account 클래스인 벡터를 선언하고 이것의 이름을 customers라 하자.
    std::vector<Account> customers;
    
    char cmd;
    bool done = false;
    
    do{
        cout << "[A]dd [N]ame [I]D [B]alanc [Q]uit ==> ";
        cin >> cmd;
        
        switch(cmd){
            case 'A':
            case 'a':
                add_account(customers);
                break;
            case 'P':
            case 'p':
                print_accounts(customers);
                break;
                
            // 함수이름이 포인터이므로 함수이름자체를 넘겨준다.
            case 'N':
            case 'n':
                sort(customers, less_than_by_name);
                print_accounts(customers);
                break;
            case 'I':
            case 'i':
                sort(customers, less_than_by_id);
                print_accounts(customers);
                break;
            case 'B':
            case 'b':
                sort(customers, less_than_by_balance);
                print_accounts(customers);
                break;
            case 'Q':
            case 'q':
                done = true;
                break;
        }
    }while(!done);
}

````

이제 설명이 없는 코드이다.

````c++
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Account{
public:
    std::string name;
    int id;
    double balance;
    
};

void add_account(std::vector<Account>& accts){
    std::string name;
    int number;
    double amount;
    
    cout << "Enter name, account number, and account balance: ";
    cin >> name >> number >> amount;
    Account acct;
    acct.name = name;
    acct.id = number;
    acct.balance = amount;
    accts.push_back(acct);
}


void print_accounts(const std::vector<Account>& accts){
    int n = (uint32_t)accts.size();
    
    for (int i = 0; i < n; i++)
        cout << accts[i].name << ", " << accts[i].id << ", " << accts[i].balance << endl;
}


void swap(Account& er1, Account& er2){
    Account temp = er1;
    er1 = er2;
    er2 = temp;
}

bool less_than_by_name(const Account& e1, const Account& e2){
    return e1.name < e2.name;
}


bool less_than_by_id(const Account& e1, const Account& e2){
    return e1.id < e2.id;
}


bool less_than_by_balance(const Account& e1, const Account& e2){
    return e1.balance < e2.balance;
}


void sort(std::vector<Account>& db, bool (*comp)(const Account&, const Account&)){
    int size = (uint32_t)db.size();
    
    for(int i = 0; i < size - 1; i++){
        int smallest = i;
        for (int j = i + 1; j < size; j++)
            if(comp(db[j], db[smallest]))
                smallest = j;
        if (smallest != i)
            swap(db[i], db[smallest]);
    }
}


int main(){
    std::vector<Account> customers;
    
    char cmd;
    bool done = false;
    
    do{
        cout << "[A]dd [N]ame [I]D [B]alanc [Q]uit ==> ";
        cin >> cmd;
        
        switch(cmd){
            case 'A':
            case 'a':
                add_account(customers);
                break;
            case 'P':
            case 'p':
                print_accounts(customers);
                break;
            case 'N':
            case 'n':
                sort(customers, less_than_by_name);
                print_accounts(customers);
                break;
            case 'I':
            case 'i':
                sort(customers, less_than_by_id);
                print_accounts(customers);
                break;
            case 'B':
            case 'b':
                sort(customers, less_than_by_balance);
                print_accounts(customers);
                break;
            case 'Q':
            case 'q':
                done = true;
                break;
        }
    }while(!done);
}
````
