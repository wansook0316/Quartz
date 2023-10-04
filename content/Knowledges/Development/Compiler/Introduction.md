---
title: Introduction
thumbnail: ''
draft: false
tags:
- compile
- compiler
- interpreter
created: 2023-10-04
---

# 컴파일러

* 소스코드를 타겟 언어와 의미론적으로 동등하게 번역해주는 프로그램
* 어떠한 언어에서 기계어로만 변환하는 것을 부르지 않음
* 예시
  * C 언어 컴파일러 (기계어로 변환)
  * Silicon Compiler
    * 논리 게이트 연산을 수행할 때 쉽게하기 위해 해주는 녀석
* OS Command language
  * 명령어 커맨드를 어휘분석, 구분 분석을 통해서 OS가 이해하는 언어로 변환함
* Query language
  * 쿼리문 자체를 데이터 베이스가 이해하는 언어로 변경해줌

# 컴파일러 언어

* 한번 컴파일이 오래걸림
* 하지만 컴파일 하고나면 실행파일이 생성되기 때문에 그다음부터는 속도가 빠름
* 소스코드가 변경되면 다시 컴파일을 진행해야 함

# 인터프리터 언어

* 소스코드를 구문 분석하고 기계어로 바꾸는 과정은 있으나, 실행파일로 만들지 않음
* 즉, 만드는 과정이 없음
* 그렇기 때문에 상대적으로 라인만을 실행시킬 때는 시간이 적게 걸림
* 하지만 실행파일을 만들지 않기 때문에 해당 작업을 반복적으로 할 경우 당연히 시간이 오래 걸림.

# 소스코드의 변환 과정

![](Pasted%20image%2020231004181259.png)*preprocessors, compilers, assemblers, linkers*

* 소스코드를 가지고 기계어로 바꾸는 과정
* 선행자(Preprocessor)
  * 메크로, 그런 것들은 선행처리를 해서 소스코드로 변경해주는 과정
* 컴파일러
  * 기계어로 번역하는 과정
* 어셈블러
  * 컴퓨터가 이해할 수 있는 Object 파일로 만들어줌
* 링커
  * 라이브러리, 대체가능한 Object 파일과 연결
* 기계언어

# 컴파일러의 과정

* 목적 : 소스코드를 분석하여, 원하는 언어(여기서는 기계 언어)로 매핑해주는 것

![](Pasted%20image%2020231004181235.png)*컴파일러의 단계*

* Scanner(Lexical Analysis)
  * 어휘 분석을 실행함
  * 앞에서 부터 하나씩 읽으면서, 해당 토큰의 의미를 반영함
  * 연산자를 제외한 문자열의 경우에는 Token이라 부름
  * Token은 예약어(if, else, while, do, switch..)와 변수 이름으로 나눌 수 있음
  * Token으로 나누는 것을 tokenizer, 의미를 반영하는 부분을 lexer라고 칭할수도 있을 듯
* Parser
  * 만들어진 결과를 기반으로 트리를 만든다.
  * 그럼 이렇게 만들어진 트리 자체가 어떠한 할당을 의미하는 트리가 된다.
  * 다른 것들도 비슷하게 이런 각각의 구조를 가질 것
  * 예를 들어 100개의 문법이 있다면 [Syntax](https://ko.wikipedia.org/wiki/%EA%B5%AC%EB%AC%B8_(%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D_%EC%96%B8%EC%96%B4))를 가지고 있음
  * 이런 만들어진 트리를 syntax tree라 부름
  * 이러한 syntax tree를 가지고 <mark style='background-color: #fff5b1'> 구분분석 </mark>을 진행함
    * 문법 검토
    * 의미 분석
      * 지금 사진에서 만약에 sample에 보이는 트리중에 `B+C`  이 부분이, 컴파일러가 갖고 있는 syntax tree의 65번째와 구조가 같다면, 65번이 가지는 의미(lhs와 rhs를 더해라)를 알아차릴 수 있다.
  * 이런 것을 `Parsing`이라 부른다.
  * 이렇게 만든 트리를 parse tree라 부른다.
  * 이걸 수행하는 녀석을 parser라 부른다.
* 여기까지의 작업이 <mark style='background-color: #fff5b1'> 분석(이해) </mark> 이라 할 수 있음
* 중간 단계에서 바꿔주는 작업 (합성)
  * 여기서는 중복 코드를 제거해줌

![](Pasted%20image%2020231004181247.png)*전체 과정*

# References

* [Compiler Lec01: Overview](https://www.youtube.com/watch?v=MAG4ten4nAM)
