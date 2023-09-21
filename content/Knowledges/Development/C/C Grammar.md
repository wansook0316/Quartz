---
title: C Grammar
thumbnail: ''
draft: false
tags: null
created: 2023-09-21
---

왜 C를 배워야 하는가?

# C 표준

## C89/ANSI-C

* 최초의 C 표준 (89년)
* 여전히 많은 코드가 이 표준을 사용
* 임베디드 시스템
* **이걸 가장 많이 살펴볼 것임**

## C99

* 많은 내용 추가
* 인라인 함수
* 새로운 헤더파일들
* 새로운 자료형
* 한 줄짜리 주석
* 유연한 배열 멤버
* 가변 길이 배열
* 보다 안전한 I/O 함수

## C11

* C99 대체
* 유니코드 지원
* 이름 없는 구조체 및 공용체
* 제네릭 표현식
* 표준화된 멀티스레딩 지원

## C18

* 신규 기능 없음
* C11의 결함만 수정

# \#include?

* 현대에서 많이 사용하는 import와 같은 구문
* 다른 파일에 구현된 함수나 변수를 사용할 수 있게 해줌
* 하지만 똑똑하게? 찾아주지는 않음
* 사실 `#include`는 전처리기 지시문중 하나임
* 이상한 애임.
* `stdio.h`는 실제 디스크 상에 존재하는 파일 이름임
* 해당 파일을 "포함해줘라" 라는 의미임 (복사하고 #include 라인 지우고 붙여넣기)
  * 사용하지 않는 다른 함수들도 같이 포함됨

![](C_UnmanagedProgramming_01_%08CGrammar_0.png)

## 사용법

````c
#include<stdio.h> /* OK */
#include'stdio.h' /* X */
#include"stdio.h" /* OK 근데 사용하지 말 것. 나중에 얘기해줌*/
````

# stdio.h

* Standard Input and Output
* 표준 입출력, 스트림 입출력
* C 표준 라이브러리 중 일부
  * 문자열 처리
  * 수학 계산
  * 입출력 처리
  * 메모리 관리

# main(void)

* 프로그램의 진입점
* C 코드 빌드해서 나온 실행파일 (.exe, .out)을 실행하면 자동적으로 실행됨
* 반드시 `int`를 반환해야 함
  * 0: 프로그램에 문제가 없었다.
  * 그 외: 오류가 있었다.
* 프로그램 종료 코드 확인하기
  * clang과 같은 프론트엔드 컴파일러로 실행
  * .out 결과 나옴
  * shell: `echo $?`

# 이 과목에서 사용할 clang 명령어

````
clang -std=c89 -W -Wall -pedantic-errors main.c
````

* clang: command line compiler의 표준
* c89: c89 표준으로 컴파일해줘
* -W: 워닝 다 켜주세요
* 빌드시 실행파일은 따로 옵션 안주면 `a.out`임
* -o와 같은 플래그 추가하면 바꿀 수 있음
* 일부러 IDE 사용안함
* 옛날 코드 베이스가 많지 않다, 특정 환경에 맞춰서 사용하기 위한 용도이다.
* 그래서 툴 지원이 좋지 않다.
* 이런 환경에 익숙해져야 한다.
* 이런 것 못하고 C 개발자 하려면 힘들 수 있다.
* 일단 나는 VSCode에 세팅해둠

# 그럼 디버깅 어떻게 하지?

* 한줄 한줄 따라갈 수 있는 능력을 키워야 함
* 하드웨어 하고 밀접함
* 그래서 추상적인게 많지 않음. 그래서 가능함

# main(void): void

* 다른 언어와 달리 `void`를 생략한다고 **매개변수가 없는게 아님**
  * `int main()`
* c에는 함수 선언과 함수 정의가 분리되어 있음
* 함수 선언
  * 여기서 void를 생략하면 **매개 변수를 받는다는 의미**
  * 다만 무엇을 받을지 모름..
* 함수 정의
  * 여기서 생략하면 **매개변수가 없다는 뜻**
* 정리: **매개변수가 없으면 명시적으로 `void`라고 써주자.**
* 그러니까 언제나 void를 선언하는 습관을 가지고 예외적으로 매개변수를 받을 경우 `void`를 지우면 된다.

## 선언 부

````c
int sum(void); // 나 매개변수 없다
int sum();      // 나 매개변수 있어 근데 뭔지 모르겠다
````

## 정의 부

````c
int sum(void) // 매개변수 없음
{

}

int sum(const int num1, const int num2) // 매개변수 2개 있음
{

}
````

# Reference

* [Pocu Academy](https://pocu.academy/ko)
* [Where is my "stdio.h" in Mac?](https://stackoverflow.com/questions/28362994/where-is-my-stdio-h-in-mac)
