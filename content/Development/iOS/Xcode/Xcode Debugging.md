---
title: Xcode Debugging
thumbnail: ''
draft: false
tags:
- LLVM
- LLDB
- debugging
- xcode
- ios
- compiler
- compile
created: 2023-10-02
---

Xcode에서 디버깅하는 방법을 알아보자.

# Xcode Compiler

 > 
 > 애플의 macOS, iOS, watchOS, tvOS 개발 IDE

* 컴파일러
  * 프론트엔드
    * 어휘 및 구문 분석
    * tokenizer, syntax
    * Clang
      * C, C++, Objective C를 분석함
    * Swift Compiler
      * Swift 컴파일 용도
  * 미들엔드
    * 프로그램의 원래 의미를 유지하면서, 최적화 작업 진행
    * c의 경우 obj 파일에 해당
    * java의 경우 jvm위에서 도는 bytecode
    * LLVM
      * 이전에는 gcc
      * Intermdediate Reperesntation 생성
  * 백엔드
    * 변경된 코드가 타겟 아키텍쳐에서 동작하는 코드로 변환
    * LLVM
      * 바이너리 코드 생성
  * 컴파일러의 경우 지원 언어와 지원 플랫폼에 따라 다양한 버전이 필요하거나, 무거워진다는 단점이 있다.
  * 지원 언어로는 C, C++, Objective-C, Swift, AppleScript, Java, Python, Ruby 등이 있다.

# LLDB

![](Pasted%20image%2020231002134414.png)

 > 
 > LLVM 프로젝트 일환으로 개발된 디버거

LLVM의 Clang 표현, parser, LLVM Deassembler 등을 활용하여 제작되었다. C, C++, Objective-C, Swift 등을 지원한다.

* Thread
  * 실행하는 순서나 흐름을 제어
* Frame
  * 스레드에서 stack 별로 들어가는 단위
  * 간단하게 말하면, 디버깅할 때 왼쪽에 스레드 별로 콜스택을 눌러서 확인할 수 있는데, 이 단위를 frame이라 함
* Disassemble
  * 아키텍쳐에 맞게 변환된 코드를 그나마 읽을 수 있는 코드(어셈블리어)로 바꿔주는 녀석
* Backtrace
  * 실행의 흐름에 따라 콜스택이나 로컬에 쌓이는데 이를 역추적할 수 있는 기능
* Expression
  * LLDB 상에서 변수나 메모리 주소 확인을 위해 사용하는 표현식
* Break point
  * 디버깅하기 위해 표시를 해주는 것
* Watch point
  * 어떤 변수나 메모리가 변할 때 멈추게 해주는 것

## Commands

* C
  * continue
  * 정지된 프로그램 실행 재개
* n
  * next
  * 현재 프레임에서 소스 수준 한단계 진행 (우리가 작성한 코드 라인 의미)
* s
  * step
  * 현재 프레임에서 소스 수준 한단계 내부 진행
* finish
  * 현재 프레임에서 벗어남
* ni
  * 현재 프레임에서 명령어 수준 한단계 진행 (실제 바이러니 명령어 의미)
* si
  * 현재 프레임에서 명령어 수준 한단계 내부 진행

## Variables

* fr v 
  * fr: frame의 약자
  * 현재 프레임의 매개 변수, 지역 변수 출력
* fr v -a (automatic)
  * 현재 프레임의 지역 변수만 출력
* fr v \[변수 이름\]
  * 지역 변수중 해당 변수만 출력
* fr v -f x \[변수 이름\]
  * 해당 변수만 hex로 출력
* fr variable -O self
  * object의 description 출력
* ta v
  * 현재 소스파일에 정의된 전역/정적 변수 출력
* ta v \[변수 이름\]
  * 전역 변수중, 해당 변수만 출력

## Thread

* thread list
  * 현재 스레드 목록 출력
* thread select \[thread number\]
  * 해당 스레드로 이동
* thread until \[code line\]
  * 해당 라인까지 스레드 실행
* thread jump -line \[code line\]
  * 해당 라인으로 스레드 이동
* thread jump -by +/- \[code line\]
  * 해당 라인 수만큼 스레드 이동
* thread return \[return value\]
  * 현재 프레임에서 특정 값 반환

## Disassemble

* di -f
  * 현재 프레임의 함수를 디어셈블
* di -n
  * 해당 함수를 디어셈블
* di -f -m
  * 현재 프레임의 코드에 해당하는 명령어를 코드와 함께 출력
* di -l
  * 현재 프레임의 현재 소스 코드 라인을 디어셈블

## Backtrace

* bt
  * 현재 스레드의 stack trace 출력
* bt all
  * 모든 스레드의 stack trace 출력
* bt \[count\]
  * 현재 스레드의 stack trace를 개수만큼 출력
* up
  * 현재 선택된 프레임에서 위로 이동
* down
  * 현재 선택된 프레임에서 아래로 이동

## Expression

* e
  * 현재 프레임에서 표현식 계산
* p
  * 현재 프레임에서 표현식 계산
* expr \[expression\]
  * LLDB상 변수 선언
* po \[object, variable\]
  * 객체, 변수의 description 출력
* po \[memory address\]
  * 해당 메모리 주소의 값 출력

## Breakpoint

* b \[function name\]
  * 해당 이름을 가진 모든 함수에 Breakpoint 설정 (swift)
* breakpoint set -name \[class name\]
  * 해당 이름을 가진 모든 함수에 breakpoint 설정 (objective-c)
* b \[line count\]
  * 현재 파일의 특정 라인에 breakpoint 설정
* breackpoint modify -c \[condition\]
  * 해당 조건에 대해 breakpoint 설정
* b l
  * breakpoint 목록 출력

## ETC

* wa s v global_var
  * 전역 변수에 watchpoint 설정
* wa s e -\[memory address\]
  * 해당 주소에 watchpoint 설정
* script \[python\]
  * python을 LLDB script로 사용

# Visual Debugging

## View Debugging

* View hierachy
* View Layout
* View Constraints

## Memory Debugging

* 시각적인 메모리 체크
* 각 객체의 참조 관계 표시
* Referenbce cycle등의 확인이 편리하다.

# Profiler

 > 
 > 성능 개선, 최적화 위해 많이 사용

## Memory Profiler

* 메모리 할당 확인 가능
* 메모리 누수 등의 메모리 문제 해결 편리

## Timer Profiler

* 병목 발생 부분 확인 가능
* 함수별 수행시간 프로파일링
* 어떤 메소드에서 수행되었는지 추적 가능

# ETC

* breakpoint에 이름, 조건, 무시 등을 걸 수 있다.
* breakpoint에서 왼쪽 클릭하면 접근 가능

# Reference

* [LLVM](https://ko.wikipedia.org/wiki/LLVM)
* [LLVM 나무위키](https://namu.wiki/w/LLVM)
* [LLVM Official Page](https://llvm.org/)
* [LLDB](https://ko.wikipedia.org/wiki/LLDB)
* [LLDB Project](https://github.com/llvm/llvm-project)
* [command map](https://lldb.llvm.org/use/map.html)
