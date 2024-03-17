---
title: Basic Concept
thumbnail: ''
draft: false
tags:
- C
- preprocessor
- assembly
- identifier
- comments
- keyword
- constant
- variable
- functions
created: 2023-10-03
---

## 프로그램 실행 과정

````mermaid
graph LR
A[원시함수 작성] --> |Compiler|B(오브젝트 파일 생성) 
B-->|Linker|C[실행파일 생성]   
````

* Compiler : 고급 언어로 작성된 파일을 기계어로 번역해줌.
* Linker : 소스코드와 시스템 라이브러리 파일을 연결시킴. 목적 파일 여러개를 연결시켜 실행파일 하나를 생성함.

## 전처리기

````
#include < 헤더파일명.h > // 시스템 헤더파일 
````

* \# : 전처리기 지시자
* .h : 헤더파일
* 시스템(컴파일러)에 있는 헤더파일 사용할 경우 \<\>사용

````
#include " 헤더파일명.h " // 사용자가 만든 헤더파일 
````

* 사용자가 만든 헤더파일일 경우 "" 사용

## 함수 표현

````
int main(void) //자료형 입력 (void)
{
    //함수내용
    return 0; // 0이라는 값을 반환함
}
````

## printf

````
printf("hello world! /n"); ///n은 개행
printf("%s /n", "hello world"); // 서식 문자 사용가능
printf("%s %s /n", "hello", "world"); // 재활용 용이
````

## 주석

````
// 				// 한줄 주석
/* (내용) */ 	   // 여러줄 주석 
````

## 키워드

![](Pasted%20image%2020231003193322.png)

고유된 의미를 갖는 예약된 단어 (예약어)

## 식별자(idenfifier)

키워드 외에 프로그램에서 사용자가 필요에 따라 이름을 만들어 사용하는 단어

=> 규칙이 존재한다.

* 첫글자 숫자 안된다.
* 쓸 수 있는 문자가 제한되어 있다.
* 대소문자 구별
* 키워드 사용불가

## 상수(constant)

* 프로그램의 실행 시작부터 끝날 때까지 값이 변하지 않는 자료
* 문자 한개는 ''로 표시
* 문자열은 ""으로 표시
* 기호 상수(파이 같은) 는 전처리문인 #define을 이용해 상수명과 값을 지정한 후 사용 컴파일 이전에 상수명(PI)를 찾아 모두 값(3.141592)로 단순 치환
* 메모리 상수값을 메모리가 차지한다. 이 값은 상수이므로 값을 변화시킬 수 없다.
* `const double PI = 3.141592`
* 오류 예제

````
#include <stdio.h>

int main(void)
{
	int num1 = 10;
	
	const int num2 = 50;
	
	printf("num1 초기값 :%d\n", num1);
	printf("num2 초기값 :%d\n", num2);
	num1 = 20;
	
	num2 = 30;
	
	printf("num1 새로운값 :%d\n", num1);
	printf("num2 새로운값 :%d\n", num2);
	
	return 0;
}

// Main.c: In function ‘main’:
Main.c:13:7: error: assignment of read-only variable ‘num2’
  num2 = 30;
       ^
````

## 변수(variable)

* 값이 계속 변환될 수 있는 값
* 임시로 자료값을 저장할 수 있는 저장 장소
* 변수에 값을 저장할 수 있고, 이 값은 계속 변경 가능
* 변수 선언을 해야 사용할 수 있음
* 변수의 초기화
  * 선언된 변수에 처음으로 값을 저장
  * `int age; // 이렇게만 선언하면 dummy값이 저장되어 있음`
  * `int age = 20; // 초기에 20이라는 값이 들어감 `
* 변수 동시 선언
  * `int a = 20, int b = 22;`

````
#include <stdio.h>
int main(void)
{
	int num1 = 10, num2;
	
	printf("num1 초기값 : %d\n", num1);
	printf("num2 초기값 : %d\n", num2);
	
	num1 = 20;
	num2 = 30;
	
	printf("num1 새로운 값 : %d\n", num1);
	printf("num2 새로운 값 : %d\n", num2);
	return 0;
}


// 프로세스가 시작되었습니다..
> num1 초기값 : 10
num2 초기값 : 0
num1 새로운 값 : 20
num2 새로운 값 : 30
````
