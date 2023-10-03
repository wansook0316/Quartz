---
title: String library
thumbnail: ''
draft: false
tags:
- cpp
- String
- library
- random
created: 2023-10-03
---

## String library

### method

````c++
#include <string>
#include <iostream>

using namespace std;

int main(){
    
    string word = "good";
    
    word.length();	// 길이 리턴
    word.empty();	// 빈 문자열인지 1, 0값 리턴
    word.clear();	// 문자열 삭제
    
    word += "-bye";	// 더하기 가능
    
    word[0];		// h
    word[word.length() - 1];	// 마지막 단어 i
    
    word.find("a"); 	// 해당 문자열이 없으면 string::npos 리턴
    
    return 0;
}
````

### substr

````c++
string word = "good-bye";
word.substr(2, 5);
````

![](Pasted%20image%2020231003214142.png)

## rand()

rand()는 난수를 발생시키는 함수이다.

하지만 사실 자연적으로 발생하는 랜덤이라는 현상을 컴퓨터 내에서 구성하기는 쉽지 않다.

따라서 이미 저장된 난수표로 부터 이 값들을 불러오게 되는데, 이것을 기반으로 값을 불러오는 것이 `rand()` 이다.

````c++
#include <iostream>
using namespace std;

int main(){
    cout << rand() << endl;
    cout << rand() << endl;
    cout << rand() << endl;
    cout << rand() << endl;
  
    return 0;
}
````

````
// output
41
18467
6334
26500
````

아무런 세팅을 하지 않는다면 기본 저장된 난수표에서 이것을 가져온다. 이 난수표를 세팅하는 것을 seed를 정한다고 하는데, 기본 값은 1이다.

따라서 내가 `rand()` 를 여러번 치더라도 항상 같은 값이 순차적으로 출력될 것이다.

그러면 정말 랜덤은 어떻게 만들 수 있을까? 이 시드값 자체를 계속해서 새로운 값을 넣어주면 된다.

그러면 계속해서 새로운 값을 주는 방법에는 어떤것이 있을까? 이 시드값에 **현재 시간(초)** 를 대입해주는 것이다.

이 때 `ctime library` 를 사용하는데, `time()` 함수를 사용하면, 1970년 1월 1일부터 현재까지의 누적 시간(초)를 반환하기 때문에 프로그램 실행시마다 전혀 새로운 시간값을 입력할 수 있다.

## srand()

이 시드값을 설정할 수 있게 해주는 함수는 `srand()` 이다. (set random) 코드를 만들어보면,

````c++
#include <iostream>
#include <ctime>

using namespace std;

int main(){
    srand((unsigned int)time(0));
    
    cout << rand() << endl;
    cout << rand() << endl;
    cout << rand() << endl;
    cout << rand() << endl;
    
    return 0;
}
````

`srand()` 의 파라미터는 `unsigned int` 타입의 값이다. 그렇기 때문에 반환된 `time()` 의 값을 형변환 해줘야 한다.

### 원하는 범위의 수 얻기

````c++
#include <iostream>
#include <ctime>
using namespace std;

int main(){
    srand((unsigned int)time(0));
    
    // 0 ~ 99 의 난수
    int nRandom0 = rand() % 100;
    
    // 1 ~ 100 의 난수
    int nRandom1 = rand() % 100 + 1;
    
    return 0;
}
````

모듈러 연산을 통해서 원하는 범위의 값을 얻자!

## 성적 계산 후 출력하는 프로그램

1. 데이터 파일로 저장되어 있는 파일을 읽어서
1. 평균을 낸 뒤,
1. 범위에 따라 성적을 산출하는 프로그램을 만든다.

````c++
#include <iostream>
#include <fstream>
#include <iomanip>

using namespace std;

bool getStu(ifstream &fin, int &id, int &exam1, int &exam2, int &exam3){
    fin >> id >> exam1 >> exam2 >> exam3;
    if(!fin)
        return false;
    return true;
}
void calcAvgGrade(int exam1, int exam2, int exam3, int &avg, char &grade){
    avg = (exam1 + exam2 + exam3)/3;
    
    if(avg >= 90)
        grade = 'A';
    else if(avg >= 80)
        grade = 'B';
    else
        grade = 'F';
        
    }
void writeStu(ofstream &fout, int &id, int &avg, char &grade){
    
    fout << setw(4) << id << setw(4) << avg << setw(4) << grade << endl;
    
}


int main(){
    // 파일을 읽고, 각각의 값을 받는데,
    // 파일안에는 id exam1 exam2 exam3 식으로 저장되어 있음
    // 평균 1+ 2 + 3/ 3 grade 계산
    // id avg grade 저장
    
    ifstream fin("ch7STUFL.DAT");
    ofstream fout("output.txt");
    
    int id, exam1, exam2, exam3, avg;
    char grade;
    
    while(getStu(fin, id, exam1, exam2, exam3)){
        calcAvgGrade(exam1, exam2, exam3, avg, grade);
        writeStu(fout, id, avg, grade);
    }
    
    fin.close();
    fout.close();
    
    return 0;
}
````

````
output.txt
  90  90   A
  89  89   B
  81  81   B
  79  79   F
  69  69   F
  60  60   F
  59  59   F
````
